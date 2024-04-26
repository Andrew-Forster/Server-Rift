const express = require('express');
const router = express.Router();
const User = require('../../models/user');


const redirect = encodeURIComponent("http://localhost:3000/auth/discord/callback")

// Return a Specific User

router.post('/getUser', async (req, res) => {
  try {
    const {
      session
    } = req.body;
    const user = await User.findOne({
      session
    });

    if (!user) {
      res.status(404).json({
        error: 'User Not Found'
      });
    }

    let results = await fetch(`https://discordapp.com/api/user/@me`, {
      headers: {
        Authorization: `Bearer ${user.discordAccess}`
      }
    });

    if (results.status === 401) {
      const updatedUser = await refreshToken(user);
      results = await fetch(`https://discordapp.com/api/user/@me`, {
        headers: {
          Authorization: `Bearer ${updatedUser.discordAccess}`
        }
      });
    }



    res.status(200).json({
      results
    });

  } catch (err) {
    res.status(500).send('Internal Server Error');
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