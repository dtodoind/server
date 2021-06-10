const express = require("express");
const router = express.Router();
const db = require("../models");

// All Review Data
router.get("/all", (req, res) => {
	db.Review.findAll({
		include: [db.Users],
		order: [
            ['Review_id', 'DESC']
        ]
	})
	.then((reviews) => res.send(reviews))
	.catch((err) => {
		res.status(404, err);
	});
});


// All Review Data of user
router.get("/find/:id", (req, res) => {
	db.Review.findAll({
		where: {
			Users_id: req.params.id
		}
	})
		.then((reviewid) => res.send(reviewid))
		.catch((err) => {
			res.status(404, err);
		});
});


// Insert Review
router.post("/new", (req, res) => {
	db.Review.create({
		Users_id: req.body.Users_id,
		Message: req.body.Message,
		Image: req.body.Image,
		Username: req.body.Username
	}).then((submittedReview) => res.send(submittedReview))
});



// Delete Delete
router.delete("/delete/:id", (req, res) => {
	db.Review.destroy({
		where: {
			Review_id: req.params.id,
		},
	}).then(() => {
		res.json("Deleted Review");
	});
});

module.exports = router;
