require("dotenv").config();
const express = require("express");
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3001', 'https://client.lnkshrt.app' ],
  optionsSuccessStatus: 200, 
};
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-r-p4kmck.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'http://localhost:3000',
    issuer: 'https://dev-r-p4kmck.us.auth0.com/',
    algorithms: ['RS256']
});


const urlRouter = require("./routes/urlRouter");
const authRouter = require("./routes/authRouter");

app.use(express.json());
app.use('/auth', authRouter);
app.use('/', urlRouter);



app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
