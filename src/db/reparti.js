const mongoose = require('mongoose');

const repartiSchema = new mongoose.Schema({

    tipo: String,
    reparto: String,
    prodFilo: String,
    cliente : String,
    misuraFilo: String,
    fileMolle: String,
    qtaMolle: Number,
    giriMolla: Number,
    diamFilo: Number,
    portata: Number,
    peso: Number,
    quantita: Number, //nMolleProdotte
    oreLav: Number,
    oreFermo: String,
    cambiMacchina: Number,
    macchina: String,
    
    user: String,
    data: Date,

    deleted: Boolean,
    note: {
        type: String,
        maxlength: 255,
    },
    altezza: Number,
    cambioTelina: Number

});

const Reparti = mongoose.model('Reparti', repartiSchema);

module.exports = Reparti;