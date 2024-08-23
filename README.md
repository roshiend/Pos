import NestedForm from 'stimulus-rails-nested-form'
import SlimSelect from 'slim-select'
export default class extends NestedForm {
  
  connect() {
    super.connect()
    console.log('Controller loaded !')
    // Initialize Slim Select on existing elements
    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSlimSelect(existingSelectElements);
  }
  initializeSlimSelect(elements) {
    elements.forEach((element) => {
      new SlimSelect({
        select: element,
        placeholder: "Select Something..",
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
      //const newIndex = visibleExistingFieldsCount;
      const timestamp = Date.now(); // Gets the current timestamp in milliseconds
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, timestamp);
  
      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);

      const newField = this.targetTarget.lastElementChild;
      // Initialize Slim Select for the new field
      const selectElements = newField.querySelectorAll('.product-option-value-select, .product-option-name-select');
      this.initializeSlimSelect(selectElements);
      this.updateAddButtonVisibility();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }
  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
      // Mark the option_type for destruction
      const destroyField = wrapper.querySelector('[name*="[_destroy]"]');
      if (destroyField) {
        destroyField.value = '1';
      }
  
      // Also mark any nested option_values for destruction
      const optionValueDestroyFields = wrapper.querySelectorAll('[name*="option_values_attributes"][name*="[_destroy]"]');
      optionValueDestroyFields.forEach(field => {
        field.value = '1';
      });
  
      // Hide the fieldset (but it will still be submitted with _destroy = 1)
      wrapper.style.display = 'none';
      this.updateAddButtonVisibility();
    }
  }
  

  updateAddButtonVisibility() {
    const visibleFields = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])'));
    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    addButton.style.display = visibleFields.length < 3 ? 'block' : 'none';
      
  }
  
  

  
    
} 