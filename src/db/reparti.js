const mongoose = require('mongoose');

const repartiSchema = new mongoose.Schema({
    tipo: String,
    fornitore: String,
    diametro: Number,
    portata: Number,
    peso: Number,
    data_ora: Date,
    macchina: String,
    quantita: Number, //molle prodotte, ecc..
    h_lavorate: Number,
    user: String,
    diametro_filo: Number,
    diametro_molla: Number,
    giri_molla: Number,
    cliente: String,
    misura: Number,
    file: Number,
});

const Reparti = mongoose.model('Reparti', repartiSchema);

module.exports = Reparti;