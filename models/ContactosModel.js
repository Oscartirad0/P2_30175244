import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('./MiBaseDeDatos.db');

class ContactosModel {
  static saveContact({ email, nombre, mensaje, ip, fecha, country, region, city }) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO contactos (email, nombre, mensaje, ip, fecha, country, region, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(query, [email, nombre, mensaje, ip, fecha, country, region, city], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
}

export default ContactosModel;
