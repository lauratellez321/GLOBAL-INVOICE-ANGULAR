// Local usa la API local; el despliegue usa la API publicada.
window.__GLOBAL_INVOICE_API_URL__ = window.location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://global-invoice-nodejs-brown.vercel.app/api";
