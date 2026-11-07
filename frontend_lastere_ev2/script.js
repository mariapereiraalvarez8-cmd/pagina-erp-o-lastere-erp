
let productos = [];

// Función para obtener los productos desde el Servidor Backend (CONSULTA / GET)
async function cargarProductos() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        productos = await respuesta.json();
        renderizarTabla(productos);
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// Llamamos a la función al cargar la página
cargarProductos();

// Referencias a los elementos del DOM
const prodForm = document.getElementById("prodForm");
const tablaProductos = document.getElementById("tablaProductos");
const inputBuscar = document.getElementById("inputBuscar");

// Referencias a KPIs
const kpiTotalProds = document.getElementById("kpiTotalProds");
const kpiValorTotal = document.getElementById("kpiValorTotal");
const kpiStockBajo = document.getElementById("kpiStockBajo");

// Función para formatear moneda (COP)
const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
};

// Función para renderizar la tabla
function renderizarTabla(lista = productos) {
    tablaProductos.innerHTML = "";

    if (lista.length === 0) {
        tablaProductos.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay productos registrados.</td></tr>`;
        actualizarKPIs();
        return;
    }

    lista.forEach((p) => {
        const total = p.cantidad * p.precio;
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td><strong>${p.codigo}</strong></td>
            <td>${p.nombre}</td>
            <td><span class="badge">${p.categoria}</span></td>
            <td><strong style="color: ${p.cantidad <= 5 ? 'var(--danger)' : 'inherit'}">${p.cantidad}</strong></td>
            <td>${formatCOP(p.precio)}</td>
            <td><strong>${formatCOP(total)}</strong></td>
            <td>
                <button class="btn-delete" onclick="eliminarProducto('${p.codigo}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });

    actualizarKPIs();
}

// Función para actualizar KPIs
function actualizarKPIs() {
    const totalItems = productos.reduce((acc, p) => acc + p.cantidad, 0);
    const valorTotal = productos.reduce((acc, p) => acc + (p.cantidad * p.precio), 0);
    const stockBajoCount = productos.filter(p => p.cantidad <= 5).length;

    kpiTotalProds.textContent = totalItems;
    kpiValorTotal.textContent = formatCOP(valorTotal);
    kpiStockBajo.textContent = stockBajoCount;
}

// Manejar el evento Submit del formulario para enviar datos al Servidor (CREAR / POST)
prodForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoProd = {
        codigo: document.getElementById("codigo").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        categoria: document.getElementById("categoria").value,
        cantidad: parseInt(document.getElementById("cantidad").value),
        precio: parseFloat(document.getElementById("precio").value)
    };

    try {
        const respuesta = await fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProd)
        });

        const resultado = await respuesta.json();
        console.log(resultado.mensaje);

        // Volvemos a cargar los productos desde el servidor para actualizar la tabla y KPIs
        await cargarProductos();
        
        // Limpiamos el formulario
        prodForm.reset();
    } catch (error) {
        console.error("Error al guardar el producto:", error);
    }
});

// Función para eliminar producto en el Servidor (ELIMINAR / DELETE)
window.eliminarProducto = async function(codigo) {
    if (confirm("¿Estás seguro de eliminar este registro del inventario?")) {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/productos/${codigo}`, {
                method: 'DELETE'
            });

            const resultado = await respuesta.json();
            console.log(resultado.mensaje);

            // Volvemos a cargar los productos desde el servidor para actualizar la tabla y KPIs
            await cargarProductos();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }
};

// Filtro de búsqueda en tiempo real
inputBuscar.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(termino) || 
        p.codigo.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
    );
    renderizarTabla(filtrados);
});

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
    renderizarTabla();
});