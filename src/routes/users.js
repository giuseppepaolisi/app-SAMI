var express = require('express');
var router = express.Router();
const employee = require('../controller/employeeController');
const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');

/* GET users listing. */
router.get('/', isAdmin, function(req, res, next) {
  res.render('index', { title: 'Users' });
});

router.get('/lista', verifyToken, async function(req, res, next) {
  employee.getEmployees(req, res,next);
});

router.post('/addUser', async (req, res, next) => {
  employee.addEmployee(req, res, next);

});

module.exports = router;
