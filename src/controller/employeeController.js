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
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const user = req.body.username;
    const password = req.body.password;
    const admin = req.body.isAdmin;
    let isAdmin = false;
    
    if(admin === "admin") {
        isAdmin = true;
    }

    const utente = new User({
        nome: nome,
        cognome: cognome,
        user:user,
        password:password,
        admin : isAdmin,
        deleted : 0

    });

    await utente.save();

    res.redirect('/dipendenti');
};

module.exports = employeeController;