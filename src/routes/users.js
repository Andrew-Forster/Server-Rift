const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config(); //initializes dotenv


const btoa = require('btoa');
const { catchAsync } = require('../utils');


const clientSecret = process.env.CLIENT_SECRET;
const clientId = process.env.CLIENT_ID;

const redirect = encodeURIComponent("http://localhost:3000/auth/discord/callback")

router.get('/discord', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&scope=identify+guilds.join&response_type=code&redirect_uri=${redirect}`);
});

// Get the callback from discord


router.get('/discord/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`
  });
  const json = await response.json();
  res.send(json);
}));


// export the router module so that server.js file can use it
module.exports = router; 