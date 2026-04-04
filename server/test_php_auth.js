const axios = require('axios');

async function testAuth() {
    const baseURL = 'http://localhost:8000/';
    console.log('Testing Registration on ' + baseURL);
    
    try {
        const regRes = await axios.post(baseURL + 'auth/register', {
            full_name: 'Test Farmer',
            phone: '123456789',
            password: 'testpassword',
            role: 'FARMER'
        });
        console.log('Registration Success:', regRes.data);
    } catch (err) {
        console.log('Registration Failed:', err.response?.status, err.response?.data || err.message);
    }

    console.log('\nTesting Login...');
    try {
        const logRes = await axios.post(baseURL + 'auth/login', {
            phone: '123456789',
            password: 'testpassword'
        });
        console.log('Login Success:', logRes.data);
    } catch (err) {
        console.log('Login Failed:', err.response?.status, err.response?.data || err.message);
    }
}

testAuth();
