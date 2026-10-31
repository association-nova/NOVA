/* نوا — nova.js */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (t, a = {}, ...k) => { const e = document.createElement(t); Object.assign(e, a); e.append(...k); return e; };
const api = async (u, o = {}) => { const r = await fetch(u, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...o }); if (!r.ok) throw r.status; return r.json(); };
const post = (u, b) => api(u, { method: 'POST', body: JSON.stringify(b) });

/* ---- منوی همبرگری ---- */
const menu = $('#menu'), mb = $('#menuBtn');
const setMenu = o => { menu.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); };
mb.addEventListener('click', e => { e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
menu.addEventListener('click', e => { if (e.target.closest('a,button')) setMenu(false); });
document.addEventListener('click', e => { if (!menu.contains(e.target)) setMenu(false); });
addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

/* ---- شب و روز (ذخیره در مرورگر) ---- */
$('#themeBtn').addEventListener('click', () => {
    const n = document.documentElement.dataset.bsTheme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.bsTheme = n;
    try { localStorage.setItem('nova-theme', n); } catch (_) { }
});

/* ---- ظاهر: ظهور بخش‌ها، بازگشت به بالا، پنجره‌ها، گالری ---- */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('on'), io.unobserve(e.target))), { threshold: .1 });
$$('.rv').forEach(el => io.observe(el));
const up = $('#toTop');
addEventListener('scroll', () => up.classList.toggle('show', scrollY > 600), { passive: true });
up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
$$('dialog').forEach(d => { $('.x', d).addEventListener('click', () => d.close()); d.addEventListener('click', e => e.target === d && d.close()); });
const lb = $('#lb');
$$('.g').forEach(b => b.addEventListener('click', () => { const i = $('img', b); $('img', lb).src = i.src; $('img', lb).alt = i.alt; $('p', lb).textContent = i.alt; lb.showModal(); }));

/* آسمان ستاره‌ای: یک‌بار رسم می‌شود (بدون انیمیشن مداوم، سبک) */
try {
    const c = $('#sky'), x = c.getContext('2d'); let lastW = 0, tm;
    const paint = () => {
        const w = c.width = innerWidth, hh = c.height = innerHeight; lastW = w;
        const dark = document.documentElement.dataset.bsTheme !== 'light';
        x.fillStyle = dark ? '#fff' : '#3a46b8';
        for (let i = 0, n = Math.min(220, (w * hh / 9000) | 0); i < n; i++) { x.globalAlpha = (dark ? .25 : .15) + Math.random() * .6; x.beginPath(); x.arc(Math.random() * w, Math.random() * hh, Math.random() * 1.2 + .2, 0, 7); x.fill(); }
    };
    addEventListener('resize', () => { if (innerWidth === lastW) return; clearTimeout(tm); tm = setTimeout(paint, 250); });
    $('#themeBtn').addEventListener('click', () => setTimeout(paint, 0));
    paint();
} catch (_) { }

/* ---- ویدیوها: از سرور خوانده می‌شود، وگرنه فهرست پیش‌فرض ---- */
const DEFAULT_VIDEOS = [{ title: 'زندگی در سیاره‌ای با دو خورشید؛ واقعیت علمی یا تخیل؟', hash: 'sox81n1' }];
const THUMBS = ['assets/img/3.jpg', 'assets/img/4.jpg', 'assets/img/7.jpg', 'assets/img/8.png'];
const vd = $('#vd');
async function loadVideos() {
    let list = []; try { list = await api('/api/videos'); } catch (_) { }
    if (!list.length) list = DEFAULT_VIDEOS;
    const box = $('#vids'); box.replaceChildren();
    list.forEach((v, i) => {
        const b = h('button', { type: 'button', className: 'vc' }, h('div', { className: 'th' }), h('div', {}, h('h3', { textContent: v.title }), h('p', { textContent: 'پخش در آپارات' })));
        $('.th', b).style.backgroundImage = `url(${THUMBS[i % THUMBS.length]})`;
        b.addEventListener('click', () => { $('.vf', vd).replaceChildren(h('iframe', { src: `https://www.aparat.com/video/video/embed/videohash/${encodeURIComponent(v.hash)}/vt/frame`, title: v.title, allowFullscreen: true })); vd.showModal(); });
        box.append(b);
    });
    for (let i = list.length; i < 3; i++) box.append(h('div', { className: 'vc soon' }, h('div', { className: 'th' }), h('div', {}, h('h3', { textContent: 'ویدیوی بعدی' }), h('p', { textContent: 'به‌زودی منتشر می‌شود' }))));
}
vd.addEventListener('close', () => $('.vf', vd).replaceChildren());
loadVideos();

