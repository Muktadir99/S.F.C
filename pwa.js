if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(() => console.log("SW registered"))
      .catch(err => console.log("SW failed", err));
  });
}