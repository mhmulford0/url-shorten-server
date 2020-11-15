const router = require("express").Router();
const nanoid = require("nanoid");
const db = require('../data/dbConfig');

const validUrl = require('valid-url');


router.get("/", (req, res) => {
  res.status(200).json({ message: "url routes" });
});

router.get('/:shortLink', async (req, res) => {
  const shortLink = req.params.shortLink;
  try {
    const linkInfo = await db('links')
      .where('shortLink', '=', shortLink)
      .select('longLink', 'clicks');
    console.log(linkInfo);
    if (linkInfo.length === 1) {
      const link = linkInfo[0];

      await db('links')
        .update('clicks', link.clicks + 1)
        .where('shortLink', '=', shortLink);

      console.log(link);
      res.redirect(link.longLink);
    } else {
      res.status(400).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { longLink } = req.body;
  const shortLink = nanoid.customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)();
  
  if(validUrl.isWebUri(longLink)) {
    await db('links').insert({
      longLink: longLink,
      shortLink: shortLink,
      clicks: 0,
    });
    res.status(201).json({message: shortLink});
  } else {
    res.status(400).json({message: "invalid URL"})
  }
  
});

module.exports = router;
