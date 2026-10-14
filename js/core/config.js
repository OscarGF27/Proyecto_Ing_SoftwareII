/* Configuración global. Cargar SIEMPRE primero. */
window.MF = {
  KEYS: { session: 'mf_session', users: 'mf_users', invoices: 'mf_invoices', seq: 'mf_invoice_seq', entries: 'mf_entries' },
  ROUTES: { home: '/pages/home/index.html', login: '/pages/auth/login.html', cart: '/pages/cart/cart.html', admin: '/pages/admin/facturacion.html' },
  IVA: 0.19,
  load(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  save(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  money(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0); },
  esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  today() { return new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10); },
  fdate(d) { return d.split('-').reverse().join('/'); }
};
