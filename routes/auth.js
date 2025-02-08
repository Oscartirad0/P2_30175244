import express from 'express';
import passport from 'passport';
const router = express.Router();

// Ruta de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta de logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
});

// Autenticación con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

export default router;