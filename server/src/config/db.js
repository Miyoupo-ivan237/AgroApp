const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3307;
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'agroconnect_db';

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
});

const connectDB = async () => {
    try {
        // 1. Create the database if it doesn't exist
        const connection = await mysql.createConnection({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPass
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();

        // 2. Connect via Sequelize
        await sequelize.authenticate();
        console.log(`MySQL Database connected successfully on port ${dbPort}.`);
        
        // 3. Sync models (creates tables)
        await sequelize.sync({ alter: true });
        console.log('Database tables synchronized.');
    } catch (error) {
        console.error('Database Connection Error:', error.message);
        console.log('\nTIP: Make sure your XAMPP Control Panel is open and MySQL is started (running on port 3307).');
    }
};

module.exports = { sequelize, connectDB };
