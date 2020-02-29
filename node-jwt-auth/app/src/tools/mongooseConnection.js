const mongoose = require('mongoose');

function dbConnect() {
    return mongoose.connect(
        'mongodb://localhost:27017/tendays',
        { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
    ).then(() => console.log('Connected to database....'))
        .catch((err) => console.log('Error connecting to Database: ', err));
}

module.exports = dbConnect;