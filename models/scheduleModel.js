const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Grade = require('./gradeModel');
const Course = require('./courseModel');
const User = require('./userModel');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    docente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    curso_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
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
    fecha: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'horarios',
    timestamps: true
});

Schedule.belongsTo(User, {
    foreignKey: 'docente_id',
    as: 'docente'
});

Schedule.belongsTo(Grade, {
    foreignKey: 'grado_id',
    as: 'grado'
});

Schedule.belongsTo(Course, {
    foreignKey: 'curso_id',
    as: 'curso'
});

module.exports = Schedule;