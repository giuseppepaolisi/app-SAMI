const mongoose = require('mongoose');

const ferieSchema = new mongoose.Schema({
    nome: String,
    cognome: String,
    dataInizio: Date,
    dataFine: Date,
    tipologia:String,
    deleted: Boolean
});

const Ferie = mongoose.model('Ferie', ferieSchema);

module.exports = Ferie;