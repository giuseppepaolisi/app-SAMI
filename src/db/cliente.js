const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nome: String,
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports =  Cliente;