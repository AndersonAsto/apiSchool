const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { username, password, rol } = req.body;

  if (!username || !password || !rol) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    if (user.rol !== rol) {
      return res.status(403).json({ message: `El usuario no es ${rol}.` });
    }

    if (!user.estado) {
      return res.status(403).json({ message: 'El usuario está inactivo' });
    }

    // Acceso válido
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol,
        persona_id: user.persona_id,
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };
