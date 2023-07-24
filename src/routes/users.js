var express = require('express');
var router = express.Router();
const employee = require('../controller/employeeController');
const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');
const mongoose = require('mongoose');
const User = require("./../db/user.js");
const employeeController = require('../controller/employeeController');

/* GET users listing. */
router.get('/', isAdmin, function(req, res, next) {
  res.render('index');
});

router.get('/lista', async function(req, res, next) {
  employee.getEmployees(req, res,next);
}); 

//permette di aggiungere un dipendente al sistema
router.post('/addUser', async (req, res, next) => {
  employee.addEmployee(req, res, next);

});

//permette di visualizzare la pagina per aggiungere un nuovo dipendente
router.get('/addUser', async function(req, res, next) {
  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('addUser');
});

//permette di cancellare un dipendente dal sistema
router.delete('/eliminaDipendente/:id', async (req, res, next) => {
  employeeController.deleteEmployee(req, res, next);
});

//permette di visualizzare la pagina di modifica dati per un untente
router.get('/editUser/:id', async function(req, res, next) {

  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.find({_id: req.params.id}).exec(); 

  console.log(user.nome + "ECCOMIIIII");

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('editUser', {user:user[0]});
});

//permette di modificare i dati riguardanti un untente
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
