require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')

const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

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
app.use('/', urlRouter)
app.use('/auth', authRouter)

module.exports = app
