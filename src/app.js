import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from './fileManager/productManagerMemory.js'; // Importar ProductManager

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
const productManagerInstance = new ProductManager(); // Crear instancia de ProductManager

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/static', express.static(__dirname + '/public'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    const products = await productManagerInstance.leerProductos();
    res.render('realTimeProducts', { products });
});

// WebSockets: Manejar conexiones
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    const emitirProductosActualizados = async () => {
        const products = await productManagerInstance.leerProductos();
        io.emit('updateProducts', products);
    };

    socket.on('newProduct', async () => {
        await emitirProductosActualizados();
    });

    socket.on('deleteProduct', async () => {
        await emitirProductosActualizados();
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Exportar io para su uso en otros módulos
export { io };

// Inicialización del servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});