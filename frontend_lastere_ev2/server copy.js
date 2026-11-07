
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
    { id: 3, codigo: "PRD-003", nombre: "Licencia Anual LASTERE", categoria: "Licencias", cantidad: 15, precio: 500000 }
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

// 3. ELIMINAR (DELETE): Borrar un producto por su índice o id
// 3. ELIMINAR (DELETE): Borrar un producto por su código
app.delete('/api/productos/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    productos = productos.filter(p => p.codigo !== codigo);
    res.json({ mensaje: "Producto eliminado con éxito" });
});