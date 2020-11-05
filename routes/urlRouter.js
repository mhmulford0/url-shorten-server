const router = require("express").Router();
const nanoid = require("nanoid");
const db = require("../data/dbConfig");


router.get("/", (req, res) => {
  res.status(200).json({ message: "url routes" });
});

router.post("/", async (req, res) => {
  const { longLink } = req.body;
  const shortLink = nanoid.nanoid(14);
  res.status(201).json({
    longLink: longLink,
    shortLink: `${process.env.BASE_URL}${shortLink}`,
  });
});

module.exports = router;
