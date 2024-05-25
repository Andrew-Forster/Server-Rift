//Variables

// Paths

const asMain = "/HTML/Pages/Account Settings/asmain.html";
const notifs = "/HTML/Pages/Account Settings/notifs.html";
const prefs = "/HTML/Pages/Account Settings/prefs.html";
const settings = "/HTML/Pages/Account Settings/settings.html";
const interests = "/HTML/Pages/Account Settings/interests.html";

// Elements

var alertPop = document.querySelector(".alert");
var content = document.getElementById("content");
var notifsBtn;
var prefsBtn;
var settingsBtn;
var returnBtn;


initialEvents();
$(document).ready(function () {
    checkQueryStrings();
    loadUser();

    // Check if user is logged in

    if (!checkLoggedIn()) {
        window.location.href = "/auth/discord";
    }
});
window.onpopstate = function () {
    checkQueryStrings();
    loadUser();

    // Check if user is logged in

    if (!checkLoggedIn()) {
        window.location.href = "/auth/discord";
    }
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

    scrollTo(0, 0);
    content.children[0].classList.add("continueAnim");
    setTimeout(async function () {
        await fetch(page)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                loadUser();

            })
            .catch(error => {
                location.reload();
                console.error('Error loading content:', error);
            });
        awaitContentReplace(page);
    }, 900);


}

// Replace content with the new page and set the events for the new page
async function awaitContentReplace(page) {
    let savedSettings = await getUserSettings();

    let section = await waitForElm("#content section");
    if (page == notifs ||
        page == prefs ||
        page == settings ||
        page == interests) {
        returnBtn = await waitForElm("#return");
    }

    section.children[0].classList.add("active");

    // Remove Alert & reassign it
    alertPop = document.querySelector(".alert");
    alertPop.classList.remove('perm');
    switch (page) {
        case notifs:
            returnBtn.addEventListener("click", function () {
                contentReplace(asMain);
            });

            setQueryString("page", "notifs");
            loadSettings(savedSettings);
            addFormEvents();
            break;

        case prefs:
            let intsBtn = await waitForElm("#serverInterests");

            returnBtn.addEventListener("click", function () {
                contentReplace(asMain);
            });

            intsBtn.addEventListener("click", function () {
                contentReplace(interests);
            });

            setQueryString("page", "prefs");
            loadSettings(savedSettings);
            addFormEvents();
            break;

        case interests:
            returnBtn.addEventListener("click", function () {
                contentReplace(prefs);
            });
            setQueryString("page", "interests");
            loadInterests();
            addIntEvents();
            break;

        case settings:
            let signoutBtn = await waitForElm("#signout");
            let disableAcct = await waitForElm("#disable");

            signoutBtn.addEventListener("click", function () {
                signOut();
            });

            disableAcct.addEventListener("click", function () {
                sendAlert("Are you sure you want to disable your account?", "Disable Account", "disableAccount", true, 0);
            });

            returnBtn.addEventListener("click", function () {
                contentReplace(asMain);
            });
            setQueryString("page", "settings");
            break;

        default:
            removeQueryString("page");
            initialEvents();
            break;
    }

}

function signOut() {
    localStorage.removeItem('session');
    window.location.href = "/";
}

// TODO: Convert to switch function
// Sets the page based on the query strings in the URL
function checkQueryStrings() {
    if (getQueryString("page") === "notifs") {
        contentReplace(notifs);
    }

    if (getQueryString("page") === "prefs") {
        contentReplace(prefs);
    }

    if (getQueryString("page") === "interests") {
        contentReplace(interests)
    }

    if (getQueryString("page") === "settings") {
        contentReplace(settings);
    }

    if (getQueryString("page") === null && content.children[0].classList.contains("asmain") === false) {
        contentReplace(asMain);
    }
}

//-----------------------
// Save Interests Changes
//-----------------------


async function loadInterests() {
    if (!checkLoggedIn()) {
        return;
    }
    let savedSettings = await getUserSettings();
    let interests = savedSettings.serverInterests;
    let cBoxes = document.querySelectorAll(".interests input[type='checkbox']");

    cBoxes.forEach(function (cBox) {
        if (interests.includes(cBox.id)) {
            cBox.checked = true;
        }
    });
}


