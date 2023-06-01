//const mongose = require('mongoose');
import mongoose from 'mongoose'
require('dotenv').config({path: '../env/developement.env'});

/**
 * Connessione al database MongoDB sami_db
 */

const uri = process.env.DB_URI || "";
const db_name = process.env.DB_NAME;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to MongoDB');
});
db.on('disconnected', function() {
  // we're disconnected!
  console.log('Disconnected from MongoDB');
});
