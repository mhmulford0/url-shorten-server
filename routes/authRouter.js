require('dotenv').config()
const router = require('express').Router()
const admin = require('firebase-admin')
const db = require('../data/dbConfig')

router.post('/login', (req, res) => {
  const idToken = req.body.idToken.toString()
  if (idToken) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    admin
      .auth()
      .createSessionCookie(idToken, {expiresIn})
      .then(
        (sessionCookie) => {
          const options = {maxAge: expiresIn, httpOnly: true}
          res.cookie('session', sessionCookie, options)
          res.status(201).json({message: 'success'})
        },
        () => {
          res.status(401).json({message: 'UNAUTHORIZED REQUEST!'})
        },
      )
  } else {
    res.status(401).json({message: 'UNAUTHORIZED REQUEST!'})
  }
})

router.post('/signup', (req, res) => {
  const email = req.body.email
  const idToken = req.body.idToken.toString()
  if (email) {
    admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        db('users')
          .insert({id: userRecord.uid, email: userRecord.email})
          .then(() => {
            if (idToken) {
              const expiresIn = 60 * 60 * 24 * 5 * 1000
              admin
                .auth()
                .createSessionCookie(idToken, {expiresIn})
                .then(
                  (sessionCookie) => {
                    const options = {maxAge: expiresIn, httpOnly: true}
                    res.cookie('session', sessionCookie, options)
                    res.status(201).json({message: 'success'})
                  },
                  () => {
                    res.status(401).json({message: 'UNAUTHORIZED REQUEST!'})
                  },
                )
            } else {
              res.status(401).json({message: 'UNAUTHORIZED REQUEST!'})
            }
          })
          .catch((err) => console.log(err))
      })
      .catch(() => {
        res.status(400).json({message: 'Error fetching user data:'})
      })
  } else {
    res.status(401).json({message: 'Email is required'})
  }
})

router.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.status(200).end()
})

module.exports = router
