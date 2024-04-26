const express = require('express');
const router = express.Router();

// Return User Settings

router.post('/getUserSettings', async (req, res) => {
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
  
      res.status(200).json({
        settings: user.settings
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Update User Settings
  
  router.post('/updateUserSettings', async (req, res) => {
    try {
      const { session, settings } = req.body;
  
      const user = await User.findOne({
        session
      });
  
      if (!user) {
        res.status(404).json({
          error: 'User Not Found'
        });
      }
  
      user.settings = settings;
  
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

// export the router module so that server.js file can use it
module.exports = router;