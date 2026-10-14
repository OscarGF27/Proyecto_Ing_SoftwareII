/* Catálogo + carrito compartido (index y cart). Cada producto usa su foto /images/pN.png */
MF.products = [
  { id: 1,  name: 'Sillón Capitoné Blanco',     cat: 'sala',       price: 1290000, img: '/images/p1.png',  desc: 'Sillón tapizado en capitoné con cojín decorativo y patas de madera clara.' },
  { id: 2,  name: 'Sillón Orejero Azul',        cat: 'sala',       price: 1450000, img: '/images/p2.png',  desc: 'Orejero en terciopelo azul con botones y patas cónicas. Ideal como pieza de acento.' },
  { id: 3,  name: 'Sofá Chesterfield Café',     cat: 'sala',       price: 2890000, img: '/images/p3.png',  desc: 'Sofá de dos puestos en capitoné color café con estructura de madera oscura.' },
  { id: 4,  name: 'Sillón con Otomana Mostaza', cat: 'sala',       price: 1980000, img: '/images/p4.png',  desc: 'Sillón de lectura con otomana a juego en tono mostaza.' },
  { id: 5,  name: 'Silla Eames Gris',           cat: 'comedor',    price: 320000,  img: '/images/p5.png',  desc: 'Silla de asiento moldeado gris con patas de madera oscura y varillas metálicas.' },
  { id: 6,  name: 'Sofá Clásico Capitoné',      cat: 'sala',       price: 3150000, img: '/images/p6.png',  desc: 'Sofá largo de diseño clásico en capitoné blanco con patas de madera.' },
  { id: 7,  name: 'Silla Terciopelo Vino',      cat: 'dormitorio', price: 540000,  img: '/images/p7.png',  desc: 'Silla en terciopelo vino con patas doradas, perfecta para tocador o rincón de lectura.' },
  { id: 8,  name: 'Sillón Mostaza Moderno',     cat: 'sala',       price: 1150000, img: '/images/p8.png',  desc: 'Sillón de líneas modernas en tono mostaza con patas de madera.' },
  { id: 9,  name: 'Silla Giratoria Beige',      cat: 'dormitorio', price: 620000,  img: '/images/p9.png',  desc: 'Silla giratoria con cojín y base metálica negra. Cómoda para escritorio o habitación.' },
  { id: 10, name: 'Silla Eames Blanca',         cat: 'comedor',    price: 290000,  img: '/images/p10.png', desc: 'Silla blanca de asiento moldeado con patas de madera clara.' },
  { id: 11, name: 'Puf Nido de Ratán',          cat: 'sala',       price: 780000,  img: '/images/p11.png', desc: 'Asiento tipo nido en ratán tejido con cojines. Ideal para sala o terraza.' },
  { id: 12, name: 'Silla Tapizada Gris',        cat: 'comedor',    price: 480000,  img: '/images/p12.png', desc: 'Silla de comedor con respaldo alto tapizado en gris y patas de madera.' },
  { id: 13, name: 'Silla Tapizada Negra',       cat: 'dormitorio', price: 560000,  img: '/images/p13.png', desc: 'Silla tapizada en negro con cojín y patas de madera. Versátil para cualquier espacio.' },
  { id: 14, name: 'Sofá Blanco 3 Puestos',      cat: 'sala',       price: 2490000, img: '/images/p14.png', desc: 'Sofá blanco de tres puestos de líneas limpias, fácil de combinar.' },
  { id: 15, name: 'Sillas Colgantes de Ratán',  cat: 'sala',       price: 1690000, img: '/images/p15.png', desc: 'Pareja de sillas colgantes de ratán con cojines. Perfectas para balcón o terraza.' },
  { id: 16, name: 'Set Comedor Madera',         cat: 'comedor',    price: 2350000, img: '/images/p16.png', desc: 'Mesa de comedor en madera clara con sillas a juego.' }
];
MF.CATS = { sala: 'Sala', comedor: 'Comedor', dormitorio: 'Dormitorio' };
MF.product = id => MF.products.find(p => p.id === id);

/* Carrito: [{ id, qty }] en localStorage ('cart') */
MF.cart = {
  get() { return MF.load('cart', []); },
  set(c) { MF.save('cart', c); MF.cart.badge(); },
  count() { return MF.cart.get().reduce((s, i) => s + i.qty, 0); },
  add(id, n = 1) {
    const c = MF.cart.get(), it = c.find(i => i.id === id);
    it ? it.qty += n : c.push({ id, qty: n });
    MF.cart.set(c);
  },
  setQty(id, q) { MF.cart.set(MF.cart.get().map(i => i.id === id ? { ...i, qty: Math.min(99, Math.max(1, q)) } : i)); },
  remove(id) { MF.cart.set(MF.cart.get().filter(i => i.id !== id)); },
  clear() { MF.cart.set([]); },
  badge() { const b = document.getElementById('cartCount'); if (b) b.textContent = MF.cart.count(); }
};
MF.toast = MF.toast || (msg => {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2400);
});
