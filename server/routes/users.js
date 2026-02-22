const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// Create employee account (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send({ error: e.message || 'Error creating user' });
    }
});

// List all employees (Admin only)
router.get('/', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: 'employee' }).select('-password');
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Delete Employee Account (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        console.log(`[DELETE] Attempting to delete user ID: ${req.params.id}`);

        // Find user first to see what's actually there
        const user = await User.findById(req.params.id);
        if (!user) {
            console.log(`[DELETE] User not found: ${req.params.id}`);
            return res.status(404).send({ error: 'User not found' });
        }

        // Check role (case-insensitive)
        if (user.role.toLowerCase() !== 'employee') {
            console.log(`[DELETE] User is not an employee (Role: ${user.role}): ${user.email}`);
            return res.status(403).send({ error: 'Only employee accounts can be deleted here.' });
        }

        await User.findByIdAndDelete(req.params.id);
        console.log(`[DELETE] Successfully deleted user: ${user.email}`);
        res.send(user);
    } catch (e) {
        console.error('[DELETE] Error:', e);
        res.status(500).send({ error: e.message || 'Error deleting employee' });
    }
});

module.exports = router;
