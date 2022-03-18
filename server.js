const express = require('express');
const dotenv = require('dotenv');
const bodyParser= require('body-parser')
const mongoose = require('mongoose');
const routes = require('./routes');

dotenv.config();

const app = express();

const uri = process.env.MONGOSTRING;
mongoose.connect(uri, (err) => {
    if(err) {
        console.log("Error connecting mongodb", err);
        return;
    }
    console.log('Connected to database');
})

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes);

app.listen(8000, () => {
    console.log('listening on 8000')
})