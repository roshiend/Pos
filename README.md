// app/javascript/controllers/product_options_controller.js

import NestedForm from 'stimulus-rails-nested-form';

export default class extends NestedForm {
  connect() {
    super.connect();
    console.log('Controller loaded!');
    this.updateAddButtonVisibility();

    // Add event listeners for input changes
    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
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

  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');

    if (wrapper) {
      // Mark the field for destruction by setting _destroy to 1
      wrapper.querySelector('[name*="[_destroy]"]').value = '1';

      // Remove the field from the DOM
      wrapper.style.display = 'none';

      // Recalculate the field count and update button visibility
      this.updateAddButtonVisibility();
      this.updateVariants();
    }
  }

  updateAddButtonVisibility() {
    const visibleFields = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])'));

    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    addButton.style.display = visibleFields.length < 3 ? 'block' : 'none';

    this.recalculateNestedFieldIndices();
  }

  recalculateNestedFieldIndices() {
    const fields = this.element.querySelectorAll('.product-options-wrapper');

    fields.forEach((field, index) => {
      field.querySelectorAll('[name*="product_options_attributes"]').forEach(input => {
        input.name = input.name.replace(/\[(\d+)\]/, `[${index}]`);
      });

      field.querySelectorAll('label[for*="product_options_attributes"]').forEach(label => {
        label.htmlFor = label.htmlFor.replace(/\[(\d+)\]/, `[${index}]`);
      });

      field.querySelectorAll('[id*="product_options_attributes"]').forEach(element => {
        element.id = element.id.replace(/\[(\d+)\]/, `[${index}]`);
      });

      const destroyHiddenField = field.querySelector('[name*="[_destroy]"]');
      if (destroyHiddenField) {
        destroyHiddenField.id = destroyHiddenField.id.replace(/_(\d+)_/, `_${index}_`);
      }
    });
  }

  updateVariants() {
    const options = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])')).map(field => {
      return {
        name: field.querySelector('[name*="[product_option_name]"]').value,
        values: field.querySelector('[name*="[product_option_values]"]').value.split(',').map(value => value.trim())
      };
    });

    const cartesianProduct = this.generateCartesianProduct(options);

    this.sendVariantsToServer(cartesianProduct);
  }

  sendVariantsToServer(cartesianProduct) {
    fetch('/products/create_variants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.getElementsByName('csrf-token')[0].content
      },
      body: JSON.stringify({ variants: cartesianProduct })
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
  

  generateCartesianProduct(options) {
    if (options.length === 0 || options.some(option => option.values.length === 0)) {
      return [];
    }

    const cartesianProduct = options.reduce((acc, option) => {
      const currentOptionValues = option.values.map(value => ({ [option.name]: value }));

      return acc.length === 0
        ? currentOptionValues
        : acc.flatMap(combination => currentOptionValues.map(value => ({ ...combination, ...value })));
    }, []);

    return cartesianProduct;
  }
}
