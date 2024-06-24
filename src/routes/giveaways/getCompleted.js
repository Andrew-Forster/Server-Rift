const express = require('express');
const router = express.Router();
const cgs = require('../../models/completedGiveaways');


router.post('/getCompleted', async (req, res) => {

    try {
        const {
            id
        } = req.body;

        const giveaway = await cgs.findOne({
            id
        });
        if (!giveaway) {
            return res.status(404).json({
                message: "Giveaway not found"
            });
        }
        return res.status(200).json({
            giveaway
        });
    } catch (err) {
        console.log("[server]" + err);

        return res.status(500).json({
            message: err.message
        });

    };

});

// export the router module so that server.js file can use it
module.exports = router;