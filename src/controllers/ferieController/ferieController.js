const Ferie = require("../../models/ferie");
const User = require("../../models/user");
const moment = require("moment");

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
        dayOfWeek: date.format("dddd"),
      });
    }

    monthsData.push({
      month: firstDayOfMonth.format("MMMM"),
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
    try {
        const ferie = await Ferie.findById(req.params.id);
        if (!ferie) {
            return res.status(404).render("error", { message: "Richiesta ferie non trovata", error: {status: 404} });
        }
        res.render("editFerie", { ferie });
    } catch (error) {
        console.error("Errore nel caricamento della pagina di modifica ferie:", error);
        res.status(500).render("error", { message: "Errore nel caricamento della pagina di modifica ferie", error });
    }
  },

  /**
   * Aggiorna di una richiesta di ferie per un dipendente.
   * @param {Object} req - La richiesta Express contenente i nuovi dati.
   * @param {Object} res - La risposta Express.
   */
  updateFerie: async (req, res, next) => {
    const { dataInizio, dataFine, isFerie } = req.body;
    try {
      const ferie = await Ferie.findByIdAndUpdate(
        req.params.id,
        { dataInizio, dataFine, tipologia: isFerie },
        { new: true, runValidators: true }
      );
      if (ferie) {
        // Reindirizza alla prima pagina della tabella ferie dopo l'aggiornamento
        res.redirect("/showFerie?page=1");
      } else {
        res.status(404).render("error", { message: "Richiesta ferie non trovata per l'aggiornamento", error: {status: 404} });
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento della richiesta ferie:", error);
      res.status(500).render("error", { message: "Errore durante l'aggiornamento della richiesta ferie", error });
    }
  },

  /**
   * Mostra la pagina per aggiungere una nuova richiesta ferie.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getAddFeriePage: async (req, res, next) => {
    try {
        const options = await User.find({ deleted: 0 });
        res.render("addFerie", { options });
    } catch (error) {
        console.error("Errore nel caricamento della pagina di aggiunta ferie:", error);
        res.status(500).render("error", { message: "Errore nel caricamento della pagina di aggiunta ferie", error });
    }
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
        // È meglio renderizzare una pagina di errore o reindirizzare con un messaggio
        return res.status(400).render("error", { message: "Utente non trovato per l'inserimento ferie", error: {status: 400} });
      }
      const ferie = new Ferie({
        nome: user.nome,
        cognome: user.cognome,
        dataInizio,
        dataFine,
        tipologia: isFerie,
        note: noteFerie,
        deleted: 0,
      });
      await ferie.save();
      // Non reindirizzare a /conferma se /conferma non gestisce la paginazione o non è una tabella
      // Reindirizziamo alla tabella delle ferie, prima pagina
      res.redirect("/showFerie?page=1"); 
    } catch (error) {
      console.error(
        "Errore durante l'inserimento della richiesta ferie:",
        error
      );
      res.status(500).render("error", { message: "Errore durante l'inserimento della richiesta ferie", error });
    }
  },

  /**
   * Elimina una richiesta ferie.
   * @param {Object} req - La richiesta Express contenente l'ID dell'elemento.
   * @param {Object} res - La risposta Express.
   */
  deleteFerie: async (req, res, next) => {
    try {
      const elementId = req.params.id;
      if (!elementId || elementId === "null") {
        return res.status(400).json({ message: "ID elemento non valido" });
      }
      const ferie = await Ferie.findByIdAndUpdate(
        req.params.id,
        { deleted: 1 },
        { new: true }
      );
      if (ferie) {
        res.json({ message: "Elemento eliminato con successo" });
      } else {
        // Se l'elemento non è trovato per l'aggiornamento, è un 404
        res.status(404).json({ message: "Elemento non trovato per l'eliminazione" });
      }
    } catch (error) {
      console.error(
        "Errore durante l'eliminazione della richiesta ferie:",
        error
      );
      res
        .status(500)
        .json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
  },

  /**
   * Mostra tutte le ferie paginate in formato tabella.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  showFerie: async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25; // Default 10 items per pagina
    const skip = (page - 1) * limit;

    try {
      const query = { deleted: 0 };
      const list = await Ferie.find(query)
                            .sort({ dataInizio: -1 }) // Ordinamento per dataInizio decrescente
                            .skip(skip)
                            .limit(limit)
                            .exec();
      
      const totalItems = await Ferie.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      const aheader = [
        "nome",
        "cognome",
        "dataInizio",
        "dataFine",
        "tipologia",
        "note",
      ];
      res.render("tableFerie", {
         title: "Lista Ferie e Permessi",
         aheader,
         list,
         moment,
         currentPage: page,
         totalPages,
         limit,
         totalItems
        });
    } catch (error) {
      console.error("Errore nel recupero delle richieste ferie:", error);
      res.status(500).render("error", { message: "Errore nel recupero delle richieste ferie", error });
    }
  },

  /**
   * Mostra il calendario annuale con tutte le ferie.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getCalendarPage: async (req, res, next) => {
    try {
      // Per il calendario, solitamente si vogliono vedere tutte le ferie dell'anno,
      // la paginazione qui potrebbe non essere necessaria o gestita diversamente (es. per anno).
      // Per ora, manteniamo il recupero di tutte le ferie non eliminate.
      const options = await Ferie.find({ deleted: 0 }); 
      const monthsData = getAllMonths(moment().year());
      res.render("calendar", {
        year: moment().year(),
        months: monthsData,
        title: "Calendario Ferie e Permessi",
        options, // 'options' qui contiene tutte le ferie, da filtrare/usare nel template
      });
    } catch (error) {
      console.error("Errore nel caricamento della pagina calendario:", error);
      res.status(500).render("error", { message: "Errore nel caricamento della pagina calendario", error });
    }
  },

  /**
   * Mostra la pagina di conferma dopo l'aggiunta di una richiesta ferie.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getConfirmaPage: async (req, res, next) => {
    // Questa pagina è una semplice conferma, non necessita di paginazione.
    // Tuttavia, se provenisse da un'azione che poi reindirizza a una tabella, 
    // quel reindirizzamento dovrebbe considerare la paginazione.
    // Dato che addFerie ora reindirizza a /showFerie?page=1, questa pagina potrebbe essere meno usata.
    res.render("conferma");
  },
};

module.exports = ferieController;
