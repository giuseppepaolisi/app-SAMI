const express = require('express');
const router = express.Router();
const Auth = require('../controller/authController');

/* GET login page. */
router.get('/', function(req, res, next) {
  Auth.showLoginForm(req, res);
  res.render('login');
});

/* POST effettua il login*/
router.post('/', (req, res) => {
  console.log('inizio login');
  Auth.login(req, res);

});

router.get('/logout', (res, req) => {
  console.log('Logout!');
  Auth.logout(req, res);
});

module.exports = router;
