require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const urlRouter = require("./routes/urlRouter");

app.use(express.json());
app.use('/', urlRouter);


app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
