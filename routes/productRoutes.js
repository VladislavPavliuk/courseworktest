const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Роут для створення нового товару
router.post('/create', ProductController.createProduct);

// Роут для отримання всіх товарів
router.get('/all', ProductController.getAllProducts);

// Роут для отримання товару за ідентифікатором
router.get('/:id', ProductController.getProductById);

// Роут для зменшення кількості товару за ідентифікатором
router.delete('.decrease/:id', ProductController.deleteProductById);

// Роут для оновлення товару за ідентифікатором
// router.put('/:id/update', ProductController.updateProductById);

// Роут для збільшення кількості товару за його ідентифікатором
router.put('/increase/:id', ProductController.increaseProductQuantity);

// Роут для видалення товару повністю за його ідентифікатором
router.delete('/delete/:id', ProductController.deleteProductCompletely);

module.exports = router;
