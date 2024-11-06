const mongoose = require('mongoose');

const produttoreSchema = new mongoose.Schema({
  nome: String,
});

const Produttore = mongoose.model('Produttore', produttoreSchema);

module.exports = Produttore;
