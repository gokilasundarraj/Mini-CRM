const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send({ error: e.message || 'Error creating task' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const query = {};
        if (req.user.role === 'employee') {
            query.assignedTo = req.user._id;
        }

        const tasks = await Task.find(query)
            .populate('lead', 'name')
            .populate('assignedTo', 'name email');
        res.send(tasks);
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error fetching tasks' });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send();

        if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden. You can only update your assigned tasks.' });
        }

        task.status = req.body.status;
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send({ error: e.message || 'Error updating task status' });
    }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send({ error: 'Task not found' });
        res.send(task);
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error deleting task' });
    }
});

module.exports = router;
