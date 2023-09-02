const User = require('../db/user');
const { signToken, deleteToken } = require('../middleware/user-auth');
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const authController = {};

// Mostra il form di login
authController.showLoginForm = (req, res) => {
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
};

// Gestisce la richiesta di login
authController.login = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  console.log('user: ' + username);

  try {
    // Cerca l'utente nel database
    const uri = process.env.DB_URI || "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ user: username, deleted:0 });
    console.log(user);

    // Verifica se l'utente esiste
    if (!user) {
      return res.render('login', { error: 'Username o password non validi' });
    }

    // Verifica la password
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password != user.password) {
      return res.render('login', { error: 'Username o password non validi' });
    }

    console.log("\nE' admin: " + user.admin);
    // Autenticazione riuscita, impostiamo una sessione
    signToken(req, res, user, () => {
      // Reindirizzamento alla pagina principale o ad un'altra pagina dopo il login
      console.log('login effettuato');
      if(user.admin){
        res.redirect('/');//pagina utente dell'admin
      } else {
        res.redirect('/reparti');//pagina iniziale dipendente
      }
    });

    
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Si è verificato un errore durante il login' });
  }
};

// Gestisce il logout
authController.logout = (req, res) => {
  deleteToken(req,res, () => {
    res.redirect('/login');
  });
};

module.exports = authController;
