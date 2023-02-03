const { Category, Restaurant, Comment, User, Favorite } = require('../../models')
const restaurantServices = require('../../services/restaurant-services')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.render('restaurants', data)
    )
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        // restaurant.FavoritedUsers中如果有登入的user.id則return true
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
        restaurant.increment('viewCounts')
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Restaurant.findByPk(id, { include: Category, raw: true, nest: true }),
      Comment.findAndCountAll({ where: { restaurantId: 153 } })
    ])
      .then(([restaurant, commentCounts]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', {
          restaurant,
          commentCounts: commentCounts.count
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    // const { FavoritedRestaurants } = req.user
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        return restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            description: restaurant.description.substring(0, 50),
            favoritedCount: restaurant.FavoritedUsers.length,
            // 因為測試檔不知道什麼一定要這樣寫
            isFavorited: req.user && req.user.FavoritedRestaurants.some(
              f => f.id === restaurant.id
            )
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
      })
      .then(restaurants => res.render('top-restaurants', { restaurants }))
      .catch(err => next(err))
  }
}

module.exports = restaurantController
