import express from 'express'
import { param } from 'express-validator'
import RestaurantController from '../controllers/RestaurantController'

const router = express.Router()

router.get(
  '/:restaurantId',
  param('restaurantId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('RestaurantId parameter must be a valid string'),
  RestaurantController.getRestaurant
)

// /api/restaurant/search/london
router.get(
  '/search/:city',
  param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City parameters must be a vlaid string'),
  RestaurantController.searchRestaurant
)

export default router
