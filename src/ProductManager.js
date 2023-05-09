const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    const codeExists = products.some((p) => p.code === product.code);
    if (codeExists) {
      throw new Error('El código ya existe');
    }
    const newProduct = { ...product, id: this.generateId() };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  getProducts() {
    try {
      const productsString = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(productsString) || [];
    } catch (error) {
      console.log(`Error al leer el archivo: ${error.message}`);
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    const updatedProduct = { ...products[index], ...updatedFields };
    products.splice(index, 1, updatedProduct);
    this.saveProducts(products);
    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    products.splice(index, 1);
    this.saveProducts(products);
  }

  generateId() {
    const products = this.getProducts();
    const lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  }

  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products));
  }
}

module.exports = ProductManager;
