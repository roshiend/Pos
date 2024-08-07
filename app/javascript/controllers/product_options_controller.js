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
    this.selectionOrder = {}; // Track the order of selected option values
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
      this.populateSelectionOrderFromExistingVariants(existingVariants);
      this.displayExistingVariants(existingVariants);
    }
  }

  populateSelectionOrderFromExistingVariants(existingVariants) {
    this.selectionOrder = {}; // Reset the selection order

    existingVariants.forEach(variant => {
      const optionTypes = ['option1', 'option2', 'option3'];

      optionTypes.forEach((optionType, index) => {
        const optionValue = variant[optionType];

        if (optionValue) {
          if (!this.selectionOrder[optionType]) {
            this.selectionOrder[optionType] = [];
          }

          if (!this.selectionOrder[optionType].includes(optionValue)) {
            this.selectionOrder[optionType].push(optionValue);
          }
        }
      });
    });
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
      valuesInput.addEventListener('change', (event) => {
        this.storeSelectionOrder(event.target);
        handleInputChange();
      });
    }

    if (nameInput) {
      nameInput.addEventListener('change', handleInputChange);
    }
  }

  storeSelectionOrder(selectElement) {
    const wrapper = selectElement.closest('.product-options-wrapper');
    const optionType = wrapper.querySelector('.product-option-name-select').value;

    if (!this.selectionOrder) {
      this.selectionOrder = {};
    }

    if (!this.selectionOrder[optionType]) {
      this.selectionOrder[optionType] = [];
    }

    const selectedValues = Array.from(selectElement.options)
      .filter(option => option.selected)
      .map(option => option.value);

    // Update selection order by adding new values at the end
    selectedValues.forEach(value => {
      if (!this.selectionOrder[optionType].includes(value)) {
        this.selectionOrder[optionType].push(value);
      }
    });

    // Remove any deselected values from the selection order
    this.selectionOrder[optionType] = this.selectionOrder[optionType].filter(value => selectedValues.includes(value) || this.existingVariantsInclude(value));
  }

  existingVariantsInclude(value) {
    const existingVariants = this.element.dataset.existingVariants ? JSON.parse(this.element.dataset.existingVariants) : [];
    return existingVariants.some(variant => Object.values(variant).includes(value));
  }

  updateVariants() {
    const storedValues = this.storeCurrentVariantValues();
    const optionTypes = this.getOptionTypes();
    const variants = this.generateVariants(optionTypes);

    this.displayVariants(variants, storedValues);
  }

  storeCurrentVariantValues() {
    const storedValues = {};
    this.element.querySelectorAll('.variant').forEach((variant, index) => {
      const id = variant.querySelector(`input[name="product[variants_attributes][${index}][id]"]`)?.value;
      const sku = variant.querySelector(`input[name="product[variants_attributes][${index}][sku]"]`).value;
      const price = variant.querySelector(`input[name="product[variants_attributes][${index}][price]"]`).value;
      storedValues[index] = { id, sku, price };
    });
    return storedValues;
  }

  getOptionTypes() {
    const optionTypes = [];
    this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').forEach(wrapper => {
      const optionType = wrapper.querySelector('.product-option-name-select').value;
      const selectedValues = this.selectionOrder[optionType] || [];

      if (optionType && selectedValues.length > 0) {
        optionTypes.push({ type: optionType, values: selectedValues });
      }
    });
    return optionTypes;
  }

  generateVariants(optionTypes) {
    if (optionTypes.length === 0) return [];
    return this.customCartesianProduct(optionTypes.map(optionType => optionType.values));
  }

  customCartesianProduct(arrays) {
    if (arrays.length === 0) return [];

    const [first, ...rest] = arrays;
    const restProduct = this.customCartesianProduct(rest);

    if (restProduct.length === 0) {
      return first.map(value => [value]);
    }

    const result = [];
    for (let i = 0; i < first.length; i++) {
      for (let j = 0; j < restProduct.length; j++) {
        result.push([first[i], ...restProduct[j]]);
      }
    }

    return result;
  }

  displayVariants(variants, storedValues = {}) {
    const container = this.element.querySelector('#variants-container');
    container.innerHTML = '';  // Clear the container before inserting new variants

    const productId = this.currentProductId || String(this.lastProductId + 1).padStart(7, '0');
    const { vendorCode, shopLocationCode, listingTypeCode, subCategoryText } = this.getVariantContext();

    if (!vendorCode || !shopLocationCode || !listingTypeCode) {
      console.error('Vendor, shop location, or listing type is not selected.');
      return;
    }

    const table = this.createVariantsTable();
    const tbody = table.querySelector('tbody');

    variants.forEach((variant, index) => {
      const [option1, option2, option3] = variant;
      const storedValue = storedValues[index] || { sku: '', price: '', id: '' };
      const sku = this.generateSku(vendorCode, option1, option2, option3, index + 1);
      const sequenceCode = String(index + 1).padStart(3, '0');
      const barcode = this.generateBarcode(shopLocationCode, productId, sequenceCode, listingTypeCode);
      const extraText = `${vendorCode} - ${variant.join(' / ')}`;
      const subCategoryExtraText = subCategoryText || '';

      const row = this.createVariantRow(variant, storedValue, sku, barcode, extraText, subCategoryExtraText, index);
      tbody.appendChild(row);

      this.renderBarcode(`#barcode-${index}`, barcode, row);
    });

    container.appendChild(table);  // Append the table to the container after processing all variants
    this.addSkuEventListeners();
  }

  createVariantsTable() {
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    table.innerHTML = `
      <thead>
        <tr>
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
      <td contenteditable="true" class="variant-option">${variant.join(' / ')}</td>
      <td>
        <input type="hidden" name="product[variants_attributes][${index}][id]" value="${storedValue.id}">
        <input type="hidden" name="product[variants_attributes][${index}][option1]" value="${variant[0] || ''}">
        <input type="hidden" name="product[variants_attributes][${index}][option2]" value="${variant[1] || ''}">
        <input type="hidden" name="product[variants_attributes][${index}][option3]" value="${variant[2] || ''}">
        <input type="hidden" name="product[variants_attributes][${index}][barcode]" class="barcode-input">
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
        price: variant.price 
      };
    });

    // Generate option arrays from existing data
    const optionArrays = existingVariants.map(v => [v.option1, v.option2, v.option3]);

    // Ensure option arrays are unique and in the correct order
    const uniqueOptions = [...new Set(optionArrays.map(JSON.stringify))].map(JSON.parse);

    // Now, display the variants based on the order
    this.displayVariants(uniqueOptions, storedValues);
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
