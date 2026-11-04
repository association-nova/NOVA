// nova-bell.js - منطق مشترک زنگوله و تیک روزانه
const NOVA_BELL = (() => {
  const dayStr = (d = new Date()) => d.toISOString().slice(0,10);
  const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate()-1); return dayStr(d); };
  const attKey = (day) => 'nova_att_' + day;
  const bellKey = (id) => 'nova_bell_' + id;

  function getAtt(day){ try{ return JSON.parse(localStorage.getItem(attKey(day))||'{}'); }catch(e){ return {}; } }
  function setAtt(day,obj){ localStorage.setItem(attKey(day), JSON.stringify(obj)); }

  function pushBell(id, title, text, extra){
    const k = bellKey(id);
    let arr = [];
    try{ arr = JSON.parse(localStorage.getItem(k)||'[]'); }catch(e){}
    const msg = Object.assign({id: Date.now()+Math.random(), title, text, date: new Date().toLocaleString('fa-IR'), read:false}, extra||{});
    arr.unshift(msg);
    localStorage.setItem(k, JSON.stringify(arr));
  }

  function getBell(id){
    try{ return JSON.parse(localStorage.getItem(bellKey(id))||'[]'); }catch(e){ return []; }
  }

  // اگر دیروز حضور ثبت شده و این id تیک نخورده، پیام خودکار بساز
  function checkAutoFor(id, displayName){
    const y = yesterdayStr();
    const attY = getAtt(y);
    if(!Object.keys(attY).length) return null; // دیروز چیزی ثبت نشده
    if(attY[id]) return null; // تیک خورده، هیچی
    const arr = getBell(id);
    if(arr.find(m=>m.auto && m.day===y)) return null; // قبلا ساخته شده
    const msg = {auto:true, day:y, title:'یادآوری فعالیت ⚠️', text:`${displayName||''} عزیز، فعالیت دیروز را انجام ندادی. لطفاً امروز جبران کن.`};
    pushBell(id, msg.title, msg.text, {auto:true, day:y});
    return msg;
  }

  return {dayStr, yesterdayStr, getAtt, setAtt, pushBell, getBell, checkAutoFor};
})();
