const express = require('express');
const router = express.Router();
const { verifyToken, isEmployee, isAdmin } = require('../middleware/user-auth');
const repartiController = require('../controllers/repartiController/repartiController');

// POST: Inserisce nuovi dati nel database
router.post(
  '/inserisciMolleggio',
  verifyToken,
  repartiController.insertMolleggi
);

// GET: Ottiene i dati di produzione per reparto e tipo specifico
router.get(
  '/prodPocket/:reparto/:tipo?',
  isAdmin,
  repartiController.getProductionData
);

// DELETE: Elimina un record in base all'ID specificato
router.delete('/eliminaMisura/:id', isAdmin, repartiController.deleteMeasure);

// GET: Modifica un record (pagina di modifica)
router.get('/editMolleggio/:id', isAdmin, repartiController.editMolleggioPage);

// POST: Modifica un record in base all'ID
router.post('/editMolleggio/:id', isAdmin, repartiController.modificaMolleggio);

module.exports = router;
