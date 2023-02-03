const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantServices = {
  // 在restaurantServices中留存共用的程式碼
  // 共用的參數為傳入呼叫的req還有將data傳出去的callback fn
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants
          ? req.user.FavoritedRestaurants.map(fr => fr.id)
          : []
        const likedRestaurantsId = req.user?.LikedRestaurants
          ? req.user.LikedRestaurants.map(lr => lr.id)
          : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        // error-first callback
        // 如果進入這個return代表沒有錯誤發生 因此傳入null
        return cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => cb(err)) // 如果進入catch 就把抓到的error放到cb()的 arg
  }
}

module.exports = restaurantServices
