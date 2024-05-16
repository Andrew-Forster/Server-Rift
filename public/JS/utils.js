
// Check if the user is logged in

function checkLoggedIn() {
    const session = localStorage.getItem('session');
    if (session) {
        return true;
    } else {
        return false;
    }
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


// If Logged in

async function getUserInfo() {
    if (checkLoggedIn()) {
        try {
            const response = await fetch('/auth/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage.getItem('session')
                })
            });

            if (response.status === 404) {
                localStorage.removeItem('session');
                window.location.href = '/auth/discord';
                return null;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(error);
            return null;
        }

    }
}

// get user settings


async function getUserSettings() {
    if (checkLoggedIn()) {
        try {
            const response = await fetch('/auth/user/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage.getItem('session')
                })
            });

            if (response.status === 404) {
                localStorage.removeItem('session');
                window.location.href = '/auth/discord';
                return null;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            return data.settings;
        } catch (error) {
            console.error(error);
            return null;
        }

    }
}

// Update User Settings
// Returns the updated settings
// Returns false if an error occurs

async function updateUserSettings(settings) {
    if (checkLoggedIn()) {
        try {
            const response = await fetch('/auth/user/update/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage.getItem('session'),
                    settings
                })
            }); 

            if (response.status === 404) {
                localStorage.removeItem('session');
                window.location.href = '/auth/discord';
                return false;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            return data.settings;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

// Update User Interests

async function updateInterests(interests) {
    if (checkLoggedIn()) {
        try {
            const response = await fetch('/auth/user/update/interests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage.getItem('session'),
                    interests
                })
            });

            if (response.status === 404) {
                localStorage.removeItem('session');
                window.location.href = '/auth/discord';
                return false;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            return data.interests;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}


// ---------------
// Content Replace
// ---------------





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