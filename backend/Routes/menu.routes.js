import express from 'express'
import { addCategory, addMenuItem, getMenu, searchItem } from '../Controllers/menu.controller.js'
import { getCategories } from '../Controllers/menu.controller.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()
router.get('/get-menu-items', getMenu)
router.get('/get-categories',getCategories)
router.get('/search-item/:item',searchItem)
router.post('/add-category',addCategory)
router.post('/add-menu-item',upload.single("image"),addMenuItem)

export default router
