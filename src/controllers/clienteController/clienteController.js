const Cliente = require("../../models/cliente.js");
const moment = require("moment");

const ClienteController = {
  /**
   * Recupera e mostra la lista paginata dei clienti non eliminati.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   * @param {Function} next - La funzione di middleware successiva.
   */
  getClienti: async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25; // Default 10 items per pagina
    const skip = (page - 1) * limit;

    try {
      const query = { deleted: false };
      // Recupero dei clienti paginati che non sono stati eliminati
      const clientiList = await Cliente.find(query)
        .sort({ ragioneSociale: 1 }) // Manteniamo un ordinamento consistente
        .skip(skip)
        .limit(limit)
        .exec();

      const totalItems = await Cliente.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      const headers = ["Ragione Sociale", "Tipologia"];

      // Rendering della pagina con la lista dei clienti e i dati di paginazione
      res.render("tableCliente", {
        title: "Lista Clienti",
        aheader: headers,
        list: clientiList,
        moment: moment,
        currentPage: page,
        totalPages,
        limit,
        totalItems,
      });
    } catch (error) {
      console.error("Errore nel recupero della lista clienti:", error);
      // Passare l'errore al gestore di errori di Express
      // o renderizzare una pagina di errore specifica
      res.status(500).render("error", { message: "Errore nel recupero della lista clienti", error });
    }
  },

  /**
   * Aggiunge un nuovo cliente nel sistema.
   * @param {Object} req - La richiesta Express contenente i dati del nuovo cliente.
   * @param {Object} res - La risposta Express.
   * @param {Function} next - La funzione di middleware successiva.
   */
  addCliente: async (req, res, next) => {
    try {
      const { ragioneSociale, isCliente } = req.body;
      const cliente = new Cliente({
        ragioneSociale,
        tipologia: isCliente,
        deleted: false,
      });

      // Salvataggio del nuovo cliente nel database
      await cliente.save();
      // Reindirizza alla prima pagina della tabella clienti dopo l'aggiunta
      res.redirect("/showCliente?page=1");
    } catch (error) {
      console.error("Errore durante l'aggiunta del cliente:", error);
      res.status(500).render("error", { message: "Errore durante l'aggiunta del cliente", error });
    }
  },

  /**
   * Elimina logicamente un cliente impostando il campo 'deleted' a true.
   * @param {Object} req - La richiesta Express contenente l'ID del cliente da eliminare.
   * @param {Object} res - La risposta Express.
   * @param {Function} next - La funzione di middleware successiva.
   */
  deleteCliente: async (req, res, next) => {
    try {
      const elementId = req.params.id;
      if (!elementId || elementId === "null") {
        return res.status(400).json({ message: "ID elemento non valido" });
      }

      // Aggiornamento del campo 'deleted' del cliente selezionato
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
