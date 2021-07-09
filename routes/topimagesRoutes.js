const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const { uploadFile } = require('../s3')

const fs = require('fs')
const util = require('util')
const unLinkFile = util.promisify(fs.unlink)

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// cb(null, "./uploads/");
		const dir = './uploads/'

    	fs.mkdir(dir, err => cb(err, dir))
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
router.post("/new", upload.single("topImage"), async (req, res) => {
	const val = await uploadFile(req.file, 'TopImages/')
	result = val.Location
	db.TopImages.create({
		Image: result,
	}).then((submittedImages) => res.send(submittedImages));
	if(req.file !== undefined) {
		await unLinkFile(req.file.path)
	}
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
router.put("/edit/:id", upload.single("topImage"), async (req, res) => {
	var result = ''
	if(req.file === undefined) {
		result = req.body.Offer_Image
	} else {
		const val = await uploadFile(req.file, 'TopImages/')
		result = val.Location
	}
	db.TopImages.update(
		{
			Image: result,
		},
		{
			where: {
				TopImages_id: req.params.id,
			},
		}
	).then(() => res.send("success"));
	if(req.file !== undefined) {
		await unLinkFile(req.file.path)
	}
});

module.exports = router;
