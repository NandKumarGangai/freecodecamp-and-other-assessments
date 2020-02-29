const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./app/index');
const middleware = require('./app/src/middlewares/index');
const dbConnect = require('./app/src/tools/mongooseConnection');

dbConnect();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/api', routes);

app.get('*', (req, res) => {
    res.status(404).send('Wrong API');
});

app.listen(4000, console.log('Server running on port 4000'));


/**
 * All response should have following structure
 * {
 *  status,
 *  
 *  body: {
 *   
 * }
 * }
 */