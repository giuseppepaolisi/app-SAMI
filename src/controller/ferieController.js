const Ferie = require("../db/ferie.js");
const mongoose = require('mongoose');

const ferieController = {};

ferieController.getFerie = async (req, res, next) => {
    const uri = process.env.DB_URI || "";
    console.log("uri: "+ uri);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("\n\nLista");
    console.log(await Ferie.find({deleted: 0}).exec());
    //res.render('addFerie', { title: 'Lista' });
};

ferieController.addFerie= async (req, res, next) => {
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const nome = req.body.opzione;
    const cognome = req.body.opzione;
    const dataInizio = req.body.dataInizio;
    const dataFine = req.body.dataFine;
    const tipologia = req.body.isFerie;
    //let deleted = false;
    


    const ferie = new Ferie({
        nome: nome,
        cognome: cognome,
        dataInizio:dataInizio,
        dataFine:dataFine,
        tipologia : tipologia,
        deleted : 0

    });

    await ferie.save();

    res.redirect('/showFerie');
};

module.exports = ferieController;