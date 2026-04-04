const mysql = require('mysql2/promise');

async function debug() {
    console.log("Starting debug connection to localhost:3307...");
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: ''
        });
        console.log("SUCCESS! Connected to localhost:3307");
        await conn.end();
    } catch (err) {
        console.log("DEBUG ERROR:");
        console.log("Code:", err.code);
        console.log("Message:", err.message);
        console.log("Stack:", err.stack);
    }
}

debug();
