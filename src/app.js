const express = require('express');
const app = express();
app.use(express.json());

//require all the routes here
const authRouter = require('./Routes/auth.routes')

//using all the routes
app.use("/api/auth" , authRouter);

module.exports = app;