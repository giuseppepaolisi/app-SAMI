var express = require('express');
var router = express.Router();
const moment = require('moment');

const mongoose = require("mongoose");

const Reparti = require ("./../db/reparti.js");
const User = require ("./../db/user.js");
const Cliente = require ("./../db/cliente.js");


const bodyparse = require("body-parser");
const repartiController = require("../controller/repartiController");

const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');


require('dotenv').config({path: './../.env'});



/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET tables. */
router.get('/prodPocket/:reparto/:tipo?', isAdmin,async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const reparto = req.params.reparto;
  let tipo = req.params.tipo;
  
  //setta la query
  if(reparto === "imballaggio") {
    //deleted: 0
    parametri = {
        reparto: reparto,
        deleted: 0
      };
      tipo = "";
  } else {
    parametri = {
        reparto: reparto,
        tipo: tipo,
        deleted: 0
      };
  }
  
  const list = await Reparti.find(parametri).sort({data: -1}).exec();
  
    if (list.length > 0) {
      //const list = await Reparti.find({tipo:'Produzione', reparto:'produzione'}).exec(); 
      //const aheader = ['tipo', 'reparto', 'diametro', 'portata','peso', 'data','ora','macchina', 'quantita','h_lavorate','h_fermo', 'user', 'diamtero_filo','diamtero_molla','giri_molla','file', '_id'];
      /*const aheader = "nome";*/

      //prende gli header della prima occorrenza nel db ed elimina alcuni di loro.
      //let keys = Object.keys(list[0]._doc).filter(key => !['__v', 'tipo', 'reparto', 'deleted'].includes(key));
      let keys = []
      if (reparto == "produzione" && tipo == "pocket") {
        keys = ['_id', 'macchina', 'prodFilo', 'diamFilo', 'portata', 'peso', 'quantita', 'oreLav', 'oreFermo', 'cambiMacchina','data', 'user', 'note'];
      } else if (reparto == "produzione" && tipo == "bonnel") {
        keys = ['_id', 'macchina', 'prodFilo', 'giriMolla', 'diamFilo', 'peso', 'quantita', 'altezza', 'oreLav','data', 'user', 'note'];
      } else if (reparto == "assemblaggio" && tipo == "pocket") {
        keys = ['_id', 'macchina', 'cliente', 'misuraFilo', 'fileMolle', 'quantita', 'cambioTelina','oreLav', 'data', 'user', 'note'];
      } else if (reparto == "assemblaggio" && tipo == "bonnel") {
        keys = ['_id', 'macchina', 'cliente', 'misuraFilo', 'fileMolle', 'quantita', 'cambiMacchina','oreLav', 'data', 'user', 'note'];
      } else if (reparto == "imballaggio") {
        keys = ['_id', 'macchina', 'quantita', 'oreLav', 'data', 'user', 'note'];
      }

      console.log(keys); 
      console.log(list[0]);
     

      res.render('prodPocket', { title:reparto + " " +tipo,aheader:keys,list:list, reparto:reparto, tipo:tipo, moment: moment});
    
    }

});

router.delete('/eliminaMisura/:id', isAdmin,async (req, res, next) => {
  const elementId = req.params.id;
  console.log(elementId);
  // Verifica se l'ID è vuoto o nullo
  if (!elementId || elementId === "null") {
    return res.status(400).json({ message: "ID elemento non valido" });
  }
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const flag = {
    deleted : 1
  };
  Reparti.findByIdAndUpdate(elementId, flag, { new: true, runValidators: true })
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
});

router.get('/editMolleggio/:id', isAdmin,async (req, res, next) => {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const molleggio = await Reparti.find({_id: req.params.id}).exec(); 
  const users = await User.find({deleted:0}).exec();
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  options = await Cliente.find({ deleted: 0 }).sort({ ragioneSociale: 1 }).exec(); 

  console.log(req.params.id);
  console.log(molleggio[0]);
  console.log(molleggio[0].prodFilo);

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('editMolleggio', {molleggio:molleggio[0], reparto:molleggio[0].reparto, tipo:molleggio[0].tipo, macchina:molleggio[0].macchina, users: users, moment: moment, options:options});
});

router.post('/editMolleggio/:id', isAdmin,(req, res, next) => {
  console.log(req.params.id);
  repartiController.modificaMolleggio(req, res, next);
});




module.exports = router;
