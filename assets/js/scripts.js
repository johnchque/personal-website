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
