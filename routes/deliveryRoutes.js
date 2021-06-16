const express = require("express");
const router = express.Router();
const db = require("../models")

// All Delivery Data
router.get('/all', (req, res) => {
    db.Delivery.findAll().then(delivery => res.send(delivery))
})