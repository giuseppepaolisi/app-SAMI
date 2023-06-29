var express = require('express');
var router = express.Router();
const User = require("./../db/user.js");
const mongoose = require('mongoose');
const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');

/* GET users listing. */
router.get('/', isAdmin, function(req, res, next) {
  res.render('index', { title: 'Users' });
});

router.get('/lista', verifyToken, async function(req, res, next) {
  const uri = process.env.DB_URI || "";
  console.log("uri: "+ uri);
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  console.log("\n\nLista");
  console.log(await User.find({}).exec());
  res.render('index', { title: 'Lista' });
});

module.exports = router;
