const express = require('express');
const router = express.Router();
const macchineController = require('../controllers/macchineController');
const { isEmployee, isAdmin } = require('../middleware/user-auth');

// Controller route
router.get('/macchine', isAdmin, macchineController.getAll);
router.delete('/eliminaMacchina/:id', isAdmin, macchineController.deleteMacchine);
router.post('/addMacchina', isAdmin, macchineController.addMacchine);
router.get('/macchine/:reparto/:tipo/', isEmployee, macchineController.getMacchine);

// template route
router.get('/addMacchina',isAdmin, async (req, res, next) => {
  res.render('addMacchina');
});

module.exports = router;