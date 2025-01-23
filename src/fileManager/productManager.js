import fs from 'fs';

class ProductManager {

    constructor() {
        this.filePath = './products.json'; // Ruta del archivo donde se almacenarán los productos
    }

    /**
     * Crear un nuevo producto y guardarlo en el archivo
     * @param {Object} product - Producto a agregar
     */
    async crearProducto(product) {
        try {
            // Leer los productos existentes
            let productos = await this.leerProductos();

            // Generar un ID único para el nuevo producto
            product.id = productos.length ? productos[productos.length - 1].id + 1 : 1;

            // Agregar el producto al listado
            productos.push(product);

            // Escribir el archivo actualizado
            await fs.promises.writeFile(this.filePath, JSON.stringify(productos, null, 2));

            console.log('Producto creado exitosamente:', product);
        } catch (error) {
            console.error('Error al crear un producto:', error);
        }
    }

    /**
     * Leer todos los productos del archivo
     * @returns {Array} - Lista de productos
     */
    async leerProductos() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []; // Retornar un array vacío si el archivo no existe
            } else {
                console.error('Error al leer productos:', error);
                throw error;
            }
        }
    }

    /**
     * Actualizar un producto existente
     * @param {Number} id - ID del producto a actualizar
     * @param {Object} productoActualizado - Datos del producto actualizado
     */
    async actualizarProducto(id, productoActualizado) {
        try {
            const productos = await this.leerProductos();

            // Buscar el producto por ID
            const index = productos.findIndex(prod => prod.id === id);
            if (index === -1) throw new Error('Producto no encontrado');

            // Actualizar los datos del producto
            productos[index] = { ...productos[index], ...productoActualizado };

            // Guardar los cambios en el archivo
            await fs.promises.writeFile(this.filePath, JSON.stringify(productos, null, 2));

            console.log('Producto actualizado:', productos[index]);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    /**
     * Eliminar un producto por ID
     * @param {Number} id - ID del producto a eliminar
     */
    async eliminarProducto(id) {
        try {
            const productos = await this.leerProductos();

            // Filtrar el producto a eliminar
            const nuevoProductos = productos.filter(prod => prod.id !== id);

            // Guardar el nuevo listado en el archivo
            await fs.promises.writeFile(this.filePath, JSON.stringify(nuevoProductos, null, 2));

            console.log(`Producto con ID ${id} eliminado`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    /**
     * Obtener un producto por ID
     * @param {Number} id - ID del producto a buscar
     * @returns {Object} - Producto encontrado o null si no existe
     */
    async obtenerProductoPorId(id) {
        try {
            const productos = await this.leerProductos();
            return productos.find(prod => prod.id === id) || null;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw error;
        }
    }
}

export default ProductManager;