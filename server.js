// TODO: Secure API Endpoints with JWT
// TODO: - Use validation
// TODO: - Use rate limiting
// TODO: - Use secure headers 

// TODO: Change the way user tokens are generated, currently it is not secure


const express = require('express');
const path = require('path');
const app = express();
const uri = "mongodb://localhost:27017";
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');

const startBot = require('./bot').startBot;

// Middleware

app.use(bodyParser.json());

// Models
const user = require('./src/models/user');

// Database

mongoose.connect(uri, {
    serverApi: {
        version: '1', 
        strict: true,
        deprecationErrors: true,
    },
    family: 4,
})
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Database connection failed: ', err);
});

// Routes
const routes = require('./src/routes/main-router');
app.use('/', routes);

app.use('', express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});


const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN || 'http://localhost:' + port;

app.listen(port, () => {
    console.log('Server is running at ' + domain );
});


// Export the Mongoose connection
module.exports = mongoose.connection;




// Start the discord bot
try {
    startBot();
} catch (error) {
    console.log('[Bot Failed to Start] ' + error);
}

 