const adminServices = require('../../services/admin-services')
// const { localFileHandler } = require('../../helpers/file-helpers')// 照片上傳
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = adminController
