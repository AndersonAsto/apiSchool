const Grade = require('../models/gradeModel');

exports.createGrade = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newGrade = await Grade.create({ nombre });
    res.status(201).json(newGrade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear grado' });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener grados' });
  }
};

exports.deleteGradeById = async (req, res) => {
  try {
    const {id} = req.params;
    const deleted = await Grade.destroy({where: {id}});

    if (deleted) {
      res.status(200).json({ message: 'Grado eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Grado no encontrado' });
    }

  } catch (error) {
    console.error('Error al eliminar grado: ', error)
    res.status(500).json({ message: 'Error al eliminar grado', error });
  }
}

exports.updateGrade =  async (req, res) => {
  const {id} = req.params;
  const {nombre} = req.body;

  try {
    const grado = await Grade.findByPk(id);
    if (!grado) {
      return res.status(404).json({message: "Grado no encontrado"});
    }

    grado.nombre = nombre;
    await grado.save();

    res.status(200).json(grado);

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar grado", error })
  }
}