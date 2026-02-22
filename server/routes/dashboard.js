const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (req.user.role === 'admin') {
            const totalLeads = await Lead.countDocuments({ isDeleted: false });
            const qualifiedLeads = await Lead.countDocuments({ status: 'Contacted', isDeleted: false });
            const tasksDueToday = await Task.countDocuments({
                dueDate: { $gte: today, $lt: tomorrow },
                status: 'Pending'
            });
            const completedTasks = await Task.countDocuments({ status: 'Completed' });

            res.send({ totalLeads, qualifiedLeads, tasksDueToday, completedTasks });
        } else {
            const myTasksDueToday = await Task.countDocuments({
                assignedTo: req.user._id,
                dueDate: { $gte: today, $lt: tomorrow },
                status: 'Pending'
            });
            const myCompletedTasks = await Task.countDocuments({
                assignedTo: req.user._id,
                status: 'Completed'
            });
            const myPendingTasks = await Task.countDocuments({
                assignedTo: req.user._id,
                status: 'Pending'
            });

            res.send({ myTasksDueToday, myCompletedTasks, myPendingTasks });
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
