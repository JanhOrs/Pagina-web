const header = document.querySelector("header");

window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector('#menu-icon');
let navmenu = document.querySelector('.navmenu');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
};

// Array para almacenar los productos en el carrito, cargado desde Local Storage si está disponible
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para añadir un producto al carrito
function addToCart(productName, productPrice, productImage) {
    // Convertir precio de formato '$110.000' a número 110000
    const numericPrice = parseInt(productPrice.replace(/\D/g, ''), 10);
    const item = {
        name: productName,
        price: numericPrice,
        image: productImage,
    };
    cart.push(item);
    saveCartToLocalStorage();
    renderCart();
}

// Función para mostrar los productos en el carrito (se usará tanto en index.html como en carrito.html)
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Limpiar carrito antes de renderizar
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const productElement = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="product-info">
                    <h4>${item.name}</h4>
                    <p>Precio: $${item.price.toLocaleString('es-CO')}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
        cartContainer.innerHTML += productElement;
    });

    // Mostrar el total del carrito
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.innerText = `${total.toLocaleString('es-CO')}`;
    }

    // Actualizar el ícono del carrito (en index.html)
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    // Mostrar vista previa en el índice (si estamos en index.html)
    const cartPreview = document.getElementById('cart-preview');
    if (cartPreview) {
        const previewItems = cart.slice(0, 3); // Solo mostrar 3 productos para vista previa
        let previewHTML = '';
        previewItems.forEach(item => {
            previewHTML += `
                <div class="cart-item-preview">
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            `;
        });
        document.getElementById('cart-items').innerHTML = previewHTML;
        document.getElementById('cart-total-preview').innerText = `$${total.toLocaleString('es-CO')}`;
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1); // Eliminar el producto en la posición dada
    saveCartToLocalStorage();
    renderCart(); // Volver a renderizar el carrito después de eliminar el producto
}

// Función para guardar el carrito en Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Guardar carrito actualizado en el almacenamiento local
}

// Cargar el carrito al cargar la página (en la página principal o carrito.html)
window.addEventListener('load', function () {
    renderCart(); // Mostrar carrito si estamos en la página cargada
});




// Función para alternar la prenda como favorita y actualizar el estado visual
function toggleFavorite(name, price, image, heartIcon) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const itemIndex = favorites.findIndex(item => item.name === name);

    if (itemIndex > -1) {
        // Si el producto ya está en favoritos, lo eliminamos
        favorites.splice(itemIndex, 1);
        heartIcon.classList.remove('active'); // Quitar color rojo
    } else {
        // Si no está en favoritos, lo agregamos
        favorites.push({ name, price, image });
        heartIcon.classList.add('active'); // Cambiar a color rojo
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Si estamos en la página de favoritos, actualizamos la lista sin recargar
    if (document.getElementById('favorites-container')) {
        updateFavoritesDOM();
    }
}

// Función para actualizar el DOM de favoritos sin recargar la página
function updateFavoritesDOM() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let container = document.getElementById('favorites-container');
    container.innerHTML = ''; // Limpiar contenido previo

    if (favorites.length === 0) {
        container.innerHTML = '<p>No tienes prendas favoritas aún.</p>';
    } else {
        favorites.forEach(item => {
            container.innerHTML += `
                <div class="row">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="product-text">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                    </div>
                    <div class="heart-icon">
                        <i class='bx bx-heart active' onclick="toggleFavorite('${item.name}', '${item.price}', '${item.image}', this); updateFavoritesDOM();"></i>
                    </div>
                </div>
            `;
        });
    }
}

// Lógica de inicialización de la página de favoritos y mantener corazones rojos en favoritos
document.addEventListener('DOMContentLoaded', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let container = document.getElementById('favorites-container');

    // Verificar si estamos en la página de favoritos
    if (container) {
        updateFavoritesDOM();
    } else {
        // Marcar corazones activos en otras páginas
        favorites.forEach(item => {
            const heartIcon = document.querySelector(`i[onclick*="${item.name}"]`);
            if (heartIcon) {
                heartIcon.classList.add('active'); // Marca los íconos de favoritos como activos
            }
        });
    }
});


