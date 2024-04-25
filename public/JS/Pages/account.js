//Variables


// Paths

const asMain = "/HTML/Pages/Account Settings/asmain.html";
const notifs = "/HTML/Pages/Account Settings/notifs.html";
const prefs = "/HTML/Pages/Account Settings/prefs.html";
const settings = "/HTML/Pages/Account Settings/settings.html";

// Elements

var alertPop = document.querySelector(".alert");
var content = document.getElementById("content");
var notifsBtn;
var prefsBtn;
var settingsBtn;
var returnBtn;


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


initialEvents();
$(document).ready(function () {
    checkQueryStrings();
});
window.onpopstate = function () {
    checkQueryStrings();
};



async function initialEvents() {
    content = await waitForElm("#content");
    notifsBtn = await waitForElm("#notifs");
    prefsBtn = await waitForElm("#prefs");
    settingsBtn = await waitForElm("#settings");

    notifsBtn.addEventListener("click", function () {
        contentReplace(notifs);
    });

    prefsBtn.addEventListener("click", function () {
        contentReplace(prefs);
    });

    settingsBtn.addEventListener("click", function () {
        contentReplace(settings);
    });

}


function contentReplace(page) {
    alertPop = document.querySelector(".alert");
    scrollTo(0, 0);
    alertPop.classList.remove('perm');
    content.children[0].classList.add("continueAnim");
    setTimeout(function () {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
            })
            .catch(error => {
                location.reload();
                console.error('Error loading content:', error);
            });

    }, 900);

    awaitContentReplace(page);

}


async function awaitContentReplace(page) {

    let section = await waitForElm("#content section");
    returnBtn = await waitForElm("#return");

    section.children[0].classList.add("active");
    loadSettings();

    if (page === notifs) {
        try {
            returnBtn.addEventListener("click", function () {
                contentReplace(asMain);
            });
            setQueryString("page", "notifs");
            addFormEvents();
        } catch (e) {
            // location.reload();
            console.error(e);
        }

    }

    if (page === prefs) {
        try {
            returnBtn.addEventListener("click", function () {
                contentReplace(asMain);
            });
            setQueryString("page", "prefs");
            addFormEvents();
        } catch (e) {
            // location.reload();
            console.error(e);        }
    }

    if (page === settings) {
        try {
            returnBtn.addEventListener("click", function () {
                contentReplace(asMain);
            });
            setQueryString("page", "settings");
        } catch (e) {
            // location.reload();
            console.error(e);        }
    }

    if (page === asMain) {
        try {
            initialEvents();
            removeQueryString("page");
        } catch (e) {
            // location.reload();
            console.error(e);        }
    }

}

// URL Query String

function setQueryString(string, val) {
    let url = new URL(window.location.href);
    url.searchParams.set(string, val);
    window.history.pushState({}, '', url);
}

function getQueryString(string) {
    let url = new URL(window.location.href);
    return url.searchParams.get(string);
}

function removeQueryString(string) {
    let url = new URL(window.location.href);
    url.searchParams.delete(string);
    window.history.pushState({}, '', url);
}

function checkQueryStrings() {
    if (getQueryString("page") === "notifs") {
        contentReplace(notifs);
    }

    if (getQueryString("page") === "prefs") {
        contentReplace(prefs);
    }

    if (getQueryString("page") === "settings") {
        contentReplace(settings);
    }

    if (getQueryString("page") === null && content.children[0].classList.contains("asmain") === false) {
        contentReplace(asMain);
    }
}

//------------------------
// Upload Settings Changes
//------------------------

// Account Settings

function loadSettings() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = savedSettings[checkbox.id];
    });
}


// Form Events

function addFormEvents() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            if (savedSettings[checkbox.id] !== checkbox.checked) {
                sendAlert("Please confirm to save your changes", "Confirm Save", "saveChanges", true, 0);
            } else if (checkAllCheckboxesOriginalState(checkboxes)) {
                alertPop.classList.remove('perm');
            }
        });
    });
}

function checkAllCheckboxesOriginalState(checkboxes) {
    for (let checkbox of checkboxes) {
        // If any checkbox does not match its original state, return false
        if (savedSettings[checkbox.id] !== checkbox.checked) {
            return false;
        }
    }
    // If all checkboxes match their original state, return true
    return true;
}

function setSettings() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function (checkbox) {
        savedSettings[checkbox.id] = checkbox.checked;
    });
    sendAlert("Settings Saved", "Close", "closeAlert", false, 0);

    // TODO: Connect with backend to save settings
}