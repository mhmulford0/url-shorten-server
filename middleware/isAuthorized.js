const admin = require('firebase-admin')

const isAuthorized = (req, res, next) => {
  const sessionCookie = req.cookies.session || ''

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(401).json({message: 'Not Authorized'})
    })
}

module.exports = isAuthorized
