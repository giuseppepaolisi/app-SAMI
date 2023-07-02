const Macchine = require('../db/macchine');
const mongoose = require('mongoose');

const employeeController = {};

function checkReparto(reparto) {
    if(reparto === "produzione" || reparto === "assemblaggio" || reparto === "imballaggio") {
        return true;
    } else {
        return false;
    }
}

function checkTipo(tipo) {
    if(tipo === "pocket" || tipo === "bonnel") {
        return true;
    } else {
        return false;
    }
}

//fornisce una lista di macchine in base al reparto e il tipo di molle selezionato
employeeController.getMacchine = async (req, res) => {
    const reparto = req.params.reparto;
    const tipo = req.params.tipo;
    console.log(reparto + " " + tipo);
    if(typeof reparto === 'undefined' || !checkReparto(reparto)) {
        console.log('if');
        return res.redirect('/reparti'); //link manomesso
    }
    
    let query = {};
    
    if(typeof tipo === 'undefined') {
        query = {reparto: reparto};
    } else if(checkTipo(tipo)) {
        query = {reparto: reparto, tipo: tipo};
    } else {
        console.log('else');
        return res.redirect('/reparti'); //link manomesso
    }
    
    try {
      // Cerca le macchine nel database
      const uri = process.env.DB_URI || "";
      console.log(uri);
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      const macchine = await Macchine.find(query);
      console.log("macchine :\n" + macchine);
      
      let parametri = {};
      if(reparto === "imballaggio") {
        parametri = {
            reparto: reparto,
            macchine: macchine};
      } else {
        parametri = {
            reparto: reparto,
            tipo: tipo,
            macchine: macchine};
      }
      res.render('dipendente/macchine.ejs', parametri);
    } catch (error) {
      console.error("errore "+error);
      return res.redirect('/reparti'); //errore
    }
  };

  module.exports = employeeController;