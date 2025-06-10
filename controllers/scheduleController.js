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
            attributes: ['id', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'createdAt', 'updatedAt']
        });
        res.status(200).json(schedules);
    } catch (error) {
        console.error("Error al obtener horarios:", error);
        res.status(500).json({ message: "Error al obtener horarios", error });
    }
}

exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { docente_id, curso_id, grado_id, fecha, hora_inicio, hora_fin } = req.body;

    try {
        const schedule = await Schedule.findByPk(id);
        if(!schedule) {
            return res.status(404).json({message: "Horario no encontrado"});
        }

        schedule.docente_id = docente_id;
        schedule.curso_id = curso_id;
        schedule.grado_id = grado_id;
        schedule.fecha = fecha;
        schedule.hora_inicio = hora_inicio;
        schedule.hora_fin = hora_fin;
        await schedule.save();

        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar horario", error });
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

exports.getTeacherDays = async (req, res) => {
    const docenteId = req.params.id;

    try {
        const dias = await Schedule.findAll({
            where: {
                docente_id: docenteId,
                estado: 1
            },
            attributes: ['fecha'],
            group: ['fecha']
        })

        const diasUnicos = dias.map(d => d.fecha);
        res.json({ dias: diasUnicos });
    } catch (error) {
        console.error('Error al obtener días del docente:', error);
        res.status(500).json({ error: 'Error al obtener días del docente' });
    }
}

exports.getDailySchedules = async (req, res) => {
    const docenteId = req.params.id;
    const dia = req.query.dia;

    try {
        const horarios = await Schedule.findAll({
            where: {
                docente_id: docenteId,
                fecha: dia,
                estado: 1
            },
            attributes: ['id', 'hora_inicio', 'hora_fin'],
            include: [
                {
                    model: Course,
                    as: 'curso',
                    attributes: ['nombre'],
                },
                {
                    model: Grade,
                    as: 'grado',
                    attributes: ['id','nombre']
                }
            ],
            order: [['hora_inicio', 'ASC']]
        });

        const resultado = horarios.map(h => ({
            id: h.id,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            curso: h.curso.nombre,
            grado: h.grado.nombre,
            grado_id: h.grado.id
        }));

        res.json({ horarios: resultado });
    } catch (error) {
        console.error('Error al obtener horarios del día:', error);
        res.status(500).json({ error: 'Error al obtener horarios del día' });
    }
}