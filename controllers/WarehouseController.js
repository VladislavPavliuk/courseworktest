const { WarehouseModel } = require('../models/Warehouse');
const ProductModel = require('../models/Product').ProductModel;

class WarehouseController {
    // Контролер для додавання товару на склад
    static async addProductToWarehouse(req, res) {
        try {
            const { productId, quantityToAdd } = req.body;
            let warehouse = await WarehouseModel.findOne();

            if (!warehouse) {
                // Створення нового складу, якщо він не знайдений
                warehouse = new WarehouseModel({
                    /* ініціалізаційні дані */
                });
                await warehouse.save();
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            if (quantityToAdd > product.quantity) {
                return res
                    .status(400)
                    .json({ message: 'Недостатня кількість товару' });
            }

            product.quantity -= quantityToAdd;
            await product.save();

            const existingProductIndex = warehouse.products.findIndex((p) =>
                p.productId.equals(productId)
            );
            if (existingProductIndex !== -1) {
                warehouse.products[existingProductIndex].quantity +=
                    quantityToAdd;
            } else {
                warehouse.products.push({
                    productId: product._id,
                    quantity: quantityToAdd,
                });
            }

            await warehouse.save();
            res.status(200).json({
                message: 'Продукт додано або оновлено на складі',
                product,
                warehouse,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при додаванні продукту на склад',
            });
        }
    }

    // Контролер для виведення всіх товарів на складі
    static async getAllProducts(req, res) {
        try {
            const warehouse = await WarehouseModel.findOne().populate(
                'products.productId'
            );

            if (!warehouse) {
                return res.status(404).json({ message: 'Склад не знайдено' });
            }

            const productsInfo = warehouse.products.map((item) => ({
                id: item.productId._id,
                name: item.productId.name,
                quantityOnWarehouse: item.quantity,
                price: item.productId.price,
                category: item.productId.category,
                subcategory: item.productId.subcategory,
                // Додайте інші поля, якщо потрібно
            }));

            res.status(200).json({ products: productsInfo });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при отриманні інформації про продукти',
            });
        }
    }

    // Контролер для видалення товару зі складу
    static async removeProductFromWarehouse(req, res) {
        try {
            const { productId, quantityToRemove } = req.body;
            const warehouse = await WarehouseModel.findOne();

            if (!warehouse) {
                return res.status(404).json({ message: 'Склад не знайдено' });
            }

            const productIndex = warehouse.products.findIndex((p) =>
                p.productId.equals(productId)
            );
            if (productIndex === -1) {
                return res
                    .status(404)
                    .json({ message: 'Продукт на складі не знайдено' });
            }

            if (quantityToRemove >= warehouse.products[productIndex].quantity) {
                warehouse.products.splice(productIndex, 1);
            } else {
                warehouse.products[productIndex].quantity -= quantityToRemove;
            }

            await warehouse.save();
            res.status(200).json({
                message: 'Продукт видалено або зменшено на складі',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при видаленні продукту зі складу',
            });
        }
    }

    // Контролер для знаходження конкретної категорії товарів на складі
    static async findProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            const warehouse = await WarehouseModel.findOne().populate({
                path: 'products.productId',
                match: { 'productId.category': category },
            });

            if (!warehouse) {
                return res.status(404).json({ message: 'Склад не знайдено' });
            }

            // Фільтруємо продукти, що відповідають запитуваній категорії
            const filteredProducts = warehouse.products.filter(
                (item) => item.productId && item.productId.category === category
            );

            // Виводимо інформацію про продукти з урахуванням кількості на складі
            const productsInfo = filteredProducts.map((item) => ({
                id: item.productId._id,
                name: item.productId.name,
                quantityOnWarehouse: item.quantity,
                price: item.productId.price,
                category: item.productId.category,
                subcategory: item.productId.subcategory,
                // Інші поля, якщо необхідно
            }));

            res.status(200).json({ products: productsInfo });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при пошуку продуктів за категорією',
            });
        }
    }
}

module.exports = WarehouseController;
