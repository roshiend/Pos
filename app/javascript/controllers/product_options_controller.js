import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';

export default class extends NestedForm {
  static MAX_FIELDS = 3;  // Define a constant for max fields

  connect() {
    super.connect();
    console.log('Controller loaded!');

    // Initialize SlimSelect and Tagify on existing elements
    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSelectElements(existingSelectElements);

    this.updateAddButtonVisibility();

    // Add event listeners for input changes on all product option wrappers
    this.element.querySelectorAll('.product-options-wrapper').forEach((field, index) => {
      this.addInputEventListeners(field, index);
    });
  }

  initializeSelectElements(elements) {
    elements.forEach((element) => {
      if (element.classList.contains('product-option-value-select')) {
        // Initialize Tagify for product-option-value-select with freeform tagging
        new Tagify(element, {
          enforceWhitelist: false,  // Allow any value to be added
          maxTags: 10,  // Optional: limit the number of tags
          dropdown: {
            enabled: 0 // Disable dropdown entirely
          },
          // Ensure that only plain values (strings) are stored
          transformTag: function(tagData) {
            return tagData.value;
          },
          originalInputValueFormat: function(valuesArr) {
            // Submit the tags as a comma-separated string
            return valuesArr.map(item => item.value).join(',');
          }
        });
      } else if (element.classList.contains('product-option-name-select')) {
        // Initialize SlimSelect for the product-option-name-select dropdown
        new SlimSelect({
          select: element,
          placeholder: "Select Something...",
          allowDeselect: true,
          showSearch: true,
          hideSelectedOption: true,
        });
      }
    });
  }

  add() {
    const templateContent = this.templateTarget.innerHTML;
    const visibleExistingFieldsCount = this.getVisibleFieldsCount();

    if (visibleExistingFieldsCount < this.constructor.MAX_FIELDS) {
      const newIndex = visibleExistingFieldsCount;
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);

      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);

      const newField = this.targetTarget.lastElementChild;
      // Initialize Tagify and SlimSelect for the new field
      const selectElements = newField.querySelectorAll('.product-option-value-select, .product-option-name-select');
      this.initializeSelectElements(selectElements);
      this.addInputEventListeners(newField, newIndex);

      this.updateAddButtonVisibility();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }

  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');

    if (wrapper) {
      wrapper.querySelector('[name*="[_destroy]"]').value = '1';
      wrapper.style.display = 'none';

      this.updateAddButtonVisibility();
    }
  }

  updateAddButtonVisibility() {
    const visibleFields = this.getVisibleFieldsCount();
    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    
    addButton.style.display = visibleFields < this.constructor.MAX_FIELDS ? 'block' : 'none';
  }

  addInputEventListeners(field, index) {
    const nameInput = field.querySelector('.product-option-name-select');
    const valuesInput = field.querySelector('.product-option-value-select');

    if (valuesInput && valuesInput.tagify) {
      valuesInput.addEventListener('input', () => this.handleInputChange(valuesInput));
    }

    if (nameInput) {
      nameInput.addEventListener('change', () => this.handleInputChange(nameInput));
    }
  }

  handleInputChange(inputElement) {
    if (inputElement.tagify) {
      const selectedValues = inputElement.tagify.value.map(tag => tag.value);
      console.log('Selected Tagify values:', selectedValues);
    } 
  }

  getVisibleFieldsCount() {
    return this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;
  }
}
