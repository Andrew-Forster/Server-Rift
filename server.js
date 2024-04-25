const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb://localhost:27017";

// Models
const User = require('./models/user');

// Routes
const userRoutes = require('./routes/users');
const userSettings = require('./routes/user-settings');
const { default: mongoose } = require('mongoose');

// Database

mongoose.connect(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Database connection failed', err);
});

app.use('/auth', userRoutes);
app.use('/u-s', userSettings);

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running at http://localhost:' + port);
});

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});