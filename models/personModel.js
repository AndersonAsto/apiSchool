const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConfig');

const Person = sequelize.define ('Person', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    tableName: 'persona',
    timestamps: true
});

module.exports = Person;