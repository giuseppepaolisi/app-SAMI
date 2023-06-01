const mongoose = require('mongoose');
//import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nome: String,
    cognome: String,
    user: String,
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;