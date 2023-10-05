const mongoose = require('mongoose');

const paymentDetailsSchema = new mongoose.Schema({
    holdername: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    cardnumber: String, // Assuming it's a string (you may want to encrypt it)
    expirydate: String, // Assuming it's a string (you may want to store it as a Date)
    cvv: String, // Assuming it's a string (you may want to encrypt it)
});

module.exports = mongoose.model('PaymentDetails', paymentDetailsSchema, 'PaymentDetails');


