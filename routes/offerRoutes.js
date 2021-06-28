const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");

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
  db.Offer.findAll().then((Offer) => res.send(Offer));
});

router.post("/new", upload.single("Image"), (req, res) => {
  db.Offer.create({
    Offer_Image: req.body.Offer_Image,
    Discount: req.body.Discount,
    Promocode: req.body.Promocode,
    Price: req.body.Price,
    Description: req.body.Description,
  }).then((submittedOffer) => res.send(submittedOffer));
});

// Delete Offer
// router.delete("/delete/:id", (req, res) => {
//   db.Offer.destroy({
//     where: {
//       Offer_id: req.params.id,
//     },
//   }).then(() => res.send("success deleted"));
// });

// Update Offer
router.put("/edit/:id", upload.single("Image"), (req, res) => {
  db.Offer.update(
    {
      Offer_Image: req.body.Offer_Image,
      Discount: req.body.Discount,
      Promocode: req.body.Promocode,
      Price: req.body.Price,
      Description: req.body.Description,
    },
    {
      where: {
        Offer_id: req.params.id,
      },
    }
  ).then(() => res.send("successfully Updated"));
});

module.exports = router;