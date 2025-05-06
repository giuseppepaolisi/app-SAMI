const Reparti = require("../../models/reparti");
const Macchine = require("../../models/macchine");
const User = require("../../models/user");
const Cliente = require("../../models/cliente");
const moment = require("moment");
const { getData } = require("../../middleware/user-auth");

// Funzione helper per verificare la validità dei dati
const checkData = (data) =>
  data === "" || typeof data === "undefined" ? false : true;

// Funzione helper per creare un oggetto dati formattato
const createData = async (postData, token, isNew = true) => {
  let data = {};
  if (checkData(postData.tipo)) data.tipo = postData.tipo;
  if (checkData(postData.reparto)) data.reparto = postData.reparto;
  if (checkData(postData.prodFilo)) data.prodFilo = postData.prodFilo;
  if (checkData(postData.cliente)) data.cliente = postData.cliente;
  if (checkData(postData.misuraFilo)) data.misuraFilo = postData.misuraFilo;
  if (checkData(postData.fileMolle)) data.fileMolle = postData.fileMolle;
  if (checkData(postData.diamFilo))
    data.diamFilo = parseFloat(postData.diamFilo);
  if (checkData(postData.portata)) data.portata = parseFloat(postData.portata);
  if (checkData(postData.peso)) data.peso = parseFloat(postData.peso);
  if (isNew) data.data = new Date();
  if (checkData(postData.macchina)) data.macchina = postData.macchina;
  if (checkData(postData.quantita)) data.quantita = parseInt(postData.quantita);
  if (checkData(postData.oreLav)) data.oreLav = parseInt(postData.oreLav);
  if (checkData(postData.cambiMacchina))
    data.cambiMacchina = parseInt(postData.cambiMacchina);
  if (data.reparto === "produzione" && data.tipo === "pocket") {
    const retrive = await Macchine.findOne({ macchina: data.macchina }).exec();
    data.oreFermo = retrive
      ? decimalToSexagesimal((data.oreLav * retrive.molleOre) / data.quantita)
      : 0;
  }
  data.user = token.user;
  if (checkData(postData.diamMolla))
    data.diamMolla = parseInt(postData.diamMolla);
  if (checkData(postData.fileMolle)) data.file = postData.fileMolle;
  if (checkData(postData.note)) data.note = postData.note;
  if (checkData(postData.altezza)) data.altezza = parseFloat(postData.altezza);
  if (checkData(postData.cambioTelina))
    data.cambioTelina = parseInt(postData.cambioTelina);
  data.deleted = 0;
  return data;
};

