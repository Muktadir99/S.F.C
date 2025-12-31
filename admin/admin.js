/* =============================
   FIREBASE INIT (ONCE ONLY)
============================= */
const firebaseConfig = {
  apiKey: "AIzaSyCcGt23_4BokfQUrScFs88KMqn-sphaXbA",
  authDomain: "sfc-uluberia.firebaseapp.com",
  projectId: "sfc-uluberia"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

/* =============================
   GLOBAL ALERT STATE
============================= */
let isFirstSnapshot = true;
let lastAlertedOrderId = null;

/* =============================
   STATE
============================= */
let currentFilter = "pending";
let latestSnapshot = [];
const ordersBox = document.getElementById("orders");
let unsubscribeOrders = null;

/* =============================
   AUTH HANDLING
============================= */
auth.onAuthStateChanged(user => {
  const loginBox = document.getElementById("loginBox");
  const adminPanel = document.getElementById("adminPanel");

  if (!loginBox || !adminPanel) return;

  if (user) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    startOrderListener();
  } else {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
    if (ordersBox) ordersBox.innerHTML = "";
  }
});

/* =============================
   LOGIN / LOGOUT
============================= */
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => {
      const errBox = document.getElementById("loginError");
      if (errBox) errBox.innerText = err.message;
    });
}

function logout() {
  auth.signOut();
}

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
   ALERT SYSTEM
============================= */
function triggerOrderAlert(orderId) {
  if (document.hidden) return;
  if (orderId === lastAlertedOrderId) return;

  lastAlertedOrderId = orderId;

  if (navigator.vibrate) {
    navigator.vibrate([300, 150, 300]);
  }

  const audio = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3"
  );
  audio.volume = 1;
  audio.play().catch(() => {});

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("New Order Received", {
      body: "Open admin panel to view details",
      icon: "/icons/icon-192.png"
    });
  }
}

/* =============================
   ORDER LISTENER
============================= */
function startOrderListener() {
  if (unsubscribeOrders) return;

  unsubscribeOrders = db
    .collection("orders")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      if (isFirstSnapshot) {
        isFirstSnapshot = false;
      } else {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            triggerOrderAlert(change.doc.id);
          }
        });
      }

      latestSnapshot = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      renderOrders(latestSnapshot);
    });
}

/* =============================
   RENDER ORDERS (SAFE)
============================= */
function renderOrders(orders) {
  if (!ordersBox) return;
  ordersBox.innerHTML = "";

  const filtered = orders.filter(o => o.status === currentFilter);

  if (!filtered.length) {
    ordersBox.innerHTML = `<p style="color:#aaa;">No ${currentFilter} orders</p>`;
    return;
  }

  filtered.forEach(order => {
    let itemsHtml = "";

    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        itemsHtml += `<div>${item.name} × ${item.qty}</div>`;
      });
    } else {
      itemsHtml = `<div>${order.name} × ${order.qty || 1}</div>`;
    }

    const time = order.createdAt?.seconds
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
        Phone: ${order.phone}<br>
        Time: ${time}<br><br>

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
    if (order.status !== "pending") return;

    db.collection("orders").doc(id).update({ status: "accepted" });

    const upiId = "muktadir-1@ptaxis";
    const upiLink =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent("SFC – Spezia Fried Chicken")}` +
      `&am=${encodeURIComponent(order.total)}` +
      `&cu=INR`;

    const msg =
      `SFC – Spezia Fried Chicken\n\n` +
      `Hello ${order.name}\n` +
      `Your order has been ACCEPTED\n\n` +
      `Total: ₹${order.total}\n\n` +
      `Pay here:\n${upiLink}`;

    window.open(
      `https://wa.me/91${order.phone}?text=${encodeURIComponent(msg)}`,
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