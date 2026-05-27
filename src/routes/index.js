const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const isLoggedIn = require("../middleware/isLoggedIn");

const viewsDirectory = path.join(__dirname, "../views"); // corregido de: views
const imagesDirectory = path.join(__dirname, "../public/img"); // corregido de: imgDir

const profileImageStorage = multer.diskStorage({ // corregido de: storage
    destination: (_req, _file, callback) => callback(null, imagesDirectory), // corregido de: cb
    filename: (_req, file, callback) => {
        const fileExtension = path.extname(file.originalname).toLowerCase(); // corregido de: ext
        callback(null, `${Date.now()}${fileExtension}`);
    },
});

const uploadProfileImage = multer({ // corregido de: upload
    storage: profileImageStorage,
    fileFilter: (_req, file, callback) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png"]; // corregido de: allowed
        if (allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
            callback(null, true);
        } else {
            callback(new Error("Solo se permiten imágenes JPG y PNG"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", (_req, res) => {
    res.sendFile(path.join(viewsDirectory, "/index.html"));
});

router.get("/register", (_req, res) => {
    res.sendFile(path.join(viewsDirectory, "/register.html"));
});

router.get("/chat", isLoggedIn, (_req, res) => {
    res.sendFile(path.join(viewsDirectory, "/chat.html"));
});

router.post("/register", uploadProfileImage.single("profile"), (req, res) => {
    const { username } = req.body;

    if (!username || !req.file) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    res.cookie("username", username, { path: "/" });
    res.cookie("avatar", `/img/${req.file.filename}`, { path: "/" });
    res.json({ success: true });
});

module.exports = router;
