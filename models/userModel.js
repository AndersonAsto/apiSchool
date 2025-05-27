const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Person = require('./personModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  persona_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Person,
      key: 'id'
    }
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
});

User.belongsTo(Person, {
  foreignKey: 'persona_id',
  as: 'persona',
});

User.beforeCreate(async (user, options) => {
  if (user.password_hash) {
    user.password_hash = await bcrypt.hash(user.password_hash, SALT_ROUNDS);
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password_hash')) {
    user.password_hash = await bcrypt.hash(user.password_hash, SALT_ROUNDS);
  }
});

module.exports = User;