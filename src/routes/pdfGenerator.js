const express = require("express");
const router = express.Router();
//const PDFDocument = require("pdfkit");
const fs = require("fs");
const mongoose = require("mongoose");
const Reparti = require ("./../db/reparti");
const PDFDocument = require('pdfkit-table');
const moment = require('moment');

router.get("/download-pdf/:reparto/:tipo?", async (req, res) => {
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

    // Crea un nuovo documento PDF
    const doc = new PDFDocument();

    // Aggiungi il titolo della tabella
    doc.fontSize(16).text("Tabella " + reparto + " " + tipo, { align: "center" });

    // Header della tabella
    const tableHeaders = Object.keys(list[0]._doc).filter(key => !['__v', 'tipo', 'reparto', 'deleted', '_id'].includes(key));

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
    res.header('Content-Disposition', 'attachment; filename=example.pdf');

    // Invia il documento PDF come risposta al client
    doc.pipe(res);
  } catch (err) {
    console.error("Errore durante la creazione e il download del PDF:", err);
    res.status(500).send("Errore durante la creazione del PDF.");
  }
});


module.exports = router;
