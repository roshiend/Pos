import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';

export default class extends NestedForm {
  connect() {
    super.connect();
    console.log('Controller loaded!');
    this.updateAddButtonVisibility();
    
    // Initialize Slim Select on all existing elements
    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSlimSelect(existingSelectElements);

    // Add event listeners for input changes
    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
    });

    // Update delete button visibility
    this.updateDeleteButtonVisibility();
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
      
      // Initialize Slim Select for the new field
      this.initializeSlimSelect(selectElements);
      this.addInputEventListeners(newField);
      this.updateAddButtonVisibility();

      // Update delete button visibility
      this.updateDeleteButtonVisibility();
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
    
    // Initialize Slim Select for the new value field
    this.initializeSlimSelect(selectElements);
    this.addInputEventListeners(wrapper);

    // Update delete button visibility
    this.updateDeleteButtonVisibility();
  }

  removeValue(event) {
    const valueField = event.target.closest('.option-value');
    if (valueField) {
      valueField.querySelector('[name*="[_destroy]"]').value = "1";
      valueField.style.display = 'none';
      this.updateDeleteButtonVisibility();
    }
  }

  updateDeleteButtonVisibility() {
    this.element.querySelectorAll('.product-options-wrapper').forEach((wrapper) => {
      const visibleValues = wrapper.querySelectorAll('.option-value:not([style*="display: none"])');
      visibleValues.forEach((field, index) => {
        const deleteButton = field.querySelector('.delete-value-button');
        if (visibleValues.length > 1) {
          deleteButton.style.display = 'inline';
        } else {
          deleteButton.style.display = 'none';
        }
      });
    });
  }

  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
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

  updateVariants() {
    const option_type_attributes = {};
    Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])')).forEach((field, index) => {
      const optionTypeName = field.querySelector('[name*="[option_types_attributes]"][name*="[name]"]').value;
      const checkedOptions = field.querySelectorAll('[name*="[option_values_attributes]"][name*="[name]"] option:checked');
      let optionValues = [];

      // Collect all checked option values into an array
      Array.from(checkedOptions).forEach(option => {
        optionValues.push(option.value);
      });

      // Store each option type with its corresponding indexed option values
      option_type_attributes[index] = {
        name: optionTypeName,
        option_values_attributes: {
          [index]: { name: optionValues }
        }
      };
    });
    // Make a POST request to the server
    fetch('/create_variants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.getElementsByName('csrf-token')[0].content
      },
      body: JSON.stringify({ option_type_attributes }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Assuming the response is HTML of the partial view
    })
    .then(data => {
      console.log('Variants sent to server:', data);
      // Update the view with the received HTML
      this.element.querySelector('#variants-container').innerHTML = data;
    })
    .catch(error => {
      console.error('Error sending variants to server:', error);
    });
  }

  addInputEventListeners(field) {
    const nameInput = field.querySelector('.product-option-name-select');
    const valuesInput = field.querySelector('.product-option-value-select');

    const handleInputChange = () => {
      const nameValue = nameInput.value.trim();
      const valuesValue = valuesInput.value.trim();
      if (valuesValue !== '') {
        this.updateVariants();
      }
    };

    if (valuesInput) {
      valuesInput.addEventListener('change', handleInputChange);
    } else {
      console.error('Values input not found:', field);
    }
  }
}
