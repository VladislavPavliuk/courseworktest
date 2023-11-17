const express = require('express');
const WarehouseController = require('../controllers/WarehouseController');

const router = express.Router();

// Роут для додавання товару на склад
router.post('/addProduct', WarehouseController.addProductToWarehouse);

// Роут для отримання всіх товарів на складі
router.get('/allProducts', WarehouseController.getAllProducts);

// Роут для видалення товару зі складу
router.delete('/removeProduct', WarehouseController.removeProductFromWarehouse);

// Роут для пошуку товарів за категорією на складі
router.get(
    '/findProductsByCategory/:category',
    WarehouseController.findProductsByCategory
);

module.exports = router;
