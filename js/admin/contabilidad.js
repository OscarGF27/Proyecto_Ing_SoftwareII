/* Contabilidad: libro de movimientos (facturas pagadas + movimientos manuales) */
(function () {
  const $ = s => document.querySelector(s), K = MF.KEYS;
  let filter = 'todos';

  let entries = MF.load(K.entries, null);
  if (!entries) { // datos de ejemplo la primera vez
    entries = [
      { id: 'm1', date: '2026-10-01', type: 'egreso', cat: 'Arriendo', concept: 'Arriendo bodega', amount: 1800000 },
      { id: 'm2', date: '2026-10-05', type: 'egreso', cat: 'Servicios', concept: 'Servicios públicos', amount: 420000 },
      { id: 'm3', date: '2026-10-06', type: 'egreso', cat: 'Nómina', concept: 'Nómina quincena', amount: 2500000 }
    ];
    MF.save(K.entries, entries);
  }

  const ledger = () => {
    const paid = MF.load(K.invoices, []).filter(i => i.status === 'pagada').map(i => ({
      id: i.id, date: i.paidDate || i.date, type: 'ingreso', cat: 'Ventas',
      concept: 'Factura ' + i.id + ' · ' + i.client, amount: i.subtotal, iva: i.iva, auto: true
    }));
    return [...paid, ...entries].sort((a, b) => b.date.localeCompare(a.date));
  };

  function render() {
    const all = ledger(), sum = t => all.filter(m => m.type === t).reduce((s, m) => s + m.amount, 0);
    const inc = sum('ingreso'), out = sum('egreso');
    $('#kIn').textContent = MF.money(inc); $('#kOut').textContent = MF.money(out);
    $('#kNet').textContent = MF.money(inc - out);
    $('#kIva').textContent = MF.money(all.reduce((s, m) => s + (m.iva || 0), 0));

    const rows = all.filter(m => filter === 'todos' || m.type === filter);
    $('#entBody').innerHTML = rows.length ? rows.map(m => `
      <tr>
        <td>${MF.fdate(m.date)}</td>
        <td>${MF.esc(m.concept)}</td>
        <td>${MF.esc(m.cat)}</td>
        <td><span class="badge ${m.type}">${m.type === 'ingreso' ? 'Ingreso' : 'Egreso'}</span></td>
        <td class="num">${m.type === 'egreso' ? '− ' : ''}${MF.money(m.amount)}</td>
        <td class="acts">${m.auto ? '<small class="muted">Automático</small>' : `<button class="link-btn danger" data-id="${m.id}">Eliminar</button>`}</td>
      </tr>`).join('') : '<tr><td colspan="6" class="tbl-empty">No hay movimientos para mostrar.</td></tr>';
  }

  $('#entForm').addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#entError'); err.textContent = '';
    const m = {
      id: 'm' + Date.now(), date: $('#eDate').value, type: $('#eType').value, cat: $('#eCat').value,
      concept: $('#eConcept').value.trim(), amount: parseFloat($('#eAmount').value) || 0
    };
    if (!m.date || !m.concept || m.amount <= 0) return err.textContent = 'Completa fecha, concepto y un valor mayor a 0.';
    entries.push(m); MF.save(K.entries, entries);
    $('#entForm').reset(); $('#eDate').value = MF.today();
    render(); MF.toast('Movimiento guardado');
  });

  $('#entBody').addEventListener('click', e => {
    const b = e.target.closest('[data-id]'); if (!b || !confirm('¿Eliminar este movimiento?')) return;
    entries = entries.filter(m => m.id !== b.dataset.id);
    MF.save(K.entries, entries); render();
  });

  $('#filters').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    filter = c.dataset.f;
    document.querySelectorAll('#filters .chip').forEach(x => x.classList.toggle('active', x === c));
    render();
  });

  $('#eDate').value = MF.today();
  render();
})();
