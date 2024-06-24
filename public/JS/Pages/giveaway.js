loadGiveaway();
async function loadGiveaway() {
    let giveawayID = getQueryString('id');
    if (!giveawayID) {
        loadFailed();
    }

    await getGiveaway().then(async data => {
        if (!data) {
            let completed = await checkCompleted();
            if (!completed) {
                loadFailed();
            } else {
                loadCompleted(completed);
            }
        } else {
            loadSuccess(data);
        }
    });
}

async function getGiveaway() {
    let giveawayID = getQueryString('id');
    if (!giveawayID) {
        loadFailed();
    }

    let response = await fetch('/giveaways/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: giveawayID
        })
    });
    let data = await response.json();
    return data.giveaway;
}

async function checkCompleted() {
    try {
        let giveawayID = getQueryString('id');
        let response = await fetch('/giveaways/getCompleted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: giveawayID
            })
        });
        let data = await response.json();
        return data.giveaway;
    } catch (e) {
        return null;
    }

}

function loadFailed() {
    let cont = document.getElementById('g');
    cont.innerHTML = `
        <h2><br>Giveaway <br>Not Found</h2>`;
    cont.classList.remove('pre-load');
}

function loadSuccess(giveaway) {
    let cont = document.getElementById('g');
    let cd = countDown(new Date(giveaway.endTime));
    cont.innerHTML = `
            <h2>Giveaway Info:</h2>
            <p class="entries">Entries:⠀<b>${giveaway.users.length}</b></p>
            <p class="prize">Prize:⠀<b>${giveaway.prize}</b></p>
            <p class="server">Server:⠀<b>${giveaway.guildName}</b></b></p>
            <p class="timer">Ends in:⠀<b>${cd}</b></p>`;
    cont.classList.remove('pre-load');

    setInterval(() => {
        getGiveaway().then(async data => {
            if (!data) {
                let completed = await checkCompleted();
                if (!completed) {
                    loadFailed();
                } else {
                    loadCompleted(completed);
                }
            } else {
                giveaway = data;
                updateCountdown(giveaway.endTime);
                updateEntries(giveaway.users.length);
            }
        });
    }, 500);
}

function loadCompleted(giveaway) {
    let cont = document.getElementById('g');
    let entries = giveaway.users.length != 0 ? giveaway.users.length : "None";
    let winnerNames = giveaway.winnerNames ? "<b>" + giveaway.winnerNames.join('</b>, <b>') + "</b>" : 'No one entered the giveaway.';
    console.log(giveaway.winnerNames);
    cont.innerHTML = `
        <h3>Giveaway Results:</h3>
        <p class="entries">Entries:⠀<b>${entries}</b></p>
        <p class="prize">Prize:⠀<b>${giveaway.prize}</b></p>
        <p class="server">Server:⠀<b>${giveaway.guildName}</b></b></p>
        <p class="winner">Winners: ${winnerNames}</p>`;
    cont.classList.remove('pre-load');
}

function updateCountdown(ends) {
    let cd = document.querySelector('.timer b');
    if (!cd) return;
    cd.innerText = countDown(new Date(ends));
}

function updateEntries(entries) {
    let e = document.querySelector('.entries b');
    if (!e) return;
    e.innerText = entries;
}

function countDown(cd) {
    let now = new Date();
    let diff = cd - now;
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60);
    diff -= minutes * 1000 * 60;
    let seconds = Math.floor(diff / 1000);

    if (now > cd) return 'Picking Winners...';
    return `${hours}h: ${minutes}m: ${seconds}s`;
}