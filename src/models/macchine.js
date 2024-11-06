const mongoose = require('mongoose');
//import mongoose from "mongoose";

const macchineSchema = new mongoose.Schema({
  macchina: String,
  reparto: String,
  tipo: String,
  molleOre: Number,
  deleted: Boolean,
});

const Macchine = mongoose.model('Macchine', macchineSchema);

module.exports = Macchine;
