// JavaScript for main functionality of the portfolio website

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");

    // Save user preference in local storage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Function to load the user's theme preference
function loadTheme() {
    const theme = localStorage.getItem("theme");
    const body = document.body;

    if (theme === "dark") {
        body.classList.add("dark-mode");
    }
}

// Event listener for dark mode toggle button
document.addEventListener("DOMContentLoaded", () => {
    loadTheme();

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", toggleDarkMode);
    }
});