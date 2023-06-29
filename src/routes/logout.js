const express = require('express');
const router = express.Router();
const Auth = require('../controller/authController');

/* GET login page. */
router.get('/', function(req, res, next) {
    console.log('Logout!');
    Auth.logout(req, res);
});

module.exports = router;
