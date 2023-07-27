const express = require('express');
const router = express.Router();
const {verifyToken, isEmployee} = require('../middleware/user-auth');
const macchineController = require('../controller/macchineController');

router.get('/macchine', (req, res, next) => {
    macchineController.getAll(req, res, next);
});

module.exports = router;