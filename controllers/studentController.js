const Person = require('../models/personModel');
const Grade = require('../models/gradeModel')
const Student = require('../models/studentModel');

exports.createStudent = async (req, res) => {
    try {
        const {alumno_id, grado_id} = req.body;
        const newStudent = await Student.create({alumno_id, grado_id});
        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear estudiante' });
    }
}

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
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
                },
            ],
            attributes: ['id', 'estado', 'createdAt', 'updatedAt']
        });

        res.status(200).json(students);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        res.status(500).json({ message: "Error al obtener estudiantes", error });
    }
}

exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { alumno_id, grado_id } = req.body;

    try {
        const student = await Student.findByPk(id);
        if(!student) {
            return res.status(404).json({message: "Estudiante no encontrado"});
        }

        student.alumno_id = alumno_id;
        student.grado_id = grado_id;
        await student.save();

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estudiante", error });
    }
}

exports.deleteStudentById = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Student.destroy({where: {id}});

        if(deleted) {
            res.status(200).json({ message: 'Estudiante eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar estudiante: ', error)
        res.status(500).json({ message: 'Error al eliminar estudiante', error });
    }
}

exports.getStudentsByGrade = async (req, res) => {
    const { gradeId } = req.params;
    try {
        const students = await Student.findAll({
            where: { grado_id: gradeId, estado: true},
            include: [
                {
                    model: Person,
                    as: 'alumno',
                    attributes: ['id', 'nombre', 'apellido']
                }
            ],
            attributes: ['id', 'estado']
        });
        if(students.length === 0) {
            return res.status(200).json([]);
        }
        const formatted = students.map((student) =>({
            id: student.id,
            alumno_id: student.alumno.id,
            nombre: student.alumno.nombre,
            apellido: student.alumno.apellido
        }));
        res.status(200).json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener alumnos por grado' });
    }
}