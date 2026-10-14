# Modern Furniture Store — Frontend

wwwroot/
├── index.html                  Entrada: redirige a la tienda
├── favicon.ico
├── images/                     Fotos (b1-b8 banners, p1-p16 productos)
├── css/
│   ├── main.css                Estilos globales de la tienda y login
│   └── admin.css               Estilos del panel administrativo
├── js/
│   ├── core/                   config.js (constantes) · auth.js (sesión y roles)
│   ├── auth/                   login.js
│   ├── admin/                  admin.js · facturacion.js · contabilidad.js
│   └── store/                  data.js (catálogo y carrito) · main.js · cart-page.js
└── pages/
    ├── home/index.html         Tienda
    ├── auth/login.html         Inicio de sesión y registro
    ├── cart/cart.html          Carrito
    └── admin/                  facturacion.html · contabilidad.html

Cuentas demo: admin@modern.com / admin123 · cliente@modern.com / cliente123
