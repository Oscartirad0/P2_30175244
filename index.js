import express from 'express';
 import bodyParser from 'body-parser';
  import ContactosController from './controllers/ContactosController.js'; 
  import emailHelper from "./helpers/emailHelper.js";
  const app = express(); const port = 3000; 

  // Middleware
app.use(express.json());

// Routes
// Routes
app.post("/formulario", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let info = await emailHelper(to, subject, text);
    res.status(200).send(`Email Enviado: ${info.response}`);
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

  
  app.use(bodyParser.urlencoded({ extended: false })); 
  app.use(bodyParser.json()); 

  app.set('view engine', 'ejs'); 
  app.use(express.static('public')); 
  

  app.post('/formulario', (req, res) => { 
    ContactosController.add(req, res); });
   
    app.get('/', (req, res) => { 
        res.render('index'); });

app.listen(port, () => {
    console.log("corriendo en el puerto 3000");
});

