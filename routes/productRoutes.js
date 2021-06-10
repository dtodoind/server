const express = require("express");
const router = express.Router();
const db = require("../models")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const filefilter =  (req, file, cb) => {
    //reject files
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({storage: storage, fileFilter: filefilter})

// All Product Data
router.get('/all', (req, res) => {
    db.Product.findAll({
        include: [db.Category]
    }).then(product => res.send(product))
})

// Get Single Product
router.get("/find/:id", (req, res) => {
    db.Product.findAll({
        where: {
            Product_id: req.params.id
        }
    }).then(onepro => res.send(onepro))
})

// Insert Product
router.post('/new', (req, res) => {
    db.Product.create({
        Name: req.body.Name,
        Description: req.body.Description,
        Image: req.body.Image,
        Category_id: req.body.Category_id,
        Color: req.body.Color,
        Size: req.body.Size,
        Stock: req.body.Stock,
        Price: req.body.Price
    }).then(submittedProduct => res.send(submittedProduct))
})


// Delete Product
router.delete('/delete/:id', (req, res) => {
    db.Product.destroy({
        where: {
            Product_id: req.params.id
        }
    }).then(() => res.send("success"))
})

// Update Product
router.put('/edit', upload.single('productImage'), (req, res) => {
    db.Product.update({
        Name: req.body.Name,
        Description: req.body.Description,
        Category_id: req.body.Category_id,
        Image: req.body.Image,
        Color: req.body.Color,
        Size: req.body.Size,
        Stock: req.body.Stock,
        Price: req.body.Price
    },
    {
        where: {
            Product_id: req.body.Product_id
        }
    }).then(() => res.send("success"))
})

// Update Product Quantity
router.put('/quantity', (req, res) => {
    db.Product.update({
        Stock: req.body.Stock
    },
    {
        where: {
            Product_id: req.body.Product_id
        }
    }).then(() => res.send("success"))
})

module.exports = router