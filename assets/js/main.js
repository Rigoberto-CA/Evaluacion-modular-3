console.log("Pudutech trabajando");
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

const venta = []

/*
--------------------------------------
Referencias del DOM
--------------------------------------
*/

const productosTbody = document.querySelector("#productosTbody");
const carroVentas = document.querySelector("#carroVentas");
const agregarVentaBtn = document.querySelector("#agregarVenta");
const removerVenteBtn = document.querySelector("#removerVenta");

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

const agregarAVenta = (idProducto) => {
    const productoElegido = productos.find(producto => producto.id === idProducto);
    console.log(productoElegido);
    if(productoElegido.stock === 0){
        alert("Producto sin stock");
        return;
    }

    const productoVenta = venta.find(producto => producto.id === idProducto);

    if(!productoVenta){
        if(productoElegido.stock > 0) venta.push({idProducto, cantidad: 1});
    } else {
        if(productoVenta.cantidad < productoElegido.stock) productoVenta.cantidad += 1;
        if(productoVenta.cantidad === productoElegido.stock) alert("Producto sin stock");
    }
    console.log(productoElegido.stock)
}


const disminuirCantidad = (idProducto) => {
    const producto = venta.find(objeto => objeto.idProducto === idProducto);

    producto.cantidad -= 1;
    if(producto.cantidad <= 0) {
        const indiceProducto = venta.find(objeto => objeto.idProducto === idProducto);
        venta.splice(indiceProducto, 1);
    }
}

const incCantidad = (idProducto) => {
    const producto = productos.find(objeto => objeto.id === idProducto);
    const productoVenta = venta.find(objeto => objeto.idProducto === idProducto);

    if(productoVenta.cantidad < producto.stock){
        productoVenta.cantidad += 1;
    } else {
        alert("Producto sin stock");
    }
}

const removerProducto = (id) => {
    const indiceVenta = venta.findIndex(objeto => objeto.idProducto === id);
    if(indiceVenta !== -1){
        venta.splice(indiceVenta, 1);
    }
}
/*
--------------------------------------
creación de los HTML a insertar
--------------------------------------
*/

const crearTablaDeProductos = () => {
    const tablaDelArreglo = productos.map((producto) => 
        `<tr>
            <th scope="row">${producto.id.slice(0, 8)}</th>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
            <td id="acciones" class="d-flex justify-content-evenly">
                <button id="agregarVenta" 
                    data-action="agregar" 
                    data-id="${producto.id} 
                    class="d-flex justify-content-center">+</button>
                <button id="removerVenta" 
                    data-action="remover" 
                    data-id="${producto.id} 
                    class="d-flex justify-content-center">x</button>
            </td>
        </tr>`  /*  <= Insertar HTML de la tabla de los objetos*/ ,
    )
    return(tablaDelArreglo.join());
}

const crearCarroVenta = () => {
    const listaVenta = venta.map(objeto => {
        const productoVenta = productos.find(producto => producto.id === objeto.id);

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
                            data-action="descQuantity" 
                            data-id="${productoVenta.id}">-</button>
                        <button class="btn btn-outline-secondary" disabled>${objeto.cantidad}</button>
                        <button class="btn btn-outline-secondary" 
                            data-action="incQuantity" 
                            data-id="${productoVenta.id}">+</button>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" data-action="removeCartItem" data-id="${productoVenta.id}">Quitar</button>
                </div>
            </div>
        </li>`
        return htmlStringVenta;
    });
    console.log(htmlStringVenta);
    return listaVenta;
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

/*
--------------------------------------
listeners
--------------------------------------
*/

productosTbody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    const action = button.dataset.action
    const id = button.dataset.id

    if(action === "agregar") {
        agregarAVenta(id);
        renderHTMLstring(crearCarroVenta(), carroVentas);
        updateCartTotals();
        return;
    }

});

carroVentas.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    const action = button.dataset.action;
    const id = button.dataset.id;

    if(action === 'disminuirCantidad') {
        disminuirCantidad(id);
        renderHTMLstring(createCartHTML(), carroVentas);
        updateCartTotals();
        return;
    }

    if(action === 'incQuantity') {
        incQuantity(id);
        renderHTMLstring(createCartHTML(), carroVentas);
        updateCartTotals();
        return
    }

    if(action === "removeCartItem") {
        deleteProduct(id);
        renderHTMLstring(createCartHTML(), carroVentas);
        updateCartTotals();
        return
    }
});
