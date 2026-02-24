console.log("Pudutech trabajando");
/*
--------------------------------------
Datos semilla
--------------------------------------
*/
const productos = [
    {
        id: crypto.randomUUID(),
        name: "Audífonos inalámbricos ARX DNC-6603",
        category: "Audífonos",
        price: 15990,
        stock: 15,
    },
    {
        id: crypto.randomUUID(),
        name: "Batería acústica TAMA Stagestar ST52H5 5 piezas - SCP",
        category: "Percusión",
        price: 529990,
        stock: 5,
    },
    {
        id: crypto.randomUUID(),
        name: "Guitarra eléctrica Ibanez GRX20 - White",
        category: "Guitarras",
        price: 184990,
        stock: 7,
    },
    {
        id: crypto.randomUUID(),
        name: "Bajo eléctrico Ibanez GSR185 - Jewel Blue",
        category: "Bajos",
        price: 298990,
        stock: 5,
    },
    {
        id: crypto.randomUUID(),
        name: "Micrófono Condensador Behringer C-1",
        category: "Accesorio",
        price: 72990,
        stock: 6,
    },
    {
        id: crypto.randomUUID(),
        name: "Mixer Allen & Heath ZED6",
        category: "Mixer",
        price: 185990,
        stock: 3,
    },
];

const venta = []

/*
--------------------------------------
Referencias del DOM
--------------------------------------
*/



/*
--------------------------------------

--------------------------------------
*/
const agregarAVenta = (idProducto) => {
    const productoElegido = productos.find(producto => producto.id === idProducto);

    if(productoElegido.stock ===0){
        alert("Producto sin stock");
        return;
    }

    const productoVenta = venta.find(producto => producto.idProducto === idProducto);

    if(!productoVenta){
        if(productoElegido.stock === 0) venta.push({idProducto, cantidad: 1});
    } else {
        if(productoVenta.cantidad < productoElegido.stock) productoVenta.cantidad += 1;
        if(productoVenta.cantidad === productoElegido.stock) alert("Producto sin stock");
    }
}

const descCantidad = (idProducto) => {
    const producto = venta.find(objeto => objeto.idProducto === idProducto);

    producto.cantidad -= 1;
    if(producto.cantidad <= 0) {
        const indiceProducto = venta.find(objeto => objeto.idProducto === idProducto);
        venta.splice(indiceProducto, 1);
    }
}

const incCantidad = (idProducto) => {
    const producto = productos.find((objeto) => objeto.id === idProducto);
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

--------------------------------------
*/

const crearTablaDeProductos = () => {
    const tablaDelArreglo = productos.map((producto) => 
    ``  /*  <= Insertar HTML de la tabla de los objetos*/ ,
    )

    return(tablaDelArreglo.join())
}

