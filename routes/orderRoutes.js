const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// Роут для створення нового замовлення
router.post('/create', OrderController.createOrder);

// Роут для отримання всіх замовлень
router.get('/all', OrderController.getAllOrders);

// Роут для видалення замовлення за ідентифікатором
router.delete('/:id/delete', OrderController.deleteOrderById);

// Роут для додавання товару до замовлення
router.post('/:id/add-product', OrderController.addProductToOrder);

// Оновлення замовлення за ідентифікатором
router.put('/orders/:id', OrderController.updateOrder);

router.get('/orders-with-products', OrderController.getOrdersWithProducts);

module.exports = router;
