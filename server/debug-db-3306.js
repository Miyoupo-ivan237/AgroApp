const mysql = require('mysql2/promise');

async function debug() {
    console.log("Starting debug connection to localhost:3306...");
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: ''
        });
        console.log("SUCCESS! Connected to localhost:3306");
        await conn.end();
    } catch (err) {
        console.log("DEBUG ERROR:");
        console.log("Code:", err.code);
        console.log("Message:", err.message);
    }
}

debug();
