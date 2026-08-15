import winston from "winston";
import fs from "fs";

const {
    combine,
    timestamp,
    printf,
    colorize,
    errors
} = winston.format;


// ==========================================================
// Create Logs Folder
// ==========================================================

if (!fs.existsSync("logs")) {

    fs.mkdirSync("logs");

}


// ==========================================================
// Custom Format
// ==========================================================

const logFormat = printf(

    ({
        level,
        message,
        timestamp,
        stack
    }) => {

        return `[${timestamp}] ${level}: ${
            stack || message || "Unknown Error"
        }`;

    }

);


// ==========================================================
// Logger
// ==========================================================

const logger = winston.createLogger({

    level: "info",


    format: combine(

        errors({
            stack:true
        }),

        timestamp({

            format:"YYYY-MM-DD HH:mm:ss"

        }),

        logFormat

    ),



    transports:[


        // ==================================================
        // Error Logs
        // ==================================================

        new winston.transports.File({

            filename:"logs/error.log",

            level:"error"

        }),



        // ==================================================
        // All Logs
        // ==================================================

        new winston.transports.File({

            filename:"logs/combined.log"

        })

    ],



    // ======================================================
    // Uncaught Exception Logs
    // ======================================================

    exceptionHandlers:[


        new winston.transports.File({

            filename:"logs/exceptions.log",

            format:combine(

                errors({

                    stack:true

                }),

                timestamp({

                    format:"YYYY-MM-DD HH:mm:ss"

                }),

                logFormat

            )

        })


    ],



    // ======================================================
    // Promise Rejection Logs
    // ======================================================

    rejectionHandlers:[


        new winston.transports.File({

            filename:"logs/rejections.log",

            format:combine(

                errors({

                    stack:true

                }),

                timestamp({

                    format:"YYYY-MM-DD HH:mm:ss"

                }),

                logFormat

            )

        })


    ]

});




// ==========================================================
// Development Console
// ==========================================================

if(process.env.NODE_ENV !== "production"){


    logger.add(


        new winston.transports.Console({


            format:combine(

                colorize(),

                timestamp({

                    format:"HH:mm:ss"

                }),

                logFormat

            )


        })


    );


}



export default logger;