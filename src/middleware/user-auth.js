const jwt = require('jsonwebtoken');
const fs = require('fs');
//definisce lla durata del token e l'algoritmo utilizzato
const options = { expiresIn: '100s', algorithm: 'RS256' };

//verifica che l'utente sia loggato
function verifyToken(req,res,next) {
    const token = req.cookies.token;
    const options = { expiresIn: '100s', algorithm: 'RS256' };
    if (!token) return res.status(200).redirect('/login'); //nessun token foornito dal client
    try {
        const pub_key = fs.readFileSync('rsa.public');
        req.user = jwt.verify(token, pub_key, options);
        next();
    } catch (err) {
        return res.status(200).redirect('/login');//Il token non è valido oppure è scaduto
    }
}

//verifica che l'utente è loggato ed è un dipendente
function isEmployee(req,res,next) {
    const token = req.cookies.token;
    const options = { expiresIn: '100s', algorithm: 'RS256' };
    if (!token) return res.status(200).redirect('/login'); //nessun token foornito dal client
    try {
        const pub_key = fs.readFileSync('rsa.public');
        req.user = jwt.verify(token, pub_key, options);
        if(!req.user.isAdmin) {
            next();
        } else {
            return res.status(200).redirect('/login');
        }
    } catch (err) {
        return res.status(200).redirect('/login');//Il token non è valido oppure è scaduto
    }
}

//verifica che l'utente è loggato ed è un admin
function isAdmin(req,res,next) {
    const token = req.cookies.token;
    const options = { expiresIn: '100s', algorithm: 'RS256' };
    if (!token) return res.status(200).redirect('/login'); //nessun token foornito dal client
    try {
        const pub_key = fs.readFileSync('rsa.public');
        req.user = jwt.verify(token, pub_key, options);
        if(req.user.isAdmin) {
            next();
        } else {
            return res.status(200).redirect('/login');
        }
    } catch (err) {
        return res.status(200).redirect('/login');//Il token non è valido oppure è scaduto
    }
}

//genera il token
function signToken(req, res, user, next) {
    const payload = { user: req.body.username, isAdmin: user.admin, isLogged: true };
    const cookieSetting = {
        expires: new Date(Date.now() + (2*60*60*1000)),
        httpOnly: true,
        secure: true
    };
    const prv_key = fs.readFileSync('rsa.private');
    // Aggiungi l'opzione expiresIn per impostare il tempo di scadenza del token a 2 ore
    // Aggiungi l'opzione algorithm per specificare l'algoritmo di firma RSA
    const options = { expiresIn: "2h", algorithm: "RS256" };
    const token = jwt.sign(payload, prv_key, options);
    res.cookie('token', token, cookieSetting);
    res.cookie('nome', user.nome, cookieSetting);
    res.cookie('cognome', user.cognome, cookieSetting);
    next();
}


//elimina il token
function deleteToken(req,res,next) {
    const cookieSetting = {
        expires: new Date(0),
        httpOnly: true,
        secure: false
    };
    console.log(req.cookies);
    res.cookie('token', '', cookieSetting);
    next();
}

function getData(token) {
    try {
      const pub_key = fs.readFileSync('rsa.public');
      const decoded = jwt.verify(token, pub_key);
      return decoded;
    } catch (err) {
      console.error('Errore durante la decodifica del token:', err);
      return null;
    }
}

module.exports = {
    verifyToken,
    isAdmin,
    isEmployee,
    signToken,
    deleteToken,
    getData
}
