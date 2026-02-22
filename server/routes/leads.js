const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { auth, adminOnly } = require('../middleware/auth');

// Create Lead (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).send(lead);
    } catch (e) {
        res.status(400).send({ error: e.message || 'Error creating lead' });
    }
});

// List Leads (Search, Filter, Pagination)
router.get('/', auth, async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const query = { isDeleted: false };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (status) {
            query.status = status;
        }

        // Employee can only see assigned leads? 
        // "Employee can: ... View assigned leads"
        if (req.user.role === 'employee') {
            query.assignedTo = req.user._id;
        }

        const leads = await Lead.find(query)
            .populate('assignedTo', 'name email')
            .populate('company', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Lead.countDocuments(query);

        res.send({
            leads,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error fetching leads' });
    }
});

// Update Lead (Admin only)
router.patch('/:id', auth, adminOnly, async (req, res) => {
    try {
        const lead = await Lead.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        if (!lead) return res.status(404).send();
        res.send(lead);
    } catch (e) {
        res.status(400).send({ error: e.message || 'Error updating lead' });
    }
});

// Soft Delete Lead (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const lead = await Lead.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        if (!lead) return res.status(404).send();
        res.send(lead);
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error deleting lead' });
    }
});

module.exports = router;
