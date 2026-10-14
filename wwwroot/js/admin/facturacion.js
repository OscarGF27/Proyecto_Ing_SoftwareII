/* Facturación: crear, listar, marcar pagada y eliminar facturas */
(function () {
  const $ = s => document.querySelector(s), K = MF.KEYS;
  let filter = 'todas';

  const build = (id, client, doc, date, items, status) => {
    const subtotal = items.reduce((s, i) => s + i.q * i.p, 0), iva = Math.round(subtotal * MF.IVA);
    return { id, client, doc, date, items, subtotal, iva, total: subtotal + iva, status, paidDate: status === 'pagada' ? date : null };
  };

  let inv = MF.load(K.invoices, null);
  if (!inv) { // datos de ejemplo la primera vez
    inv = [
      build('FAC-0002', 'Laura Gómez', '1037456789', '2026-10-08', [{ d: 'Mesa de comedor', q: 1, p: 1290000 }, { d: 'Sillas (x4)', q: 1, p: 760000 }], 'pendiente'),
      build('FAC-0001', 'Casa Verde S.A.S.', '900123456-1', '2026-10-02', [{ d: 'Sofá modular', q: 2, p: 1850000 }], 'pagada')
    ];
    MF.save(K.invoices, inv); MF.save(K.seq, 2);
  }
  const persist = () => MF.save(K.invoices, inv);

  /* ---- Ítems del formulario ---- */
  const addRow = () => {
    const r = document.createElement('div');
    r.className = 'item-row';
    r.innerHTML = '<input class="i-desc" placeholder="Descripción" aria-label="Descripción">' +
      '<input class="i-qty" type="number" min="1" value="1" aria-label="Cantidad">' +
      '<input class="i-price" type="number" min="0" placeholder="Precio unitario" aria-label="Precio unitario">' +
      '<button type="button" class="btn-remove" aria-label="Quitar ítem">✕</button>';
    $('#items').appendChild(r);
  };
  const readItems = () => [...document.querySelectorAll('.item-row')].map(r => ({
    d: r.querySelector('.i-desc').value.trim(),
    q: Math.max(0, parseInt(r.querySelector('.i-qty').value) || 0),
    p: Math.max(0, parseFloat(r.querySelector('.i-price').value) || 0)
  }));
  const calc = () => {
    const sub = readItems().reduce((s, i) => s + i.q * i.p, 0), iva = Math.round(sub * MF.IVA);
    $('#tSub').textContent = MF.money(sub); $('#tIva').textContent = MF.money(iva); $('#tTotal').textContent = MF.money(sub + iva);
  };
  $('#addItem').addEventListener('click', addRow);
  $('#items').addEventListener('input', calc);
  $('#items').addEventListener('click', e => {
    if (!e.target.classList.contains('btn-remove')) return;
    if (document.querySelectorAll('.item-row').length > 1) e.target.closest('.item-row').remove();
    calc();
  });

  const resetForm = () => {
    $('#invForm').reset(); $('#date').value = MF.today();
    $('#items').innerHTML = ''; addRow(); calc();
  };

  $('#invForm').addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#invError'); err.textContent = '';
    const client = $('#client').value.trim(), doc = $('#doc').value.trim(), date = $('#date').value;
    const items = readItems().filter(i => i.d || i.q || i.p);
    if (!client || !doc || !date) return err.textContent = 'Completa cliente, documento y fecha.';
    if (!items.length || items.some(i => !i.d || i.q < 1 || i.p <= 0)) return err.textContent = 'Cada ítem necesita descripción, cantidad y precio mayor a 0.';
    const n = (MF.load(K.seq, 0) || 0) + 1; MF.save(K.seq, n);
    inv.unshift(build('FAC-' + String(n).padStart(4, '0'), client, doc, date, items, $('#status').value));
    persist(); resetForm(); render(); MF.toast('Factura emitida');
  });

  /* ---- Listado ---- */
  function render() {
    const sum = list => list.reduce((s, i) => s + i.total, 0);
    const paid = inv.filter(i => i.status === 'pagada'), pend = inv.filter(i => i.status === 'pendiente');
    $('#kTotal').textContent = MF.money(sum(inv)); $('#kPaid').textContent = MF.money(sum(paid));
    $('#kPend').textContent = MF.money(sum(pend)); $('#kCount').textContent = inv.length;

    const rows = inv.filter(i => filter === 'todas' || i.status === filter);
    $('#invBody').innerHTML = rows.length ? rows.map(i => `
      <tr>
        <td><strong>${i.id}</strong></td>
        <td>${MF.esc(i.client)}<br><small class="muted">${MF.esc(i.doc)}</small></td>
        <td>${MF.fdate(i.date)}</td>
        <td class="num">${MF.money(i.total)}</td>
        <td><span class="badge ${i.status}">${i.status === 'pagada' ? 'Pagada' : 'Pendiente'}</span></td>
        <td class="acts">
          ${i.status === 'pendiente' ? `<button class="link-btn" data-act="pay" data-id="${i.id}">Marcar pagada</button>` : ''}
          <button class="link-btn danger" data-act="del" data-id="${i.id}">Eliminar</button>
        </td>
      </tr>`).join('') : '<tr><td colspan="6" class="tbl-empty">No hay facturas para mostrar.</td></tr>';
  }

  $('#invBody').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const i = inv.find(x => x.id === b.dataset.id); if (!i) return;
    if (b.dataset.act === 'pay') { i.status = 'pagada'; i.paidDate = MF.today(); MF.toast(i.id + ' marcada como pagada'); }
    else if (confirm('¿Eliminar la factura ' + i.id + '? También saldrá de contabilidad.')) inv = inv.filter(x => x !== i);
    else return;
    persist(); render();
  });

  $('#filters').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    filter = c.dataset.f;
    document.querySelectorAll('#filters .chip').forEach(x => x.classList.toggle('active', x === c));
    render();
  });

  resetForm(); render();
})();
