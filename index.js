const express = require("express");
const app = express();
const port = 3000;

const urlRouter = require("./routes/urlRouter");

app.use(express.json());
app.use("/url", urlRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
