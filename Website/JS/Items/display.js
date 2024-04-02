// --------------
// Theme Switcher
// --------------
var darkThemeButton = document.getElementById("themeNeonDark");
var lightThemeButton = document.getElementById("themeNeonLight");
var skyLineThemeButton = document.getElementById("themeSkyLine");
let alertDark = document.querySelector(".alert-dark");
let alertDarkCount;
$(document).ready(function () {
    localStorage.getItem("theme") === "themeNeonDark" ? darkTheme() : localStorage.getItem("theme") === "themeNeonLight" ? lightTheme() : localStorage.getItem("theme") === "themeSkyLine" ? skyLineTheme() : setSystemTheme();
});


let changeTheme = document.querySelector(".change-theme");
let themeDialog = document.querySelector("dialog.themes");

document.addEventListener('click', function (event) {
    try {
        const dialogDimensions = themeDialog.getBoundingClientRect();
        // Check if the clicked element is the dialog itself or its backdrop
        if (
            event.clientX < dialogDimensions.left ||
            event.clientX > dialogDimensions.right ||
            event.clientY < dialogDimensions.top ||
            event.clientY > dialogDimensions.bottom
          ) {
            themeClose();
          }
        if (event.target === changeTheme && !themeDialog.open) {
            toggleTheme();
        }
    } catch (e) {}
        
    });

document.addEventListener('scroll', themeClose);

function toggleTheme() {
    if (themeDialog.open) {
        themeDialog.close();
    } else {
        themeDialog.showModal();
    }
}

function themeClose() {
    try {
        if (themeDialog.open) {
            themeDialog.close();
        }
    }
    catch (e) {}
}


const theme = document.querySelectorAll(".themes");
const themeChildren = document.querySelectorAll(".themes button");
var themeChoice;
for (let i = 0; i < themeChildren.length; i++) {
    themeChildren[i].addEventListener("click", function () {
        let themeName = themeChildren[i].getAttribute("id");

        for (let j = 0; j < themeChildren.length; j++) {
            themeChildren[j].classList.remove("active");
        }
        if (themeName === "themeNeonDark") {
            darkTheme();
            navShowHide();
        }
        if (themeName === "themeNeonLight") {
            isDefault = false;
            lightTheme(isDefault);
            navShowHide();

        }
        if (themeName === "themeSkyLine") {

            skyLineTheme();
            navShowHide();
        }
        themeChildren[i].classList.add("active");
        localStorage.setItem("theme", themeChoice);

    });
}

function darkTheme() {
    themeChoice = "themeNeonDark";
    if (darkThemeButton != null) {
        darkThemeButton.classList.add("active");
    }

    document.documentElement.style.setProperty("--nav-hover", "linear-gradient(90deg, rgba(137, 188, 255, 0.9) 0%, rgba(44, 102, 227, 0.9) 100%)");
    document.documentElement.style.setProperty("--utility-hover", "#aaaaaa");

    // Main
    document.documentElement.style.setProperty("--main-color", "rgba(40, 109, 198, 0.803)");
    document.documentElement.style.setProperty("--main-shadow", "rgba(255, 255, 255, 0.80)");
    document.documentElement.style.setProperty("--step1-color", "linear-gradient(205deg, rgba(80, 80, 80, 0.05) 60%, rgba(56, 44, 227, 0.4) 100%)");
    document.documentElement.style.setProperty("--step2-color", "linear-gradient(205deg, rgba(80, 80, 80, 0.05) 60%, rgba(44, 102, 227, 0.4) 100%)");
    document.documentElement.style.setProperty("--step3-color", "linear-gradient(205deg, rgba(80, 80, 80, 0.05) 60%, rgba(44, 181, 227, 0.4) 100%)");
    document.documentElement.style.setProperty("--steps-end-color", "#252e3f");
    document.documentElement.style.setProperty("--main-gradient", "linear-gradient(108deg, rgba(4,44,96,1) 0%, rgba(13,28,61,1) 14%, rgba(13,20,46,1) 45%, rgba(13,13,33,1) 79%)");
    document.documentElement.style.setProperty("--page-gradient", "rgba(28, 28, 28, 0.9)");
    document.documentElement.style.setProperty("--footer-color", "rgb(25, 32, 40)");

    document.documentElement.style.setProperty("--btn-color", "#ffffff");
    document.documentElement.style.setProperty("--second-btn-color", "#1e385a");
    document.documentElement.style.setProperty("--font-color", "#ffffff");
    document.documentElement.style.setProperty("--font-opposite", "#000000");
    document.documentElement.style.setProperty("--btn-confirm", "#1AB06F");
    document.documentElement.style.setProperty("--discord", "#7289DA");
    document.documentElement.style.setProperty("--settingsbg", "rgb(39, 38, 44)");
    document.documentElement.style.setProperty("--cardbg", "rgb(25, 32, 40)");


}

