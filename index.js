const express = require("express")
const dotenv= require("dotenv")
dotenv.config()
require("colors")
const userRoutes=require("./routes/userRoutes")
const invoiceRoutes = require("./routes/invoiceRoutes");
const connectDB = require("./config/connectDb");
const cookieParser = require("cookie-parser");
const cors= require("cors")
const passport= require("passport")
// const setTokensCookies = require("./utils/setTokenCookies")
// const upload = require("./middleware/FileUploder")
require("./config/passport-jwt-strategy")
require("./config/google-strategy")

const app= express()
const PORT= process.env.PORT|| 8002
const DATABASE_URL = process.env.DATABASE_URL

// Solve cors policy Error
// const corsOptions={
//     // set origin to a specific origin
//     origin:process.env.FRONTEND_HOST,
//     credentials:true,
//     optionsSuccessStatus:200,
// }

const corsOptions = {
  origin: (origin, callback) => {
      const allowedOrigins = [`${process.env.FRONTEND_HOST}`, `${process.env.FRONTEND_SERVER_HOST}`];
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
      }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
 app.use(cors(corsOptions))

// app.use(cors({
//   origin: ['http://localhost:3000'],
//   credentials:true,
// }))


// Database Connection
connectDB(DATABASE_URL)

// Middleware to parse JSON request bodies
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());

// Cookie Parser
app.use(cookieParser())

// routes
app.get('/', (req, res) => {
    res.send('products api running new deploy');
});
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/invoice", invoiceRoutes)
// Google Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login`}),
    (req, res)=> {
        const { user, accessToken} = req.user; 
        console.log(accessToken)
        res.cookie('accessToken', accessToken, {
          httpOnly: false, // Helps to prevent XSS attacks
          secure: process.env.NODE_ENV === 'production', // Set secure cookie for production
          maxAge: 36 * 10000, // Set expiration time of the token (in milliseconds)
          sameSite: 'Strict', // Helps with CORS issues
        });
      // Successful authentication, redirect home.
      res.redirect(`${process.env.FRONTEND_HOST}/user/myinvoice`);
    });
  // app.get('/auth/google/callback', 
  //   passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login`}),
  //   (req, res)=> {
  //       const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } = req.user; 
  //       console.log(accessToken)
  //       setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp)
  //     // Successful authentication, redirect home.
  //     res.redirect(`${process.env.FRONTEND_HOST}/user/myinvoice`);
  //   });
  

app.listen(PORT, ()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})
