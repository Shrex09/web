const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blogRoutes = require("./routes/blogRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const path = require("path"); // Add this at the top with other requires

// Serve static files (HTML, CSS, JS)





// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(cors());
// Middleware
app.use(
  cors({
    // origin: [
    //   "https://abhi-ty-mini-project.vercel.app",
    //   "https://yashrajbusinessgroup.com/",
    // ],
    origin:"*"
  })
);


app.use(express.json());
// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));


// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"));
});

// Serve admin dashboard
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

// Serve all other frontend routes (except admin ones)
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/admin")) {
    return res.status(404).send("Not Found");
  }
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
