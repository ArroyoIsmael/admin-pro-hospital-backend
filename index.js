require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crea el servidor express
const app = express();

//Configurar Cors
app.use(cors());

//Lectura y Parseo del Body

app.use(express.json());

//Base de datos
dbConnection();

//Rutas

app.use('/api/usuarios/', require('./routes/usuarios-routes'));
app.use('/api/login/', require('./routes/auth-routes'));


app.listen(process.env.PORT, () => {
    console.log('Servidor ' + process.env.PORT);
});