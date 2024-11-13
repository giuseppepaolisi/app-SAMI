const express = require('express');
const router = express.Router();
const repartoDipendenteController = require('../controllers/repartiController/repartiDipendenteController');
const macchineController = require('../controllers/macchineController/macchineController');
const { isEmployee } = require('../middleware/user-auth');

// Visualizza la lista di reparti disponibili
router.get('/reparti', isEmployee, repartoDipendenteController.showReparti);

// Seleziona il reparto di riferimento
router.get(
  '/reparto/:reparto/',
  isEmployee,
  repartoDipendenteController.selectReparto
);

// Visualizza la lista di macchine per il reparto selezionato
router.get('/macchine/:reparto/', isEmployee, macchineController.getMacchine);

// Visualizza il form di inserimento per un reparto, tipo molla e macchina
router.get(
  '/inserisci/:reparto/:tipo/:macchina',
  isEmployee,
  repartoDipendenteController.showInsertForm
);

// Visualizza il form di inserimento per un reparto e macchina (senza tipo molla)
router.get(
  '/inserisci/:reparto/:macchina',
  isEmployee,
  repartoDipendenteController.showInsertFormWithoutTipo
);

module.exports = router;
