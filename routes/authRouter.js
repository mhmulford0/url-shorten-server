require('dotenv').config()
const router = require('express').Router()
const db = require('../data/dbConfig')
const bcrypt = require('bcrypt')
const {signup, login} = require('../utils/users')

router.post('/signup', async (req, res) => {
  let checkSignedUp
  try {
    checkSignedUp = await db('users')
      .where({username: req.body.username})
      .orWhere({email: req.body.email})
  } catch (error) {
    return res.status(500).json({message: 'Error with request'})
  }

  if (checkSignedUp.length > 0) {
    return res.status(400).json({message: 'user already exists'})
  }

  const checkFormat = signup(
    req.body.username,
    req.body.password,
    req.body.email,
    req.body.repeat_password,
  )
  if (checkFormat.error) {
    return res.status(400).json(checkFormat.error)
  }

  const hashedPw = await bcrypt.hash(req.body.password, 9)

  try {
    await db('users').insert({
      username: req.body.username,
      password: hashedPw,
      email: req.body.email,
    })

    return res.status(201).json({message: 'User added'})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Server Error'})
  }
})

router.post('/login', async (req, res) => {
  const checkFormat = login(req.body.username, req.body.password)
  if (checkFormat.error) {
    return res.status(400).json(checkFormat.error)
  }

  try {
    const user = await db('users')
      .select('id', 'username', 'password')
      .where({username: req.body.username})
    const password = bcrypt.compareSync(req.body.password, user[0].password)

    if (password) {
      req.session.user = {id: user[0].id, username: user[0].username}
      return res.status(200).json({message: 'Logged In'})
    } else {
      return res.status(400).json({message: 'Could not log you in, please try again'})
    }
  } catch (error) {
    return res.status(400).json({message: 'Could not log you in, please try again'})
  }
})

router.get('/logout', (req, res) => {
  req.session = null
})

module.exports = router
