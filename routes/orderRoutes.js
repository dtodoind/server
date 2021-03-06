const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middleware/auth");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
var mercadopago = require('mercadopago');

// All Order Data
router.get("/all", (req, res) => {
	db.Orders.findAll({
		include: [
			{
				model: db.OrderItem,
				include: [db.Product],
			},
			db.Users,
		],
		order: [["Orders_id", "DESC"]],
	}).then((order) => res.send(order));
});

// Specific Order
router.get("/all/:id", (req, res) => {
	db.Orders.findAll({
		include: [
			{
				model: db.OrderItem,
				include: [db.Product],
			},
			db.Users,
		],
		order: [["Orders_id", "DESC"]],
		where: {
			Users_id: req.params.id,
		},
	}).then((order) => res.send(order));
});

// // Get Single Order
// router.get("/find/:id", (req, res) => {
//     db.Orders.findAll({
//         where: {
//             Orders_id: req.params.id
//         }
//     }).then(oneorder => res.send(oneorder))
// })

// Insert Order
router.post('/new', (req, res) => {
	console.log(req.body)
	db.Orders.create({
		// PaymentSuccess_id: req.body.PaymentSuccess,
		Status: req.body.Status,
		Discount: req.body.Discount,
		Address: req.body.Address,
		Delivery_date: req.body.Delivery_date,
		Delivery_charges: req.body.Delivery_charges,
		ClientName: req.body.ClientName,
		Email: req.body.Email,
		Phone: req.body.Phone,
		Users_id: req.body.Users_id
	}).then(submittedOrder => res.send(submittedOrder))
})


// Delete Product
// router.delete('/delete/:id', (req, res) => {
//     db.Category.destroy({
//         where: {
//             Category_id: req.params.id
//         }
//     }).then(() => res.send("success"))
// })

// Update Status
router.put("/status", (req, res) => {
	db.Orders.update(
		{
			Status: req.body.Status,
			Delivery_date: req.body.Delivery_date
		},
		{
			where: {
				Orders_id: req.body.Orders_id,
			},
		}
	).then(() => res.send("successfully Updated"));
});

router.post('/payment', async (req, res) => {
	
	mercadopago.configure({
		access_token: 'APP_USR-4704468221720930-081215-a2b21470f29dd59dcace026de1b7f806-175591458'
		// APP_USR-5883300347000345-072919-70ca0a0d649f0b999c8c5865da022fdd-798958320
	});
	
	let preference = {
		items: req.body.item,
		// payer: req.body.payer,
		back_urls: {
			"success": 'https://www.dtodoind.com/checkout',
			"pending": 'https://www.dtodoind.com/checkout'
		},
		payment_methods: {
			// excluded_payment_methods: [
			// 	{
			// 		id: "visa"
			// 	}
			// ],
			excluded_payment_types: [
				{
					id: "ticket"
				}
			],
			installments: 1
		}
	};
	  
	mercadopago.preferences.create(preference)
	.then(function(response){
		var global = response.body.id;
		res.send(response)
	}).catch(function(error){
		console.log(error);
	});

	

	// const body = {
	// 	amount: req.body.amount,
	// 	currency: 'ars',
	// }

	// try {
	// 	const paymentIntent = await stripe.paymentIntents.create(body);
	
	// 	res.status(200).send(paymentIntent.client_secret);
	// } catch (error) {
	// 	console.log(error)
	// 	res.status(500).json({ statusCode: 500, message: error.message })
	// }

	// var payload = await stripe.paymentMethods.create({
	// 	type: req.body.type,
	// 	card: JSON.parse(req.body.card),
	// 	billing_details: req.body.billingDetails
	// });
	// res.send(payload.data)
	// stripe.charges.create(body, (stripeErr, stripeRes) => {
	// 	if(stripeErr) {
	// 		res.status(500).send({error: stripeErr})
	// 	} else {
	// 		res.status(200).send({ success: stripeRes })
	// 	}
	// })
})

router.post('/refund', async (req, res) => {
	var amount = parseInt(req.body.refund_amount)
	if(amount === undefined) {
		const refund = await stripe.refunds.create({
			payment_intent: req.body.payment_id,
		});
		res.send(refund)
	} else {
		const refund2 = await stripe.refunds.create({
			amount: amount,
			payment_intent: req.body.payment_id,
		});
		res.send(refund2)
	}
})

module.exports = router;
