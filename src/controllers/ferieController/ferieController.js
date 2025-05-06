const Ferie = require("../../models/ferie");
const User = require("../../models/user");
const moment = require("moment");

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

const ALLOWED_LIMITS_FERIE = [10, 25, 50, 100];

const ferieController = {
  getEditFeriePage: async (req, res, next) => {
    try {
        const ferie = await Ferie.findById(req.params.id);
        if (!ferie) {
            return res.status(404).render("error", { message: "Richiesta ferie non trovata", error: {status: 404} });
        }
        res.render("editFerie", { ferie, title: "Modifica Ferie/Permesso" });
    } catch (error) {
        console.error("Errore nel caricamento della pagina di modifica ferie:", error);
        res.status(500).render("error", { message: "Errore nel caricamento della pagina di modifica ferie", error });
    }
  },

  updateFerie: async (req, res, next) => {
    const { dataInizio, dataFine, isFerie, noteFerie } = req.body; // Aggiunto noteFerie
    try {
      const ferie = await Ferie.findByIdAndUpdate(
        req.params.id,
        { dataInizio, dataFine, tipologia: isFerie, note: noteFerie }, // Aggiunto note
        { new: true, runValidators: true }
      );
      if (ferie) {
        res.redirect("/showFerie?page=1");
      } else {
        res.status(404).render("error", { message: "Richiesta ferie non trovata per l'aggiornamento", error: {status: 404} });
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento della richiesta ferie:", error);
      res.status(500).render("error", { message: "Errore durante l'aggiornamento della richiesta ferie", error });
    }
  },

  getAddFeriePage: async (req, res, next) => {
    try {
        const options = await User.find({ deleted: 0 }).sort({ cognome: 1, nome: 1 }); // Ordinamento utenti
        res.render("addFerie", { options, title: "Aggiungi Ferie/Permesso" });
    } catch (error) {
        console.error("Errore nel caricamento della pagina di aggiunta ferie:", error);
        res.status(500).render("error", { message: "Errore nel caricamento della pagina di aggiunta ferie", error });
    }
  },

  addFerie: async (req, res, next) => {
    const { opzione, dataInizio, dataFine, isFerie, noteFerie } = req.body;
    try {
      const user = await User.findOne({ user: opzione });
      if (!user) {
        return res.status(400).render("error", { message: "Utente non trovato per l'inserimento ferie", error: {status: 400} });
      }
      const ferie = new Ferie({
        nome: user.nome,
        cognome: user.cognome,
        userId: user._id, // Aggiunto userId per riferimento futuro se necessario
        dataInizio,
        dataFine,
        tipologia: isFerie,
        note: noteFerie,
        deleted: 0,
      });
      await ferie.save();
      res.redirect("/showFerie?page=1"); 
    } catch (error) {
      console.error(
        "Errore durante l'inserimento della richiesta ferie:",
        error
      );
      res.status(500).render("error", { message: "Errore durante l'inserimento della richiesta ferie", error });
    }
  },

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

  showFerie: async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit);
    if (!ALLOWED_LIMITS_FERIE.includes(limit)) {
      limit = 25;
    }
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "";
    const sortField = req.query.sort || "dataInizio"; // Default sort
    const sortOrder = req.query.order === "asc" ? 1 : -1; // Default desc for dataInizio, asc for others if not specified

    let query = { deleted: 0 };

    // Definisci gli header come oggetti per ricerca e ordinamento
    const headers = [
      { name: "Nome", field: "nome", searchable: true, sortable: true },
      { name: "Cognome", field: "cognome", searchable: true, sortable: true },
      { name: "Data Inizio", field: "dataInizio", searchable: false, sortable: true }, // Le date sono difficili da cercare con una stringa semplice
      { name: "Data Fine", field: "dataFine", searchable: false, sortable: true },
      { name: "Tipologia", field: "tipologia", searchable: true, sortable: true },
      { name: "Note", field: "note", searchable: true, sortable: true },
    ];

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      const searchableFields = headers.filter(h => h.searchable).map(h => h.field);
      if (searchableFields.length > 0) {
        query.$or = searchableFields.map(field => ({ [field]: searchRegex }));
      }
    }

    const sortOptions = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder;
    } else {
      sortOptions["dataInizio"] = -1; // Default sort
    }

    try {
      const list = await Ferie.find(query)
                            .sort(sortOptions)
                            .skip(skip)
                            .limit(limit)
                            .exec();
      
      const totalItems = await Ferie.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      res.render("tableFerie", {
         title: "Lista Ferie e Permessi",
         aheader: headers, // Passa gli header strutturati
         list,
         moment,
         currentPage: page,
         totalPages,
         limit,
         totalItems,
         currentSearch: searchTerm,
         currentSort: sortField,
         currentOrder: sortOrder === 1 ? "asc" : "desc",
         allowedLimits: ALLOWED_LIMITS_FERIE,
         req: req // Passa req per costruire URL
        });
    } catch (error) {
      console.error("Errore nel recupero delle richieste ferie:", error);
      res.status(500).render("error", { message: "Errore nel recupero delle richieste ferie", error });
    }
  },

  getCalendarPage: async (req, res, next) => {
    try {
      const options = await Ferie.find({ deleted: 0 }); 
      const monthsData = getAllMonths(moment().year());
      res.render("calendar", {
        year: moment().year(),
        months: monthsData,
        title: "Calendario Ferie e Permessi",
        options,
      });
    } catch (error) {
      console.error("Errore nel caricamento della pagina calendario:", error);
      res.status(500).render("error", { message: "Errore nel caricamento della pagina calendario", error });
    }
  },

  getConfirmaPage: async (req, res, next) => {
    res.render("conferma", { title: "Conferma Inserimento" });
  },
};

module.exports = ferieController;
