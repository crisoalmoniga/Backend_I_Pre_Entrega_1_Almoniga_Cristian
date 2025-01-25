import { Router } from 'express';
import CartManager from '../fileManager/cartManager.js'; // Importar la clase CartManager

const router = Router();
const cartManager = new CartManager(); // Crear una instancia del CartManager

// GET /api/carts - Devuelve todos los carritos
router.get('/', (req, res) => {
    const carts = cartManager.carts; // Acceso directo a la propiedad carts
    res.json(carts); // Devuelve los carritos
});

// GET /api/carts/:id - Devuelve un carrito específico por ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id); // Asegurarse de convertir el ID a número
    const cart = cartManager.carts.find((c) => c.id === id); // Buscar el carrito
    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
    } else {
        res.json(cart); // Enviar el carrito encontrado
    }
});

// POST /api/carts - Crea un nuevo carrito
router.post('/', (req, res) => {
    const newCart = {
        id: cartManager.carts.length + 1, // Generar un ID nuevo basado en la cantidad de carritos
        products: [] // Carrito vacío al inicio
    };
    cartManager.carts.push(newCart); // Agregar el carrito a la lista
    res.status(201).json(newCart); // Enviar respuesta con el carrito creado
});

// POST /api/carts/:id/products - Agrega un producto a un carrito
router.post('/:id/products', (req, res) => {
    const id = parseInt(req.params.id);
    const { productId, quantity } = req.body;

    const cart = cartManager.carts.find((c) => c.id === id); // Buscar el carrito
    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
        return;
    }

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find((p) => p.productId === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity; // Incrementar la cantidad
    } else {
        cart.products.push({ productId, quantity }); // Agregar nuevo producto
    }

    res.json(cart); // Enviar el carrito actualizado
});

// DELETE /api/carts/:id - Elimina un carrito
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cartManager.carts.findIndex((c) => c.id === id); // Buscar índice del carrito

    if (index === -1) {
        res.status(404).json({ message: 'Carrito no encontrado' });
        return;
    }

    const deletedCart = cartManager.carts.splice(index, 1); // Eliminar el carrito
    res.json({ message: 'Carrito eliminado', cart: deletedCart[0] }); // Confirmación
});

export default router;