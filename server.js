require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

pool
  .query('SELECT 1')
  .then(() => {
    console.log('Conexión a PostgreSQL OK');
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('No se pudo conectar a PostgreSQL:', err.message);
    process.exit(1);
  });