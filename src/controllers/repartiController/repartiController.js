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

/**
 * Genera le intestazioni della tabella in base al reparto e tipo.
 * @param {String} reparto - Il reparto di produzione.
 * @param {String} tipo - Il tipo di prodotto.
 * @returns {Array} - Lista delle intestazioni della tabella.
 */
const generateHeaderKeys = async (reparto, tipo) => {
  let keys = [];
  if (reparto == "produzione" && tipo == "pocket") {
    keys = [
      "_id",
      "macchina",
      "prodFilo",
      "cliente",
      "diamFilo",
      "portata",
      "peso",
      "quantita",
      "oreLav",
      "oreFermo",
      "cambiMacchina",
      "data",
      "user",
      "note",
    ];
  } else if (reparto == "produzione" && tipo == "bonnel") {
    keys = [
      "_id",
      "macchina",
      "prodFilo",
      "diamMolla",
      "diamFilo",
      "peso",
      "quantita",
      "altezza",
      "oreLav",
      "data",
      "user",
      "note",
    ];
  } else if (reparto == "assemblaggio" && tipo == "pocket") {
    keys = [
      "_id",
      "macchina",
      "cliente",
      "misuraFilo",
      "fileMolle",
      "quantita",
      "cambioTelina",
      "oreLav",
      "data",
      "user",
      "note",
    ];
  } else if (reparto == "assemblaggio" && tipo == "bonnel") {
    keys = [
      "_id",
      "macchina",
      "cliente",
      "misuraFilo",
      "fileMolle",
      "quantita",
      "cambiMacchina",
      "oreLav",
      "data",
      "user",
      "note",
    ];
  } else if (reparto == "imballaggio") {
    keys = ["_id", "macchina", "quantita", "oreLav", "data", "user", "note"];
  }
  return keys;
};

/**
 * Converte le ore decimali in formato "ore e minuti" in base al sistema sessagesimale.
 * @param {Number} decimalHours - Le ore in formato decimale.
 * @returns {String} - Il tempo formattato in ore e minuti.
 */
const decimalToSexagesimal = (decimalHours) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

const repartiController = {
  /**
   * Inserisce nuovi dati nel database per un molleggio.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
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
      res.redirect("/reparti");
    }
  },

  /**
   * Recupera i dati di produzione paginati e li mostra.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  getProductionData: async (req, res) => {
    const { reparto, tipo } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25; // Default 10 items per pagina
    const skip = (page - 1) * limit;

    let parametri = { reparto, tipo: tipo || "", deleted: 0 };
    if (reparto === "imballaggio") {
      delete parametri.tipo;
    }

    try {
      const list = await Reparti.find(parametri)
        .sort({ data: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const totalItems = await Reparti.countDocuments(parametri);
      const totalPages = Math.ceil(totalItems / limit);

      // Anche se la lista è vuota per la pagina corrente, vogliamo renderizzare la tabella
      // e i controlli di paginazione, quindi non controlliamo list.length > 0 qui.
      const keys = await generateHeaderKeys(reparto, tipo);
      res.render("prodPocket", {
        title: `${reparto} ${tipo || ""}`,
        aheader: keys,
        list,
        reparto,
        tipo: tipo || "",
        moment,
        currentPage: page,
        totalPages,
        limit,
        totalItems,
        // Passiamo i parametri originali per mantenere i filtri nella paginazione
        currentReparto: reparto,
        currentTipo: tipo || ""
      });
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
      // In caso di errore, è meglio reindirizzare a una pagina di errore o mostrare un messaggio
      // piuttosto che restituire JSON se la route è pensata per renderizzare HTML.
      // Per ora, manteniamo il redirect alla home come fallback o una pagina di errore generica.
      // res.status(500).json({ message: "Errore nel recupero dei dati" });
      res.status(500).render("error", { message: "Errore nel recupero dei dati di produzione", error });
    }
  },

  /**
   * Elimina una misura dal database in base all'ID.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
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

  /**
   * Mostra la pagina di modifica per un molleggio specifico.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  editMolleggioPage: async (req, res) => {
    try {
      const molleggio = await Reparti.findById(req.params.id).exec();
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
      });
    } catch (error) {
      console.error("Errore nel caricamento della pagina di modifica:", error);
      res
        .status(500)
        .render("error", { message: "Errore nel caricamento della pagina di modifica", error });
    }
  },

  /**
   * Modifica un molleggio esistente nel database in base all'ID.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  modificaMolleggio: async (req, res) => {
    const { id } = req.params;
    try {
      const dataProcessed = await createData(req.body, req.body, false);
      const result = await Reparti.findByIdAndUpdate(id, dataProcessed, {
        new: true,
        runValidators: true,
      });
      // Dopo la modifica, reindirizza alla prima pagina della tabella pertinente
      res.redirect(`/prodPocket/${result.reparto}/${result.tipo || ""}?page=1`);
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
      res
        .status(500)
        .render("error", { message: "Errore durante l'aggiornamento dell'elemento", error });
    }
  },

  /**
   * Calcola il totale delle molle prodotte in base al reparto, tipo e intervallo di tempo.
   * @param {String} reparto - Il reparto di produzione.
   * @param {String} tipo - Il tipo di prodotto.
   * @param {String} tempo - "g" per giorno o "m" per mese corrente.
   * @returns {Number} - Il totale delle molle prodotte.
   */
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
      throw err;
    }
  },

  /**
   * Calcola il totale delle molle prodotte in ogni mese dell'anno corrente.
   * @param {String} reparto - Il reparto di produzione.
   * @param {String} tipo - Il tipo di prodotto.
   * @returns {Array} - Lista delle molle prodotte per ciascun mese (da gennaio a dicembre).
   */
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

  /**
   * Calcola il totale delle molle prodotte in un giorno specificato.
   * @param {String} reparto - Il reparto di produzione.
   * @param {String} tipo - Il tipo di prodotto.
   * @param {Date} selectedData - La data selezionata.
   * @returns {Number} - Il totale delle molle prodotte nel giorno specificato.
   */
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
