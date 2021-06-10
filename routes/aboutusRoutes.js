const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", (req, res) => {
  db.Aboutus.findAll().then((about) => res.send(about));
});

router.post("/new", (req, res) => {
  db.Aboutus.create({
    Content: req.body.Content,
  }).then((submittedAbout) => res.send(submittedAbout));
});

// Delete Product
// router.delete("/delete/:id", (req, res) => {
//   db.Aboutus.destroy({
//     where: {
//       Aboutus_id: req.params.id,
//     },
//   }).then(() => res.send("success"));
// });

// Update 
router.put("/edit/:id", (req, res) => {
  db.Aboutus.update(
    {
      Content: req.body.Content,
    },
    {
      where: {
        Aboutus_id: req.params.id,
      },
    }
  ).then(() => res.send("successfully Updated"));
});

module.exports = router;
