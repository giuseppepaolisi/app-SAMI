const express = require('express');
const app = express();
const connection = require('./config/db_connection');

app.get('/', (req, res) => {
  connection.query('SELECT * FROM macchine', (err, results) => {
    if (err) throw err;
    console.log('I risultati della query sono:', results);
    res.send(results);
  });
});

app.listen(3000, () => console.log('Server avviato sulla porta 3000'));
