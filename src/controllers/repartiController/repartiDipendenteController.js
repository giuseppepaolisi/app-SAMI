const mongoose = require('mongoose');
const Cliente = require('../../models/cliente.js');
const macchineController = require('../macchineController/macchineController.js');

/**
 * Controller per la gestione dei reparti per i dipendenti
 */
const repartiDipendenteController = {
  /**
   * Visualizza la lista dei reparti disponibili
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   */
  showReparti: (req, res) => {
    res.render('dipendente/reparti.ejs');
  },

  /**
   * Permette di selezionare il reparto di riferimento
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   */
  selectReparto: (req, res) => {
    const reparto = req.params.reparto;

    switch (reparto) {
      case 'produzione':
        res.render('dipendente/reparti2.ejs', { reparto: 'produzione' });
        break;
      case 'assemblaggio':
        res.render('dipendente/reparti2.ejs', { reparto: 'assemblaggio' });
        break;
      case 'imballaggio':
        res.redirect('macchine/imballaggio'); //imballaggio non ha una tipologia di molla a cui fare riferimento
        break;
      default:
        res.redirect('/reparti');
        break; //errore
    }
  },

  /**
   * Visualizza il form di inserimento dati dopo aver selezionato reparto, tipo molla e macchina
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   */
  showInsertForm: async (req, res) => {
    try {
      const options = await Cliente.find({ deleted: 0 }).exec();
      res.render('insert.ejs', {
        reparto: req.params.reparto,
        tipo: req.params.tipo,
        macchina: req.params.macchina,
        options: options,
      });
    } catch (error) {
      console.error('Errore nel recupero dei clienti: ', error);
      res.redirect('/reparti');
    }
  },

  /**
   * Visualizza il form di inserimento dati dopo aver selezionato reparto e macchina
   * @param {Object} req - Oggetto richiesta Express
   * @param {Object} res - Oggetto risposta Express
   */
  showInsertFormWithoutTipo: async (req, res) => {
    try {
      const options = await Cliente.find({ deleted: 0 }).exec();
      res.render('insert.ejs', {
        reparto: req.params.reparto,
        macchina: req.params.macchina,
        options: options,
      });
    } catch (error) {
      console.error('Errore nel recupero dei clienti: ', error);
      res.redirect('/reparti');
    }
  },
};

module.exports = repartiDipendenteController;
