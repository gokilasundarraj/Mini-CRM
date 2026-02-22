const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Lead = require('../models/Lead');
const { auth, adminOnly } = require('../middleware/auth');

// Create Company (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).send(company);
    } catch (e) {
        res.status(400).send({ error: e.message || 'Error creating company' });
    }
});

// List Companies
router.get('/', auth, async (req, res) => {
    try {
        const companies = await Company.find({});
        res.send(companies);
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error fetching companies' });
    }
});

// Get Company Detail with Leads
router.get('/:id', auth, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).send();

        const leads = await Lead.find({ company: company._id, isDeleted: false });
        res.send({ company, leads });
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error fetching company detail' });
    }
});

// Delete Company (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).send({ error: 'Company not found' });
        res.send(company);
    } catch (e) {
        res.status(500).send({ error: e.message || 'Error deleting company' });
    }
});

module.exports = router;
