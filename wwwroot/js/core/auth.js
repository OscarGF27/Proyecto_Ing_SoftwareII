/* Sesión, guardia por rol y navbar de la tienda. Cargar después de config.js */
MF.session = () => MF.load(MF.KEYS.session, null);
MF.logout = () => { localStorage.removeItem(MF.KEYS.session); location.href = MF.ROUTES.home; };
MF.requireRole = role => {
  const s = MF.session();
  if (!s || s.role !== role) { location.replace(MF.ROUTES.login + '?next=' + encodeURIComponent(location.pathname)); return null; }
  return s;
};

/* Navbar de index/cart: cambia "Iniciar sesión" según el usuario */
document.addEventListener('DOMContentLoaded', () => {
  const s = MF.session(), a = document.getElementById('loginLink');
  if (!s || !a) return;
  const admin = s.role === 'admin';
  a.textContent = admin ? 'Panel administrativo' : 'Hola, ' + s.name.split(' ')[0];
  a.href = admin ? MF.ROUTES.admin : '#';
  const out = document.createElement('a');
  out.href = '#'; out.className = 'btn btn-ghost btn-sm'; out.textContent = 'Salir';
  out.addEventListener('click', e => { e.preventDefault(); MF.logout(); });
  a.after(out);
});
