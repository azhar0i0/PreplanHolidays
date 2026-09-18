(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const CFG=window.PPH||{};
const WA=CFG.wa||"12125550147";
const money=n=>"$"+Math.round(n).toLocaleString("en-US");
const mobile=()=>window.matchMedia("(max-width:767px)").matches;
const IMG=(id,w=1200)=>id.startsWith("/")||id.startsWith("images/")?(id.startsWith("/")?id:"/"+id):`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

/* ---------- image fallback ---------- */
document.addEventListener("error",e=>{
  const t=e.target; if(!t||t.tagName!=="IMG")return;
  if(!t.dataset.fb){t.dataset.fb=1;t.src=`https://picsum.photos/seed/${(t.alt||"travel").replace(/\W+/g,"-").slice(0,40)}/1200/900`;}
  else t.classList.add("fb-hide");
},true);

/* ---------- saved shortlist ---------- */
let saved=new Set();
try{saved=new Set(JSON.parse(localStorage.getItem("pph-saved")||"[]"))}catch(e){}
const persist=()=>{try{localStorage.setItem("pph-saved",JSON.stringify([...saved]))}catch(e){}};
const paintFav=()=>{$$("[data-fav]").forEach(b=>{const on=saved.has(b.dataset.fav);b.classList.toggle("on",on);b.setAttribute("aria-pressed",on);const i=b.querySelector("i");if(i)i.className=(on?"ph-fill":"ph-light")+" ph-heart"})};
paintFav();

/* ---------- toast ---------- */
let tt;const toast=(msg,icon="ph-check")=>{const t=$("#toast");if(!t)return;t.querySelector("span").textContent=msg;t.querySelector("i").className="ph-bold "+icon;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2600)};

/* ================= REVEAL / COUNTERS ================= */
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");if(e.target.dataset.count!==undefined)count(e.target);io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
const observe=(root=document)=>$$(".rv:not(.in),.mask:not(.in),[data-count],#footWord:not(.in)",root).forEach(el=>io.observe(el));
function count(el){
  if(el.dataset.done)return;el.dataset.done=1;
  const to=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),suf=el.dataset.suf||"",t0=performance.now(),dur=1700;
  const step=now=>{const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(2,-10*k);el.textContent=(to*(k===1?1:e)).toFixed(dec)+suf;if(k<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}

/* ================= POPOVER MANAGER ================= */
let cur=null;const sheetBg=$("#sheetBg");
function openPop(host,pop){
  if(cur&&cur.host===host){closePop();return}
  closePop();
  cur={host,pop};host.classList.add("open");
  const t=host.querySelector(".trigger");t&&t.setAttribute("aria-expanded","true");
  if(mobile()){
    document.body.appendChild(pop);pop.getBoundingClientRect();pop.classList.add("sheet-open");sheetBg&&sheetBg.classList.add("show");
  }else{
    pop.classList.remove("up","end");
    const r=host.getBoundingClientRect(),h=pop.scrollHeight;
    if(r.left+pop.offsetWidth>document.documentElement.clientWidth-12)pop.classList.add("end");
    if(host.dataset.up==="1"||(window.innerHeight-r.bottom<h+24&&r.top>h+24))pop.classList.add("up");
  }
}
function closePop(){
  if(!cur)return;const {host,pop}=cur;cur=null;
  host.classList.remove("open");
  const t=host.querySelector(".trigger");t&&t.setAttribute("aria-expanded","false");
  if(pop.classList.contains("sheet-open")){
    pop.classList.remove("sheet-open");sheetBg&&sheetBg.classList.remove("show");
    setTimeout(()=>{if(!pop.classList.contains("sheet-open")&&pop.parentNode===document.body)host.appendChild(pop)},450);
  }
}
document.addEventListener("pointerdown",e=>{if(cur&&!cur.host.contains(e.target)&&!cur.pop.contains(e.target))closePop()});
sheetBg&&sheetBg.addEventListener("click",closePop);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closePop();closeModal();closeMenu()}});
let lastW=innerWidth;window.addEventListener("resize",()=>{if(innerWidth!==lastW){lastW=innerWidth;closePop()}},{passive:true});

/* ---------- label association for custom widgets ---------- */
function labelFor(el){
  const trig=$(".trigger",el);if(!trig)return;
  const host=el.closest(".field,.pf")||el.parentElement;
  const lbl=host&&host.querySelector(".lbl,.pf-label,label");
  if(!lbl)return;if(!lbl.id)lbl.id=(el.id||"w"+Math.random().toString(36).slice(2,7))+"-lbl";
  trig.setAttribute("aria-labelledby",lbl.id+" "+(trig.id||(trig.id=(el.id||lbl.id)+"-val")));
}

