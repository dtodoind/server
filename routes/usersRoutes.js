const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const nodemailer = require("nodemailer");
const { google } = require("googleapis")
const { uploadFile } = require('../s3')

const fs = require('fs')
const util = require('util')
const unLinkFile = util.promisify(fs.unlink)

const CLIENT_ID = '199435103308-8fv6qbsn83vbdil5c2nhdcqk1dqqdsfm.apps.googleusercontent.com'
const CLIENT_SECRET = 'XQ-bOirPmlfhJSDZmSXQhJC2'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04S128V_zfmE_CgYIARAAGAQSNwF-L9IrThlwru_eMtvR2qHnUW1INIw4Zx7oO03qKIsC89nTYREFwwCeqaWcAh8gMNVat0w2xFY'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(email, val, firstname, lastname, token) {
	try {
		if(val === 'Sendmail') {
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
				subject: "Please confirm your account",
				html: `<h1>Email Confirmation</h1>
						<h2>Hello ${firstname} ${lastname}</h2>
						<p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
						<a href=https://blissful-pasteur-a524ff.netlify.app/confirm/${token}> Click here</a>
					</div>`,
			};
	
			const result = await transporter.sendMail(mailOptions);
			return result
		} else {
			let mailOptions = {
				from: process.env.EMAIL,
				to: req.body.email,
				subject: "Reset Password",
				html:
				'<p> <a href="http://localhost:3000/resetpassword"> Click here </a> to Reset Password </p>',
			};

			transporter.sendMail(mailOptions, function (err, data) {
				if (err) {
				console.log("Error Occur: " + err.message);
				} else {
				res.send(user);
				}
			});
		}
	} catch(error) {
		return error
	}
}

// Step 1
// let transporter = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 		user: process.env.EMAIL,
// 		pass: process.env.PASSWORD,
// 	},
// });

const storage = multer.diskStorage({
destination: function (req, file, cb) {
	cb(null, "./uploads/");
},
filename: function (req, file, cb) {
	cb(null, file.originalname);
},
});

const filefilter = (req, file, cb) => {
//reject files
if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
	cb(null, true);
} else {
	cb(null, false);
}
};

const upload = multer({ storage: storage, fileFilter: filefilter });

// All Users Data
router.get("/all", (req, res) => {
db.Users.findAll().then((users) => res.send(users));
});

// Find One User Data
router.get("/singleuser/:id", (req, res) => {
db.Users.findOne({
	where: {
	Users_id: req.params.id,
	},
}).then((users) => res.send(users));
});

// Update User Status
router.put("/status", auth, async (req, res) => {
  await db.Users.update(
    {
      Status: req.body.Status,
    },
    {
      where: {
        Users_id: req.body.Users_id,
      },
    }
  ).then((re) => res.send("success"));
});

// Login
router.post("/login", (req, res) => {
	db.Users.findAll({
		where: {
			Email: req.body.Email,
		},
  	}).then((result) => {
		if (result[0].Status != "Inactive") {
			if(result[0].Status === "Active") {
				res.send({
					error: "You are Logged in other device",
				});
			} else {
				res.send({
					error: "Pending Account. Please Verify Your Email!",
				});
			}
		} else if (result.length !== 0) {
		bcrypt
			.compare(req.body.Password, result[0].dataValues.Password)
			.then((auth) => {
			if (auth) {
				jwt.sign(
				{ id: result[0].dataValues.Users_id },
				process.env.SECRET_JWT,
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						loggedIn: true,
						result: JSON.stringify(result),
					});
				}
				);
			} else {
				res.json({
				loggedIn: false,
				error: "Your email or password is incorrect",
				});
			}
			});
		} else {
		res.json({
			loggedIn: false,
			error: "Your email or password is incorrect",
		});
		}
  	}).catch((err) => 
		res.json({
			loggedIn: false,
			error: "You are Not Registered",
		})
	);
});

