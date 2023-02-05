const bcrypt = require('bcryptjs')
// const { localFileHandler } = require('../../helpers/file-helpers') // 照片上傳
const { User } = require('../models')
// const { User, Restaurant, Favorite, Like, Followship, Comment } = require('../../models')
const userServices = {
  signUp: (req, cb) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  }
}
module.exports = userServices
