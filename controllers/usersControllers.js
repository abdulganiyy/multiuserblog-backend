const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateEmail = require("../utils/validateEmail");
const checkAuth = require("../utils/checkAuth");
const { cloudinary } = require("../utils/cloudinary");

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct fields details",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct email address",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide matching passwords",
      });
    }

    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists,try new username and password",
      });
    }

    const hash = await bcrypt.hash(password, 8);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, username: newUser.username },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(201).json({
      status: "success",
      token: token,
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct fields details",
      });
    }

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct username/email",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        job: user.job,
        bio: user.bio,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.update = async (req, res) => {
  const decodedUser = checkAuth(req, res);

  const { avatar, ...rest } = req.body;

  const user = await User.findById(decodedUser.id);

  if (user) {
    cloudinary.uploader.upload(avatar).then((response) => {
      user.username = rest.username;
      user.email = rest.email;
      user.job = rest.job;
      user.bio = rest.bio;
      user.avatar = response.url;

      user
        .save()
        .select("-password -__v")
        .then((result) => {
          return res.status(201).json({
            status: "success",
            user: result,
          });
        });
    });
  }
};
