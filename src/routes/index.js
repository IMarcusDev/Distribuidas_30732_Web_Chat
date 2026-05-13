const express = require("express");
const router = express.Router();
const path = require("path");
const isLoggedIn = require("../middleware/isLoggedIn");

const views = path.join(__dirname, "../views");

router.get("/", (_req, res) => {
    res.sendFile(path.join(views, "/index.html"));
});

router.get("/register", (_req, res) => {
    res.sendFile(path.join(views, "/register.html"));
});

module.exports = router;