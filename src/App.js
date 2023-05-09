const express = require('express');
const ProductManager = require('./ProductManager');

const pm = new ProductManager('./products.txt');
const app = express();

app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await pm.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await pm.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
