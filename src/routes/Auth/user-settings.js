const express = require('express');
const router = express.Router();
const User = require('../../models/user');


// Return User Settings

router.post('/user/settings', async (req, res) => {
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
        return;
      }
  
      res.status(200).json({
        settings: user.settings
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err);
    }
  });
  
  // Update User Settings
  
  router.post('/user/update/settings', async (req, res) => {
    try {
      const { session, settings } = req.body;
  
      const user = await User.findOne({
        session
      });
  
      if (!user) {
        res.status(404).json({
          error: 'User Not Found'
        });
        return;
      }
      // update user in DB
      user.settings = settings;
      
      await user.save();
      res.status(200).json({
        settings
      });
  
    } catch (err) {
      res.status(500).send('Internal Server Error:' + err);
      console.error(err);
    }
  });

  // Update User Interests 

  router.post('/user/update/interests', async (req, res) => {
    try {
      const { session, interests } = req.body;
  
      const user = await User.findOne({
        session
      });
  
      if (!user) {
        res.status(404).json({
          error: 'User Not Found'
        });
        return;
      }
      // update user in DB
      user.settings.serverInterests = interests;
      await user.save();
      res.status(200).json({
        interests
      });
  
    } catch (err) {
      res.status(500).send('Internal Server Error:' + err);
      console.error(err);
    }
  });

// export the router module so that server.js file can use it
module.exports = router;