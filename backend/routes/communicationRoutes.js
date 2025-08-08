const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

// Communication Options
router.get('/communication-options', communicationController.getCommunicationOptions);

// CRUD
router.post('/', communicationController.createCommunication);
router.get('/client/:clientId', communicationController.getCommunicationsByClient);
router.get('/:id', communicationController.getCommunication);
router.put('/:id', communicationController.updateCommunication);
router.delete('/:id', communicationController.deleteCommunication);

module.exports = router; 