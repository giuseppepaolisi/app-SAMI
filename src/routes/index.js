var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const User = require ("./../db/user.js");
const Ferie = require ("./../db/ferie.js");
const Cliente = require ("./../db/cliente.js");
const ferie = require('../controller/ferieController');
const cliente = require('../controller/clienteController');
const repartiController = require('../controller/repartiController');
const macchineController = require('../controller/macchineController');

const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');

const bodyparse = require("body-parser");

const moment = require('moment');
moment.locale('it')
require('dotenv').config({path: '../env/developement.env'});


router.get('/prova',isAdmin, async (req, res) => {
  res.status(200).json(await repartiController.getTotalByMOnth('produzione','pocket'));
  
  });


/* GET Calendario */

router.get('/calendario', isAdmin,async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const options = await Ferie.find({deleted: 0}).exec(); 

  const monthsData = getAllMonths();

  // Renderizza la pagina del calendario utilizzando il file "calendar.ejs"
  res.render('calendar', { year: moment().year(), months: monthsData, title: 'Calendario', options:options });
});

/* GET form aggiunta Macchine */
router.get('/addMacchina',isAdmin, async function(req, res, next) {

  res.render('addMacchina');
});
/* POST aggiunta Macchine */
router.post('/addMacchina', isAdmin,(req, res, next) => {
  
  macchineController.addMacchine(req, res, next);
});

 // Aggiugni Ferie
router.get('/addFerie', isAdmin, async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const options = await User.find({deleted: 0}).exec(); 
  res.render('addFerie', {options:options});
});

router.post('/addFerie', isAdmin,async function(req, res, next) {
  ferie.addFerie(req, res, next);
});

// Aggiungi Cliente
router.post('/addCliente', isAdmin,async function(req, res, next) {
  cliente.addCliente(req, res, next);
});

router.get('/conferma', isAdmin,async function(req, res, next) {
  res.render('conferma');
});

router.get('/addCliente', isAdmin,async function(req, res, next) {
  res.render('addCliente');
});

router.get('/showCliente', isAdmin,async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const list = await Cliente.find({deleted: 0}).exec(); 
  const aheader = ['ragioneSociale', 'tipologia'];
  /*const aheader = "nome";*/

  res.render('tableCliente', { title: 'Cliente',aheader:aheader,list:list, moment:moment});

});




router.get('/dipendenti', isAdmin,async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const list = await User.find({deleted: 0}).exec(); 
  const aheader = ['nome', 'cognome', 'user', 'password'];
  /*const aheader = "nome";*/

  res.render('tables', { title: 'Dipendenti',aheader:aheader,list:list});

  

});

router.get('/showFerie',isAdmin, async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const list = await Ferie.find({deleted: 0}).exec(); 
  const aheader = ['nome', 'cognome', 'dataInizio', 'dataFine', 'tipologia'];
  /*const aheader = "nome";*/

  res.render('tableFerie', { title: 'Ferie',aheader:aheader,list:list, moment:moment});

});

router.get('/', isAdmin, async function(req, res, next) {
  const totalMolleMese = await repartiController.getTotal("produzione", "pocket", "m");
  console.log(totalMolleMese);

  const totalMolleGiorno = await repartiController.getTotal("produzione", "pocket", "g");
  console.log(totalMolleGiorno);

  res.render('index', {totG: totalMolleGiorno, totM: totalMolleMese});
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

router.get('/getTotalForSelectedDay', isAdmin, async (req, res, next) => {
  const selectedDate = req.query.date;
  let totale = await repartiController.getTotalForDay("produzione", "pocket", selectedDate);
  console.log(totale);
  console.log(new Date(selectedDate));
  res.json({ total: totale });
});



module.exports = router;
