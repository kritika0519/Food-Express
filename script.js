// Sample data for outlets
const outlets = [
    { id: 1, name: "Domino's", logo: "https://dummyimage.com/150x150/4ecdc4/ffffff&text=Domino's", description: "Delicious pizzas and sides" },
    { id: 2, name: "McDonald's", logo: "https://dummyimage.com/150x150/45b7d1/ffffff&text=McDonald's", description: "Classic burgers and fries" },
    { id: 3, name: "KFC", logo: "https://dummyimage.com/150x150/ff6b6b/ffffff&text=KFC", description: "Finger-lickin' good chicken" },
    { id: 4, name: "Subway", logo: "https://dummyimage.com/150x150/f9844a/ffffff&text=Subway", description: "Fresh and customizable sandwiches" },
    { id: 5, name: "Starbucks", logo: "https://dummyimage.com/150x150/277da1/ffffff&text=Starbucks", description: "Premium coffee and snacks" },
    { id: 6, name: "Taco Bell", logo: "https://dummyimage.com/150x150/577590/ffffff&text=Taco+Bell", description: "Tasty Mexican-inspired fast food" },
];


// Sample data for menu items
const menuItems = {
    1: [ // Domino's menu
        { id: 101, name: "Margherita Pizza", price: 9.99 },
        { id: 102, name: "Pepperoni Pizza", price: 11.99 },
        { id: 103, name: "Garlic Bread", price: 4.99 },
    ],
    2: [ // McDonald's menu
        { id: 201, name: "Big Mac", price: 5.99 },
        { id: 202, name: "Chicken McNuggets", price: 4.99 },
        { id: 203, name: "French Fries", price: 2.99 },
    ],
    3: [ // KFC menu
        { id: 301, name: "Original Recipe Chicken", price: 7.99 },
        { id: 302, name: "Zinger Burger", price: 6.99 },
        { id: 303, name: "Coleslaw", price: 2.99 },
    ],
    4: [ // Subway menu
        { id: 401, name: "Italian B.M.T.", price: 6.99 },
        { id: 402, name: "Veggie Delite", price: 5.99 },
        { id: 403, name: "Chicken Teriyaki", price: 7.49 },
    ],
    5: [ // Starbucks menu
        { id: 501, name: "Caffe Latte", price: 3.99 },
        { id: 502, name: "Chocolate Chip Cookie", price: 2.49 },
        { id: 503, name: "Iced Caramel Macchiato", price: 4.49 },
    ],
    6: [ // Taco Bell menu
        { id: 601, name: "Crunchy Taco", price: 1.99 },
        { id: 602, name: "Burrito Supreme", price: 3.99 },
        { id: 603, name: "Nachos BellGrande", price: 4.49 },
    ],
};


// Cart data
let cart = [];

// DOM Elements
const outletGrid = document.getElementById('outlets');
const cartIcon = document.getElementById('cartIcon');
const cartItemCount = document.getElementById('cartItemCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const signupButton = document.getElementById('signupButton');
const loginButton = document.getElementById('loginButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initMap(); // This initializes the map
    renderOutlets();
});


function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCartModal);
    signupButton.addEventListener('click', () => showAuthModal('signup'));
    loginButton.addEventListener('click', () => showAuthModal('login'));
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('input', handleSearch);
    checkoutButton.addEventListener('click', handleCheckout);

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === cartModal || event.target === authModal) {
            cartModal.style.display = 'none';
            authModal.style.display = 'none';
        }
    });

    // Close buttons for modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            authModal.style.display = 'none';
        });
    });
}

function showMenu(outletId) {
    const outlet = outlets.find(o => o.id === outletId);
    const menu = menuItems[outletId];
    outletGrid.innerHTML = `
      <h2>${outlet.name} Menu</h2>
      <div class="menu-grid">
        ${menu.map(item => `
          <div class="menu-item">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})" class="add-to-cart-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-icon">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Add to Cart
            </button>
          </div>
        `).join('')}
      </div>
      <button onclick="renderOutlets()" class="back-btn">Back to Outlets</button> <!-- Added Back to Outlets button -->
    `;
}

