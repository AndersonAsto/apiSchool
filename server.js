require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/dbConfig');
const gradeRoutes = require('./routers/gradeRoute');
const courseRoutes = require('./routers/courseRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', gradeRoutes);
app.use('/api', courseRoutes);

// sincronizar base de datos y servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('DB conectada y sincronizada');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});
