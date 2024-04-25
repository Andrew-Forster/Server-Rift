

history.scrollRestoration = "manual";

const navPopup = document.getElementById("navpopup");
const navIcon = document.getElementById("nav-icon");
const nav = document.querySelector("nav");



// Toggles classes for the nav menu
let hamburger = 0;

function openNav() {

    if (hamburger === 0) {
        let mobileNavBtns = document.querySelectorAll(".main-nav");
        let children = mobileNavBtns[0].children;

        for (let i = 0; i < children.length; i++) {
            val = 0.3 + (i * 0.15);
            children[i].style.animationDelay = val + "s";
        }


        hamburger = 1;
        navPopup.classList.toggle("open");
        navIcon.classList.toggle("open");
    } else {
        toggleNav();
    }
}
document.addEventListener('click', function (event) {

    // Check if the clicked element is the dialog itself or its backdrop
    if (event.target === navPopup) {
        // Clicked on the dialog or its backdrop, trigger toggleNav
        toggleNav();
    }
});
window.addEventListener("scroll", toggleNav);
window.addEventListener("keydown", handleEscKey);

function toggleNav() {
    if (navIcon.classList.contains("open")) {
        navPopup.classList.toggle("open");
        hamburger = 0;
        navIcon.classList.toggle("open");
    }
}

function handleEscKey(event) {
    if (event.key == "Escape") {
        toggleNav();
    }
}

var page = "main";


var isTop = true;
// Navbar Hiding Functions
let prevScrollpos = window.scrollY;
window.addEventListener("scroll", navShowHide);


function navShowHide() {
    let currentScrollPos = window.scrollY;
    if (prevScrollpos < currentScrollPos && window.scrollY > 5) {
        nav.style.top = "-100px";
        nav.style.transitionDuration = "0.3s";
    } else {
        nav.style.top = "0px";
        nav.style.transitionDuration = "0.5s";
    }
    prevScrollpos = currentScrollPos;

    let val = window.scrollY / 200;
    let max = (val > 0.8) ? 0.8 : val;
    if (themeChoice === "themeNeonLight") {
        nav.style.backgroundColor = "rgba(255, 255, 255, " + max + ")";
    } else {
        nav.style.backgroundColor = "rgba(28, 28, 28, " + max + ")";
    }

}






// LOGIN BTN
const loginBtn = document.querySelector(".snbtn");
window.addEventListener("resize", loginResize);
window.addEventListener("load", loginResize);

function loginResize() {
    if (window.innerWidth < 375) {
        loginBtn.style.display = "none";
    } else {
        loginBtn.style.display = "block";
    }
}

// -----------------
// Skip Intro Button
// -----------------

var skipIntroButton = document.getElementById("skipLoad");
if (skipIntroButton != null) {
    skipIntroButton.addEventListener("click", adjustAnimationDelays);
}

function adjustAnimationDelays() {
    var skipIntroButton = document.getElementById("skipLoad");
    var DelaySet = document.querySelectorAll(".onload-animation");

    for (var i = 0; i < DelaySet.length; i++) {
        var oDelay = parseFloat(window.getComputedStyle(DelaySet[i]).animationDelay);
        if (isNaN(oDelay)) {
            oDelay = 5;
        }
        oDelay = (oDelay - 5.5) + (document.timeline.currentTime / 1000);

        DelaySet[i].style.animationDelay = oDelay + "s";
    }
    document.documentElement.style.animationDuration = 0 + "s";
    skipIntroButton.style.display = "none";
    document.getElementById("main-text").style.display = "none";
}


// -----------------
// Logo Click Event
// -----------------

const logo = document.getElementById("logo");
const homeNavBtn = document.getElementById("homeNavBtn");
const mainImg = document.querySelector(".logoimg");
let isClickable = true;

logo.addEventListener("click", function () {
    if (isClickable) {
        // Disable the button
        isClickable = false;
        logoClick();
        
        // Set a timeout to re-enable the button after 1000 milliseconds (1 second)
        setTimeout(function() {
            isClickable = true; // Re-enable the button
        }, 1000);
    }
});



function logoClick() {
    mainImg.classList.add("active");
    setTimeout(function() {
        if (!homeNavBtn.classList.contains("active")) {
            window.location.href = "../../index.html";
        } else {
            document.querySelector("html").scrollIntoView({
                behavior: "smooth"
                
            });
        }
        
        }, 400);
     setTimeout(function () {
         mainImg.classList.remove("active");
     }, 800);
};