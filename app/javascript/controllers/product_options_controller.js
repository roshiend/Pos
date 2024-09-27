import NestedForm from 'stimulus-rails-nested-form';
import SlimSelect from 'slim-select';

export default class extends NestedForm {
  static MAX_FIELDS = 3;

  connect() {
    super.connect();
    console.log('Controller loaded!');

    // Initialize SlimSelect only for name select elements
    const nameSelectElements = this.element.querySelectorAll('.product-option-name-select');
    this.initializeSlimSelect(nameSelectElements);

    this.updateAddButtonVisibility();

    this.element.querySelectorAll('.product-options-wrapper').forEach((field, index) => {
      this.addInputEventListeners(field, index);
    });
  }

  initializeSlimSelect(elements) {
    elements.forEach((element) => {
      new SlimSelect({
        select: element,
        placeholder: "Select Something..",
        allowDeselect: true,
        showSearch: true,
        hideSelectedOption: true
      });
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
      const nameSelectElements = newField.querySelectorAll('.product-option-name-select');
      this.initializeSlimSelect(nameSelectElements);

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
    const valueInput = field.querySelector('.product-option-value-text'); // Text field for product options

    this.addChangeListener(nameInput);
    this.addTaggingListener(valueInput); // Use a new method for handling tagging
  }

  addChangeListener(inputElement) {
    if (inputElement) {
      inputElement.addEventListener('input', () => {
        console.log(`Field updated (${inputElement.className}): ${inputElement.value}`);
      });
    }
  }

  // Updated method to handle tagging and only add a comma after a full value
  addTaggingListener(inputElement) {
    if (inputElement) {
      inputElement.addEventListener('keydown', (event) => {
        // Listen for comma or Enter key to consider the tag finished
        if (event.key === 'Enter' || event.key === ',') {
          event.preventDefault(); // Prevents new line (Enter) or extra comma from being typed

          // Get the current value and split it by commas to create tags
          let enteredValue = inputElement.value;
          
          // Split by commas, trim spaces, and filter out empty tags
          let tags = enteredValue.split(',')
            .map(tag => tag.trim())  // Remove leading/trailing spaces
            .filter(tag => tag.length > 0);  // Only keep non-empty tags

          // Add the new tag followed by a comma and a space
          inputElement.value = tags.join(', ') + ', ';

          console.log(`Tags: ${tags.join(', ')}`);
        }
      });
    }
  }

  getVisibleFieldsCount() {
    return this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;
  }
}
