const Ferie = require("../model/ferie");
const User = require("../model/user");
const moment = require('moment');

function getAllMonths(year) {
    const monthsData = [];
    for (let month = 0; month < 12; month++) {
      const daysInMonth = [];
      const firstDayOfMonth = moment({ year, month, day: 1 });
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
        year,
        daysInMonth,
      });
    }
    return monthsData;
  }

const ferieController = {
  getEditFeriePage: async (req, res, next) => {
    const ferie = await Ferie.findById(req.params.id);
    res.render('editFerie', { ferie });
  },

  updateFerie: async (req, res, next) => {
    const { dataInizio, dataFine, isFerie } = req.body;
    const ferie = await Ferie.findByIdAndUpdate(req.params.id, { dataInizio, dataFine, tipologia:isFerie }, { new: true, runValidators: true });
    if (ferie) {
      res.redirect('/showFerie');
    } else {
      console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
    }
  },

  getAddFeriePage: async (req, res, next) => {
    const options = await User.find({ deleted: 0 });
    res.render('addFerie', { options });
  },

  addFerie: async (req, res, next) => {
    const { opzione, dataInizio, dataFine, isFerie, noteFerie } = req.body;
    const user = await User.findOne({ user: opzione });
    if (!user) {
      return res.status(400).send('Utente non trovato');
    }
    const ferie = new Ferie({
      nome: user.nome,
      cognome: user.cognome,
      dataInizio,
      dataFine,
      tipologia: isFerie,
      note: noteFerie,
      deleted: 0
    });
    await ferie.save();
    res.redirect('/conferma');
  },

  deleteFerie: async (req, res, next) => {
    const ferie = await Ferie.findByIdAndUpdate(req.params.id, { deleted: 1 }, { new: true });
    if (ferie) {
      res.json({ message: "Elemento eliminato con successo" });
    } else {
      res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
  },

  showFerie: async (req, res, next) => {
    const list = await Ferie.find({ deleted: 0 });
    const aheader = ['nome', 'cognome', 'dataInizio', 'dataFine', 'tipologia', 'note'];
    res.render('tableFerie', { title: 'Ferie', aheader, list, moment: moment });
  },

  getCalendarPage: async (req, res, next) => {
    const options = await Ferie.find({ deleted: 0 });
    const monthsData = getAllMonths(moment().year());
    res.render('calendar', { year: moment().year(), months: monthsData, title: 'Calendario', options });
  },

  getConfirmaPage: async (req, res, next) => {
    res.render('conferma');
  }
};

module.exports = ferieController;