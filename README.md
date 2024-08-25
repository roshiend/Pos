deleteVariant(event) {
  const button = event.target;
  const variantRow = button.closest('.variant');
  if (variantRow) {
    const destroyInput = variantRow.querySelector('input[name*="[_destroy]"]');
    if (destroyInput) {
      destroyInput.value = '1';
    } else {
      const hiddenDestroyInput = document.createElement('input');
      hiddenDestroyInput.setAttribute('type', 'hidden');
      hiddenDestroyInput.setAttribute('name', `${variantRow.querySelector('input[name*="[id]"]').name.replace('[id]', '[_destroy]')}`);
      hiddenDestroyInput.value = '1';
      variantRow.appendChild(hiddenDestroyInput);
    }
    variantRow.style.display = 'none';
  }
}
