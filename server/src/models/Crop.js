const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Crop = sequelize.define('Crop', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity_available_kg: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    price_per_kg_fcfa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    region_location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true
});

Crop.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
User.hasMany(Crop, { foreignKey: 'farmer_id' });

module.exports = Crop;
