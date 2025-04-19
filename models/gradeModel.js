const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Grade = sequelize.define('Grade', {
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
  tableName: 'grados',
  timestamps: true,
});

module.exports = Grade;