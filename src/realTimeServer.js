module.exports = (httpServer) => {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);

    function parseCookies(cookieHeader) {
        const list = {};
        if (!cookieHeader) return list;
        cookieHeader.split(`;`).forEach(function(cookie) {
            let [name, ...rest] = cookie.split(`=`);
            name = name?.trim();
            if (!name) return;
            const value = rest.join(`=`).trim();
            if (!value) return;
            list[name] = decodeURIComponent(value);
        });
        return list;
    }

    io.on("connection", socket => {
        console.log("conectado:", socket.id);

        const cookies = parseCookies(socket.handshake.headers.cookie);
        const userReal = cookies.username || 'Anónimo';
        const avatarReal = cookies.avatar || '/img/Profile.jpeg';

        socket.on("chat message", (msg) => {
            if (!msg || typeof msg.text !== 'string' || msg.text.trim() === '') {
                return; 
            }

            const mensajeSeguro = {
                text: msg.text.trim(),
                username: userReal,
                avatar: avatarReal,
                time: Date.now()
            };

            io.emit("chat message", mensajeSeguro);
        });

        socket.on("typing", (data) => {
            if (data && typeof data.isTyping === 'boolean') {
                socket.broadcast.emit("typing", {
                    isTyping: data.isTyping,
                    username: userReal 
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("desconectado:", socket.id);
        });
    })
};