const express = require("express");
const router = express.Router();
const db = require("../models");

// All Review Data
router.get("/all", (req, res) => {
	db.Notification.findAll()
	.then((notify) => res.send(notify))
	.catch((err) => {
		res.status(404, err);
	});
});


// All Review Data of user
// router.get("/find/:id", (req, res) => {
// 	db.Review.findAll({
// 		where: {
// 			Users_id: req.params.id
// 	}
// 	})
// 		.then((reviewid) => res.send(reviewid))
// 		.catch((err) => {
// 			res.status(404, err);
// 		});
// });


// Insert Review
router.post("/new", (req, res) => {
    db.Notification.create({
        FullName: req.body.FullName,
        Message: req.body.Message,
        Notify_cate: req.body.Notify_cate
    }).then((submittedReview) => res.send(submittedReview))
});



// Delete Delete
router.delete("/delete/:id", (req, res) => {
	db.Notification.destroy({
		where: {
			Notification_id: req.params.id,
		},
	}).then(() => {
		res.json("Deleted Notification");
	});
});

module.exports = router;
