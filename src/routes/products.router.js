import { Router } from 'express';

const router = Router();

// Array temporal para productos
let products = [];

// GET /api/products - Devuelve todos los productos
router.get('/', (req, res) => {
    res.json(products);
});

// POST /api/products - Agrega un nuevo producto
router.post('/', (req, res) => {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newProduct = {
        id: products.length + 1,
        title,
        description,
        price,
        code,
        stock,
        category,
        thumbnails: req.body.thumbnails || [],
        status: true,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

export default router;