const router = require('express').Router()

router.get('/', (req, res) => {
  res.status(200).json({message: 'IT FUCKIGN WORKS BOOOOOOOOOI'})
})

module.exports = router
