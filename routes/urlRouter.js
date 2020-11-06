const router = require("express").Router();
const nanoid = require("nanoid");
const db = require("../data/dbConfig");
const Joi = require('joi');



router.get("/", (req, res) => {
  res.status(200).json({ message: "url routes" });
});

router.post('/', async (req, res) => {
  const { longLink } = req.body;
  const shortLink = nanoid.nanoid(14);

  const schema = Joi.object({
    longLink: Joi.string()
      .required()
      .uri({
        scheme: ['http', 'https'],
      }),
  });

  const url = schema.validate({ longLink });
  
  if (url.error) {
    console.log(url);
    res.status(400).json({message: "Invalid URL"})
  } else {
    res.status(201).json({
      longLink: longLink,
      shortLink: `${process.env.BASE_URL}${shortLink}`,
    });
  
  }

});

module.exports = router;
