const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Person = require('./personModel');
const Grade = require('./gradeModel');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    alumno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Person,
            key: 'id',
        }
    },
    grado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Grade,
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'alumnos',
    timestamps: true
});

Student.belongsTo(Person, {
    foreignKey: 'alumno_id',
    as: 'alumno'
});

Student.belongsTo(Grade, {
    foreignKey: 'grado_id',
    as: 'grado'
});

module.exports = Student;