import asyncHandler from "../../core/http/asyncHandler.js";

import getServerStatus from "./getServerStatus.js";

export const serverStatus = asyncHandler(async (req, res) => {

    const status = await getServerStatus();

    res.status(200).json({

        success: true,

        status

    });

});