/* ---------- custom dropdown ---------- */
function Dropdown(el,{options,value=null,placeholder="Select",boxed=false,onChange=()=>{}}){
  if(!el)return null;
  if(boxed)el.classList.add("box");
  el.innerHTML=`<button type="button" class="trigger" aria-haspopup="listbox" aria-expanded="false"><span class="val"></span><i class="ph-light ph-caret-down car"></i></button><div class="pop"><div class="dd-list" role="listbox"></div></div>`;
  const trig=$(".trigger",el),val=$(".val",el),pop=$(".pop",el),list=$(".dd-list",el);
  let kb=-1;
  const api={value,set(v,silent){api.value=v;const o=options.find(o=>o.v===v);val.textContent=o?o.l:placeholder;val.classList.toggle("ph",!o);$$(".dd-opt",list).forEach(b=>{const on=b.dataset.v===String(v);b.classList.toggle("sel",on);b.setAttribute("aria-selected",on)});if(!silent)onChange(v)}};
  list.innerHTML=options.map((o,i)=>`<button type="button" role="option" class="dd-opt" style="--i:${i}" data-v="${o.v}">${o.ic?`<span class="oi"><i class="ph-light ${o.ic}"></i></span>`:""}<span>${o.l}${o.s?`<small>${o.s}</small>`:""}</span><i class="ph-bold ph-check tick"></i></button>`).join("");
  api.set(value,true);labelFor(el);
  trig.addEventListener("click",()=>openPop(el,pop));
  list.addEventListener("click",e=>{const b=e.target.closest(".dd-opt");if(!b)return;const o=options.find(o=>String(o.v)===b.dataset.v);api.set(o.v);closePop()});
  el.addEventListener("keydown",e=>{
    const opts=$$(".dd-opt",pop);
    if(!el.classList.contains("open")){if(["ArrowDown","Enter"," "].includes(e.key)&&e.target===trig){e.preventDefault();openPop(el,pop)}return}
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();kb=(kb+(e.key==="ArrowDown"?1:-1)+opts.length)%opts.length;opts.forEach((o,i)=>o.classList.toggle("kb",i===kb));opts[kb].scrollIntoView({block:"nearest"})}
    if(e.key==="Enter"&&kb>-1){e.preventDefault();opts[kb].click();trig.focus()}
  });
  return api;
}

/* ---------- custom calendar ---------- */
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const day0=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x};
const TODAY=day0(new Date());
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmt=(d,y)=>d.toLocaleDateString("en-GB",{weekday:y?undefined:"short",day:"numeric",month:"short",year:y?"numeric":undefined});
const iso=d=>d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`:"";
function DatePicker(el,{value=null,placeholder="Add date",nights=0,boxed=false,up=false,onChange=()=>{}}){
  if(!el)return null;
  if(boxed)el.classList.add("box");if(up)el.dataset.up="1";
  el.innerHTML=`<button type="button" class="trigger" aria-haspopup="dialog" aria-expanded="false"><span class="val"></span><i class="ph-light ph-calendar-blank car" style="transform:none"></i></button>
  <div class="pop cal" role="dialog" aria-label="Choose a date"><div class="cal-head"><b></b><div class="cal-nav"><button type="button" class="pv" aria-label="Previous month"><i class="ph-bold ph-caret-left"></i></button><button type="button" class="nx" aria-label="Next month"><i class="ph-bold ph-caret-right"></i></button></div></div>
  <div class="cal-dow">${["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=>`<span>${d}</span>`).join("")}</div>
  <div class="cal-viewport"><div class="cal-grid"></div></div>
  <div class="cal-foot"><span class="info"></span><button type="button" class="clr">Clear</button></div></div>`;
  const val=$(".val",el),pop=$(".pop",el),grid=$(".cal-grid",el),head=$(".cal-head b",el),info=$(".info",el);
  let view=new Date((value||TODAY).getFullYear(),(value||TODAY).getMonth(),1);
  const api={value,nights,set(v,silent){api.value=v;val.textContent=v?(api.nights?`${fmt(v)} to ${fmt(addDays(v,api.nights))}`:fmt(v,true)):placeholder;val.classList.toggle("ph",!v);draw();if(!silent)onChange(v)},open(){openPop(el,pop)}};
  function draw(){
    head.textContent=`${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    $(".pv",el).disabled=view<=new Date(TODAY.getFullYear(),TODAY.getMonth(),1);
    const first=(view.getDay()+6)%7,dim=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
    let h="";for(let i=0;i<first;i++)h+="<span></span>";
    const end=api.value&&api.nights?addDays(api.value,api.nights):null;
    for(let d=1;d<=dim;d++){
      const dt=new Date(view.getFullYear(),view.getMonth(),d),t=+dt;let c=[];
      if(t===+TODAY)c.push("today");
      if(api.value&&t===+api.value)c.push("sel");
      if(end&&t===+end)c.push("sel","end");
      if(end&&t>+api.value&&t<+end)c.push("inr");
      h+=`<button type="button" class="${c.join(" ")}" data-t="${t}" ${dt<TODAY?"disabled":""}>${d}</button>`;
    }
    grid.innerHTML=h;
    info.textContent=api.value?(api.nights?`${api.nights} nights, out ${fmt(end)}`:fmt(api.value,true)):(api.nights?`${api.nights}-night stay`:"Pick a day");
  }
  function shift(n){grid.classList.add(n>0?"out-l":"out-r");setTimeout(()=>{view=new Date(view.getFullYear(),view.getMonth()+n,1);draw();grid.classList.remove("out-l","out-r");grid.classList.add(n>0?"out-r":"out-l");grid.getBoundingClientRect();grid.classList.remove("out-l","out-r")},180)}
  $(".trigger",el).addEventListener("click",()=>openPop(el,pop));labelFor(el);
  $(".pv",pop).addEventListener("click",()=>shift(-1));$(".nx",pop).addEventListener("click",()=>shift(1));
  $(".clr",pop).addEventListener("click",()=>api.set(null));
  grid.addEventListener("click",e=>{const b=e.target.closest("button[data-t]");if(!b||b.disabled)return;api.set(new Date(+b.dataset.t));setTimeout(closePop,260)});
  let sx=0;grid.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
  grid.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)shift(dx<0?1:-1)});
  api.set(value,true);return api;
}

