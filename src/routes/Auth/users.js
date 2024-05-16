const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const { model } = require('mongoose');


const redirect = encodeURIComponent("http://localhost:3000/auth/discord/callback")

// Return a Specific User
// POST request to /auth/user

router.post('/user', async (req, res) => {
  try {
    // console.log(req.body);
    const {
      session
    } = req.body;
    const user = await User.findOne({
      session
    });

    // console.log(user);

    if (!user) {
      console.log('User was not found, please log in again.');
      res.status(404).json({
        error: 'User Not Found'
      });
      return;
    }

    let results = await fetch(`https://discordapp.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${user.discordAccess}`
      }
    });

    if (results.status === 401) {
      console.log('Token Expired');
      const updatedUser = await refreshToken(user);
      results = await fetch(`https://discordapp.com/api/users/@me`, {
        headers: {
          Authorization: `Bearer ${updatedUser.discordAccess}`
        }
      });
    }


    res.status(200).json({
      results: await results.json()
    });

  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err);
  }
});

// Refresh the User's Access Token

function refreshToken(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const creds = btoa(`${clientId}:${clientSecret}`);
      const response = await fetch(`https://discordapp.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${user.discordRefresh}&redirect_uri=${redirect}`
      });

      const {
        access_token,
        refresh_token,
        expires_in
      } = await response.json();


      user.discordAccess = access_token;
      user.discordRefresh = refresh_token;
      user.date = Date.now() - (expires_in * 1000);
      user.save();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
}




module.exports = router;