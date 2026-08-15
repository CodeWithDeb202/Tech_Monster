import morgan from "morgan";
import logger from "./logger.js";

// ==========================================================
// Morgan Stream
// ==========================================================

const stream = {

    write: (message) => {

        logger.info(

            message.trim()

        );

    }

};

// ==========================================================
// Morgan Format
// ==========================================================

const morganMiddleware = morgan(

    ":method :url :status :response-time ms - :res[content-length] bytes - :remote-addr",

    {

        stream

    }

);

export default morganMiddleware;