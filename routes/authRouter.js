require('dotenv').config()
const router = require('express').Router()
const admin = require('firebase-admin')

router.post('/login', (req, res) => {
  const idToken = req.body.idToken.toString()
  const expiresIn = 60 * 60 * 24 * 5 * 1000
  admin
    .auth()
    .createSessionCookie(idToken, {expiresIn})
    .then(
      (sessionCookie) => {
        const options = {maxAge: expiresIn, httpOnly: true}
        res.cookie('session', sessionCookie, options)
        res.end(JSON.stringify({status: 'success'}))
      },
      () => {
        res.status(401).json({message: 'UNAUTHORIZED REQUEST!'})
      },
    )
})

router.get('/logout', (req, res) => {
  res.clearCookie('session')
})

module.exports = router
