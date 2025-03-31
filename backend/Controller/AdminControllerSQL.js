const Admin = require('../Model/AdminModelSQL');
const express = require('express');

const getCredentials = async (req, res) => {
    try {
        // Find admin or create default admin if none exists
        const [admin, created] = await Admin.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                username: 'admin',
                password: '123'
            }
        });

        res.status(200).json({ 
            username: admin.username, 
            password: admin.password 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCredentials }; 