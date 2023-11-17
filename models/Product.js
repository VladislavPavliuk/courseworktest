const mongoose = require('mongoose');

// Базовий клас для продукту
class Product {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity || 0;
    }
}

// Клас для категорії "Електроніка"
class ElectronicsProduct extends Product {
    constructor(name, price, quantity, subcategory) {
        super(name, price, quantity);
        this.category = 'Електроніка';
        this.subcategory = subcategory;
    }
}

// Класи для підкатегорій "Смартфони", "Планшети", "Ноутбуки"
class Smartphone extends ElectronicsProduct {
    constructor(name, price, quantity, model) {
        super(name, price, quantity, 'Смартфони');
        this.model = model;
    }
}

class Tablet extends ElectronicsProduct {
    constructor(name, price, quantity, platform) {
        super(name, price, quantity, 'Планшети');
        this.platform = platform;
    }
}

class Laptop extends ElectronicsProduct {
    constructor(name, price, quantity, type) {
        super(name, price, quantity, 'Ноутбуки');
        this.type = type;
    }
}

// Клас для категорії "Спортивні товари"
class SportingGoodsProduct extends Product {
    constructor(name, price, quantity, subcategory) {
        super(name, price, quantity);
        this.category = 'Спортивні товари';
        this.subcategory = subcategory;
    }
}

// Класи для підкатегорій "Фітнес-обладнання", "Спортивний одяг"
class FitnessEquipment extends SportingGoodsProduct {
    constructor(name, price, quantity, type) {
        super(name, price, quantity, 'Фітнес-обладнання');
        this.type = type;
    }
}

class SportsApparel extends SportingGoodsProduct {
    constructor(name, price, quantity, style) {
        super(name, price, quantity, 'Спортивний одяг');
        this.style = style;
    }
}

// Модель для БД
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    model: String,
    platform: String,
    type: String,
    style: String,
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = {
    Smartphone,
    Tablet,
    Laptop,
    FitnessEquipment,
    SportsApparel,
    ProductModel,
};
