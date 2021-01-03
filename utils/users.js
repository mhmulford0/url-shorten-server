const db = require('../data/dbConfig')
const Joi = require('joi')

const findUser = async (username) => {
  try {
    await db('users').where({username: `${username}`})
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: 'Database Error'})
  }
}

const signup = (username, password, email, repeat_password) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    repeat_password: Joi.ref('password'),

    email: Joi.string().email({minDomainSegments: 2}).required(),
  })

  return schema.validate({
    username: username,
    password: password,
    repeat_password: repeat_password,
    email: email,
  })
}

const login = (username, password) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  })

  return schema.validate({
    username: username,
    password: password,
  })
}
module.exports = {findUser, signup, login}
