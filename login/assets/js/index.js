const SUPABASE_URL = "https://ufdcottunhkcxeiphepv.supabase.co";
const SUPABASE_KEY = "sb_publishable_1Y9SYiFVd4lxlKPWjCnshw_vaFLdSg-";
let db = null;
let currentUser = null;
let pendingEmail = "";

function $(id){ return document.getElementById(id); }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function yesterdayStr(){ const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10); }

function getStatusFarsi(s){
  if(s==="not_started") return "شروع نشده";
  if(s==="pending") return "در انتظار بررسی ادمین";
  if(s==="approved_published") return "تایید و منتشر شده";
  if(s==="approved_draft") return "تایید شده (پیش‌نویس)";
  if(s==="rejected") return "رد شده";
  return s||"";
}

function convertToShamsiString(inp){
  if(!inp) return "تنظیم نشده";
  if(typeof inp==="string"&&inp.includes("/")) return inp;
  try{
    const o={year:"numeric",month:"2-digit",day:"2-digit",calendar:"persian"};
    let f=new Intl.DateTimeFormat("fa-IR",o).format(new Date(inp));
    f=f.replace(/٫/g,"/").replace(/\\/g,"/");
    return f.replace(/[۰-۹]/g,d=>"0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
  }catch(e){ return inp; }
}

function updateLiveClock(){
  const el=$("live-clock");
  if(!el) return;
  try{
    const now=new Date();
    const d=new Intl.DateTimeFormat("fa-IR",{weekday:"long",year:"numeric",month:"long",day:"numeric",calendar:"persian"}).format(now);
    const t=new Intl.DateTimeFormat("fa-IR",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
    el.innerText="⏱️ امروز: "+d+" | ساعت: "+t;
  }catch(e){}
}
setInterval(updateLiveClock,1000);

function switchTab(name){
  document.querySelectorAll(".zone").forEach(z=>z.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
  const map={
    "member-urgent":"member-urgent-zone",
    "member-current":"member-current-zone",
    "member-archive":"member-archive-zone",
    "member-profile":"member-profile-zone",
    "member-messages":"member-messages-zone",
    "admin-today":"admin-today-zone",
    "admin-future":"admin-future-zone",
    "admin-expired":"admin-expired-zone",
    "admin-search":"admin-search-zone",
    "admin-manage":"admin-manage-zone",
    "admin-messages":"admin-messages-zone",
    "admin-attendance":"admin-attendance-zone",
    "admin-requests":"admin-requests-zone"
  };
  const zid=map[name];
  if(zid&&$(zid)) $(zid).classList.remove("hidden");
  const bid="tab-"+name;
  if($(bid)) $(bid).classList.add("active");
}

async function init(){
  updateLiveClock();
  if(typeof window.supabase==="undefined"){
    if($("connection-status")) $("connection-status").innerText="🔴 کتابخانه سوپابیس لود نشد";
    return;
  }
  db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  try{
    const {error}=await db.from("profiles").select("id").limit(1);
    if(!error&&$("connection-status")){
      $("connection-status").style.color="var(--accent-green)";
      $("connection-status").innerText="🟢 اتصال به سامانه مرکزی برقرار است";
    }
  }catch(e){}

  if($("btn-login")) $("btn-login").addEventListener("click",handlePasswordLogin);
  if($("btn-logout")) $("btn-logout").addEventListener("click",handleLogout);
  if($("btn-send-otp")) $("btn-send-otp").addEventListener("click",handleSendOTP);
  if($("btn-verify-otp")) $("btn-verify-otp").addEventListener("click",handleVerifyOTP);
  if($("btn-change-pass")) $("btn-change-pass").addEventListener("click",changeMemberPassword);
  if($("search-input")) $("search-input").addEventListener("input",searchUserActivity);
  if($("btn-create-user")) $("btn-create-user").addEventListener("click",createNewUser);
  if($("btn-create-task")) $("btn-create-task").addEventListener("click",createNewTask);
  if($("btn-send-to-admin")) $("btn-send-to-admin").addEventListener("click",sendToAdmin);
  if($("btn-save-att")) $("btn-save-att").addEventListener("click",saveAttendance);
  if($("btn-remind-absent")) $("btn-remind-absent").addEventListener("click",remindAbsents);
  if($("btn-admin-send")) $("btn-admin-send").addEventListener("click",adminSendToMember);

  const tabs=[
    ["tab-member-urgent","member-urgent"],
    ["tab-member-current","member-current"],
    ["tab-member-archive","member-archive"],
    ["tab-member-profile","member-profile"],
    ["tab-admin-today","admin-today"],
    ["tab-admin-future","admin-future"],
    ["tab-admin-expired","admin-expired"],
    ["tab-admin-search","admin-search"]
  ];
  tabs.forEach(([id,nm])=>{
    if($(id)) $(id).addEventListener("click",()=>{
      switchTab(nm);
      if(nm.startsWith("member")) loadMemberData();
      else fetchAdminDataFromServer();
    });
  });

  if($("tab-member-messages"))
    $("tab-member-messages").addEventListener("click",()=>{
      switchTab("member-messages");
      loadMemberBell();
    });

  if($("tab-admin-messages"))
    $("tab-admin-messages").addEventListener("click",()=>{
      switchTab("admin-messages");
      loadAdminInbox();
      loadAttendance();
    });

  if($("tab-admin-manage"))
    $("tab-admin-manage").addEventListener("click",()=>{
      switchTab("admin-manage");
      loadUsersManagementSection();
    });

  if($("tab-admin-attendance"))
    $("tab-admin-attendance").addEventListener("click",()=>{
      switchTab("admin-attendance");
      loadAttendance();
    });

  // رویدادهای بخش درخواست‌های عضویت
  if($("tab-admin-requests"))
    $("tab-admin-requests").addEventListener("click",()=>{
      switchTab("admin-requests");
      loadReq();
    });

  if($("btn-refresh-requests"))
    $("btn-refresh-requests").addEventListener("click",loadReq);

  try{
    const {data:{session}}=await db.auth.getSession();
    if(session&&session.user) await afterLogin(session.user);
  }catch(e){}

  const tf=$("single-task-date");
  if(tf&&!tf.value) tf.value=convertToShamsiString(new Date());
}

async function afterLogin(user){
  try{
    const {data:profile}=await db.from("profiles").select("username,role").eq("id",user.id).single();
    if(!profile){ alert("پروفایل پیدا نشد. جدول profiles را چک کن."); return; }

    currentUser={id:user.id,username:profile.username,role:profile.role,email:user.email};
    $("auth-panel").classList.add("hidden");
    $("main-dashboard").classList.remove("hidden");
    $("user-welcome").innerText=currentUser.username+" ("+(currentUser.role==="admin"?"مدیر":"عضو")+")";

    if(currentUser.role==="admin"){
      $("admin-tabs").classList.remove("hidden");
      switchTab("admin-today");
      fetchAdminDataFromServer();
      // بارگذاری تعداد درخواست‌های جدید هنگام ورود مدیر
      loadReq();
    }else{
      $("member-tabs").classList.remove("hidden");
      switchTab("member-urgent");
      loadMemberData();
      loadMemberBell();
    }
  }catch(e){ alert("خطا در ورود: "+e.message); }
}

async function handlePasswordLogin(){ await handleLogin(); }

async function handleLogin(){
  const u=$("login-username").value.trim().toLowerCase();
  const p=$("login-password").value;
  if(!u||!p) return alert("لطفا اطلاعات را کامل وارد کنید.");
  const email=u.includes("@")?u:u+"@nova.local";
  try{
    const {data,error}=await db.auth.signInWithPassword({email:email,password:p});
    if(error) throw error;
    await afterLogin(data.user);
  }catch(e){ alert("نام کاربری یا رمز عبور اشتباه است"); }
}

async function handleLogout(){
  try{ await db.auth.signOut(); }catch(e){}
  location.reload();
}

async function handleSendOTP(){
  const u=$("login-username").value.trim().toLowerCase();
  if(!u) return alert("اول نام کاربری را بنویس.");
  pendingEmail=u.includes("@")?u:u+"@nova.local";
  const {error}=await db.auth.signInWithOtp({email:pendingEmail});
  if(error) return alert(error.message);
  $("otp-verify-section").style.display="block";
  alert("کد به ایمیل ارسال شد. پوشه اسپم را هم ببین.");
}

async function handleVerifyOTP(){
  const code=$("otp-code-input").value.trim();
  if(!code||!pendingEmail) return alert("کد را وارد کن.");
  const {data,error}=await db.auth.verifyOtp({email:pendingEmail,token:code,type:"email"});
  if(error) return alert(error.message);
  await afterLogin(data.user);
}

async function loadMemberData(){
  try{
    const {data:tasks}=await db.from("tasks").select("*").eq("assigned_to",currentUser.id).order("created_at",{ascending:false});
    const urgent=$("list-urgent"),cur=$("list-current"),arch=$("list-archive");
    if(!tasks||!tasks.length){
      if(urgent) urgent.innerHTML="تسکی نداری.";
      if(cur) cur.innerHTML="تسکی نداری.";
      if(arch) arch.innerHTML="خالی است.";
      return;
    }
    const card=t=>'<div style="border:1px solid #333;border-radius:8px;padding:8px;margin:6px 0"><b>'+(t.title||"")+'</b><br><small>'+(t.description||"")+'</small><br><small style="color:#888">'+getStatusFarsi(t.status)+" | "+convertToShamsiString(t.deadline)+'</small></div>';
    if(urgent) urgent.innerHTML=tasks.filter(t=>t.status==="rejected").map(card).join("")||"مورد فوری نداری.";
    if(cur) cur.innerHTML=tasks.filter(t=>t.status!=="approved_published").map(card).join("")||"تسک جاری نداری.";
    if(arch) arch.innerHTML=tasks.filter(t=>t.status==="approved_published").map(card).join("")||"بایگانی خالی است.";
  }catch(e){
    if($("list-urgent")) $("list-urgent").innerHTML="جدول tasks ساخته نشده است.";
  }
}

async function loadMemberBell(){
  const box=$("list-member-bell");
  if(!box) return;
  const {data}=await db.from("messages").select("*").eq("receiver_id",currentUser.id).order("created_at",{ascending:false}).limit(20);
  if(!data||!data.length) box.innerHTML="پیامی نداری.";
  else box.innerHTML=data.map(m=>'<div style="border:1px solid #333;border-radius:8px;padding:8px;margin:6px 0"><b>'+(m.title||"")+'</b><br><small>'+(m.body||"")+'</small><br><small style="color:#888">'+new Date(m.created_at).toLocaleString("fa-IR")+'</small></div>').join("");
  checkAutoAbsent();
}

async function checkAutoAbsent(){
  const y=yesterdayStr();
  const {data:att}=await db.from("attendance").select("*").eq("user_id",currentUser.id).eq("date",y).maybeSingle();
  if(att&&att.present) return;
  const {data:ex}=await db.from("messages").select("id").eq("receiver_id",currentUser.id).ilike("title","%"+y+"%").limit(1);
  if(ex&&ex.length) return;
  await db.from("messages").insert([{sender_id:currentUser.id,receiver_id:currentUser.id,title:"یادآوری غیبت "+y,body:"فعالیت دیروز را انجام ندادی، لطفا انجام بده."}]);
  loadMemberBell();
}

async function sendToAdmin(){
  const t=$("member-msg-title").value.trim(), b=$("member-msg-body").value.trim();
  if(!t||!b) return alert("موضوع و متن را بنویس.");
  await db.from("messages").insert([{sender_id:currentUser.id,receiver_id:null,title:t,body:b}]);
  alert("به مدیر ارسال شد.");
  $("member-msg-title").value="";
  $("member-msg-body").value="";
}

async function fetchAdminDataFromServer(){
  try{
    const {data:tasks}=await db.from("tasks").select("*,assignee:profiles!tasks_assigned_to_fkey(username)").order("created_at",{ascending:false}).limit(50);
    if($("list-admin-today")) $("list-admin-today").innerHTML=(tasks||[]).map(t=>'<div style="border:1px solid #333;border-radius:8px;padding:6px;margin:5px 0"><b>'+(t.title||"")+'</b> - '+((t.assignee&&t.assignee.username)||"")+' <small>'+getStatusFarsi(t.status)+'</small></div>').join("")||"کاری نیست.";
    if($("list-admin-future")) $("list-admin-future").innerHTML=$("list-admin-today").innerHTML;
    if($("list-admin-expired")) $("list-admin-expired").innerHTML=$("list-admin-today").innerHTML;
  }catch(e){}
}

async function loadUsersManagementSection(){
  const {data:users}=await db.from("profiles").select("id,username,role").order("username");
  if(users){
    if($("new-task-user")) $("new-task-user").innerHTML=users.filter(u=>u.role==="member").map(u=>'<option value="'+u.id+'">'+u.username+'</option>').join("");
    if($("list-manage-users")) $("list-manage-users").innerHTML=users.map(u=>"<div>"+u.username+" ("+(u.role==="admin"?"مدیر":"عضو")+")</div>").join("");
  }
  loadAttendance();
}

async function loadAttendance(){
  const box=$("list-attendance"), sel=$("admin-receiver");
  if(!box) return;
  const {data:users}=await db.from("profiles").select("id,username").eq("role","member");
  if(!users||!users.length){ box.innerHTML="عضوی نیست."; return; }
  const t=todayStr();
  const {data:atts}=await db.from("attendance").select("*").eq("date",t);
  box.innerHTML=users.map(u=>{
    const a=(atts||[]).find(x=>x.user_id===u.id);
    const ck=a&&a.present?"checked":"";
    return '<label style="display:flex;gap:8px;align-items:center;border:1px solid #333;border-radius:8px;padding:8px;margin:6px 0"><input type="checkbox" data-uid="'+u.id+'" '+ck+' style="width:20px;height:20px"> '+u.username+' <small style="color:#888">'+(a&&a.present?"حاضر":"غایب")+'</small></label>';
  }).join("");
  if(sel) sel.innerHTML=users.map(u=>'<option value="'+u.id+'">'+u.username+'</option>').join("");
}

async function saveAttendance(){
  const t=todayStr();
  const checks=[...document.querySelectorAll("#list-attendance input[type=checkbox]")];
  for(const c of checks){
    await db.from("attendance").upsert([{user_id:c.dataset.uid,date:t,present:c.checked,checked_by:currentUser.id}],{onConflict:"user_id,date"});
  }
  alert("حضور امروز ذخیره شد. هر که تیک نخورده فردا پیام می‌گیرد.");
  loadAttendance();
}

async function remindAbsents(){
  const y=yesterdayStr();
  const {data:users}=await db.from("profiles").select("id").eq("role","member");
  const {data:atts}=await db.from("attendance").select("*").eq("date",y);
  let n=0;
  for(const u of (users||[])){
    const a=(atts||[]).find(x=>x.user_id===u.id);
    if(!a||!a.present){
      const {data:ex}=await db.from("messages").select("id").eq("receiver_id",u.id).ilike("title","%"+y+"%").limit(1);
      if(!ex||!ex.length){
        await db.from("messages").insert([{sender_id:currentUser.id,receiver_id:u.id,title:"یادآوری غیبت "+y,body:"فعالیت دیروز را انجام ندادی، لطفا انجام بده."}]);
        n++;
      }
    }
  }
  alert(n?n+" نفر یادآوری گرفتند.":"غایب جدیدی نیست.");
}

async function loadAdminInbox(){
  const box=$("list-admin-inbox");
  if(!box) return;
  const {data}=await db.from("messages").select("*").is("receiver_id",null).order("created_at",{ascending:false}).limit(30);
  if(!data||!data.length){ box.innerHTML="پیام جدیدی نیست."; return; }
  let names={};
  try{
    const {data:users}=await db.from("profiles").select("id,username");
    (users||[]).forEach(u=>names[u.id]=u.username);
  }catch(e){}
  box.innerHTML=data.map(m=>'<div style="border:1px solid #333;border-radius:8px;padding:8px;margin:6px 0"><b>'+(m.title||"")+'</b> از '+(names[m.sender_id]||"عضو")+'<br><small>'+(m.body||"")+'</small></div>').join("");
}

async function adminSendToMember(){
  const rid=$("admin-receiver").value, t=$("admin-msg-title").value.trim(), b=$("admin-msg-body").value.trim();
  if(!rid||!t||!b) return alert("گیرنده و موضوع و متن لازم است.");
  await db.from("messages").insert([{sender_id:currentUser.id,receiver_id:rid,title:t,body:b}]);
  alert("به عضو ارسال شد و در زنگوله او می‌آید.");
}

async function createNewUser(){
  const un=$("new-user-username").value.trim().toLowerCase(), pw=$("new-user-pass").value, rl=$("new-user-role").value;
  if(!un||!pw) return alert("نام کاربری و رمز لازم است.");
  const email=un+"@nova.local";
  try{
    const {data,error}=await db.auth.signUp({email:email,password:pw});
    if(error) throw error;
    const uid=data.user?data.user.id:null;
    if(uid) await db.from("profiles").insert([{id:uid,username:un,role:rl}]);
    alert("ساخته شد. حتما در Authentication تاییدش کن.");
    loadUsersManagementSection();
  }catch(e){ alert(e.message); }
}

async function createNewTask(){
  const ti=$("new-task-title").value.trim(), de=$("new-task-desc").value.trim(), au=$("new-task-user").value;
  if(!ti||!au) return alert("عنوان و عضو لازم است.");
  await db.from("tasks").insert([{title:ti,description:de,assigned_to:au,status:"not_started",created_by:currentUser.id}]);
  alert("تسک ساخته شد.");
  fetchAdminDataFromServer();
}

async function changeMemberPassword(){
  const np=$("member-new-pass").value;
  if(!np) return alert("رمز جدید را بنویس.");
  const {error}=await db.auth.updateUser({password:np});
  if(error) return alert(error.message);
  alert("رمز عوض شد.");
  $("member-new-pass").value="";
}

async function searchUserActivity(){
  const q=$("search-input").value.trim().toLowerCase();
  if(!q) return;
  const {data:users}=await db.from("profiles").select("id,username").ilike("username","%"+q+"%").limit(5);
  if($("search-results")) $("search-results").innerHTML=(users||[]).map(u=>"<div>"+u.username+"</div>").join("")||"پیدا نشد.";
}

// دریافت و نمایش درخواست‌های عضویت از Supabase
async function loadReq(){
  const box=$("reqList");
  if(!box || !currentUser || currentUser.role!=="admin") return;

  box.replaceChildren();
  box.textContent="در حال دریافت درخواست‌ها...";

  const {data,error}=await db
    .from("membership_requests")
    .select("id, name, cls, shad, email, status, created_at")
    .order("created_at",{ascending:false});

  if(error){
    console.error("Supabase request error:",error);
    box.textContent="خطا در دریافت درخواست‌ها: "+error.message;
    if($("reqCount")) $("reqCount").textContent="خطا";
    return;
  }

  const requests=data||[];
  const pendingCount=requests.filter(r=>r.status==="pending").length;

  if($("reqCount")){
    $("reqCount").textContent=pendingCount ? " ("+pendingCount+" جدید)" : "";
  }
  if($("reqTitle")){
    $("reqTitle").textContent="🌠 درخواست‌های عضویت ("+requests.length+")";
  }

  if(!requests.length){
    box.textContent="هنوز هیچ درخواست عضویتی ثبت نشده است.";
    return;
  }

  requests.forEach(r=>{
    const card=document.createElement("div");
    card.className="item";
    card.style.cssText="border:1px solid #333;border-radius:12px;padding:12px;margin:10px 0;";

    const name=document.createElement("b");
    name.textContent=r.name||"بدون نام";

    const info=document.createElement("p");
    info.style.cssText="line-height:2;font-size:13px;";
    info.textContent="کلاس: "+(r.cls||"—")+" · شاد: "+(r.shad||"—")+" · ایمیل: "+(r.email||"—");
    info.dir="auto";

    const status=document.createElement("p");
    status.style.fontSize="12px";
    if(r.status==="approved"){
      status.textContent="وضعیت: تأیید شده";
      status.style.color="#28a745";
    }else if(r.status==="rejected"){
      status.textContent="وضعیت: رد شده";
      status.style.color="#ff7777";
    }else{
      status.textContent="وضعیت: در انتظار بررسی";
      status.style.color="#ffc107";
    }

    const date=document.createElement("small");
    date.style.color="#888";
    date.textContent=r.created_at
      ? "تاریخ ثبت: "+new Date(r.created_at).toLocaleString("fa-IR")
      : "تاریخ نامشخص";

    const actions=document.createElement("div");
    actions.className="acts";
    actions.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;";

    if(r.status==="pending"){
      const approve=document.createElement("button");
      approve.type="button";
      approve.className="btn sm";
      approve.textContent="✅ تأیید درخواست";
      approve.onclick=async()=>{
        if(!confirm("درخواست "+(r.name||"متقاضی")+" تأیید شود؟")) return;
        approve.disabled=true;
        const {error:updateError}=await db
          .from("membership_requests")
          .update({status:"approved"})
          .eq("id",r.id);
        if(updateError){
          alert("خطا در تأیید درخواست: "+updateError.message);
          approve.disabled=false;
          return;
        }
        alert("وضعیت درخواست تأیید شد.");
        await loadReq();
      };

      const reject=document.createElement("button");
      reject.type="button";
      reject.className="btn sm";
      reject.textContent="❌ رد درخواست";
      reject.onclick=async()=>{
        if(!confirm("درخواست "+(r.name||"متقاضی")+" رد شود؟")) return;
        reject.disabled=true;
        const {error:updateError}=await db
          .from("membership_requests")
          .update({status:"rejected"})
          .eq("id",r.id);
        if(updateError){
          alert("خطا در رد درخواست: "+updateError.message);
          reject.disabled=false;
          return;
        }
        alert("درخواست رد شد.");
        await loadReq();
      };

      actions.append(approve,reject);
    }

    const del=document.createElement("button");
    del.type="button";
    del.className="del";
    del.textContent="🗑 حذف درخواست";
    del.onclick=async()=>{
      if(!confirm("درخواست "+(r.name||"متقاضی")+" حذف شود؟")) return;
      del.disabled=true;
      const {error:deleteError}=await db
        .from("membership_requests")
        .delete()
        .eq("id",r.id);
      if(deleteError){
        alert("خطا در حذف درخواست: "+deleteError.message);
        del.disabled=false;
        return;
      }
      alert("درخواست حذف شد.");
      await loadReq();
    };

    actions.append(del);
    card.append(name,info,status,date,actions);
    box.append(card);
  });
}

window.checkAndUploadFile=async function(fileInputId,targetInputId,btnId){
  const fi=$(fileInputId), ti=$(targetInputId), btn=$(btnId);
  if(!fi.files||!fi.files.length) return;
  const file=fi.files[0];
  if(file.size/(1024*1024)>50){
    alert("فایل بالای ۵۰ مگ است.");
    fi.value="";
    return;
  }
  const ext=file.name.split(".").pop();
  const path=currentUser.id+"/"+Date.now()+"."+ext;
  btn.innerText="🔄 در حال آپلود...";
  btn.style.pointerEvents="none";
  try{
    const {error}=await db.storage.from("robo-files").upload(path,file,{upsert:true});
    if(error) throw error;
    const {data,error:se}=await db.storage.from("robo-files").createSignedUrl(path,31536000);
    if(se) throw se;
    ti.value=data.signedUrl;
    btn.innerText="✅ آپلود شد";
  }catch(e){
    alert("خطا در آپلود: "+e.message);
    btn.innerText="📁 آپلود فایل";
    btn.style.pointerEvents="auto";
  }
};

document.addEventListener("DOMContentLoaded",init);
