// ELVIS | AIMATEL PROJECTS - FIELD OS LOGIC
let tickets=JSON.parse(localStorage.getItem('tickets')||'[]'), installs=JSON.parse(localStorage.getItem('installs')||'[]'), los=JSON.parse(localStorage.getItem('los')||'[]'), maint=JSON.parse(localStorage.getItem('maint')||'[]'), photos=JSON.parse(localStorage.getItem('photos')||'[]');
let inv=JSON.parse(localStorage.getItem('inv')||'[{"name":"SC/APC connectors","used":8,"rem":142},{"name":"ONU","used":2,"rem":17},{"name":"1×8 splitter","used":1,"rem":6},{"name":"Drop cable","used":180,"rem":1420,"unit":"m"},{"name":"RJ45","used":6,"rem":94},{"name":"Fiber sleeves","used":5,"rem":80}]');

setInterval(()=>{let el=document.getElementById('clock'); if(el) el.innerText=new Date().toLocaleString('en-KE')},1000);

function go(id){
 document.querySelectorAll('[id^="p-"]').forEach(e=>e.classList.add('hidden'));
 document.getElementById('p-'+id).classList.remove('hidden');
 document.querySelectorAll('.nav').forEach(e=>e.classList.remove('active'));
 document.getElementById('n-'+id).classList.add('active');
 render();
}

async function getImgs(inp){
 let arr=[];
 for(let f of inp.files){
  arr.push(await new Promise(res=>{
   let rd=new FileReader(); rd.onload=e=>res(e.target.result); rd.readAsDataURL(f);
  }));
 }
 return arr;
}

async function addTicket(){
 let imgs=await getImgs(document.getElementById('tPhotos'));
 let o={id:Date.now(),customer:tCust.value,job:tJob.value,loc:tLoc.value,cause:tCause.value,action:tAction.value,power:tPower.value,status:tStatus.value,photos:imgs,date:new Date().toLocaleString()};
 if(!o.customer) return alert('Customer needed');
 tickets.unshift(o); localStorage.setItem('tickets',JSON.stringify(tickets)); render();
}

async function addLOS(){
 let imgs=await getImgs(document.getElementById('lPhotos'));
 let o={id:Date.now(),customer:lCust.value,loc:lLoc.value,time:lTime.value,issue:lIssue.value,olt:lOLT.value,pon:lPON.value,onu:lONU.value,power:lPower.value,cause:lCause.value,action:lAction.value,result:lRes.value,photos:imgs,date:new Date().toLocaleString()};
 los.unshift(o); localStorage.setItem('los',JSON.stringify(los)); render();
}

async function addInstall(){
 let imgs=await getImgs(document.getElementById('iPhotos'));
 let o={id:Date.now(),customer:iCust.value,location:iLoc.value,onu:iONU.value,router:iRouter.value,cable:iCable.value,splitter:iSplit.value,power:iPow.value,pppoe:iPPPoE.value,date:iDate.value,photos:imgs};
 installs.unshift(o); localStorage.setItem('installs',JSON.stringify(installs)); render();
}

function addMaint(){
 let o={id:Date.now(),task:mTask.value,loc:mLoc.value,date:mDate.value,by:mBy.value,notes:mNotes.value};
 maint.unshift(o); localStorage.setItem('maint',JSON.stringify(maint)); render();
}

function addPhoto(){
 let f=sPhoto.files[0]; if(!f) return alert('Pick photo');
 let rd=new FileReader(); rd.onload=e=>{
  let o={id:Date.now(),src:e.target.result,cap:sCap.value,date:new Date().toLocaleString()};
  photos.unshift(o); localStorage.setItem('photos',JSON.stringify(photos)); render();
 }; rd.readAsDataURL(f);
}

function saveInv(){localStorage.setItem('inv',JSON.stringify(inv)); alert('Inventory Saved');}

