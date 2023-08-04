var scrollpos = window.scrollY;
var header = document.getElementById("fixed-top");
var goTopBtn = document.getElementById("btt-button");

window.addEventListener('scroll', function () {
    scrollpos = window.scrollY;
    if (scrollpos > 10) {
        header.classList.add("top-nav-collapse");
    }
    else {
        header.classList.remove("top-nav-collapse");
    }
    trackScroll();
});

goTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function trackScroll() {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight / 2;
    if (scrolled >= coords) {
        goTopBtn.style.visibility = "visible";
        setTimeout(function () {
            goTopBtn.style.opacity = 1;
        }, 10);
    }
    else {
        goTopBtn.style.opacity = 0;
        goTopBtn.addEventListener('transitionend', () => {
            if (goTopBtn.style.opacity == 0 && goTopBtn.style.visibility != "hidden") {
                goTopBtn.style.visibility = "hidden";
            }
        });
    }
}

(() => {
    'use strict'

    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme()
        if (storedTheme) {
            return storedTheme
        }
        return 'dark'
    }

    const setTheme = theme => {
        if (theme == 'dark') {
            document.getElementById('btnSwitch').querySelector('i').setAttribute('class', 'ri-sun-line')
        }
        else {
            document.getElementById('btnSwitch').querySelector('i').setAttribute('class', 'ri-moon-line')
        }
        document.documentElement.setAttribute('data-bs-theme', theme)
    }

    setTheme(getPreferredTheme())

    document.getElementById('btnSwitch').addEventListener('click',()=>{    
        if (getPreferredTheme() == 'dark') {
            setStoredTheme('white')
            document.getElementById('btnSwitch').querySelector('i').setAttribute('class', 'ri-moon-line')
            document.documentElement.setAttribute('data-bs-theme', 'white')
        }
        else {
            setStoredTheme('dark')
            document.getElementById('btnSwitch').querySelector('i').setAttribute('class', 'ri-sun-line')
            document.documentElement.setAttribute('data-bs-theme', 'dark')
        }
    });
})()

setTimeout(function () {
    var msnry = new Masonry('.grid');
    msnry.layout();
  }, 100);
  
  setTimeout(function () {
    var msnry = new Masonry('.grid');
    msnry.layout();
  }, 300);
  
  setTimeout(function () {
    var msnry = new Masonry('.grid');
    msnry.layout();
  }, 1000);
