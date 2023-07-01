var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");

const User = require ("./../db/user.js")

const bodyparse = require("body-parser");


router.get('/reparti', (req, res) => {
  res.render('dipendente/reparti.ejs');
});

router.get('/reparto/:reparto/', (req, res) => {
    console.log("\n\n" + req.params.reparto);
    switch(req.params.reparto) {
        case "produzione":
            res.render('dipendente/reparti2.ejs', {reparto: "Produzione"});
            break;
        case "assemblaggio":
            res.render('dipendente/reparti2.ejs', {reparto: "Assemblaggio"});
            break;
        case "imballaggio":
            res.render('dipendente/macchine.ejs', {reparto: "imballaggio"});//porta a macchine
            break;
        default:
            break; //errore
    }
    
});

router.get('/macchine/:reparto/:tipo/', (req, res) => {
    console.log("\n\n" + req.params.reparto + "\n"+ req.params.tipo);
    switch(req.params.tipo) {
        case "pocket":
            res.render('dipendente/macchine.ejs', {reparto: "Produzione"});
            break;
        case "bonnel":
            res.render('dipendente/macchine.ejs', {reparto: "Assemblaggio"});
            break;
        default:
            break; //errore
    }
    res.render('dipendente/macchine.ejs', {});
  });


module.exports = router;