function lightTheme(isDefault) {
    themeChoice = "themeNeonLight";
    
    if (isDefault && localStorage.getItem("alertDC") != 1) {
        sendAlert("Dark Mode is Recommended", "Lets Switch!", "theme", false)
        localStorage.setItem("alertDC", 1);
    }
    
    if (lightThemeButton != null) {
        lightThemeButton.classList.add("active");
    }


    document.documentElement.style.setProperty("--nav-hover", "linear-gradient(90deg, rgba(44, 104, 181, 0.9) 0%, rgba(8, 43, 121, 0.9) 100%)");
    document.documentElement.style.setProperty("--utility-hover", "#626266");

    // Main
    document.documentElement.style.setProperty("--main-color", "rgba(131, 173, 255, 0.803)");
    document.documentElement.style.setProperty("--main-shadow", "rgba(26, 26, 26, 0.8)");
    document.documentElement.style.setProperty("--step1-color", "linear-gradient(205deg, rgba(80, 80, 80, 0.05) 60%, rgba(56, 44, 227, 0.4) 100%)");
    document.documentElement.style.setProperty("--step2-color", "linear-gradient(205deg, rgba(80, 80, 80, 0.05) 60%, rgba(44, 102, 227, 0.4) 100%)");
    document.documentElement.style.setProperty("--step3-color", "linear-gradient(205deg, rgba(80, 80, 80, 0.05) 60%, rgba(44, 181, 227, 0.4) 100%)");
    document.documentElement.style.setProperty("--steps-end-color", "#c0cbe1");
    document.documentElement.style.setProperty("--main-gradient", "linear-gradient(108deg, rgba(137,186,249,1) 0%, rgba(174, 194, 230, 1) 14%, rgba(208, 216, 238, 1) 45%, rgba(216, 216, 234, 1) 79%)");
    document.documentElement.style.setProperty("--page-gradient", "rgba(227, 227, 227, 0.9)");
    document.documentElement.style.setProperty("--footer-color", "rgb(226, 240, 255)");

    document.documentElement.style.setProperty("--btn-color", "#ffffff");
    document.documentElement.style.setProperty("--second-btn-color", "#4a7fc5");
    document.documentElement.style.setProperty("--font-color", "#252323");
    document.documentElement.style.setProperty("--font-opposite", "#ffffff");
    document.documentElement.style.setProperty("--btn-confirm", "#1AB06F");
    document.documentElement.style.setProperty("--discord", "#7289DA");
    document.documentElement.style.setProperty("--settingsbg", "rgba(195, 219, 250, 1)");
    document.documentElement.style.setProperty("--cardbg", "rgb(226, 240, 255)");

}

function skyLineTheme() {
    themeChoice = "themeSkyLine";
    if (skyLineThemeButton != null) {
        skyLineThemeButton.classList.add("active");
    }

    document.documentElement.style.setProperty("--nav-hover", "linear-gradient(90deg, rgba(204, 211, 211, 1) 0%, rgba(211, 255, 251, 1) 100%)");
    document.documentElement.style.setProperty("--utility-hover", "#cdcdcd");

    // Main
    document.documentElement.style.setProperty("--main-color", "#4cc8f535");
    document.documentElement.style.setProperty("--main-shadow", "rgba(252, 252, 252, 0.631)");
    document.documentElement.style.setProperty("--step1-color", "#4cf5cb25");
    document.documentElement.style.setProperty("--step2-color", "#4cc8f535");
    document.documentElement.style.setProperty("--step3-color", "#4c57f525");
    document.documentElement.style.setProperty("--steps-end-color", "#5769a8");
    document.documentElement.style.setProperty("--main-gradient", "linear-gradient(to top right, #38639b, #323536)");
    document.documentElement.style.setProperty("--page-gradient", "rgba(28, 28, 28, 0.75)");
    document.documentElement.style.setProperty("--footer-color", "#4C476B");
    
    document.documentElement.style.setProperty("--btn-color", "#ffffff");
    document.documentElement.style.setProperty("--second-btn-color", "#38639b");
    document.documentElement.style.setProperty("--font-color", "#ffffff");
    document.documentElement.style.setProperty("--font-opposite", "#000000");
    document.documentElement.style.setProperty("--btn-confirm", "#1AB06F");
    document.documentElement.style.setProperty("--discord", "#7289DA");
    document.documentElement.style.setProperty("--settingsbg", "#2F2C42");
    document.documentElement.style.setProperty("--cardbg", "rgba(56, 99, 155, 0.701)");

}

function setSystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkTheme();
    } else {
        lightTheme(true);
    }
}

let alertDarkBtn = document.querySelector(".alert-dark button");
if (alertDarkBtn != null) {
    alertDarkBtn.addEventListener("click", function () {
        alertDark.classList.remove("active");
        for (let j = 0; j < themeChildren.length; j++) {
            themeChildren[j].classList.remove("active");
        }
        darkTheme();
        navShowHide();
        darkThemeButton.classList.add("active");
        localStorage.setItem("theme", "themeNeonDark");
    });
}

// Alerts



async function sendAlert(head, btn, action, perm, delay) {
    var alertPop = await waitForElm(".alert");
    var alertHead = await waitForElm(".alert div h6");
    var alertBtn = await waitForElm(".alert div button");
    // var alertBtn = await waitForElm(".alert button");
    
    alertHead.innerText = `${head}`;
    alertBtn.innerText = `${btn}`;

    // Set the delay
    if (!isNaN(parseInt(delay))) {
        alertPop.style.animationDelay = `${delay}s`;
    }

    // Set the alert type
    if (perm == true) {
        alertPop.classList.add('perm');
    } else {
        alertPop.classList.add('active');
    }


    alertBtn.addEventListener('click', function() {
        switch (action) {
            case "theme":
                for (let j = 0; j < themeChildren.length; j++) {
                    themeChildren[j].classList.remove("active");
                }
                darkTheme();
                navShowHide();
                alertPop.classList.remove("active");
                localStorage.setItem("theme", "themeNeonDark");
                break;
            case "nav":
                break;

            case "saveChanges":
                alertPop.classList.remove("perm");
                // Located in account.js, this function saves the settings
                setSettings();

            case "closeAlert":
                alertPop.classList.remove('active');
                alertPop.classList.remove('perm');
                break;
            
        };
        alertPop.classList.remove('active');
    });
}


// Mutation Observer

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}