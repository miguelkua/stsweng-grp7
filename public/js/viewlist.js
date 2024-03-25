const viewButton = document.querySelectorAll('#view-list');
const overlay = document.getElementById('form-overlay');
const closeForm = document.getElementById('close-form')

function showOverlay() {
  overlay.style.display = 'block';
}

function hideOverlay() {
  overlay.style.display = 'none';
}

viewButton.forEach(button => {
  button.addEventListener('click', showOverlay);
});

closeForm.addEventListener('click', hideOverlay);