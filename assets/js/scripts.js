document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Cached DOM elements
    const header = document.getElementById("fixed-top");
    const goTopBtn = document.getElementById("btt-button");
    const btnSwitch = document.getElementById('btnSwitch');
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
    const getPreferredTheme = () => getStoredTheme() || darkTheme;

    const setTheme = theme => {
        themeIcon.setAttribute('class', theme === darkTheme ? iconSunClass : iconMoonClass);
        logo.setAttribute('src', theme === darkTheme ? "/assets/images/logo-d.svg" : "/assets/images/logo.svg");
        document.documentElement.setAttribute(dataBsThemeAttr, theme);
    };

    setTheme(getPreferredTheme());

    btnSwitch.addEventListener('click', () => {
        const currentTheme = getPreferredTheme();
        const newTheme = currentTheme === darkTheme ? lightTheme : darkTheme;
        setStoredTheme(newTheme);
        setTheme(newTheme);
    });

    // Scroll related functions and event listeners
    let scrollpos = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
        scrollpos = window.scrollY;

        // Toggle header class
        if (scrollpos > 10) {
            header.classList.add("top-nav-collapse");
        } else {
            header.classList.remove("top-nav-collapse");
        }

        // Toggle goTopBtn visibility and opacity
        if (scrollpos >= 500) {
            if (!goTopBtn.classList.contains('visible')) {
                goTopBtn.classList.add('visible');
            }
        } else {
            if (goTopBtn.classList.contains('visible')) {
                goTopBtn.classList.remove('visible');
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

    goTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
