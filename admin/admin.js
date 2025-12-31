/* =============================
   FIREBASE INIT (ONCE ONLY)
============================= */
const firebaseConfig = {
  apiKey: "AIzaSyCcGt23_4BokfQUrScFs88KMqn-sphaXbA",
  authDomain: "sfc-uluberia.firebaseapp.com",
  projectId: "sfc-uluberia",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/* =============================
   AUTH HANDLING
============================= */
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  } else {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("adminPanel").style.display = "none";
  }
});

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => {
      document.getElementById("loginError").innerText = err.message;
    });
}

function logout() {
  auth.signOut();
}

/* =============================
   STATE
============================= */
let currentFilter = "pending";
let latestSnapshot = [];
const ordersBox = document.getElementById("orders");

/* =============================
   TAB SWITCH
============================= */
function setFilter(status) {
  currentFilter = status;

  document.querySelectorAll(".admin-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.status === status);
  });

  renderOrders(latestSnapshot);
}

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
    ordersBox.innerHTML = `<p style="color:#aaa;">No ${currentFilter} orders</p>`;
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
    if (order.status !== "pending") return; // prevent double accept

    const customerPhone = order.phone;
    const totalAmount = order.total;
    const customerName = order.name || "Customer";

    db.collection("orders").doc(id).update({ status: "accepted" });

    const upiId = "muktadir-1@ptaxis"; // change if needed
    const upiLink =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent("SFC – Spezia Fried Chicken")}` +
      `&am=${encodeURIComponent(totalAmount)}` +
      `&cu=INR`;

    const msg =
      `🍗 SFC – Spezia Fried Chicken\n\n` +
      `Hello ${customerName} 👋\n` +
      `Your order has been ACCEPTED ✅\n\n` +
      `Total amount: ₹${totalAmount}\n\n` +
      `Please complete payment using the link below:\n` +
      `${upiLink}\n\n` +
      `After payment, please send the screenshot here.\n\n` +
      `Thank you!`;

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