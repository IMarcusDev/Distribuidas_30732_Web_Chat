module.exports = (httpServer) => {
    const { Server } = require("socket.io");
    const socketServer = new Server(httpServer); // corregido de: io

    function parseCookies(cookieHeader) {
        const cookies = {}; // corregido de: list
        if (!cookieHeader) return cookies;
        cookieHeader.split(`;`).forEach(function (rawCookie) { // corregido de: cookie
            let [cookieName, ...cookieValueParts] = rawCookie.split(`=`); // corregido de: name, ...rest
            cookieName = cookieName?.trim();
            if (!cookieName) return;
            const cookieValue = cookieValueParts.join(`=`).trim(); // corregido de: value
            if (!cookieValue) return;
            cookies[cookieName] = decodeURIComponent(cookieValue);
        });
        return cookies;
    }

    socketServer.on("connection", socket => {
        console.log("conectado:", socket.id);

        const cookies = parseCookies(socket.handshake.headers.cookie);
        const currentUsername = cookies.username || 'Anónimo'; // corregido de: userReal
        const currentAvatar = cookies.avatar || '/img/Profile.jpeg'; // corregido de: avatarReal

        socket.on("chat message", (incomingMessage) => { // corregido de: msg
            if (!incomingMessage || typeof incomingMessage.text !== 'string' || incomingMessage.text.trim() === '') {
                return;
            }

            const safeMessage = { // corregido de: mensajeSeguro
                text: incomingMessage.text.trim(),
                username: currentUsername,
                avatar: currentAvatar,
                time: Date.now()
            };

            socketServer.emit("chat message", safeMessage);
        });

        socket.on("typing", (typingData) => { // corregido de: data
            if (typingData && typeof typingData.isTyping === 'boolean') {
                socket.broadcast.emit("typing", {
                    isTyping: typingData.isTyping,
                    username: currentUsername
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("desconectado:", socket.id);
        });
    })
};
