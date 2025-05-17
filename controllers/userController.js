const Person = require('../models/personModel');
const User = require('../models/userModel');

exports.createUser = async (req, res) => {
    try {
        const {persona_id, username, password_hash, rol} = req.body;
        const newUser = await User.create({persona_id, username, password_hash, rol});
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
              model: Person,
              as: 'persona',
              attributes: ['id', 'nombre', 'apellido']
            },
            attributes: ['id', 'username', 'rol', 'estado']
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};

exports.getOnlyTeachers = async (req, res) => {
    try {
        const teachers = await User.findAll({
            where: {rol: 'docente'},
            include: {
                model:Person,
                as: 'persona',
                attributes: ['nombre', 'apellido']
            },
            attributes: ['id', 'rol']
        });

        const result = teachers.map(docente => ({
            id: docente.id,
            rol: docente.rol,
            nombre: docente.persona.nombre,
            apellido: docente.persona.apellido
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener docentes:', error);
        res.status(500).json({ message: 'Error al obtener docentes' });
    }
}

exports.deleteStudentById = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await User.destroy({where: {id}});

        if(deleted) {
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar usuario: ', error)
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
}