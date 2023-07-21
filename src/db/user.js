const mongoose = require('mongoose');
//import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nome: String,
    cognome: String,
    user: String,
    password: String,
    admin: Boolean,
    deleted: Boolean //false non è cancellato true è stato cancellato
});

const User = mongoose.model('User', userSchema);

module.exports = User;