import { Router } from 'express';
import ProductManager from '../fileManager/productManagerMemory.js';

const router = Router();
const productManagerInstance = new ProductManager();

// GET / - Devuelve todos los productos
router.get('/', async (req, res) => {
    const products = await productManagerInstance.leerProductos();
    res.render('index', { products });
});


// GET /:id - Devuelve un producto específico por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = (await productManagerInstance.leerProductos()).find((p) => p.id === parseInt(id));
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
});

// POST / - Agrega un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const newProduct = { title, description, price, code, stock, category };
    await productManagerInstance.crearProducto(newProduct);
    res.status(201).json(newProduct);
});

// PUT /:id - Actualiza un producto existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const products = await productManagerInstance.leerProductos();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    products[productIndex] = { ...products[productIndex], ...updates };
    await productManagerInstance.escribirProductos(products);
    res.json(products[productIndex]);
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
    res.json({ message: 'Producto eliminado exitosamente' });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManagerInstance.leerProductos();
    res.render('realTimeProducts', { products });
});


export default router;