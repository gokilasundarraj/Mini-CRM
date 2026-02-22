const axios = require('axios');

const testCreateUser = async () => {
    try {

        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@crm.com',
            password: 'adminpassword123',
            role: 'admin'
        });
        const token = loginRes.data.token;

        const res = await axios.post('http://localhost:5000/api/users', {
            name: 'Rani',
            email: 'rani@gmail.com',
            password: 'password123',
            role: 'employee'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.log('Error Status:', err.response?.status);
        console.log('Error Data:', err.response?.data);
    }
};

testCreateUser();
