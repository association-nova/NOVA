/* نوا — index.js */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ویدیوها: برای افزودن ویدیوی جدید، یک آیتم به این آرایه اضافه کنید.
   h = کد ویدیو در آپارات (بخش videohash در لینک embed) */
const VIDEOS = [
    { t: 'زندگی در سیاره‌ای با دو خورشید؛ واقعیت علمی یا تخیل؟', d: 'ویدیوی آموزشی انجمن نوا', h: 'sox81n1', img: 'assets/img/3.jpg' },
];

/* آسمان ستاره‌ای */
(() => {
    const c = $('#sky'), x = c.getContext('2d'); let S = [];
    const fit = () => { c.width = innerWidth; c.height = innerHeight; S = Array.from({ length: Math.round(c.width * c.height / 9000) }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.3 + .2, p: Math.random() * 6 })); };
    const draw = t => {
        x.clearRect(0, 0, c.width, c.height);
        const dark = document.documentElement.dataset.bsTheme !== 'light';
        x.fillStyle = dark ? '#fff' : '#3a46b8';
        S.forEach(s => { x.globalAlpha = (dark ? .35 : .18) + .4 * Math.abs(Math.sin(t / 1500 + s.p)); x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7); x.fill(); });
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(draw);
    };
    addEventListener('resize', fit); fit(); requestAnimationFrame(draw);
})();

/* منوی همبرگری */
const menu = $('#menu'), mb = $('#menuBtn');
const setMenu = o => { menu.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); };
mb.onclick = e => { e.stopPropagation(); setMenu(!menu.classList.contains('open')); };
menu.addEventListener('click', e => { if (e.target.closest('a,button')) setMenu(false); });
document.addEventListener('click', e => { if (!menu.contains(e.target)) setMenu(false); });
addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

/* حالت شب و روز (ذخیره در مرورگر) */
$('#themeBtn').onclick = () => {
    const n = document.documentElement.dataset.bsTheme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.bsTheme = n;
    try { localStorage.setItem('nova-theme', n); } catch (e) { }
};

/* انیمیشن ورود بخش‌ها و دکمه‌ی بازگشت به بالا */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('on'), io.unobserve(e.target))), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));
const up = $('#toTop');
addEventListener('scroll', () => up.classList.toggle('show', scrollY > 600), { passive: true });
up.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

/* پنجره‌ها */
$$('dialog').forEach(d => {
    $('.x', d).onclick = () => d.close();
    d.addEventListener('click', e => e.target === d && d.close());
});

/* گالری: نمایش تصویر بزرگ */
const lb = $('#lb');
$$('.g').forEach(b => b.onclick = () => {
    const i = $('img', b); $('img', lb).src = i.src; $('img', lb).alt = i.alt; $('p', lb).textContent = i.alt; lb.showModal();
});

/* ویدیوها */
const vd = $('#vd');
VIDEOS.forEach(v => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'vc';
    b.innerHTML = '<div class="th"></div><div><h3></h3><p></p></div>';
    $('.th', b).style.backgroundImage = `url(${v.img})`;
    $('h3', b).textContent = v.t; $('p', b).textContent = v.d;
    b.onclick = () => {
        $('.vf', vd).innerHTML = `<iframe src="https://www.aparat.com/video/video/embed/videohash/${encodeURIComponent(v.h)}/vt/frame" allowfullscreen title=""></iframe>`;
        $('iframe', vd).title = v.t; vd.showModal();
    };
    $('#vids').append(b);
});
vd.addEventListener('close', () => $('.vf', vd).innerHTML = '');

/* فرم عضویت: اعتبارسنجی و ارسال */
const fa = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const rules = {
    name: v => v.trim().length >= 3 || 'نام و نام خانوادگی را کامل وارد کنید.',
    age: v => (+fa(v) >= 5 && +fa(v) <= 100) || 'سن باید بین ۵ تا ۱۰۰ باشد.',
    phone: v => /^(0|\+98)?(9\d{9}|[1-8]\d{9})$/.test(fa(v).replace(/[\s-]/g, '')) || 'شماره تماس معتبر نیست.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'ایمیل معتبر نیست.',
    city: v => v.trim().length >= 2 || 'نام شهر را وارد کنید.',
    reason: v => v.trim().length >= 10 || 'دلیل علاقه را حداقل در ۱۰ نویسه بنویسید.'
};
const f = $('#f'), ok = $('#ok');
const show = (el, m, good) => { el.style.display = 'block'; el.textContent = m; el.style.background = good ? '' : 'rgba(255,107,129,.2)'; };
f.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(k => {
        const i = f.elements[k], r = rules[k](i.value), er = i.closest('label').querySelector('.err');
        i.setAttribute('aria-invalid', r !== true); er.textContent = r === true ? '' : r; if (r !== true) valid = false;
    });
    if (!valid) return;
    const btn = $('#submit-btn'); btn.disabled = true; btn.textContent = 'در حال ارسال...';
    try {
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(f))) });
        const j = await res.json();
        if (!j.success) throw 0;
        show(ok, 'درخواست شما ارسال شد. به‌زودی با شما تماس می‌گیریم.', true); f.reset();
    } catch (_) { show(ok, 'ارسال انجام نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.', false); }
    btn.disabled = false; btn.textContent = 'ارسال درخواست';
});

/* ورود رئیس: احراز هویت فقط سمت سرور.
   فرانت‌اند هیچ رمزی ندارد و فقط به /api/login درخواست می‌فرستد.
   تا وقتی بک‌اند آماده نشده، ورود امکان‌پذیر نیست (نسخه‌ی نمایشی). */
const ld = $('#loginDlg'), lm = $('#loginMsg'), dash = $('#dash');
$('#loginBtn').onclick = () => ld.showModal();
$('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const u = e.target.elements.username.value.trim(), p = e.target.elements.password.value;
    if (!u || !p) return show(lm, 'نام کاربری و رمز عبور را وارد کنید.', false);
    try {
        const r = await fetch('/api/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
        if (!r.ok) return show(lm, 'نام کاربری یا رمز عبور درست نیست.', false);
        e.target.reset(); lm.style.display = 'none'; ld.close(); dash.showModal();
    } catch (_) { show(lm, 'سرور ورود متصل نیست. این بخش در نسخه‌ی نمایشی فقط ساختار دارد.', false); }
});

/* داشبورد: داده‌ها از API سرور خوانده می‌شود (/api/requests، /api/images، /api/videos، /api/content) */
$$('.tabs button').forEach(b => b.onclick = async () => {
    $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    const ul = $('#dashList'); ul.innerHTML = '<li>در حال بارگذاری...</li>';
    try {
        const r = await fetch('/api/' + b.dataset.tab, { credentials: 'include' });
        if (!r.ok) throw 0;
        const items = await r.json(); ul.innerHTML = '';
        (items.length ? items : ['موردی ثبت نشده است.']).forEach(it => { const li = document.createElement('li'); li.textContent = typeof it === 'string' ? it : Object.values(it).join(' · '); ul.append(li); });
    } catch (_) { ul.innerHTML = '<li>اتصال به سرور برقرار نیست.</li>'; }
});
