import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initSocket = (server) => {

    io = new Server(server, {

        cors: {

            origin: "*",

            methods: ["GET", "POST"]

        }

    });

    io.on("connection", (socket) => {

        socket.on("join", (userId) => {

            if (!userId) return;

            onlineUsers.set(
                String(userId),
                socket.id
            );

            io.emit(
                "onlineUsers",
                Array.from(onlineUsers.keys())
            );
        });

        socket.on(

            "typing",

            ({ receiver }) => {

                const receiverSocketId = onlineUsers.get(receiver);

                if (receiverSocketId) {

                    io.to(receiverSocketId).emit(

                        "typing"

                    );

                }

            }

        );

        socket.on(

            "stopTyping",

            ({ receiver }) => {

                const receiverSocketId = onlineUsers.get(receiver);

                if (receiverSocketId) {

                    io.to(receiverSocketId).emit(

                        "stopTyping"

                    );

                }

            }

        );

        socket.on(

            "disconnect",

            () => {

                for (

                    const [

                        userId,

                        socketId

                    ] of onlineUsers.entries()

                ) {

                    if (

                        socketId === socket.id

                    ) {

                        onlineUsers.delete(userId);

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

export const getIO = () => io;

export const getOnlineUsers = () => onlineUsers;

export const emitToUser = (userId, event, payload) => {
    const socketId = onlineUsers.get(String(userId));

    if (io && socketId) {
        io.to(socketId).emit(event, payload);
    }
};
