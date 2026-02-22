require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'rani@gmail.com' });
        if (user) {
            console.log('User found:', { email: user.email, name: user.name, role: user.role });
        } else {
            console.log('User "rani@gmail.com" not found in database.');
        }
        mongoose.disconnect();
    } catch (err) {
        console.error('Check error:', err);
    }
};

checkUser();
