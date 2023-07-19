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
router.get('/prodPocket/:reparto/:tipo', async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const reparto = req.params.reparto;
  const tipo = req.params.tipo;
  
  const list = await Reparti.find({tipo:tipo, reparto:reparto}).exec();
    //if (err) {
  //    console.error(err);
  //    return;
 //   }
  
    if (list.length>0) {
      //const list = await Reparti.find({tipo:'Produzione', reparto:'produzione'}).exec(); 
      const aheader = ['tipo', 'reparto', 'diametro', 'portata','peso', 'data','ora','macchina', 'quantita','h_lavorate','h_fermo', 'user', 'diamtero_filo','diamtero_molla','giri_molla','file'];
      /*const aheader = "nome";*/
    
      res.render('prodPocket', { title:reparto + " " +tipo,aheader:aheader,list:list});
    
    }



  

});




module.exports = router;
