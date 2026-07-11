require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');
const invokeGeminiAi = require('./src/services/ai.service');

connectDB();



app.listen(4000, () => {
  console.log('Server is running on port 3000');
});

