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

app.use(cookieSession({
  name: "lnkshrtapp",
  keys: ['erghi923902309923u9023']
}))
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const urlRouter = require("./routes/urlRouter");
const authRouter = require("./routes/authRouter");

app.use(express.json());
app.use('/auth', authRouter);
app.use('/', urlRouter);



app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
