const router = require('express').Router();
const nanoid = require('nanoid');
const db = require('../data/dbConfig');

const validUrl = require('valid-url');
const publicIp = require('public-ip');
const axios = require('axios');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'API up and running' });
});

router.get('/:shortLink', async (req, res) => {
  const shortLink = req.params.shortLink;
  let vistorIp;
  if (process.env.NODE_ENV == 'development') {
    try {
      vistorIp = await publicIp.v4();
    } catch (error) {
      console.log(error);
      vistorIp = '8.8.8.8';
    }
  } else {
    vistorIp = req.headers['x-forwarded-for'] || '8.8.8.8';
  }

  try {
    const linkId = await db('links')
      .where('shortLink', '=', shortLink)
      .select('id', 'longLink');

    if (linkId.length === 1) {
      const link = linkId[0];

      const visitorLocation = await axios.get(
        `http://api.ipstack.com/${vistorIp}?access_key=${process.env.API_KEY}&output=json`
      );

      const locationData = `${visitorLocation.data.country_name} ${visitorLocation.data.region_name} ${visitorLocation.data.city}`;

      await db('click_info').insert({
        location: locationData,
        link_id: link.id,
        click_date: new Date().toDateString(),
      });

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
    const data = await db('click_info')
      .join('links', 'links.id', '=', 'click_info.link_id')
      .select(
        'click_info.id',
        'click_info.location',
        'click_info.click_date',
        'links.longLink',
        'links.shortLink'
      )
      .where('links.shortLink', shortLink)
      .orderBy('click_info.click_date', 'asc');
    const linkData = data.map((link) => {
      return { longLink: link.longLink, shortLink: link.shortLink };
    });
    const clickData = data.map((click) => {
      return { location: click.location, date: click.click_date };
    });

    if (!clickData.length > 0) {
      res.status(400).json({ error: 'Link Not found' });
    } else {
      res.status(200).json({ linkInfo: linkData[0], clickInfo: clickData });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error' });
  }
});

router.post('/', async (req, res) => {
  const { longLink } = req.body;
  const shortLink = nanoid.customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyz',
    12
  )();

  if (validUrl.isWebUri(longLink)) {
    try {
      await db('links').insert({
        longLink: longLink,
        shortLink: shortLink,
      });

      res.status(201).json({ message: shortLink });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'there was an error with your request' });
    }
  } else {
    res.status(400).json({ message: 'invalid URL' });
  }
});

module.exports = router;
