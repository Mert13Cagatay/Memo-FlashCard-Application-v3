// theme-loader.js - Add this script to all of your HTML files
// This script will load the theme preference from localStorage and apply it

// Define CSS variables for themes
const darkThemeCSS = `
:root {
    --bg-primary: #202020;
    --bg-secondary: #2a2a2a;
    --text-primary: #ffffff;
    --text-secondary: #dddddd;
    --accent-color: wheat;
    --border-color: #3b3b3b;
    --card-bg: #333333;
    --sidebar-bg: #202020;
    --button-text: #202020;
    --input-bg: #3b3b3b;
}`;

const lightThemeCSS = `
:root {
    --bg-primary: #f0f0f0;
    --bg-secondary: #e5e5e5;
    --text-primary: #333333;
    --text-secondary: #555555;
    --accent-color: #4a90e2;
    --border-color: #d0d0d0;
    --card-bg: #f0f0f0;
    --sidebar-bg: #e0e0e0;
    --button-text: #ffffff;
    --input-bg: #e8e8e8;
}`;

// Function to apply theme CSS
function applyThemeCSS(themeCSS) {
    let style = document.getElementById('theme-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'theme-style';
        document.head.appendChild(style);
    }
    style.textContent = themeCSS;
}

// Apply theme based on user preference
function applyTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('memo-theme');
    
    if (savedTheme === 'light') {
        applyThemeCSS(lightThemeCSS);
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    } else {
        applyThemeCSS(darkThemeCSS);
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    }
}

// Apply theme as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', applyTheme);

// Also apply theme now in case the script runs after DOM is already loaded
applyTheme();