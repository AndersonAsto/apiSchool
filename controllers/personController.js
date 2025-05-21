const { Op } = require('sequelize');
const Person = require('../models/personModel');
const User = require('../models/userModel');
const Student = require('../models/studentModel');

exports.createPerson = async (req, res) => {
    try {
        const { nombre, apellido, dni, correo, telefono } = req.body;
        const newPerson = await Person.create({ nombre, apellido, dni, correo, telefono });
        res.status(201).json(newPerson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear persona' });
    }
};

exports.getPersons = async (req, res) => {
    try {
        const persons = await Person.findAll();
        res.json(persons);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personas' });
    }
}

exports.getAvailablePersonsForRol = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['persona_id'] });
        const personasConRol = users.map(user => user.persona_id);

        const personasDisponibles = await Person.findAll({
            where: {
                id: {
                    [Op.notIn]: personasConRol,
                }
            },
            attributes: ['id', 'nombre', 'apellido']
        });

        res.status(200).json(personasDisponibles);
    } catch (error) {
        console.error("Error al obtener personas disponibles:", error);
        res.status(500).json({ message: "Error al obtener personas disponibles" });
    }
}

exports.getAvailablePersonsForStudent = async (req, res) => {
    try {
        const students = await Student.findAll({ attributes: ['alumno_id'] });
        const personasEstudiantes = students.map( s => s.alumno_id );

        const personasDisponibles = await Person.findAll({
            where: {
                id: {
                    [Op.notIn]: personasEstudiantes,
                }
            },
            attributes: ['id', 'nombre', 'apellido']
        });

        res.status(200).json(personasDisponibles);
    } catch (error) {
        console.error("Error al obtener personas disponibles para estudiante:", error);
        res.status(500).json({ message: "Error al obtener personas disponibles para estudiante" });
    }
}

exports.updatePerson = async (req, res) => {
    const {id} = req.params;
    const { nombre, apellido, dni, correo, telefono } = req.body;

    try {
        const person = await Person.findByPk(id);
        if(!person) {
            return res.status(404).json({message: "Persona no encontrada"});
        }

        person.nombre = nombre;
        person.apellido = apellido;
        person.dni = dni;
        person.correo = correo;
        person.telefono = telefono;
        await person.save();

        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar persona", error });
    }
}

exports.deletePersonById = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Person.destroy({where: {id}});

        if(deleted) {
            res.status(200).json({ message: 'Persona eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Persona no encontrada' });
        }
        
    } catch (error) {
        console.error('Error al eliminar persona: ', error)
        res.status(500).json({ message: 'Error al eliminar persona', error });
    }
}