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
   DOM
============================= */
const ordersBox = document.getElementById("orders");

/* =============================
   LIVE ORDERS LISTENER
============================= */
db.collection("orders")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    ordersBox.innerHTML = "";

    if (snapshot.empty) {
      ordersBox.innerHTML = `<p style="color:#aaa;">No orders yet</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const order = doc.data();

      // only show pending orders
      if (order.status !== "pending") return;

      let itemsHtml = "";
      order.items.forEach(item => {
        itemsHtml += `
          <div style="font-size:0.95rem;">
            ${item.name} × ${item.qty}
          </div>
        `;
      });

      ordersBox.innerHTML += `
        <div style="
          border:2px solid #f2c400;
          padding:1rem;
          margin-bottom:1rem;
          background:#111;
        ">
          <strong>${order.name}</strong><br>
          📞 ${order.phone}<br><br>

          ${itemsHtml}

          <br>
          <strong>Total: ₹${order.total}</strong><br><br>

          <button onclick="acceptOrder('${doc.id}')">Accept</button>
          <button onclick="completeOrder('${doc.id}')">Complete</button>
        </div>
      `;
    });
  });

/* =============================
   ACTIONS
============================= */
function acceptOrder(id) {
  db.collection("orders").doc(id).update({
    status: "accepted"
  });
}

function completeOrder(id) {
  db.collection("orders").doc(id).update({
    status: "completed"
  });
}