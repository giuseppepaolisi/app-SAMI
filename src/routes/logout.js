const express = require('express');
const router = express.Router();
const Auth = require('../controllers/authController');

/* GET login page. */
router.get('/logout', Auth.logout);

module.exports = router;
