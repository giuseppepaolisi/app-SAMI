var express = require('express');
var router = express.Router();
const { isAdmin } = require('../middleware/user-auth');
const employeeController = require('../controllers/employeeController');

// Controller route
router.get('/dipendenti', isAdmin, employeeController.getEmployeesList);
router.post('/addUser', isAdmin,employeeController.addEmployee);
router.delete('/eliminaDipendente/:id', isAdmin, employeeController.deleteEmployee);
router.post('/editUser/:id', isAdmin, employeeController.editUser);

// template route

//permette di visualizzare la pagina per aggiungere un nuovo dipendente
router.get('/addUser',isAdmin, async (req, res, next) => {
    // Renderizza la pagina del calendario utilizzando il file "addUser.ejs"
    res.render('addUser');
});

// Visualizza la pagina di modifica per un dipendente
router.get('/editUser/:id', isAdmin, employeeController.getEditUserPage);

module.exports = router;