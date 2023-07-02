const mongoose = require('mongoose');
//import mongoose from "mongoose";

const macchineSchema = new mongoose.Schema({
    macchina: String,
    reparto: String,
    tipo: String,
});

const Macchine = mongoose.model('Macchine', macchineSchema);

module.exports = Macchine;