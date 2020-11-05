const router = require("express").Router();
const nanoid = require("nanoid");


router.get("/", (req, res) => {
  res.status(200).json({ message: "url routes" });
});

router.post("/", async (req, res) => {
  const { longUrl } = req.body;
  const id = nanoid.nanoid(14);
  res.status(201).json({ url_added: id });
});

module.exports = router;
