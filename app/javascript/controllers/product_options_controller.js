import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';
import JsBarcode from 'jsbarcode';

export default class extends NestedForm {
  connect() {
    super.connect();
    console.log('Controller loaded!');
    this.initializeVariables();
    this.initializeSlimSelects();
    this.initializeEventListeners();
    this.loadExistingVariants();
  }

  initializeVariables() {
    this.lastProductId = parseInt(this.element.dataset.lastProductId, 10) || 0;
    this.currentProductId = this.element.dataset.currentProductId ? String(this.element.dataset.currentProductId).padStart(7, '0') : null;
    this.positionCounter = 1;
    this.variantPositions = new Map();
  }

  initializeSlimSelects() {
    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSlimSelect(existingSelectElements);
  }

  initializeEventListeners() {
    const variantSelectors = ['#vendor-select', '#shop-location-select', '#sub-category-select', '#listing-type-select'];
    variantSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('change', this.updateVariants.bind(this));
      }
    });

    this.element.querySelectorAll('.product-options-wrapper').forEach(field => {
      this.addInputEventListeners(field);
    });

    this.updateAddButtonVisibility();
    this.updateDeleteButtonVisibility();
  }

  loadExistingVariants() {
    const existingVariantsData = this.element.dataset.existingVariants;
    if (existingVariantsData) {
      const existingVariants = JSON.parse(existingVariantsData);
      this.displayExistingVariants(existingVariants);
    }
  }

  initializeSlimSelect(elements) {
    elements.forEach(element => {
      new SlimSelect({
        select: element,
        placeholder: "Select",
        allowDeselect: true,
        multiple: true,
        showSearch: false,
        hideSelectedOption: true
      });
    });
  }

  add() {
    const templateContent = this.templateTarget.innerHTML;
    const visibleExistingFieldsCount = this.getVisibleFieldsCount();

    if (visibleExistingFieldsCount < 3) {
      const newIndex = visibleExistingFieldsCount;
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);

      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);
      const newField = this.targetTarget.lastElementChild;
      const selectElements = newField.querySelectorAll('.product-option-value-select, .product-option-name-select');

      this.initializeSlimSelect(selectElements);
      this.addInputEventListeners(newField);
      this.updateAddButtonVisibility();
      this.updateDeleteButtonVisibility();
      this.updateVariants();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }

  addValue(event) {
    const button = event.target;
    const wrapper = button.closest('.product-options-wrapper');
    const valueContainer = wrapper.querySelector('[data-product-options-target="valueContainer"]');
    const valueTemplate = wrapper.querySelector('[data-product-options-target="valueTemplate"]').innerHTML;

    const existingValueFields = valueContainer.querySelectorAll('.option-value:not([style*="display: none"])');
    const newValueIndex = existingValueFields.length;

    const newValueContent = valueTemplate.replace(/NEW_VALUE_RECORD/g, newValueIndex);
    valueContainer.insertAdjacentHTML('beforeend', newValueContent);

    const newField = valueContainer.lastElementChild;
    const selectElements = newField.querySelectorAll('.product-option-value-select');

    this.initializeSlimSelect(selectElements);
    this.addInputEventListeners(newField);
    this.updateDeleteButtonVisibility();
    this.updateVariants();
  }

  removeValue(event) {
    const valueField = event.target.closest('.option-value');
    if (valueField) {
      this.hideAndMarkForDestruction(valueField);
      this.updateDeleteButtonVisibility();
      this.updateVariants();
    }
  }

  updateDeleteButtonVisibility() {
    this.element.querySelectorAll('.product-options-wrapper').forEach(wrapper => {
      const visibleValues = wrapper.querySelectorAll('.option-value:not([style*="display: none"])');
      visibleValues.forEach(field => {
        const deleteButton = field.querySelector('.delete-value-button');
        deleteButton.style.display = visibleValues.length > 1 ? 'inline' : 'none';
      });
    });
  }

  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
      wrapper.querySelectorAll('.option-value').forEach(valueField => {
        this.hideAndMarkForDestruction(valueField);
      });

      this.hideAndMarkForDestruction(wrapper);
      this.updateAddButtonVisibility();
      this.updateVariants();
    }
  }

  updateAddButtonVisibility() {
    const visibleFields = this.getVisibleFieldsCount();
    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    addButton.style.display = visibleFields < 3 ? 'block' : 'none';
  }

  addInputEventListeners(field) {
    const nameInput = field.querySelector('.product-option-name-select');
    const valuesInput = field.querySelector('.product-option-value-select');

    const handleInputChange = this.throttle(() => {
      this.updateVariants();
    }, 200);

    if (valuesInput) {
      valuesInput.addEventListener('change', handleInputChange);
    }

    if (nameInput) {
      nameInput.addEventListener('change', handleInputChange);
    }
  }

  updateVariants() {
    const storedValues = this.storeCurrentVariantValues();
    const optionTypes = this.getSelectedOptions();
    const variants = this.generateCombinations(optionTypes);

    this.displayVariants(variants, storedValues);
  }

  storeCurrentVariantValues() {
    const storedValues = {};
    this.element.querySelectorAll('.variant').forEach((variant, index) => {
      const id = variant.querySelector(`input[name="product[variants_attributes][${index}][id]"]`)?.value;
      const sku = variant.querySelector(`input[name="product[variants_attributes][${index}][sku]"]`).value;
      const price = variant.querySelector(`input[name="product[variants_attributes][${index}][price]"]`).value;
      const position = parseInt(variant.querySelector(`input[name="product[variants_attributes][${index}][position]"]`).value, 10);
      storedValues[index] = { id, sku, price, position };
    });
    return storedValues;
  }

  getSelectedOptions() {
    const selectedOptions = [];
    this.element.querySelectorAll('.product-options-wrapper').forEach((wrapper) => {
      const optionName = wrapper.querySelector('.product-option-name-select').value;
      const selectedValues = Array.from(wrapper.querySelector('.product-option-value-select').selectedOptions)
        .map(option => ({
          value: option.value,
        }));

      if (optionName && selectedValues.length > 0) {
        selectedOptions.push({
          name: optionName,
          values: selectedValues,
        });
      }
    });

    console.log("Selected options:", selectedOptions);
    return selectedOptions;
  }
  generateCombinations(options) {
    if (options.length === 0) return [];

    const combinations = options.reduce((acc, option) => {
      if (acc.length === 0) {
        return option.values.map(value => {
          const variantKey = `${option.name}:${value.value}`;
          let position = this.variantPositions.get(variantKey);
          if (!position) {
            position = this.positionCounter++;
            this.variantPositions.set(variantKey, position);
          }
          const combination = [{ name: option.name, value: value.value, position }];
          console.log("Generated combination:", combination);
          return combination;
        });
      } else {
        return acc.flatMap(combination =>
          option.values.map(value => {
            const existingKey = combination.map(v => `${v.name}:${v.value}`).join(' / ');
            const newCombinationKey = `${existingKey} / ${option.name}:${value.value}`;
            let position = this.variantPositions.get(existingKey) || this.variantPositions.get(newCombinationKey);
            if (!position) {
              position = this.positionCounter++;
              this.variantPositions.set(newCombinationKey, position);
            }
            const newCombination = combination.concat({ name: option.name, value: value.value, position });
            console.log("Generated combination:", newCombination);
            return newCombination;
          })
        );
      }
    }, []);

    console.log("Final combinations with positions:", combinations);

    return combinations;
  }

  displayVariants(variants, storedValues = {}) {
    const container = this.element.querySelector('#variants-container');
    container.innerHTML = '';
    
    const productId = this.currentProductId || String(this.lastProductId + 1).padStart(7, '0');
    const { vendorCode, shopLocationCode, listingTypeCode, subCategoryText } = this.getVariantContext();
  
    if (!vendorCode || !shopLocationCode || !listingTypeCode) {
      console.error('Vendor, shop location, or listing type is not selected.');
      return;
    }
  
    // Sort the variants array by the position attribute in ascending order
    const sortedVariants = variants.sort((a, b) => a[0].position - b[0].position);
  
    const table = this.createVariantsTable();
    const tbody = table.querySelector('tbody');
  
    sortedVariants.forEach((variantCombination, index) => {
      const variantNames = variantCombination.map(v => v.value);
      const [option1, option2, option3] = variantNames;
      const position = variantCombination[0].position;  // Directly take the position from the generated combination
      const storedValue = storedValues[index] || { sku: '', price: '', id: '', position: position };
      const sku = this.generateSku(vendorCode, option1, option2, option3, index + 1);
      const sequenceCode = String(index + 1).padStart(3, '0');
      const barcode = this.generateBarcode(shopLocationCode, productId, sequenceCode, listingTypeCode);
      const extraText = `${vendorCode} - ${variantNames.join(' / ')}`;
      const subCategoryExtraText = subCategoryText || '';
  
      const row = this.createVariantRow(variantCombination, storedValue, sku, barcode, extraText, subCategoryExtraText, index);
      tbody.appendChild(row);
  
      this.renderBarcode(`#barcode-${index}`, barcode, row);
    });
  
    container.appendChild(table);
    this.addSkuEventListeners();
  }
  
  

  createVariantsTable() {
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Position</th>
          <th>Options</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Barcode</th>
          <th>Select</th>
        </tr>
      </thead>
      <tbody></tbody>`;
    return table;
  }

  createVariantRow(variant, storedValue, sku, barcode, extraText, subCategoryExtraText, index) {
    const row = document.createElement('tr');
    row.className = 'variant';
    row.innerHTML = `
      <td>
        <input type="hidden" name="product[variants_attributes][${index}][id]" value="${storedValue.id}">
        <input type="number" name="product[variants_attributes][${index}][position]" class="form-control position-input" value="${storedValue.position}" readonly>
      </td>
      <td contenteditable="true" class="variant-option">${variant.map(v => v.value).join(' / ')}</td>
      <td>
        <input type="text" name="product[variants_attributes][${index}][sku]" class="form-control sku-input" value="${sku}">
      </td>
      <td>
        <input type="text" name="product[variants_attributes][${index}][price]" class="form-control price-input" value="${storedValue.price}">
      </td>
      <td>
        <div>${extraText}</div>
        <div style="text-align: right;">${subCategoryExtraText}</div>
        <svg id="barcode-${index}"></svg>
      </td>
      <td>
        <input type="checkbox" class="variant-checkbox">
      </td>`;
    return row;
  }

  renderBarcode(selector, barcode, row) {
    requestAnimationFrame(() => {
      JsBarcode(document.querySelector(selector), barcode, {
        format: "CODE128",
        lineColor: "black",
        width: 2,
        height: 40,
        displayValue: true
      });

      const barcodeInput = row.querySelector('.barcode-input');
      if (barcodeInput) {
        barcodeInput.value = barcode;
      }
    });
  }

  generateSku(vendorCode, option1, option2, option3, sequence) {
    const baseCode = `${vendorCode}`;
    const optionCodes = [option1, option2, option3].filter(Boolean).map(opt => `-${opt}`).join('');
    const sequenceCode = `-${String(sequence).padStart(3, '0')}`;
    return `${baseCode}${optionCodes}${sequenceCode}`.toUpperCase();
  }

  generateBarcode(shopLocationCode, productId, sequenceCode, listingTypeCode) {
    return `${shopLocationCode}${productId}${sequenceCode}${listingTypeCode}`.toUpperCase();
  }

  getVariantContext() {
    const vendorSelect = document.querySelector('#vendor-select');
    const shopLocationSelect = document.querySelector('#shop-location-select');
    const subCategorySelect = document.querySelector('#sub-category-select');
    const listingTypeSelect = document.querySelector('#listing-type-select');

    const vendor = window.Vendor.find(v => v.id === parseInt(vendorSelect.value));
    const shopLocation = window.ShopLocation.find(sl => sl.id === parseInt(shopLocationSelect.value));
    const listingType = window.ListingType.find(lt => lt.id === parseInt(listingTypeSelect.value));
    const subCategoryOption = subCategorySelect.querySelector(`option[value="${subCategorySelect.value}"]`);

    return {
      vendorCode: vendor?.code || '',
      shopLocationCode: shopLocation?.code || '',
      listingTypeCode: listingType?.code || '',
      subCategoryText: subCategoryOption ? subCategoryOption.textContent : ''
    };
  }

  addSkuEventListeners() {
    const skuInputs = this.element.querySelectorAll('.sku-input');
    skuInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        const sku = input.value;
        this.renderBarcode(`#barcode-${index}`, sku, input.closest('.variant'));
      });
    });
  }

  displayExistingVariants(existingVariants) {
    console.log("Existing Variants:", existingVariants);
    const storedValues = {};
    existingVariants.forEach((variant, index) => {
      storedValues[index] = { 
        id: variant.id, 
        sku: variant.sku, 
        price: variant.price,
        position: variant.position || index + 1
      };
    });
    this.displayVariants(existingVariants.map(v => [v.option1, v.option2, v.option3]), storedValues);
  }

  bulkUpdateVariants(actionType, value) {
    const selectedVariants = this.element.querySelectorAll('.variant-checkbox:checked');

    selectedVariants.forEach(checkbox => {
      const variantRow = checkbox.closest('.variant');
      switch(actionType) {
        case 'price':
          variantRow.querySelector('.price-input').value = value;
          break;
        case 'sku-prefix':
          const existingSku = variantRow.querySelector('.sku-input').value;
          variantRow.querySelector('.sku-input').value = `${value}-${existingSku}`;
          break;
      }
    });
  }

  hideAndMarkForDestruction(element) {
    element.querySelector('[name*="[_destroy]"]').value = "1";
    element.style.display = 'none';
  }

  getVisibleFieldsCount() {
    return this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;
  }

  throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  }
}
