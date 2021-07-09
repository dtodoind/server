const express = require("express");
const router = express.Router();
const db = require("../models")
const multer = require('multer')
const { uploadFile } = require('../s3')

const fs = require('fs')
const util = require('util')
const unLinkFile = util.promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, './uploads/')
        const dir = './uploads/'

        if(!fs.existsSync(dir)) {
            fs.mkdir(dir, err => cb(err, dir))
        } else {
            cb(null, "./uploads/");
        }
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
router.put('/edit', upload.single('productImage'), async (req, res) => {
    var result = ''
	if(req.file === undefined) {
        result = req.body.Image
	} else {
		const val = await uploadFile(req.file, `Products/${req.body.Name}/${JSON.parse(req.body.Color)[req.body.imgid]}/`)
        var imgstore = JSON.parse(req.body.Image)
        imgstore[req.body.imgid].push(val.Location)
        result = JSON.stringify(imgstore)
	}
    db.Product.update({
        Name: req.body.Name,
        Description: req.body.Description,
        Category_id: req.body.Category_id,
        Image: result,
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
    if(req.file !== undefined) {
		await unLinkFile(req.file.path)
	}
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