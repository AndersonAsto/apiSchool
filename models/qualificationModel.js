const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Student = require('./studentModel');
const Schedule = require('./scheduleModel');

const Qualification = sequelize.define('Qualification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
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
        allowNull:false,
        references: {
            model: Schedule,
            key: 'id'
        }
    },
    nota: {
        type: DataTypes.DECIMAL(),
        allowNull: false
    },
    detalle: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName: 'calificaciones',
    timestamps: true
});

Qualification.belongsTo(Student, {
    foreignKey: 'alumno_id',
    as: 'estudiante'
});

Qualification.belongsTo(Schedule, {
    foreignKey: 'horario_id',
    as: 'horario'
});

module.exports = Qualification;