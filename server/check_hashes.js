const mysql = require('mysql2/promise');

async function checkUserHash() {
    const config = { host: 'localhost', user: 'root', password: '', port: 3307, database: 'agroconnect_db' };
    try {
        const connection = await mysql.createConnection(config);
        const [users] = await connection.execute('SELECT phone, password_hash, role FROM Users LIMIT 5');
        console.log('Users:');
        console.table(users);
        await connection.end();
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

checkUserHash();
