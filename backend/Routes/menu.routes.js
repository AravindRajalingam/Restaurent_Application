import express from 'express'
import { getMenu } from '../Controllers/menu.controller.js'
import { getCategories } from '../Controllers/menu.controller.js'

const router = express.Router()
router.get('/get-menu-items', getMenu)
router.get('/get-categories',getCategories)

export default router
