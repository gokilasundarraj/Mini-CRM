require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const debugUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({});
        console.log('Users found:', users.map(u => ({ email: u.email, role: u.role, name: u.name })));

        if (users.length > 0) {
            const admin = await User.findOne({ email: 'admin@crm.com' });
            const isMatch = await admin.comparePassword('adminpassword123');
            console.log('Password match test:', isMatch);
        } mongoose.disconnect();
    } catch (err) {
        console.error('Debug error:', err);
    }
};

debugUsers();
