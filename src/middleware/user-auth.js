const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Caricamento chiavi e opzioni una volta sola
const pub_key = fs.readFileSync(path.resolve( 'rsa.public'));
const prv_key = fs.readFileSync(path.resolve( 'rsa.private'));
const jwtOptions = { expiresIn: '2h', algorithm: 'RS256' };

// Middleware per la verifica del token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(200).redirect('/login'); // Nessun token fornito

    try {
        req.user = jwt.verify(token, pub_key, jwtOptions);
        next();
    } catch (err) {
        console.error("Errore di verifica del token:", err);
        return res.status(200).redirect('/login'); // Token non valido o scaduto
    }
}

// Middleware per autorizzare solo dipendenti (non admin)
function isEmployee(req, res, next) {
    verifyToken(req, res, (err) => {
        if (err || req.user.isAdmin) return res.status(200).redirect('/login'); // Accesso non consentito per admin
        next();
    });
}

// Middleware per autorizzare solo admin
function isAdmin(req, res, next) {
    verifyToken(req, res, (err) => {
        if (err || !req.user.isAdmin) return res.status(200).redirect('/login'); // Accesso non consentito per non admin
        next();
    });
}

// Generazione del token JWT
function signToken(req, res, user, next) {
    const payload = { user: req.body.username, isAdmin: user.admin, isLogged: true };
    const cookieOptions = {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 ore
        httpOnly: true,
        secure: true
    };
    const token = jwt.sign(payload, prv_key, jwtOptions);
    res.cookie('token', token, cookieOptions);
    res.cookie('nome', user.nome, cookieOptions);
    res.cookie('cognome', user.cognome, cookieOptions);
    next();
}

// Eliminazione del token
function deleteToken(req, res, next) {
    const cookieOptions = {
        expires: new Date(0),
        httpOnly: true,
        secure: false
    };
    res.cookie('token', '', cookieOptions);
    next();
}

// Funzione per ottenere dati dal token
function getData(token) {
    try {
        const decoded = jwt.verify(token, pub_key, jwtOptions);
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
};
