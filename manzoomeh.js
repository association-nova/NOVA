const planetsData=[
{fa:"عطارد",en:"Mercury",size:.65,dist:10,speed:1.6,base:"#9e8d7d",type:"rock",desc:"نزدیک‌ترین سیاره به خورشید، بدون جو و پر از دهانه‌های برخوردی. اختلاف دمای شب و روز آن بیش از ۶۰۰ درجه است.",facts:["۴٬۸۷۹ کیلومتر","۵۷٫۹ میلیون کیلومتر","۸۸ روز","۱۸۰- تا ۴۳۰ درجه"]},
{fa:"زهره",en:"Venus",size:1,dist:13.5,speed:1.2,base:"#e8c47a",type:"band",desc:"داغ‌ترین سیاره با جو غلیظ دی‌اکسیدکربن. در جهت معکوس می‌چرخد و روز آن از سالش طولانی‌تر است.",facts:["۱۲٬۱۰۴ کیلومتر","۱۰۸٫۲ میلیون کیلومتر","۲۲۵ روز","۴۶۴ درجه"]},
{fa:"زمین",en:"Earth",size:1.1,dist:17,speed:1,base:"#2f9dff",type:"earth",desc:"تنها سیاره شناخته‌شده با حیات. ۷۱ درصد سطح آن آب است، میدان مغناطیسی و جو اکسیژنی دارد و یک قمر به نام ماه دور آن می‌چرخد.",facts:["۱۲٬۷۴۲ کیلومتر","۱۴۹٫۶ میلیون کیلومتر","۳۶۵٫۲۵ روز","میانگین ۱۵ درجه"]},
{fa:"مریخ",en:"Mars",size:.8,dist:20.5,speed:.8,base:"#d1543a",type:"rock",desc:"سیاره سرخ با غبار اکسید آهن. بلندترین آتشفشان منظومه المپوس اینجاست. دو قمر کوچک فوبوس و دیموس دارد.",facts:["۶٬۷۷۹ کیلومتر","۲۲۷٫۹ میلیون کیلومتر","۶۸۷ روز","میانگین ۶۳- درجه"]},
{fa:"مشتری",en:"Jupiter",size:2.6,dist:26.5,speed:.5,base:"#d8a05e",type:"gas",desc:"بزرگ‌ترین سیاره؛ ۳۱۸ برابر زمین. لکه سرخ طوفانی بزرگ‌تر از زمین است که صدها سال ادامه دارد.",facts:["۱۳۹٬۸۲۰ کیلومتر","۷۷۸ میلیون کیلومتر","۱۱٫۸۶ سال","۱۱۰- درجه"]},
{fa:"زحل",en:"Saturn",size:2.2,dist:33,speed:.4,base:"#e3c98a",type:"gas",desc:"پادشاه حلقه‌ها با هزاران حلقه یخی. قمر تیتان آن جو غلیظ و دریاچه‌های متان دارد.",facts:["۱۱۶٬۴۶۰ کیلومتر","۱٫۴ میلیارد کیلومتر","۲۹٫۴ سال","۱۴۰- درجه"]},
{fa:"اورانوس",en:"Uranus",size:1.5,dist:38.5,speed:.3,base:"#7de3e0",type:"ice",desc:"غول یخی که ۹۸ درجه کج خوابیده است. متان به آن رنگ فیروزه‌ای داده و سردترین جو را دارد.",facts:["۵۰٬۷۲۴ کیلومتر","۲٫۸ میلیارد کیلومتر","۸۴ سال","۱۹۵- درجه"]},
{fa:"نپتون",en:"Neptune",size:1.45,dist:43.5,speed:.25,base:"#4a6cf7",type:"ice",desc:"دورترین سیاره با بادهای ۲۱۰۰ کیلومتری، سریع‌ترین در منظومه. یک سال آن ۱۶۴ سال زمینی است.",facts:["۴۹٬۲۴۴ کیلومتر","۴٫۵ میلیارد کیلومتر","۱۶۴٫۸ سال","۲۰۰- درجه"]}
];
const sunInfo={fa:"خورشید — ستاره ما",en:"Sun | G2V",desc:"ستاره منظومه ما با قطر ۱٫۳۹ میلیون کیلومتر که ۹۹٫۸۶ درصد جرم منظومه را دارد. دمای سطح ۵۵۰۰ و مرکز ۱۵ میلیون درجه است.",facts:["۱٬۳۹۲٬۷۰۰ کیلومتر","ستاره مرکزی","۲۵ روز چرخش","۵۵۰۵ درجه سطح"]};
const scopeInfo={
tube:{t:"لوله اصلی تلسکوپ",d:"بدنه اصلی که نور را از غبار و نور مزاحم حفظ می‌کند و مسیر نور تا چشمی را تاریک و پایدار نگه می‌دارد.",s:["آلومینیوم سبک","حفاظت مسیر نوری","هرچه بلندتر دقیق‌تر"]},
objective:{t:"عدسی شیئی / آینه اصلی",d:"مهم‌ترین قطعه؛ نور ستارگان را جمع می‌کند. هرچه قطر آن بزرگ‌تر باشد تصویر روشن‌تر است.",s:["شیشه ED","جمع‌آوری نور","قطر = قدرت"]},
eyepiece:{t:"چشمی و فوکوسر",d:"چشمی مثل ذره‌بین تصویر را بزرگ می‌کند. فوکوسر با پیچ چرخان تصویر را شارپ می‌کند.",s:["۲۵mm میدان باز","۱۰mm جزئیات","پیچ فوکوس نرم"]},
finder:{t:"جوینده",d:"تلسکوپ کوچک روی لوله برای پیدا کردن سریع هدف مثل ماه و مشتری.",s:["۶x30 استاندارد","تنظیم با ۳ پیچ","یابنده نقطه قرمز"]},
mount:{t:"پایه استوایی",d:"لرزش را می‌گیرد و اجازه می‌دهد تلسکوپ نرم به دنبال ستارگان بچرخد.",s:["استوایی EQ3","تعقیب ستاره‌ای","تحمل ۵ کیلوگرم"]},
tripod:{t:"سه‌پایه",d:"وزن کل را تحمل و لرزش زمین را جذب می‌کند.",s:["فولاد ضدزنگ","قفل ضخیم","سینی تجهیزات"]},
knob:{t:"پیچ تنظیم دقیق",d:"برای جابه‌جایی میلی‌متری و نگه داشتن سوژه وسط کادر بدون لرزش.",s:["حرکت نرم","کنترل کابلی","قفل محور"]}
};
let sScene,sCam,sRen,sCtl,sunMesh,glow1,glow2,planetObjs=[],orbitGroup,angles=[],speedF=1,paused=false,showOrbits=true,showLabels=true,labelDivs=[];
let tScene,tCam,tRen,tCtl,tGroup,tPick=[];
let downX=0,downY=0,tDownX=0,tDownY=0;
function makeTex(fn){const c=document.createElement("canvas");c.width=512;c.height=256;const x=c.getContext("2d");fn(x,512,256);return new THREE.CanvasTexture(c);}
function planetTexture(p){
if(p.type==="earth")return makeTex((x,W,H)=>{x.fillStyle="#1a5fc1";x.fillRect(0,0,W,H);x.fillStyle="#2fa15c";for(let i=0;i<14;i++){x.beginPath();x.ellipse(Math.random()*W,H*0.15+Math.random()*H*0.7,20+Math.random()*70,10+Math.random()*30,Math.random(),0,7);x.fill();}x.fillStyle="rgba(255,255,255,.85)";for(let i=0;i<50;i++){x.beginPath();x.ellipse(Math.random()*W,Math.random()*H,20+Math.random()*40,3+Math.random()*6,0,0,7);x.fill();}x.fillStyle="#fff";x.fillRect(0,0,W,14);x.fillRect(0,H-16,W,16);});
if(p.type==="gas")return makeTex((x,W,H)=>{x.fillStyle=p.base;x.fillRect(0,0,W,H);const cols=["rgba(255,255,255,.35)","rgba(120,60,20,.35)","rgba(255,220,160,.4)","rgba(150,90,40,.3)"];for(let y=0;y<H;y+=12){x.fillStyle=cols[Math.floor(y/12)%cols.length];x.fillRect(0,y,W,9);}x.fillStyle="rgba(200,60,30,.8)";x.beginPath();x.ellipse(W*0.65,H*0.62,38,20,0,0,7);x.fill();});
if(p.type==="band")return makeTex((x,W,H)=>{x.fillStyle=p.base;x.fillRect(0,0,W,H);for(let i=0;i<30;i++){x.fillStyle="rgba(255,255,255,"+(Math.random()*.18)+")";x.fillRect(0,Math.random()*H,W,2+Math.random()*8);}});
if(p.type==="ice")return makeTex((x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,p.base);g.addColorStop(.5,"#cffffe");g.addColorStop(1,p.base);x.fillStyle=g;x.fillRect(0,0,W,H);x.fillStyle="rgba(255,255,255,.25)";for(let i=0;i<8;i++)x.fillRect(0,i*32+Math.random()*10,W,3);});
return makeTex((x,W,H)=>{x.fillStyle=p.base;x.fillRect(0,0,W,H);for(let i=0;i<180;i++){x.fillStyle="rgba(0,0,0,"+(Math.random()*.35)+")";x.beginPath();x.arc(Math.random()*W,Math.random()*H,1+Math.random()*6,0,7);x.fill();}});
}
function ringTexture(){return makeTex((x,W,H)=>{x.clearRect(0,0,W,H);for(let i=0;i<60;i++){x.fillStyle="rgba("+(220-i)+","+(200-i)+","+(160-i)+","+(0.25+Math.random()*0.6)+")";x.fillRect(i*9,0,5,H);}});}
function initSolar(){
const wrap=document.getElementById("solar-wrap");
const cv=document.getElementById("solar-canvas");
sScene=new THREE.Scene();
sCam=new THREE.PerspectiveCamera(50,wrap.clientWidth/wrap.clientHeight,.1,2000);
if(wrap.clientWidth<720){sCam.position.set(0,54,94);}else{sCam.position.set(0,40,72);}
sCam.lookAt(0,0,0);
sRen=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:"high-performance"});
sRen.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
sRen.setSize(wrap.clientWidth,wrap.clientHeight,false);
sRen.outputEncoding=THREE.sRGBEncoding;
try{sCtl=new THREE.OrbitControls(sCam,sRen.domElement);sCtl.enableDamping=true;sCtl.dampingFactor=.06;sCtl.maxDistance=180;sCtl.minDistance=8;}catch(e){}
sScene.add(new THREE.AmbientLight(0x8a9bff,.65));
sScene.add(new THREE.PointLight(0xfff2d6,2.1,0,1.2));
sScene.add(new THREE.HemisphereLight(0x4d6fff,0x0a0a18,.35));
const sg=new THREE.BufferGeometry();const pos=[];
for(let i=0;i<3500;i++){const r=300+Math.random()*600,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pos.push(r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));}
sg.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));
sScene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.1,sizeAttenuation:false,transparent:true,opacity:.9})));
const sunTex=makeTex((x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#fff6c8");g.addColorStop(.5,"#ffc93c");g.addColorStop(1,"#ff7a00");x.fillStyle=g;x.fillRect(0,0,W,H);});
sunMesh=new THREE.Mesh(new THREE.SphereGeometry(5,64,64),new THREE.MeshBasicMaterial({map:sunTex}));
sunMesh.userData.planetIndex=-1;sScene.add(sunMesh);
glow1=new THREE.Mesh(new THREE.SphereGeometry(6.2,32,32),new THREE.MeshBasicMaterial({color:0xff9d00,transparent:true,opacity:.32}));
glow2=new THREE.Mesh(new THREE.SphereGeometry(7.6,32,32),new THREE.MeshBasicMaterial({color:0xff6a00,transparent:true,opacity:.14}));
sScene.add(glow1);sScene.add(glow2);
orbitGroup=new THREE.Group();sScene.add(orbitGroup);
const labels=document.getElementById("labels");labels.innerHTML="";labelDivs=[];planetObjs=[];angles=[];
planetsData.forEach((p,i)=>{
const g=new THREE.Group();sScene.add(g);
const m=new THREE.Mesh(new THREE.SphereGeometry(p.size,64,64),new THREE.MeshStandardMaterial({map:planetTexture(p),roughness:.55,metalness:.12}));
m.userData.planetIndex=i;g.add(m);
if(i===2){const at=new THREE.Mesh(new THREE.SphereGeometry(p.size*1.08,48,48),new THREE.MeshBasicMaterial({color:0x5db6ff,transparent:true,opacity:.22}));at.userData.planetIndex=i;g.add(at);const moon=new THREE.Mesh(new THREE.SphereGeometry(.24,24,24),new THREE.MeshStandardMaterial({color:0xdddddd,roughness:.9}));moon.name="moon";moon.userData.planetIndex=i;m.add(moon);}
if(i===5){const rt=ringTexture();rt.wrapS=rt.wrapT=THREE.RepeatWrapping;const ring=new THREE.Mesh(new THREE.RingGeometry(p.size*1.25,p.size*2.2,96),new THREE.MeshBasicMaterial({map:rt,side:THREE.DoubleSide,transparent:true,opacity:.95}));ring.rotation.x=Math.PI/2.25;m.add(ring);}
if(i===6){const ring=new THREE.Mesh(new THREE.RingGeometry(p.size*1.5,p.size*1.9,64),new THREE.MeshBasicMaterial({color:0x9be8e5,side:THREE.DoubleSide,transparent:true,opacity:.45}));ring.rotation.x=Math.PI/2.3;m.add(ring);}
planetObjs.push({group:g,mesh:m});angles.push(i*0.8+0.3);
const pts=[];for(let a=0;a<=180;a++){const t=a/180*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(t)*p.dist,0,Math.sin(t)*p.dist));}
orbitGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x6d8bff,transparent:true,opacity:.42})));
const d=document.createElement("div");d.className="planet-label";d.innerText=p.fa;labels.appendChild(d);labelDivs.push(d);
});
sRen.domElement.addEventListener("pointerdown",e=>{downX=e.clientX;downY=e.clientY;});
sRen.domElement.addEventListener("pointerup",e=>{
if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)return;
const r=sRen.domElement.getBoundingClientRect();
const mouse=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
const ray=new THREE.Raycaster();ray.setFromCamera(mouse,sCam);
const hit=ray.intersectObjects([sunMesh,...planetObjs.map(o=>o.mesh)],false)[0];
if(hit)showPlanet(hit.object.userData.planetIndex);
});
sRen.domElement.addEventListener("dblclick",fitAll);
}
function fitAll(){if(!sCam)return;const w=document.getElementById("solar-wrap");if(w.clientWidth<720){sCam.position.set(0,54,94);}else{sCam.position.set(0,40,72);}if(sCtl){sCtl.target.set(0,0,0);sCtl.update();}}
function showPlanet(i){
document.querySelectorAll("#planet-chips button").forEach(b=>b.classList.toggle("active",+b.dataset.i===i));
const n=document.getElementById("planet-name"),e=document.getElementById("planet-en"),d=document.getElementById("planet-desc"),f=document.getElementById("planet-facts");
if(i===-1){n.innerText=sunInfo.fa;e.innerText=sunInfo.en;d.innerText=sunInfo.desc;f.innerHTML="<div><b>قطر</b><span>"+sunInfo.facts[0]+"</span></div><div><b>نوع</b><span>"+sunInfo.facts[1]+"</span></div><div><b>چرخش</b><span>"+sunInfo.facts[2]+"</span></div><div><b>دما</b><span>"+sunInfo.facts[3]+"</span></div>";return;}
const p=planetsData[i];n.innerText=p.fa;e.innerText=p.en;d.innerText=p.desc;
const L=["قطر","فاصله از خورشید","یک سال","دما"];
f.innerHTML=L.map((t,k)=>"<div><b>"+t+"</b><span>"+p.facts[k]+"</span></div>").join("");
}
function initTelescope(){
const wrap=document.getElementById("telescope-wrap");
const cv=document.getElementById("telescope-canvas");
tScene=new THREE.Scene();tScene.fog=new THREE.Fog(0x070c1d,20,50);
tCam=new THREE.PerspectiveCamera(48,wrap.clientWidth/wrap.clientHeight,.1,200);
tCam.position.set(7.5,5.2,9.5);
tRen=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:"high-performance"});
tRen.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
tRen.setSize(wrap.clientWidth,wrap.clientHeight,false);
tRen.outputEncoding=THREE.sRGBEncoding;
tRen.shadowMap.enabled=true;tRen.shadowMap.type=THREE.PCFSoftShadowMap;
try{tCtl=new THREE.OrbitControls(tCam,tRen.domElement);tCtl.target.set(0,2.4,0);tCtl.enableDamping=true;tCtl.maxDistance=26;tCtl.minDistance=4;}catch(e){}
tScene.add(new THREE.AmbientLight(0x8ea2ff,.6));
const key=new THREE.DirectionalLight(0xffffff,1.25);key.position.set(6,10,6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);tScene.add(key);
const rim=new THREE.PointLight(0x7dd3fc,1.1,30);rim.position.set(-6,4,-5);tScene.add(rim);
const ground=new THREE.Mesh(new THREE.CircleGeometry(15,64),new THREE.MeshStandardMaterial({color:0x0d1730,roughness:.85}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;tScene.add(ground);
tScene.add(new THREE.GridHelper(28,28,0x2a3d7a,0x1a2450));
tGroup=new THREE.Group();tScene.add(tGroup);tPick=[];
const white=new THREE.MeshStandardMaterial({color:0xf1f5fa,roughness:.28,metalness:.3});
const black=new THREE.MeshStandardMaterial({color:0x161c29,roughness:.45,metalness:.55});
const metal=new THREE.MeshStandardMaterial({color:0xaab6cf,roughness:.25,metalness:.9});
const gold=new THREE.MeshStandardMaterial({color:0xd9a91e,roughness:.3,metalness:.85});
const glass=new THREE.MeshStandardMaterial({color:0x7dd3fc,roughness:.08,metalness:.25,transparent:true,opacity:.75,emissive:0x0a3a5a});
function add(mesh,part){mesh.castShadow=true;mesh.userData.part=part;tGroup.add(mesh);tPick.push(mesh);return mesh;}
for(let i=0;i<3;i++){const piv=new THREE.Group();piv.rotation.y=i*Math.PI*2/3;tGroup.add(piv);const leg=new THREE.Mesh(new THREE.CylinderGeometry(.1,.06,3.9,24),black);leg.position.set(1,1.7,0);leg.rotation.z=.48;leg.castShadow=true;leg.userData.part="tripod";piv.add(leg);tPick.push(leg);}
const hub=add(new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.32,32),metal),"tripod");hub.position.y=3;
const mountBox=add(new THREE.Mesh(new THREE.BoxGeometry(.85,.42,.85),gold),"mount");mountBox.position.y=3.32;
const tilt=new THREE.Group();tilt.position.set(0,3.75,0);tilt.rotation.z=.2;tGroup.add(tilt);
function tubeAdd(m){m.castShadow=true;tilt.add(m);tPick.push(m);return m;}
const tube=new THREE.Mesh(new THREE.CylinderGeometry(.56,.66,3.5,48),white);tube.rotation.z=Math.PI/2;tube.userData.part="tube";tubeAdd(tube);
const shield=new THREE.Mesh(new THREE.CylinderGeometry(.69,.69,.72,48),black);shield.rotation.z=Math.PI/2;shield.position.x=1.9;shield.userData.part="tube";tubeAdd(shield);
const rimT=new THREE.Mesh(new THREE.TorusGeometry(.67,.075,18,48),gold);rimT.rotation.y=Math.PI/2;rimT.position.x=2.26;rimT.userData.part="objective";tubeAdd(rimT);
const lens=new THREE.Mesh(new THREE.CircleGeometry(.61,48),glass);lens.rotation.y=Math.PI/2;lens.position.x=2.25;lens.userData.part="objective";tubeAdd(lens);
const focus=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.62,24),metal);focus.rotation.z=Math.PI/2;focus.position.x=-2;focus.userData.part="eyepiece";tubeAdd(focus);
const eye=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,.48,24),black);eye.rotation.z=Math.PI/2;eye.position.x=-2.36;eye.userData.part="eyepiece";tubeAdd(eye);
const finder=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,1.05,24),black);finder.rotation.z=Math.PI/2;finder.position.set(.4,.82,0);finder.userData.part="finder";tubeAdd(finder);
const f1=new THREE.Mesh(new THREE.BoxGeometry(.09,.28,.09),metal);f1.position.set(.05,.62,0);f1.userData.part="finder";tubeAdd(f1);
const f2=f1.clone();f2.position.x=.75;f2.userData.part="finder";tubeAdd(f2);
const k1=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.36,24),gold);k1.position.set(-.4,-.72,.2);k1.userData.part="knob";tubeAdd(k1);
const k2=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.55,20),metal);k2.rotation.x=Math.PI/2;k2.position.set(-.6,-.2,.62);k2.userData.part="knob";tubeAdd(k2);
tRen.domElement.addEventListener("pointerdown",e=>{tDownX=e.clientX;tDownY=e.clientY;});
tRen.domElement.addEventListener("pointerup",e=>{
if(Math.hypot(e.clientX-tDownX,e.clientY-tDownY)>6)return;
const r=tRen.domElement.getBoundingClientRect();
const mouse=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
const ray=new THREE.Raycaster();ray.setFromCamera(mouse,tCam);
const hit=ray.intersectObjects(tPick,false)[0];
if(hit)showPart(hit.object.userData.part);
});
showPart("tube");
}
function showPart(id){
const info=scopeInfo[id];if(!info)return;
document.getElementById("scope-title").innerText=info.t;
document.getElementById("scope-desc").innerText=info.d;
const L=["ویژگی","کاربرد","نکته"];
document.getElementById("scope-specs").innerHTML=L.map((t,k)=>"<div><b>"+t+"</b><span>"+info.s[k]+"</span></div>").join("");
document.querySelectorAll("#scope-chips button").forEach(b=>b.classList.toggle("active",b.dataset.part===id));
}
const clock=new THREE.Clock();
function animate(){
requestAnimationFrame(animate);
const dt=Math.min(clock.getDelta(),.05);
const t=clock.elapsedTime;
if(sRen){
if(!paused){planetObjs.forEach((o,i)=>{angles[i]+=planetsData[i].speed*speedF*dt*.45;const d=planetsData[i].dist;o.group.position.set(Math.cos(angles[i])*d,0,Math.sin(angles[i])*d);o.mesh.rotation.y+=dt*.55;const moon=o.mesh.getObjectByName("moon");if(moon){moon.position.x=Math.cos(t*1.4)*1.9;moon.position.z=Math.sin(t*1.4)*1.9;}});sunMesh.rotation.y+=dt*.08;const s=1+Math.sin(t*2)*0.015;glow1.scale.set(s,s,s);}
orbitGroup.visible=showOrbits;
if(sCtl)sCtl.update();
sRen.render(sScene,sCam);
const w=document.getElementById("solar-wrap");
planetObjs.forEach((o,i)=>{
const v=new THREE.Vector3();o.mesh.getWorldPosition(v);v.project(sCam);
const el=labelDivs[i];if(!el)return;
if(!showLabels||v.z>1){el.style.display="none";return;}
el.style.display="block";
el.style.left=((v.x*.5+.5)*w.clientWidth)+"px";
el.style.top=((-v.y*.5+.5)*w.clientHeight)+"px";
});
}
if(tRen){tGroup.rotation.y+=dt*.22;if(tCtl)tCtl.update();tRen.render(tScene,tCam);}
}
function onResize(){
const sw=document.getElementById("solar-wrap");if(sRen&&sw){sCam.aspect=sw.clientWidth/sw.clientHeight;sCam.updateProjectionMatrix();sRen.setSize(sw.clientWidth,sw.clientHeight,false);}
const tw=document.getElementById("telescope-wrap");if(tRen&&tw){tCam.aspect=tw.clientWidth/tw.clientHeight;tCam.updateProjectionMatrix();tRen.setSize(tw.clientWidth,tw.clientHeight,false);}
}
window.addEventListener("resize",onResize);
window.addEventListener("load",()=>{
initSolar();initTelescope();animate();onResize();fitAll();
document.querySelectorAll("#planet-chips button").forEach(b=>b.addEventListener("click",()=>showPlanet(+b.dataset.i)));
document.querySelectorAll("#scope-chips button").forEach(b=>b.addEventListener("click",()=>showPart(b.dataset.part)));
document.getElementById("pauseBtn").addEventListener("click",e=>{paused=!paused;e.target.innerText=paused?"ادامه":"توقف";});
document.getElementById("fitBtn").addEventListener("click",fitAll);
document.getElementById("speed").addEventListener("input",e=>speedF=+e.target.value);
document.getElementById("orbitToggle").addEventListener("change",e=>showOrbits=e.target.checked);
document.getElementById("labelToggle").addEventListener("change",e=>showLabels=e.target.checked);
showPlanet(2);
});