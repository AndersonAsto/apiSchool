const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Student = require('./studentModel');
const Schedule = require('./scheduleModel');

const Assistance = sequelize.define('Assistance', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    alumno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Student,
            key: 'id'
        }
    },
    horario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Schedule,
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.ENUM('P', 'A', 'T'),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'asistencia',
    timestamps: true
})

Assistance.belongsTo(Student, {
    foreignKey: 'alumno_id',
    as: 'estudiante'
});

Assistance.belongsTo(Schedule, {
    foreignKey: 'horario_id',
    as: 'horario'
});

module.exports = Assistance;