/* Inicio de sesión y registro con roles (demo con localStorage) */
(async function () {
  const $ = id => document.getElementById(id);
  const form = $('authForm'), err = $('formError'), btn = $('submitBtn');
  let mode = 'login';

  const hash = async t => {
    if (!window.crypto?.subtle) return t;
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  };
  const home = role => role === 'admin' ? MF.ROUTES.admin : MF.ROUTES.home;

  // Si ya hay sesión, redirigir
  const cur = MF.session();
  if (cur) { location.replace(home(cur.role)); return; }

  // Usuarios de prueba (solo la primera vez)
  let users = MF.load(MF.KEYS.users, null);
  if (!users) {
    users = [
      { name: 'Administrador', email: 'admin@modern.com', pass: await hash('admin123'), role: 'admin' },
      { name: 'Cliente Demo', email: 'cliente@modern.com', pass: await hash('cliente123'), role: 'cliente' }
    ];
    MF.save(MF.KEYS.users, users);
  }

  /* Tabs login / registro */
  const setMode = m => {
    mode = m; err.textContent = '';
    const reg = m === 'register';
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.mode === m));
    ['nameField', 'confirmField', 'termsField'].forEach(id => $(id).hidden = !reg);
    $('forgotLink').hidden = reg;
    $('authTitle').textContent = reg ? 'Crea tu cuenta' : 'Bienvenido de nuevo';
    $('authSub').textContent = reg ? 'Regístrate para comprar más rápido.' : 'Ingresa tus datos para continuar.';
    btn.textContent = reg ? 'Crear cuenta' : 'Iniciar sesión';
    $('password').autocomplete = reg ? 'new-password' : 'current-password';
  };
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));
  setMode('login');

  /* Mostrar / ocultar contraseña */
  document.querySelectorAll('.toggle-pass').forEach(b => b.addEventListener('click', () => {
    const inp = $(b.dataset.target || 'password');
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    b.textContent = show ? 'Ocultar' : 'Mostrar';
  }));

  $('forgotLink').addEventListener('click', e => {
    e.preventDefault();
    err.textContent = 'Para restablecer tu contraseña contacta al administrador.';
  });

  /* Envío */
  form.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = '';
    const email = $('email').value.trim().toLowerCase(), pass = $('password').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err.textContent = 'Ingresa un correo válido.';
    if (pass.length < 6) return err.textContent = 'La contraseña debe tener mínimo 6 caracteres.';

    btn.disabled = true;
    try {
      let user;
      if (mode === 'register') {
        const name = $('name').value.trim();
        if (name.length < 3) return err.textContent = 'Escribe tu nombre completo.';
        if (pass !== $('confirm').value) return err.textContent = 'Las contraseñas no coinciden.';
        if (!$('terms').checked) return err.textContent = 'Debes aceptar los términos y condiciones.';
        if (users.some(u => u.email === email)) return err.textContent = 'Ese correo ya está registrado.';
        user = { name, email, pass: await hash(pass), role: 'cliente' }; // el registro público siempre es cliente
        users.push(user); MF.save(MF.KEYS.users, users);
      } else {
        const h = await hash(pass);
        user = users.find(u => u.email === email && u.pass === h);
        if (!user) return err.textContent = 'Correo o contraseña incorrectos.';
      }
      MF.save(MF.KEYS.session, { name: user.name, email: user.email, role: user.role, ts: Date.now() });
      const next = new URLSearchParams(location.search).get('next');
      const safe = next && next.startsWith('/') && !next.startsWith('//');
      location.href = user.role === 'admin' && safe ? next : home(user.role);
    } finally { btn.disabled = false; }
  });
})();
