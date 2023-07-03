const express = require('express');
const router = express.Router();
const employee = require('../controller/employeeController');
const {verifyToken} = require('../middleware/user-auth');


//permette di visualizzare la lista di reparti disponibili
router.get('/reparti', (req, res) => {
  res.render('dipendente/reparti.ejs');
});

//permette di selezionare il reparto di riferimento
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
            res.redirect('macchine/imballaggio');//porta a macchine l'imballaggio non ha una tipologia di molla a cui fare riferimento.
            break;
        default:
            res.redirect('/reparti');
            break; //errore
    }
    
});

//permette di visualizzare la lista di macchine dopo aver selezionato reparto e tipologia di molla
router.get('/macchine/:reparto/:tipo/', (req, res) => {
    console.log("\n\nMACCHINE");
    employee.getMacchine(req, res);
  });

  //permette di visualizzare la lista di macchine dopo aver selezionato il reparto assemblaggio
  router.get('/macchine/:reparto/', (req, res) => {
    console.log("\n\nMACCHINE");
    employee.getMacchine(req, res);
  });

  //permette di visualizzare il form di inserimento dopo aver selezionato reparto, tipo molla e macchina
  router.get('/inserisci/:reparto/:tipo/:macchina', (req, res) => {
    console.log("\n\nInserisci " + req.params.reparto + "\n"+ req.params.tipo + "\n" + req.params.macchina);
    res.render('insert.ejs', {reparto : req.params.reparto, tipo: req.params.tipo, macchina:req.params.macchina});
  });

  //permette di visualizzare il form di inserimento dopo aver selezionato reparto e macchina
  router.get('/inserisci/:reparto/:macchina', (req, res) => {
    console.log("\n\nInserisci " + req.params.reparto);
    res.render('insert.ejs', {reparto : req.params.reparto, macchina:req.params.macchina});
  });


module.exports = router;