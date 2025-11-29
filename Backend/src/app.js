import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import router from "./routes/user.routes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/users", router);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export { app };


