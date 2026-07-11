const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials : true
}))
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//require all the routes here
const authRouter = require("./Routes/auth.routes");
const interviewRouter = require("./Routes/interview.routes")

//using all the routes
app.use("/api/auth", authRouter);
app.use("/api/interview" , interviewRouter);

module.exports = app;
