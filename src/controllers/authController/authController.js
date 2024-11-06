const User = require('../../models/user');
const { signToken, deleteToken } = require('../../middleware/user-auth');
//const bcrypt = require('bcrypt');

const authController = {

  /**
   * Mostra il form di login.
   * @param {Object} req - La richiesta Express contenente il token.
   * @param {Object} res - La risposta Express.
   */
  showLoginForm : (req, res) => {
    const token = req.cookies.token;
      const options = { expiresIn: '100s', algorithm: 'RS256' };
      if (!token) return res.status(200).render('login', {error :''}); //nessun token foornito dal client
      try {
          const pub_key = fs.readFileSync('rsa.public');
          req.user = jwt.verify(token, pub_key, options);
          res.redirect('/');
      } catch (err) {
          return res.status(200).render('login', {error :''});//Il token non è valido oppure è scaduto
      }
  },

  /**
   * Gestisce la richiesta di login, verificando l'esistenza dell'utente e la correttezza della password.
   * @param {Object} req - La richiesta Express contenente username e password.
   * @param {Object} res - La risposta Express.
   */
  login : async (req, res) => {
      const { username, password } = req.body;
      console.log(req.body);
      console.log('user: ' + username);

      try {
          // Cerca l'utente nel database, assicurandosi che non sia stato eliminato
          const user = await User.findOne({ user: username, deleted: 0 });
          console.log(user);

          // Verifica se l'utente esiste
          if (!user) {
              return res.render('login', { error: 'Username o password non validi' });
          }

          // Verifica della password (la verifica non utilizza bcrypt in questo caso)
          if (password !== user.password) {
              return res.render('login', { error: 'Username o password non validi' });
          }

          console.log("\nE' admin: " + user.admin);

          // Autenticazione riuscita: impostiamo un token di sessione
          signToken(req, res, user, () => {
              console.log('login effettuato');
              // Reindirizza alla pagina principale o alla pagina dipendente in base al ruolo
              if (user.admin) {
                  res.redirect('/'); // Pagina per l'admin
              } else {
                  res.redirect('/reparti'); // Pagina per il dipendente
              }
          });

      } catch (error) {
          console.error(error);
          res.render('login', { error: 'Si è verificato un errore durante il login' });
      }
  },

  /**
   * Gestisce il logout dell'utente, rimuovendo il token di sessione.
   * @param {Object} req - La richiesta Express.
   * @param {Object} res - La risposta Express.
   */
  logout : (req, res) => {
      deleteToken(req, res, () => {
          res.redirect('/login');
      });
  }
};

module.exports = authController;
