const Cliente = require("../../models/cliente.js");
const moment = require("moment");

const ALLOWED_LIMITS = [10, 25, 50, 100]; // Definisci i limiti consentiti

const ClienteController = {
  getClienti: async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    // Nuovo: valida e imposta il limite
    let limit = parseInt(req.query.limit);
    if (!ALLOWED_LIMITS.includes(limit)) {
      limit = 25; // Valore predefinito se il limite non è valido o non è specificato
    }

    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "";
    const sortField = req.query.sort || "ragioneSociale";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    try {
      let query = { deleted: false };

      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, "i");
        query.$or = [
          { ragioneSociale: searchRegex },
          { tipologia: searchRegex },
        ];
      }

      const sortOptions = {};
      if (sortField) {
        sortOptions[sortField] = sortOrder;
      }

      const clientiList = await Cliente.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      const totalItems = await Cliente.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      const headers = [
        { name: "Ragione Sociale", field: "ragioneSociale" }, 
        { name: "Tipologia", field: "tipologia" }
      ];

      res.render("tableCliente", {
        title: "Lista Clienti",
        aheader: headers,
        list: clientiList,
        moment: moment,
        currentPage: page,
        totalPages,
        limit, // Passa il limite corrente alla vista
        totalItems,
        currentSearch: searchTerm,
        currentSort: sortField,
        currentOrder: sortOrder === 1 ? "asc" : "desc",
        req: req, // Passa l'oggetto req per costruire URL nella vista
        allowedLimits: ALLOWED_LIMITS // Passa i limiti consentiti alla vista
      });
    } catch (error) {
      console.error("Errore nel recupero della lista clienti:", error);
      res.status(500).render("error", { message: "Errore nel recupero della lista clienti", error });
    }
  },

  addCliente: async (req, res, next) => {
    try {
      const { ragioneSociale, isCliente } = req.body;
      const cliente = new Cliente({
        ragioneSociale,
        tipologia: isCliente,
        deleted: false,
      });

      await cliente.save();
      res.redirect("/showCliente?page=1"); // Mantiene il limite predefinito dopo l'aggiunta
    } catch (error) {
      console.error("Errore durante l'aggiunta del cliente:", error);
      res.status(500).render("error", { message: "Errore durante l'aggiunta del cliente", error });
    }
  },

  deleteCliente: async (req, res, next) => {
    try {
      const elementId = req.params.id;
      if (!elementId || elementId === "null") {
        return res.status(400).json({ message: "ID elemento non valido" });
      }

      const result = await Cliente.findByIdAndUpdate(
        elementId,
        { deleted: 1 },
        { new: true, runValidators: true }
      );

      if (result) {
        console.log("Elemento aggiornato:", result);
        res.json({ message: "Elemento eliminato con successo" });
      } else {
        console.log("Elemento non trovato.");
        res.status(404).json({ message: "Elemento non trovato" });
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'elemento:", error);
      res
        .status(500)
        .json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
  },
};

module.exports = ClienteController;
