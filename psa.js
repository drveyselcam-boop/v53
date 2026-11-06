/* PedRheum Atlas v0.24 — Psoriatic arthritis guideline flow */
'use strict';
const PsAFlow = (()=>{
  const S={guide:'',domain:'',stage:'first',extra:[]};
  const DATA={
    eular:{
      title:'EULAR',
      badge:'Erişkin PsA · EULAR 2023',
      domains:[
        {id:'peripheral',label:'Periferik artrit',steps:[
          {t:'NSAİİ'},
          {t:'csDMARD',s:'MTX · LEF · SSZ'},
          {t:'bDMARD',s:'TNFi · IL-17i · IL-23i · IL-12/23i'},
          {t:'JAKi'},
          {t:'Switch'}],
          tags:[['Psöriyazis','IL-17i · IL-23i · IL-12/23i'],['Üveit','mTNFi'],['İBH','mTNFi · IL-23i · IL-12/23i · JAKi']]},
        {id:'axial',label:'Aksiyel hastalık',steps:[
          {t:'NSAİİ'},
          {t:'bDMARD / tsDMARD',s:'TNFi · IL-17i · JAKi'},
          {t:'Switch'}],
          tags:[['Üveit','mTNFi'],['İBH','mTNFi · JAKi']]},
        {id:'enthesitis',label:'Entezit',steps:[
          {t:'NSAİİ / Lokal'},
          {t:'bDMARD',s:'TNFi · IL-17i'},
          {t:'JAKi'},
          {t:'Switch'}],
          tags:[['Psöriyazis','IL-17i'],['Üveit','mTNFi']]}
      ]
    },
    grappa:{
      title:'GRAPPA',
      badge:'Erişkin PsA · GRAPPA 2021',
      domains:[
        {id:'peripheral',label:'Periferik artrit',steps:[
          {t:'NSAİİ'},
          {t:'csDMARD',s:'MTX · LEF · SSZ'},
          {t:'İleri tedavi',s:'TNFi · IL-17i · IL-23i · IL-12/23i · JAKi · PDE4i'},
          {t:'Switch'}]},
        {id:'axial',label:'Aksiyel hastalık',steps:[
          {t:'NSAİİ'},
          {t:'İleri tedavi',s:'TNFi · IL-17i · JAKi'},
          {t:'Switch'}]},
        {id:'enthesitis',label:'Entezit',steps:[
          {t:'NSAİİ / Lokal'},
          {t:'İleri tedavi',s:'TNFi · IL-17i · JAKi · PDE4i'},
          {t:'Switch'}]},
        {id:'dactylitis',label:'Daktilit',steps:[
          {t:'NSAİİ / Lokal'},
          {t:'İleri tedavi',s:'TNFi · IL-17i · IL-23i · IL-12/23i · JAKi · PDE4i'}]},
        {id:'skin',label:'Cilt',steps:[
          {t:'Topikal / Fototerapi'},
          {t:'Sistemik',s:'MTX · PDE4i'},
          {t:'Biyolojik',s:'IL-17i · IL-23i · IL-12/23i · TNFi'}]},
        {id:'nail',label:'Tırnak',steps:[
          {t:'Topikal / Lokal'},
          {t:'Sistemik / İleri',s:'TNFi · IL-17i · IL-23i · IL-12/23i · JAKi · PDE4i'}]}
      ]
    }
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const EXTRAS=[['skin','Psöriyazis'],['uveitis','Üveit'],['ibd','İBH']];
  const STAGES=[['first','İlk tedavi'],['csfail','csDMARD yanıtsızlığı'],['biofail','Biyolojik / JAK yanıtsızlığı']];
  const activeGuide=()=>DATA[S.guide]||null;
  const activeDomain=()=>activeGuide()?.domains.find(d=>d.id===S.domain)||null;
  const optionBtn=(kind,id,label,active)=>`<button type="button" class="psa-pick ${active?'active':''}" data-psa="${kind}" data-value="${id}">${esc(label)}</button>`;
  const stepCard=(step,idx,last)=>`<div class="psa-node"><span class="psa-node-title">${esc(step.t)}</span>${step.s?`<small>${esc(step.s)}</small>`:''}</div>${last?'':'<div class="psa-arrow">↓</div>'}`;
  function tailored(d){
    if(!d)return [];
    if(S.stage==='first')return d.steps.filter(x=>!['Switch','JAKi'].includes(x.t)).slice(0,2);
    if(S.stage==='csfail')return d.steps.filter(x=>/bDMARD|İleri|JAKi|Sistemik|Biyolojik/.test(x.t)).slice(0,2);
    return S.guide==='eular'?[{t:'Switch bDMARD / JAKi',s:'Aynı sınıfta veya farklı sınıfa geçiş'},{t:'Üveit / İBH / Cilt',s:'Eşlik eden tutuluma göre ajan seçimi'}]:[{t:'Switch / alternatif hedef',s:'TNFi · IL-17i · IL-23i · IL-12/23i · JAKi · PDE4i'},{t:'Üveit / İBH / Cilt',s:'Alan ve önceki yanıta göre seçim'}];
  }
  function extraRows(){const rows=[];if(S.extra.includes('uveitis'))rows.push(['Üveit','mTNFi']);if(S.extra.includes('ibd'))rows.push(['İBH','mTNFi · IL-23i · IL-12/23i · JAKi','IL-17i ×']);if(S.extra.includes('skin'))rows.push(['Psöriyazis','IL-17i · IL-23i · IL-12/23i']);return rows;}
  function render(){
    const g=activeGuide(), d=activeDomain();
    return `<div class="psa-page">
      <button type="button" class="breadcrumb-back" data-go="algorithms">← Algoritmalara dön</button>
      <div class="dose-page-head"><span class="eyebrow">ÇOCUK ROMATOLOJİ · PSA</span><h1>Psöriatik artrit</h1><p>Kılavuz seç → tutulum seç → şema.</p></div>
      <section class="psa-panel">
        <div class="psa-head"><h2>1 · Kılavuz</h2>${g?`<span class="subtle-pill">${esc(g.badge)}</span>`:''}</div>
        <div class="psa-picks">${optionBtn('guide','eular','EULAR',S.guide==='eular')}${optionBtn('guide','grappa','GRAPPA',S.guide==='grappa')}</div>
      </section>
      ${g?`<section class="psa-panel"><div class="psa-head"><h2>2 · Tutulum</h2>${d?`<span class="subtle-pill">${esc(d.label)}</span>`:''}</div><div class="psa-picks">${g.domains.map(x=>optionBtn('domain',x.id,x.label,S.domain===x.id)).join('')}</div></section>`:''}
      ${d?`<section class="psa-panel"><div class="psa-head"><h2>3 · Tedavi aşaması</h2></div><div class="psa-picks">${STAGES.map(([id,label])=>optionBtn('stage',id,label,S.stage===id)).join('')}</div><div class="psa-head" style="margin-top:22px"><h2>4 · Eşlik eden tutulum</h2></div><div class="psa-picks">${EXTRAS.map(([id,label])=>optionBtn('extra',id,label,S.extra.includes(id))).join('')}</div></section><section class="psa-panel"><div class="psa-head"><h2>5 · Şema</h2><button type="button" class="outline-button" data-psa="reset">Baştan</button></div><div class="psa-flow">${tailored(d).map((x,i,a)=>stepCard(x,i,i===a.length-1)).join('')}</div>${extraRows().length?`<div class="psa-tags">${extraRows().map(([a,b,c])=>`<div class="psa-tag"><strong>${esc(a)}</strong><span>${esc(b)}</span>${c?`<small>${esc(c)}</small>`:''}</div>`).join('')}</div>`:''}</section>`:''}
    </div>`;
  }
  function onClick(e){
    const btn=e.target.closest('[data-psa]');
    if(!btn) return false;
    const kind=btn.dataset.psa;
    if(kind==='guide') {S.guide=btn.dataset.value; S.domain=''; S.stage='first'; S.extra=[];}
    else if(kind==='domain') {S.domain=btn.dataset.value;S.stage='first';S.extra=[];}
    else if(kind==='stage')S.stage=btn.dataset.value;
    else if(kind==='extra'){const id=btn.dataset.value;S.extra=S.extra.includes(id)?S.extra.filter(x=>x!==id):[...S.extra,id];}
    else if(kind==='reset') {S.guide=''; S.domain='';S.stage='first';S.extra=[];}
    document.getElementById('app').innerHTML=render();
    return true;
  }
  return {render,onClick};
})();
