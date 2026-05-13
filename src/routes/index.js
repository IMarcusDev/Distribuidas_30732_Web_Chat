const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "../views");

router.get("/", (_req, res) => {
    res.sendFile(path.join(views, "/index.html"));
});

module.exports = router;