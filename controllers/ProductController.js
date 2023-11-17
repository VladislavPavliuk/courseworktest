const {
    Smartphone,
    Tablet,
    Laptop,
    FitnessEquipment,
    SportsApparel,
    ProductModel,
} = require('../models/Product');

class ProductController {
    // Контролер для створення нового продукту
    static async createProduct(req, res) {
        try {
            const {
                category,
                subcategory,
                name,
                price,
                quantity,
                model,
                platform,
                type,
                style,
            } = req.body;

            let newProduct;

            switch (subcategory) {
                case 'Смартфони':
                    newProduct = new Smartphone(name, price, quantity, model);
                    break;
                case 'Планшети':
                    newProduct = new Tablet(name, price, quantity, platform);
                    break;
                case 'Ноутбуки':
                    newProduct = new Laptop(name, price, quantity, type);
                    break;
                case 'Фітнес-обладнання':
                    newProduct = new FitnessEquipment(
                        name,
                        price,
                        quantity,
                        type
                    );
                    break;
                case 'Спортивний одяг':
                    newProduct = new SportsApparel(
                        name,
                        price,
                        quantity,
                        style
                    );
                    break;
                default:
                    return res
                        .status(400)
                        .json({ message: 'Непідтримувана підкатегорія' });
            }

            const savedProduct = await ProductModel.create(newProduct);
            res.status(201).json(savedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при створенні продукту' });
        }
    }

    // Контролер для отримання всіх продуктів
    static async getAllProducts(req, res) {
        try {
            const products = await ProductModel.find();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при отриманні продуктів',
            });
        }
    }

    // Контролер для отримання продукту за його ідентифікатором
    static async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductModel.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при отриманні продукту' });
        }
    }

    // Контролер для зменшення кількості продукту за його ідентифікатором
    static async deleteProductById(req, res) {
        try {
            const productId = req.params.id;
            const quantityToDelete = req.body.quantity;

            const product = await ProductModel.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            if (quantityToDelete && quantityToDelete > product.quantity) {
                return res.status(400).json({
                    message: 'Недостатня кількість товару для видалення',
                });
            }

            if (quantityToDelete) {
                product.quantity -= quantityToDelete;
                await product.save();
                res.status(200).json({
                    message: 'Кількість продукту зменшено',
                });
            } else {
                await product.remove();
                res.status(200).json({ message: 'Продукт видалено' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при видаленні продукту' });
        }
    }

    // Контролер для збільшення кількості товару за його ідентифікатором
    static async increaseProductQuantity(req, res) {
        try {
            const productId = req.params.id;
            const quantityToAdd = req.body.quantity;

            const product = await ProductModel.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            product.quantity += quantityToAdd;
            await product.save();

            res.status(200).json({ message: 'Кількість продукту збільшено' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Помилка при збільшенні кількості продукту',
            });
        }
    }

    // Контролер для видалення товару повністю за його ідентифікатором
    static async deleteProductCompletely(req, res) {
        try {
            const productId = req.params.id;

            const product = await ProductModel.findByIdAndDelete(productId);

            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            res.status(200).json({ message: 'Продукт видалено повністю' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при видаленні продукту' });
        }
    }
}

module.exports = ProductController;
