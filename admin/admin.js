if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

/* =============================
   STATE
============================= */
let alertsEnabled = false;
let currentFilter = "pending";
let firstLoad = true;

let ding = null;
let ordersBox = null;

/* =============================
   DOM READY
============================= */
document.addEventListener("DOMContentLoaded", () => {
  ding = document.getElementById("ding");
  ordersBox = document.getElementById("orders");

  const enableBtn = document.getElementById("enableAlerts");

  if (enableBtn && ding) {
    enableBtn.addEventListener("click", () => {
      alertsEnabled = true;

      // unlock audio (required by mobile browsers)
      ding.play()
        .then(() => {
          ding.pause();
          ding.currentTime = 0;
        })
        .catch(() => {});

      // vibration test
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      enableBtn.textContent = "Alerts Enabled ✔️";
      enableBtn.disabled = true;
    });
  }

  // default tab
  setFilter("pending");
});

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
   FILTER CONTROL
============================= */
function setFilter(status) {
  currentFilter = status;

  document.querySelectorAll(".admin-tabs button").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.getAttribute("data-status") === status
    );
  });
}

/* =============================
   LIVE ORDERS LISTENER
============================= */
db.collection("orders")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {

    // sound + vibration on new order
    if (
      alertsEnabled &&
      !firstLoad &&
      snapshot.docChanges().some(c => c.type === "added")
    ) {
      if (ding) ding.play();
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    firstLoad = false;

    if (!ordersBox) return;
    ordersBox.innerHTML = "";

    let hasOrders = false;

    snapshot.forEach(doc => {
      const order = doc.data();
      if (order.status !== currentFilter) return;

      hasOrders = true;

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

          ${renderButtons(doc.id, order.status)}
        </div>
      `;
    });

    if (!hasOrders) {
      ordersBox.innerHTML = `<p style="color:#aaa;">No ${currentFilter} orders</p>`;
    }
  });

/* =============================
   BUTTON RENDER
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
  db.collection("orders").doc(id).update({ status: "accepted" });
}

function completeOrder(id) {
  db.collection("orders").doc(id).update({ status: "completed" });
}


