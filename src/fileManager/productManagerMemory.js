class ProductManager {
    constructor() {
        this.products = []; // Array en memoria para almacenar los productos
    }

    async crearProducto(producto) {
        try {
            producto.id = this.products.length + 1; // Generar ID único
            this.products.push(producto);
            console.log('Producto creado exitosamente:', producto);
            return producto;
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw error;
        }
    }

    async leerProductos() {
        try {
            return this.products; // Devolver el array de productos
        } catch (error) {
            console.error('Error al leer los productos:', error);
            throw error;
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            const index = this.products.findIndex(prod => prod.id === id);
            if (index === -1) throw new Error('Producto no encontrado');

            this.products[index] = { ...this.products[index], ...productoActualizado };
            console.log('Producto actualizado:', this.products[index]);
            return this.products[index];
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async eliminarProducto(id) {
        try {
            const index = this.products.findIndex(prod => prod.id === id);
            if (index === -1) throw new Error('Producto no encontrado');

            const eliminado = this.products.splice(index, 1);
            console.log('Producto eliminado:', eliminado[0]);
            return eliminado[0];
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
}

export default ProductManager; // Exportar la clase como ProductManager