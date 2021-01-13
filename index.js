const port = process.env.PORT || 3001
const app = require('./server')

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`)
})
