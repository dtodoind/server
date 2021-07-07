const express = require("express");
const router = express.Router();
const db = require("../models")
const nodemailer = require("nodemailer")
require('dotenv').config()

const CLIENT_ID = '199435103308-8fv6qbsn83vbdil5c2nhdcqk1dqqdsfm.apps.googleusercontent.com'
const CLIENT_SECRET = 'XQ-bOirPmlfhJSDZmSXQhJC2'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04S128V_zfmE_CgYIARAAGAQSNwF-L9IrThlwru_eMtvR2qHnUW1INIw4Zx7oO03qKIsC89nTYREFwwCeqaWcAh8gMNVat0w2xFY'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(email, subject, message, date) {
	try {
		const accessToken = await oAuth2Client.getAccessToken()
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: 'OAuth2',
				user: process.env.EMAIL,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken
			},
		});
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: message
        }

        const result = await transporter.sendMail(mailOptions, function(err, data) {
            if(err) {
                if(err.message === 'No recipients defined') {
                    db.Notify.create({
                        Date: date,
                        Email: email,
                        Message: message,
                        Subject: subject
                    }).then(submittedProduct => res.send(submittedProduct))
                } else {
                    console.log('Error Occur: ' + err.message)
                }
            } else {
                db.Notify.create({
                    Date: date,
                    Email: email,
                    Message: message,
                    Subject: subject
                }).then(submittedProduct => res.send(submittedProduct))
            }
        });
        return result
	} catch(error) {
		return error
	}
}

// // Step 1
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// })

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
    sendMail(req.body.Email, req.body.Subject, req.body.Message, req.body.Date)
        .then(result => {
            console.log('successful')
        })
        .catch(error => console.log('sendMail Error: ', error.message))
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