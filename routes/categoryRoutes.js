const express = require("express");
const router = express.Router();
const db = require("../models")

// All Product Data
router.get('/all', (req, res) => {
    db.Category.findAll().then(category => res.send(category))
})

// Get Single Product
// router.get("/find/:id", (req, res) => {
//     db.Product.findAll({
//         where: {
//             Product_id: req.params.id
//         }
//     }).then(onepro => res.send(onepro))
// })

// Insert Product
router.post('/new', (req, res) => {
    db.Category.create({
        Name: req.body.Name
    }).then(submittedProduct => res.send(submittedProduct))
})


// Delete Product
router.delete('/delete/:id', (req, res) => {
    db.Category.destroy({
        where: {
            Category_id: req.params.id
        }
    }).then(() => res.send("success"))
})

// Update Product
router.put('/edit', (req, res) => {
    db.Category.update({
        Name: req.body.Name
    },
    {
        where: {
            Category_id: req.body.Category_id
        }
    }).then(() => res.send("successfully Updated"))
})

module.exports = router