const generateHeaderKeys = async (reparto, tipo) => {
  let keys = [];
  // Definizione delle chiavi come oggetti {name: "Visualizzato", field: "dbField", searchable: true/false, sortable: true/false}
  if (reparto == "produzione" && tipo == "pocket") {
    keys = [
      // _id non è mostrato ma usato internamente
      { name: "Macchina", field: "macchina", searchable: true, sortable: true },
      { name: "Prod Filo", field: "prodFilo", searchable: true, sortable: true },
      { name: "Cliente", field: "cliente", searchable: true, sortable: true },
      { name: "Diam Filo", field: "diamFilo", searchable: false, sortable: true },
      { name: "Portata", field: "portata", searchable: false, sortable: true },
      { name: "Peso", field: "peso", searchable: false, sortable: true },
      { name: "Quantita", field: "quantita", searchable: false, sortable: true },
      { name: "Ore Lav", field: "oreLav", searchable: false, sortable: true },
      { name: "Ore Fermo", field: "oreFermo", searchable: true, sortable: true }, // stringa, quindi searchable
      { name: "Cambi Macchina", field: "cambiMacchina", searchable: false, sortable: true },
      { name: "Data", field: "data", searchable: false, sortable: true },
      { name: "User", field: "user", searchable: true, sortable: true },
      { name: "Note", field: "note", searchable: true, sortable: true },
    ];
  } else if (reparto == "produzione" && tipo == "bonnel") {
    keys = [
      { name: "Macchina", field: "macchina", searchable: true, sortable: true },
      { name: "Prod Filo", field: "prodFilo", searchable: true, sortable: true },
      { name: "Diam Molla", field: "diamMolla", searchable: false, sortable: true },
      { name: "Diam Filo", field: "diamFilo", searchable: false, sortable: true },
      { name: "Peso", field: "peso", searchable: false, sortable: true },
      { name: "Quantita", field: "quantita", searchable: false, sortable: true },
      { name: "Altezza", field: "altezza", searchable: false, sortable: true },
      { name: "Ore Lav", field: "oreLav", searchable: false, sortable: true },
      { name: "Data", field: "data", searchable: false, sortable: true },
      { name: "User", field: "user", searchable: true, sortable: true },
      { name: "Note", field: "note", searchable: true, sortable: true },
    ];
  } else if (reparto == "assemblaggio" && tipo == "pocket") {
    keys = [
      { name: "Macchina", field: "macchina", searchable: true, sortable: true },
      { name: "Cliente", field: "cliente", searchable: true, sortable: true },
      { name: "Misura Filo", field: "misuraFilo", searchable: true, sortable: true }, // Assumendo sia stringa
      { name: "File Molle", field: "fileMolle", searchable: true, sortable: true },
      { name: "Quantita", field: "quantita", searchable: false, sortable: true },
      { name: "Cambio Telina", field: "cambioTelina", searchable: false, sortable: true },
      { name: "Ore Lav", field: "oreLav", searchable: false, sortable: true },
      { name: "Data", field: "data", searchable: false, sortable: true },
      { name: "User", field: "user", searchable: true, sortable: true },
      { name: "Note", field: "note", searchable: true, sortable: true },
    ];
  } else if (reparto == "assemblaggio" && tipo == "bonnel") {
    keys = [
      { name: "Macchina", field: "macchina", searchable: true, sortable: true },
      { name: "Cliente", field: "cliente", searchable: true, sortable: true },
      { name: "Misura Filo", field: "misuraFilo", searchable: true, sortable: true }, // Assumendo sia stringa
      { name: "File Molle", field: "fileMolle", searchable: true, sortable: true },
      { name: "Quantita", field: "quantita", searchable: false, sortable: true },
      { name: "Cambi Macchina", field: "cambiMacchina", searchable: false, sortable: true },
      { name: "Ore Lav", field: "oreLav", searchable: false, sortable: true },
      { name: "Data", field: "data", searchable: false, sortable: true },
      { name: "User", field: "user", searchable: true, sortable: true },
      { name: "Note", field: "note", searchable: true, sortable: true },
    ];
  } else if (reparto == "imballaggio") {
    keys = [
      { name: "Macchina", field: "macchina", searchable: true, sortable: true },
      { name: "Quantita", field: "quantita", searchable: false, sortable: true },
      { name: "Ore Lav", field: "oreLav", searchable: false, sortable: true },
      { name: "Data", field: "data", searchable: false, sortable: true },
      { name: "User", field: "user", searchable: true, sortable: true },
      { name: "Note", field: "note", searchable: true, sortable: true },
    ];
  }
  // Aggiungiamo _id a tutte le configurazioni per l'uso interno, ma non sarà visualizzato come colonna se non specificato in `name`.
  // Non è necessario aggiungerlo qui se `generateHeaderKeys` restituisce solo ciò che serve per la visualizzazione e l'interazione.
  return keys;
};

const decimalToSexagesimal = (decimalHours) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

const ALLOWED_LIMITS = [10, 25, 50, 100];

