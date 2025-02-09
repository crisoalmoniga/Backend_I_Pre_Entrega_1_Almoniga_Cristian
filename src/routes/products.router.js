import { Router } from 'express';
import ProductManager from '../fileManager/productManagerMemory.js';
import { io } from '../app.js';  // Importamos io desde app.js para emitir eventos de WebSocket

const router = Router();
const productManagerInstance = new ProductManager();

// GET /realtimeproducts - Renderiza la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await productManagerInstance.leerProductos();
    res.render('realTimeProducts', { products });
});

// POST / - Agrega un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    const newProduct = { title, description, price, code, stock, category };
    await productManagerInstance.crearProducto(newProduct);

    // Emitir el evento con la lista actualizada
    const products = await productManagerInstance.leerProductos();
    io.emit('updateProducts', products);

    res.status(201).json(newProduct);
});

export default router;