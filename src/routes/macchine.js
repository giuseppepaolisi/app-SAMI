const express = require('express');
const router = express.Router();
const macchineController = require('../controller/macchineController');
const mongoose = require("mongoose");
const { verifyToken, isAdmin, signToken, deleteToken } = require('../middleware/user-auth');

const Macchine = require ("../model/macchine");

router.get('/macchine', isAdmin, (req, res, next) => {
    macchineController.getAll(req, res, next);
});

router.delete('/eliminaMacchina/:id',isAdmin, async (req, res, next) => {
    const elementId = req.params.id;
    console.log(elementId);
    // Verifica se l'ID è vuoto o nullo
    if (!elementId || elementId === "null") {
      return res.status(400).json({ message: "ID elemento non valido" });
    }
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const flag = {
        deleted : true
    };
    Macchine.findByIdAndUpdate(elementId, flag, { new: true, runValidators: true })
      .then((flag) => {
        if(flag) {
          console.log('Elemento aggiornato:', flag);
          res.json({ message: "Elemento eliminato con successo" });
        } else {
          console.log('Elemento non trovato.');
        }
      }).catch((errore) => {
        console.error('Errore durante l\'aggiornamento dell\'elemento:', errore);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
      });
  });

module.exports = router;