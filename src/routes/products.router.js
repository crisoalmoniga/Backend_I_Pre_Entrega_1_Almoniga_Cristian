import { Router } from 'express';
import ProductManager from '../fileManager/productManagerMemory.js';

const router = Router();
const productManagerInstance = new ProductManager();

// GET / - Obtiene todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManagerInstance.leerProductos();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
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

export default router;