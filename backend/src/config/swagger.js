import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Tech Monster API",
            version: "1.0.0",
            description:
                "Professional Internship Portal Backend API Documentation"
        },

        servers: [
            {
                url: "https://tech-monster.onrender.com",
                description: "Production Server"
            },
            {
                url: "http://localhost:5000",
                description: "Local Development Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: [
        "./src/routes/*.js",
        "./src/routes/**/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export {
    swaggerUi,
    swaggerSpec
};