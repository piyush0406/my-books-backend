const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadFile");

const Book = require("../models/book");
const Star = require("../models/star");

router.get("/getBook", (req, res, next) => {
  Book.find()
    .exec()
    .then((response) => {
      console.log(response);
      res.status(200).json({
        books: response,
        path: `${__dirname}`
      });
    })
    .catch((err) => {
      // console.log("err is: ", err);
      res.status(500).json({
        err: err,
      });
    });
});

router.post(
  "/createBook",
  // uploadCover.single("cover"),
  upload.fields([
    {
      name: "pdf",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    try{const { writer, readTime, details } = req.body;
    console.log(req.files);

    let star = new Star({
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
    });

    const x = await star.save();

    let book = new Book({
      title: req.body.title,
      cover: `${__dirname}/files/${req.files.cover[0].filename}`,
      pdf: `${__dirname}/files/${req.files.pdf[0].filename}`,
      writer: writer,
      readTime: readTime,
      details: details,
      rating: x._id,
    });

    await book.save();

    res.status(200).json({ book: book });}
    catch(err){
      console.log(err);
    }
  }
);

router.get("/getBookById/:id", async (req, res, next) => {
  console.log("id is: ", req.params.id);

  const x = await Book.find({ _id: req.params.id });

  res.status(200).json({
    book: x,
  });
});

module.exports = router;
