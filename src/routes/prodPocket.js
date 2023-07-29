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


require('dotenv').config({path: '../env/developement.env'});



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
  
  const list = await Reparti.find(parametri).exec();
  
    if (list.length > 0) {
      //const list = await Reparti.find({tipo:'Produzione', reparto:'produzione'}).exec(); 
      //const aheader = ['tipo', 'reparto', 'diametro', 'portata','peso', 'data','ora','macchina', 'quantita','h_lavorate','h_fermo', 'user', 'diamtero_filo','diamtero_molla','giri_molla','file', '_id'];
      /*const aheader = "nome";*/

      //prende gli header della prima occorrenza nel db ed elimina alcuni di loro.
      const keys = Object.keys(list[0]._doc).filter(key => !['__v', 'tipo', 'reparto', 'deleted'].includes(key));

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

  console.log(req.params.id);
  console.log(molleggio[0]);
  console.log(molleggio[0].data);

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('editMolleggio', {molleggio:molleggio[0], reparto:molleggio[0].reparto, tipo:molleggio[0].tipo, macchina:molleggio[0].macchina, users, users, moment: moment});
});

router.post('/editMolleggio/:id', isAdmin,(req, res, next) => {
  console.log(req.params.id);
  repartiController.modificaMolleggio(req, res, next);
});




module.exports = router;
