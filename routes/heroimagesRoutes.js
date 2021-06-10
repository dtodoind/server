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
  db.HeroImages.findAll().then((hero) => res.send(hero));
});

// Insert Product
router.post("/new", upload.single("heroImage"), (req, res) => {
  db.HeroImages.create({
    Image: req.file.filename,
  }).then((submittedImages) => res.send(submittedImages));
});

// Delete Product
router.delete("/delete/:id", (req, res) => {
  db.HeroImages.destroy({
    where: {
      HeroImages_id: req.params.id,
    },
  }).then(() => res.send("success"));
});

// Update Product
router.put("/edit/:id", upload.single("heroImage"), (req, res) => {
  db.HeroImages.update(
    {
      Image: req.body.Image,
    },
    {
      where: {
        HeroImages_id: req.params.id,
      },
    }
  ).then(() => res.send("success"));
});

module.exports = router;
