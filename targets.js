/* PedRheum Atlas v0.4 – treat-to-target SLE criteria.
 * Source: DORIS 2021 (doi:10.1136/lupus-2021-000538), LLDAS 2016 (doi:10.1136/annrheumdis-2015-207726).
 * Uses SLETools.complete SLEDAI-2K questionnaire. No persistent patient storage.
 */
'use strict';
const SLETargets=(()=>{
 const responses={doris:{},lldas:{}};
 const source={
  doris:[['2021 DORIS: lupus remisyonunun uluslararası tanımı','https://lupus.bmj.com/content/8/1/e000538.full'],['DORIS düzeltme bildirimi (2022)','https://lupus.bmj.com/content/9/1/e000538corr1']],
  lldas:[['Franklyn ve ark. LLDAS özgün tanımı, Ann Rheum Dis 2016','https://pubmed.ncbi.nlm.nih.gov/26458737/'],['LLDAS tanımı – tam metin','https://ard.bmj.com/content/early/2015/10/11/annrheumdis-2015-207726.full']]
 };
 const titles={doris:'DORIS 2021',lldas:'LLDAS'};
 const e=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
 const sym=(id)=>`<svg class="icon" aria-hidden="true"><use href="#i-${id}"></use></svg>`;
 const mainFields=[
  {id:'pga',label:'Physician Global Assessment (PGA)',hint:'0–3 ölçeği. 0 = aktivite yok; 3 = en yüksek aktivite. Sayısal değer (ör. 0,4).',type:'number'},
  {id:'pred',label:'Güncel prednizolon eşdeğeri',hint:'Toplam günlük glukokortikoid dozu (mg/gün). 0 mg için 0 girin. Başka kortikosteroid kullanılıyorsa eşdeğerini önceden hesaplayın.',type:'number'}
 ];
 const extras={
  doris:[{id:'stable',label:'Güncel antimalaryal / immünsüpresif / biyolojik tedavi uygun ve stabil mi?',hint:'Tedavi yoksa veya antimalaryal kullanılıyorsa ve gerekli durumlarda immünsüpresif / biyolojik tedavi stabil idame dozundaysa “Evet”. Aktivite nedeniyle yeni yoğunlaştırılmış / değişken tedavide “Hayır”.'}],
  lldas:[
   {id:'new',label:'Önceki değerlendirmeye göre yeni lupus aktivite bulgusu var mı?',hint:'Yeni klinik lupus aktivitesi varsa “Evet”. Önceki değerlendirmeye göre yeni bulgu yoksa “Hayır”.'},
   {id:'gi',label:'Aktif lupus ilişkili gastrointestinal tutulum var mı?',hint:'SLEDAI-2K’de ayrı bir madde olarak bulunmayan aktif gastrointestinal SLE tutulumunu da sorgulayın.'},
   {id:'ha',label:'Aktif lupus ilişkili hemolitik anemi var mı?',hint:'SLEDAI-2K’de yer almayan hemolitik anemi, LLDAS majör tutulum dışlama ölçütüdür.'},
   {id:'cardio',label:'SLEDAI dışında aktif önemli kardiyopulmoner tutulum var mı?',hint:'Plörit/perikardit dahil SLEDAI’de işaretlenmiş bulgular otomatik kontrol edilir. Onların dışında aktif kardiyopulmoner tutulum varsa “Evet”.'},
   {id:'maintenance',label:'Tedavi uygun ve iyi tolere edilen standart idame düzeyinde mi?',hint:'Tedavi gerekmiyorsa veya antimalaryal / ruhsatlı biyolojik / immünsüpresif ilaçlar uygun, iyi tolere edilen standart idame dozundaysa “Evet”. Araştırma tedavisi veya yüksek yoğunluklu indüksiyon söz konusuysa “Hayır”.'}
  ]
 };
 const numericOk=(v,min,max)=>v!==undefined&&v!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
 const showNum=(v)=>Number(v).toLocaleString('tr-TR',{maximumFractionDigits:2});
 function getSledai(){const st=SLETools.state('sledai');const a=SLETools.answers.sledai;const total=st.ready?SLETools.sum('sledai'):null;
  const clinical=st.ready?SLETools.items.sledai.filter(x=>!['kompleman','dsdna'].includes(x.id)).reduce((n,x)=>n+(a[x.id]==='yes'?x.weight:0),0):null;
  // Major organ activity is defined in original LLDAS; some SLEDAI elements are proxies.
  const majorIds=['nobet','psikoz','organik','gorme','kraniyal','basagrisi','svo','vaskulit','silendir','hematuri','proteinuri','piyuri','plorit','perikardit','ates'];
  const marked=st.ready?SLETools.items.sledai.filter(x=>majorIds.includes(x.id)&&a[x.id]==='yes').map(x=>x.label):[];
  return {complete:st.ready,done:st.done,totalFields:st.total,total,clinical,major:marked};
 }
 function getStatus(id){const a=responses[id],base=getSledai(),core=mainFields.every(x=>numericOk(a[x.id],0,x.id==='pga'?3:10000));
  const rest=extras[id].every(x=>a[x.id]==='yes'||a[x.id]==='no');
  const ready=base.complete&&core&&rest;
  let checks=[];
  if(ready){
   if(id==='doris')checks=[
    {name:'Klinik SLEDAI-2K = 0',ok:base.clinical===0,detail:`Klinik SLEDAI: ${base.clinical} (anti-dsDNA ve kompleman dışarıda)`},
    {name:'PGA <0,5 (0–3 ölçeğinde)',ok:Number(a.pga)<0.5,detail:`Girilen: ${showNum(a.pga)}`},
    {name:'Prednizolon eşdeğeri ≤5 mg/gün',ok:Number(a.pred)<=5,detail:`Girilen: ${showNum(a.pred)} mg/gün`},
    {name:'İzin verilen tedaviler ve stabil idame',ok:a.stable==='yes',detail:a.stable==='yes'?'Uygun':'Tedavi uygunluğu / stabilitesi doğrulanmadı'}
   ];
   else checks=[
    {name:'SLEDAI-2K ≤4',ok:base.total<=4,detail:`Toplam SLEDAI-2K: ${base.total}`},
    {name:'Majör organ aktivitesi yok',ok:base.major.length===0&&a.gi==='no'&&a.ha==='no'&&a.cardio==='no',detail:base.major.length?`SLEDAI’de işaretlenenler: ${base.major.join(', ')}`:'SLEDAI majör tutulum maddeleri negatif',extra: ['gi','ha','cardio'].filter(k=>a[k]==='yes').map(k=>({gi:'Gastrointestinal tutulum',ha:'Hemolitik anemi',cardio:'Diğer kardiyopulmoner tutulum'}[k]))},
    {name:'Önceki değerlendirmeye göre yeni aktivite yok',ok:a.new==='no',detail:a.new==='no'?'Yeni özellik yok':'Yeni lupus aktivitesi bildirildi'},
    {name:'PGA ≤1 (0–3 ölçeğinde)',ok:Number(a.pga)<=1,detail:`Girilen: ${showNum(a.pga)}`},
    {name:'Prednizolon eşdeğeri ≤7,5 mg/gün',ok:Number(a.pred)<=7.5,detail:`Girilen: ${showNum(a.pred)} mg/gün`},
    {name:'Uygun ve iyi tolere edilen standart idame tedavisi',ok:a.maintenance==='yes',detail:a.maintenance==='yes'?'Uygun':'İdame tedavi koşulu karşılanmadı'}
   ];
  }
  return {base,ready,checks,met:ready&&checks.every(x=>x.ok),done:(base.complete?1:0)+mainFields.filter(x=>numericOk(a[x.id],0,x.id==='pga'?3:10000)).length+extras[id].filter(x=>a[x.id]!==undefined).length,count:1+mainFields.length+extras[id].length};
 }
 function choiceRow(id,x){const val=responses[id][x.id];return `<div class="lupus-row" id="target-${e(x.id)}"><div class="lupus-item-head"><b>${e(x.label)}</b></div><div class="lupus-hint">${e(x.hint)}</div><div class="lupus-options">${[['yes','Evet'],['no','Hayır']].map(([v,label])=>`<button type="button" data-target-choice="${id}" data-target-field="${x.id}" data-target-value="${v}" class="lupus-pill ${val===v?'is-on':''}" aria-pressed="${val===v}">${label}</button>`).join('')}</div></div>`}
 function numberRow(id,x){let v=responses[id][x.id]??'';const ok=numericOk(v,0,x.id==='pga'?3:10000);return `<div class="lupus-row"><div class="lupus-item-head"><b>${e(x.label)}</b><span class="lupus-weight">${x.id==='pred'?'mg/gün':'0–3'}</span></div><div class="lupus-hint">${e(x.hint)}</div><div class="lupus-extra target-number"><label for="tgt-${id}-${x.id}">${x.id==='pga'?'PGA':'Prednizolon eşdeğeri'}</label><input type="number" inputmode="decimal" step="0.1" min="0" max="${x.id==='pga'?'3':'10000'}" data-target-number="${id}" data-target-field="${x.id}" id="tgt-${id}-${x.id}" value="${e(v)}" placeholder="${x.id==='pga'?'Örn. 0.4':'Örn. 5'}" aria-invalid="${v!==''&&!ok}"><small>${v!==''&&!ok?'Geçerli sayı girin.':'Bu alan zorunludur.'}</small></div></div>`}
 function render(id){if(!['doris','lldas'].includes(id))return '';const st=getStatus(id),a=responses[id];const isD=id==='doris';
  const preface=isD?'Klinik remisyon · 2021 DORIS tanımı':'Düşük hastalık aktivitesi · Özgün LLDAS tanımı';
  const referenceLinks=source[id].map(([t,url])=>`<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(t)} ↗</a>`).join('');
  return `<button type="button" class="breadcrumb-back" data-go="scores/sle">${sym('back')} SLE skorlarına dön</button>
   <div class="lupus-heading"><div><span class="lupus-eyebrow">SLE · TEDAVİ HEDEFİ</span><h1>${titles[id]}</h1><p>${preface}. Bütün zorunlu alanlar tamamlanmadan değerlendirme sonucu gösterilmez.</p></div><span class="lupus-chip">KRİTER DENETİMİ</span></div>
   <div class="lupus-alert">${sym('info')}<span>${isD?'Remisyon: klinik SLEDAI-2K = 0, PGA <0,5, prednizolon ≤5 mg/gün ve uygun stabil tedavi. Serolojik aktivite tek başına dışlama kriteri değildir.':'LLDAS: SLEDAI-2K ≤4; majör organlarda aktivite yok; yeni aktivite yok; PGA ≤1; prednizolon ≤7,5 mg/gün; uygun ve iyi tolere edilen idame tedavisi.'}</span></div>
   <div class="lupus-two-col"><div class="lupus-questions"><div class="lupus-topline"><div><b>Değerlendirme formu</b><small>SLEDAI-2K yanıtları diğer araçla ortak kullanılır</small></div><span class="lupus-counter">${st.done} / ${st.count}</span></div><div class="lupus-progress"><div style="width:${(100*st.done/st.count).toFixed(2)}%"></div></div>
   <section class="lupus-group"><div class="lupus-group-title"><h3>1 · SLEDAI-2K değerlendirmesi</h3><span>zorunlu</span></div><div class="target-sledai-status ${st.base.complete?'ready':''}"><div><b>${st.base.complete?'SLEDAI-2K formu tamamlandı':'SLEDAI-2K formu eksik'}</b><small>${st.base.done} / ${st.base.totalFields} madde yanıtlandı${st.base.complete?` · Toplam: ${st.base.total} · Klinik: ${st.base.clinical}`:''}</small></div><button type="button" data-go="scores/sledai">${st.base.complete?'SLEDAI’yi düzenle':'SLEDAI’yi doldur'} ${sym('arrow')}</button></div><p class="target-helper">${isD?'DORIS için anti-dsDNA ve düşük kompleman maddeleri klinik SLEDAI hesabına katılmaz.':'LLDAS için seroloji dahil toplam SLEDAI-2K puanı esas alınır; majör organ aktivitesi ayrıca incelenir.'}</p></section>
   ${group('2 · Ortak klinik veriler',mainFields.map(x=>numberRow(id,x)).join(''))}
   ${group('3 · Ek kriterler',extras[id].map(x=>choiceRow(id,x)).join(''))}
   </div><aside class="lupus-aside"><div class="lupus-result target-result"><div class="lupus-result-kicker">${isD?'DORIS REMİSYONU':'LLDAS DURUMU'}</div>${!st.ready?`<div class="lupus-no-score">—</div><p class="lupus-locked">${sym('clock')} Eksik ya da geçersiz yanıtlarla sonuç hesaplanmaz.</p><p class="lupus-pending">${st.count-st.done} bölüm tamamlanmalı</p>`:`<div class="target-outcome ${st.met?'met':'unmet'}">${st.met?'KRİTERLER KARŞILANIYOR':'KRİTERLER KARŞILANMIYOR'}</div><p class="lupus-interpretation">${st.met?isD?'DORIS 2021 remisyon kriterleri karşılandı.':'LLDAS düşük hastalık aktivitesi koşulları karşılandı.':isD?'DORIS remisyon koşullarının tamamı karşılanmadı.':'LLDAS koşullarının tamamı karşılanmadı.'}</p><div class="target-checks">${st.checks.map(x=>`<div class="target-check ${x.ok?'pass':'fail'}"><span class="target-check-icon">${x.ok?'✓':'×'}</span><div><b>${e(x.name)}</b><small>${e(x.detail)}</small>${x.extra?.length?`<small>${e(x.extra.join(', '))}</small>`:''}</div></div>`).join('')}</div>`}</div>
   <div class="lupus-side-note">${sym('alert')}<p>Bu araç ölçütlerin anlık karşılanmasını gösterir; sürdürülen remisyon/LLDAS süresini değerlendirmez. Pediatrik SLE’de klinik yorum ve tedavi kararı uzman hekimindir.</p></div><div class="lupus-actions"><button type="button" data-target-copy="${id}" ${!st.ready?'disabled':''}>${sym('copy')} Sonucu kopyala</button><button type="button" data-target-reset="${id}">${sym('refresh')} Ek alanları sıfırla</button></div><div class="lupus-references"><h3>Özgün kaynaklar</h3>${referenceLinks}</div><div class="lupus-privacy">${sym('shield')} Bilgiler yalnızca tarayıcınızda, sayfa açık kaldığı sürece tutulur.</div></aside></div>`;
 }
 function group(label,html){return `<section class="lupus-group"><div class="lupus-group-title"><h3>${label}</h3></div>${html}</section>`}
 function redraw(id,focus){const root=document.getElementById('app');if(!root)return;const y=window.scrollY;root.innerHTML=render(id);window.scrollTo(0,y);if(focus){const el=Array.from(root.querySelectorAll('[data-target-choice]')).find(e=>e.dataset.targetField===focus);el?.focus({preventScroll:true});}}
 document.addEventListener('click',evt=>{
  let el=evt.target.closest('[data-target-choice]');if(el){const id=el.dataset.targetChoice;responses[id][el.dataset.targetField]=el.dataset.targetValue;redraw(id,el.dataset.targetField);return}
  el=evt.target.closest('[data-target-reset]');if(el){const id=el.dataset.targetReset;responses[id]={};redraw(id);return}
  el=evt.target.closest('[data-target-copy]');if(el){const id=el.dataset.targetCopy,st=getStatus(id);if(!st.ready)return;const msg=`${titles[id]}: ${st.met?'Kriterleri karşılıyor':'Kriterleri karşılamıyor'}\nSLEDAI-2K: ${st.base.total}\nKlinik SLEDAI-2K: ${st.base.clinical}\nPGA: ${responses[id].pga}\nPrednizolon eşdeğeri: ${responses[id].pred} mg/gün\n${st.checks.map(c=>`${c.ok?'✓':'×'} ${c.name}`).join('\n')}`;navigator.clipboard?.writeText(msg).then(()=>typeof showToast==='function'&&showToast('Sonuç kopyalandı.')).catch(()=>typeof showToast==='function'&&showToast('Kopyalanamadı.'));return}
 });
 document.addEventListener('change',evt=>{const el=evt.target.closest('[data-target-number]');if(!el)return;const id=el.dataset.targetNumber;responses[id][el.dataset.targetField]=el.value;const fid=el.id;redraw(id);document.getElementById(fid)?.focus({preventScroll:true})});
 return {render,getStatus,responses,getSledai};
})();
