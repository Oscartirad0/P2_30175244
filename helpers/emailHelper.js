import nodemailer from "nodemailer";
import axios from "axios";

const emailHelper = async (nombre, correo, comentario, ip) => {
  // Obtener el país usando la API de geolocalización
  let pais = "Desconocido";
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    pais = response.data.country;
  } catch (error) {
    console.error("Error obteniendo el país:", error);
  }

  // Crear un transportador
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alejandrotiradochavez@gmail.com",
      pass: "uaga vlqn iuja ihuc",
    },
  });

  let fechaHora = new Date().toLocaleString("es-VE");

  // Configurar opciones de correo
  let mailOptions = {
    from: "alejandrotiradochavez@gmail.com",
    to: "programacion2ais@dispostable.com",
    subject: "Clinica Dental",
    text: `Tu mensaje ha sido enviado correctamente.
    
Nombre: ${nombre}
Correo: ${correo}
Comentario: ${comentario}
Dirección IP: ${ip}
País: ${pais}
Fecha/Hora de la solicitud: ${fechaHora}`
  };

  // Enviar el correo
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
    return info;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};

export default emailHelper;
