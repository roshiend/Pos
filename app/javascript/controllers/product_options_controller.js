
import NestedForm from 'stimulus-rails-nested-form'

export default class extends NestedForm {
  
  connect() {
    super.connect()
    console.log('Controller loaded !')
    this.updateAddButtonVisibility();
     // Add event listeners for input changes
    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
    });
  }
  
  // Define an action for the "add" event
  add() {
    const templateContent = this.templateTarget.innerHTML;
  
    // Count the number of visible and existing fields
    const visibleExistingFieldsCount = this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;
  
    // Check if adding a new field will exceed the limit (in this case, 3)
    if (visibleExistingFieldsCount < 3) {
      // Replace NEW_RECORD with the appropriate index for the new field
      const newIndex = visibleExistingFieldsCount;
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);
  
      // Append the new field to the target without replacing existing content
      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);
       // Add event listeners for the new input fields
        const newField = this.targetTarget.lastElementChild;
        this.addInputEventListeners(newField);
  
      // Recalculate the field count and update button visibility
      this.updateAddButtonVisibility();
      // Recalculate the Cartesian product and update variants in real-time
      this.updateVariants();

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
      this.updateVariants();
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

  updateVariants() {
    // Collect input values from existing product options
    const options = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])')).map(field => {
      return {
        name: field.querySelector('[name*="[product_option_name]"]').value,
        values: field.querySelector('[name*="[product_option_values]"]').value.split(',').map(value => value.trim())
      };
    });

    // Generate Cartesian product
    const cartesianProduct = this.generateCartesianProduct(options);

    // Display variants in real-time (you may need to customize this part based on your UI)
    this.displayVariants(cartesianProduct);
  }
  generateCartesianProduct(options) {
    // Check if there are no options or only one option
    if (options.length === 0 || options.some(option => option.values.length === 0)) {
      return [];
    }
  
    // Use nested loops to generate the Cartesian product
    const cartesianProduct = options.reduce((acc, option) => {
      const currentOptionValues = option.values.map(value => ({ [option.name]: value }));
  
      return acc.length === 0
        ? currentOptionValues
        : acc.flatMap(combination => currentOptionValues.map(value => ({ ...combination, ...value })));
    }, []);
  
    return cartesianProduct;
  }
  
  displayVariants(cartesianProduct) {
    // Assuming you have a container to display the variants, you might need to customize this part based on your UI
    const variantsContainer = document.getElementById('variants-container');
  
    // Clear existing variants
    variantsContainer.innerHTML = '';
  
    // Create and append elements for each variant
    cartesianProduct.forEach((variant, index) => {
      const variantElement = document.createElement('div');
      variantElement.innerHTML = `<p>Variant ${index + 1}: ${JSON.stringify(variant)}</p>`;
      variantsContainer.appendChild(variantElement);
    });
  }

  addInputEventListeners(field) {
    const nameInput = field.querySelector('[name*="[product_option_name]"]');
    const valuesInput = field.querySelector('[name*="[product_option_values]"]');
  
    nameInput.addEventListener('input', () => {
      this.updateVariants();
    });
  
    valuesInput.addEventListener('input', () => {
      this.updateVariants();
    });
  }
  
  
  

  
  
  
    
} 