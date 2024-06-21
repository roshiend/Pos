import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';

export default class extends NestedForm {
  static targets = ["template", "container", "valueTemplate", "valueContainer"];

  connect() {
    super.connect();
    console.log('Controller loaded!');
    this.updateAddButtonVisibility();

    const existingSelectElements = this.element.querySelectorAll('.product-option-value-select, .product-option-name-select');
    this.initializeSlimSelect(existingSelectElements);

    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
    });
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

  addOption(event) {
    event.preventDefault();
    const templateContent = this.templateTarget.innerHTML;

    const visibleExistingFieldsCount = this.containerTarget.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;

    if (visibleExistingFieldsCount < 3) {
      const newIndex = visibleExistingFieldsCount;
      const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);

      this.containerTarget.insertAdjacentHTML('beforeend', newTemplateContent);

      const newField = this.containerTarget.lastElementChild;
      const selectElements = newField.querySelectorAll('.product-option-value-select, .product-option-name-select');
      this.initializeSlimSelect(selectElements);
      this.addInputEventListeners(newField);

      this.updateAddButtonVisibility();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }

  addValue(event) {
    event.preventDefault();
    const button = event.target;
    const optionTypeWrapper = button.closest('.option-type');
    const valueContainer = optionTypeWrapper.querySelector('[data-product-options-target="valueContainer"]');
    const templateContent = this.valueTemplateTarget.innerHTML;

    const newIndex = new Date().getTime();
    const newTemplateContent = templateContent.replace(/NEW_RECORD/g, newIndex);

    valueContainer.insertAdjacentHTML('beforeend', newTemplateContent);

    const newField = valueContainer.lastElementChild.querySelector('.product-option-value-select');
    this.initializeSlimSelect([newField]);
  }

  removeOption(event) {
    event.preventDefault();
    const wrapper = event.target.closest('.product-options-wrapper');

    if (wrapper) {
      wrapper.querySelector('[name*="[_destroy]"]').value = "1";
      wrapper.style.display = 'none';

      this.updateAddButtonVisibility();
      this.updateVariants();
    }
  }

  updateAddButtonVisibility() {
    const visibleFields = Array.from(this.containerTarget.querySelectorAll('.product-options-wrapper:not([style*="display: none"])'));

    const addButton = this.element.querySelector('[data-action="product-options#addOption"]');
    addButton.style.display = visibleFields.length < 3 ? 'block' : 'none';
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

  updateVariants() {
    const option_type_attributes = {};
    Array.from(this.containerTarget.querySelectorAll('.product-options-wrapper:not([style*="display: none"])')).forEach((field, index) => {
      const optionTypeName = field.querySelector('[name*="[option_types_attributes]"][name*="[name]"]').value;
      const checkedOptions = field.querySelectorAll('[name*="[option_values_attributes]"][name*="[name]"] option:checked');
      let optionValues = [];

      Array.from(checkedOptions).forEach(option => {
        optionValues.push(option.value);
      });

      option_type_attributes[index] = {
        name: optionTypeName,
        option_values_attributes: {
          [index]: { name: optionValues }
        }
      };
    });

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
      return response.text();
    })
    .then(data => {
      console.log('Variants sent to server:', data);
      this.element.querySelector('#variants-container').innerHTML = data;
    })
    .catch(error => {
      console.error('Error sending variants to server:', error);
      alert('An error occurred while updating variants. Please try again.');
    });
  }
}
