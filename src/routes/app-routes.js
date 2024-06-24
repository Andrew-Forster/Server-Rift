const express = require('express');
const app = express();
const path = require('path');


const router = express.Router();

router.get('/account', (req, res) => {
    res.sendFile('HTML/Pages/account.html', { root: './public' });
});

router.get('/get-started', (req, res) => {
    res.sendFile('HTML/Pages/getstarted.html', { root: './public' });
});

router.get('/giveaway', (req, res) => {
    res.sendFile('HTML/Pages/giveaway.html', { root: './public' });
});

router.get('/explore', (req, res) => {
    res.sendFile('HTML/Pages/explore.html', { root: './public' });
});

router.get('/terms', (req, res) => {
    res.sendFile('HTML/Pages/Policies/terms.html', { root: './public' });
});

router.get('/privacy', (req, res) => {
    res.sendFile('HTML/Pages/Policies/privacy.html', { root: './public' });
});

router.get('/servers', (req, res) => {
    res.sendFile('HTML/Pages/servers.html', { root: './public' });
});

router.get('/info', (req, res) => {
    res.sendFile('HTML/Pages/serversinfo.html', { root: './public' });
});

router.get('/home', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

router.get('/success', (req, res) => {
    res.sendFile('HTML/Pages/Steps/success.html', { root: './public' });
});





module.exports = router;