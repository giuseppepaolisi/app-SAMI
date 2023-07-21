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

router.get('/addFerie', async function(req, res, next) {
  const options = [
  { value: 'opzione1', label: 'Opzione 1' },
  { value: 'opzione2', label: 'Opzione 2' },
  { value: 'opzione3', label: 'Opzione 3' },
  // Aggiungi altre opzioni se necessario
];

  // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
  res.render('addFerie', {options});
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
