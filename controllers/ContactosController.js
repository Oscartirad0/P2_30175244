import axios from 'axios';
import ContactosModel from '../models/ContactosModel.js';

class ContactosController {
  static async add(req, res) {
    const { email, nombre, mensaje } = req.body;
    console.log('Datos Recibidos:', { email, nombre, mensaje });
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const fecha = new Date();

    if (!email || !nombre || !mensaje) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }

    try {
      // Llamada a la API de ipstack para obtener la geolocalización
      const apiKey = '56b73a6a7af120a643f2bb37d5234a26'; // Reemplaza con tu API key de ipstack
      const geoResponse = await axios.get(`http://api.ipstack.com/172.70.82.234?access_key=56b73a6a7af120a643f2bb37d5234a26`);
      const geoData = geoResponse.data;

      const { country_name, region_name, city } = geoData;
      console.log(`Ubicación: ${city}, ${region_name}, ${country_name}`);

      // Guardar los datos de contacto junto con la ubicación en la base de datos
      await ContactosModel.saveContact({ email, nombre, mensaje, ip, fecha, country: country_name, region: region_name, city: city });

      res.send('Tu mensaje ha sido enviado correctamente.');
    } catch (error) {
      console.log('Error al guardar los datos:', error);
      res.status(500).send('Error al guardar los datos.');
    }
  }
}

export default ContactosController;

