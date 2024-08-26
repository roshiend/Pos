import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';

export default class extends NestedForm {
  static targets = ["optionTemplate", "variantsContainer", "variantTemplate", "option"];

  connect() {
    // Generate initial combinations when the controller connects
    this.generateVariants();
    
  }

  // Adds a new option field set
  addOption() {
    const template = this.optionTemplateTarget.content.cloneNode(true);
    const timestamp = new Date().getTime();

    template.querySelectorAll("input").forEach((element) => {
      element.name = element.name.replace(/TEMPLATE_RECORD/g, timestamp);
    });

    this.element.querySelector('.options-container').appendChild(template);
  }

  // Removes an option field set and its associated variants
  removeOption(event) {
    const optionFields = event.target.closest(".option-fields");
    const destroyField = optionFields.querySelector('input[name*="_destroy"]');

    if (destroyField) {
      destroyField.value = "1"; // Mark option for destruction
      optionFields.style.display = "none"; // Hide the option fields
    } else {
      optionFields.remove(); // Remove the new option from the DOM
    }

    this.generateVariants(); // Re-generate variant combinations after option removal
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
    const optionFields = this.element.querySelectorAll('.option-fields');
    let optionNames = [];
    let optionValues = [];

    optionFields.forEach((field) => {
      const name = field.querySelector('input[name*="[name]"]').value;
      const values = field.querySelector('input[name*="[value]"]').value.split(',');

      if (name && values.length > 0) {
        optionNames.push(name);
        optionValues.push(values);
      }
    });

    this.createVariantCombinations(optionNames, optionValues);
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

      template.querySelectorAll("input").forEach((element, idx) => {
        element.name = element.name.replace(/TEMPLATE_RECORD/g, timestamp);
        element.value = combination[idx]; // Assign the combination values to the fields
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
