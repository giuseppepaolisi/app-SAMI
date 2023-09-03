const Cliente = require("../db/cliente.js");
const User = require("../db/user");
const mongoose = require('mongoose');

const ClienteController = {};

ClienteController.getCliente = async (req, res, next) => {
    const uri = process.env.DB_URI || "";
    console.log("uri: "+ uri);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("\n\nLista");
    console.log(await Cliente.find({deleted: 0}).exec());
    //res.render('addCliente', { title: 'Lista' });
};

ClienteController.addCliente= async (req, res, next) => {
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   // const user = await User.find({user:req.body.opzione}).exec();

    const ragioneSociale = req.body.ragioneSociale;
    const tipologia = req.body.isCliente;
    //let deleted = false;
    


    const cliente = new Cliente({
        ragioneSociale:ragioneSociale,
        tipologia : tipologia,
        deleted : 0

    });

    await cliente.save();

    res.redirect('/showCliente');
};

ClienteController.deleteCliente = async (req, res, next) => {
    console.log("SONO NEL CONTROLLER DI CLIENTE\n")
    const elementId = req.params.id;
    console.log(elementId);
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const flag = {
        deleted : 1
        };
        Cliente.findByIdAndUpdate(elementId, flag, { new: true, runValidators: true })
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

module.exports = ClienteController;