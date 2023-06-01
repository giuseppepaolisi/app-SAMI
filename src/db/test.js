const express = require('express');
//import express from 'express';
const app = express();
//const reparti = require("../db/reparti.js");
//const connection = require('../confing/db_connection');
//const test_mongo = require('../confing/test_mongo');
//require("../confing/conn.js");
const User = require("./user");
const mongoose = require('mongoose');
//import mongoose from 'mongoose';
//import User from './user.js';
require('dotenv').config({path: '../env/developement.env'});
/*import dotenv from 'dotenv';
dotenv.config({path: '../env/developement.env'});*/

app.get('/', async (req, res) => {
    //test_mongo.showElements();
    //reparti.showElements();
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const user = new User({
        nome: "maria",
        cognome: "ciao"
    });

    //await user.save();
    const element = await User.find({}).exec();
    console.log
    ("user: " + element);
    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server avviato sulla porta 3000'));
