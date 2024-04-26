const express = require('express');
const path = require('path');
const app = express();
const uri = "mongodb://localhost:27017";
const mongoose = require('mongoose'); 

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
app.use('/auth', routes);

app.use('',express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running at http://localhost:' + port);
});