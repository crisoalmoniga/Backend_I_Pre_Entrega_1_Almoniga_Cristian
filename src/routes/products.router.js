import { Router } from 'express';

const router = Router();

// Array temporal para productos
let products = [];

// GET /api/products - Devuelve todos los productos
router.get('/', (req, res) => {
    res.json(products);
});

// GET /api/products/:id - Devuelve un producto específico por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
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

// PUT /api/products/:id - Actualiza un producto existente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, price, code, stock, category, thumbnails, status } = req.body;

    const productIndex = products.findIndex((p) => p.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizamos los campos del producto
    products[productIndex] = {
        ...products[productIndex],
        title,
        description,
        price,
        code,
        stock,
        category,
        thumbnails,
        status,
    };

    res.json(products[productIndex]);
});

// DELETE /api/products/:id - Elimina un producto
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const productIndex = products.findIndex((p) => p.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);

    res.json({ message: 'Producto eliminado exitosamente' });
});

export default router;