require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ email: 'admin@crm.com' });
        if (!adminExists) {
            const admin = new User({
                name: 'Super Admin',
                email: 'admin@gmail.com',
                password: 'admin123',
                role: 'admin'
            });
            try {
                await admin.save();
                console.log('Admin user created: admin@crm.com / adminpassword123');
            } catch (saveErr) {
                console.error('Error saving admin:', JSON.stringify(saveErr, null, 2));
                console.error('Error message:', saveErr.message);
            }
        } else {
            console.log('Admin user already exists');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('Seed error:', err);
    }
};

seed();
