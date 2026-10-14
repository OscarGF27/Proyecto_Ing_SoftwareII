/* Base de las páginas administrativas: guardia de rol, usuario, logout y toast */
MF.toast = msg => {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
};
(function () {
  const s = MF.requireRole('admin');
  if (!s) return;
  document.getElementById('userName').textContent = s.name;
  document.getElementById('logoutBtn').addEventListener('click', MF.logout);
})();
