const express = require('express');

const clienteController = require('../controller/clienteController');
const { isAdmin  } = require('../middleware/user-auth');

const router = express.Router();

// Controller route
router.get('/showCliente', isAdmin, clienteController.getClienti);
router.post('/addCliente', isAdmin, clienteController.addCliente);
router.delete('/eliminaCliente/:id', isAdmin, clienteController.deleteCliente);

// Template route
router.get('/addCliente', isAdmin, (req, res) => {
    res.render('addCliente', { title: 'Aggiungi Cliente' });
});

  module.exports = router;