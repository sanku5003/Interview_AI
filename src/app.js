const express = require('express');
const app = express();
app.use(express.json());
const authRouter = require('./Routes/auth.routes')

module.exports = app;