/* ---------- guests picker ---------- */
function GuestPicker(el,{adults=2,children=0,boxed=false,up=false,onChange=()=>{}}){
  if(!el)return null;
  if(boxed)el.classList.add("box");if(up)el.dataset.up="1";
  el.innerHTML=`<button type="button" class="trigger" aria-haspopup="dialog" aria-expanded="false"><span class="val"></span><i class="ph-light ph-caret-down car"></i></button>
  <div class="pop gst"><div class="gst-row"><div><b>Adults</b><small>Age 18 and over</small></div><div class="stp" data-k="adults"><button type="button" data-d="-1" aria-label="Fewer adults"><i class="ph-bold ph-minus"></i></button><output></output><button type="button" data-d="1" aria-label="More adults"><i class="ph-bold ph-plus"></i></button></div></div>
  <div class="gst-row"><div><b>Children</b><small>Age 2 to 17</small></div><div class="stp" data-k="children"><button type="button" data-d="-1" aria-label="Fewer children"><i class="ph-bold ph-minus"></i></button><output></output><button type="button" data-d="1" aria-label="More children"><i class="ph-bold ph-plus"></i></button></div></div></div>`;
  const api={adults,children},pop=$(".pop",el);
  const lim={adults:[1,8],children:[0,6]};
  function draw(){$(".val",el).textContent=`${api.adults} adult${api.adults>1?"s":""}${api.children?`, ${api.children} child${api.children>1?"ren":""}`:""}`;
    $$(".stp",pop).forEach(s=>{const k=s.dataset.k;$("output",s).textContent=api[k];s.children[0].disabled=api[k]<=lim[k][0];s.children[2].disabled=api[k]>=lim[k][1]})}
  $(".trigger",el).addEventListener("click",()=>openPop(el,pop));labelFor(el);
  pop.addEventListener("click",e=>{const b=e.target.closest("button[data-d]");if(!b)return;const k=b.parentNode.dataset.k;api[k]=Math.max(lim[k][0],Math.min(lim[k][1],api[k]+ +b.dataset.d));draw();onChange(api)});
  draw();return api;
}

/* ---------- chips / tabs indicator ---------- */
function indicator(wrap,sel,ind){const on=$(sel,wrap),i=$(ind,wrap);if(!on||!i)return;i.style.width=on.offsetWidth+"px";i.style.transform=`translateX(${on.offsetLeft}px)`}
function Chips(wrap,onChange){
  if(!wrap)return;
  wrap.addEventListener("click",e=>{const b=e.target.closest(".chip-b");if(!b)return;$$(".chip-b",wrap).forEach(x=>x.classList.toggle("on",x===b));indicator(wrap,".chip-b.on",".chip-ind");onChange(b.dataset.f)});
  const fix=()=>indicator(wrap,".chip-b.on",".chip-ind");requestAnimationFrame(fix);window.addEventListener("resize",fix);document.fonts&&document.fonts.ready.then(fix);return fix;
}
function Tabs(wrap,onChange){
  if(!wrap)return;
  const fix=()=>indicator(wrap,".tab.on",".tab-ind");requestAnimationFrame(fix);window.addEventListener("resize",fix);document.fonts&&document.fonts.ready.then(fix);
  const pick=b=>{if(!b||b.classList.contains("on"))return;$$(".tab",wrap).forEach(t=>{t.classList.toggle("on",t===b);t.setAttribute("aria-selected",t===b);t.tabIndex=t===b?0:-1});fix();onChange(b.dataset.k)};
  $$(".tab",wrap).forEach(t=>t.tabIndex=t.classList.contains("on")?0:-1);
  wrap.addEventListener("click",e=>pick(e.target.closest(".tab")));
  wrap.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;const tabs=$$(".tab",wrap),i=tabs.findIndex(t=>t.classList.contains("on"));const n=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;e.preventDefault();tabs[n].focus();pick(tabs[n])});
}

/* ---------- favourites ---------- */
document.addEventListener("click",e=>{
  const f=e.target.closest("[data-fav]");if(!f)return;e.preventDefault();e.stopPropagation();
  const s=f.dataset.fav,on=!saved.has(s);on?saved.add(s):saved.delete(s);persist();paintFav();
  toast(on?"Saved to your shortlist":"Removed from your shortlist",on?"ph-heart":"ph-x");
  if(window.__renderAll)window.__renderAll(true);
},true);
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-fav]")){e.preventDefault();e.target.click()}});

/* ---------- accordion ---------- */
function accordion(root){if(!root)return;root.addEventListener("click",e=>{const b=e.target.closest(".qa-q");if(!b||!root.contains(b))return;const qa=b.closest(".qa"),open=!qa.classList.contains("open");
  $$(".qa.open",root).forEach(x=>{if(x!==qa){x.classList.remove("open");x.querySelector(".qa-q").setAttribute("aria-expanded","false");x.closest(".tl")&&x.closest(".tl").classList.remove("open")}});
  qa.classList.toggle("open",open);b.setAttribute("aria-expanded",open);qa.closest(".tl")&&qa.closest(".tl").classList.toggle("open",open)})}
