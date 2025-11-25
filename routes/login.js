const express = require('express');
const router = express.Router();
const connection = require('../bd/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mercapp_secreto_super_seguro_2025';

router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, rol } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    const sql = 'INSERT INTO usuarios(nombre_completo, correo, contrasena, telefono, rol) VALUES(?,?,?,?,?)';
    
    connection.query(sql, [nombre, correo, hashContrasena, telefono, rol || 'cliente'], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'El correo ya está registrado' });
        }
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Usuario registrado correctamente',
        id: result.insertId 
      });
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
  }
});

router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;
  
    const sql = 'SELECT * FROM usuarios WHERE correo = ?';
    
    connection.query(sql, [correo], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Error del servidor' });
      
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      }
  
      const usuario = results[0];
  
      const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
      
      if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      }
  
      const token = jwt.sign(
        { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.nombre_completo },
        SECRET_KEY,
        { expiresIn: '8h' }
      );
  
      res.json({
        success: true,
        message: 'Login exitoso',
        token: token,
        usuario: {
            id: usuario.id_usuario,
            nombre: usuario.nombre_completo,
            rol: usuario.rol
        }
      });
    });
});

router.get('/perfil', (req, res) => {
    res.json({ message: "Ruta de perfil (requiere validación de token)" });
});

module.exports = router;
