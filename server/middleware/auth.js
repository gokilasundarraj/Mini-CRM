const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) throw new Error();

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        console.error('Auth error:', e.message);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Access denied. Admin only.' });
    }
    next();
};

const employeeOnly = (req, res, next) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send({ error: 'Access denied. Employee only.' });
    }
    next();
};

module.exports = { auth, adminOnly, employeeOnly };