$$(".acc,.timeline").forEach(accordion);

/* ---------- FAQ search + categories ---------- */
(function(){
  const list=$("#faqList"),q=$("#faqQ"),cats=$("#faqCats");if(!list||(!q&&!cats))return;
  let cat="all";
  const filter=()=>{const s=q?q.value.trim().toLowerCase():"";let shown=0;$$(".qa",list).forEach(el=>{const ok=(cat==="all"||el.dataset.c===cat)&&(!s||el.textContent.toLowerCase().includes(s));el.classList.toggle("gone",!ok);if(ok){shown++;el.style.animation=`popin .6s var(--ease) both ${shown*40}ms`}});const em=$("#faqEmpty");if(em)em.style.display=shown?"none":"block"};
  Chips(cats,f=>{cat=f;filter()});q&&q.addEventListener("input",filter);
})();

/* ---------- forms ---------- */
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function wireErrors(form){$$(".field[data-req]",form).forEach((f,i)=>{const err=$(".err",f),inp=$("input,textarea,.trigger",f);if(!err||!inp)return;if(!err.id)err.id=(form.id||"f")+"-err"+i;inp.setAttribute("aria-describedby",err.id)})}
function validate(form,rules){let ok=true;$$(".field[data-req]",form).forEach(f=>{const good=rules[f.dataset.req]();f.classList.toggle("bad",!good);const inp=$("input,textarea,.trigger",f),err=$(".err",f);if(inp)inp.setAttribute("aria-invalid",!good);if(err){if(good)err.removeAttribute("role");else err.setAttribute("role","alert")}if(!good)ok=false});
  if(!ok){const b=$(".field.bad",form);b&&b.animate([{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],{duration:320})}return ok}
async function deliver(payload,waText){
  if(CFG.formEndpoint){
    const r=await fetch(CFG.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)});
    if(!r.ok)throw new Error("send failed");
    return "sent";
  }
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(waText)}`,"_blank","noopener");
  return "whatsapp";
}

/* contact page */
(function(){
  const form=$("#cForm");if(!form)return;
  const pkgs=CFG.packages||[];
  const cTopic=Dropdown($("#cTopic"),{boxed:true,placeholder:"Choose one",options:[{v:"book",l:"Book a package",ic:"ph-suitcase-rolling"},{v:"custom",l:"Plan a custom trip",ic:"ph-path"},{v:"change",l:"Change a booking",ic:"ph-pencil-simple-line"},{v:"help",l:"Help during my trip",ic:"ph-lifebuoy"}],onChange:()=>$("#cTopic").closest(".field").classList.remove("bad")});
  const params=new URLSearchParams(location.search);
  const cPkg=Dropdown($("#cPkg"),{boxed:true,placeholder:"Not sure yet",value:params.get("package")||"none",options:[{v:"none",l:"Not sure yet",ic:"ph-question"},...pkgs.map(p=>({v:p.s,l:p.t,s:p.sub}))]});
  const cDate=DatePicker($("#cDate"),{boxed:true,placeholder:"Choose a date"});
  const cG=GuestPicker($("#cGuests"),{boxed:true,up:true});wireErrors(form);
  if(params.get("email")){const e=$("#cEmail");if(e)e.value=params.get("email")}
  form.addEventListener("input",e=>{const f=e.target.closest(".field");f&&f.classList.remove("bad")});
  form.addEventListener("submit",async e=>{e.preventDefault();
    if(!validate(form,{name:()=>$("#cName").value.trim().length>1,email:()=>emailOk($("#cEmail").value.trim()),topic:()=>!!cTopic.value,consent:()=>$("#cConsent").checked}))return;
    const btn=$("button[type=submit]",form);btn.classList.add("loading");btn.querySelector("i").className="ph-bold ph-circle-notch";
    const pk=pkgs.find(p=>p.s===cPkg.value);
    const payload={type:"enquiry",name:$("#cName").value.trim(),email:$("#cEmail").value.trim(),phone:$("#cPhone").value.trim(),topic:cTopic.value,package:pk?pk.t:"Not sure yet",date:iso(cDate.value),adults:cG.adults,children:cG.children,message:$("#cMsg").value.trim(),page:location.href};
    const text=`Hi Preplan, new enquiry from ${payload.name}.\nNeed: ${payload.topic}\nPackage: ${payload.package}\nDate: ${payload.date||"flexible"}\nTravellers: ${payload.adults} adults${payload.children?`, ${payload.children} children`:""}\nEmail: ${payload.email}${payload.phone?`\nPhone: ${payload.phone}`:""}${payload.message?`\n\n${payload.message}`:""}`;
    try{await deliver(payload,text);form.style.display="none";$("#cSuccess").classList.add("show")}
    catch(err){toast("Could not send. Please try WhatsApp or email.","ph-warning")}
    finally{btn.classList.remove("loading");btn.querySelector("i").className="ph-bold ph-paper-plane-tilt"}
  });
  $("#cAgain")&&$("#cAgain").addEventListener("click",()=>{form.reset();cTopic.set(null,true);cDate.set(null,true);$("#cSuccess").classList.remove("show");form.style.display=""});
})();

/* newsletter */
(function(){const n=$("#news");if(!n)return;n.addEventListener("submit",e=>{e.preventDefault();const v=n.querySelector("input").value.trim();if(!emailOk(v)){toast("Enter a valid email","ph-warning");return}
  deliver({type:"newsletter",email:v,page:location.href},`Hi Preplan, please add ${v} to the trip-ideas email list.`).then(()=>{n.reset();toast("You're on the list. Trip ideas coming soon.","ph-envelope-simple")}).catch(()=>toast("Could not subscribe right now.","ph-warning"))})})();

/* ================= HOME ================= */
(function(){
  const grid=$("#homeGrid");if(!grid)return;
  const cards=$$(".card",grid);
  const draw=(f,anim)=>{let n=0;cards.forEach(c=>{const ok=f==="all"?c.dataset.home==="1":c.dataset.cat===f;const show=ok&&n<8;if(show)n++;c.classList.toggle("more",!show);if(show&&anim){c.classList.remove("pop-in");c.getBoundingClientRect();c.classList.add("pop-in")}})};
  Chips($("#homeChips"),f=>draw(f,true));
  const dest=Dropdown($("#hDest"),{placeholder:"Anywhere",value:"all",options:[{v:"all",l:"Anywhere",ic:"ph-globe-hemisphere-east",s:"All packages"},...(CFG.cities||[]).map(c=>({v:c.k,l:c.name,ic:"ph-map-pin",s:c.area})),...(CFG.regions||[]).map(r=>({v:r.k,l:r.name,ic:r.k==="cruises"?"ph-boat":"ph-globe-hemisphere-west",s:r.sub}))]});
  if($("#hDest"))$("#hDest").dataset.up="1";
  const hd=DatePicker($("#hDate"),{placeholder:"Add date",up:true});
  const hg=GuestPicker($("#hGuests"),{up:true});
  const go=()=>{const q=new URLSearchParams();if(dest.value&&dest.value!=="all")q.set("city",dest.value);if(hd.value)q.set("date",iso(hd.value));q.set("adults",hg.adults);if(hg.children)q.set("children",hg.children);location.href="/packages?"+q.toString()};
  $("#hSearch")&&$("#hSearch").addEventListener("click",go);
})();

/* fine print tabs (home + fees page) */
(function(){
  const tabs=$("#fpTabs");if(!tabs)return;
  const panels=$$("[data-fp]");
  const panelWrap=$("#fpPanel");
  Tabs(tabs,k=>{panelWrap&&panelWrap.classList.add("swap");setTimeout(()=>{panels.forEach(p=>p.hidden=p.dataset.fp!==k);panelWrap&&requestAnimationFrame(()=>requestAnimationFrame(()=>panelWrap.classList.remove("swap")))},panelWrap?320:0)});
})();

/* reviews deck */
(function(){
  const deck=$("#deck");if(!deck)return;
  const cards=$$(".qcard",deck),n=cards.length;if(!n)return;let idx=0,timer,busy=false;
  const lay=()=>cards.forEach((c,k)=>{const rel=(k-idx+n)%n;c.dataset.p=rel<3?rel:"hide";c.setAttribute("aria-hidden",rel!==0);c.toggleAttribute("inert",rel!==0)});
  const prog=$("#rvProg");
  const restart=()=>{if(prog){prog.classList.remove("run");prog.getBoundingClientRect();prog.classList.add("run")}clearTimeout(timer);timer=setTimeout(()=>next(),6500)};
  function next(){if(busy)return;busy=true;const c=cards[idx];c.dataset.p="out";idx=(idx+1)%n;setTimeout(()=>{lay();busy=false},420);cards.forEach((x,k)=>{if(x!==c){const rel=(k-idx+n)%n;x.dataset.p=rel<3?rel:"hide"}});restart()}
  function prev(){idx=(idx-1+n)%n;lay();restart()}
  lay();
  $("#rvNext")&&$("#rvNext").addEventListener("click",next);$("#rvPrev")&&$("#rvPrev").addEventListener("click",prev);
  deck.addEventListener("mouseenter",()=>{clearTimeout(timer);prog&&(prog.style.animationPlayState="paused")});
  deck.addEventListener("mouseleave",()=>{prog&&(prog.style.animationPlayState="running");clearTimeout(timer);timer=setTimeout(next,3000)});
  let sx=null;deck.addEventListener("pointerdown",e=>{if(e.target.closest("a"))return;sx=e.clientX});
  deck.addEventListener("pointerup",e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(dx<-45)next();else if(dx>45)prev()});
  new IntersectionObserver(([e])=>{if(e.isIntersecting)restart();else clearTimeout(timer)},{threshold:.3}).observe(deck);
})();

/* ================= ALL PACKAGES ================= */
(function(){
  const grid=$("#allGrid");if(!grid)return;
  const cards=$$(".card",grid),total=cards.length;
  const params=new URLSearchParams(location.search);
  const S={q:params.get("q")||"",city:params.get("city")||params.get("region")||"all",len:params.get("len")||"any",sort:params.get("sort")||"rec",multi:params.get("type")==="multi",saved:false};
  const cityOpts=[{v:"all",l:"All destinations",ic:"ph-globe-hemisphere-east"},...(CFG.cities||[]).map(c=>({v:c.k,l:c.name,s:"Italy",ic:"ph-map-pin"})),...(CFG.regions||[]).map(r=>({v:r.k,l:r.name,s:r.sub,ic:r.k==="cruises"?"ph-boat":"ph-globe-hemisphere-west"}))];
  if(!cityOpts.some(o=>o.v===S.city))S.city="all";
  const aCity=Dropdown($("#aCity"),{boxed:true,value:S.city,options:cityOpts,onChange:v=>{S.city=v;render(true)}});
  const aLen=Dropdown($("#aLen"),{boxed:true,value:S.len,options:[{v:"any",l:"Any length",ic:"ph-moon-stars"},{v:"s",l:"2 to 3 nights",ic:"ph-moon"},{v:"m",l:"4 to 5 nights",ic:"ph-moon"},{v:"l",l:"6 nights or more",ic:"ph-moon-stars"}],onChange:v=>{S.len=v;render(true)}});
  const aSort=Dropdown($("#aSort"),{boxed:true,value:S.sort,options:[{v:"rec",l:"Recommended",ic:"ph-sparkle"},{v:"lo",l:"Price, low to high",ic:"ph-sort-ascending"},{v:"hi",l:"Price, high to low",ic:"ph-sort-descending"},{v:"short",l:"Shortest first",ic:"ph-clock-counter-clockwise"},{v:"long",l:"Longest first",ic:"ph-clock-clockwise"}],onChange:v=>{S.sort=v;render(true)}});
  const q=$("#aQ");if(q){q.value=S.q;let qt;q.addEventListener("input",e=>{clearTimeout(qt);qt=setTimeout(()=>{S.q=e.target.value.trim().toLowerCase();render(true)},180)})}
  const m=$("#aMulti"),sv=$("#aSaved");if(m){m.checked=S.multi;m.addEventListener("change",e=>{S.multi=e.target.checked;render(true)})}if(sv)sv.addEventListener("change",e=>{S.saved=e.target.checked;render(true)});
  const isRegion=v=>(CFG.regions||[]).some(r=>r.k===v);
  function render(anim){
    const list=cards.filter(c=>{const d=c.dataset,n=+d.nights;
      return (S.city==="all"||(isRegion(S.city)?d.region===S.city:d.cities.split(" ").includes(S.city)))&&(!S.multi||d.multi==="1")&&(!S.saved||saved.has(d.slug))
      &&(S.len==="any"||(S.len==="s"&&n<=3)||(S.len==="m"&&n>=4&&n<=5)||(S.len==="l"&&n>=6))&&(!S.q||d.search.includes(S.q))});
    const so={lo:(a,b)=>+a.dataset.price-+b.dataset.price,hi:(a,b)=>+b.dataset.price-+a.dataset.price,short:(a,b)=>+a.dataset.nights-+b.dataset.nights,long:(a,b)=>+b.dataset.nights-+a.dataset.nights}[S.sort];
    const ordered=so?[...list].sort(so):[...list].sort((a,b)=>cards.indexOf(a)-cards.indexOf(b));
    cards.forEach(c=>{c.classList.add("hide");c.classList.remove("pop-in","rv")});
    ordered.forEach((c,i)=>{c.classList.remove("hide");c.style.setProperty("--i",i);c.classList.add("in");if(anim){c.getBoundingClientRect();c.classList.add("pop-in")}grid.appendChild(c)});
    const cnt=$("#aCount");if(cnt)cnt.innerHTML=`Showing <b>${list.length}</b> of ${total} packages`;
    let em=$("#allEmpty");if(!list.length){if(!em){em=document.createElement("div");em.id="allEmpty";em.className="empty";em.innerHTML=`<i class="ph-light ph-map-trifold"></i><h3>No packages match those filters</h3><p class="muted">Try a different destination or length.</p><button class="btn btn-teal btn-sm" style="margin-top:18px" type="button">Reset filters<span class="ico"><i class="ph-light ph-arrow-counter-clockwise"></i></span></button>`;em.querySelector("button").addEventListener("click",()=>{Object.assign(S,{q:"",city:"all",len:"any",sort:"rec",multi:false,saved:false});aCity.set("all",true);aLen.set("any",true);aSort.set("rec",true);if(q)q.value="";if(m)m.checked=false;if(sv)sv.checked=false;render(true)});grid.appendChild(em)}}else if(em)em.remove();
    const u=new URL(location.href);["city","region","len","sort","q","type"].forEach(k=>u.searchParams.delete(k));if(S.city!=="all")u.searchParams.set(isRegion(S.city)?"region":"city",S.city);if(S.len!=="any")u.searchParams.set("len",S.len);if(S.sort!=="rec")u.searchParams.set("sort",S.sort);if(S.q)u.searchParams.set("q",S.q);if(S.multi)u.searchParams.set("type","multi");history.replaceState(null,"",u.pathname+(u.search||""));
  }
  window.__renderAll=render;
  render(false);
  if(params.get("date")){const d=new Date(params.get("date")+"T00:00:00");if(!isNaN(d))toast(`Showing trips from ${fmt(d,true)}`,"ph-calendar-check")}
})();

/* ================= PACKAGE DETAIL ================= */
(function(){
  const v=$("#pkg");if(!v)return;
  const p=CFG.pkg;if(!p)return;
  const W_=!!p.w,cruise=p.cruise;
  $$(".d-thumbs button",v).forEach(b=>b.addEventListener("click",()=>{$$(".d-thumbs button",v).forEach(x=>x.classList.toggle("on",x===b));const im=$("#dImg");im.animate([{opacity:1},{opacity:.2}],{duration:220,fill:"forwards"}).onfinish=()=>{im.srcset=b.dataset.srcset||"";im.sizes="100vw";im.src=b.dataset.src;if(b.dataset.alt)im.alt=b.dataset.alt;im.onload=()=>im.animate([{opacity:.2,transform:"scale(1.08)"},{opacity:1,transform:"scale(1.02)"}],{duration:900,easing:"cubic-bezier(.22,1,.36,1)",fill:"forwards"})}}));
  const st={date:null,g:{adults:2,children:0},room:"std",total:p.price};
  const params=new URLSearchParams(location.search);
  const dd=DatePicker($("#dDate"),{boxed:true,nights:p.nights,placeholder:W_?"Choose departure":"Choose check-in",onChange:d=>{st.date=d;calc()}});
  const gp=GuestPicker($("#dGuests"),{boxed:true,adults:+(params.get("adults")||2)||2,children:+(params.get("children")||0)||0,onChange:g=>{st.g=g;calc()}});
  st.g={adults:gp.adults,children:gp.children};
  Dropdown($("#dRoom"),{boxed:true,value:"std",options:[{v:"std",l:"As listed",s:p.roomStd,ic:"ph-bed"},{v:"up",l:"Upgrade on request",s:p.roomUp,ic:"ph-crown-simple"}],onChange:r=>{st.room=r;calc()}});
  $$("[data-add]",v).forEach(c=>c.addEventListener("change",calc));
  function calc(){
    const ppl=st.g.adults+st.g.children,base=p.price*st.g.adults+p.price*.6*st.g.children;
    const add=$$("[data-add]:checked",v).reduce((a,c)=>a+ +c.dataset.add,0)*ppl+(st.room==="up"&&!W_?40*p.nights*Math.ceil(st.g.adults/2):0);
    st.total=base+add;
    $("#tLine").textContent=`${st.g.adults} adult${st.g.adults>1?"s":""}${st.g.children?` + ${st.g.children} child${st.g.children>1?"ren":""}`:""}`;
    $("#tBase").textContent=p.quote?"On request":money(base);$("#tAdd").textContent=money(add);
    const t=$("#tTot");const old=t.textContent;t.textContent=p.quote?"On request":money(st.total);if(old&&old!==t.textContent)t.animate([{transform:"translateY(6px)",opacity:.3},{transform:"none",opacity:1}],{duration:450,easing:"cubic-bezier(.22,1,.36,1)"});
    $("#dWa").href=`https://wa.me/${WA}?text=${encodeURIComponent(`Hi Preplan, I'd like "${p.t}"${st.date?` from ${fmt(st.date,true)}`:""} for ${ppl} traveller${ppl>1?"s":""}.`)}`;
  }
  calc();
  const book=()=>{if(!st.date){$("#bk").scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>dd.open(),mobile()?500:350);toast(W_?"Pick a departure date first":"Pick a check-in date first","ph-calendar-blank");return}openModal(p,st)};
  $("#dBook").addEventListener("click",book);
  const mb=$("#mbarBtn");if(mb)mb.onclick=book;
  let heroVis=true,bkVis=false;const upd=()=>{const b=$("#mbar");b&&b.classList.toggle("show",!heroVis&&!bkVis)};
  new IntersectionObserver(([e])=>{heroVis=e.isIntersecting;upd()}).observe($(".d-hero",v));
  new IntersectionObserver(([e])=>{bkVis=e.isIntersecting;upd()}).observe($("#bk"));
  const im=$("#dImg");const ld=()=>$(".d-hero",v).classList.add("loaded");im.complete?requestAnimationFrame(ld):im.addEventListener("load",ld,{once:true});
})();

