import { Router } from 'express';
import ProductModel from '../models/product.model.js'; // Importamos el modelo de MongoDB

const router = Router();

//  Obtener todos los productos con paginación
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = { page: parseInt(page), limit: parseInt(limit) };

        const products = await ProductModel.paginate({}, options);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

//  Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

//  Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Producto agregado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

//  Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

//  Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;