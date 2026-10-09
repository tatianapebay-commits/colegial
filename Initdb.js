// Crea la base (si no existe) y ejecuta DDL + DML.  Uso: npm run db:init
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const cfg = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};
const dbName = process.env.DB_NAME || 'instituto';

(async () => {
  const admin = new Client({ ...cfg, database: 'postgres' });
  await admin.connect();
  const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (!rowCount) {
    await admin.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos "${dbName}" creada`);
  } else {
    console.log(`La base de datos "${dbName}" ya existe`);
  }
  await admin.end();

  const client = new Client({ ...cfg, database: dbName });
  await client.connect();
  for (const file of ['01_ddl.sql', '02_dml.sql']) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'database', file), 'utf8');
    await client.query(sql);
    console.log(`Ejecutado: ${file}`);
  }
  await client.end();
  console.log('Base de datos lista.');
})().catch((err) => {
  console.error('Error inicializando la base:', err.message);
  process.exit(1);
});