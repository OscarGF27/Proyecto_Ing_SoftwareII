/* Tienda (index): catálogo, filtros, modal, menú y contacto */
(function () {
  const $ = id => document.getElementById(id);
  let cat = 'todos', current = null;

  /* ---- Catálogo ---- */
  function render() {
    const list = MF.products.filter(p => cat === 'todos' || p.cat === cat);
    $('products').innerHTML = list.map(p => `
      <article class="card">
        <div class="img"><img src="${p.img}" alt="${MF.esc(p.name)}" loading="lazy"></div>
        <div class="info">
          <span class="cat">${MF.CATS[p.cat]}</span>
          <h3>${MF.esc(p.name)}</h3>
          <p class="price">${MF.money(p.price)}</p>
          <div class="actions">
            <button data-act="view" data-id="${p.id}">Ver</button>
            <button data-act="add" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </article>`).join('') || '<p class="muted">No hay productos en esta categoría.</p>';
  }

  $('filters').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    cat = c.dataset.cat;
    document.querySelectorAll('#filters .chip').forEach(x => x.classList.toggle('active', x === c));
    render();
  });

  $('products').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const p = MF.product(+b.dataset.id);
    b.dataset.act === 'view' ? openModal(p) : add(p);
  });

  function add(p) { MF.cart.add(p.id); MF.toast(p.name + ' agregado al carrito'); }

  /* ---- Modal ---- */
  function openModal(p) {
    current = p;
    $('mImg').innerHTML = `<img src="${p.img}" alt="${MF.esc(p.name)}">`;
    $('mThumbs').hidden = true; // una sola foto por producto
    $('mCat').textContent = MF.CATS[p.cat]; $('mName').textContent = p.name;
    $('mPrice').textContent = MF.money(p.price); $('mDesc').textContent = p.desc;
    $('modal').classList.add('open'); $('modal').setAttribute('aria-hidden', 'false');
  }
  const closeModal = () => { $('modal').classList.remove('open'); $('modal').setAttribute('aria-hidden', 'true'); };
  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  $('mAdd').addEventListener('click', () => { add(current); closeModal(); });

  /* ---- Navbar, menú móvil, contacto, WhatsApp ---- */
  $('burger').addEventListener('click', () => $('menu').classList.toggle('open'));
  $('menu').addEventListener('click', e => { if (e.target.closest('a')) $('menu').classList.remove('open'); });
  window.addEventListener('scroll', () => $('navbar').classList.toggle('scrolled', scrollY > 10));

  $('contactForm').addEventListener('submit', e => {
    e.preventDefault(); e.target.reset(); MF.toast('¡Mensaje enviado! Te responderemos pronto.');
  });
  $('whatsapp').href = 'https://wa.me/' + MF.WHATSAPP + '?text=' + encodeURIComponent('Hola, quiero más información sobre sus muebles.');

  render(); MF.cart.badge();
})();
