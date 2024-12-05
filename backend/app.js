// Loads the express
const express = require('express');
const cors = require('cors');
const app = express();
// Loads the environment variables
require('dotenv').config(); 

// Middleware to parse json
app.use(express.json());
// Middleware to enable cors
app.use(cors());
// Middleware import (This allows the api to check for token for validity before every request)
const { authenticate } = require('./middlewares/authMiddleware');
// Routes Importing
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const tournamentRouter = require('./routes/tournamentRoute');
const matchRouter = require('./routes/matchRoute');
const participationRouter = require('./routes/participationRoute');

app.use('/api/auth',authRouter);

const authenticatedRouters = [userRouter,tournamentRouter,matchRouter,participationRouter];
app.use('/api',authenticate,authenticatedRouters);

app.listen(3005,()=>{
    console.log('Server running on port 3005');    
});