const router = require('express').Router()
// const passport = require('../../config/passport')
// const admin = require('./modules/admin')
// // const { authenticated } = require('../../middleware/auth')

// const restController = require('../../controllers/apis/restaurant-controller')
// const userController = require('../../controllers/apis/user-controller')
// const { apiErrorHandler } = require('../../middleware/error-handler')
// router.use('/admin', admin)
// router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
// router.get('/restaurants', restController.getRestaurants)
const passport = require('../../config/passport') // 新增這行
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller') // 新增這行
const { apiErrorHandler } = require('../../middleware/error-handler')
router.use('/admin', admin)
router.post(
  '/signin',
  passport.authenticate('local', {
    session: false,
    // https://github.com/jaredhanson/passport/issues/458
    failWithError: true
  }),
  userController.signIn,
  function (err, req, res, next) {
    // Handle error
    return res.status(401).send({ success: false, message: err })
  }
) // 新增這行，設定 disable sessions
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler)
module.exports = router
