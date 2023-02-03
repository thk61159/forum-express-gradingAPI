const router = require('express').Router()
const admin = require('./modules/admin')
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)

module.exports = router
