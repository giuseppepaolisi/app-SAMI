const mongoose = require('mongoose');
//import mongoose from "mongoose";

const macchineSchema = new mongoose.Schema({
    macchina: String,
    reparto: String,
    tipo: String,
    ore: Number
});

const Macchine = mongoose.model('Macchine', macchineSchema);

module.exports = Macchine;