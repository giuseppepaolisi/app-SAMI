const Ferie = require("../model/ferie.js");
const User = require("../model/user");
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
    const note = req.body.noteFerie;
    //let deleted = false;
    


    const ferie = new Ferie({
        nome: nome,
        cognome: cognome,
        dataInizio:dataInizio,
        dataFine:dataFine,
        tipologia : tipologia,
        note : note,
        deleted : 0

    });

    await ferie.save();

    res.redirect('/conferma');
};

ferieController.deleteFerie = async (req, res, next) => {
    const elementId = req.params.id;
    console.log(elementId);
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const flag = {
        deleted : 1
        };
        Ferie.findByIdAndUpdate(elementId, flag, { new: true, runValidators: true })
        .then((flag) => {
            if(flag) {
            console.log('Elemento aggiornato:', flag);
            res.json({ message: "Elemento eliminato con successo" });
            } else {
            console.log('Elemento non trovato.');
            }
        }).catch((errore) => {
            console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
            res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
        });
};

module.exports = ferieController;