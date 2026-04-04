const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Crop = require('./Crop');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    total_crop_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_transport_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'IN_TRANSIT', 'DELIVERED'),
        defaultValue: 'PENDING'
    }
}, {
    timestamps: true
});

Order.belongsTo(User, { as: 'buyer', foreignKey: 'buyer_id' });
Order.belongsTo(Crop, { foreignKey: 'crop_id' });

module.exports = Order;
