/* =============================
   FIREBASE INIT
============================= */
const firebaseConfig = {
  apiKey: "AIzaSyCcGt23_4BokfQUrScFs88KMqn-sphaXbA",
  authDomain: "sfc-uluberia.firebaseapp.com",
  projectId: "sfc-uluberia",
  storageBucket: "sfc-uluberia.firebasestorage.app",
  messagingSenderId: "286996634308",
  appId: "1:286996634308:web:6ec52f89dde053bd830791"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* =============================
   STATE
============================= */
let currentFilter = "pending";
const ordersBox = document.getElementById("orders");

/* =============================
   TAB SWITCH (FIXED)
============================= */
function setFilter(status) {
  currentFilter = status;

  document.querySelectorAll(".admin-tabs button").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.status === status
    );
  });

  renderOrders(latestSnapshot);
}

/* =============================
   SNAPSHOT CACHE
============================= */
let latestSnapshot = [];

/* =============================
   LIVE ORDERS LISTENER
============================= */
db.collection("orders")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    latestSnapshot = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderOrders(latestSnapshot);
  });

/* =============================
   RENDER ORDERS
============================= */
function renderOrders(orders) {
  ordersBox.innerHTML = "";

  const filtered = orders.filter(o => o.status === currentFilter);

  if (!filtered.length) {
    ordersBox.innerHTML =
      `<p style="color:#aaa;">No ${currentFilter} orders</p>`;
    return;
  }

  filtered.forEach(order => {
    let itemsHtml = "";
    order.items.forEach(item => {
      itemsHtml += `<div>${item.name} × ${item.qty}</div>`;
    });

    const time = order.createdAt
      ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString()
      : "";

    ordersBox.innerHTML += `
      <div style="
        border:2px solid #f2c400;
        padding:1.2rem;
        margin-bottom:1.2rem;
        background:#111;
        border-radius:12px;
      ">
        <strong>${order.name}</strong><br>
        📞 ${order.phone}<br>
        🕒 ${time}<br><br>

        ${itemsHtml}

        <br>
        <strong>Total: ₹${order.total}</strong><br><br>

        ${renderButtons(order.id, order.status)}
      </div>
    `;
  });
}

/* =============================
   BUTTONS
============================= */
function renderButtons(id, status) {
  if (status === "pending") {
    return `
      <button onclick="acceptOrder('${id}')">Accept</button>
      <button onclick="completeOrder('${id}')">Complete</button>
    `;
  }

  if (status === "accepted") {
    return `
      <button disabled>Accepted ✔️</button>
      <button onclick="completeOrder('${id}')">Complete</button>
    `;
  }

  return `<button disabled>Completed ✔️</button>`;
}

/* =============================
   ACTIONS
============================= */
function acceptOrder(id) {
  db.collection("orders").doc(id).get().then(doc => {
    if (!doc.exists) return;

    const order = doc.data();
    const customerPhone = order.phone; // 10-digit
    const totalAmount = order.total;   // exact amount
    const customerName = order.name || "Customer";

    // 🔒 Update order status first
    db.collection("orders").doc(id).update({
      status: "accepted"
    });

    // 💳 UPI deep link (amount locked)
    const upiId = "muktadir-1@ptaxis"; // 🔁 CHANGE THIS
    const upiLink =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent("SFC – Spezia Fried Chicken")}` +
      `&am=${encodeURIComponent(totalAmount)}` +
      `&cu=INR`;

    // 📩 WhatsApp message (customer)
    const msg =
      `🍗 SFC – Spezia Fried Chicken\n\n` +
      `Hello ${customerName} 👋\n` +
      `Your order has been ACCEPTED ✅\n\n` +
      `Total amount: ₹${totalAmount}\n\n` +
      `Please complete payment using the link below:\n` +
      `${upiLink}\n\n` +
      `After payment, please send the screenshot here.\n\n` +
      `Thank you!`;

    // 📲 Open WhatsApp to customer (manual send = safe)
    window.open(
      `https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  });
}

function completeOrder(id) {
  db.collection("orders").doc(id).update({ status: "completed" });
}

/* =============================
   DEFAULT LOAD
============================= */
document.addEventListener("DOMContentLoaded", () => {
  setFilter("pending");
});