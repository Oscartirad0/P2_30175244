import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Middleware para verificar si el usuario es administrador
router.use(authMiddleware.isAdmin);

// Ruta de registro (solo para administradores)
router.get('/register', (req, res) => {
  res.render('register');
});

export default router;