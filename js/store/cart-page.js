/* Página del carrito: cantidades, totales, código promo y pago (genera factura) */
const continueShopping = () => location.href = MF.ROUTES.home + '#shop'; // lo usa el onclick del HTML

(function () {
  const $ = id => document.getElementById(id);
  let promo = 0; // porcentaje de descuento

  function render() {
    const items = MF.cart.get().map(i => ({ ...i, p: MF.product(i.id) })).filter(i => i.p);
    const empty = !items.length;
    $('emptyCart').hidden = !empty; $('cartSummary').hidden = empty;
    $('emptyCart').style.flex = '1'; $('cartList').style.flex = '1';

    $('cartList').innerHTML = empty ? '' : `
      <table class="cart-table">
        <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${items.map(i => `
          <tr>
            <td><div class="item-info"><img class="item-img" src="${i.p.img}" alt=""><div><div class="item-name">${MF.esc(i.p.name)}</div><span class="small-text muted">${MF.CATS[i.p.cat]}</span></div></div></td>
            <td>${MF.money(i.p.price)}</td>
            <td><input class="qty-input" type="number" min="1" max="99" value="${i.qty}" data-id="${i.id}" aria-label="Cantidad"></td>
            <td>${MF.money(i.p.price * i.qty)}</td>
            <td><button class="btn-remove" data-rm="${i.id}" aria-label="Quitar">✕</button></td>
          </tr>`).join('')}</tbody>
      </table>`;

    const sub = items.reduce((s, i) => s + i.p.price * i.qty, 0), disc = Math.round(sub * promo / 100);
    const taxes = Math.round((sub - disc) * MF.IVA);
    $('subtotal').textContent = MF.money(sub);
    $('taxes').textContent = MF.money(taxes);
    $('total').textContent = MF.money(sub - disc + taxes);
    let row = $('discRow');
    if (disc && !row) {
      row = document.createElement('div'); row.className = 'summary-row'; row.id = 'discRow';
      $('taxes').parentElement.before(row);
    }
    if (row) disc ? row.innerHTML = `<span>Descuento (${promo}%)</span><span>− ${MF.money(disc)}</span>` : row.remove();
    MF.cart.badge();
  }

  $('cartList').addEventListener('change', e => {
    if (e.target.classList.contains('qty-input')) { MF.cart.setQty(+e.target.dataset.id, parseInt(e.target.value) || 1); render(); }
  });
  $('cartList').addEventListener('click', e => {
    const b = e.target.closest('[data-rm]'); if (b) { MF.cart.remove(+b.dataset.rm); render(); }
  });

  /* Código promocional (demo: MODERN10) */
  $('promoCode').nextElementSibling.addEventListener('click', () => {
    const code = $('promoCode').value.trim().toUpperCase();
    promo = code === 'MODERN10' ? 10 : 0;
    MF.toast(promo ? 'Código aplicado: 10% de descuento' : 'Código no válido');
    render();
  });

  /* Pagar: exige sesión y genera una factura pendiente en el panel administrativo */
  $('cartSummary').querySelector('.btn-primary').addEventListener('click', () => {
    const s = MF.session();
    if (!s) return location.href = MF.ROUTES.login + '?next=' + encodeURIComponent(location.pathname);
    const items = MF.cart.get().map(i => ({ ...i, p: MF.product(i.id) })).filter(i => i.p);
    if (!items.length) return;
    const lines = items.map(i => ({ d: i.p.name, q: i.qty, p: i.p.price }));
    let sub = lines.reduce((t, l) => t + l.q * l.p, 0); sub -= Math.round(sub * promo / 100);
    const iva = Math.round(sub * MF.IVA), n = MF.load(MF.KEYS.seq, 0) + 1;
    if (promo) lines.push({ d: `Descuento ${promo}%`, q: 1, p: 0 }); // informativo; el total ya lo incluye
    const inv = MF.load(MF.KEYS.invoices, []);
    inv.unshift({ id: 'FAC-' + String(n).padStart(4, '0'), client: s.name, doc: s.email, date: MF.today(),
      items: lines.filter(l => l.p > 0), subtotal: sub, iva, total: sub + iva, status: 'pendiente', paidDate: null });
    MF.save(MF.KEYS.invoices, inv); MF.save(MF.KEYS.seq, n);
    MF.cart.clear(); promo = 0; render();
    MF.toast('¡Pedido registrado! Factura FAC-' + String(n).padStart(4, '0'));
  });

  render();
})();
