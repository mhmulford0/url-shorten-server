require("dotenv").config();
const express = require("express");
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const urlRouter = require("./routes/urlRouter");

app.use(express.json());
app.use('/', urlRouter);


app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
