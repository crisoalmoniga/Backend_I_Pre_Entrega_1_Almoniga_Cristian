import { Router } from 'express';

const router = Router();

// Array temporal para carritos
let carts = [];

// POST /api/carts - Crea un nuevo carrito
router.post('/', (req, res) => {
    const newCart = {
        id: carts.length + 1,
        products: [],
    };

    carts.push(newCart);
    res.status(201).json(newCart);
});

export default router;