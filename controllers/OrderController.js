const {
    ElectronicOrder,
    SportingGoodsOrder,
    OrderModel,
} = require('../models/Order');
const { WarehouseModel } = require('../models/Warehouse'); // Переконайтеся, що ви імпортували модель складу

class OrderController {
    // Контролер для створення нового замовлення (з перевіркою)
    static async createOrder(req, res) {
        try {
            const {
                products,
                customerName,
                totalAmount,
                deliveryAddress,
                deliveryDate,
                category,
            } = req.body;

            let newOrderData;

            switch (category) {
                case 'Електроніка':
                    const electronicOrder = new ElectronicOrder(
                        products,
                        customerName,
                        totalAmount,
                        deliveryAddress
                    );
                    newOrderData = electronicOrder.toObject();
                    break;
                case 'Спортивні товари':
                    const sportingGoodsOrder = new SportingGoodsOrder(
                        products,
                        customerName,
                        totalAmount,
                        deliveryDate
                    );
                    newOrderData = sportingGoodsOrder.toObject();
                    break;
                default:
                    return res.status(400).json({
                        message: 'Непідтримувана категорія замовлення',
                    });
            }

            const savedOrder = await OrderModel.create(newOrderData);
            res.status(201).json({
                message: 'Замовлення створено',
                order: savedOrder,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при створенні замовлення',
            });
        }
    }

    // Контролер для отримання всіх замовлень
    static async getAllOrders(req, res) {
        try {
            const orders = await OrderModel.find().populate('products.product');
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при отриманні замовлень',
            });
        }
    }

    // Контролер для видалення замовлення за ідентифікатором
    static async deleteOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const order = await OrderModel.findByIdAndDelete(orderId);

            if (!order) {
                return res
                    .status(404)
                    .json({ message: 'Замовлення не знайдено' });
            }

            res.status(200).json({ message: 'Замовлення видалено' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при видаленні замовлення',
            });
        }
    }

    // Контролер для додавання товару до замовлення
    static async addProductToOrder(req, res) {
        try {
            const { orderId, productId, quantityToAdd } = req.body;

            // Знаходимо замовлення
            const order = await OrderModel.findById(orderId);
            if (!order) {
                return res
                    .status(404)
                    .json({ message: 'Замовлення не знайдено' });
            }

            // Знаходимо склад
            const warehouse = await WarehouseModel.findOne();
            if (!warehouse) {
                return res.status(404).json({ message: 'Склад не знайдено' });
            }

            // Перевірка наявності товару на складі
            const productOnWarehouseIndex = warehouse.products.findIndex((p) =>
                p.productId.equals(productId)
            );
            if (
                productOnWarehouseIndex === -1 ||
                warehouse.products[productOnWarehouseIndex].quantity <
                    quantityToAdd
            ) {
                return res
                    .status(400)
                    .json({ message: 'Недостатня кількість товару на складі' });
            }

            // Зменшення кількості товару на складі
            warehouse.products[productOnWarehouseIndex].quantity -=
                quantityToAdd;
            await warehouse.save();

            // Додавання або оновлення товару в замовленні
            const productInOrderIndex = order.products.findIndex((p) =>
                p.product.equals(productId)
            );
            if (productInOrderIndex !== -1) {
                order.products[productInOrderIndex].quantity += quantityToAdd;
            } else {
                order.products.push({
                    product: productId,
                    quantity: quantityToAdd,
                });
            }
            await order.save();

            res.status(200).json({
                message: 'Товар додано до замовлення',
                order,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при додаванні товару до замовлення',
            });
        }
    }

    static async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const updateData = req.body;

            const order = await OrderModel.findById(orderId);
            if (!order) {
                return res
                    .status(404)
                    .json({ message: 'Замовлення не знайдено' });
            }

            // Оновлення полів замовлення
            for (let key in updateData) {
                order[key] = updateData[key];
            }

            await order.save();
            res.status(200).json({ message: 'Замовлення оновлено', order });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при оновленні замовлення',
            });
        }
    }

    // Контролер для перегляду замовлень, в які додано товар
    static async getOrdersWithProducts(req, res) {
        try {
            // Знайти замовлення, де масив products не порожній
            const ordersWithProducts = await OrderModel.find({
                'products.0': { $exists: true },
            }).populate('products.product');

            if (!ordersWithProducts.length) {
                return res
                    .status(404)
                    .json({ message: 'Замовлення з товарами не знайдено' });
            }

            res.status(200).json(ordersWithProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при отриманні замовлень з товарами',
            });
        }
    }
}

module.exports = OrderController;
