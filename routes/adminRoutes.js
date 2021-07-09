const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
// const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");

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

// see all admins
router.get("/all", (req, res) => {
  db.Admin.findAll().then((admin) => res.send(admin));
});

// Find One User Data
router.get("/singleadmin/:id", (req, res) => {
  db.Admin.findOne({
    where: {
      Admin_id: req.params.id,
    },
  }).then((re) => res.send(re));
});

// Login
router.post("/login", (req, res) => {
  db.Admin.findAll({
    where: {
      Email: req.body.Email,
    },
  }).then((result) => {
    if (result.length !== 0) {
      bcrypt
        .compare(req.body.Password, result[0].dataValues.Password)
        .then((auth) => {
          if (auth) {
            jwt.sign(
              { id: result[0].dataValues.Admin_id },
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
  });
});

//insert new admin
router.post("/new", upload.single("Image"), async (req, res) => {
  var hashedpass = await bcrypt.hash(req.body.Password, 10);
  db.Admin.create({
    Name: req.body.Name,
    Email: req.body.Email,
    Password: hashedpass,
    Image: req.body.Image,
  })
    .then((submittedadmin) => res.send(submittedadmin))
    .catch((err) => {
      if (err.errors[0].path === "admin.Email") {
        err.message = "Email is already registered";
        res.send(err.message);
      } else if (err.errors[0].path === "admin.Name") {
        err.message = "Username is already registered";
        res.send(err.message);
      }
    });
});
// Update Product
router.put("/edit/:id", upload.single("Image"), async (req, res) => {
  var hashedpass = await bcrypt.hash(req.body.Password, 10);
  db.Admin.update(
    {
      Name: req.body.Name,
      Email: req.body.Email,
      Password: hashedpass,
      Image: req.body.Image,
    },
    {
      where: {
        Admin_id: req.params.id,
      },
    }
  ).then(() => res.send("successfully Updated"));
});
module.exports = router;
