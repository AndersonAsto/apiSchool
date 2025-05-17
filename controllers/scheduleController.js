const User = require('../models/userModel');
const Person = require('../models/personModel');
const Grade = require('../models/gradeModel');
const Course = require('../models/courseModel');
const Schedule = require('../models/scheduleModel');

exports.createSchedule = async (req, res) => {
    try {
        const { docente_id, curso_id, grado_id, fecha, hora_inicio, hora_fin } = req.body;
        const newSchedule = await Schedule.create({ docente_id, curso_id, grado_id, fecha, hora_inicio, hora_fin });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear horario' });
    }
}

exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [
                {
                    model: User,
                    as: 'docente',
                    attributes: ['id', 'username', 'rol'],
                    include: [
                        {
                            model: Person,
                            as: 'persona',
                            attributes: ['id', 'nombre', 'apellido']
                        },
                    ]
                },
                {
                    model: Course,
                    as: 'curso',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Grade,
                    as: 'grado',
                    attributes: ['id', 'nombre']
                }
            ],
            attributes: ['id', 'fecha', 'hora_inicio', 'hora_fin', 'estado']
        });
        res.status(200).json(schedules);
    } catch (error) {
        console.error("Error al obtener horarios:", error);
        res.status(500).json({ message: "Error al obtener horarios", error });
    }
}

exports.deleteStudentById = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Schedule.destroy({where: {id}});

        if(deleted) {
            res.status(200).json({ message: 'Horario eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Horario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar horario: ', error)
        res.status(500).json({ message: 'Error al eliminar el horario', error });
    }
}