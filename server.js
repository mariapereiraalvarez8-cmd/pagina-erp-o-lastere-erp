
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Memoria temporal / base de datos simulada para el módulo de inventario
let productos = [
    { id: 1, codigo: "PRD-001", nombre: "Servicio Cloud ERP", categoria: "Servicios", cantidad: 10, precio: 250000 },
    { id: 2, codigo: "PRD-002", nombre: "Lector Código de Barras", categoria: "Hardware", cantidad: 3, precio: 120000 },
    { id: 3, codigo: "PRD-003", nombre: "Licencia Anual LASTERE", categoria: "Licencias", cantidad: 15, precio: 500000 },
    { id: 4, codigo: "PRD-004", nombre: "Impresora Térmica de Recibos", categoria: "Hardware", cantidad: 4, precio: 450000 },
    { id: 5, codigo: "PRD-005", nombre: "Módulo Soporte Técnico 24/7", categoria: "Servicios", cantidad: 20, precio: 180000 }

];

// 1. CONSULTAR (GET): Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// 2. INSERTAR (POST): Agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
        id: productos.length + 1,
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        categoria: req.body.categoria,
        cantidad: Number(req.body.cantidad),
        precio: Number(req.body.precio)
    };
    productos.push(nuevoProducto);
    res.json({ mensaje: "Producto guardado con éxito", producto: nuevoProducto });
});

// 3. ACTUALIZAR (PUT): Modificar un producto existente por su código
app.put('/api/productos/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const index = productos.findIndex(p => p.codigo === codigo);

    if (index !== -1) {
        productos[index] = {
            ...productos[index],
            nombre: req.body.nombre || productos[index].nombre,
            categoria: req.body.categoria || productos[index].categoria,
            cantidad: req.body.cantidad !== undefined ? Number(req.body.cantidad) : productos[index].cantidad,
            precio: req.body.precio !== undefined ? Number(req.body.precio) : productos[index].precio
        };
        res.json({ mensaje: "Producto actualizado con éxito", producto: productos[index] });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});

// 4. ELIMINAR (DELETE): Borrar un producto por su código
app.delete('/api/productos/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    productos = productos.filter(p => p.codigo !== codigo);
    res.json({ mensaje: "Producto eliminado con éxito" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});