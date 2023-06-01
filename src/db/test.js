const express = require('express');
const app = express();
//const connection = require('../confing/db_connection');
const test_mongo = require('../confing/test_mongo');

const { MongoClient } = require("mongodb");
require('dotenv').config({path: '../env/developement.env'});


app.get('/', (req, res) => {
});

app.listen(3000, () => console.log('Server avviato sulla porta 3000'));
