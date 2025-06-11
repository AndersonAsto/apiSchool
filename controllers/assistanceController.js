const Assistance = require('../models/assistanceModel');
const Student = require('../models/studentModel');
const Schedule = require('../models/scheduleModel');
const Person = require('../models/personModel');
const Grade = require('../models/gradeModel');
const Course = require('../models/courseModel');
const { Op } = require('sequelize');

exports.createAssistance = async (req, res) => {
    try {
        const { alumno_id, horario_id, estado, fecha, hora } = req.body;

        if (!alumno_id || !horario_id || !estado || !fecha || !hora) {
            return res.status(400).json({ message: 'Faltan datos obligatorios.' });
        }

        const newAssitance = await Assistance.create({ alumno_id, horario_id, estado, fecha, hora  });

        res.status(201).json(newAssitance);
    } catch (error) {
        console.error('Error al registrar asistencia:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.getFilteredAssistances = async (req, res) => {
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

        const calificaciones = await Assistance.findAll({
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

exports.updateAssistance = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de la asistencia desde los parámetros de la URL
        const { estado, fecha, hora } = req.body; // Campos que pueden ser actualizados

        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de asistencia inválido.' });
        }

        const assistance = await Assistance.findByPk(id);

        if (!assistance) {
            return res.status(404).json({ message: 'Asistencia no encontrada.' });
        }

        // Actualizar solo los campos que se envíen en el body
        const updatedFields = {};
        if (estado !== undefined) updatedFields.estado = estado;
        if (fecha !== undefined) updatedFields.fecha = fecha;
        if (hora !== undefined) updatedFields.hora = hora;
        // No se permite actualizar alumno_id o horario_id directamente en esta ruta
        // ya que cambiarían la "identidad" de la asistencia

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
        }

        await assistance.update(updatedFields);

        // Puedes optar por devolver la asistencia actualizada con sus relaciones si el frontend lo necesita
        const updatedAssistance = await Assistance.findByPk(id, {
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
            ]
        });

        res.status(200).json(updatedAssistance);
    } catch (error) {
        console.error('Error al actualizar asistencia:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

exports.deleteAssistance = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de la asistencia desde los parámetros de la URL

        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de asistencia inválido.' });
        }

        const assistance = await Assistance.findByPk(id);

        if (!assistance) {
            return res.status(404).json({ message: 'Asistencia no encontrada.' });
        }

        await assistance.destroy();

        res.status(200).json({ message: 'Asistencia eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar asistencia:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};