/* ---- فرم عضویت ---- */
const fa = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const rules = {
    name: v => v.trim().length >= 3 || 'نام و نام خانوادگی را کامل وارد کنید.',
    cls: v => /^[\d\/\-\s]{1,10}$/.test(fa(v.trim())) || 'شماره کلاس معتبر نیست (مثال: ۸۰۲ یا ۱۰/۳).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'ایمیل معتبر نیست.',
    shad: v => /^@?[\w.]{3,40}$/.test(v.trim()) || 'آیدی شاد معتبر نیست (مثال: @username).'
};
const note = (el, m, good) => { el.style.display = 'block'; el.textContent = m; el.style.background = good ? '' : 'rgba(255,107,129,.2)'; };
const f = $('#f'), ok = $('#ok');
f.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    for (const k in rules) {
        const i = f.elements[k], r = rules[k](i.value);
        i.setAttribute('aria-invalid', r !== true); i.closest('label').querySelector('.err').textContent = r === true ? '' : r; if (r !== true) valid = false;
    }
    if (!valid) return;
    const btn = $('#submit-btn'); btn.disabled = true; btn.textContent = 'در حال ارسال...';
    const d = { name: f.elements.name.value.trim(), cls: fa(f.elements.cls.value.trim()), email: f.elements.email.value.trim(), shad: f.elements.shad.value.trim() };
    try {
        try { await post('/api/join', d); }
        catch (s) {
            if (s === 429) throw 'many';
            /* سرور اختصاصی در دسترس نیست (مثلاً میزبانی ایستا): ارسال از راه ایمیل */
            const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: f.elements.access_key.value, subject: f.elements.subject.value, name: d.name, class: d.cls, email: d.email, shad: d.shad }) });
            if (!(await r.json()).success) throw 0;
        }
        note(ok, 'درخواست شما ثبت شد. به‌زودی در شاد با شما تماس می‌گیریم. ✨', true); f.reset();
    } catch (er) { note(ok, er === 'many' ? 'تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.' : 'ارسال انجام نشد. اتصال اینترنت را بررسی کنید.', false); }
    btn.disabled = false; btn.textContent = 'ارسال درخواست';
});

/* ---- ورود رئیس و داشبورد (احراز هویت فقط سمت سرور) ---- */
const ld = $('#loginDlg'), lm = $('#loginMsg'), dash = $('#dash'), list = $('#dashList'), vAdd = $('#vAdd');
let tab = 'requests';
$$('[data-login]').forEach(b => b.addEventListener('click', () => ld.showModal()));
$('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const u = e.target.elements.username.value.trim(), p = e.target.elements.password.value;
    if (!u || !p) return note(lm, 'نام کاربری و رمز عبور را وارد کنید.', false);
    try { await post('/api/login', { username: u, password: p }); e.target.reset(); lm.style.display = 'none'; ld.close(); openDash(); }
    catch (s) { note(lm, s === 401 ? 'نام کاربری یا رمز عبور درست نیست.' : s === 429 ? 'تلاش‌های زیاد؛ ۱۰ دقیقه بعد دوباره امتحان کنید.' : 'سرور مدیریت در دسترس نیست. server.js را اجرا کنید.', false); }
});
const openDash = () => { dash.showModal(); showTab('requests'); };
const showTab = async t => {
    tab = t; $$('.tabs [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === t)); vAdd.hidden = t !== 'videos';
    list.replaceChildren(h('li', { className: 'mut', textContent: 'در حال بارگذاری...' }));
    try {
        const items = await api('/api/' + t); list.replaceChildren();
        if (!items.length) list.append(h('li', { className: 'mut', textContent: t === 'requests' ? 'هنوز درخواستی ثبت نشده است.' : 'ویدیویی اضافه نشده است.' }));
        items.forEach(it => {
            const del = h('button', { type: 'button', className: 'del', textContent: 'حذف' });
            del.addEventListener('click', async () => { if (confirm('حذف شود؟')) { await api(`/api/${t}/${it.id}`, { method: 'DELETE' }).catch(() => { }); showTab(t); if (t === 'videos') loadVideos(); } });
            list.append(t === 'requests'
                ? h('li', { className: 'req' }, h('b', { textContent: it.name }), h('span', { textContent: 'کلاس ' + it.cls }), h('span', { dir: 'ltr', textContent: it.email }), h('span', { dir: 'ltr', textContent: it.shad }), h('small', { textContent: new Date(it.at).toLocaleString('fa-IR') }), del)
                : h('li', { className: 'req' }, h('b', { textContent: it.title }), h('span', { dir: 'ltr', textContent: it.hash }), del));
        });
    } catch (s) { list.replaceChildren(h('li', { textContent: s === 401 ? 'نشست پایان یافته؛ دوباره وارد شوید.' : 'اتصال به سرور برقرار نیست.' })); }
};
$$('.tabs [data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
$('#logoutBtn').addEventListener('click', async () => { await post('/api/logout', {}).catch(() => { }); dash.close(); });
vAdd.addEventListener('submit', async e => {
    e.preventDefault();
    const title = vAdd.elements.title.value.trim(), link = vAdd.elements.link.value.trim();
    const hash = (/videohash\/([A-Za-z0-9]+)/.exec(link) || /\/v\/([A-Za-z0-9]+)/.exec(link) || /^([A-Za-z0-9]{3,20})$/.exec(link) || [])[1];
    if (!title || !hash) return alert('عنوان و لینک یا کد آپارات را درست وارد کنید.');
    try { await post('/api/videos', { title, hash }); vAdd.reset(); showTab('videos'); loadVideos(); } catch (_) { alert('افزودن انجام نشد.'); }
});
