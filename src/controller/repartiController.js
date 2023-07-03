const Reparti = require('../db/reparti');
const mongoose = require('mongoose');
const moment = require('moment');
require('moment/locale/it'); // Imposta la localizzazione italiana per Moment.js

const repartiController = {}; //consente di esportare le funzioni

repartiController.insertMolleggi = (req, res) => {
    const data = {
        tipo: req.body.tipo,
        reparto: req.body.reparto,
        fornitore: req.body.prodfilo,
        diametro: parseFloat(req.body.diamFilo),
        portata: parseFloat(req.body.portata),
        peso: parseFloat(req.body.peso),
        data: moment(req.body.date, 'DD-MM-YYYY').toDate(),
        ora: moment(req.body.time, 'HH:mm').toDate(),
        macchina: req.body.macchina,
        quantita: parseInt(req.body.qtaMolle),
        h_lavorate: parseInt(req.body.oreLav),
        h_fermo: parseInt(req.body.oreFermo),
        user: 'rcastagna',
        diametro_filo: parseFloat(req.body.diamFilo),
        diametro_molla: parseFloat(req.body.diamFilo),
        giri_molla: parseInt(req.body.giriMolla),
        file: parseInt(req.body.fileMolle)
    };
    try {
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const molleggi = new Reparti(data);
        molleggi.save();
    } catch (error) {
        console.error("errore "+error);
        return res.redirect('/reparti'); //errore
      }
    res.status(200).send("ok");
};


  module.exports = repartiController;