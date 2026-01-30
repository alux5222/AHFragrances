// ---------------------------
// ADD TO CART
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const title = card.dataset.title;
      const price = parseFloat(card.dataset.price);
      const image = card.dataset.image;
      const confirmation = card.querySelector('.confirmation');

      // Load existing cart or initialize
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if product already exists
      const existingProduct = cart.find(item => item.title === title);

      if (existingProduct) {
        existingProduct.qty += 1;
      } else {
        cart.push({ title, price, image, qty: 1 });
      }

      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cart));

      // Show confirmation
      confirmation.textContent = `Added 1 "${title}" to cart!`;
      confirmation.style.color = '#27ae60';

      // Clear message after 2 seconds
      setTimeout(() => {
        confirmation.textContent = '';
      }, 2000);
    });
  });
});

// ---------------------------
// OPENS ITEM FULL SCREEN
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const titleElement = card.querySelector('h3'); // or '.product-link'
    titleElement.addEventListener('click', () => {
      const title = card.dataset.title;
      const price = card.dataset.price;
      const image = card.dataset.image;
      const description = card.dataset.description; 
      // You can add a data-description attribute if you want unique descriptions

      // Build query string
      const query = new URLSearchParams({
        title,
        price,
        image,
        description
      });

      // Redirect to itemWindow.html with product info
      window.location.href = `itemWindow.html?${query.toString()}`;
    });
  });
});

// ---------------------------
// add-to-cart button
// ---------------------------
const btn = document.querySelector('.add-to-cart');

btn.addEventListener('click', () => {
  btn.classList.add('added');

  // Optional: remove the class after a moment
  setTimeout(() => {
    btn.classList.remove('added');
  }, 1500);
});



// ---------------------------
// MOBILE FULLSCREEN MENU
// ---------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}
