const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const isLoggedIn = require("../middleware/isLoggedIn");

const views = path.join(__dirname, "../views");
const imgDir = path.join(__dirname, "../public/img");

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, imgDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png"];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes JPG y PNG"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", (_req, res) => {
    res.sendFile(path.join(views, "/index.html"));
});

router.get("/register", (_req, res) => {
    res.sendFile(path.join(views, "/register.html"));
});

router.get("/chat", isLoggedIn , (_req, res) => {
    res.sendFile(path.join(views, "/chat.html"));
});

router.post("/register", upload.single("profile"), (req, res) => {
    const { username } = req.body;

    if (!username || !req.file) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    res.cookie("username", username, { path: "/" });
    res.cookie("avatar", `/img/${req.file.filename}`, { path: "/" });
    res.json({ success: true });
});

module.exports = router;
