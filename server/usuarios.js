import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

// Necesario para obtener la ruta actual en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisificar sqlite3
const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, 'baseDeDatosClientes.db');

// Crear la conexión con la base de datos
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos.');
  }
});

// Crear la tabla "clientes" si no existe
const crearTabla = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;

  return new Promise((resolve, reject) => {
    db.run(createTableQuery, (err) => {
      if (err) {
        reject('Error al crear la tabla "clientes": ' + err.message);
      } else {
        console.log('Tabla "clientes" creada o ya existe.');
        resolve();
      }
    });
  });
};

// Tabla hash en memoria
const usuariosHash = {};

// Función para registrar un nuevo cliente
const registrarCliente = (username, email, password) => {
  const saltRounds = 10;

  return new Promise((resolve, reject) => {
    // Hashear la contraseña
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        reject('Error al hashear la contraseña: ' + err.message);
        return;
      }

      // Almacenar el usuario en la tabla hash en memoria
      usuariosHash[username] = {
        email: email,
        password: hashedPassword,
      };

      // Almacenar en la base de datos
      const insertQuery = `
        INSERT INTO clientes (username, email, password)
        VALUES (?, ?, ?)
      `;
      db.run(insertQuery, [username, email, hashedPassword], (err) => {
        if (err) {
          reject('Error al insertar cliente: ' + err.message);
        } else {
          console.log('Cliente registrado correctamente.');
          resolve();
        }
      });
    });
  });
};

// Función principal
const main = async () => {
  try {
    await crearTabla();
    await registrarCliente('federico', 'federicosa@example.com', 'boludo');
  } catch (error) {
    console.error(error);
  } finally {
    // Cerrar la conexión cuando todo haya terminado
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la conexión:', err.message);
      } else {
        console.log('Conexión cerrada correctamente.');
      }
    });
  }
};

// Ejecutar la función principal
main();
