/* =============================
   DATABASE
============================= */

const firebaseConfig = {
  apiKey: "AIzaSyCcGt23_4BokfQUrScFs88KMqn-sphaXbA",
  authDomain: "sfc-uluberia.firebaseapp.com",
  projectId: "sfc-uluberia",
  storageBucket: "sfc-uluberia.firebasestorage.app",
  messagingSenderId: "286996634308",
  appId: "1:286996634308:web:6ec52f89dde053bd830791",
  measurementId: "G-T9BWYV1Y68"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
/* =============================
   GLOBAL STATE
============================= */
let cart = [];
const MAX_QTY_PER_ITEM = 20;

/* =============================
   ADD TO CART
============================= */
function addToCart(name, price) {
  const item = cart.find(i => i.name === name);

  if (item) {
    if (item.qty >= MAX_QTY_PER_ITEM) {
      document.getElementById("limit-modal").classList.add("show");
      return;
    }
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartBar();
}

/* =============================
   UPDATE CART BAR
============================= */
function updateCartBar() {
  const cartBar = document.getElementById("cart-bar");
  const summary = document.getElementById("cart-summary");
  if (!cartBar || !summary) return;

  if (!cart.length) {
    cartBar.classList.remove("show");
    return;
  }

  let qty = 0;
  let total = 0;

  cart.forEach(i => {
    qty += i.qty;
    total += i.qty * i.price;
  });

  summary.textContent = `${qty} item${qty > 1 ? "s" : ""} • ₹${total}`;
  cartBar.classList.add("show");
}
function closeLimitModal() {
  document.getElementById("limit-modal").classList.remove("show");
}
/* =============================
   CHECKOUT
============================= */
function checkout() {
  if (!cart.length) {
  document.getElementById("empty-cart-modal").classList.add("show");
  return;
}
  
  document.getElementById("order-modal").classList.add("show");
}

function closeModal() {
  document.getElementById("order-modal").classList.remove("show");
}

function confirmOrder() {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();

  if (!/^\d{10}$/.test(phone)) {
    alert("Enter valid phone number");
    return;
  }

  const orderData = {
    name: name || "Guest",
    phone: phone,
    items: cart,
    total: cart.reduce((sum, i) => sum + i.qty * i.price, 0),
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection("orders")
    .add(orderData)
    .then(() => {
      closeModal();
      cart = [];
      updateCartBar();
      alert("Order placed successfully. Please wait for confirmation.");
    })
    .catch(error => {
      console.error(error);
      alert("Order failed. Please try again.");
    });
}
function closeEmptyCart() {
  document.getElementById("empty-cart-modal").classList.remove("show");
}
/* =============================
   FADE UP FORCE SHOW
============================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-up").forEach(el => {
    el.classList.add("show");
  });
});

/* =============================
   HEADER HIDE ON SCROLL
============================= */
let lastScrollY = window.scrollY;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > lastScrollY && window.scrollY > 80) {
    header.classList.add("hide-header");
  } else {
    header.classList.remove("hide-header");
  }
  lastScrollY = window.scrollY;
});

/* =============================
   HAMBURGER MENU FIX
============================= */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    const open = navLinks.classList.toggle("active");
    hamburger.classList.toggle("active", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  document.addEventListener("click", e => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}
function openCartModal() {
  const modal = document.getElementById("cart-modal");
  const itemsBox = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");

  itemsBox.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    itemsBox.innerHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
        <div>
          <strong>${item.name}</strong><br>
          ₹${item.price} × ${item.qty}
        </div>
        <div>
          <button onclick="changeQty(${index},-1)">−</button>
          <button onclick="changeQty(${index},1)">+</button>
          <button onclick="removeItem(${index})">✕</button>
        </div>
      </div>
    `;
  });

  totalBox.textContent = total;
  modal.classList.add("show");
}
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartBar();
  openCartModal();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartBar();
  openCartModal();
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.remove("show");
}

function proceedToDetails() {
  closeCartModal();
  checkout(); // existing details modal
}
