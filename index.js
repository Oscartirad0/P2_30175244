import express from 'express';
import bodyParser from 'body-parser';
import ContactosController from './controllers/ContactosController.js';
import ContactosModel from './models/ContactosModel.js';
import emailHelper from "./helpers/emailHelper.js";
import session from 'express-session';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // Importar rutas de autenticación
import adminRoutes from './routes/admin.js'; // Importar rutas de administración

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de express-session con cookies seguras
app.use(session({
  secret: '12345678', // Cambia esto por una cadena secreta segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // La cookie no es accesible desde JavaScript en el cliente
    sameSite: 'strict', // La cookie solo se enviará en solicitudes del mismo sitio
    secure: process.env.NODE_ENV === 'production', // La cookie solo se enviará sobre HTTPS en producción
    maxAge: 15 * 60 * 1000 // Expiración de la cookie después de 15 minutos de inactividad
  }
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// SQLite setup
(async () => {
  try {
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS envios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT,
      comentario TEXT,
      ip TEXT,
      pais TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    app.locals.db = db;
  } catch (error) {
    console.error('Error setting up database:', error);
  }
})();

// Passport setup
passport.use(new GoogleStrategy({
  clientID: "1062782463086-mpmkvq9npeie2i7faofi4aopnor90adu.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const db = app.locals.db;
  let user = await db.get('SELECT * FROM users WHERE username = ?', profile.id);
  if (!user) {
    const result = await db.run('INSERT INTO users (username) VALUES (?)', profile.id);
    user = { id: result.lastID, username: profile.id, role: 'user' };
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const db = app.locals.db;
  const user = await db.get('SELECT * FROM users WHERE id = ?', id);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de administración
app.use('/admin', adminRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta de perfil
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/auth/login');
  }
});

// Ruta para enviar correos
app.post('/formulario', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let info = await emailHelper(to, subject, text);
    res.status(200).send(`Email Enviado: ${info.response}`);
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

// Ruta para manejar el envío del formulario
app.post('/enviar', async (req, res) => {
  const { nombre, email, comentario } = req.body;
  const ip = req.ip;
  const pais = '56b73a6a7af120a643f2bb37d5234a26'; // Aquí podrías usar una API para obtener el país basado en la IP

  try {
    const db = app.locals.db;
    await db.run('INSERT INTO envios (nombre, email, comentario, ip, pais) VALUES (?, ?, ?, ?, ?)', 
      [nombre, email, comentario, ip, pais]);
    res.redirect('/');
  } catch (error) {
    console.error('Error al guardar el envío:', error);
    res.status(500).send('Error al guardar el envío');
  }
});

// Ruta autenticada para mostrar los envíos
app.get('/envios', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }

  try {
    const db = app.locals.db;
    const envios = await db.all('SELECT * FROM envios');
    res.render('envios', { envios });
  } catch (error) {
    console.error('Error al obtener los envíos:', error);
    res.status(500).send('Error al obtener los envíos');
  }
});

// Rutas existentes
app.post('/contactos', (req, res) => {
  ContactosController.add(req, res);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log("corriendo en el puerto 3000");
});