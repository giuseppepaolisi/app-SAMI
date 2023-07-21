const mongoose = require('mongoose');

const repartiSchema = new mongoose.Schema({
    tipo: String,
    reparto: String,
    fornitore: String,
    diametro: Number,
    portata: Number,
    peso: Number,
    data: Date,
    macchina: String,
    quantita: Number, //molle prodotte, ecc..
    h_lavorate: Number,
    h_fermo: Number,
    user: String,
    diametro_filo: Number,
    diametro_molla: Number,
    giri_molla: Number,
    cliente: String,
    misura: Number,
    file: String,
    deleted: Boolean
});

const Reparti = mongoose.model('Reparti', repartiSchema);

module.exports = Reparti;