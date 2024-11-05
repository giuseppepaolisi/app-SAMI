const Cliente = require("../model/cliente.js");
const moment = require('moment');

const ClienteController = {};

// Funzione per recuperare la lista clienti
ClienteController.getClienti = async (req, res, next) => {
    try {
        // Recupero dei clienti non eliminati
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

// Funzione per aggiungere un cliente
ClienteController.addCliente = async (req, res, next) => {
    try {
        const { ragioneSociale, isCliente } = req.body;
        const cliente = new Cliente({
            ragioneSociale,
            tipologia: isCliente,
            deleted: false
        });

        await cliente.save();
        res.redirect('/showCliente');
    } catch (error) {
        console.error("Errore durante l'aggiunta del cliente:", error);
        next(error);
    }
};

// Funzione per eliminare un cliente
ClienteController.deleteCliente = async (req, res, next) => {
    try {
        const elementId = req.params.id;
        const result = await Cliente.findByIdAndUpdate(elementId, { deleted: 1 }, { new: true, runValidators: true });

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