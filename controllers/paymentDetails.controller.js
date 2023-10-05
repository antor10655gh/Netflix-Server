const PaymentDetails = require("../models/PaymentDetails");


module.exports.allPaymentDetails = async (req, res) => {
    try {
        const paymentDetails = await PaymentDetails.find({});

        res.status(200).send(paymentDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}
module.exports.addPayementDetails = async (req, res) => {
    try {
        // Extract payment details from the request body
        const {
            holdername,
            address,
            city,
            state,
            zipcode,
            cardnumber,
            expirydate,
            cvv,
        } = req.body;

        // Create a new payment details document
        const newPaymentDetails = new PaymentDetails({
            holdername,
            address,
            city,
            state,
            zipcode,
            cardnumber, // You may want to validate and encrypt it before saving
            expirydate, // You may want to parse and store it as a Date
            cvv, // You may want to encrypt it before saving
        });

        // Save the new payment details to the database
        const savedPaymentDetails = await newPaymentDetails.save();

        res.status(201).json({
            message: 'success',
            data: savedPaymentDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}