var express = require('express');
var router = express.Router();
const employee = require('../controller/employeeController');
const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');
const mongoose = require('mongoose');
const User = require("./../db/user.js");

/* GET users listing. */
router.get('/', isAdmin, function(req, res, next) {
  res.render('index');
});

router.get('/lista', async function(req, res, next) {
  employee.getEmployees(req, res,next);
}); 

router.post('/addUser', async (req, res, next) => {
  employee.addEmployee(req, res, next);

});

router.delete('/eliminaDipendente/:id', async (req, res, next) => {
  const elementId = req.params.id;
  console.log(elementId);
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const flag = {
      deleted : 1
    };
    User.findByIdAndUpdate(elementId, flag, { new: true, runValidators: true })
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

router.get('/addUser', async function(req, res, next) {


  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('addUser');
});

router.get('/editUser/:id', async function(req, res, next) {

  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.find({_id: req.params.id}).exec(); 

  console.log(user.nome + "ECCOMIIIII");

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('editUser', {user:user[0]});
});

router.post('/editUser/:id', async function(req, res, next) {

  const elementId = req.params.id;
  console.log(elementId);
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const editingUser = {
      nome : req.body.nome,
      cognome : req.body.cognome,
      password : req.body.password
    };
    User.findByIdAndUpdate(elementId, editingUser, { new: true, runValidators: true })
      .then((editingUser) => {
        if(editingUser) {
          console.log('Elemento aggiornato:', editingUser);
          res.redirect('/dipendenti');
        } else {
          console.log('Elemento non trovato.');
        }
      }).catch((errore) => {
        console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
        //res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
      });

});

module.exports = router;
