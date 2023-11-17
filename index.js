// Підключення Express
const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

const PORT = process.env.PORT ?? 3000;

const app = express();

mongoose
    .connect(
        'mongodb+srv://pavlukvladuslav147:jd0YbN5sw0LIEAjh@cluster0.aysixev.mongodb.net/'
    )
    .then(() => {
        console.log('DB: ok');
    })
    .catch((err) => console.log('DB error', err));

app.use(express.json());

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/warehouse', warehouseRoutes);

app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});
