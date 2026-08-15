import jwt from "jsonwebtoken";
import User from "../../modules/user/models/User.js";
import asyncHandler from "../core/http/asyncHandler.js";
import AppError from "../core/errors/AppError.js";

export const protect = asyncHandler(async (req, res, next) => {


    let token;

    if (

        req.headers.authorization &&

        req.headers.authorization.startsWith("Bearer")

    ) {

        token = req.headers.authorization.split(" ")[1];

    }

    if (!token) {

        throw new AppError(

            "Not authorized. No token provided.",

            401

        );

    }

    const decoded = jwt.verify(

        token,

        process.env.JWT_SECRET

    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {

        throw new AppError(

            "User not found",

            404

        );

    }

    req.user = user;

    next();

});