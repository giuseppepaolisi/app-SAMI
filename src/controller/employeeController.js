const User = require("./../db/user.js");
const mongoose = require('mongoose');

const employeeController = {};

employeeController.getEmployees = async (req, res, next) => {
    const uri = process.env.DB_URI || "";
    console.log("uri: "+ uri);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("\n\nLista");
    console.log(await User.find({deleted: 0}).exec());
    res.render('index', { title: 'Lista' });
};

employeeController.addEmployee = async (req, res, next) => {
    try {
        const uri = process.env.DB_URI || "";
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        const nome = req.body.nome;
        const cognome = req.body.cognome;
        const user = req.body.username;
        const password = req.body.password;
        const admin = req.body.isAdmin;
        let isAdmin = false;
        
        if (admin === "admin") {
            isAdmin = true;
        }

        const utente = new User({
            nome: nome,
            cognome: cognome,
            user: user,
            password: password,
            admin: isAdmin,
            deleted: 0
        });

        await utente.save();

        res.redirect('/dipendenti');
    } catch (error) {
        if (error.code === 11000) {
          // Errore di duplicazione dell'indice (campo "user" duplicato)
          const message = 'L\'utente con questo nome utente è già presente nel sistema.';
          return res.status(400).render('error', { message });
        } else {
          // Altri errori
          console.error('Errore durante l\'inserimento dell\'utente:', error);
          const message = 'Si è verificato un errore durante l\'inserimento dell\'utente.';
          return res.status(500).render('error', { message });
        }
      }          
};

employeeController.deleteEmployee = async (req, res, next) => {
    const elementId = req.params.id;
    console.log(elementId);
        const uri = process.env.DB_URI || "";
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const flag = {
        deleted : 1
        };
        User.findByIdAndUpdate(elementId, flag, { new: true, runValidators: true })
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
};

module.exports = employeeController;