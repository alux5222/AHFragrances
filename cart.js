// -------------------------------
// CART RENDERING + TOTALS
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalDisplay = document.getElementById('total');
  const taxDisplay = document.getElementById('tax');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateTotal() {
    const tax = 0.0787;
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.qty;
    });

    const taxAmount = total * tax;
    const grandTotal = total + taxAmount;

    totalDisplay.textContent = grandTotal.toFixed(2);
    taxDisplay.textContent = taxAmount.toFixed(2);

    // localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      totalDisplay.textContent = '0.00';
      taxDisplay.textContent = '0.00';
      return;
    }

    cart.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="item-details">
          <h3>${item.title}</h3>
          <p>Price: $${item.price.toFixed(2)}</p>
          <p>Quantity: ${item.qty}</p>

          <div class="item-actions">
            <button class="decrease-btn">-</button>
            <button class="increase-btn">+</button>
            <button class="remove-btn">Remove</button>
          </div>

          <p>Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
        </div>
        `;

      itemDiv.querySelector('.increase-btn').addEventListener('click', () => {
        cart[index].qty++;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();

      });

      itemDiv.querySelector('.decrease-btn').addEventListener('click', () => {
        if (cart[index].qty > 1) {
          cart[index].qty--;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();

      });

      itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();

      });

      cartItemsContainer.appendChild(itemDiv);
    });

    updateTotal();
  }

  renderCart();
});


// -------------------------------
// SQUARE PAYMENT SETUP
// -------------------------------

const appId = "sandbox-sq0idb-6rQptdfE7788QVF59ShLwA";
const locationId = "LD2VCSRWVS64T";

async function setupSquarePayment() {
  console.log("Initializing Square...");

  const payments = Square.payments(appId, locationId);
  const card = await payments.card();
  await card.attach("#card-container");

  document.getElementById("pay-now").addEventListener("click", async () => {
    // -------------------------------
    // VALIDATE FORM
    // -------------------------------

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const contact = document.getElementById("contact").value.trim();
    // if (!firstName || !lastName || !address || !city || !state || !zip) {
    //   alert("Please fill out all required shipping fields.");
    //   return;
    // }

    const errorBox = document.getElementById("errorBox");
    errorBox.innerHTML = ""; // clear previous errors

    let errors = [];

    // Required fields
    if (!firstName || !lastName || !address || !city || !state || !zip) {
      errors.push("Please fill out all required shipping fields.");
    }

    // First name checks
    if (firstName.length < 2) errors.push("First name is too short");
    if (firstName.length > 12) errors.push("First name is too long");
    if (!/^[A-Za-z]+$/.test(firstName)) errors.push("First name contains invalid characters");

    // Last name checks
    if (lastName.length < 2) errors.push("Last name is too short");
    if (lastName.length > 15) errors.push("Last name is too long");
    if (!/^[A-Za-z]+$/.test(lastName)) errors.push("Last name contains invalid characters");

    // Address checks
    if (!/^\d+\s+.+/.test(address)) {
      errors.push("Address must start with a street number");
    }

    // City checks
    if (!/^[A-Za-z\s]{2,}$/.test(city)) {
      errors.push("City name is invalid");
    }

    // State checks
    if (!/^[A-Za-z]{2}$/.test(state)) {
      errors.push("State must be a 2-letter code");
    }

    // ZIP checks
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      errors.push("ZIP code is invalid");
    }

    if (!contact) {
      errors.push("Please provide an email or phone number.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

      const isEmail = emailRegex.test(contact);
      const isPhone = phoneRegex.test(contact);

      if (!isEmail && !isPhone) {
        errors.push("Please enter a valid email or US phone number.");
      }
    }

    // Show errors
    if (errors.length > 0) {
      errorBox.innerHTML = errors.join("<br>");
      return;
    }

    // -------------------------------
    // CLEAN CONTACT VALUE
    // -------------------------------

    let email = undefined;
    let phone = undefined;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

    if (emailRegex.test(contact)) {
      email = contact.trim();
    } else if (phoneRegex.test(contact)) {
      phone = contact.replace(/\D/g, ""); // digits only
    }

    const customerName = `${firstName} ${lastName}`;
    // const email = contact.includes("@") ? contact : undefined;

    const shippingAddress = {
      addressLine1: address,
      locality: city,
      administrativeDistrictLevel1: state,
      postalCode: zip,
      country: "US"
    };

    // -------------------------------
    // TOKENIZE CARD
    // -------------------------------
    const result = await card.tokenize();

    if (result.status !== "OK") {
      alert("Card tokenization failed.");
      return;
    }

    // -------------------------------
    // SEND TO BACKEND
    // -------------------------------
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch("http://localhost:3000/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: result.token,
        cart,
        customerName,
        email,
        shippingAddress
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Payment response:", data);

        if (data.success) {
          alert("Payment successful!");
          localStorage.removeItem("cart");
          window.location.href = "thankyou.html";
        } else {
          alert("Payment failed.");
        }
      })
      .catch(err => {
        console.error("Payment error:", err);
        alert("Payment error.");
      });
  });
}

document.addEventListener("DOMContentLoaded", setupSquarePayment);