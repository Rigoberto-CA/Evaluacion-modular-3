console.log("Pudutech trabajando");
/*
--------------------------------------
Configuración
--------------------------------------
*/

const sinIVA = 0.81;
const IVA = 0.19;

/*
--------------------------------------
Datos semilla
--------------------------------------
*/
const productos = [
    {
        id: crypto.randomUUID(),
        nombre: "Audífonos inalámbricos ARX DNC-6603",
        categoria: "Audífonos",
        precio: 15990,
        stock: 15
    },
    {
        id: crypto.randomUUID(),
        nombre: "Batería acústica TAMA Stagestar ST52H5 5 piezas - SCP",
        categoria: "Percusión",
        precio: 529990,
        stock: 5
    },
    {
        id: crypto.randomUUID(),
        nombre: "Guitarra eléctrica Ibanez GRX20 - White",
        categoria: "Guitarras",
        precio: 184990,
        stock: 7
    },
    {
        id: crypto.randomUUID(),
        nombre: "Bajo eléctrico Ibanez GSR185 - Jewel Blue",
        categoria: "Bajos",
        precio: 298990,
        stock: 5
    },
    {
        id: crypto.randomUUID(),
        nombre: "Micrófono Condensador Behringer C-1",
        categoria: "Accesorio",
        precio: 72990,
        stock: 6
    },
    {
        id: crypto.randomUUID(),
        nombre: "Mixer Allen & Heath ZED6",
        categoria: "Mixer",
        precio: 185990,
        stock: 3
    },
];

const venta = [];

/*
--------------------------------------
herramientas de venta
--------------------------------------
*/
const formateoPrecio = (precio) => {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0
    }).format(precio);
}

const calcularTotal = () => {
    return venta.reduce((accum, item) => {
        const productoElegido = productos.find(producto => producto.id === item.idProducto);
        return accum + (productoElegido.precio * item.cantidad);
    }, 0)
}

const calcularSubtotal = () => {
    const total = calcularTotal();
    return sinIVA * total
}

const calcularIVA = () => {
    const total = calcularTotal();
    return IVA * total
}

const actualizarTotales = () => {
    const totalVenta = calcularTotal()
    const subtotalSinIVA = calcularSubtotal();
    const subtotalIVA = calcularIVA()

    document.querySelector('#totalSuma').textContent = formateoPrecio(totalVenta)
    document.querySelector("#subtotalSinIVA").textContent = formateoPrecio(subtotalSinIVA);
    document.querySelector("#subtotalIVA").textContent = formateoPrecio(subtotalIVA);
}

const crearProducto = (nombre, categoria, precio, stock) => {
    const producto = {
        id: crypto.randomUUID(),
        nombre,
        categoria, 
        precio: parseInt(precio), 
        stock: parseInt(stock)
    }

    productos.push(producto)
}

let idProductoEditado = null;

const editarProducto = (id, nombre, categoria, precio, stock) => {
    const indiceProducto = productos.findIndex(producto => producto.id === id)

    if(indiceProducto !== -1){
        productos[indiceProducto] = {
            id,
            nombre,
            categoria,
            precio,
            stock
        }
    }
}

const agregarAVenta = (idProducto) => {
    const productoElegido = productos.find(producto => producto.id === idProducto);
    
    if(productoElegido.stock === 0) alert("Producto sin stock");

    const productoVenta = venta.find(producto => producto.idProducto === idProducto);

    if(!productoVenta && productoElegido.stock > 0){
        venta.push({idProducto, cantidad: 1});
    } else {
        if(productoVenta.cantidad < productoElegido.stock) productoVenta.cantidad += 1;
        if(productoVenta.cantidad === productoElegido.stock) alert("Producto sin más stock");
    }
}

const disminuirCantidad = (idProducto) => {
    const producto = venta.find(objeto => objeto.idProducto === idProducto);

    producto.cantidad -= 1;
    if(producto.cantidad <= 0) {
        const indiceProducto = venta.findIndex(objeto => objeto.idProducto === idProducto);
        venta.splice(indiceProducto, 1);
    }
}

const incrementarCantidad = (idProducto) => {
    const producto = productos.find(objeto => objeto.id === idProducto);
    const productoVenta = venta.find(objeto => objeto.idProducto === idProducto);

    if(productoVenta.cantidad < producto.stock){
        productoVenta.cantidad += 1; //revisar al final si sirve reemplazar con ++
    } else {
        alert("Producto sin stock");
    }
}

const removerProducto = (idProducto) => {
    const indiceVenta = venta.findIndex(objeto => objeto.idProducto === idProducto);
    if(indiceVenta !== -1){
        venta.splice(indiceVenta, 1);
    }
}
/*
--------------------------------------
Referencias del DOM
--------------------------------------
*/

const productosTbody = document.querySelector("#productosTbody");
const carroVentas = document.querySelector("#carroVentas");

const formularioCrearCambiar = document.querySelector("#formularioCrearCambiar");
const tituloCrearCambiar = document.querySelector("#tituloCrearCambiar");
const campoNombre = document.querySelector("#campoNombre");
const campoCategoria = document.querySelector("#campoCategoria");
const campoPrecio = document.querySelector("#campoPrecio");
const campoStock = document.querySelector("#campoStock");
const btnActualizar = document.querySelector("#btnActualizar");
const btnCancelar = document.querySelector("#btnCancelar");

/*
--------------------------------------
creación de los HTML a insertar
--------------------------------------
*/

