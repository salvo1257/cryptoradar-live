document.addEventListener('DOMContentLoaded', function() {
  initApp();
});
function initApp() {
  document.getElementById('current-year').textContent = new Date().getFullYear();
  loadSection('dashboard');
}
function loadSection(section) {
  const contentArea = document.getElementById('app-content');
  contentArea.innerHTML = '<div>Benvenuto su CryptoRadar!</div>';
}