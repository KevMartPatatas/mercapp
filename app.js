const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./bd/db'); 
//const conecction = require('./')
const usuariosRoute = require('./routes/users')
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoute);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

