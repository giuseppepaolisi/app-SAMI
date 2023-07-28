const Reparti = require('../db/reparti');
const Macchine = require('../db/macchine');

const mongoose = require('mongoose');
const {getData} = require('../middleware/user-auth');

const repartiController = {}; //consente di esportare le funzioni

checkData = (data) => {
    if(data === '' || typeof data === 'undefined')
        return false;
    else
        return true;
};




createData =async (postData, token) => {


    let data = {};
    if(checkData(postData.tipo)) data.tipo = postData.tipo;
    if(checkData(postData.reparto)) data.reparto = postData.reparto;
    if(checkData(postData.prodFilo)) data.prodFilo = postData.prodFilo;
    if(checkData(postData.cliente)) data.cliente = postData.cliente;

    if(checkData(postData.diamFilo)) data.diamFilo = parseFloat(postData.diamFilo);
    if(checkData(postData.portata)) data.portata = parseFloat(postData.portata);
    if(checkData(postData.peso)) data.peso = parseFloat(postData.peso);
    data.data = new Date();
    if(checkData(postData.macchina)) data.macchina = postData.macchina;
    console.log("macchine " + postData.macchina);
    if(checkData(postData.quantita)) data.quantita = parseInt(postData.quantita);
    if(checkData(postData.oreLav)) data.oreLav = parseInt(postData.oreLav);
    if(checkData(postData.cambiMacchina)) data.cambiMacchina = parseInt(postData.cambiMacchina);

    if(data.reparto==="produzione" && data.tipo==="pocket"){
        //CALCOLO ORE FERMO
         const retrive = await  Macchine.findOne({macchina:data.macchina}).exec();
        console.log("RETRIVEEEEE: " + retrive);
        console.log("ORE LAVORATEEEE: " + data.oreLav);
        const oreFermo = decimalToSexagesimal((data.oreLav * retrive.molleOre)/data.quantita);

        console.log("ORE FERMOOOOOO: " + oreFermo);

        data.oreFermo=oreFermo;
    }
    
    //if(checkData(postData.oreFermo)) data.oreFermo = parseInt(postData.oreFermo);

    console.log('user: ' + token.user);
    data.user = token.user;
    
    if(checkData(postData.giriMolla)) data.giriMolla = parseInt(postData.giriMolla);
    if(checkData(postData.fileMolle)) data.file = postData.fileMolle;



    data.deleted = 0;
    console.log(data);

    return data;
};

repartiController.insertMolleggi = async (req, res) => {
    try {
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const creati= await createData(req.body, getData(req.cookies.token));
        console.log("DATI CREATI PER INSERIMENTO: " + creati);
        const molleggi = new Reparti(creati);
        molleggi.save();
    } catch (error) {
        console.error("errore "+error);
        return res.redirect('/reparti'); //errore
      }
    res.status(200);
    

    res.render("dipendente/postInsert.ejs");
};

repartiController.modificaMolleggio = (req, res, next ) => {
    const elementId = req.params.id;
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const data = createData(req.body, req.body);
    Reparti.findByIdAndUpdate(elementId, data, { new: true, runValidators: true })
    .then((data) => {
        if(data) {
            console.log('Elemento aggiornato:', data);
            if(typeof data.tipo === undefined){
                res.redirect("/prodPocket/" + data.reparto);
            } else {
                res.redirect("/prodPocket/" + data.reparto + "/" + data.tipo);
            }
        } else {
        console.log('Elemento non trovato.');
        }
    }).catch((errore) => {
        console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    });
};

//ritorna il totale di molle prodotte in un giorno se tempo = "g", ritorna quelle prodotte nel mese corrente se tempo = "m"
repartiController.getTotal = async (reparto, tipo, tempo) => {
    try {
      let dataInizio;
      let dataFine;
  
      if (tempo === "m") {
        // Calcola le date di inizio e fine del mese corrente
        const oggi = new Date();
        dataInizio = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
        dataFine = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 1);
      } else if (tempo === "g") {
        // Calcola le date di inizio e fine della giornata corrente
        const oggi = new Date();
        dataInizio = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
        dataFine = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + 1);
      } else {
        throw new Error("Il valore di 'tempo' deve essere 'm' o 'g'");
      }

      const pipeline = [
        {
          $match: {
            reparto: reparto,
            tipo: tipo,
            deleted: false,
            data: {
              $gte: dataInizio,
              $lt: dataFine
            }
          }
        },
        {
          $group: {
            _id: null,
            totalMolle: { $sum: "$quantita" }
          }
        }
      ];
      const options = {
        maxTimeMS: 30000, // Imposta il timeout a 30 secondi (30000 ms)
      };

      const uri = process.env.DB_URI || "";
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      const result = await Reparti.aggregate(pipeline, options);
      return result[0]?.totalMolle || 0;
    } catch (err) {
      console.error("Errore durante il calcolo del totale di molle:", err);
      throw err;
    }
  };

  function decimalToSexagesimal(decimalHours) {
    // Separare la parte intera (ore) dalla parte decimale (minuti)
    const hours = Math.floor(decimalHours);
    const minutesDecimal = decimalHours - hours;
    
    // Convertire i minuti decimali in minuti reali
    const minutes = Math.round(minutesDecimal * 60);
  
    return `${hours}h ${minutes}m`;
  }

  module.exports = repartiController;