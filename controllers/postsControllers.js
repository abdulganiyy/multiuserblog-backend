const Post = require("../models/Post");
const checkAuth = require("../utils/checkAuth");

const { cloudinary } = require("../utils/cloudinary");

exports.getAllPosts = async (req, res) => {
  const posts = await Post.find().select("-__v").sort("-date");

  if (posts) {
    return res.status(200).json({
      status: "success",
      posts,
    });
  }
};

exports.getAPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate("user").select("-__v");

  if (post) {
    return res.status(200).json({
      status: "success",
      post,
    });
  }
};

exports.createAPost = async (req, res) => {
  const decodedUser = checkAuth(req, res);

  cloudinary.uploader.upload(req.body.coverPhoto).then((response) => {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      user: decodedUser.id,
      coverPhoto: response.url,
      createdAt: Date.now(),
    });

    newPost
      .save()
      .select("-__v")
      .then((result) => {
        Post.populate(newPost, { path: "user" }).then((post) => {
          return res.status(201).json({
            status: "success",
            post,
          });
        });
      });
  });
};
