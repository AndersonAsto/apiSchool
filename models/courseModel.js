const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConfig')

const Course = sequelize.define ('Course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'cursos',
    timestamps: true,
});

module.exports = Course;