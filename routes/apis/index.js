const router = require('express').Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/restaurants', authenticated, restController.getRestaurants)
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
)
router.use('/', apiErrorHandler)
module.exports = router
