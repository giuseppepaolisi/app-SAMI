const express = require('express');
const router = express.Router();
const ferieController = require('../controllers/ferieController/ferieController');
const { isAdmin } = require('../middleware/user-auth');

// Permette di cancellare un dipendente dal sistema
router.delete('/eliminaFerie/:id', isAdmin, ferieController.deleteFerie);

// Permette di visualizzare la pagina di modifica dati per un utente
router.get('/editFerie/:id', isAdmin, ferieController.getEditFeriePage);

// Permette di modificare i dati riguardanti un utente
router.post('/editFerie/:id', isAdmin, ferieController.updateFerie);

// Aggiugni Ferie
router.get('/addFerie', isAdmin, ferieController.getAddFeriePage);
router.post('/addFerie', isAdmin, ferieController.addFerie);
// Conferma inserimento ferie
router.get('/conferma', isAdmin, ferieController.getConfirmaPage);

// Mostra la lista delle ferie
router.get('/showFerie', isAdmin, ferieController.showFerie);

// Calendario delle ferie
router.get('/calendario', isAdmin, ferieController.getCalendarPage);

module.exports = router;