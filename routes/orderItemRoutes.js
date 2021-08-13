const express = require("express");
const router = express.Router();
const db = require("../models")

// All Order Data
router.get('/all', (req, res) => {
    db.OrderItem.findAll().then(orderItem => res.send(orderItem))
})


// Get Single Order
router.get("/find/:id", (req, res) => {
    db.OrderItem.findAll({
        where: {
            Orders_id: req.params.id
        },
        include: [db.Product]
    }).then(oneorder => res.send(oneorder))
})

// Insert OrderItem
router.post('/new', (req, res) => {
    db.OrderItem.create({
        Quantity: req.body.Quantity,
        Orders_id: req.body.Orders_id,
        Product_id: req.body.Product_id,
        ProdcutName: req.body.ProdcutName,
        Color: req.body.Color,
        Category: req.body.Category,
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        Size: req.body.Size,
        Image: req.body.Image,
        Status: req.body.Status
    }).then(submittedOrderItem => res.send(submittedOrderItem))
    .catch(err => console.log(err))
})

// Update Status
router.put('/status', (req, res) => {
    db.OrderItem.update({
        Status: req.body.Status,
        Delivery_date: req.body.Delivery_date
    },
    {
        where: {
            OrderItem_id: req.body.OrderItem_id
        }
    }).then(() => res.send("successfully Updated"))
})

module.exports = router