const express = require("express");
const { createServer } = require("http");
const startRealTimeServer = require("./realTimeServer"); // corregido de: realTimeServer
const path = require("path");
const cookieParser = require("cookie-parser");

const expressApp = express(); // corregido de: app
const httpServer = createServer(expressApp);

expressApp.set("port", process.env.PORT || 3000);
expressApp.set("views", path.join(__dirname, "views"));

expressApp.use(cookieParser());

expressApp.use(require("./routes"));

expressApp.use(express.static(path.join(__dirname, "public")));

httpServer.listen(expressApp.get("port"), () => {
    console.log("La aplicación esta corriendo en el puerto ", expressApp.get("port"));
});

startRealTimeServer(httpServer);
