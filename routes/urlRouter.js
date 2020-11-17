const router = require("express").Router();
const nanoid = require("nanoid");
const db = require('../data/dbConfig');

const validUrl = require('valid-url');
const publicIp = require('public-ip');
const axios = require('axios');

router.get("/", (req, res) => {
  res.status(200).json({ message: "url routes" });
});

router.get('/:shortLink', async (req, res) => {
  const shortLink = req.params.shortLink;
  
  if(process.env.NODE_ENV == 'development') {
    const vistorIp = await publicIp.v4();
  } else {
    const vistorIp = req.headers["x-forwarded-for"];
    console.log('PROD' + vistorIp);
  }
  
  try {
    const linkId = await db('links')
      .where('shortLink', '=', shortLink)
      .select('id', 'longLink', 'clicks');

    if (linkId.length === 1) {
      const link = linkId[0];
      console.log(link);

      const visitorLocation = await axios.get(
        `http://api.ipstack.com/${vistorIp}?access_key=${process.env.API_KEY}&output=json`
      );

        const locData = `${visitorLocation.data.country_name} ${visitorLocation.data.region_name} ${visitorLocation.data.city}`;

      await db('click_info').insert({
        location: locData,
        link_id: link.id,
      });

      await db('links').where('shortLink', '=', shortLink).update({clicks: link.clicks + 1})
      res.redirect(link.longLink);
    } else {
      res.status(400).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/:shortLink/info', async (req, res) => {
  const shortLink = req.params.shortLink;
  try {
    const id = await db("links").where("shortLink", "=", shortLink).select("id")
    if(id.length === 1) {
      const data = await db('click_info')
        .join('links', 'links.id', '=', 'click_info.link_id')
        .select('links.id', 'click_info.location', 'links.clicks')
        .where('links.id', '=', id[0].id);
      console.log(data);
      res.status(200).json(data[0])
    } else {
      res.status(400).json({message: "link not found"})
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({message: "server error"})
  }

})


router.post('/', async (req, res) => {
  const { longLink } = req.body;
  const shortLink = nanoid.customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)();
  
  if(validUrl.isWebUri(longLink)) {
    try {
      await db('links').insert({
        longLink: longLink,
        shortLink: shortLink,
        clicks: 0,
      });
      res.status(201).json({message: shortLink});
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "there was an error with your request"})
    }

  } else {
    res.status(400).json({message: "invalid URL"})
  }
  
});

module.exports = router;
