import SlimSelect from 'slim-select';
import NestedForm from 'stimulus-rails-nested-form';

export default class extends NestedForm {
  static targets = ["optionTemplate", "variantsContainer", "variantTemplate", "option"];

  connect() {
    this.element.querySelectorAll('.product-options-wrapper').forEach((field) => {
      this.addInputEventListeners(field);
    });

    this.updateVariants(); // Initial call to generate variants based on existing selections
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

  // Adds a new option field set
  addOption() {
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
      this.updateVariants();
    } else {
      console.log('Maximum number of fields reached.');
    }
  }


  // Removes an option field set and its associated variants
  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
      wrapper.querySelectorAll('.option-value').forEach((valueField) => {
        valueField.querySelector('[name*="[_destroy]"]').value = "1";
        valueField.style.display = 'none';
      });

      wrapper.querySelector('[name*="[_destroy]"]').value = "1";
      wrapper.style.display = 'none';
      this.updateVariants();
    }
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
    const options = [];
    this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').forEach((wrapper) => {
      const name = wrapper.querySelector('.product-option-name-select').value;
      const selectedOptions = Array.from(wrapper.querySelectorAll('.product-option-value-select option:checked')).map(option => option.value).filter(value => value);
      if (name && selectedOptions.length > 0) {
        options.push(selectedOptions);
        console.log(options);
      }
    });
    
    const combinations = this.generateOptionCombinations(options);

    // Clear current variants
    this.variantsContainerTarget.innerHTML = '';

    combinations.forEach((combination) => {
      const variant = document.importNode(this.variantTemplateTarget.content, true);
      this.applyCombinationToVariant(variant, combination);
      this.variantsContainerTarget.appendChild(variant);
    });
  }

  generateOptionCombinations(options) {
    if (options.length === 0) return [];
  
    return options.reduce((acc, curr) => {
      // Accumulator starts with [[]], so it can correctly build up combinations
      return acc.flatMap(accItem => curr.map(currItem => accItem.concat([currItem])));
    }, [[]]);
  }
  
  

  

  applyCombinationToVariant(variant, combination) {
    const option1 = variant.querySelector('[data-option1="true"]');
    const option2 = variant.querySelector('[data-option2="true"]');
    const option3 = variant.querySelector('[data-option3="true"]');

    if (option1) option1.value = combination[0] || '';
    if (option2) option2.value = combination[1] || '';
    if (option3) option3.value = combination[2] || '';

    const variantName = variant.querySelector('.variant-name');
    if (variantName) {
      variantName.textContent = combination.filter(Boolean).join(' / ');
    }
  }
}
