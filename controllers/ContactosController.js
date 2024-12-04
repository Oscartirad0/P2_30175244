import ContactosModel from '../models/ContactosModel.js';

class ContactosController {
  static async add(req, res) {
    const { email, nombre, mensaje } = req.body;
    console.log('Datos Recibidos:' , { email, nombre, mensaje });
    console.log('Contenido de req.body:', req.body);
    const ip = req.ip;
    const fecha = new Date();

    if (!email || !nombre || !mensaje) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }

    try {
      await ContactosModel.saveContact({ email, nombre, mensaje, ip, fecha });
      res.send('Tu mensaje ha sido enviado correctamente.');
    } catch (error) {
      console.log('Error al guardar los datos:', error);
      res.status(500).send('Error al guardar los datos.');
    }
  }
}

export default ContactosController;
