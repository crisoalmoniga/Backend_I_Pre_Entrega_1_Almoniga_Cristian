import { Router } from 'express';


const router = Router();

// Array temporal para carritos
let carts = [];

// GET /api/carts - Devuelve todos los carritos
router.get('/', (req, res) => {
    res.json(carts);
});

// GET /api/carts/:id - Devuelve un carrito específico por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const cart = carts.find((c) => c.id === parseInt(id));

    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json(cart);
});

// POST /api/carts - Crea un nuevo carrito
router.post('/', (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: 'Debe incluir un array de productos' });
    }

    const newCart = {
        id: carts.length + 1,
        products, // [{ productId, quantity }]
    };

    carts.push(newCart);
    res.status(201).json(newCart);
});

// PUT /api/carts/:id - Actualiza un carrito existente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { products } = req.body;

    const cartIndex = carts.findIndex((c) => c.id === parseInt(id));

    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: 'Debe incluir un array de productos' });
    }

    // Actualizamos los productos del carrito
    carts[cartIndex].products = products;

    res.json(carts[cartIndex]);
});

// DELETE /api/carts/:id - Elimina un carrito
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const cartIndex = carts.findIndex((c) => c.id === parseInt(id));

    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    carts.splice(cartIndex, 1);

    res.json({ message: 'Carrito eliminado exitosamente' });
});

export default router;