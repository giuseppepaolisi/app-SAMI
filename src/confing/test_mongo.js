const {MongoClient} = require('mongodb');
require('dotenv').config({path: '../env/developement.env'});

const url = process.env.DB_URI;
const db_name = process.env.DB_NAME;
const collection = "reparti";

exports.showElements = function() {
     
     const client = new MongoClient(url);
     async function main() {
          try {
               await client.connect();
               //await listDatabases(client);
               const reparti = await client.db(db_name).collection("reparti");
               const cursor = reparti.find({});

               for await (const doc of cursor) {
                    console.log(doc);
               }
          } catch (e) {
               console.error(e);
          } finally {
               await client.close();
          }
     }
     main().catch(console.error);
};