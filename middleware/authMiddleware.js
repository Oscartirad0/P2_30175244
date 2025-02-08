export default {
    // Verificar si el usuario está autenticado
    isAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/auth/login');
    },
  
    // Verificar si el usuario es administrador
    isAdmin: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
      }
      res.status(403).send('Acceso denegado: solo para administradores');
    }
  };