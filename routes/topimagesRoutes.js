const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const spawn = require('child_process').spawn;

const process = spawn('python', ['./hello.py'])

process.stdout.on('data', (data) => {
    console.log(data.toString());
})

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

router.get("/all", (req, res) => {
	db.TopImages.findAll().then((top) => res.send(top));
});

// Insert Images
router.post("/new", upload.single("topImage"), (req, res) => {
	db.TopImages.create({
		Image: req.file.filename,
	}).then((submittedImages) => res.send(submittedImages));
});

// // Delete Product
// router.delete("/delete/:id", (req, res) => {
// 	db.TopImages.destroy({
// 		where: {
// 			TopImages_id: req.params.id,
// 		},
// 	}).then(() => res.send("success"));
// });

// Update Product
router.put("/edit/:id", upload.single("topImage"), (req, res) => {
	db.TopImages.update(
		{
			Image: req.file.filename,
		},
		{
			where: {
				TopImages_id: req.params.id,
			},
		}
	).then(() => res.send("success"));
});

module.exports = router;
