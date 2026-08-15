import mongoose from "mongoose";

const getServerStatus = async () => {

    return {

        backend: "Online",

        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected",

        cloudinary:
            process.env.CLOUDINARY_CLOUD_NAME
                ? "Active"
                : "Inactive",

        serverTime: new Date()

    };

};

export default getServerStatus;