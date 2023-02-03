const router = require('express').Router()
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')
const adminController = require('../../controllers/apis/admin-controller')
router.get('/restaurants', restController.getRestaurants)
router.get('/admin/restaurants', adminController.getRestaurants)
module.exports = router
