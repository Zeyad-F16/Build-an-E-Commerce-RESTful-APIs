const express =require('express'); 

const cors = require('cors');

const compression = require('compression');

const { rateLimit } = require("express-rate-limit");

const path = require('path');
 
const morgan = require('morgan'); 

const hpp = require('hpp');

const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');
 
const dotenv =require('dotenv');
 
dotenv.config({path:'config.env'});
 
const dbConnection = require('./config/database');
 
const ApiError = require('./utils/apiError');
 
const globalError = require('./middlewares/errorMiddleware');
 
const mountRoutes = require('./routes/index');

const {webhookCheckout} = require('./services/orderService')
 
dbConnection();
 
// express app 
const app = express();

 // Enable other domains to access your application
 app.use(cors());
 app.options('*', cors());
 
// compress all responses
 app.use(compression());

 // Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

 // middlewares
 app.use(express.json({limit : '20kb'}));

 // to get a file from server ==> localhost:3000/ModelName/filename
 app.use(express.static(path.join(__dirname, 'uploads')));
 
 if(process.env.NODE_ENV === 'development'){
   app.use(morgan('dev'));
   console.log(`${process.env.NODE_ENV} mode`);
  }
  
  app.get('/',(req, res) =>{
    res.json({message : 'welcome to My APIs'});
});

// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss())

// Limit each Ip to 100 requests per 'window' (here, per 15 mintues)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message:
  "Too many accounts created from this IP, please try again after an hour",
});
app.use("/api/", apiLimiter);

// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
   whitelist: [
    'price',
    'sold',
    'quantity',
  ]
})
);


// mount routes
mountRoutes(app);

//  error handling middleware for routes
app.all('*',(req,res,next)=>{
  next(new ApiError(`can't find this route : ${req.originalUrl}`,400));
});
 
// Global error handling middleware for express 
app.use(globalError);

const port = process.env.PORT || 3000 ;

const server = app.listen(port,()=>{
    console.log(`running on port ${port}`);
 });

 
 // handle rejection outside express (database connection)
process.on('unhandledRejection',(err)=>{
  console.log(`Database Error: ${err.name} | ${err.message}`);
  server.close(()=>{
    console.log(`shutting down...`);
    process.exit(1);
  });
});
