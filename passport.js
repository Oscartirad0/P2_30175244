// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuración de la estrategia de Google
passport.use(new GoogleStrategy({
    clientID: "1062782463086-mpmkvq9npeie2i7faofi4aopnor90adu.apps.googleusercontent.com", // Usa variables de entorno para mayor seguridad
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Aquí puedes manejar la lógica para guardar el usuario en tu base de datos
    // o simplemente devolver el perfil.
    return done(null, profile);
  }
));

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Exportar Passport configurado
module.exports = passport;