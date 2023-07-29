const Ferie = require("../db/ferie.js");
const User = require("../db/user");
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
    const user = await User.find({user:req.body.opzione}).exec();

    const nome = user[0].nome;
    const cognome = user[0].cognome;
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

    res.redirect('/conferma');
};

module.exports = ferieController;