
import SlimSelect from 'slim-select';
import NestedForm from 'stimulus-rails-nested-form';

export default class extends NestedForm {
  static targets = ["optionTemplate", "variantsContainer", "variantTemplate", "option"];

  connect() {
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


  // Adds a new option field set
  add() {
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
      this.generateVariants(); 
    } else {
      console.log('Maximum number of fields reached.');
    }
  }

  // Removes an option field set and its associated variants
  remove(event) {
    const wrapper = event.target.closest('.product-options-wrapper');
    if (wrapper) {
      // Mark the option type as destroyed
      wrapper.querySelectorAll('.option-value').forEach((valueField) => {
        valueField.querySelector('[name*="[_destroy]"]').value = "1";
        valueField.style.display = 'none';
      });

      wrapper.querySelector('[name*="[_destroy]"]').value = "1";
      wrapper.style.display = 'none';

      // Update positions of the remaining option types
     // this.updateOptionTypePositions();
     this.generateVariants(); 
    
    }
  }

  // Adds a new variant field set
  addVariant() {
    const template = this.variantTemplateTarget.content.cloneNode(true);
    const timestamp = new Date().getTime();

    template.querySelectorAll("input").forEach((element) => {
      element.name = element.name.replace(/TEMPLATE_RECORD/g, timestamp);
      element.id = element.id.replace(/TEMPLATE_RECORD/g, timestamp);
    });

    this.variantsContainerTarget.appendChild(template);
  }

   // Removes a variant field set
   removeVariant(event) {
    const variantFields = event.target.closest(".variant-fields");
    const destroyField = variantFields.querySelector('input[name*="_destroy"]');

    if (destroyField) {
      destroyField.value = "1"; // Mark variant for destruction
      variantFields.style.display = "none"; // Hide the variant fields
    } else {
      variantFields.remove(); // Remove the new variant from the DOM
    }
  }


  // Generates all possible combinations of variants based on the current options
  generateVariants() {
    let optionNames = [];
    let optionValues = [];
    this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').forEach((wrapper) => {
      const name = wrapper.querySelector('.product-option-name-select').value;
      const values = Array.from(wrapper.querySelectorAll('.product-option-value-select option:checked')).map(option => option.value).filter(value => value);
  
      if (name && values.length > 0) {
        optionNames.push(name);
        optionValues.push(values);
        console.log(optionValues);
      }
    });

    this.createVariantCombinations(optionNames, optionValues);
    
  }
  addInputEventListeners(field) {
    const nameInput = field.querySelector('.product-option-name-select');
    const valuesInput = field.querySelector('.product-option-value-select');

    const handleInputChange = () => {
      
      this.generateVariants();
    };

    if (valuesInput) {
      valuesInput.addEventListener('change', handleInputChange);
    }

    if (nameInput) {
      nameInput.addEventListener('change', handleInputChange);
    }
  }

 
  



  // Creates variant field sets based on combinations of the option values
  createVariantCombinations(optionNames, optionValues) {
    const variantsContainer = this.variantsContainerTarget;
    variantsContainer.innerHTML = ""; // Clear existing variants
  
    if (optionValues.length === 0) return;
  
    const combinations = this.generateCombinations(optionValues);
  
    combinations.forEach((combination, index) => {
      const template = this.variantTemplateTarget.content.cloneNode(true);
      const timestamp = new Date().getTime() + index;
  
      // Assuming optionNames corresponds to option1, option2, option3 in the template
      template.querySelector("input[name*='[option1]']").value = combination[0] || "";
      template.querySelector("input[name*='[option2]']").value = combination[1] || "";
      template.querySelector("input[name*='[option3]']").value = combination[2] || "";
  
      template.querySelectorAll("input").forEach((element) => {
        element.name = element.name.replace(/TEMPLATE_RECORD/g, timestamp);
        element.id = element.id.replace(/TEMPLATE_RECORD/g, timestamp);
      });
  
      variantsContainer.appendChild(template);
    });
  }
  

  // Recursively generates all combinations of the given arrays of option values
  generateCombinations(arrays, prefix = []) {
    if (!arrays.length) return [prefix];

    const result = [];

    for (let value of arrays[0]) {
      result.push(...this.generateCombinations(arrays.slice(1), [...prefix, value]));
    }

    return result;
  }
}