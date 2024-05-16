// Checks if the user is logged in and redirects them to the dashboard if they are
checkNewSession();

let loginBtn = document.getElementById('login');
loginBtn.addEventListener('click', function () {
    // Set page query string to current page
    const url = new URL(window.location.href);
    url.searchParams.set('page', window.location.pathname);
    window.location.href = '/auth/discord';
});

let accountBtn = document.getElementById('account');

if (checkLoggedIn()) {
    loginBtn.classList.add('disable');
    console.log('User is logged in');
} else {
    accountBtn.classList.add('disable');
    console.log('User is not logged in');
}



function checkNewSession() {
    // Check query string for session ID
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');

    // If session ID is present, set it in the session storage

    if (session) {
        localStorage.setItem('session', session);
        urlParams.delete('session');
        window.location.href = '/account';
    }
}

