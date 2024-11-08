const express = require('express');
const router = express.Router();
const Auth = require('../controllers/authController/authController');

/* GET login page. */
router.get('/login', Auth.showLoginForm);

/* POST effettua il login*/
router.post('/login', Auth.login);

module.exports = router;
