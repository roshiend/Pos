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

      // Initialize existing tags when editing the form
      const hiddenInput = field.querySelector(`#product-option-value-hidden_${index}`);
      const tagContainer = field.querySelector(`#tag-container-${index}`);
      let tags = this.getExistingTags(hiddenInput.value);
      this.updateTagsUI(tags, hiddenInput, tagContainer);
    });

    // Initialize Cartesian product calculation
    this.generateCartesianProduct();
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
      this.generateCartesianProduct(); // Update the cartesian product on removal
    }
  }

  updateAddButtonVisibility() {
    const visibleFields = this.getVisibleFieldsCount();
    const addButton = this.element.querySelector('[data-action="product-options#add"]');
    addButton.style.display = visibleFields < this.constructor.MAX_FIELDS ? 'block' : 'none';
  }

  addInputEventListeners(field, index) {
    const nameInput = field.querySelector('.product-option-name-select');
    const valueInput = field.querySelector(`#product-option-value-input_${index}`); // Visible input for adding tags
    const hiddenInput = field.querySelector(`#product-option-value-hidden_${index}`); // Hidden input for storing tags
    const tagContainer = field.querySelector(`#tag-container-${index}`); // Container for displaying tags

    let tags = this.getExistingTags(hiddenInput.value); // Get initial tags
    this.updateTagsUI(tags, hiddenInput, tagContainer); // Update UI with existing tags

    this.addTaggingListener(valueInput, hiddenInput, tagContainer, tags); // Handle tag display and deletion

    // Listen for changes in the product option name or tags to regenerate Cartesian Products
    nameInput.addEventListener('change', () => this.generateCartesianProduct());
    hiddenInput.addEventListener('change', () => this.generateCartesianProduct());
  }

  // Parse the existing tags from the hidden input (if any)
  getExistingTags(value) {
    if (!value) return [];
    return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  addTaggingListener(inputElement, hiddenInput, tagContainer, tags) {
    inputElement.addEventListener('keydown', (event) => {
      // Detect Enter key
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission on Enter

        const tag = inputElement.value.trim();
        if (tag.length > 0) {
          tags.push(tag);
          this.updateTagsUI(tags, hiddenInput, tagContainer); // Update the UI and hidden field
          inputElement.value = ''; // Clear the input after adding the tag
          this.generateCartesianProduct(); // Regenerate Cartesian product after adding a tag
        }
      }
    });
  }

  updateTagsUI(tags, hiddenInput, tagContainer) {
    // Clear the current displayed tags
    tagContainer.innerHTML = '';

    // Display each tag with a delete button
    tags.forEach((tag, index) => {
      const tagElement = document.createElement('span');
      tagElement.classList.add('tag');
      tagElement.innerHTML = `${tag} <button type="button" data-index="${index}" class="delete-tag-btn">x</button>`;

      // Add click listener for the delete button
      tagElement.querySelector('.delete-tag-btn').addEventListener('click', () => {
        tags.splice(index, 1); // Remove the tag from the list
        this.updateTagsUI(tags, hiddenInput, tagContainer); // Re-render the tags
        this.generateCartesianProduct(); // Regenerate Cartesian product after deleting a tag
      });

      tagContainer.appendChild(tagElement);
    });

    // Update the hidden input field with the current tags
    hiddenInput.value = tags.join(', ');
    hiddenInput.dispatchEvent(new Event('change')); // Trigger change event for Cartesian product generation
  }

  // Generate Cartesian product based on selected option names and their tags
  generateCartesianProduct() {
    const optionsWrappers = this.element.querySelectorAll('.product-options-wrapper');
    let options = [];

    optionsWrappers.forEach(wrapper => {
      const optionName = wrapper.querySelector('.product-option-name-select').value;
      const optionValues = wrapper.querySelector('.product-option-value-hidden').value.split(',')
        .map(tag => tag.trim()).filter(tag => tag.length > 0);

      if (optionName && optionValues.length > 0) {
        options.push({ name: optionName, values: optionValues });
      }
    });

    if (options.length === 0) {
      this.displayCartesianProduct([], []); // If no options exist, display nothing
      return;
    }

    const cartesianProduct = this.cartesian(options.map(option => option.values));
    this.displayCartesianProduct(cartesianProduct, options.map(option => option.name));
  }

  // Helper method to compute Cartesian product
  cartesian(arrays) {
    if (arrays.length === 0) {
      return []; // If there are no arrays, return an empty result
    }

    // Ensure we provide an initial value to reduce()
    return arrays.reduce((a, b) => {
      if (a.length === 0) return b.map(e => [e]); // If 'a' is initially empty
      return a.flatMap(d => b.map(e => [d, e].flat()));
    }, []); // Provide empty array as initial value
  }

  // Display the generated Cartesian product
  displayCartesianProduct(cartesianProduct, optionNames) {
    const productContainer = this.element.querySelector('#generated-product-variants');
    productContainer.innerHTML = ''; // Clear any existing products

    cartesianProduct.forEach(product => {
      const productElement = document.createElement('div');
      productElement.textContent = optionNames.map((name, index) => `${name}: ${product[index]}`).join(' | ');
      productContainer.appendChild(productElement);
    });
  }

  getVisibleFieldsCount() {
    return this.element.querySelectorAll('.product-options-wrapper:not([style*="display: none"])').length;
  }
}
