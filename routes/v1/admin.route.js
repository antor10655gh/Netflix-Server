const express = require('express');
const app = express.Router();

const adminController = require('../../controllers/admin.controller');

app.get('/', adminController.getAdmin);
app.post('/register', adminController.createAdmin);
app.post('/login', adminController.adminLogin);
app.put('/:adminId', adminController.updatedAdmin);

module.exports = app;
