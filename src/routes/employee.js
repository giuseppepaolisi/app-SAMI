const express = require('express');
const router = express.Router();
const employee = require('../controller/employeeController');

const bodyparse = require("body-parser");


router.get('/reparti',(req, res) => {
  res.render('dipendente/reparti.ejs');
});

router.get('/reparto/:reparto/', (req, res) => {
    console.log("\n\n" + req.params.reparto);
    switch(req.params.reparto) {
        case "produzione":
            res.render('dipendente/reparti2.ejs', {reparto: "produzione"});
            break;
        case "assemblaggio":
            res.render('dipendente/reparti2.ejs', {reparto: "assemblaggio"});
            break;
        case "imballaggio":
            res.redirect('macchine/imballaggio');//porta a macchine
            break;
        default:
            res.redirect('/reparti');
            break; //errore
    }
    
});

router.get('/macchine/:reparto/:tipo/', (req, res) => {
    console.log("\n\nMACCHINE");
    employee.getMacchine(req, res);
  });

  router.get('/macchine/:reparto/', (req, res) => {
    console.log("\n\nMACCHINE");
    employee.getMacchine(req, res);
  });

  router.get('/inserisci/:reparto/:tipo/:macchina', (req, res) => {
    console.log("\n\nInserisci " + req.params.reparto + "\n"+ req.params.tipo + "\n" + req.params.macchina);
    res.render('', {reparto : req.params.reparto, tipo: req.params.tipo});
  });

  //inserimento per l'imballaggio
  router.get('/inserisci/:reparto/:macchina', (req, res) => {
    console.log("\n\nInserisci " + req.params.reparto);
    res.render('', {reparto : req.params.reparto});
  });


module.exports = router;