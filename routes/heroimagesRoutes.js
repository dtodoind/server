const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const { uploadFile, deleteFileStream } = require('../s3')

const fs = require('fs')
const util = require('util')
const unLinkFile = util.promisify(fs.unlink)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "./uploads/");
    const dir = './uploads/'

    if(!fs.existsSync(dir)) {
      fs.mkdir(dir, err => cb(err, dir))
    } else {
      cb(null, "./uploads/");
    }
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
router.post("/new", upload.single("heroImage"), async (req, res) => {
  console.log(req.file)
  const val = await uploadFile(req.file, 'Hero/')
  var result = val.Location
  db.HeroImages.create({
    Image: result,
  }).then((submittedImages) => res.send(submittedImages));
  await unLinkFile(req.file.path)
});

// Delete Product
router.delete("/delete/:id/:key", async (req, res) => {
  await deleteFileStream(req.params.key, 'Hero/')
  db.HeroImages.destroy({
    where: {
      HeroImages_id: req.params.id,
    },
  }).then(() => res.send("success"));
});

// Update Product
// router.put("/edit/:id", upload.single("heroImage"), (req, res) => {
//   db.HeroImages.update(
//     {
//       Image: req.body.Image,
//     },
//     {
//       where: {
//         HeroImages_id: req.params.id,
//       },
//     }
//   ).then(() => res.send("success"));
// });

module.exports = router;