const crearTablaDeProductos = () => {
    const tablaDelArreglo = productos.map(
        (producto) => `
        <tr>
            <th scope="row">${producto.id.slice(0, 8)}</th>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${formateoPrecio(producto.precio)}</td>
            <td>${producto.stock}</td>
            <td id="acciones">
                <div class="btn-group btn-group-sm" role="group">
                    <button id="agregarVenta" 
                        data-action="agregarVenta" 
                        data-id="${producto.id}" 
                        class="btn btn-primary"
                        data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" 
                        data-bs-title="Agregar a venta">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    <button id="editar" 
                        data-action="editarProducto" 
                        data-id="${producto.id}" 
                        class="btn btn-info"
                        data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" 
                        data-bs-title="Editar producto"><i class="fa-solid fa-file-pen"></i></button>
                    <button id="removerVenta" 
                        data-action="remover" 
                        data-id="${producto.id}" 
                        class="btn btn-danger"
                        data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" 
                        data-bs-title="Quitar de la venta"><i class="fa-regular fa-circle-xmark"></i></button>
                </div>
            </td>
        </tr>`,  /*  <= Insertar HTML de la tabla de los objetos*/
    )
    return(tablaDelArreglo.join(""));
}

const crearCarroVenta = () => {
    const listaVenta = venta.map(objeto => {
        const productoVenta = productos.find(producto => producto.id === objeto.idProducto);

        const htmlStringVenta = `
        <li class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
                <div class="me-2">
                    <div class="fw-semibold">${productoVenta.nombre}</div>
                    <div class="text-muted small">${productoVenta.categoria} - ${formateoPrecio(productoVenta.precio)}</div>
                    <div class="text-muted small">${formateoPrecio(productoVenta.precio * objeto.cantidad)}</div>
                </div>
                
                <div class="d-flex flex-column align-items-end gap-1">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" 
                            data-action="disminuirCantidad" 
                            data-id="${productoVenta.id}">-</button>
                        <button class="btn btn-outline-secondary" disabled>${objeto.cantidad}</button>
                        <button class="btn btn-outline-secondary" 
                            data-action="incrementarCantidad" 
                            data-id="${productoVenta.id}">+</button>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" 
                        data-action="removerDeVenta" 
                        data-id="${productoVenta.id}">Quitar</button>
                </div>
            </div>
        </li>`
        return htmlStringVenta;
    });
    return listaVenta.join("");
}

/*
--------------------------------------
HTML dinámico
--------------------------------------
*/

const renderHTMLstring = (htmlString, container) => {
    container.innerHTML = htmlString
}

const renderProducts = () => {
    const tablaProductos = crearTablaDeProductos();
    renderHTMLstring(tablaProductos, productosTbody);
}

renderProducts()

const cargarFormulario = (idProducto) => {
    const producto = productos.find(producto => producto.id === idProducto)
    
    if(producto) {
        campoNombre.value = producto.nombre;
        campoCategoria.value = producto.categoria;
        campoPrecio.value = producto.precio;
        campoStock.value = producto.stock;
        idProductoEditado = idProducto;
        tituloCrearCambiar.innerText = "Editando producto";
        btnActualizar.innerText = "Actualizar";
        btnCancelar.disabled = false;
    }
}

const limpiarCampos = () => {
    formularioCrearCambiar.reset();
    idProductoEditado = null;
    tituloCrearCambiar.innerText = "Agregar a inventario";
    btnActualizar.innerText = "Guardar";
    btnCancelar.disabled = true;
}

/*
--------------------------------------
listeners
--------------------------------------
*/

productosTbody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    const action = button.dataset.action
    const id = button.dataset.id
    if(action === "agregarVenta") {
        agregarAVenta(id);
        renderHTMLstring(crearCarroVenta(), carroVentas);
        actualizarTotales();
        return;
    }
    if(action === "editarProducto") {
        cargarFormulario(id)
    }
    if(action === "remover"){
        removerProducto(id);
        renderHTMLstring(crearCarroVenta(), carroVentas);
        actualizarTotales();
    }
});

carroVentas.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    const action = button.dataset.action;
    const id = button.dataset.id;

    if(action === 'disminuirCantidad') {
        disminuirCantidad(id);
        renderHTMLstring(crearCarroVenta(), carroVentas);
        //updateCartTotals();
        return;
    }

    if(action === 'incrementarCantidad') {
        incrementarCantidad(id);
        renderHTMLstring(crearCarroVenta(), carroVentas);
        //updateCartTotals();
        return
    }

    if(action === "removerDeVenta") {
        removerProducto(id);
        renderHTMLstring(crearCarroVenta(), carroVentas);
        //updateCartTotals();
        return
    }
});

formularioCrearCambiar.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const nombre = campoNombre.value.trim();
    const categoria = campoCategoria.value.trim();
    const precio = campoPrecio.value
    const stock = campoStock.value

    if(!nombre || !categoria || !precio || !stock){
        alert("Completa todos los campos, por favor");
        return;
    } 
    if(idProductoEditado){
        editarProducto(idProductoEditado, nombre, categoria, precio, stock);
        alert(`${nombre} editado con éxito`)
    } else {
        crearProducto(nombre, categoria, precio, stock);
        alert("Producto agregado al inventario")
    }
    renderProducts();
    limpiarCampos();
});

btnCancelar.addEventListener("click", () => {
    const confirmarCancelar = confirm("Estás a punto de cancelar la edición");
    if(confirmarCancelar){
        limpiarCampos();
    }
});
// Herramientas para tooltips de bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));