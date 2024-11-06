const Macchine = require('../../models/macchine');

/*
 * reparto: si riferisce a un singolo reparto [produzione, assemblaggio, imballaggio]
 * tipo: si riferisce alla tipologia di molla prodotta [pocket, bonnel]
 * macchine: si riferisce a una serie di macchine presenti in un determinato reparto che possono riferirsi a un particolare tipo di molla
 */

const macchineController = {
  /**
   * Fornisce una lista di macchine in base al reparto e al tipo
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   * @param {Function} next - Funzione per passare al middleware successivo
   */
  getMacchine: async (req, res, next) => {
    const { reparto, tipo } = req.params;
    // Controlla se il reparto è valido
    if (!checkReparto(reparto)) {
      return res.redirect('/reparti');
    }
    let query = { reparto, deleted: false };
    // Controlla se il tipo è valido e lo aggiunge alla query se presente
    if (tipo && checkTipo(tipo)) {
      query.tipo = tipo;
    } else if (tipo) {
      return res.redirect('/reparti');
    }
    try {
      const macchine = await Macchine.find(query);
      const params = {
        reparto,
        macchine,
        ...(reparto !== 'imballaggio' && { tipo }),
      };
      res.render('dipendente/macchine.ejs', params);
    } catch (error) {
      console.error('Errore nel recupero delle macchine: ', error);
      return res.redirect('/reparti');
    }
  },

  /**
   * Restituisce tutte le macchine presenti nel sistema
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   * @param {Function} next - Funzione per passare al middleware successivo
   */
  getAll: async (req, res, next) => {
    try {
      const macchine = await Macchine.find({ deleted: false });
      const aheader = ['macchina', 'reparto', 'tipo', 'ore'];
      res.render('tableMacchine.ejs', { list: macchine, aheader });
    } catch (error) {
      console.error('Errore nel recupero delle macchine: ', error);
      return res.redirect('/');
    }
  },

  /**
   * Aggiunge una nuova macchina
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   * @param {Function} next - Funzione per passare al middleware successivo
   */
  addMacchine: async (req, res, next) => {
    const { reparto, tipo, macchina, molleOre } = req.body;
    const newMacchina = new Macchine({
      reparto,
      tipo: reparto === 'produzione' ? tipo : undefined,
      macchina,
      molleOre: reparto === 'produzione' ? molleOre : undefined,
      deleted: false,
    });
    try {
      await newMacchina.save();
      res.redirect('/macchine');
    } catch (error) {
      console.error("Errore durante l'aggiunta della macchina: ", error);
      return res.redirect('/macchine');
    }
  },

  /**
   * Elimina una macchina passato un id
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   * @param {Function} next - Funzione per passare al middleware successivo
   */
  deleteMacchine: async (req, res, next) => {
    const { id } = req.params;
    if (!id || id === 'null') {
      return res.status(400).json({ message: 'ID elemento non valido' });
    }
    try {
      const updatedMachine = await Macchine.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true, runValidators: true }
      );
      if (updatedMachine) {
        console.log('Elemento aggiornato:', updatedMachine);
        res.json({ message: 'Elemento eliminato con successo' });
      } else {
        console.log('Elemento non trovato.');
        res.status(404).json({ message: 'Elemento non trovato' });
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'elemento:", error);
      res
        .status(500)
        .json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
  },
};

// Controlla se il reparto è valido
function checkReparto(reparto) {
  return ['produzione', 'assemblaggio', 'imballaggio'].includes(reparto);
}

// Controlla se il tipo è valido
function checkTipo(tipo) {
  return ['pocket', 'bonnel'].includes(tipo);
}

module.exports = macchineController;
