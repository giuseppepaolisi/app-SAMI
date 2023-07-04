const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/user-auth');
const repartiController = require('../controller/repartiController');

/* POST send data to db*/
router.post('/insert', (req, res) => {
  console.log('inizio insert POST');
  console.log(req.body.time);
  repartiController.insertMolleggi(req, res);
});


module.exports = router;
