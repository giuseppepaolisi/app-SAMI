// Importa le librerie
const express = require('express');
const router = express.Router();

//const moment = require('moment');


// Gestisci richieste GET per la homepage
router.get('/calendario', (req, res) => {
  // Ottieni la data corrente
  const currentDate = moment();

  // Genera un array di oggetti per rappresentare i giorni del mese corrente
  const daysInMonth = [];
  const daysInMonthCount = currentDate.daysInMonth();
  for (let i = 1; i <= daysInMonthCount; i++) {
    const date = moment(currentDate).date(i);
    daysInMonth.push({
      dayOfMonth: i,
      dayOfWeek: date.format('dddd'),
    });
  }

  // Renderizza la pagina del calendario utilizzando il file "calendar.ejs"
  res.render('calendar.ejs', { daysInMonth });
});

