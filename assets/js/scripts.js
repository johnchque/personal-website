document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Cached DOM elements - with added null checks
    const header = document.getElementById("fixed-top");
    const goTopBtn = document.getElementById("btt-button");
    const btnSwitch = document.getElementById('btnSwitch');
    
    // Only proceed with theme switching if the button exists
    if (btnSwitch) {
        const themeIcon = btnSwitch.querySelector('i');
        const logo = document.getElementById('logo');

        // Theme related constants and functions
        const themeKey = 'theme';
        const darkTheme = 'dark';
        const lightTheme = 'white';
        const iconSunClass = 'ri-sun-line';
        const iconMoonClass = 'ri-moon-line';
        const dataBsThemeAttr = 'data-bs-theme';

        const getStoredTheme = () => localStorage.getItem(themeKey);
        const setStoredTheme = theme => localStorage.setItem(themeKey, theme);
        
        // Get current theme (already set by the anti-flash script)
        const getCurrentTheme = () => {
            return document.documentElement.getAttribute(dataBsThemeAttr) || lightTheme;
        };

        // Update UI elements to match current theme (called on page load)
        const syncUIWithTheme = (theme, animate = false) => {
            if (themeIcon) {
                themeIcon.setAttribute('class', theme === darkTheme ? iconSunClass : iconMoonClass);
            }
            
            if (logo) {
                logo.setAttribute('src', theme === darkTheme ? "/assets/images/logo-d.svg" : "/assets/images/logo.svg");
            }
            
            // Only add animation-ready class if animate parameter is true
            if (animate) {
                document.body.classList.add('animation-ready');
            }
        };

        // Set theme and update UI
        const setTheme = (theme, animate = false) => {
            // Set the theme attribute
            document.documentElement.setAttribute(dataBsThemeAttr, theme);
            
            // Update UI elements
            syncUIWithTheme(theme, animate);
            
            // Store the preference
            setStoredTheme(theme);
        };

        // Initialize UI to match the current theme (set by anti-flash script)
        const currentTheme = getCurrentTheme();
        syncUIWithTheme(currentTheme, false);

        // Button click with animation
        btnSwitch.addEventListener('click', () => {
            const currentTheme = getCurrentTheme();
            const newTheme = currentTheme === darkTheme ? lightTheme : darkTheme;
            setTheme(newTheme, true); // Pass true to enable animation
        });
        
        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (!getStoredTheme()) { // Only auto-switch if user hasn't set preference
                const newTheme = event.matches ? darkTheme : lightTheme;
                setTheme(newTheme, true);
            }
        });
    }

    // Scroll related functions and event listeners
    if (header || goTopBtn) {
        let scrollpos = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            scrollpos = window.scrollY;

            // Toggle header class
            if (header) {
                if (scrollpos > 10) {
                    header.classList.add("top-nav-collapse");
                } else {
                    header.classList.remove("top-nav-collapse");
                }
            }

            // Toggle goTopBtn visibility and opacity
            if (goTopBtn) {
                if (scrollpos >= 500) {
                    if (!goTopBtn.classList.contains('visible')) {
                        goTopBtn.classList.add('visible');
                    }
                } else {
                    if (goTopBtn.classList.contains('visible')) {
                        goTopBtn.classList.remove('visible');
                    }
                }
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });

        // Initialize scroll effects on page load
        handleScroll();
        
        // Add smooth scroll behavior for back to top button
        if (goTopBtn) {
            goTopBtn.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        }
    }
    
    // Initialize focus trap for modals if they exist
    setupAccessibility();
});

// Setup additional accessibility features
function setupAccessibility() {
    // Make skip link work - focus the main content when activated
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.tabIndex = -1;
                mainContent.focus();
            }
        });
    }
    
    // Ensure all interactive elements have appropriate focus styles
    document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(el => {
        if (!el.classList.contains('skip-link') && window.getComputedStyle(el).outline === 'none') {
            el.classList.add('needs-focus-style');
        }
    });
}

// External toggle function - maintained for backward compatibility
function toggle(theme) {
    document.body.classList.add('animation-ready');
    
    // Get current theme from html attribute
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'white';
    const newTheme = currentTheme === 'dark' ? 'white' : 'dark';
    
    // Set theme on html element
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    
    // Store preference
    localStorage.setItem('theme', newTheme);
    
    // Update icon if present
    const btnSwitch = document.getElementById('btnSwitch');
    if (btnSwitch) {
        const themeIcon = btnSwitch.querySelector('i');
        if (themeIcon) {
            themeIcon.setAttribute('class', newTheme === 'dark' ? 'ri-sun-line' : 'ri-moon-line');
        }
    }
    
    // Update logo if present
    const logo = document.getElementById('logo');
    if (logo) {
        logo.setAttribute('src', newTheme === 'dark' ? "/assets/images/logo-d.svg" : "/assets/images/logo.svg");
    }
}
