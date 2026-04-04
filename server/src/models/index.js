const { sequelize } = require('../config/db');
const User = require('./User');
const Crop = require('./Crop');
const Order = require('./Order');

const syncDB = async () => {
    try {
        await sequelize.sync({ force: false }); // Set force:true only if you want to drop tables
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

module.exports = { syncDB, User, Crop, Order };
