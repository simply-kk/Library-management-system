require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { setupScheduledJobs } = require("./services/scheduler");

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = process.env.CLIENT_URL?.split(',').map(url => url.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/returns", require("./routes/returnRoutes"));
app.use("/api/history", require("./routes/historyRoutes"));

// Start Scheduled Jobs
setupScheduledJobs();

// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
