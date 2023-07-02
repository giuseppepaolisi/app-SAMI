const express = require('express');
const router = express.Router();
const Auth = require('../controller/authController');

/* GET insert page. */
router.get('/', function(req, res, next) {

  res.render('insert');
});

/* POST send data to db*/
router.post('/', (req, res) => {
  console.log('inizio insert');


  

});


module.exports = router;
