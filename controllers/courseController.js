const Course = require('../models/courseModel');

exports.createCourse = async (req, res) => {
    try {
        const {nombre} = req.body;
        const newCourse = await Course.create({nombre});
        res.status(201).json(newCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear curso' });
    }
}

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener grados' });
    }
}

exports.deleteCourseById = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Course.destroy({where: {id}});

        if (deleted) {
            res.status(200).json({ message: 'Curso eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }

    } catch (error) {
        console.error('Error al eliminar curso: ', error)
        res.status(500).json({ message: 'Error al eliminar curso', error });
    }
}

exports.updateCourse = async (req, res) => {
    const {id} = req.params;
    const {nombre} = req.body;

    try {
        const course = await Course.findByPk(id);
        if(!course) {
            return res.status(404).json({message: "Curso no encontrado"});
        }

        course.nombre = nombre;
        await course.save();

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar curso", error })
    }
}