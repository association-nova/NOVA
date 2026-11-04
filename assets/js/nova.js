// nova.js - نسخه سالم برای index.html و sky.html
(function(){
'use strict';
function $(s,c){ return (c||document).querySelector(s); }
function $$(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }

// تم شب و روز
try{
var saved = localStorage.getItem('nova-theme');
if(saved) document.documentElement.dataset.bsTheme = saved;
var themeBtn = $('#themeBtn');
if(themeBtn) themeBtn.addEventListener('click', function(){
var cur = document.documentElement.dataset.bsTheme === 'light' ? 'dark' : 'light';
document.documentElement.dataset.bsTheme = cur;
try{ localStorage.setItem('nova-theme', cur); }catch(e){}
});
}catch(e){}

// منوی موبایل
var menuBtn = $('#menuBtn'), menu = $('#menu');
if(menuBtn && menu){
menuBtn.addEventListener('click', function(){
var open = menu.classList.toggle('open');
menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
$$('#menu a, #menu button').forEach(function(a){
a.addEventListener('click', function(){ menu.classList.remove('open'); });
});
}

// ستاره‌های پس‌زمینه
try{
var cv = $('#sky');
if(cv && cv.getContext){
var ctx = cv.getContext('2d'), stars = [], W, H;
function resize(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize(); addEventListener('resize', resize);
for(var i=0;i<140;i++) stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.4+0.3,s:Math.random()*0.25+0.05});
(function loop(){
ctx.clearRect(0,0,W,H);
stars.forEach(function(st){
st.y += st.s/H; if(st.y>1) st.y=0;
ctx.globalAlpha = 0.35 + Math.random()*0.55;
ctx.fillStyle = '#cdd4ff';
ctx.beginPath(); ctx.arc(st.x*W, st.y*H, st.r, 0, 7); ctx.fill();
});
ctx.globalAlpha = 1;
requestAnimationFrame(loop);
})();
}
}catch(e){}

// ظاهر شدن با اسکرول
try{
var io = new IntersectionObserver(function(es){
es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('on'); io.unobserve(en.target); } });
},{threshold:0.12});
$$('.rv').forEach(function(elm){ io.observe(elm); });
}catch(e){
$$('.rv').forEach(function(elm){ elm.classList.add('on'); });
}

// مودال گالری - اگر در صفحه نبود خودش می‌سازد
function ensureModal(){
var m = $('#nv-modal');
if(m) return m;
m = document.createElement('div');
m.id = 'nv-modal';
m.setAttribute('role','dialog');
m.innerHTML = '<div class="box"><img id="nv-img" alt=""><div class="tx"><h3 id="nv-t"></h3><p id="nv-d"></p><button class="btn ghost sm cls" id="nv-close" type="button">بستن</button></div></div>';
m.style.cssText = 'position:fixed;inset:0;z-index:99;display:none;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,.75)';
document.body.appendChild(m);
var st = document.createElement('style');
st.textContent = '#nv-modal.open{display:flex}#nv-modal .box{max-width:640px;width:100%;background:var(--card,#0d1132);border:1px solid var(--line,#333);border-radius:16px;overflow:hidden}#nv-modal img{width:100%;max-height:60vh;object-fit:cover;display:block}#nv-modal .tx{padding:1.1rem 1.3rem}#nv-modal .tx p{color:var(--mut,#aaa)}#nv-modal .cls{display:block;margin:1rem auto 0}';
document.head.appendChild(st);
return m;
}
function openModal(title, desc, imgSrc){
var m = ensureModal();
var t = $('#nv-t', m), d = $('#nv-d', m), im = $('#nv-img', m);
if(t) t.textContent = title || '';
if(d) d.textContent = desc || '';
if(im){ if(imgSrc){ im.src = imgSrc; im.style.display='block'; } else { im.style.display='none'; } }
m.classList.add('open');
}
function closeModal(){ var m = $('#nv-modal'); if(m) m.classList.remove('open'); }
document.addEventListener('click', function(e){
var g = e.target.closest ? e.target.closest('.g') : null;
if(g){
var img = g.querySelector('img');
openModal(g.getAttribute('data-t')||'', g.getAttribute('data-d')||'', img ? img.src : '');
return;
}
if(e.target.closest && (e.target.closest('#nv-close') || e.target.id === 'nv-modal')) closeModal();
});
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

// اگر با sky.html#facts وارد شدی، بعد از لود اسکرول کن
function scrollToHash(){
var h = location.hash;
if(h){
var elm = document.querySelector(h);
if(elm) setTimeout(function(){ elm.scrollIntoView({behavior:'smooth', block:'start'}); }, 350);
}
}
addEventListener('load', scrollToHash);
scrollToHash();

// دکمه‌های قدیمی data-login
$$('[data-login]').forEach(function(b){
b.addEventListener('click', function(){ location.href = 'login/login.html'; });
});
})();