/* ---------- booking modal ---------- */
let bBed,modalPkg,modalSt;
function openModal(p,st){
  modalPkg=p;modalSt=st;const ppl=st.g.adults+st.g.children;
  $("#mSum").innerHTML=`<img src="${p.img}" alt="" width="76" height="64"><div><b>${p.t}</b><span>${fmt(st.date)} to ${fmt(addDays(st.date,p.nights),true)}, ${ppl} traveller${ppl>1?"s":""}</span></div><span class="t">${p.quote?"On request":money(st.total)}</span>`;
  if(!bBed)bBed=Dropdown($("#bBed"),{boxed:true,value:"double",options:[{v:"double",l:"Double bed",ic:"ph-bed"},{v:"twin",l:"Twin beds",ic:"ph-bed"},{v:"none",l:"No preference",ic:"ph-shuffle"}]});
  $("#mForm").style.display="";$("#mDone").classList.remove("show");
  $("#modal").classList.add("show");document.body.classList.add("lock");setTimeout(()=>$("#bName").focus({preventScroll:true}),400);
}
function closeModal(){const m=$("#modal");if(!m||!m.classList.contains("show"))return;closePop();m.classList.remove("show");if(!document.body.classList.contains("menu-open"))document.body.classList.remove("lock")}
$$("#modal [data-close]").forEach(b=>b.addEventListener("click",closeModal));
(function(){const m=$("#modal");if(!m)return;m.addEventListener("keydown",e=>{if(e.key!=="Tab")return;const f=$$("a[href],button:not([disabled]),input:not([disabled]),textarea,[tabindex]:not([tabindex='-1'])",m).filter(x=>x.offsetParent!==null);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}})})();
(function(){const f=$("#bForm");if(!f)return;wireErrors(f);
  f.addEventListener("input",e=>{const x=e.target.closest(".field");x&&x.classList.remove("bad")});
  f.addEventListener("submit",async e=>{e.preventDefault();
    if(!validate(f,{name:()=>$("#bName").value.trim().length>1,email:()=>emailOk($("#bEmail").value.trim()),consent:()=>$("#bTerms").checked}))return;
    const btn=$("button[type=submit]",f);btn.classList.add("loading");btn.querySelector("i").className="ph-bold ph-circle-notch";
    const ref="PPH-"+Math.floor(100000+Math.random()*899999);
    const p=modalPkg,st=modalSt,ppl=st.g.adults+st.g.children;
    const payload={type:"booking",ref,package:p.t,url:location.href,checkin:iso(st.date),nights:p.nights,adults:st.g.adults,children:st.g.children,room:st.room,addons:$$("[data-add]:checked").map(c=>c.parentNode.textContent.trim()),total:p.quote?"On request":money(st.total),name:$("#bName").value.trim(),email:$("#bEmail").value.trim(),phone:$("#bPhone").value.trim(),bed:bBed.value};
    const text=`Hi Preplan, booking request ${ref}.\n${p.t}\n${fmt(st.date,true)} for ${p.nights} nights, ${ppl} traveller${ppl>1?"s":""}\nBed: ${payload.bed}\nEstimated total: ${payload.total}\nLead traveller: ${payload.name}\nEmail: ${payload.email}${payload.phone?`\nPhone: ${payload.phone}`:""}`;
    try{await deliver(payload,text);$("#mForm").style.display="none";$("#mRef").innerHTML=`Reference <b>${ref}</b>. We will email ${payload.email} once ${p.holdText} held.`;$("#mDone").classList.add("show");f.reset()}
    catch(err){toast("Could not send. Please try WhatsApp or call us.","ph-warning")}
    finally{btn.classList.remove("loading");btn.querySelector("i").className="ph-bold ph-arrow-right"}
  });
})();

