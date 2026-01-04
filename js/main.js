document.addEventListener("DOMContentLoaded", () => {
  const contactLink = document.getElementById('contactLink');
  if (contactLink) {
    contactLink.addEventListener('click', function(e) {
      e.preventDefault();
    });
  }
});