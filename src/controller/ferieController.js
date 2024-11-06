const Ferie = require("../models/ferie");
const User = require("../models/user");
const moment = require('moment');

/**
 * Restituisce i dati di tutti i mesi per un anno specificato.
 * @param {number} year - L'anno per cui generare i dati dei mesi.
 * @returns {Array} Un array contenente i dati di ogni mese, inclusi i giorni e i nomi dei giorni.
 */
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
  
  /**
   * Mostra la pagina per modificare i dati di una richiesta ferie per un dipendente.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getEditFeriePage: async (req, res, next) => {
    const ferie = await Ferie.findById(req.params.id);
    res.render('editFerie', { ferie });
  },

  /**
   * Aggiorna di una richiesta di ferie per un dipendente.
   * @param {Object} req - La richiesta Express contenente i nuovi dati.
   * @param {Object} res - La risposta Express.
   */
  updateFerie: async (req, res, next) => {
    const { dataInizio, dataFine, isFerie } = req.body;
    try {
      const ferie = await Ferie.findByIdAndUpdate(req.params.id, 
      { dataInizio, dataFine, tipologia: isFerie }, 
      { new: true, runValidators: true });
      if (ferie) {
        res.redirect('/showFerie');
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'elemento:', error);
    }
  },

  /**
   * Mostra la pagina per aggiungere una nuova richiesta ferie.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getAddFeriePage: async (req, res, next) => {
    const options = await User.find({ deleted: 0 });
    res.render('addFerie', { options });
  },

  /**
   * Aggiunge una nuova richiesta ferie al database.
   * @param {Object} req - La richiesta Express con i dati della nuova richiesta.
   * @param {Object} res - La risposta Express.
   */
  addFerie: async (req, res, next) => {
    const { opzione, dataInizio, dataFine, isFerie, noteFerie } = req.body;
    try {
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
    } catch (error) {
      console.error("Errore durante l'inserimento della richiesta ferie:", error);
    }
  },

  /**
   * Elimina una richiesta ferie.
   * @param {Object} req - La richiesta Express contenente l'ID dell'elemento.
   * @param {Object} res - La risposta Express.
   */
  deleteFerie: async (req, res, next) => {
    try {
      const ferie = await Ferie.findByIdAndUpdate(req.params.id, { deleted: 1 }, { new: true });
      if (ferie) {
        res.json({ message: "Elemento eliminato con successo" });
      } else {
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione della richiesta ferie:", error);
      res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
  },

  /**
   * Mostra tutte le ferie in formato tabella.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  showFerie: async (req, res, next) => {
    try {
      const list = await Ferie.find({ deleted: 0 });
      const aheader = ['nome', 'cognome', 'dataInizio', 'dataFine', 'tipologia', 'note'];
      res.render('tableFerie', { title: 'Ferie', aheader, list, moment });
    } catch (error) {
      console.error("Errore nel recupero delle richieste ferie:", error);
      res.redirect('/');
    }
  },

  /**
   * Mostra il calendario annuale con tutte le ferie.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getCalendarPage: async (req, res, next) => {
    try {
      const options = await Ferie.find({ deleted: 0 });
      const monthsData = getAllMonths(moment().year());
      res.render('calendar', { year: moment().year(), months: monthsData, title: 'Calendario', options });
    } catch (error) {
      console.error("Errore nel caricamento della pagina calendario:", error);
      res.redirect('/');
    }
  },

  /**
   * Mostra la pagina di conferma dopo l'aggiunta di una richiesta ferie.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getConfirmaPage: async (req, res, next) => {
    res.render('conferma');
  }
};

module.exports = ferieController;
