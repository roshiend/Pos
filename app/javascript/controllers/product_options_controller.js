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
  
  add() {
    const templateContent = this.templateTarget.innerHTML;
  
    const visibleExistingFieldsCount = this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;
  
    if (visibleExistingFieldsCount < 3) {
      const newIndex = visibleExistingFieldsCount;
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);
  
      this.targetTarget.insertAdjacentHTML('beforeend', newTemplateContent);

      const newField = this.targetTarget.lastElementChild;
      this.addInputEventListeners(newField);
  
      this.updateAddButtonVisibility();
      //this.updateVariants();
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
    const product_options = Array.from(this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])')).map(field => {
      return {
        product_option_name: field.querySelector('[name*="[product_option_name]"]').value,
        product_option_values: field.querySelector('[name*="[product_option_values]"]').value.split(',').map(value => value.trim())
      };
    });

    // Make a POST request to the server
    fetch('/products/create_variants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.getElementsByName('csrf-token')[0].content
      },
      body: JSON.stringify({ product_options }),
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
    const nameInput = field.querySelector('[name*="[product_option_name]"]');
    const valuesInput = field.querySelector('[name*="[product_option_values]"]');

    const handleInputChange = () => {
        const nameValue = nameInput.value.trim();
        const valuesValue = valuesInput.value.trim();
        this.updateVariants();
        // // Check if at least one of name or values is not empty before triggering the update
        // if (nameValue !== '' || valuesValue !== '') {
        //     this.updateVariants();
        // }
    };

    nameInput.addEventListener('input', handleInputChange);
    valuesInput.addEventListener('input', handleInputChange);
}


}
