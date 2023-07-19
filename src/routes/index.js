var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");

const User = require ("./../db/user.js")

const bodyparse = require("body-parser");



require('dotenv').config({path: '../env/developement.env'});



/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET tables. */
router.get('/dipendenti', async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const list = await User.find({}).exec(); 
  const aheader = ['nome', 'cognome', 'user', 'password'];
  /*const aheader = "nome";*/

  res.render('tables', { title: 'Dipendenti',aheader:aheader,list:list});

  

});


/*router.post('/addUser', async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


  const nome = req.body.nome;
  const cognome = req.body.cognome;
  const user = req.body.user;
  const password = req.body.password;



  console.log("WEEEEEEEEEEEEEE ", req.bodyparse);

  const utente = new User({
    nome: nome,
    cognome: cognome,
    user:user,
    password:password,
    admin : false

  });

  //await utente.save();

  /*res.render('tables', { title: 'Dipendenti',aheader:aheader,list:list});

  

}); */


module.exports = router;
