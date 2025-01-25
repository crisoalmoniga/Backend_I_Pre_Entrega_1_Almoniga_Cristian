import fs from 'fs';

class ProductManager {
    constructor() {
        // Define la ruta del archivo donde se almacenarán los productos
        this.filePath = './products.json';
    }

    /**
     * Crear un nuevo producto y guardarlo en el archivo
     * @param {Object} product - Producto a agregar
     */
    async crearProducto(product) {
        try {
            // Leer los productos existentes del archivo
            let productos = await this.leerProductos();

            // Generar un ID único para el nuevo producto
            product.id = productos.length ? productos[productos.length - 1].id + 1 : 1;

            // Agregar el nuevo producto al array de productos
            productos.push(product);

            // Escribir el array actualizado en el archivo
            await fs.promises.writeFile(this.filePath, JSON.stringify(productos, null, 2));

            console.log('Producto creado exitosamente:', product); // Confirmar en consola
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
            // Leer el contenido del archivo en formato de texto
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            // Convertir el contenido del archivo en un array de objetos JSON
            return JSON.parse(data) || [];
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Retorna un array vacío si el archivo no existe
                return [];
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
            // Leer todos los productos existentes
            const productos = await this.leerProductos();

            // Buscar el índice del producto por su ID
            const index = productos.findIndex(prod => prod.id === id);
            if (index === -1) throw new Error('Producto no encontrado');

            // Actualizar los datos del producto encontrado
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
            // Leer todos los productos existentes
            const productos = await this.leerProductos();

            // Filtrar el producto a eliminar (excluirlo del nuevo array)
            const nuevoProductos = productos.filter(prod => prod.id !== id);

            // Escribir el nuevo listado actualizado en el archivo
            await fs.promises.writeFile(this.filePath, JSON.stringify(nuevoProductos, null, 2));

            console.log(`Producto con ID ${id} eliminado`); // Confirmar en consola
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
            // Leer todos los productos existentes
            const productos = await this.leerProductos();
            // Buscar el producto por su ID y devolverlo
            return productos.find(prod => prod.id === id) || null;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw error;
        }
    }
}

export default ProductManager;