function addToCart(itemId, itemName, itemPrice) {
    const existingItem = cart.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCartIcon();
}

function updateCartIcon() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItems;
}

function toggleCartModal() {
    cartModal.style.display = cartModal.style.display === 'none' ? 'block' : 'none';
    if (cartModal.style.display === 'block') {
        renderCart();
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = 'Total: $0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
            </div>
        `).join('');
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCartIcon();
        renderCart();
    }
}

function showAuthModal(type) {
    authModal.style.display = 'block';
    authForm.innerHTML = type === 'signup' ? renderSignupForm() : renderLoginForm();
}

function renderSignupForm() {
    return `
      <h2><i class="fas fa-user-plus"></i> Sign Up</h2>
      <form onsubmit="handleSignup(event)">
        <input type="text" placeholder="Name" required>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Sign Up</button>
      </form>
      <p class="loading-message" style="display:none;"></p>
    `;
}

function renderLoginForm() {
    return `
      <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
      <form onsubmit="handleLogin(event)">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <p class="loading-message" style="display:none;"></p>
    `;
}

function handleSignup(event) {
    event.preventDefault();
    // Show loading indicator
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Signing up...';
    authForm.innerHTML = ''; // Clear the form
    authForm.appendChild(loadingMessage);

    // Simulate signup logic (replace with actual logic)
    setTimeout(() => {
        console.log('Signup submitted');
        authModal.style.display = 'none';
        alert('Signup successful! Welcome!');
    }, 2000); // Simulate a delay for signup
}

function handleLogin(event) {
    event.preventDefault();
    // Show loading indicator
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Logging in...';
    authForm.innerHTML = ''; // Clear the form
    authForm.appendChild(loadingMessage);

    // Simulate login logic (replace with actual logic)
    setTimeout(() => {
        console.log('Login submitted');
        authModal.style.display = 'none';
        alert('Login successful! Welcome back!');
    }, 2000); // Simulate a delay for login
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredOutlets = outlets.filter(outlet => 
        outlet.name.toLowerCase().includes(searchTerm) || 
        outlet.description.toLowerCase().includes(searchTerm)
    );
    renderFilteredOutlets(filteredOutlets);
}

function renderFilteredOutlets(filteredOutlets) {
    if (filteredOutlets.length === 0) {
        outletGrid.innerHTML = '<p>No results found</p>';
    } else {
        renderOutlets(filteredOutlets);
    }
}

function renderOutlets(outletList = outlets) {
    outletGrid.innerHTML = outletList.map(outlet => `
        <div class="outlet-card">
            <img src="${outlet.logo}" alt="${outlet.name} logo">
            <div class="outlet-card-content">
                <h3>${outlet.name}</h3>
                <p>${outlet.description}</p>
                <button onclick="showMenu(${outlet.id})" class="explore-menu-btn">Explore Menu</button>
            </div>
        </div>
    `).join('');
}

function handleCheckout() {
    if (cart.length === 0) { // Check if the cart is empty
        alert('Please add something to the cart.'); // Alert message
        return; // Exit the function if the cart is empty
    }
    // Implement checkout logic here
    console.log('Checkout clicked');
    alert('Thank you for your order!');
    cart = [];
    updateCartIcon();
    cartModal.style.display = 'none';
}

function initMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
        zoom: 13
    });

    // Add markers for sample store locations
    const stores = [
        { lat: 40.7489, lng: -73.9680, name: "Store 1" },
        { lat: 40.7280, lng: -74.0060, name: "Store 2" },
        { lat: 40.7305, lng: -73.9925, name: "Store 3" }
    ];

    stores.forEach(store => {
        new google.maps.Marker({
            position: { lat: store.lat, lng: store.lng },
            map: map,
            title: store.name
        });
    });
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartIcon();
            renderCart();
        }
    }
}

// Initial render of outlets
renderOutlets();