const User = require("./../model/user.js");

const employeeController = {};

// Ottiene la lista degli impiegati
employeeController.getEmployees = async (req, res, next) => {
    try {
        const employees = await User.find({ deleted: 0 }).exec();
        console.log("\n\nLista", employees);
        res.render('tables', { title: 'Lista', employees });
    } catch (error) {
        console.error('Errore nel recupero degli impiegati:', error);
        return res.status(500).render('error', { message: 'Si è verificato un errore nel recupero degli impiegati.' });
    }
};

// Aggiunge un nuovo impiegato
employeeController.addEmployee = async (req, res, next) => {
    try {
        const { nome, cognome, username, password, isAdmin } = req.body;

        const utente = new User({
            nome,
            cognome,
            user: username,
            password,
            admin: isAdmin === "admin",
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

// Elimina un impiegato
employeeController.deleteEmployee = async (req, res, next) => {
    const elementId = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            elementId,
            { deleted: 1 },
            { new: true, runValidators: true }
        );

        if (updatedUser) {
            console.log('Elemento aggiornato:', updatedUser);
            res.json({ message: "Elemento eliminato con successo" });
        } else {
            console.log('Elemento non trovato.');
            res.status(404).json({ message: "Elemento non trovato" });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'elemento:', error);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
    }
};

// Modifica un dipendente
employeeController.editUser = async (req, res, next) => {
    const elementId = req.params.id;
    const { nome, cognome, password } = req.body;

    try {
        const editingUser = {
            nome,
            cognome,
            password
        };

        const updatedUser = await User.findByIdAndUpdate(
            elementId,
            editingUser,
            { new: true, runValidators: true }
        );

        if (updatedUser) {
            console.log('Elemento aggiornato:', updatedUser);
            res.redirect('/dipendenti');
        } else {
            console.log('Elemento non trovato.');
            res.status(404).render('error', { message: 'Elemento non trovato.' });
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'elemento:', error);
        return res.status(500).render('error', { message: 'Errore durante l\'aggiornamento dell\'elemento.' });
    }
};

// Visualizza la pagina di modifica dati per un utente
employeeController.getEditUserPage = async (req, res, next) => {
    const elementId = req.params.id;

    try {
        // Trova l'utente in base all'ID
        const user = await User.findById(elementId).exec();

        if (user) {
            console.log(user.nome + " ECCOMIIIII");
            // Renderizza la pagina di modifica dati dell'utente
            res.render('editUser', { user });
        } else {
            console.log('Utente non trovato.');
            res.status(404).render('error', { message: 'Utente non trovato.' });
        }
    } catch (error) {
        console.error('Errore durante il recupero dell\'utente:', error);
        return res.status(500).render('error', { message: 'Errore durante il recupero dell\'utente.' });
    }
};

// Lista dei dipendenti
employeeController.getEmployeesList = async (req, res, next) => {
    try {
        // Recupera la lista degli utenti non eliminati
        const list = await User.find({ deleted: 0 }).exec();
        const aheader = ['nome', 'cognome', 'user', 'password'];

        // Renderizza la pagina con la lista dei dipendenti
        res.render('tables', { title: 'Dipendenti', aheader: aheader, list: list });
    } catch (error) {
        console.error('Errore durante il recupero dei dipendenti:', error);
        res.status(500).render('error', { message: 'Errore durante il recupero dei dipendenti.' });
    }
};

module.exports = employeeController;