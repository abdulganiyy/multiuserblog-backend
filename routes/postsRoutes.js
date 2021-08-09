const express = require("express");

const router = express.Router();

const {
  createAPost,
  getAPost,
  getAllPosts,
} = require("../controllers/postsControllers");

router.post("/", createAPost);

router.get("/", getAllPosts);

router.get("/:id", getAPost);

module.exports = router;
