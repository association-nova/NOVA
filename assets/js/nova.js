(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const root = document.documentElement;
  root.classList.add('js');
  // اگر به هر دلیل افکت ظاهر شدن کار نکرد، بعد از ۲ ثانیه همه‌ی بخش‌ها نشان داده می‌شوند
  setTimeout(() => document.querySelectorAll('.rv').forEach(n => n.classList.add('on')), 2000);

  /* ===== تنظیمات رئیس =====
     نام کاربری و هش SHA-256 رمز. رمز پیش‌فرض: nova1405
     برای تغییر رمز: هش رمز جدید را از سایت‌های SHA-256 بگیرید و اینجا بگذارید. */
  const ADMIN_USER = 'rais';
  const ADMIN_HASH = '41c5bb5be14a81142fbfc902bd3a30dbe7d618d4ebe1a4b40c6f1a97ce7290bb';

  const db = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    kids.forEach(k => n.append(k));
    return n;
  };
  const sha = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))]
    .map(b => b.toString(16).padStart(2, '0')).join('');

  /* تم */
  $('#themeBtn').onclick = () => {
    const t = root.dataset.bsTheme === 'dark' ? 'light' : 'dark';
    root.dataset.bsTheme = t;
    try { localStorage.setItem('nova-theme', t); } catch (e) {}
  };

  /* منوی موبایل */
  const mb = $('#menuBtn'), menu = $('#menu');
  const closeMenu = () => { menu.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); };
  mb.onclick = () => mb.setAttribute('aria-expanded', menu.classList.toggle('open'));
  menu.addEventListener('click', e => { if (e.target.closest('a,button')) closeMenu(); });
  document.addEventListener('click', e => { if (!menu.contains(e.target) && !mb.contains(e.target)) closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 720) closeMenu(); });

  /* بازگشت به بالا + ظاهر شدن بخش‌ها */
  const topBtn = $('#toTop');
  addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 600), { passive: true });
  topBtn.onclick = () => scrollTo({ top: 0 });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: .08 });
  document.querySelectorAll('.rv').forEach(n => io.observe(n));

  /* آسمان پرستاره */
  const cv = $('#sky'), cx = cv.getContext('2d');
  let stars = [];
  const draw = () => {
    cv.width = innerWidth; cv.height = innerHeight;
    stars = Array.from({ length: Math.min(160, innerWidth / 6) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.4 + .3, p: Math.random() * 6 }));
  };
  const tick = t => {
    cx.clearRect(0, 0, cv.width, cv.height);
    if (root.dataset.bsTheme === 'dark') stars.forEach(s => { cx.globalAlpha = .35 + .35 * Math.sin(t / 900 + s.p); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.3); cx.fill(); });
    requestAnimationFrame(tick);
  };
  draw(); addEventListener('resize', draw);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);

  /* پنجره‌ها */
  document.querySelectorAll('dialog').forEach(d => {
    d.querySelector('.x').onclick = () => d.close();
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
  });
  const lb = $('#lb');
  document.querySelectorAll('.g').forEach(b => b.onclick = () => {
    const i = b.querySelector('img');
    lb.querySelector('img').src = i.src; lb.querySelector('img').alt = i.alt;
    lb.querySelector('p').textContent = i.alt; lb.showModal();
  });
  $('#vd').addEventListener('close', () => $('#vd .vf').innerHTML = '');

  /* ویدیوها */
  const defaults = [{ title: 'سفر به اعماق کهکشان' }, { title: 'منظومه‌ی شمسی' }, { title: 'کهکشان راه شیری' }];
  const videos = () => db.get('nova-videos', []);
  const renderVideos = () => {
    const box = $('#vids'); box.replaceChildren();
    const list = videos();
    (list.length ? list : defaults).forEach(v => {
      const b = el('button', { type: 'button', className: 'vc' + (v.id ? '' : ' soon') }, el('div', { className: 'th' }), el('h3', { textContent: v.title + (v.id ? '' : ' (به‌زودی)') }));
      if (v.id) b.onclick = () => {
        $('#vd .vf').replaceChildren(el('iframe', { src: `https://www.aparat.com/video/video/embed/videohash/${encodeURIComponent(v.id)}/vt/frame`, allowFullscreen: true, title: v.title }));
        $('#vd').showModal();
      };
      box.append(b);
    });
  };
  renderVideos();

  /* فرم عضویت */
  const f = $('#f');
  const rules = {
    name: v => v.trim().split(/\s+/).length >= 2 || 'نام و نام خانوادگی را کامل بنویسید.',
    cls: v => /^[0-9۰-۹\/]{2,6}$/.test(v.trim()) || 'شماره کلاس معتبر نیست.',
    shad: v => /^@?[A-Za-z0-9_.]{3,32}$/.test(v.trim()) || 'آیدی شاد معتبر نیست.',
    email: v => /^[^\s@]+@gmail\.com$/i.test(v.trim()) || 'یک ایمیل جیمیل معتبر وارد کنید.'
  };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    Object.keys(rules).forEach(k => {
      const i = f.elements[k], r = rules[k](i.value), err = i.parentElement.querySelector('.err');
      err.textContent = r === true ? '' : r;
      i.toggleAttribute('aria-invalid', r !== true);
      if (r !== true) ok = false;
    });
    if (!ok) return;
    const data = Object.fromEntries(new FormData(f));
    const reqs = db.get('nova-requests', []);
    reqs.unshift({ name: data.name.trim(), cls: data.cls.trim(), shad: data.shad.trim(), email: data.email.trim(), date: new Date().toLocaleDateString('fa-IR') });
    db.set('nova-requests', reqs);
    const msg = $('#ok'); msg.style.display = 'block';
    try {
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(f) });
      msg.textContent = r.ok ? '✨ درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.' : 'درخواست ذخیره شد اما ارسال ایمیل انجام نشد.';
    } catch (er) { msg.textContent = 'درخواست ذخیره شد اما ارسال ایمیل انجام نشد (اینترنت را بررسی کنید).'; }
    f.reset();
  });

  /* ورود رئیس و داشبورد */
  const dash = $('#dash'), list = $('#dashList'), vAdd = $('#vAdd');
  const isAdmin = () => sessionStorage.getItem('nova-admin') === '1';
  document.querySelectorAll('[data-login]').forEach(b => b.onclick = () => { closeMenu(); isAdmin() ? openDash() : $('#loginDlg').showModal(); });
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const fm = e.target, m = $('#loginMsg');
    const good = fm.username.value.trim() === ADMIN_USER && await sha(fm.password.value) === ADMIN_HASH;
    if (!good) { m.style.display = 'block'; m.textContent = 'نام کاربری یا رمز عبور اشتباه است.'; return; }
    sessionStorage.setItem('nova-admin', '1'); fm.reset(); m.style.display = 'none';
    $('#loginDlg').close(); openDash();
  });
  const openDash = () => { showTab('requests'); dash.showModal(); };
  const showTab = t => {
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    vAdd.hidden = t !== 'videos'; list.replaceChildren();
    if (t === 'requests') {
      const r = db.get('nova-requests', []);
      if (!r.length) list.append(el('li', { className: 'mut', textContent: 'هنوز درخواستی در این مرورگر ثبت نشده است.' }));
      r.forEach((q, i) => {
        const del = el('button', { type: 'button', className: 'del', textContent: 'حذف' });
        del.onclick = () => { r.splice(i, 1); db.set('nova-requests', r); showTab('requests'); };
        list.append(el('li', { className: 'req' }, el('b', { textContent: q.name }), el('span', { textContent: 'کلاس ' + q.cls }), el('span', { dir: 'ltr', textContent: q.email }), el('span', { dir: 'ltr', textContent: q.shad }), del, el('small', { textContent: 'تاریخ: ' + q.date })));
      });
    } else {
      videos().forEach((v, i) => {
        const del = el('button', { type: 'button', className: 'del', textContent: 'حذف' });
        del.onclick = () => { const a = videos(); a.splice(i, 1); db.set('nova-videos', a); renderVideos(); showTab('videos'); };
        list.append(el('li', { className: 'req' }, el('b', { textContent: v.title }), el('span', { dir: 'ltr', textContent: v.id }), del));
      });
    }
  };
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => showTab(b.dataset.tab));
  vAdd.addEventListener('submit', e => {
    e.preventDefault();
    const title = vAdd.elements.title.value.trim(), lk = vAdd.elements.link.value.trim(), m = lk.match(/\/v\/([A-Za-z0-9]+)/) || lk.match(/^([A-Za-z0-9]{4,})$/);
    if (!title || !m) return;
    db.set('nova-videos', [...videos(), { title, id: m[1] }]); vAdd.reset(); renderVideos(); showTab('videos');
  });
  $('#logoutBtn').onclick = () => { sessionStorage.removeItem('nova-admin'); dash.close(); };
})();
