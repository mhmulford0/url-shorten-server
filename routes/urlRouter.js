const router = require('express').Router()
const nanoid = require('nanoid')
const db = require('../data/dbConfig')
const admin = require('firebase-admin')
const validUrl = require('valid-url')
const publicIp = require('public-ip')
const axios = require('axios')

const isAuthorized = require('../middleware/isAuthorized')

router.get('/', (req, res) => {
  res.redirect('https://client.lnkshrt.app/')
})

router.get('/:shortLink', async (req, res) => {
  const shortLink = req.params.shortLink
  let vistorIp
  if (process.env.NODE_ENV == 'development') {
    try {
      vistorIp = await publicIp.v4()
    } catch (error) {
      vistorIp = '8.8.8.8'
    }
  } else {
    vistorIp = req.headers['x-forwarded-for'] || '8.8.8.8'
  }

  try {
    const linkId = await db('links')
      .where('shortLink', '=', shortLink)
      .select('id', 'longLink')

    if (linkId.length === 1) {
      const link = linkId[0]

      const visitorLocation = await axios.get(
        `http://api.ipstack.com/${vistorIp}?access_key=${process.env.API_KEY}&output=json`,
      )

      const locationData = `${visitorLocation.data.region_name}, ${visitorLocation.data.city}, ${visitorLocation.data.country_code} `

      await db('click_info').insert({
        location: locationData,
        link_id: link.id,
        click_date: new Date().toDateString(),
      })

      res.redirect(link.longLink)
    } else {
      res.status(400).json({message: 'Link not found'})
    }
  } catch (error) {
    res.status(500).json({message: 'Server Error'})
  }
})

router.post('/:shortLink/info', isAuthorized, async (req, res) => {
  const shortLink = req.params.shortLink
  try {
    const fullData = await db('links')
      .join('click_info', 'links.id', '=', 'click_info.link_id')
      .select(
        'click_info.id',
        'click_info.location',
        'click_info.click_date',
        'links.longLink',
        'links.shortLink',
      )
      .where('links.shortLink', shortLink)
      .orderBy('click_info.click_date', 'asc')

    const linkData = fullData.map((link) => {
      return {longLink: link.longLink, shortLink: link.shortLink}
    })

    const clickData = fullData.map((click) => {
      return {location: click.location, date: click.click_date}
    })

    if (!linkData.length > 0) {
      // check the db to see if the link exists without any clicks yet
      const onlyLinkData = await db('links')
        .select('links.longLink', 'links.shortLink')
        .where('links.shortLink', shortLink)

      // if no clicks, return an error - otherwise return just the link info
      if (!onlyLinkData.length > 0) {
        res.status(400).json({error: 'Link Not found'})
      } else {
        res.status(200).json({linkInfo: onlyLinkData[0], clickInfo: []})
      }
    } else {
      res.status(200).json({linkInfo: linkData[0], clickInfo: clickData})
    }
  } catch (error) {
    res.status(500).json({message: 'server error'})
  }
})

router.post('/', isAuthorized, async (req, res) => {
  const {longLink} = req.body
  const shortLink = nanoid.customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 7)()
  const idToken = req.body.idToken
  let {uid} = await admin.auth().verifyIdToken(idToken)

  if (validUrl.isWebUri(longLink)) {
    try {
      await db('links').insert({
        longLink: longLink,
        shortLink: shortLink,
        user_id: uid,
      })

      res.status(201).json({message: shortLink})
    } catch (error) {
      res.status(500).json({message: 'there was an error with your request'})
    }
  } else {
    res.status(400).json({message: 'invalid URL'})
  }
})

router.post('/user', isAuthorized, async (req, res) => {
  const sessionCookie = req.cookies.session

  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((decodedClaims) => {
        const uid = decodedClaims.uid
        db('links')
          .select('id', 'longLink', 'shortLink')
          .where('user_id', uid)
          .then((data) => res.status(200).json({data}))
      })
      .catch(() => {
        res.status(500).json({message: 'You must be logged in'})
      })
  } else {
    res.status(401).json({message: 'Not Authorized'})
  }
})

router.delete('/:shortLink', isAuthorized, (req, res) => {
  const shortLink = req.params.shortLink
  const sessionCookie = req.cookies.session
  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((decodedClaims) => {
        const uid = decodedClaims.uid
        db('links')
          .where({user_id: uid, shortLink: shortLink})
          .del()
          .then(() => res.status(200).json({message: 'Link Deleted'}))
          .catch(() => res.status(400).end())
      })
      .catch(() => {
        res.status(500).json({message: 'You must be logged in'})
      })
  } else {
    res.status(401).json({message: 'Not Authorized'})
  }
})
module.exports = router