const repartiController = {
  insertMolleggi: async (req, res) => {
    try {
      const creati = await createData(
        req.body,
        getData(req.cookies.token),
        true
      );
      const molleggi = new Reparti(creati);
      await molleggi.save();
      res.status(200).render("dipendente/postInsert.ejs");
    } catch (error) {
      console.error("Errore durante l'inserimento:", error);
      res.redirect("/reparti"); // Considerare una pagina di errore più specifica
    }
  },

  getProductionData: async (req, res) => {
    const { reparto, tipo } = req.params;
    const page = parseInt(req.query.page) || 1;
    
    let limit = parseInt(req.query.limit);
    if (!ALLOWED_LIMITS.includes(limit)) {
      limit = 25;
    }
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "";
    // const sortField = req.query.sort || "data"; // Default sort field
    // const sortOrder = req.query.order === "desc" ? -1 : 1;

    // Determina il campo di ordinamento predefinito in base al reparto/tipo se necessario
    // o usa un campo generico come 'data'
    let defaultSortField = "data";
    // Esempio: if (reparto === "produzione" && tipo === "pocket") defaultSortField = "macchina";
    const sortField = req.query.sort || defaultSortField; 
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    let queryParams = { reparto, tipo: tipo || "", deleted: 0 };
    if (reparto === "imballaggio") {
      delete queryParams.tipo; // Rimuovi 'tipo' se non applicabile
    }

    const headers = await generateHeaderKeys(reparto, tipo || "");

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      const searchableFields = headers.filter(h => h.searchable).map(h => h.field);
      if (searchableFields.length > 0) {
        queryParams.$or = searchableFields.map(field => ({ [field]: searchRegex }));
      }
    }

    const sortOptions = {};
    if (sortField) {
        sortOptions[sortField] = sortOrder;
    } else {
        sortOptions["data"] = -1; // Fallback sort
    }

    try {
      const list = await Reparti.find(queryParams)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      const totalItems = await Reparti.countDocuments(queryParams);
      const totalPages = Math.ceil(totalItems / limit);

      res.render("prodPocket", {
        title: `${reparto} ${tipo || ""}`.trim(),
        aheader: headers, // Ora è un array di oggetti
        list,
        reparto,
        tipo: tipo || "",
        moment,
        currentPage: page,
        totalPages,
        limit,
        totalItems,
        currentSearch: searchTerm,
        currentSort: sortField,
        currentOrder: sortOrder === 1 ? "asc" : "desc",
        allowedLimits: ALLOWED_LIMITS,
        req: req, // Passa req per costruire URL nella paginazione e ordinamento
         // Parametri specifici per mantenere i filtri nella paginazione
        currentReparto: reparto, 
        currentTipo: tipo || ""
      });
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
      res.status(500).render("error", { message: "Errore nel recupero dei dati di produzione", error });
    }
  },

  deleteMeasure: async (req, res) => {
    const elementId = req.params.id;
    if (!elementId || elementId === "null")
      return res.status(400).json({ message: "ID elemento non valido" });

    try {
      const flag = { deleted: 1 };
      const result = await Reparti.findByIdAndUpdate(elementId, flag, {
        new: true,
        runValidators: true,
      });
      result
        ? res.json({ message: "Elemento eliminato con successo" })
        : res.status(404).json({ message: "Elemento non trovato" });
    } catch (errore) {
      console.error("Errore durante l'eliminazione:", errore);
      res
        .status(500)
        .json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
  },

  editMolleggioPage: async (req, res) => {
    try {
      const molleggio = await Reparti.findById(req.params.id).exec();
      if (!molleggio) {
        return res.status(404).render("error", { message: "Elemento non trovato", error: {status: 404} });
      }
      const users = await User.find({ deleted: 0 }).exec();
      const options = await Cliente.find({ deleted: 0 })
        .sort({ ragioneSociale: 1 })
        .exec();
      res.render("editMolleggio", {
        molleggio,
        reparto: molleggio.reparto,
        tipo: molleggio.tipo,
        macchina: molleggio.macchina,
        users,
        moment,
        options,
        title: `Modifica ${molleggio.reparto} ${molleggio.tipo || ""}`.trim()
      });
    } catch (error) {
      console.error("Errore nel caricamento della pagina di modifica:", error);
      res
        .status(500)
        .render("error", { message: "Errore nel caricamento della pagina di modifica", error });
    }
  },

  modificaMolleggio: async (req, res) => {
    const { id } = req.params;
    try {
      // Assicurati che getData(req.cookies.token) sia disponibile o passato correttamente
      // Se req.body contiene già l'utente o non è necessario aggiornarlo, modifica createData
      const tokenData = getData(req.cookies.token); // Esempio, assicurati che sia corretto
      const dataProcessed = await createData(req.body, tokenData, false);
      const result = await Reparti.findByIdAndUpdate(id, dataProcessed, {
        new: true,
        runValidators: true,
      });
      if (!result) {
        return res.status(404).render("error", { message: "Elemento non trovato per l'aggiornamento", error: {status: 404} });
      }
      res.redirect(`/prodPocket/${result.reparto}/${result.tipo || ""}?page=1&limit=${req.body.currentLimit || 25}`);
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
      res
        .status(500)
        .render("error", { message: "Errore durante l'aggiornamento dell'elemento", error });
    }
  },

  getTotal: async (reparto, tipo, tempo) => {
    try {
      let dataInizio, dataFine;
      const oggi = new Date();

      if (tempo === "m") {
        dataInizio = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
        dataFine = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 1);
      } else if (tempo === "g") {
        dataInizio = new Date(
          oggi.getFullYear(),
          oggi.getMonth(),
          oggi.getDate()
        );
        dataFine = new Date(
          oggi.getFullYear(),
          oggi.getMonth(),
          oggi.getDate() + 1
        );
      } else {
        throw new Error("Il valore di 'tempo' deve essere 'm' o 'g'");
      }

      const pipeline = [
        {
          $match: {
            reparto,
            tipo,
            deleted: false,
            data: { $gte: dataInizio, $lt: dataFine },
          },
        },
        { $group: { _id: null, totalMolle: { $sum: "$quantita" } } },
      ];
      const result = await Reparti.aggregate(pipeline);
      return result[0]?.totalMolle || 0;
    } catch (err) {
      console.error("Errore durante il calcolo del totale di molle:", err);
      throw err; // O gestisci diversamente
    }
  },

  getTotalByMonth: async (reparto, tipo) => {
    try {
      const annoCorrente = new Date().getFullYear();
      const primoGiornoAnnoCorrente = new Date(annoCorrente, 0, 1);
      const primoGiornoAnnoDopo = new Date(annoCorrente + 1, 0, 1);

      const pipeline = [
        {
          $match: {
            reparto,
            tipo,
            deleted: false,
            data: { $gte: primoGiornoAnnoCorrente, $lt: primoGiornoAnnoDopo },
          },
        },
        { $project: { mese: { $month: "$data" }, quantita: 1 } },
        { $group: { _id: "$mese", totale: { $sum: "$quantita" } } },
        { $sort: { _id: 1 } },
      ];
      const result = await Reparti.aggregate(pipeline);

      const array = Array(12).fill(0);
      result.forEach(({ _id, totale }) => {
        array[_id - 1] = totale;
      });
      return array;
    } catch (err) {
      console.error(
        "Errore durante il calcolo del totale di molle per mese:",
        err
      );
      throw err;
    }
  },

  getTotalForDay: async (reparto, tipo, selectedData) => {
    try {
      const dataInizio = new Date(selectedData);
      const dataFine = new Date(
        dataInizio.getFullYear(),
        dataInizio.getMonth(),
        dataInizio.getDate() + 1
      );

      const pipeline = [
        {
          $match: {
            reparto,
            tipo,
            deleted: false,
            data: { $gte: dataInizio, $lt: dataFine },
          },
        },
        { $group: { _id: null, totalMolle: { $sum: "$quantita" } } },
      ];
      const result = await Reparti.aggregate(pipeline);
      return result[0]?.totalMolle || 0;
    } catch (err) {
      console.error(
        "Errore durante il calcolo del totale di molle per giorno:",
        err
      );
      throw err;
    }
  },
};

module.exports = repartiController;
