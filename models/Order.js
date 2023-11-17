const mongoose = require('mongoose');

// Базовий клас для замовлення
class Order {
    constructor(products, customerName, totalAmount) {
        this.products = products;
        this.customerName = customerName;
        this.totalAmount = totalAmount;
    }

    toObject() {
        return {
            products: this.products,
            customerName: this.customerName,
            totalAmount: this.totalAmount,
            category: this.category,
            deliveryAddress: this.deliveryAddress,
            deliveryDate: this.deliveryDate,
        };
    }
}

// Клас для замовлень категорії "Електроніка"
class ElectronicOrder extends Order {
    constructor(products, customerName, totalAmount, deliveryAddress) {
        super(products, customerName, totalAmount);
        this.category = 'Електроніка';
        this.deliveryAddress = deliveryAddress;
    }
    toObject() {
        let baseObject = super.toObject();
        baseObject.category = 'Електроніка';
        return baseObject;
    }
}

// Клас для замовлень категорії "Спортивні товари"
class SportingGoodsOrder extends Order {
    constructor(products, customerName, totalAmount, deliveryDate) {
        super(products, customerName, totalAmount);
        this.category = 'Спортивні товари';
        this.deliveryDate = deliveryDate;
    }
    toObject() {
        let baseObject = super.toObject();
        baseObject.category = 'Спортивні товари';
        return baseObject;
    }
}

// Модель замовлення, яку ви можете використовувати у вашому додатку
const OrderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
        },
    ],
    customerName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    category: { type: String, required: true },
    deliveryAddress: String,
    deliveryDate: Date,
    status: { type: String, default: 'в обробці' }, // Доданий атрибут статусу
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = {
    ElectronicOrder,
    SportingGoodsOrder,
    OrderModel,
};
