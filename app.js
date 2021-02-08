// ============ jQuery =================
// al hacer click en el botón VER MENU el dibujo de la hamburguesa desaparece

$('button.ver-menu').click(function() {
    $('figure.dibujo, .ver-menu').fadeOut('slow');
});

// ============ fin del jQuery =================

const cards= document.getElementById('cards');
const botonDeAgregar=document.querySelectorAll('.botonDeAgregar')
const contenedorDeArticulos = document.querySelector('.contenedorDeArticulos'); //Capturamos el div de la plantilla
const templateCard= document.getElementById('template-card').content;
const fragment= document.createDocumentFragment();
const comprar = document.querySelector('.comprar');
comprar.addEventListener('click', comprarCarrito);


// función que captura los elementos más cercanos al botón "Agregar" 

    const  agregoHaciendoClic=function (event) {
        const nombre = event.dataset.title;
        const precio = event.dataset.precio;
        const foto = event.dataset.imagen;
        adicionarProducto(nombre, precio, foto);
    }

//============ AJAX =============
const llamadaApi = async() => {
    try{
        const respuesta = await fetch('api.json');
        const misDatos = await respuesta.json();
        pintarTarjetas(misDatos);
    } catch(error){
        console.log(error);
    }
}

// con jQuery llamo a la API cuando el documento esté cargado 
$('document').ready(function(){
    llamadaApi();


//forEach para recorrer mis botones de "Agregar"

    botonDeAgregar.forEach(botoncito => {
        botoncito.addEventListener("click", agregoHaciendoClic);
    });
});

//función que pinta las tarjetas en el documento

const pintarTarjetas = (misDatos) => {
    misDatos.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute('src', producto.imagen);
        templateCard.querySelector('.botonDeAgregar').dataset.id= producto.id;
        templateCard.querySelector('.botonDeAgregar').dataset.title= producto.title;
        templateCard.querySelector('.botonDeAgregar').dataset.precio= producto.precio;
        templateCard.querySelector('.botonDeAgregar').dataset.imagen= producto.imagen;

        const clon = templateCard.cloneNode(true);
        fragment.appendChild(clon);
    })
    cards.appendChild(fragment);
}

//función que agrega los productos al carrito

function adicionarProducto(nombre, precio, foto) {

    const tituloDelElemento = contenedorDeArticulos.getElementsByClassName('elementosPorTitulo');

    for (let i = 0; i < tituloDelElemento.length; i++) {

        if( tituloDelElemento[i].innerText === nombre) {
            let misElementos = tituloDelElemento[i].parentElement.parentElement.parentElement.querySelector('.cantidadEnCarro');
            misElementos.value++;
            actualizacionDelTotal(); 

            return;
        }
    }

    const filaDinamica = document.createElement('div');//creamos un div para almacenar el contenido dinámico
    //Luego creamos un string literal
    const contenidoDinamico = `
    <div class="row totalDeProductos">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${foto} class="shopping-cart-image">
                <h6 class="shopping-cart-item-titulo elementosPorTitulo text-truncate ml-3 mb-0">${nombre}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="precio mb-0 totalPrecioArticulos">${precio}</p>
            </div>
        </div>
        <div class="col-4">
            <div class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input cantidadEnCarro" type="number"
                    value="1">
                <button class="btn btn-warning botonEliminarProducto type="button">Eliminar</button>
            </div>
        </div>
    </div>`;
    filaDinamica.innerHTML = contenidoDinamico; //metemos el template string en el <div> que creamos
    contenedorDeArticulos.append(filaDinamica);
    //Poner a funcionar el botón amarillo de eliminar 
    filaDinamica.querySelector('.botonEliminarProducto').addEventListener('click', removerProducto);
    //Afectar el Total de acuerdo a la cantidad de artículos escogida
    filaDinamica.querySelector('.cantidadEnCarro').addEventListener('change', cantidadCambiada);

    actualizacionDelTotal();
}


// función que actualizará el precio
function actualizacionDelTotal(){
    let total = 0;
    const totalCompra = document.querySelector('.totalCompra');
    const totalDeArticulos = document.querySelectorAll('.totalDeProductos');

    totalDeArticulos.forEach((articulos) => {
        const precioDeLosElementos = articulos.querySelector('.totalPrecioArticulos');
        const totalPrecio = Number(precioDeLosElementos.textContent.replace('$',''));
        const cantidadDeElementos = articulos.querySelector('.cantidadEnCarro');
        const cantidadEnCarro = Number(cantidadDeElementos.value);
        total = total + totalPrecio * cantidadEnCarro;
    });
    totalCompra.innerHTML = `$ ${total.toFixed(0)}`;
}

//función para eliminar producto con el botón amarillo

function removerProducto(evento) {
    const botonCliqueado = evento.target;
    botonCliqueado.closest('.totalDeProductos').remove();
    actualizacionDelTotal();
};
//función que evita que cantidad baje a números negativos
function cantidadCambiada(event) {
    const input = event.target;
    input.value <= 0 ? (input.value = 1) : null;
    actualizacionDelTotal();
  }

  //Al pulsar el botón COMPRAR el carrito se borra y el Total vuelve a CERO
  function comprarCarrito() {
    contenedorDeArticulos.innerHTML = '';
    actualizacionDelTotal();
  }


