const request = require('supertest')
const app = require('./server')
const axios = require('axios')
const admin = require('firebase-admin')

let cookie

describe('Check for root redirect', () => {
  test('should redirect from root route', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(302)
  })
})

describe('Check for Error on invalid link', () => {
  test('fail on invalid link', async () => {
    return await request(app).get('/xvrc5lm').expect(400)
  })
})

describe('Check if login works', () => {
  test('if user is already signed up', async () => {
    const user = await admin.auth().getUserByEmail('mhmulford00@gmail.com')
    const customToken = await admin.auth().createCustomToken(user.uid)
    const idTokenResponse = await axios.post(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyCgO-w3WVqCwUiKCPfNbOuqa-fofw3W1_k',
      {
        token: customToken,
        returnSecureToken: true,
      },
    )

    return await request(app)
      .post('/auth/login')
      .send({idToken: idTokenResponse.data.idToken})
      .set('Content-Type', 'application/json')
      .expect(200)
      .then((res) => {
        cookie = res.header['set-cookie'][0]
      })
  })
})

describe('Check Link Shortner', () => {
  test('get a shortened link from full one', async () => {
    const user = await admin.auth().getUserByEmail('mhmulford00@gmail.com')
    const customToken = await admin.auth().createCustomToken(user.uid)
    const idTokenResponse = await axios.post(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyCgO-w3WVqCwUiKCPfNbOuqa-fofw3W1_k',
      {
        token: customToken,
        returnSecureToken: true,
      },
    )

    return await request(app)
      .post('/')
      .set('Cookie', cookie)
      .send({idToken: idTokenResponse.data.idToken, longLink: 'https://google.com'})
      .set('Content-Type', 'application/json')
      .expect(201)
  })
})

describe('Get All Links for a user', () => {
  test('returns all links for signed in user', async () => {
    return await request(app)
      .post('/user')
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .expect(200)
  })
})
