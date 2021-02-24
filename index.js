require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crea el servidor express
const app = express();

//Configurar Cors
app.use(cors());

//Base de datos
dbConnection();

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: "true",
        msg: "Hola mundo"
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor ' + process.env.PORT);
});