router.get("/confirm/:token", (req, res) => {
  db.Users.findOne({
    where: {
      confirmationCode: req.params.token,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.send(user);
      user.Status = "Inactive";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
});

// Insert user
router.post("/new", upload.single("Image"), async (req, res) => {
	var ad = [req.body.Address.split(/, /g)];
	var hashedpass = await bcrypt.hash(req.body.Password, 10);
	const token = jwt.sign({ Email: req.body.Email }, process.env.SECRET_JWT);

	const val = await uploadFile(req.file, `Users/${req.body.Username}/`)
	result = val.Location

	db.Users.create({
		Username: req.body.Username,
		FirstName: req.body.FirstName,
		LastName: req.body.LastName,
		Email: req.body.Email,
		Password: hashedpass,
		Address: JSON.stringify(ad),
		Phoneno: req.body.Phoneno,
		Zip: JSON.stringify([req.body.Zip]),
		Gender: req.body.Gender,
		Image: result,
		Status: req.body.Status,
		confirmationCode: token,
	})
	.then((user) => {
		sendMail(req.body.Email, 'Sendmail', req.body.FirstName, req.body.LastName, token)
			.then(result => {
				res.send(user)
			})
			.catch(error => console.log('sendMail Error: ', error.message))
		// let mailOptions = {
		// 	from: process.env.EMAIL,
		// 	to: req.body.Email,
		// 	subject: "Please confirm your account",
		// 	html: `<h1>Email Confirmation</h1>
		// 			<h2>Hello ${req.body.FirstName} ${req.body.LastName}</h2>
		// 			<p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
		// 			<a href=http://localhost:3000/confirm/${token}> Click here</a>
		// 		</div>`,
		// };

		// transporter.sendMail(mailOptions, function (err, data) {
		// 	if (err) {
		// 	console.log("Error Occur: " + err.message);
		// 	} else {
		// 	res.send(user);
		// 	// res.send({
		// 	// 	message: "User was registered successfully! Please check your email",
		// 	// });
		// 	}
		// });
	})
	.catch((err) => {
		console.log(err.errors)
		if (err.errors[0].path === "Email") {
			err.message = "Email is already registered";
			res.send(err.message);
		} else if (err.errors[0].path === "Username") {
			err.message = "Username is already registered";
			res.send(err.message);
		}
	});
});

// Forget page
router.post("/resetpass", (req, res) => {
db.Users.findOne({
	where: {
	email: req.body.email,
	},
}).then((user) => {
	if (user === "") {
	res.send(user);
	} else {
		sendMail(req.body.Email, 'forgotpass')
			.catch(error => console.log('sendMail Error: ', error.message))
		// // Step 2
		// let mailOptions = {
		// 	from: process.env.EMAIL,
		// 	to: req.body.email,
		// 	subject: "Reset Password",
		// 	html:
		// 	'<p> <a href="http://localhost:3000/resetpassword"> Click here </a> to Reset Password </p>',
		// };

		// // Step 3
		// transporter.sendMail(mailOptions, function (err, data) {
		// 	if (err) {
		// 	console.log("Error Occur: " + err.message);
		// 	} else {
		// 	res.send(user);
		// 	}
		// });
	}
});
});

// Reset Page
router.put("/passwordreset", async (req, res) => {
var hashedpass = await bcrypt.hash(req.body.Password, 10);
db.Users.findOne({
	where: {
	email: req.body.email,
	},
}).then((use) => {
	bcrypt.compare(req.body.Password, use.Password).then((match) => {
	if (match) {
		res.send("Enter New Password not Old Password");
	} else {
		db.Users.update(
		{
			Password: hashedpass,
		},
		{
			where: {
			email: req.body.email,
			},
		}
		).then((user) => res.send("success"));
	}
	});
});
});

// Update User Details
router.put("/detailsupdate", auth, upload.single("Image"), async (req, res) => {
	var result = ''
	if(req.file === undefined) {
		result = req.body.Image
	} else {
		const val = await uploadFile(req.file, `Users/${req.body.Username}/`)
		result = val.Location
	}
	db.Users.update(
		{
			Address: req.body.Address,
			Email: req.body.Email,
			FirstName: req.body.FirstName,
			Gender: req.body.Gender,
			Image: result,
			LastName: req.body.LastName,
			Phoneno: req.body.Phoneno,
			Zip: req.body.Zip,
			// Username: req.body.Username,
		},
		{
			where: {
				Users_id: req.body.Users_id,
			},
		}
	).then((re) => res.send(result));
	if(req.file !== undefined) {
		await unLinkFile(req.file.path)
	}
});

module.exports = router;
