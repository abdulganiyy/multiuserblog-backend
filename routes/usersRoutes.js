const express = require("express");

const router = express.Router();

const { register, login, update } = require("../controllers/usersControllers");

router.post("/register", register);

router.post("/login", login);

router.patch("/update", update);

module.exports = router;
