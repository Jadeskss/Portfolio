window.addEventListener('load', function() {
  const button = document.getElementById('darkModeToggle');
  
  if (!button) return;
  
  function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
      body.classList.remove('dark-mode');
      button.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-mode');
      button.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    }
  }
  
  const saved = localStorage.getItem('theme');
  
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    button.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove('dark-mode');
    button.innerHTML = '<i class="fas fa-moon"></i>';
  }
  
  button.onclick = toggleDarkMode;
  button.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});