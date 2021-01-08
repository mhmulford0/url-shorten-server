require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3001

const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const isAuthorized = (req, res, next) => {
  const sessionCookie = req.cookies.session || ''

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      next()
    })
    .catch((error) => {
      res.status(401).json({message: 'Not Authorized'})
    })
}

const linkInfoRouter = require('./routes/linkInfoRouter')
const urlRouter = require('./routes/urlRouter')
const authRouter = require('./routes/authRouter')

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://client.lnkshrt.app',
    ],
    optionsSuccessStatus: 200,
    credentials: true,
  }),
)

app.use('/linkInfo', isAuthorized, linkInfoRouter)
app.use('/auth', authRouter)
app.use('/', urlRouter)

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`)
})
