const express = require('express');
const app = express();
const reviewRoutes = require('./routes/reviewRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/reviews', reviewRoutes);
app.use('/products', productRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
