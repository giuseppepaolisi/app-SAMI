const Macchine = require('../model/macchine');

const macchineController = {};

/*
* reparto: si riferisce a un singolo reparto [produzione, assemblaggio, imballaggio]
* tipo: si riferisce alla tipologia di molla prodotta [pocket, bonnel]
* macchine: si riferisce a una serie di macchine presenti in un determinato reparto che possono riferirsi a un particolare tipo di molla
*/

// Controlla se il reparto è valido
function checkReparto(reparto) {
    return ["produzione", "assemblaggio", "imballaggio"].includes(reparto);
}

// Controlla se il tipo è valido
function checkTipo(tipo) {
    return ["pocket", "bonnel"].includes(tipo);
}

// Fornisce una lista di macchine in base al reparto e al tipo
macchineController.getMacchine = async (req, res) => {
    const reparto = req.params.reparto;
    const tipo = req.params.tipo;

    if (!checkReparto(reparto)) {
        return res.redirect('/reparti'); // reindirizza se il reparto non è valido
    }

    let query = { reparto, deleted: false };
    if (tipo && checkTipo(tipo)) {
        query.tipo = tipo;
    } else if (tipo) {
        return res.redirect('/reparti'); // reindirizza se il tipo non è valido
    }

    try {
        const macchine = await Macchine.find(query);
        const parametri = {
            reparto: reparto,
            macchine: macchine,
            ...(reparto !== "imballaggio" && { tipo: tipo }) // Aggiunge il tipo solo se non è "imballaggio"
        };
        res.render('dipendente/macchine.ejs', parametri);
    } catch (error) {
        console.error("Errore nel recupero delle macchine: ", error);
        return res.redirect('/reparti');
    }
};

// Restituisce tutte le macchine presenti nel sistema
macchineController.getAll = async (req, res) => {
    try {
        const macchine = await Macchine.find({ deleted: false });
        const aheader = ["macchina", "reparto", "tipo", "ore"];
        res.render('tableMacchine.ejs', { list: macchine, aheader: aheader });
    } catch (error) {
        console.error("Errore nel recupero delle macchine: ", error);
        return res.redirect('/'); // Reindirizza in caso di errore
    }
};

// Aggiunge una nuova macchina
macchineController.addMacchine = async (req, res) => {
    const { reparto, tipo, macchina, molleOre } = req.body;

    const newMacchina = new Macchine({
        reparto,
        tipo: reparto === "produzione" ? tipo : undefined,
        macchina,
        molleOre: reparto === "produzione" ? molleOre : undefined,
        deleted: false
    });

    try {
        await newMacchina.save();
        res.redirect('/macchine');
    } catch (error) {
        console.error("Errore durante l'aggiunta della macchina: ", error);
        return res.redirect('/macchine'); // Reindirizza in caso di errore
    }
};

// elimin una macchina passato un id
macchineController.deleteMacchine = async (req, res) => {
    const elementId = req.params.id;

    if (!elementId || elementId === "null") {
        return res.status(400).json({ message: "ID elemento non valido" });
    }

    try {
        const updatedMachine = await Macchine.findByIdAndUpdate(elementId, { deleted: true }, { new: true, runValidators: true });
        if (updatedMachine) {
            console.log('Elemento aggiornato:', updatedMachine);
            res.json({ message: "Elemento eliminato con successo" });
        } else {
            console.log('Elemento non trovato.');
            res.status(404).json({ message: "Elemento non trovato" });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'elemento:', error);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
}
module.exports = macchineController;