var express = require('express');
var router = express.Router();
const employee = require('../controller/employeeController');
const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');
const mongoose = require('mongoose');
const User = require("./../model/user.js");
const employeeController = require('../controller/employeeController');
const ferieController = require('../controller/ferieController');
const Ferie = require('../model/ferie');

//permette di cancellare un dipendente dal sistema
router.delete('/eliminaFerie/:id', isAdmin,async (req, res, next) => {
  ferieController.deleteFerie(req, res, next);
});


//permette di visualizzare la pagina di modifica dati per un untente
router.get('/editFerie/:id', isAdmin,async function(req, res, next) {

  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const ferie = await Ferie.find({_id: req.params.id}).exec(); 

  //console.log(user.nome + "ECCOMIIIII");

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('editFerie', {ferie:ferie[0]});
});

//permette di modificare i dati riguardanti un utente
router.post('/editFerie/:id', isAdmin,async function(req, res, next) {

  const elementId = req.params.id;
  console.log(elementId);
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const editingFerie = {
      dataInizio : req.body.dataInizio,
      dataFine : req.body.dataFine,
      tipologia: req.body.isFerie
    };
    Ferie.findByIdAndUpdate(elementId, editingFerie, { new: true, runValidators: true })
      .then((editingFerie) => {
        if(editingFerie) {
          console.log('Elemento aggiornato:', editingFerie);
          res.redirect('/showFerie');
        } else {
          console.log('Elemento non trovato.');
        }
      }).catch((errore) => {
        console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
        //res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
      });

});

module.exports = router;
