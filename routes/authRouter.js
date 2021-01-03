require("dotenv").config();
const router = require('express').Router();
const db = require('../data/dbConfig');
const axios = require('axios');
const bcrypt = require('bcrypt');
const {findUser, dataShape} = require("../utils/users")

router.post('/signup', async (req, res) => {
  let checkSignedUp;
  try {
    checkSignedUp = await db("users").where({ username: req.body.username }).orWhere({email: req.body.email})
  } catch (error) {
    return res.status(500).json({message: "Database Error"})
  }
  
  if (checkSignedUp.length > 0) {
    return res.status(400).json({ message: "user already exists" })
  } 

  const checkFormat = dataShape(req.body.username, req.body.password, req.body.repeat_password, req.body.email)
  if (checkFormat.error) {
    return res.status(400).json(checkFormat.error)
  }

  const hashedPw = bcrypt.hashSync(req.body.password, 9);
  
  try {
    await db("users").insert({ username: req.body.username, password: hashedPw, email: req.body.email })
    return res.status(201).json({message: "User added"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Server Error"})
  }

  
})


router.post('/login', async (req, res) => {
  
  // axios
  //   .post('https://dev-r-p4kmck.us.auth0.com/oauth/token',
  //     {
  //       "client_id": "ZSMDs0Idl7z3XCdg5PVcMiUZdqqgb2QA",
  //       "client_secret": "v1OLBXEHeDNj6DiwWcvPCtJgcktCqHuced4sEa8N7BY3Ku82iVgnICyD6o-rWOGS",
  //       "audience": "http://localhost:3000",
  //       "grant_type": "client_credentials"
  //     }).then(res => console.log(res.data)).catch(err => console.log(err))
});

router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/")
})

module.exports = router