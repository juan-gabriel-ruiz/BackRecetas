//  import express from 'express';
//  import cors from 'cors';
//  import { GoogleGenerativeAI } from '@google/generative-ai';
//  import dotenv from 'dotenv';

//  dotenv.config();

// const app = express();
//  const port = process.env.PORT || 3000;

//  // Configuración de CORS para permitir solicitudes desde cualquier origen
//  const corsOptions = {   origin: '*',  // Permitir todos los orígenes
//    methods: ['GET', 'POST'],
//  };

//  app.use(cors(corsOptions));
//  app.use(express.json());

//  // Inicializar Gemini
//  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//  app.post('/generar-receta', async (req, res) => {
//    const { nombrePlato } = req.body;

//    try {
//      const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

//      const prompt = `Genera dos recetas completas para un plato que utilice exclusivamente los siguientes ingredientes: "${nombrePlato}". No agregues ningún ingrediente adicional. Para cada receta, incluye:


// - RECETA 1 Y 2 EN MAYÚSCULAS Y EN NEGRITA
// - Lista de ingredientes 
// - Preparación paso a paso numerada
// - Tiempo estimado de cocción
// - Un consejo útil

//  Si el texto ingresado no contiene ingredientes válidos, responde únicamente: "Por favor ingrese ingredientes válidos".`;

//     const result = await model.generateContent(prompt);
//      const response = await result.response;
//      const receta = await response.text();

//      res.json({ receta });
//    } catch (error) {
//     console.error('Error al generar la receta:', error);
//      res.status(500).json({ error: 'No se pudo generar la receta.' });
//    }
   
//  });

//  app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// // Iniciar servidor
// app.listen(port, () => {
//   console.log(`Servidor corriendo en el puerto ${port}`);
// });

 import express from 'express'; 
 import cors from 'cors';
 import { GoogleGenerativeAI } from '@google/generative-ai';
 import dotenv from 'dotenv';

 dotenv.config();

 const app = express();
 const port = process.env.PORT || 3000;

 // Configuración de CORS para permitir solo el dominio de tu frontend
 const corsOptions = {
  origin: (origin, callback) => {
     // Solo permitir el dominio específico de tu frontend en S3
     if (origin === 'http://recetasfront.s3-website-us-east-1.amazonaws.com' || origin === undefined) {
       callback(null, true);  // Permitir este origen o solicitudes internas (como las de los servicios)
     } else {
       callback(new Error('No autorizado'), false);  // Rechazar otros orígenes
     }
   },
   methods: ['GET', 'POST'],  // Permitir solo los métodos GET y POST
 };

 app.use(cors(corsOptions));
 app.use(express.json());

// Inicializar Gemini
 const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

 // Ruta para generar receta
 app.post('/generar-receta', async (req, res) => {
    const { nombrePlato } = req.body;

    try {
      // Generar el modelo con Gemini
      const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

      // Definir el prompt
      const prompt = `Genera dos recetas completas para un plato que utilice exclusivamente los siguientes ingredientes: "${nombrePlato}". No agregues ningún ingrediente adicional. Para cada receta, incluye:


 - RECETA 1 Y 2 EN MAYÚSCULAS Y EN NEGRITA
 - Lista de ingredientes 
 - Preparación paso a paso numerada
 - Tiempo estimado de cocción
 - Un consejo útil

  Si el texto ingresado no contiene ingredientes válidos, responde únicamente: "Por favor ingrese ingredientes válidos".`;

      // Generar la receta
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const receta = await response.text();

      // Enviar la receta generada como respuesta
      res.json({ receta });
    } catch (error) {
      console.error('Error al generar la receta:', error);
      res.status(500).json({ error: 'No se pudo generar la receta.' });
    }
 });

 // Iniciar servidor
    app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
 });