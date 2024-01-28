import NestedForm from 'stimulus-rails-nested-form'

export default class extends NestedForm {
  
  connect() {
    super.connect()
    console.log('Controller loaded !')
    this.updateAddButtonVisibility();
  }
  
  // Define an action for the "add" event
  add() {
    const templateContent = this.templateTarget.innerHTML;
  
    // Count the number of existing fields
    const existingFieldsCount = this.element.querySelectorAll('.product-options-wrapper').length;
    

    // Check if adding a new field will exceed the limit (in this case, 3)
    if (existingFieldsCount < 3) {
      // Replace NEW_RECORD with the appropriate index for the new field
      const newIndex = existingFieldsCount;
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);
  
      // Append the new field to the target without replacing existing content
      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);
  
      // Recalculate the field count and update button visibility
      this.updateAddButtonVisibility();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }
  

  // Define an action for the "remove" event
  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
  
    if (wrapper) {
      // Mark the field for destruction by setting _destroy to 1
      wrapper.querySelector('[name*="[_destroy]"]').value = '1';
      
      // Remove the field from the DOM
      wrapper.style.display = 'none'; 
      //wrapper.remove();
  
      // Recalculate the field count and update button visibility
      this.updateAddButtonVisibility();
    }
  }
  
  // Recalculate the field count and update the "Add Option" button visibility
  updateAddButtonVisibility() {
    const visibleFields = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])'));
  
    // Toggle the visibility of the "Add Option" button based on the field count
    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    addButton.style.display = visibleFields.length < 3 ? 'block' : 'none';
  
    // Recalculate the indices of the nested fields and update labels
    this.recalculateNestedFieldIndices();
  }
  

  // Recalculate the indices of the nested fields and update labels
  recalculateNestedFieldIndices() {
    const fields = this.element.querySelectorAll('.product-options-wrapper');
  
    fields.forEach((field, index) => {
      // Update the nested field indices in the field
      field.querySelectorAll('[name*="product_options_attributes"]').forEach(input => {
        input.name = input.name.replace(/\[(\d+)\]/, `[${index}]`);
      });
  
      // Update labels with the correct index
      field.querySelectorAll('label[for*="product_options_attributes"]').forEach(label => {
        label.htmlFor = label.htmlFor.replace(/\[(\d+)\]/, `[${index}]`);
      });
  
      // Update IDs with the correct index
      field.querySelectorAll('[id*="product_options_attributes"]').forEach(element => {
        element.id = element.id.replace(/\[(\d+)\]/, `[${index}]`);
      });
  
       // Update the ID for the _destroy hidden_field
       const destroyHiddenField = field.querySelector('[name*="[_destroy]"]');
       if (destroyHiddenField) {
         destroyHiddenField.id = destroyHiddenField.id.replace(/_(\d+)_/, `_${index}_`);
       }
    });
  }
  
  
    
} 