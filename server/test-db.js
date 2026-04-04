const mysql = require('mysql2/promise');

async function testConnection() {
    const configs = [
        { host: 'localhost', user: 'root', password: '', port: 3307 },
        { host: '127.0.0.1', user: 'root', password: '', port: 3307 },
        { host: 'localhost', user: 'root', password: 'root', port: 3307 },
        { host: '127.0.0.1', user: 'root', password: 'root', port: 3307 },
        { host: 'localhost', user: 'root', password: 'password', port: 3307 },
    ];

    for (const config of configs) {
        console.log(`Testing: ${config.host}:${config.port} / ${config.user} / password: ${config.password ? 'YES ("'+config.password+'")' : 'NO'}`);
        try {
            const connection = await mysql.createConnection(config);
            console.log('--- SUCCESS! ---');
            console.log(`Working Config: host: ${config.host}, port: ${config.port}, user: ${config.user}, pass: ${config.password}`);
            await connection.end();
            return;
        } catch (err) {
            console.log(`FAILED: ${err.message}`);
        }
    }
    console.log('\nAll default attempts failed. Please check your MySQL settings.');
}

testConnection();
