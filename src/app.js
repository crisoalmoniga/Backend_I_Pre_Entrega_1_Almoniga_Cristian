import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine()); // Le decimos a Express que use Handlebars
app.set('view engine', 'handlebars'); // Definir Handlebars como motor de vistas
app.set('views', __dirname + '/views'); // Especificamos la carpeta donde estarán las vistas

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/static', express.static(__dirname + '/public'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// WebSockets: Manejar conexiones
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('newProduct', async () => {
        const products = await productManagerInstance.leerProductos();
        io.emit('updateProducts', products);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


// Inicialización del servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});