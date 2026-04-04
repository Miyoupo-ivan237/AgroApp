const mysql = require('mysql2/promise');

async function checkTable() {
    const config = { host: 'localhost', user: 'root', password: '', port: 3307, database: 'agroconnect_db' };
    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to agroconnect_db');
        
        try {
            const [rows] = await connection.execute('DESCRIBE Users');
            console.log('Users Table Structure:');
            console.table(rows);
            
            const [users] = await connection.execute('SELECT id, full_name, phone, role FROM Users');
            console.log('Users in DB:');
            console.table(users);
        } catch (e) {
            console.log('Users table does not exist or error: ' + e.message);
        }
        
        await connection.end();
    } catch (err) {
        console.log('Connection failed: ' + err.message);
    }
}

checkTable();
