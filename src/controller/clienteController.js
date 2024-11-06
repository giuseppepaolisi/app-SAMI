const Cliente = require("../model/cliente.js");
const moment = require('moment');

const ClienteController = {};

/**
 * Recupera e mostra la lista dei clienti non eliminati.
 * @param {Object} req - La richiesta Express.
 * @param {Object} res - La risposta Express.
 * @param {Function} next - La funzione di middleware successiva.
 */
ClienteController.getClienti = async (req, res, next) => {
    try {
        // Recupero dei clienti che non sono stati eliminati
        const clientiList = await Cliente.find({ deleted: false }).exec(); 
        const headers = ['Ragione Sociale', 'Tipologia'];

        // Rendering della pagina con la lista dei clienti
        res.render('tableCliente', { 
            title: 'Lista Clienti', 
            aheader: headers, 
            list: clientiList, 
            moment: moment 
        });
    } catch (error) {
        console.error("Errore nel recupero della lista clienti:", error);
        next(error);
    }
};

/**
 * Aggiunge un nuovo cliente nel sistema.
 * @param {Object} req - La richiesta Express contenente i dati del nuovo cliente.
 * @param {Object} res - La risposta Express.
 * @param {Function} next - La funzione di middleware successiva.
 */
ClienteController.addCliente = async (req, res, next) => {
    try {
        const { ragioneSociale, isCliente } = req.body;
        const cliente = new Cliente({
            ragioneSociale,
            tipologia: isCliente,
            deleted: false
        });

        // Salvataggio del nuovo cliente nel database
        await cliente.save();
        res.redirect('/showCliente');
    } catch (error) {
        console.error("Errore durante l'aggiunta del cliente:", error);
        next(error);
    }
};

/**
 * Elimina logicamente un cliente impostando il campo 'deleted' a true.
 * @param {Object} req - La richiesta Express contenente l'ID del cliente da eliminare.
 * @param {Object} res - La risposta Express.
 * @param {Function} next - La funzione di middleware successiva.
 */
ClienteController.deleteCliente = async (req, res, next) => {
    try {
        const elementId = req.params.id;
        
        // Aggiornamento del campo 'deleted' del cliente selezionato
        const result = await Cliente.findByIdAndUpdate(
            elementId, 
            { deleted: 1 }, 
            { new: true, runValidators: true }
        );

        if (result) {
            console.log('Elemento aggiornato:', result);
            res.json({ message: "Elemento eliminato con successo" });
        } else {
            console.log('Elemento non trovato.');
            res.status(404).json({ message: "Elemento non trovato" });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'elemento:', error);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
};

module.exports = ClienteController;