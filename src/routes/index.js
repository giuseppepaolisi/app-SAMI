var express = require('express');
var router = express.Router();
const repartiController = require('../controllers/repartiController/repartiController');

const {
  verifyToken,
  isAdmin,
  signToken,
  deleteToken,
} = require('../middleware/user-auth');

const bodyparse = require('body-parser');

const moment = require('moment');
moment.locale('it');

// Home page (Dashboard)
/*router.get('/', isAdmin, (req, res, next) => {
  res.render('index');
});*/

// grafico molle pocket
router.get('/prova', isAdmin, async (req, res) => {
  res
    .status(200)
    .json(await repartiController.getTotalByMonth('produzione', 'pocket'));
});

// Dashboard
router.get('/', isAdmin, async function (req, res, next) {
  const totalMolleMese = await repartiController.getTotal(
    'produzione',
    'pocket',
    'm'
  );

  const totalMolleGiorno = await repartiController.getTotal(
    'produzione',
    'pocket',
    'g'
  );

  res.render('index', { totG: totalMolleGiorno, totM: totalMolleMese });
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
  let totale = await repartiController.getTotalForDay(
    'produzione',
    'pocket',
    selectedDate
  );
  console.log(totale);
  console.log(new Date(selectedDate));
  res.json({ total: totale });
});

module.exports = router;
