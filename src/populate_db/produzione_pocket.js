const mongoose = require("mongoose");
const faker = require("faker");
const Reparti = require("./../model/reparti");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname,'./../.env')});

const uri = process.env.DB_URI || "";
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connesso al database MongoDB.");

    // Funzione per convertire un valore decimale in formato sessagesimale (ore, minuti, secondi)
    function decimalToSexagesimal(decimal) {
      const ore = Math.floor(decimal);
      const minutiDecimali = (decimal - ore) * 60;
      const minuti = Math.floor(minutiDecimali);
      const secondi = Math.round((minutiDecimali - minuti) * 60);

      return `${ore}:${minuti.toString().padStart(2, '0')}:${secondi.toString().padStart(2, '0')}`;
    }

    const inserisciDatiCasuali = async () => {
      try {
        const promesseInserimenti = [];

        for (let i = 0; i < 1000; i++) {
          const nuovoDato = {
            prodFilo: faker.commerce.productName(),
            diamFilo: faker.random.number({ min: 1.9, max: 2.5, precision: 0.1 }),
            portata: faker.random.number({ min: 200, max: 2000 }),
            peso: faker.random.number({ min: 1, max: 100 }),
            quantita: faker.random.number({ min: 1, max: 1000000 }),
            oreLav: faker.random.number({ min: 1, max: 8 }),
            user: faker.internet.userName(),
            data: faker.date.future(),
            reparto: "produzione",
            tipo: "pocket",
            macchina: "macchina1",
            oreFermo: '2h',
            deleted: false
          };

          promesseInserimenti.push(Reparti.create(nuovoDato));
        }

        await Promise.all(promesseInserimenti);

        console.log("Inserimento completato.");
        process.exit(0);
      } catch (errore) {
        console.error("Errore durante l'inserimento:", errore);
        process.exit(1);
      }
    };

    inserisciDatiCasuali();
  })
  .catch((errore) => {
    console.error("Errore durante la connessione al database MongoDB:", errore);
    process.exit(1);
  });
