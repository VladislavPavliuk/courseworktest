const mongoose = require('mongoose');
const ProductModel = require('./Product').ProductModel; // Імпорт моделі продукту

// Клас для складу
class Warehouse {
    constructor(name) {
        this._name = name;
        this._products = []; // Початково порожній масив продуктів
    }

    // Метод для додавання продукту на склад
    async addProduct(productId) {
        try {
            const product = await ProductModel.findById(productId);
            if (product) {
                this._products.push(product);
                console.log(`Продукт ${product.name} додано на склад.`);
            } else {
                console.log('Продукт не знайдено.');
            }
        } catch (error) {
            console.error('Помилка при додаванні продукту:', error);
        }
    }

    // Метод для видалення продукту зі складу
    async removeProduct(productId) {
        const productIndex = this._products.findIndex(
            (p) => p.id === productId
        );
        if (productIndex !== -1) {
            this._products.splice(productIndex, 1);
            console.log('Продукт видалено зі складу.');
        } else {
            console.log('Продукт на складі не знайдено.');
        }
    }

    // Метод для виведення інформації про всі продукти на складі
    listProducts() {
        if (this._products.length === 0) {
            console.log('На складі немає продуктів.');
        } else {
            this._products.forEach((product) => {
                console.log(
                    `Продукт: ${product.name}, Кількість: ${product.quantity}`
                );
            });
        }
    }

    // Геттери та сеттери
    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }

    get products() {
        return this._products;
    }
}

// Схема для MongoDB
const WarehouseSchema = new mongoose.Schema({
    name: String,
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
        },
    ],
});

const WarehouseModel = mongoose.model('Warehouse', WarehouseSchema);

module.exports = { Warehouse, WarehouseModel };
