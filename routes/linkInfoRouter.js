const router = require('express').Router()
const admin = require('firebase-admin')

router.post('/', (req, res) => {
  const idToken = req.body.idToken

  if (idToken) {
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid
        console.log(uid)
        res.status(200).end()
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({message: 'You must be logged in'})
      })
  } else {
    res.status(401).json({message: 'Not Authorized'})
  }
  //res.status(200).json({message: 'IT FUCKIGN WORKS BOOOOOOOOOI'})
})

module.exports = router