/* ================= NAV ================= */
const nav=$("#nav"),pill=$(".nav-pill"),links=$$(".island.links .nav-link");
let activeLink=links.find(l=>l.classList.contains("on"))||null;
function movePill(a){if(!pill)return;if(!a||getComputedStyle($(".island.links")).display==="none"){pill.style.opacity=0;return}pill.style.opacity=1;pill.style.width=a.offsetWidth+"px";pill.style.transform=`translateX(${a.offsetLeft-6}px)`;pill.style.left="6px"}
function setActive(a){links.forEach(l=>l.classList.toggle("on",l===a));movePill(a)}
const linkIsland=$(".island.links");
if(linkIsland){
  linkIsland.addEventListener("mouseover",e=>{const a=e.target.closest(".nav-link");if(a){links.forEach(l=>l.classList.toggle("on",l===a));movePill(a)}});
  linkIsland.addEventListener("mouseleave",()=>setActive(activeLink));
  window.addEventListener("resize",()=>movePill(activeLink));
  document.fonts&&document.fonts.ready.then(()=>movePill(activeLink));
  requestAnimationFrame(()=>movePill(activeLink));
}
const sentinel=document.createElement("div");sentinel.style.cssText="position:absolute;top:0;left:0;width:1px;height:62vh;pointer-events:none";document.body.prepend(sentinel);
new IntersectionObserver(([e])=>nav&&nav.classList.toggle("solid",!e.isIntersecting)).observe(sentinel);

