import { Router } from 'express';
import ProductManager from '../fileManager/productManagerMemory.js';
import { io } from '../app.js';  // Importar io para emitir eventos de WebSocket

const router = Router();
const productManagerInstance = new ProductManager();

// GET / - Devuelve todos los productos
router.get('/', async (req, res) => {
    const products = await productManagerInstance.leerProductos();
    res.render('index', { products });  // Renderizar la vista index.handlebars con la lista de productos
});

// POST / - Agrega un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    const newProduct = { title, description, price, code, stock, category };
    await productManagerInstance.crearProducto(newProduct);

    // Emitir evento para actualizar productos en tiempo real
    io.emit('newProduct');
    
    res.status(201).json(newProduct);
});

// DELETE /:id - Elimina un producto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const products = await productManagerInstance.leerProductos();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    await productManagerInstance.escribirProductos(products);

    // Emitir evento para actualizar productos en tiempo real
    io.emit('deleteProduct');
    
    res.json({ message: 'Producto eliminado exitosamente' });
});

export default router;