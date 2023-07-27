const Macchine = require('../db/macchine');
const mongoose = require('mongoose');

const macchineController = {}; //consente di esportare le funzioni

/*
* reparto: si riferisce a un singolo reparto [produzione, assemblaggio, imballaggio]
* tipo: si riferisce alla tipologia di molla prodotta [pocket, bonnel]
* macchine: si riferisce a una serie di macchine presenti in un determinato reparto che possono riferirsi a un particolare tipo di molla
*/

//controlla che il campo reparto ha un valore compreso nel dominio
function checkReparto(reparto) {
    if(reparto === "produzione" || reparto === "assemblaggio" || reparto === "imballaggio") {
        return true;
    } else {
        return false;
    }
}

//controlla che il campo tipo ha un valore compreso nel dominio
function checkTipo(tipo) {
    if(tipo === "pocket" || tipo === "bonnel") {
        return true;
    } else {
        return false;
    }
}

//fornisce una lista di macchine in base al reparto e il tipo di molle selezionato
macchineController.getMacchine = async (req, res) => {
    //prende i parametri
    const reparto = req.params.reparto;
    const tipo = req.params.tipo;

    //check sui parametri
    console.log(reparto + " " + tipo);
    if(typeof reparto === 'undefined' || !checkReparto(reparto)) {
        console.log('if');
        return res.redirect('/reparti'); //link manomesso
    }
    
    //creazione della query per l'interrigazione del database
    let query = {};
    
    if(typeof tipo === 'undefined') {
        query = {reparto: reparto, deleted: false};
    } else if(checkTipo(tipo)) {
        query = {reparto: reparto, tipo: tipo, deleted: false};
    } else {
        console.log('else');
        return res.redirect('/reparti'); //link manomesso
    }
    
    try {
      // Cerca le macchine nel database
      const uri = process.env.DB_URI || "";
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      const macchine = await Macchine.find(query);
      console.log("macchine :\n" + macchine);
      
      //composizione dei parametro da passare
      let parametri = {};
      if(reparto === "imballaggio") {
        parametri = {
            reparto: reparto,
            macchine: macchine
        };
      } else {
        parametri = {
            reparto: reparto,
            tipo: tipo,
            macchine: macchine
        };
      }
      res.render('dipendente/macchine.ejs', parametri);
    } catch (error) {
      console.error("errore "+error);
      return res.redirect('/reparti'); //errore
    }
  };

  //restituisce tutte le macchine presenti nel sistema
  macchineController.getAll = async (req, res, next) => {
    try {
        // Cerca le macchine nel database
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const macchine = await Macchine.find({deleted:false}); 
        const aheader = ["macchina", "reparto", "tipo", "ore"];
        
        res.render('tableMacchine.ejs', {list:macchine, aheader:aheader});
      } catch (error) {
        console.error("errore "+error);
        return res.redirect('/'); //errore
      }
  };

 macchineController.addMacchine= async (req, res, next) => {
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    const reparto = req.body.reparto;
    const tipo = req.body.tipo;
    const macchina = req.body.macchina;
    const molleOre = req.body.molleOre;
    //let deleted = false;
    

  if(reparto==="produzione"){
    const macchine = new Macchine({
        reparto: reparto,
        tipo: tipo,
        macchina:macchina,
        molleOre:molleOre,
        deleted : 0

     });
     await macchine.save();

    } else if(reparto==="assemblaggio"){
        const macchine = new Macchine({
            reparto: reparto,
            tipo: tipo,
            macchina:macchina,
            deleted : 0
    
         });
         await macchine.save();

        } else {
    const macchine = new Macchine({
        reparto: reparto,
        macchina:macchina,
        deleted : 0

     });
     await macchine.save();

    }

    res.redirect('/macchine');
};


  module.exports = macchineController;