/* mobile menu */
const burger=$("#burger");
function closeMenu(){if(!document.body.classList.contains("menu-open"))return;document.body.classList.remove("menu-open","lock");burger&&burger.setAttribute("aria-expanded","false");$("#mmenu").setAttribute("aria-hidden","true")}
burger&&burger.addEventListener("click",()=>{const o=!document.body.classList.contains("menu-open");document.body.classList.toggle("menu-open",o);document.body.classList.toggle("lock",o);burger.setAttribute("aria-expanded",o);$("#mmenu").setAttribute("aria-hidden",!o)});

/* magnetic buttons (fine pointers only) */
if(matchMedia("(hover:hover) and (pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
  document.addEventListener("pointermove",e=>{const b=e.target.closest(".btn:not(.full)");$$(".btn.mag").forEach(x=>{if(x!==b){x.classList.remove("mag");x.style.transform=""}});if(!b)return;const r=b.getBoundingClientRect();b.classList.add("mag");b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.22}px)`});
}

/* boot */
observe();
requestAnimationFrame(()=>{$$(".hero .mask, .hero .rv, .page-top .mask, .page-top .rv, .d-hero .rv, .d-hero .mask").forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight)el.classList.add("in")})});
const heroImg=$(".hero-media img");if(heroImg){const loaded=()=>{const h=heroImg.closest(".hero,.d-hero");h&&h.classList.add("loaded")};heroImg.complete?requestAnimationFrame(loaded):heroImg.addEventListener("load",loaded,{once:true});setTimeout(loaded,1500)}
})();
