const {MongoClient} = require('mongodb');
require('dotenv').config({path: '../env/developement.env'});

var url = "mongodb://127.0.0.1:27017/";
const PAGE_SIZE = 100;
const db = process.env.DB_NAME;
const collection = "reparti";

exports.showElements = function() {
     var url = "mongodb://127.0.0.1:27017/";
     const client = new MongoClient(url);
     async function main() {
          try {
               await client.connect();

               //await listDatabases(client);
               const reparti = await client.db("sami_db").collection("reparti");
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