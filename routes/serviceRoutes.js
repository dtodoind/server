const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", (req, res) => {
  db.Service.findAll().then((service) => res.send(service));
});

router.post("/new", (req, res) => {
  db.Service.create({
    Title: req.body.title,
    Description: req.body.desc,
    Select: req.body.icons,
  }).then((submittedService) => res.send(submittedService));
});

// Delete Product
router.delete("/delete/:id", (req, res) => {
  db.Service.destroy({
    where: {
      Service_id: req.params.id,
    },
  }).then(() => res.send("success"));
});

// Update Product
// router.put("/edit/:id", (req, res) => {
//   db.Service.update(
//     {
//       Title: req.body.Title,
//       Description: req.body.Description,
//       Select: req.body.Select,
//     },
//     {
//       where: {
//         Service_id: req.params.id,
//       },
//     }
//   ).then(() => res.send("successfully Updated"));
// });

module.exports = router;