function render(){
 let kToday=tickets.length+los.length+installs.length;
 let kDone=tickets.filter(t=>t.status=='Completed').length+los.filter(l=>l.result.includes('Restored')).length;
 let kPend=tickets.filter(t=>t.status!='Completed').length;
 let kInst=installs.length;
 if(document.getElementById('k-today')) document.getElementById('k-today').innerText=kToday;
 if(document.getElementById('k-done')) document.getElementById('k-done').innerText=kDone;
 if(document.getElementById('k-pend')) document.getElementById('k-pend').innerText=kPend;
 if(document.getElementById('k-inst')) document.getElementById('k-inst').innerText=kInst;
 document.getElementById('c-all').innerText=kToday;
 document.getElementById('c-tick').innerText=tickets.length;
 document.getElementById('c-los').innerText=los.length;
 document.getElementById('c-inst').innerText=installs.length;
 document.getElementById('c-photo').innerText=photos.length;
 document.getElementById('losNo').innerText=String(los.length+24).padStart(3,'0');
 document.getElementById('summary').innerHTML=`Installations: ${installs.length}<br>LOS/Faults: ${los.length}<br>Maintenance: ${maint.length}<br>Completed: ${kDone}<br>Fiber Cuts: ${los.filter(l=>l.cause.toLowerCase().includes('cut')).length}`;
 document.getElementById('invDash').innerHTML=inv.map(i=>`<tr><td>${i.name}</td><td>${i.used}${i.unit||''}</td><td>${i.rem}${i.unit||''}</td></tr>`).join('');
 document.getElementById('invTable').innerHTML=inv.map((it,i)=>`<tr><td>${it.name}</td><td><input type="number" value="${it.used}" onchange="inv[${i}].used=parseInt(this.value)" class="inp" style="padding:4px"></td><td><input type="number" value="${it.rem}" onchange="inv[${i}].rem=parseInt(this.value)" class="inp" style="padding:4px"> ${it.unit||''}</td><td><button onclick="inv[${i}].used++;inv[${i}].rem--;saveInv();render()" class="btn" style="padding:4px 8px">+1</button></td></tr>`).join('');
 document.getElementById('ticketList').innerHTML=tickets.map(t=>`<div style="border-bottom:1px solid #eee;padding:8px 0"><b>${t.customer}</b> <span class="badge ${t.job=='LOS'?'los':'ok'}">${t.job}</span> @ ${t.loc} - ${t.power}<br><small class="mono">Cause:${t.cause} | Action:${t.action} | ${t.status} | ${t.date}</small><div>${(t.photos||[]).map(p=>`<img src="${p}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;margin:2px">`).join('')}</div></div>`).join('')||'No tickets';
 document.getElementById('losList').innerHTML=los.map(l=>`<div style="border-bottom:1px solid #fee2e2;padding:8px 0"><b>LOS #${l.id}</b> ${l.customer} @ ${l.loc} ${l.power} - ${l.result}<br><small class="mono">${l.olt} | ${l.pon} | ${l.onu} | Cause:${l.cause} | Action:${l.action} | ${l.date}</small></div>`).join('')||'No LOS';
 document.getElementById('installList').innerHTML=installs.map(i=>`<div style="border-bottom:1px solid #eee;padding:8px 0"><b>${i.customer}</b> - ${i.location} - ONU:${i.onu} Router:${i.router}<br><small class="mono">Cable:${i.cable} Split:${i.splitter} Power:${i.power} PPPoE:${i.pppoe} Date:${i.date}</small></div>`).join('')||'No installs';
 document.getElementById('maintList').innerHTML=maint.map(m=>`<div style="border-bottom:1px solid #eee;padding:8px 0"><b>${m.task}</b> @ ${m.loc} ${m.date} by ${m.by}<br><small>${m.notes}</small></div>`).join('')||'No maintenance';
 document.getElementById('photoGrid').innerHTML=photos.map(p=>`<div style="background:white;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0"><img src="${p.src}" style="width:100%;height:90px;object-fit:cover"><div style="padding:6px"><small class="mono" style="font-size:9px">${p.cap}<br>${p.date}</small></div></div>`).join('');
}

let revolveIndex=0; const revolveItems=['Tickets','LOS / Faults','Installations','Site Photos'];
setInterval(()=>{
 if(!document.getElementById('autoRevolve')?.checked) return;
 if(document.getElementById('p-dash').classList.contains('hidden')) return;
 revolveIndex=(revolveIndex+1)%revolveItems.length;
 let title=revolveItems[revolveIndex]; document.getElementById('revolveTitle').innerText=title;
 let box=document.getElementById('revolveBox'); if(!box) return;
 if(title=='Tickets') box.innerHTML=document.getElementById('ticketList').innerHTML.slice(0,900);
 if(title=='LOS / Faults') box.innerHTML=document.getElementById('losList').innerHTML.slice(0,900);
 if(title=='Installations') box.innerHTML=document.getElementById('installList').innerHTML.slice(0,900);
 if(title=='Site Photos') box.innerHTML=`<div class="photos">${document.getElementById('photoGrid').innerHTML.slice(0,1200)}</div>`;
},8000);

function exportAll(){
 let csv='Type,Customer,Location,Details,Power,Status,Date\n';
 tickets.forEach(t=>csv+=`Ticket,"${t.customer}","${t.loc}","${t.cause} | ${t.action}","${t.power}","${t.status}","${t.date}"\n`);
 los.forEach(l=>csv+=`LOS,"${l.customer}","${l.loc}","${l.cause} | ${l.action}","${l.power}","${l.result}","${l.date}"\n`);
 installs.forEach(i=>csv+=`Install,"${i.customer}","${i.location}","${i.onu} ${i.router} ${i.cable}","${i.power}","Done","${i.date}"\n`);
 const b=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='AIMATEL_'+new Date().toISOString().slice(0,10)+'.csv'; a.click();
}
render();
