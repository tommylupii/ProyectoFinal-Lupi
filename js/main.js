//Productos
function producto(objeto, marca, precio, stock) {
  this.objeto = objeto;
  this.marca = marca;
  this.precio = precio;
  this.stock = stock;
}

let producto1 = new producto("Laptop", "Apple", 1000000, 6);
let producto2 = new producto("PC", "Asus", 750000, 10);
let producto3 = new producto("Teclado", "Logitech", 20000, 3);
let producto4 = new producto("Mouse", "Razer", 15000, 9);
let producto5 = new producto("Mousepad", "Logitech", 5000, 5);
let producto6 = new producto("Monitor", "Samsung", 200000, 3);
let producto7 = new producto("Silla", "Hyperx", 150000, 7);
let producto8 = new producto("Luces LED", "ERCO", 5000, 13);

let productos = [producto1, producto2, producto3, producto4, producto5, producto6, producto7, producto8];

const precioProductos = document.querySelectorAll('.precio-producto');

precioProductos.forEach((element, index) => {
  element.textContent = `$${productos[index].precio}`;
});

//Info
function mostrarInfoProducto(producto) {
  const informacionProducto = `
    Producto: ${producto.objeto}<br>
    Marca: ${producto.marca}<br>
    Precio: $${producto.precio}<br>
    Stock: ${producto.stock} unidades
  `;

  Swal.fire({
    title: 'Información del Producto',
    html: informacionProducto,
    icon: 'info',
    confirmButtonText: 'Cerrar'
  });
}

const masInfoButtons = document.querySelectorAll('button[data-action="masInfo"]');
masInfoButtons.forEach((button) => {
  button.addEventListener('click', async (event) => {
    const productoIndex = event.target.getAttribute('data-producto-index');
    try {
      const response = await fetch('productos.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar la información del producto');
      }
      const productos = await response.json();
      const producto = productos[parseInt(productoIndex)];
      mostrarInfoProducto(producto);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la información del producto',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  });
});

//Agregar al carrito
const carritoLista = document.getElementById('carrito-lista');

const botonesAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');

botonesAgregarAlCarrito.forEach((boton) => {
  boton.addEventListener('click', (event) => {
    const productoIndex = event.target.getAttribute('data-producto-index');
    
    const producto = productos[parseInt(productoIndex)];

    const productoEnCarrito = document.createElement('li');
    productoEnCarrito.textContent = `${producto.objeto} - $${producto.precio.toFixed(2)}`;

    carritoLista.appendChild(productoEnCarrito);

    const precioTotalElement = document.getElementById('precio-total');
    const precioActual = parseFloat(precioTotalElement.textContent.replace('$', '')) || 0;
    const nuevoPrecio = precioActual + producto.precio;
    precioTotalElement.textContent = `${nuevoPrecio.toFixed(2)}`; // 
  });
});

//Guardar carrito en local storage
const guardarCarritoButton = document.getElementById('guardar-carrito');

guardarCarritoButton.addEventListener('click', () => {
  const carritoActual = obtenerCarritoActual();

  if (carritoActual.length === 0) {
    Swal.fire({
      title: '¡Error!',
      text: 'Para poder guardar tu carrito de compras tenes que haber agregado al menos un producto.',
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
    return;
  }

  const carritoJSON = JSON.stringify(carritoActual);

  localStorage.setItem("productosCarrito", carritoJSON);

  Swal.fire({
    title: 'Tu carrito de compras se guardo correctamente',
    icon: 'success',
    confirmButtonText: 'OK',
    timer: 2500,
    timerProgressBar: true
  });
});

function obtenerCarritoActual() {
  const carritoItems = carritoLista.querySelectorAll('li');
  const carritoActual = [];

  carritoItems.forEach((item) => {
    const texto = item.textContent;
    const partes = texto.split(' - ');
    if (partes.length === 2) {
      const nombre = partes[0];
      const precio = parseFloat(partes[1].replace('$', ''));
      carritoActual.push({ nombre, precio });
    }
  });

  return carritoActual;
}

//Compra
function comprar() {
  if (!localStorage.getItem('productosCarrito')) {
    Swal.fire({
      title: '¡Error!',
      text: 'Primero tenés que guardar tu carrito antes de realizar una compra.',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  const carritoActual = obtenerCarritoActual();

  let precioTotal = 0;
  carritoActual.forEach((producto) => {
    precioTotal += producto.precio;
  });

  let mensajeCompra = 'Compraste los siguientes productos:<br>';
  carritoActual.forEach((producto) => {
    mensajeCompra += `${producto.nombre}<br>`;
  });
  mensajeCompra += `Precio Total: $${precioTotal.toFixed(2)}`;

  Swal.fire({
    title: '¡Compra exitosa!',
    html: mensajeCompra,
    icon: 'success',
    confirmButtonText: 'Cerrar'
  });

  limpiarCarrito(); // Limpia el carrito después de mostrar el mensaje de compra exitosa
}

const comprarButton = document.getElementById('comprar');
comprarButton.addEventListener('click', comprar);

function limpiarCarrito() {
  const carritoLista = document.getElementById('carrito-lista'); // Actualiza el ID a 'carrito-lista'
  carritoLista.innerHTML = '';
  document.getElementById('precio-total').textContent = '0.00';
  localStorage.removeItem('productosCarrito');
}