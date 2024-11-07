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
    const item = {
        name: productName,
        price: parseFloat(productPrice.replace(/[^0-9.-]+/g, "")),
        image: productImage
    };
    cart.push(item);
    saveCartToLocalStorage();
    renderCart();
}

// Función para mostrar los productos en el carrito
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const productElement = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>Precio: $${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
        cartContainer.innerHTML += productElement;
    });

    document.getElementById('cart-total').innerText = total.toFixed(2);
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    renderCart();
}

// Función para guardar el carrito en Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar el carrito al cargar la página
window.addEventListener('load', function() {
    renderCart();
});

document.getElementById('cart-icon').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    const cartContainer = document.getElementById('cart-container');
    cartContainer.style.display = (cartContainer.style.display === 'none' || cartContainer.style.display === '') ? 'block' : 'none';
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

