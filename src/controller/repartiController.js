const Reparti = require('../db/reparti');
const mongoose = require('mongoose');
const {getData} = require('../middleware/user-auth');

const repartiController = {}; //consente di esportare le funzioni

checkData = (data) => {
    if(data === '' || typeof data === 'undefined')
        return false;
    else
        return true;
};

createData = (postData, token) => {
    let data = {};
    if(checkData(postData.tipo)) data.tipo = postData.tipo;
    if(checkData(postData.reparto)) data.reparto = postData.reparto;
    if(checkData(postData.prodfilo)) data.fornitore = postData.prodfilo;
    if(checkData(postData.diamFilo)) data.diametro = parseFloat(postData.diamFilo);
    if(checkData(postData.portata)) data.portata = parseFloat(postData.portata);
    if(checkData(postData.peso)) data.peso = parseFloat(postData.peso);
    data.data = new Date();
    if(checkData(postData.macchina)) data.macchina = postData.macchina;
    if(checkData(postData.qtaMolle)) data.quantita = parseInt(postData.qtaMolle);
    if(checkData(postData.oreLav)) data.h_lavorate = parseInt(postData.oreLav);
    //if(checkData(postData.oreFermo)) data.h_fermo = parseInt(postData.oreFermo);

    console.log('user: ' + token.user);
    data.user = token.user;
    
    if(checkData(postData.diamFilo)) data.diametro_filo = parseFloat(postData.diamFilo);
    if(checkData(postData.diamFilo)) data.diametro_molla = parseFloat(postData.diamFilo);
    if(checkData(postData.giriMolla)) data.giri_molla = parseInt(postData.giriMolla);
    if(checkData(postData.fileMolle)) data.file = postData.fileMolle;
    data.deleted = 0;
    console.log(data);

    return data;
};

repartiController.insertMolleggi = (req, res) => {
    try {
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const molleggi = new Reparti(createData(req.body, getData(req.cookies.token)));
        molleggi.save();
    } catch (error) {
        console.error("errore "+error);
        return res.redirect('/reparti'); //errore
      }
    res.status(200);
    res.render("dipendente/postInsert.ejs");
};

repartiController.modificaMolleggio = (req, res, next ) => {
    const elementId = req.params.id;
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const data = createData(req.body, req.body);
    Reparti.findByIdAndUpdate(elementId, data, { new: true, runValidators: true })
    .then((data) => {
        if(data) {
            console.log('Elemento aggiornato:', data);
            if(typeof data.tipo === undefined){
                res.redirect("/prodPocket/" + data.reparto);
            } else {
                res.redirect("/prodPocket/" + data.reparto + "/" + data.tipo);
            }
        } else {
        console.log('Elemento non trovato.');
        }
    }).catch((errore) => {
        console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    });
};


  module.exports = repartiController;