import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



dotenv.config();



mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
})
.catch((err)=> {
    console.log("Error Occurend while conecting to database!!!");
})


const app = express();
// Enable CORS for all routes



app.use(express.json());
//app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // This is important to allow sending cookies
  }));
app.use(cookieParser());
app.listen(3000,() => {
console.log('Server is running in port 3000!!');
});

 
app.use("/api/user", userRouter);
app.use("/api/auth",authRouter);


app.use((err,req,res,next) => {
 const statusCode = err.statusCode || 500 ;
 const message = err.message || "Internal server Error";
 return res.status(statusCode).json({
    success:false,
    statusCode,
    message
 })
}
);