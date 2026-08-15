import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5199",
    "http://localhost:3000",

    "https://tech-monster.vercel.app",

    "https://tech-monster-5zqd74uad-deb24.vercel.app"
];


// =====================================
// INITIALIZE SOCKET
// =====================================

export const initSocket = (server) => {

    io = new Server(server, {

        cors: {

            origin: allowedOrigins,

            methods: [
                "GET",
                "POST"
            ],

            credentials: true

        }

    });


    io.on("connection", (socket) => {


        // =====================================
        // JOIN USER
        // =====================================

        socket.on("join", (userId) => {

            if (!userId) {
                return;
            }

            const id = String(userId);

            onlineUsers.set(
                id,
                socket.id
            );


            io.emit(
                "onlineUsers",
                Array.from(
                    onlineUsers.keys()
                )
            );

        });


        // =====================================
        // TYPING
        // =====================================

        socket.on(
            "typing",
            ({ receiver }) => {

                if (!receiver) {
                    return;
                }

                const receiverSocketId =
                    onlineUsers.get(
                        String(receiver)
                    );

                if (receiverSocketId) {

                    io.to(receiverSocketId)
                        .emit("typing");

                }

            }
        );


        // =====================================
        // STOP TYPING
        // =====================================

        socket.on(
            "stopTyping",
            ({ receiver }) => {

                if (!receiver) {
                    return;
                }

                const receiverSocketId =
                    onlineUsers.get(
                        String(receiver)
                    );

                if (receiverSocketId) {

                    io.to(receiverSocketId)
                        .emit("stopTyping");

                }

            }
        );


        // =====================================
        // DISCONNECT
        // =====================================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "🔴 Socket disconnected:",
                    socket.id
                );

                for (
                    const [
                        userId,
                        socketId
                    ]
                    of onlineUsers.entries()
                ) {

                    if (
                        socketId === socket.id
                    ) {

                        onlineUsers.delete(
                            userId
                        );

                        break;

                    }

                }


                io.emit(
                    "onlineUsers",
                    Array.from(
                        onlineUsers.keys()
                    )
                );

            }
        );

    });

};


// =====================================
// GET SOCKET IO
// =====================================

export const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.io has not been initialized"
        );
    }

    return io;
};


// =====================================
// GET ONLINE USERS
// =====================================

export const getOnlineUsers = () => {

    return onlineUsers;

};


// =====================================
// EMIT TO SPECIFIC USER
// =====================================

export const emitToUser = (
    userId,
    event,
    payload
) => {

    if (!io) {
        return;
    }

    const socketId =
        onlineUsers.get(
            String(userId)
        );

    if (socketId) {

        io.to(socketId).emit(
            event,
            payload
        );

        console.log(
            `🔔 ${event} sent to user ${userId}`
        );

    }

};