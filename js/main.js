// JavaScript for main functionality of the portfolio website

// Dark mode functionality is handled by darkMode.js
// These functions are kept for backward compatibility but disabled

// Function to toggle dark mode (DISABLED - using darkMode.js instead)
function toggleDarkMode() {
    console.log("toggleDarkMode called from main.js - this is disabled, using darkMode.js instead");
    // Functionality moved to darkMode.js for better implementation
}

// Function to load the user's theme preference (DISABLED - using darkMode.js instead)
function loadTheme() {
    console.log("loadTheme called from main.js - this is disabled, using darkMode.js instead");
    // Functionality moved to darkMode.js for better implementation
}

// Event listener for dark mode toggle button (DISABLED)
document.addEventListener("DOMContentLoaded", () => {
    // Dark mode functionality is now handled entirely by darkMode.js
    console.log("main.js loaded - dark mode handled by darkMode.js");
});

document.getElementById('contactLink').addEventListener('click', function(e) {
  e.preventDefault();
  chatModal.classList.add('active');
});