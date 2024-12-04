import express from 'express';
 import bodyParser from 'body-parser';
  import ContactosController from './controllers/ContactosController.js'; 
  const app = express(); const port = 3000; 
  
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