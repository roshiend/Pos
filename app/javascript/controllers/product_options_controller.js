import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';

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

  // generateVariants(optionTypes) {
  //   if (optionTypes.length === 0) return [];

  //   const generateCombinations = (arrays, prefix = []) => {
  //     if (arrays.length === 0) return [prefix];

  //     const [first, ...rest] = arrays;
  //     const result = [];
  //     first.forEach(value => {
  //       result.push(...generateCombinations(rest, [...prefix, value]));
  //     });

  //     return result;
  //   };

  //   const arrays = optionTypes.map(optionType => optionType.values);
  //   console.log(generateCombinations(arrays));
  //   return generateCombinations(arrays);
    
  // }
  // generateVariants(optionTypes) {
  //   if (optionTypes.length === 0) return [];
  
  //   const generateCombinations = (arrays, prefix = []) => {
  //     if (arrays.length === 0) return [prefix];
  
  //     const [first, ...rest] = arrays;
  //     const result = [];
      
  //     // First iterate through the rest arrays to create combinations
  //     const restCombinations = generateCombinations(rest, prefix);
      
  //     // Then append each element of the first array to the combinations
  //     restCombinations.forEach(combination => {
  //       first.forEach(value => {
  //         result.push([...combination, value]);
  //       });
  //     });
  
  //     return result;
  //   };
  
  //   const arrays = optionTypes.map(optionType => optionType.values);
  //   return generateCombinations(arrays);
  // }
  
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

    const table = document.createElement('table');
    table.className = 'table table-bordered';
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Options</th>
        <th>SKU</th>
        <th>Price</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    variants.forEach((variant, index) => {
      const [option1, option2, option3] = variant;
      const storedValue = storedValues[index] || { sku: '', price: '' };

      const row = document.createElement('tr');
      row.className = 'variant';
      row.innerHTML = `
        <td>${variant.join(' / ')}</td>
        <td>
          <input type="hidden" name="product[variants_attributes][${index}][option1]" value="${option1 || ''}">
          <input type="hidden" name="product[variants_attributes][${index}][option2]" value="${option2 || ''}">
          <input type="hidden" name="product[variants_attributes][${index}][option3]" value="${option3 || ''}">
          <input type="text" name="product[variants_attributes][${index}][sku]" class="form-control" value="${storedValue.sku}">
        </td>
        <td>
          <input type="text" name="product[variants_attributes][${index}][price]" class="form-control" value="${storedValue.price}">
        </td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
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