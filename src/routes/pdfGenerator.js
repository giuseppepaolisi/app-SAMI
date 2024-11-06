const express = require("express");
const router = express.Router();
//const PDFDocument = require("pdfkit");
const fs = require("fs");
const mongoose = require("mongoose");
const Reparti = require ("./../models/reparti");
const PDFDocument = require('pdfkit-table');
const moment = require('moment');

const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');


router.get("/download-pdf/:reparto/:tipo?",isAdmin, async (req, res) => {
  try {
    // Recupera i dati dei documenti dal database
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const reparto = req.params.reparto;
    let tipo = req.params.tipo;
    let parametri = {};

    // Imposta i parametri di query in base al reparto e tipo
    if (reparto === "imballaggio") {
      //deleted: 0
      parametri = {
        reparto: reparto,
        deleted: 0
      };
      tipo = "";
    } else {
      parametri = {
        reparto: reparto,
        tipo: tipo,
        deleted: 0
      };
    }

    const list = await Reparti.find(parametri).exec();
    /*
    const currentDate = new Date(); // Ottieni la data corrente
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3); // Sottrai 3 mesi dalla data corrente

    const pipeline = [
      {
        $match: {
          reparto: reparto,
          tipo: tipo,
          deleted: 0,
          data: { $gte: threeMonthsAgo } // Filtra per documenti con data maggiore o uguale a quella di tre mesi fa
        }
      }
    ];

    // Eseguire la pipeline MongoDB
    Reparti.aggregate(pipeline).exec((err, results) => {
      if (err) {
        // Gestisci gli errori
      } else {
        // I risultati contengono i documenti che soddisfano i criteri
        console.log(results);
      }
    });*/

    // Crea un nuovo documento PDF
    const doc = new PDFDocument();

    // Aggiungi il titolo della tabella
    doc.fontSize(16).text("Tabella " + reparto + " " + tipo, { align: "center" });
    let keys = []
      if (reparto == "produzione" && tipo == "pocket") {
        keys = ['macchina', 'prodFilo', 'diamFilo', 'portata', 'peso', 'quantita', 'oreLav', 'oreFermo', 'cambiMacchina','data'];
      } else if (reparto == "produzione" && tipo == "bonnel") {
        keys = ['macchina', 'prodFilo', 'giriMolla', 'diamFilo', 'peso', 'quantita', 'altezza', 'oreLav','data'];
      } else if (reparto == "assemblaggio" && tipo == "pocket") {
        keys = ['macchina', 'cliente', 'misuraFilo', 'fileMolle', 'quantita', 'cambioTelina','oreLav', 'data'];
      } else if (reparto == "assemblaggio" && tipo == "bonnel") {
        keys = ['macchina', 'cliente', 'misuraFilo', 'fileMolle', 'quantita', 'cambiMacchina','oreLav', 'data'];
      } else if (reparto == "imballaggio") {
        keys = ['macchina', 'quantita', 'oreLav', 'data'];
      }

    // Header della tabella
    const tableHeaders = keys;

    // Dimensioni delle colonne della tabella
    const options = {
      fitColumns: true
    };
    // Imposta l'opzione divider per disegnare le linee verticali tra le celle con una larghezza di 1 e un'opacità di 0.5
    const divider = {
      vertical: {
        width: 1,
        opacity: 0.5,
        color: 'black'
      }
    };

    // Crea la tabella
    doc.table({
      headers: tableHeaders,
      rows: list.map(docItem => tableHeaders.map(header => {
        // Formatta la data nel formato "gg/mm/aaaa HH:MM"
        if (header === 'data') {
          return moment(docItem[header]).format('DD/MM/YYYY HH:mm');
        } else {
          return docItem[header];
        }
      })),
      options: options,
      divider: divider
    });


    doc.end();

    // Imposta l'header della risposta con il tipo di contenuto e il nome del file
    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename=${reparto}-${tipo}.pdf`);

    // Invia il documento PDF come risposta al client
    doc.pipe(res);
  } catch (err) {
    console.error("Errore durante la creazione e il download del PDF:", err);
    res.status(500).send("Errore durante la creazione del PDF.");
  }
});


module.exports = router;
