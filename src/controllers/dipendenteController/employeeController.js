const User = require("../../models/user.js");

const employeeController = {

    /**
     * Recupera e mostra la lista degli impiegati non eliminati.
     * @param {Object} req - La richiesta Express.
     * @param {Object} res - La risposta Express.
     */
    getEmployees : async (req, res, next) => {
        try {
            const employees = await User.find({ deleted: 0 }).exec();
            res.render('tables', { title: 'Lista', employees });
        } catch (error) {
            console.error('Errore nel recupero degli impiegati:', error);
            return res.status(500).render('error', { message: 'Si è verificato un errore nel recupero degli impiegati.' });
        }
    },

    /**
     * Aggiunge un nuovo impiegato nel sistema.
     * @param {Object} req - La richiesta Express contenente i dati del nuovo impiegato.
     * @param {Object} res - La risposta Express.
     */
    addEmployee : async (req, res, next) => {
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
                console.error('Errore durante l\'inserimento dell\'utente:', error);
                const message = 'Si è verificato un errore durante l\'inserimento dell\'utente.';
                return res.status(500).render('error', { message });
            }
        }          
    },

    /**
     * Imposta come eliminato un impiegato specifico, indicato dall'ID.
     * @param {Object} req - La richiesta Express contenente l'ID dell'impiegato.
     * @param {Object} res - La risposta Express.
     */
    deleteEmployee : async (req, res, next) => {
        const elementId = req.params.id;

        try {
            const updatedUser = await User.findByIdAndUpdate(
                elementId,
                { deleted: 1 },
                { new: true, runValidators: true }
            );

            if (updatedUser) {
                res.json({ message: "Elemento eliminato con successo" });
            } else {
                res.status(404).json({ message: "Elemento non trovato" });
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione dell\'elemento:', error);
            res.status(500).json({ message: "Errore durante l'eliminazione dell'elemento" });
        }
    },

    /**
     * Modifica le informazioni di un impiegato specifico.
     * @param {Object} req - La richiesta Express contenente i nuovi dati dell'impiegato.
     * @param {Object} res - La risposta Express.
     */
    editUser : async (req, res, next) => {
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
                res.redirect('/dipendenti');
            } else {
                res.status(404).render('error', { message: 'Elemento non trovato.' });
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento dell\'elemento:', error);
            return res.status(500).render('error', { message: 'Errore durante l\'aggiornamento dell\'elemento.' });
        }
    },

    /**
     * Mostra la pagina di modifica per i dati di un utente specifico.
     * @param {Object} req - La richiesta Express contenente l'ID dell'utente.
     * @param {Object} res - La risposta Express.
     */
    getEditUserPage : async (req, res, next) => {
        const elementId = req.params.id;

        try {
            const user = await User.findById(elementId).exec();

            if (user) {
                res.render('editUser', { user });
            } else {
                res.status(404).render('error', { message: 'Utente non trovato.' });
            }
        } catch (error) {
            console.error('Errore durante il recupero dell\'utente:', error);
            return res.status(500).render('error', { message: 'Errore durante il recupero dell\'utente.' });
        }
    },

    /**
     * Recupera e visualizza la lista dei dipendenti non eliminati.
     * @param {Object} req - La richiesta Express.
     * @param {Object} res - La risposta Express.
     */
    getEmployeesList : async (req, res, next) => {
        try {
            const list = await User.find({ deleted: 0 }).exec();
            const aheader = ['nome', 'cognome', 'user', 'password'];

            res.render('tables', { title: 'Dipendenti', aheader: aheader, list: list });
        } catch (error) {
            console.error('Errore durante il recupero dei dipendenti:', error);
            res.status(500).render('error', { message: 'Errore durante il recupero dei dipendenti.' });
        }
    }
};

module.exports = employeeController;