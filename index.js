require('dotenv').config()
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 3001

const urlRouter = require('./routes/urlRouter')
const authRouter = require('./routes/authRouter')

app.use(express.json())

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

app.use(
  cookieSession({
    name: 'lnkshrt.app',
    keys: ['n23uior823n7ufn2832c', '906459450945459guwskwle'],
    maxAge: 24 * 60 * 60 * 1000,
  }),
)

app.use('/auth', authRouter)
app.use('/', urlRouter)

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`)
})
