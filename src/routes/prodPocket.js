var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");

const Reparti = require ("./../db/reparti.js")

const bodyparse = require("body-parser");



require('dotenv').config({path: '../env/developement.env'});



/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET tables. */
router.get('/prodPocket/:reparto/:tipo?', async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const reparto = req.params.reparto;
  let tipo = req.params.tipo;
  
  //setta la query
  if(reparto === "imballaggio") {
    parametri = {
        reparto: reparto
      };
      tipo = "";
  } else {
    parametri = {
        reparto: reparto,
        tipo: tipo
      };
  }
  
  const list = await Reparti.find({tipo:tipo, reparto:reparto}).exec();
    //if (err) {
  //    console.error(err);
  //    return;
 //   }
  
    if (list.length>0) {
      //const list = await Reparti.find({tipo:'Produzione', reparto:'produzione'}).exec(); 
      const aheader = ['tipo', 'reparto', 'diametro', 'portata','peso', 'data','ora','macchina', 'quantita','h_lavorate','h_fermo', 'user', 'diamtero_filo','diamtero_molla','giri_molla','file', '_id'];
      /*const aheader = "nome";*/

      //prende gli header della prima occorrenza nel db ed elimina alcuni di loro.
      const keys = Object.keys(list[0]._doc).filter(key => !['__v', 'tipo', 'reparto'].includes(key));

      console.log(keys); 
      console.log(list[0]);
    
      res.render('prodPocket', { title:reparto + " " +tipo,aheader:keys,list:list});
    
    }

});




module.exports = router;
