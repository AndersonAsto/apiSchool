const Qualification = require('../models/qualificationModel');
const Student = require('../models/studentModel');
const Schedule = require('../models/scheduleModel');
const Person = require('../models/personModel');
const Grade = require('../models/gradeModel');
const Course = require('../models/courseModel');
const { Op } = require('sequelize');

exports.createQualification = async (req, res) => {
    try {
        const { alumno_id, horario_id, nota, detalle, fecha, hora } = req.body;
        if (!alumno_id || !horario_id || !nota || !fecha || !hora) {
            return res.status(400).json({ message: 'Faltan datos obligatorios.' });
        }
        const newQualification = await Qualification.create({
            alumno_id,
            horario_id,
            nota,
            detalle,
            fecha,
            hora
        });
        res.status(201).json(newQualification);
    } catch (error) {
        console.error('Error al crear calificación:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.getQualifications = async (req, res) => {
    try {
        const calificaciones = await Qualification.findAll({
            include: [
                {
                    model: Student,
                    as: 'estudiante',
                    attributes: ['id'],
                    include: [
                        {
                            model: Person,
                            as: 'alumno',
                            attributes: ['id', 'nombre', 'apellido']
                        },
                        {
                            model: Grade,
                            as: 'grado',
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Schedule,
                    as: 'horario',
                    attributes: ['id', 'fecha', 'hora_inicio', 'hora_fin'],
                    include: [
                        {
                            model: Grade,
                            as: 'grado',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Course,
                            as: 'curso',
                            attributes: ['id', 'nombre']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(calificaciones);
    } catch (error) {
        console.error('Error al obtener calificaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.deleteQualificationById = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Qualification.destroy({where: {id}});

        if(deleted) {
            res.status(200).json({ message: 'Califcación eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Califcación no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar Califcación: ', error)
        res.status(500).json({ message: 'Error al eliminar la Califcación', error });
    }
}

exports.updateQualificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nota, detalle, fecha, hora } = req.body;

        const qualification = await Qualification.findByPk(id);
        if (!qualification) {
            return res.status(404).json({ message: 'Calificación no encontrada.' });
        }

        qualification.nota = nota;
        qualification.detalle = detalle;
        qualification.fecha = fecha;
        qualification.hora = hora;

        await qualification.save();
        res.status(200).json({ message: 'Calificación actualizada correctamente.', qualification });
    } catch (error) {
        console.error('Error al actualizar calificación:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.getFilteredQualifications = async (req, res) => {
    try {
        const { docente_id, fecha_horario, horario_id } = req.query; // Obtener parámetros de consulta

        let whereCondition = {}; // Condición para la tabla calificaciones
        let scheduleWhereCondition = {}; // Condición para la tabla horarios (anidada)

        // Si se proporciona un horario_id, filtrar directamente las calificaciones
        if (horario_id) {
            whereCondition.horario_id = horario_id;
        }

        // Si se proporciona docente_id o fecha_horario, filtrar la tabla de horarios
        if (docente_id) {
            scheduleWhereCondition.docente_id = docente_id;
        }
        if (fecha_horario) {
            scheduleWhereCondition.fecha = fecha_horario;
        }

        const calificaciones = await Qualification.findAll({
            where: whereCondition,
            include: [
                {
                    model: Student,
                    as: 'estudiante',
                    attributes: ['id'],
                    include: [
                        {
                            model: Person,
                            as: 'alumno',
                            attributes: ['id', 'nombre', 'apellido']
                        },
                        {
                            model: Grade,
                            as: 'grado',
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Schedule,
                    as: 'horario',
                    attributes: ['id', 'fecha', 'hora_inicio', 'hora_fin', 'grado_id', 'docente_id'],
                    where: scheduleWhereCondition, // Aplicar el filtro aquí
                    required: true, // Esto asegura que solo se traigan calificaciones que tengan un horario que coincida con el filtro
                    include: [
                        {
                            model: Grade,
                            as: 'grado',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Course,
                            as: 'curso',
                            attributes: ['id', 'nombre']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(calificaciones);
    } catch (error) {
        console.error('Error al obtener calificaciones filtradas:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};