async function saveInterests() {
    let interests = [];
    let cBoxes = document.querySelectorAll(".interests input[type='checkbox']");
    cBoxes.forEach(function (cBox, i) {
        if (cBox.checked) {
            interests.push(i.toString());
        }
    });

    try {
        let updated = await updateInterests(interests);

        if (updated == interests) {
            sendAlert("Interests Saved", "Close", "closeAlert", false, 0);
        } else {
            sendAlert("Failed to save interests", "Close", "closeAlert", false, 0);
        }
    } catch (e) {
        sendAlert("Error on save interests", "Close", "closeAlert", false, 0);
        console.error(e);
    }
}

// Form Events for Interests

function addIntEvents() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", async function () {
            let savedSettings = await getUserSettings();
            if (checkAllInterestsOriginalState(savedSettings, checkboxes)) {
                sendAlert("Please confirm to save your changes", "Confirm Save", "saveInts", true, 0);
            } else {
                alertPop.classList.remove('perm');
            }
        });
    });
}

// Check if all checkboxes match their original state
function checkAllInterestsOriginalState(savedSettings, checkboxes) {
    for (let checkbox of checkboxes) {

        // If any checkbox does not match its original state, return true
        if (!savedSettings.serverInterests.includes(checkbox.id) && checkbox.checked) {
            return true;
        }

        if (savedSettings.serverInterests.includes(checkbox.id) && !checkbox.checked) {
            return true;
        }
    }
    // If all checkboxes match their original state, return false
    return false;

}

// Sets the interests to the user's saved settings
async function setInterests() {
    let savedSettings = await getUserSettings();
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    let interests = [];
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            interests.push(checkbox.id);
        }
    });
    savedSettings.serverInterests = interests;

    try {
        // Located in utils.js
        let updated = await updateInterests(savedSettings.serverInterests);
        if (updated) {
            sendAlert("Interests Saved", "Close", "closeAlert", false, 0);
        } else {
            sendAlert("Failed to save interests", "Close", "closeAlert", false, 0);
        }

    } catch (e) {
        sendAlert("Error on save interests", "Close", "closeAlert", false, 0);
        console.error(e);
    }
}

//------------------------
// Upload Settings Changes
//------------------------

// Account Settings

async function loadSettings(savedSettings) {
    if (!checkLoggedIn()) {
        return;
    }

    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = savedSettings[checkbox.id];
    });
}


// Load User Avatar & Name, Uses Fetch API

async function loadUser() {
    if (!checkLoggedIn()) {
        return;
    }
    let accountImg = document.getElementById("accountImg");
    let accountName = document.getElementById("accountName");

    let userInfo = [localStorage.getItem('avatar'), localStorage.getItem('global_name'), localStorage.getItem('refresh')]
    if (userInfo[0] && userInfo[1] && userInfo[2]) {
        accountImg.src = userInfo[0];
        if (accountName) {
            accountName.innerHTML = "Welcome, " + userInfo[1] + "!";
        }
    } else {
        try {
            let user = await getUserInfo();
            let avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
            accountImg.src = avatarUrl;
            if (accountName) {
                accountName.innerHTML = "Welcome, " + user.global_name + "!";
            }
            localStorage.setItem('avatar', avatarUrl);
            localStorage.setItem('global_name', user.global_name);
            localStorage.setItem('refresh', Date.now() + 604800);
        } catch (error) {
            console.error('Error loading user information:', error);
        }
    }
}


// Form Events for Settings

function addFormEvents() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", async function () {
            let savedSettings = await getUserSettings();
            if (savedSettings[checkbox.id] !== checkbox.checked) {
                sendAlert("Please confirm to save your changes", "Confirm Save", "saveChanges", true, 0);
            } else if (checkAllCheckboxesOriginalState(savedSettings, checkboxes)) {
                alertPop.classList.remove('perm');
            }
        });
    });
}

function checkAllCheckboxesOriginalState(savedSettings, checkboxes) {
    for (let checkbox of checkboxes) {
        // If any checkbox does not match its original state, return false
        if (savedSettings[checkbox.id] !== checkbox.checked) {
            return false;
        }
    }
    // If all checkboxes match their original state, return true
    return true;
}


// Sets the settings to the user's saved settings
async function setSettings() {
    let savedSettings = await getUserSettings();
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function (checkbox) {
        savedSettings[checkbox.id] = checkbox.checked;
    });

    // TODO: Add handling on backend for saving settings that do not exist

    try {
        // Located in utils.js
        let updated = await updateUserSettings(savedSettings);
        if (updated) {
            sendAlert("Settings Saved", "Close", "closeAlert", false, 0);
        } else {
            sendAlert("Failed to save settings", "Close", "closeAlert", false, 0);
        }

    } catch (e) {
        sendAlert("Error on save settings", "Close", "closeAlert", false, 0);
        console.error(e);
    }
}