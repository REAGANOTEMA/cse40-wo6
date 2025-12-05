const express = require('express');
const app = express();
const reviewRoutes = require('./routes/reviewroute');
const productRoutes = require('./routes/productroute');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/reviews', reviewRoutes);
app.use('/products', productRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
