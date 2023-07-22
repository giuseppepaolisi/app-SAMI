var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");

const User = require ("./../db/user.js")

const bodyparse = require("body-parser");

const moment = require('moment');
moment.locale('it')
require('dotenv').config({path: '../env/developement.env'});



/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET tables. */


router.get('/calendario', async function(req, res, next) {

  const monthsData = getAllMonths();

  // Renderizza la pagina del calendario utilizzando il file "calendar.ejs"
  res.render('calendar', { year: moment().year(), months: monthsData, title: 'Calendario' });
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
      user : req.body.user,
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

router.get('/addFerie', async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const options = await User.find({deleted: 0}).exec(); 
  // Aggiungi altre opzioni se necessario

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('addFerie', {options:options});
});




router.get('/dipendenti', async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const list = await User.find({deleted: 0}).exec(); 
  const aheader = ['nome', 'cognome', 'user', 'password'];
  /*const aheader = "nome";*/

  res.render('tables', { title: 'Dipendenti',aheader:aheader,list:list});

  

});

router.get('/', async function(req, res, next) {
  res.render('index');
});



// Definisci la funzione per ottenere i giorni di tutti i mesi dell'anno corrente
function getAllMonths() {
  const currentDate = moment();
  const currentYear = currentDate.year();
  const monthsData = [];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = [];
    const firstDayOfMonth = moment({ year: currentYear, month, day: 1 });

    const daysInMonthCount = firstDayOfMonth.daysInMonth();
    for (let i = 1; i <= daysInMonthCount; i++) {
      const date = moment(firstDayOfMonth).date(i);
      daysInMonth.push({
        dayOfMonth: i,
        dayOfWeek: date.format('dddd'),
      });
    }

    monthsData.push({
      month: firstDayOfMonth.format('MMMM'),
      year: currentYear,
      daysInMonth,
    });
  }

  return monthsData;
}



module.exports = router;
