// Ultra-simple dark mode implementation
console.log('🚀 Loading darkMode.js...');

// Wait for everything to load
window.addEventListener('load', function() {
  console.log('📄 Page fully loaded, initializing dark mode...');
  
  const button = document.getElementById('darkModeToggle');
  
  if (!button) {
    console.error('❌ Button with ID "darkModeToggle" not found!');
    console.log('🔍 Available buttons:', document.querySelectorAll('button'));
    return;
  }
  
  console.log('✅ Found button:', button);
  
  // Simple toggle function
  function toggleDarkMode() {
    console.log('🔄 Toggle function called');
    
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
      body.classList.remove('dark-mode');
      button.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
      console.log('☀️ Switched to light mode');
    } else {
      body.classList.add('dark-mode');
      button.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
      console.log('🌙 Switched to dark mode');
    }
  }
  
  // Load saved theme
  const saved = localStorage.getItem('theme');
  console.log('� Saved theme:', saved);
  
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    button.innerHTML = '<i class="fas fa-sun"></i>';
    console.log('🌙 Applied saved dark mode');
  } else {
    document.body.classList.remove('dark-mode');
    button.innerHTML = '<i class="fas fa-moon"></i>';
    console.log('☀️ Applied light mode');
  }
  
  // Add click event - multiple ways to ensure it works
  button.onclick = toggleDarkMode;
  button.addEventListener('click', function(e) {
    console.log('� Click event fired!');
    e.preventDefault();
    e.stopPropagation();
  });
  
  console.log('🎉 Dark mode setup complete!');
  
  // Test the button works
  setTimeout(() => {
    console.log('🧪 Testing button in 2 seconds...');
  }, 2000);
});