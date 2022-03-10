
const SQLite3 = require('sqlite3').verbose()
const dbFile = './homeauto.db'

let db = new SQLite3.Database(dbFile, SQLite3.OPEN_READWRITE, (err) => {
  if(err) throw err;
  console.log("Koneksi ke database berhasil!");
})

const createConnection = async () => {
  await db.serialize()
};

const database = async () => {
  
}

module.exports = {
  db,
  createConnection
};
