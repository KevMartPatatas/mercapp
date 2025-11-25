const express = require('express');
const router = express.Router();
const conection = require('../bd/db');

//  (GET todos)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM usuarios';
  conection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    res.json(results);
  });
});

// (POST)
router.post('/', (req, res) => {
  const { nombre, correo, contrasena, telefono, rol } = req.body;
  const sql = 'insert into usuarios(nombre_completo, correo, contrasena, telefono, rol) values(?,?,?,?,?)';
  conection.query(sql, [nombre, correo, contrasena, telefono, rol], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    res.json({ id: result.insertId, nombre, correo, contrasena, telefono, rol });
  });
});

// READ (GET uno)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM usuarios WHERE id_usuario= ?';
  conection.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
    res.json(results[0]);
  });
});

// UPDATE (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena, telefono, rol } = req.body;
  const sql = 'UPDATE usuarios SET nombre_completo = ?, correo= ?, contrasena = ?, telefono= ?, rol= ? WHERE id_usuario = ?';
  conection.query(sql, [nombre, correo, contrasena, telefono, rol,id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
  conection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
    console.log(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  });
});

module.exports = router;
