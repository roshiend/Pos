import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';
import JsBarcode from 'jsbarcode';

export default class extends NestedForm {
  // Map to store the arrays of selected values for each option_value field
  selectedFieldMap = new Map();

  // Array to track the order of option_value fields based on when selections are made
  fieldOrder = [];

  connect() {
    super.connect();
    console.log('Controller loaded!');
    this.updateAddButtonVisibility();
    //this.updateOptionTypePositions(); // Ensure existing pre-selected option_types have their positions set correctly

    this.lastProductId = parseInt(this.element.dataset.lastProductId, 10) || 0;
    this.currentProductId = this.element.dataset.currentProductId ? String(this.element.dataset.currentProductId).padStart(7, '0') : null;

    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSlimSelect(existingSelectElements);

    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
    });

    

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
      const timestamp = Date.now(); // Gets the current timestamp in milliseconds
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, timestamp);

      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);
      const newField = this.targetTarget.lastElementChild;
      const selectElements = newField.querySelectorAll('.product-option-value-select, .product-option-name-select');

      this.initializeSlimSelect(selectElements);
      this.addInputEventListeners(newField);
      this.updateAddButtonVisibility();
      
      this.updateVariants();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }

  

  
  

  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
      // Mark the option type as destroyed
      wrapper.querySelectorAll('.option-value').forEach((valueField) => {
        valueField.querySelector('[name*="[_destroy]"]').value = "1";
        valueField.style.display = 'none';
      });

      wrapper.querySelector('[name*="[_destroy]"]').value = "1";
      wrapper.style.display = 'none';

      // Update positions of the remaining option types
     // this.updateOptionTypePositions();

      // Re-evaluate the visibility of the add button and update variants
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
      const id = variant.querySelector(`input[name="product[variants_attributes][${index}][id]"]`)?.value;
      const sku = variant.querySelector(`input[name="product[variants_attributes][${index}][sku]"]`).value;
      const price = variant.querySelector(`input[name="product[variants_attributes][${index}][price]"]`).value;
      storedValues[index] = { id, sku, price };
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

    let productId;
    if (this.currentProductId) {
      productId = this.currentProductId;
    } else {
      productId = String(this.lastProductId + 1).padStart(7, '0');
    }

    const vendorId = document.querySelector('#vendor-select').value;
    const shopLocationId = document.querySelector('#shop-location-select').value;
    const subCategorySelect = document.querySelector('#sub-category-select');
    const subCategoryId = subCategorySelect.value;
    const subCategoryOption = subCategorySelect.querySelector(`option[value="${subCategoryId}"]`);
    const listingTypeId = document.querySelector('#listing-type-select').value;

    const vendor = window.Vendor.find(v => v.id === parseInt(vendorId));
    const shopLocation = window.ShopLocation.find(sl => sl.id === parseInt(shopLocationId));
    const subCategoryCode = subCategoryOption ? subCategoryOption.getAttribute('data-code') : '';
    const subCategoryText = subCategoryOption ? subCategoryOption.textContent : '';
    const listingType = window.ListingType.find(lt => lt.id === parseInt(listingTypeId));

    if (!vendor || !shopLocation || !listingType) {
      console.error('Vendor, shop location, or listing type is not selected.');
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
        <th>Select</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    variants.forEach((variant, index) => {
      const [option1, option2, option3] = variant;
      const storedValue = storedValues[index] || { sku: '', price: '', id: ''}; // Include id here if it exists

      const sku = this.generateSku(vendorCode, option1, option2, option3, index + 1);

      const sequenceCode = String(index + 1).padStart(3, '0'); // pad with leading zeros to make it 3 characters

      const barcode = this.generateBarcode(shopLocationCode, productId, sequenceCode, listingTypeCode);
      const extraText = `${vendorCode} - ${variant.join(' / ')}`;
      const subCategoryExtraText = subCategoryId ? subCategoryText : '';

      const row = document.createElement('tr');
      row.className = 'variant';
      row.innerHTML = `
        <td contenteditable="true" class="variant-option">${variant.join(' / ')}</td>
        <td>
           <input type="hidden" name="product[variants_attributes][${index}][id]" value="${storedValue.id}">
          <input type="hidden" name="product[variants_attributes][${index}][option1]" value="${option1 || ''}">
          <input type="hidden" name="product[variants_attributes][${index}][option2]" value="${option2 || ''}">
          <input type="hidden" name="product[variants_attributes][${index}][option3]" value="${option3 || ''}">
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
      tbody.appendChild(row);

      requestAnimationFrame(() => {
        const barcodeElement = document.querySelector(`#barcode-${index}`);
        const barcode = this.generateBarcode(shopLocationCode, productId, sequenceCode, listingTypeCode);

        JsBarcode(barcodeElement, barcode, {
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

    });

    table.appendChild(tbody);
    container.appendChild(table);

    this.addSkuEventListeners();
  }

  generateSku(vendorCode, option1, option2, option3, sequence) {
    const baseCode = `${vendorCode}`;
    const option1Code = option1 ? `-${option1}` : '';
    const option2Code = option2 ? `-${option2}` : '';
    const option3Code = option3 ? `-${option3}` : '';
    const sequenceCode = `-${String(sequence).padStart(3, '0')}`; // pad sequence with leading zeros
    return `${baseCode}${option1Code}${option2Code}${option3Code}${sequenceCode}`.toUpperCase();
  }

  generateBarcode(shopLocationCode, productId, sequenceCode, listingTypeCode) {
    return `${shopLocationCode}${productId}${sequenceCode}${listingTypeCode}`.toUpperCase();
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
    console.log("Existing Variants:", existingVariants);
    const storedValues = {};
    existingVariants.forEach((variant, index) => {
      storedValues[index] = {
        id: variant.id,  // Include the id here
        sku: variant.sku,
        price: variant.price
      };
    });
    this.displayVariants(existingVariants.map(v => [v.option1, v.option2, v.option3]), storedValues);
  }

  bulkUpdateVariants(actionType, value) {
    const selectedVariants = this.element.querySelectorAll('.variant-checkbox:checked');

    selectedVariants.forEach((checkbox) => {
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
}
