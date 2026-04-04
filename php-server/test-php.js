const http = require('http');

const data = JSON.stringify({
    full_name: 'PHP Test User',
    phone: '444555666',
    password: 'password123',
    role: 'BUYER'
});

const options = {
    hostname: '127.0.0.1',
    port: 8000, // Port for PHP server
    path: '/auth/register', // No /api as index.php handles it
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', responseBody);
    });
});
req.on('error', (e) => console.log('Error:', e.message));
req.write(data);
req.end();
