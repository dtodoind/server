const express = require("express");
const router = express.Router();
const db = require("../models")

// All Delivery Data
router.get('/all', (req, res) => {
    db.Delivery.findAll().then(delivery => res.send(delivery))
})

// Insert Delivery
router.post('/new', (req, res) => {
    db.Delivery.create({
        Region: req.body.Zip,
        Charges: req.body.Charges
    }).then(submittedDelivery => res.send(submittedDelivery))
})

// Delete Delivery
router.delete('/delete/:id', (req, res) => {
    db.Delivery.destroy({
        where: {
            Delivery_id: req.params.id
        }
    }).then(() => res.send("success"))
})

module.exports = router