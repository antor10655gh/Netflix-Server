const express = require('express');
const app = express.Router();

const paymentDetailsController = require('../../controllers/paymentDetails.controller');

app.get('/', paymentDetailsController.allPaymentDetails);
app.post('/', paymentDetailsController.addPayementDetails);

module.exports = app