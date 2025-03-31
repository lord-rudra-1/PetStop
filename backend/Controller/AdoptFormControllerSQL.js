const AdoptForm = require('../Model/AdoptFormModelSQL');
const express = require('express');

const saveForm = async (req, res) => {
    try {
        const { email, livingSituation, phoneNo, previousExperience, familyComposition, petId } = req.body;
        const form = await AdoptForm.create({ 
            email, 
            livingSituation, 
            phoneNo, 
            previousExperience, 
            familyComposition, 
            petId 
        });

        res.status(200).json(form);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getAdoptForms = async (req, res) => {
    try {
        const forms = await AdoptForm.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(forms);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteForm = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await AdoptForm.findByPk(id);
        
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        
        await form.destroy();
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteAllRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdoptForm.destroy({ 
            where: { petId: id } 
        });
        
        if (result === 0) {
            console.log("Forms not found");
            return res.status(404).json({ error: 'Forms not found' });
        }
        
        res.status(200).json({ message: 'Forms deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests
}; 