const express = require('express');
const router = express.Router();
const User = require('../../models/user');
require('dotenv').config(); //initializes dotenv


const btoa = require('btoa');
const {
  catchAsync,
  generateSession
} = require('../../utils');


const clientSecret = process.env.CLIENT_SECRET;
const clientId = process.env.CLIENT_ID;

const redirect = encodeURIComponent("http://localhost:3000/auth/discord/callback")

router.get('/discord', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&scope=identify+guilds.join+guilds&response_type=code&redirect_uri=${redirect}`);
});

// Get the callback from discord


router.get('/discord/callback', catchAsync(async (req, res) => {
  if (!req.query.code) {
    res.redirect('/'); // Redirect to home page if no code is found
    return;
  }

  // Get the code from the query
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
  
  const {
    access_token,
    refresh_token,
    expires_in
  } = await response.json();

  
  // Search for the user in the database if they exist, if not create a new user
  const user = await User.findOne({
    discordRefresh: refresh_token
  });


  let session; // Create a session variable for new users

  if (user) {
    // Update the access token
    user.discordAccess = access_token;
    user.date = Date.now() - (expires_in * 1000);
    await user.save();
    session = user.session;

    // Set users name & discord id

    const results = await fetch(`https://discordapp.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    let data = (await results.json());
    user.username = data.username;
    user.discordId = data.id;
  } else {
    // Get the user's username and discord id
    const results = await fetch(`https://discordapp.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const {
      username,
      id
    } = await results.json();

    // Create a new user
    const newUser = new User({
      discordAccess: access_token,
      discordRefresh: refresh_token,
      date: Date.now() - (expires_in * 1000),
      session: generateSession(64),
      username: username,
      discordId: id
    });
    await newUser.save();
    session = newUser.session;
  }

  // Get Query String Page
  const queryPage = req.query.page;

  if (queryPage) {
    res.redirect(`/${queryPage}?session=${session}`); // Redirect and append Query String
  } else {
    res.redirect(`/?session=${session}`);
  }

}));


// export the router module so that server.js file can use it
module.exports = router;