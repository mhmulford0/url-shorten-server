const router = require("express").Router();
const nanoid = require("nanoid");
const db = require('../data/dbConfig');

const validUrl = require('valid-url');


router.get("/", (req, res) => {
  res.status(200).json({ message: "url routes" });
});

router.post('/', async (req, res) => {
  const { longLink } = req.body;
  const shortLink = nanoid.customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)();
  
  if(validUrl.isWebUri(longLink)) {
    res.status(201).json({message: shortLink});
  } else {
    res.status(400).json({message: "invalid URL"})
  }
  
});

module.exports = router;
