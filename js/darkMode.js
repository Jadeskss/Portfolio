document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use system preference
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    updateToggleIcon(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateToggleIcon(false);
  }
  
  // Add toggle functionality with transition effect
  darkModeToggle.addEventListener('click', () => {
    // Add transition class for smooth background change
    document.body.classList.add('theme-transition');
    
    // Toggle dark mode
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateToggleIcon(isDarkMode);
    
    // Remove transition class after transition completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 500);
  });
  
  function updateToggleIcon(isDarkMode) {
    darkModeToggle.innerHTML = isDarkMode 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
    
    // Add animation to icon
    const icon = darkModeToggle.querySelector('i');
    icon.classList.add('rotate-animation');
    setTimeout(() => icon.classList.remove('rotate-animation'), 500);
  }
});