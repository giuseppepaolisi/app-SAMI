const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  ragioneSociale: String,
  tipologia: String,
  deleted: Boolean,
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;
