const nodemailer = require("nodemailer");
const { google } = require("googleapis")

const CLIENT_ID = '199435103308-8fv6qbsn83vbdil5c2nhdcqk1dqqdsfm.apps.googleusercontent.com'
const CLIENT_SECRET = 'XQ-bOirPmlfhJSDZmSXQhJC2'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04S128V_zfmE_CgYIARAAGAQSNwF-L9IrThlwru_eMtvR2qHnUW1INIw4Zx7oO03qKIsC89nTYREFwwCeqaWcAh8gMNVat0w2xFY'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(email, val, firstname, lastname, token) {
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
		if(val === 'Sendmail') {
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
				to: email,
				subject: "Reset Password",
				html:
				'<p> <a href="http://localhost:3000/resetpassword"> Click here </a> to Reset Password </p>',
			};
			const result2 = await transporter.sendMail(mailOptions);
			return result2
		}
	} catch(error) {
		return error
	}
}

module.exports = sendMail