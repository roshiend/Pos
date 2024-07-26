import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';
import JsBarcode from 'jsbarcode';

export default class extends NestedForm {
  connect() {
    super.connect();
    console.log('Controller loaded!');
    this.updateAddButtonVisibility();

    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSlimSelect(existingSelectElements);

    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
    });

    this.updateDeleteButtonVisibility();

    // Add event listener for vendor, shop location, sub-category, and listing type changes
    const vendorSelect = document.querySelector('#vendor-select');
    const shopLocationSelect = document.querySelector('#shop-location-select');
    const subCategorySelect = document.querySelector('#sub-category-select');
    const listingTypeSelect = document.querySelector('#listing-type-select');
    if (vendorSelect) {
      vendorSelect.addEventListener('change', this.updateVariants.bind(this));
    }
    if (shopLocationSelect) {
      shopLocationSelect.addEventListener('change', this.updateVariants.bind(this));
    }
    if (subCategorySelect) {
      subCategorySelect.addEventListener('change', this.updateVariants.bind(this));
    }
    if (listingTypeSelect) {
      listingTypeSelect.addEventListener('change', this.updateVariants.bind(this));
    }

    // Load existing variants if they exist
    const existingVariantsData = this.element.dataset.existingVariants;
    if (existingVariantsData) {
      const existingVariants = JSON.parse(existingVariantsData);
      this.displayExistingVariants(existingVariants);
    }
  }

  initializeSlimSelect(elements) {
    elements.forEach((element) => {
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
    const visibleExistingFieldsCount = this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;

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
      valueField.querySelector('[name*="[_destroy]"]').value = "1";
      valueField.style.display = 'none';
      this.updateDeleteButtonVisibility();
      this.updateVariants();
    }
  }

  updateDeleteButtonVisibility() {
    this.element.querySelectorAll('.product-options-wrapper').forEach((wrapper) => {
      const visibleValues = wrapper.querySelectorAll('.option-value:not([style*="display: none"])');
      visibleValues.forEach((field) => {
        const deleteButton = field.querySelector('.delete-value-button');
        deleteButton.style.display = visibleValues.length > 1 ? 'inline' : 'none';
      });
    });
  }

  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
      wrapper.querySelectorAll('.option-value').forEach((valueField) => {
        valueField.querySelector('[name*="[_destroy]"]').value = "1";
        valueField.style.display = 'none';
      });

      wrapper.querySelector('[name*="[_destroy]"]').value = "1";
      wrapper.style.display = 'none';

      this.updateAddButtonVisibility();
      this.updateVariants();
    }
  }

  updateAddButtonVisibility() {
    const visibleFields = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])'));
    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    addButton.style.display = visibleFields.length < 3 ? 'block' : 'none';
  }

  addInputEventListeners(field) {
    const nameInput = field.querySelector('.product-option-name-select');
    const valuesInput = field.querySelector('.product-option-value-select');

    const handleInputChange = () => {
      this.updateVariants();
    };

    if (valuesInput) {
      valuesInput.addEventListener('change', handleInputChange);
    }

    if (nameInput) {
      nameInput.addEventListener('change', handleInputChange);
    }
  }

  updateSubCategories(event) {
    const categoryId = event.target.value;
    const subCategorySelect = document.querySelector('#sub-category-select');
    
    if (categoryId) {
      // Fetch sub-categories based on the selected category
      fetch(`/categories/${categoryId}/sub_categories`)
        .then(response => response.json())
        .then(subCategories => {
          // Clear existing options
          subCategorySelect.innerHTML = '';
          // Add a prompt option
          subCategorySelect.insertAdjacentHTML('beforeend', '<option value="">Select Sub-Category</option>');
          // Add new sub-category options
          subCategories.forEach(subCategory => {
            subCategorySelect.insertAdjacentHTML('beforeend', `<option value="${subCategory.id}" data-code="${subCategory.code}">${subCategory.value}</option>`);
          });
        });
    } else {
      subCategorySelect.innerHTML = '<option value="">Select Sub-Category</option>';
    }
  }

  updateVariants() {
    const storedValues = this.storeCurrentVariantValues();

    const optionTypes = [];
    this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').forEach((wrapper) => {
      const optionType = wrapper.querySelector('.product-option-name-select').value;
      const optionValues = Array.from(wrapper.querySelectorAll('.product-option-value-select option:checked')).map(option => option.value).filter(value => value);

      if (optionType && optionValues.length > 0) {
        optionTypes.push({ type: optionType, values: optionValues });
      }
    });

    const variants = this.generateVariants(optionTypes);
    this.displayVariants(variants, storedValues);
  }

  storeCurrentVariantValues() {
    const storedValues = {};
    this.element.querySelectorAll('.variant').forEach((variant, index) => {
      const sku = variant.querySelector(`input[name="product[variants_attributes][${index}][sku]"]`).value;
      const price = variant.querySelector(`input[name="product[variants_attributes][${index}][price]"]`).value;
      storedValues[index] = { sku, price };
    });
    return storedValues;
  }

  generateVariants(optionTypes) {
    if (optionTypes.length === 0) return [];
  
    const customCartesianProduct = (arrays) => {
      if (arrays.length === 0) return [];
  
      const [first, ...rest] = arrays;
      const restProduct = customCartesianProduct(rest);
  
      if (restProduct.length === 0) {
        return first.map(value => [value]);
      }
  
      const result = [];
      for (let i = 0; i < restProduct.length; i++) {
        for (let j = 0; j < first.length; j++) {
          result.push([first[j], ...restProduct[i]]);
        }
      }
  
      return result;
    };
  
    const arrays = optionTypes.map(optionType => optionType.values);
    return customCartesianProduct(arrays);
  }

  displayVariants(variants, storedValues = {}) {
    const container = this.element.querySelector('#variants-container');
    container.innerHTML = '';
  
    const vendorId = document.querySelector('#vendor-select').value;
    const shopLocationId = document.querySelector('#shop-location-select').value;
    const subCategorySelect = document.querySelector('#sub-category-select');
    const subCategoryId = subCategorySelect.value;
    const subCategoryOption = subCategorySelect.querySelector(`option[value="${subCategoryId}"]`);
    const listingTypeId = document.querySelector('#listing-type-select').value;

    const vendor = window.Vendor.find(v => v.id === parseInt(vendorId));
    const shopLocation = window.ShopLocation.find(sl => sl.id === parseInt(shopLocationId));
    const subCategoryCode = subCategoryOption ? subCategoryOption.getAttribute('data-code') : '';
    const listingType = window.ListingType.find(lt => lt.id === parseInt(listingTypeId));

    if (!vendor || !shopLocation || !subCategoryCode || !listingType) {
      console.error('Vendor, shop location, sub-category, or listing type is not selected or missing code.');
      return;
    }

    const vendorCode = vendor.code;
    const shopLocationCode = shopLocation.code;
    const listingTypeCode = listingType.code;

    const table = document.createElement('table');
    table.className = 'table table-bordered';
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Options</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Barcode</th>
      </tr>`;
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
  
    variants.forEach((variant, index) => {
      const [option1, option2, option3] = variant;
      const storedValue = storedValues[index] || { sku: '', price: '' };
  
      // Generate SKU based on vendor code, listing type code, and option values
      const sku = this.generateSku(vendorCode, option1, option2, option3, index + 1); // index + 1 to start sequence from 1
      // Generate the barcode
      const sequenceCode = String(index + 1).padStart(7, '0'); // pad with leading zeros to make it 7 characters
      const barcode = this.generateBarcode(vendorCode, shopLocationCode, sequenceCode, listingTypeCode);
      // Generate extra text for above the barcode
      const extraText = `Vendor: ${vendorCode} - ${variant.join(' / ')}`;
  
      const row = document.createElement('tr');
      row.className = 'variant';
      row.innerHTML = `
        <td>${variant.join(' / ')}</td>
        <td>
          <input type="hidden" name="product[variants_attributes][${index}][option1]" value="${option1 || ''}">
          <input type="hidden" name="product[variants_attributes][${index}][option2]" value="${option2 || ''}">
          <input type="hidden" name="product[variants_attributes][${index}][option3]" value="${option3 || ''}">
          <input type="text" name="product[variants_attributes][${index}][sku]" class="form-control sku-input" value="${sku}">
        </td>
        
        <td>
          <input type="text" name="product[variants_attributes][${index}][price]" class="form-control" value="${storedValue.price}">
        </td>
        <td>
          <div>${extraText}</div>
          <svg id="barcode-${index}"></svg>
        </td>`;
      tbody.appendChild(row);

      // Generate and display the barcode
      requestAnimationFrame(() => {
        JsBarcode(`#barcode-${index}`, barcode, {
          format: "CODE128",
          lineColor: "black",
          width: 2,
          height: 40,
          displayValue: true
        });
      });
    });
  
    table.appendChild(tbody);
    container.appendChild(table);

    // Add event listeners to SKU input fields for barcode regeneration
    this.addSkuEventListeners();
  }

  generateSku(vendorCode, option1, option2, option3, sequence) {
    // Customize this function as per your SKU generation logic
    const baseCode = `${vendorCode}`;
    const option1Code = option1 ? `-${option1}` : '';
    const option2Code = option2 ? `-${option2}` : '';
    const option3Code = option3 ? `-${option3}` : '';
    const sequenceCode = `-${String(sequence).padStart(3, '0')}`; // pad sequence with leading zeros
    return `${baseCode}${option1Code}${option2Code}${option3Code}${sequenceCode}`.toUpperCase();
  }

  generateBarcode(vendorCode, shopLocationCode, sequenceCode, listingTypeCode) {
    // Customize this function as per your Barcode generation logic
    return `${vendorCode}-${shopLocationCode}-${sequenceCode}-${listingTypeCode}`.toUpperCase();
  }

  addSkuEventListeners() {
    const skuInputs = this.element.querySelectorAll('.sku-input');
    skuInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        const sku = input.value;
        JsBarcode(`#barcode-${index}`, sku, {
          format: "CODE128",
          lineColor: "black",
          width: 2,
          height: 40,
          displayValue: true
        });
      });
    });
  }
  
  displayExistingVariants(existingVariants) {
    console.log("Existing Variants:", existingVariants);  // Add this line
    const storedValues = {};
    existingVariants.forEach((variant, index) => {
        storedValues[index] = { sku: variant.sku, price: variant.price };
    });
    this.displayVariants(existingVariants.map(v => [v.option1, v.option2, v.option3]), storedValues);
  }
}
