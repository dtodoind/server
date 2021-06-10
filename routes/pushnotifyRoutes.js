const express = require("express");
const router = express.Router();
const db = require("../models")
const nodemailer = require("nodemailer")
require('dotenv').config()

// Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// All Product Data
router.get('/all', (req, res) => {
    db.Notify.findAll({
        order: [
            ['Notify_id', 'DESC']
        ]
    }).then(push => res.send(push))
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

    // Step 2
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.Email,
        subject: req.body.Subject,
        text: req.body.Message
    }

    // Step 3
    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            if(err.message === 'No recipients defined') {
                db.Notify.create({
                    Date: req.body.Date,
                    Email: req.body.Email,
                    Message: req.body.Message,
                    Subject: req.body.Subject
                }).then(submittedProduct => res.send(submittedProduct))
            } else {
                console.log('Error Occur: ' + err.message)
            }
        } else {
            db.Notify.create({
                Date: req.body.Date,
                Email: req.body.Email,
                Message: req.body.Message,
                Subject: req.body.Subject
            }).then(submittedProduct => res.send(submittedProduct))
        }
    })
})


// Delete Product
// router.delete('/delete/:id', (req, res) => {
//     db.PushNotify.destroy({
//         where: {
//             Category_id: req.params.id
//         }
//     }).then(() => res.send("success"))
// })

// Update Product
// router.put('/edit', (req, res) => {
//     db.Category.update({
//         Name: req.body.Name
//     },
//     {
//         where: {
//             Category_id: req.body.Category_id
//         }
//     }).then(() => res.send("successfully Updated"))
// })

module.exports = router