const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

var subMq = require('./rabbit/sub'),
    pubMq = require('./rabbit/pub');


app.use(morgan('dev'));
app.use(bodyParser.json());


subMq.Consume('convTestStream', 'testQueue', 'xPassKey', (message) => {
    console.log(message.content.toString());
});

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin X-Requested-With, Content-Type, Accept, Authorization');
    
    if(req.header === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET', 'POST');
        return res.status(200).json({});
    }

    next();
});



app.use((req, res, next) => {
    if(req.method == 'POST') {
        console.log('sent post request');
    }

    if(req.method == 'GET') {
        console.log('sent get request');
    }

});

module.exports = app;