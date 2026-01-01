/* =============================
   SAFE BOOT
============================= */
console.log("script.js loaded");

const hasFirebase = typeof firebase !== "undefined";

/* =============================
   GLOBAL STATE
============================= */
let cart = [];
let orderSubmitting = false;
const MAX_QTY_PER_ITEM = 20;

/* =============================
   ADD TO CART
============================= */
function addToCart(name, price) {
  const item = cart.find(i => i.name === name);

  if (item) {
    if (item.qty >= MAX_QTY_PER_ITEM) {
      document.getElementById("limit-modal")?.classList.add("show");
      return;
    }
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartBar();
}

/* =============================
   CART BAR
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
  document.getElementById("limit-modal")?.classList.remove("show");
}

/* =============================
   CHECKOUT
============================= */
function checkout() {
  if (!cart.length) {
    document.getElementById("empty-cart-modal")?.classList.add("show");
    return;
  }

  const user = hasFirebase ? firebase.auth().currentUser : null;

  if (!user) {
    localStorage.setItem("afterLogin", "/index.html?checkout=true");
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("order-modal")?.classList.add("show");
}

function closeModal() {
  document.getElementById("order-modal")?.classList.remove("show");
}

function closeEmptyCart() {
  document.getElementById("empty-cart-modal")?.classList.remove("show");
}

/* =============================
   CONFIRM ORDER
============================= */
function confirmOrder() {
console.log("CART BEFORE ORDER:", cart);
  if (orderSubmitting) return;
  orderSubmitting = true;

  const btn = document.getElementById("confirmBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerText = "Placing order...";
  }

  const name = document.getElementById("cust-name")?.value.trim();
  const phone = document.getElementById("cust-phone")?.value.trim();

  if (!/^\d{10}$/.test(phone)) {
    alert("Enter valid phone number");
    resetConfirmBtn();
    return;
  }

  if (typeof window.placeOrderToFirebase !== "function") {
    alert("System not ready. Please try again.");
    resetConfirmBtn();
    return;
  }

  window.placeOrderToFirebase({ name, phone, cart });
}

function resetConfirmBtn() {
  orderSubmitting = false;
  const btn = document.getElementById("confirmBtn");
  if (btn) {
    btn.disabled = false;
    btn.innerText = "Confirm Order";
  }
}

/* =============================
   CART MODAL
============================= */
function openCartModal() {
  const modal = document.getElementById("cart-modal");
  const itemsBox = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");

  if (!modal || !itemsBox || !totalBox) return;

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

function closeCartModal() {
  document.getElementById("cart-modal")?.classList.remove("show");
}

function proceedToDetails() {
  closeCartModal();
  checkout();
}

/* =============================
   CART QTY CONTROLS
============================= */
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCartBar();
  openCartModal();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartBar();
  openCartModal();
}

/* =============================
   UI POLISH
============================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-up").forEach(el => {
    el.classList.add("show");
  });
});

/* =============================
   HEADER + HAMBURGER (BULLETPROOF)
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