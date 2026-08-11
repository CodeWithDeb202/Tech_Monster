import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import publicRoutes from "./routes/Landingpage/public.routes.js";
import authRoutes from "./routes/auth.routes.js";

import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import taskRoutes from "./routes/task.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import messageRoutes from "./routes/message.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/Notification/notification.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import searchRoutes from "./routes/search.routes.js";

import adminTaskRoutes from "./routes/Admin/adminTask.routes.js";
import internshipRoutes from "./routes/internship.routes.js";
import serverRoutes from ".//routes/Server/server.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import adminSubmissionRoutes from "./routes/adminSubmissions.routes.js";


import morganMiddleware from "./middleware/logger.middleware.js";
import errorHandler from "./middleware/errorHandlre.js";


import { swaggerUi, swaggerSpec } from "./config/swagger.js";





const app = express();



// ==========================================
// Global Middlewares
// ==========================================


// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5199",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://tech-monster.vercel.app",
  "https://tech-monster-5zqd74uad-deb24.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
  })
);



app.use(express.json());


app.use(

  express.urlencoded({

    extended: true

  })

);


app.use(cookieParser());




// ==========================================
// Logger Middleware
// FIRST
// ==========================================


app.use(morganMiddleware);

app.get("/api/health", (req, res) => {

  if (process.env.MAINTENANCE_MODE === "true") {

    return res.status(503).json({
      success: false,
      statusCode: 503,
      message: "Website is under maintenance."
    });

  }

  res.status(200).json({
    success: true
  });

});

app.use((req, res, next) => {

  if (process.env.MAINTENANCE_MODE === "true") {

    return res.status(503).json({

      success: false,

      statusCode: 503,

      message: "Website is under maintenance."

    });

  }

  next();

});



// ==========================================
// API Routes
// ==========================================


app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/users", userRoutes);


app.use("/api/dashboard", dashboardRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/attendance", attendanceRoutes);


app.use("/api/certificates", certificateRoutes);

app.use("/api/messages", messageRoutes);


app.use("/api/admin", adminRoutes);
app.use("/api/admin/tasks", adminTaskRoutes);
app.use("/api/admin/submissions", adminSubmissionRoutes);

app.use("/api/submissions", submissionRoutes);

app.use("/api/notifications", notificationRoutes);



app.use("/api/analytics", analyticsRoutes);

app.use("/api/search", searchRoutes);

app.use(
  "/api/internships",
  internshipRoutes
);

app.use(
  "/api/server",
  serverRoutes
);











// ==========================================
// Swagger Documentation
// ==========================================


app.use(

  "/api/docs",

  swaggerUi.serve,

  swaggerUi.setup(

    swaggerSpec,

    {

      explorer: true

    }

  )

);





// ==========================================
// Health Check
// MUST BE BEFORE 404
// ==========================================


app.get("/", (req, res) => {


  res.status(200).json({

    success: true,

    message: "Tech Monster Backend Running 🚀"

  });


});





// ==========================================
// 404 Handler
// ==========================================


app.use((req, res) => {

  res.status(404).json({

    success: false,

    statusCode: 404,

    message: "Route not found"

  });

});





// ==========================================
// Error Middleware
// ALWAYS LAST
// ==========================================
app.use(errorHandler);




export default app;