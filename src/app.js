import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicialización del servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`LA COSA ANDA EN EL PUERTO ${PORT}`);
});
