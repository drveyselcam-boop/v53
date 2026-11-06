'use strict';
/* PedRheum Atlas JIA tools. All assessments ephemeral; no identifier or persistence. */
const JIATools = (() => {
 const REGION_META = [
  {id:'head',name:'Baş ve boyun',short:'Baş–boyun',icon:'◉'},
  {id:'shoulder',name:'Omuz ve köprücük',short:'Omuzlar',icon:'✳'},
  {id:'armR',name:'Sağ kol ve dirsek',short:'Sağ kol',icon:'↘'},
  {id:'armL',name:'Sol kol ve dirsek',short:'Sol kol',icon:'↙'},
  {id:'handR',name:'Sağ el ve parmaklar',short:'Sağ el',icon:'✋'},
  {id:'handL',name:'Sol el ve parmaklar',short:'Sol el',icon:'✋'},
  {id:'legR',name:'Sağ kalça ve bacak',short:'Sağ bacak',icon:'↘'},
  {id:'legL',name:'Sol kalça ve bacak',short:'Sol bacak',icon:'↙'},
  {id:'footR',name:'Sağ ayak ve parmaklar',short:'Sağ ayak',icon:'⌁'},
  {id:'footL',name:'Sol ayak ve parmaklar',short:'Sol ayak',icon:'⌁'}
 ];
 const joints = [];
 const put = (id,label,region,j27=false) => joints.push({id,label,region,j27});
 put('cervical','Servikal omurga','head',true);
 for (const side of ['R','L']) put(`tmj${side}`, `${side==='R'?'Sağ':'Sol'} temporomandibular eklem`,'head');
 for (const side of ['R','L']) for (const name of [['sc','Sternoklaviküler'],['ac','Akromiyoklaviküler'],['should','Omuz']]) put(`${name[0]}${side}`,`${side==='R'?'Sağ':'Sol'} ${name[1]}`,'shoulder');
 for (const side of ['R','L']) {
  for (const name of [['elbow','Dirsek'],['wrist','El bileği']]) put(`${name[0]}${side}`,`${side==='R'?'Sağ':'Sol'} ${name[1]}`,`arm${side}`,true);
  for (const type of ['MCP','PIP','DIP']) for (const finger of (type==='DIP'?[2,3,4,5]:[1,2,3,4,5])) put(`${type}${finger}${side}`,`${type} ${finger}. parmak`,`hand${side}`,type==='PIP'||(type==='MCP'&&finger<=3));
  for (const name of [['hip','Kalça'],['knee','Diz'],['ankle','Ayak bileği'],['subtalar','Subtalar'],['intertarsal','İntertarsal']]) put(`${name[0]}${side}`,`${side==='R'?'Sağ':'Sol'} ${name[1]}`,`leg${side}`,['hip','knee','ankle'].includes(name[0]));
  for(const type of ['MTP','TOE']) for(let n=1;n<=5;n++)put(`${type}${n}${side}`,`${type==='TOE'?'Ayak parmağı IP':'MTP'} ${n}`,`foot${side}`);
 }
 const reduced = joints.filter(j=>j.j27);
 if(joints.length!==71 || reduced.length!==27)throw Error(`Unexpected joint inventory ${joints.length}/${reduced.length}`);
 const state={variant:'10',withESR:false,mode:'map',region:null,joints:{},count:'',phys:'',parent:'',esr:'',basdai:{},basfi:{},jadia:{},jadie:{}};
 const S = t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
 const num=(v,min,max)=> v!=='' && v!==undefined && v!==null && Number.isFinite(Number(v)) && Number(v)>=min && Number(v)<=max ? Number(v) : null;
 const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0$/,'').replace(/\.$/,'');
 const activeSet=()=>state.variant==='27'?reduced:joints;
 const jointCount=()=>activeSet().filter(j=>state.joints[j.id]==='active').length;
 const allJointAnswered=()=>activeSet().every(j=>state.joints[j.id]==='active'||state.joints[j.id]==='normal');
 const esrScore=()=>{const v=num(state.esr,0,250);return v===null?null:Math.max(0,Math.min(10,(v-20)/10));};
 function calcJadas(){
  const ph=num(state.phys,0,10), pa=num(state.parent,0,10);
  const cap=Number(state.variant), rawCount=state.mode==='map'?(allJointAnswered()?jointCount():null):num(state.count,0,cap===10?71:cap);
  if(rawCount!==null && !Number.isInteger(rawCount))return null;
  const esr=state.withESR?esrScore():0;
  if(ph===null||pa===null||rawCount===null||esr===null)return null;
  const count=Math.min(cap,rawCount);
  return {value:count+ph+pa+esr,rawCount,count,esr,max:cap+20+(state.withESR?10:0)};
 }
 const primaryTitle=()=>`${state.withESR?'JADAS':'cJADAS'}-${state.variant}`;
 const info = txt=>`<div class="jia-note">${txt}</div>`;
 const progress=(answered,total)=>`<div class="jia-progress-head"><span>Değerlendirilen alan</span><b>${answered} / ${total}</b></div><div class="jia-progress-bar"><div style="width:${total?100*answered/total:0}%"></div></div>`;
 const back=()=>`<button type="button" class="breadcrumb-back" data-go="scores/jia">← JİA araçlarına dön</button>`;
 const source=(url,description)=>`<div class="jia-source">Kaynak: <a href="${url}" rel="noopener noreferrer" target="_blank">${description} ↗</a><br>Bu dijital araç prototipinin klinik doğrulaması tamamlanmamıştır.</div>`;
 function hub(){const cards=[
  ['jadas','JADAS / cJADAS','10, 27 veya 71 eklem · Mobil eklem haritası · ESH seçeneği','AKTİVİTE'],
  ['basdai','BASDAI','6 soru · 0–10 puan · ERA/aksiyel spondiloartrit değerlendirmesi','AKTİVİTE'],
  ['basfi','BASFI','10 fonksiyon sorusu · 0–10 ortalama','FONKSİYON'],
  ['jadia','JADI-A','36 eklem/eklem grubu · Kalıcı artiküler hasar','HASAR'],
  ['jadie','JADI-E','13 madde · Eklem dışı kalıcı hasar','HASAR'] ];
  return `${cardsTitle('Juvenil idiyopatik artrit','Hastalık aktivitesi, fonksiyon ve kalıcı hasar; mobilde bölge bölge muayene.','JİA · YENİ')}
  <div class="jia-hero"><div><span class="jia-label">EKLEM HARİTASI</span><h2>Tüm iskelet yerine,<br>her seferinde bir bölge.</h2><p>Önce vücut bölgesini, ardından sağ/sol eklemi seçin. İşaretlediğiniz eklemler hesabınıza aktarılır.</p><button class="jia-hero-btn" type="button" data-go="scores/jadas">Eklem seçimine başla →</button></div><div class="jia-hero-figure">${bodySVG()}</div></div>
  <div class="jia-hub-grid">${cards.map(c=>`<button type="button" data-go="scores/${c[0]}" class="jia-hub-card"><span class="jia-label">${c[3]}</span><h3>${c[1]}</h3><p>${c[2]}</p><b>Aç →</b></button>`).join('')}</div>
  ${info('JADAS-27, 27 belirli eklemi değerlendirir; JADAS-10 ise 10 puanda sınırlandırılmış tüm aktif eklem sayısını kullanır. BASDAI ve BASFI erişkin spondiloartrit ölçekleridir; pediatrik kullanım için dikkatli yorum gerekir.')}`;
 }
 function bodySVG(){return `<svg viewBox="0 0 180 340" width="180" height="300" role="img" aria-label="Şematik insan iskeleti ve eklem bölgeleri" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="#b5dbd2" stroke-width="7" stroke-linecap="round"><path d="M90 53v24m0 0-39 14-9 51m48-65 39 14 9 51M90 86v86m-27-49 27 49 27-49M68 173l-11 72-4 66m59-138 11 72 4 66"/><path d="M42 142 36 191m102-49 6 49" stroke-width="5"/></g><g fill="#ebf7f1" stroke="#79b3a8" stroke-width="3"><circle cx="90" cy="34" r="22"/><ellipse cx="90" cy="115" rx="41" ry="42"/><ellipse cx="90" cy="181" rx="32" ry="20"/></g><g fill="#0e8a76" stroke="white" stroke-width="3">${[[90,55],[50,89],[130,89],[44,140],[136,140],[36,196],[144,196],[66,180],[114,180],[56,246],[124,246],[53,313],[127,313]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8"/>`).join('')}</g><path d="M76 33h28m-14-13v28" stroke="#aad0c6" stroke-width="2"/></svg>`;}
 function regionEligible(r){return activeSet().filter(j=>j.region===r);}
 function regionSummary(region){const eligible=regionEligible(region.id),done=eligible.filter(j=>state.joints[j.id]!==undefined).length,active=eligible.filter(j=>state.joints[j.id]==='active').length;return {eligible,done,active};}
 function regionSelector(){
  const allowed=REGION_META.filter(r=>regionEligible(r.id).length);
  return `<div class="jia-regions-head"><h3>1. Muayene bölgesini seçin</h3><span>${state.variant==='27'?'27 eklem':'71 eklem'} değerlendirmesi</span></div><div class="jia-region-wrap"><div class="jia-bodymap">${bodySVG()}<small>Şematik eklem konumları</small></div><div class="jia-regions">${allowed.map(r=>{const x=regionSummary(r);return `<button type="button" data-jia-region="${r.id}" class="jia-region ${state.region===r.id?'chosen':''} ${x.done===x.eligible.length?'done':''}"><span class="jia-region-symbol">${r.icon}</span><span><strong>${r.name}</strong><small>${x.done}/${x.eligible.length} değerlendirildi ${x.active?`· ${x.active} aktif`:''}</small></span><span class="jia-region-arrow">${x.done===x.eligible.length?'✓':'›'}</span></button>`;}).join('')}</div></div>`;
 }
 function jointSVG(region){
  if(region.startsWith('hand')){
   return `<svg class="jia-detail-diagram" viewBox="0 0 250 200" role="img" aria-label="El ve parmakların yakın görünüm şeması" xmlns="http://www.w3.org/2000/svg"><g stroke="#a6cfc8" stroke-width="14" stroke-linecap="round" fill="none"><path d="M105 172v-55L57 73M108 117 86 27M125 117 125 15M144 118 168 28M158 127 205 51"/><path d="M105 172q25 10 53-2"/></g><g fill="#effaf7" stroke="#128a7b" stroke-width="3">${[[57,73],[86,27],[125,15],[168,28],[205,51],[85,94],[109,80],[125,72],[147,83],[168,103]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g><text x="125" y="194" text-anchor="middle" font-size="11" fill="#537f7b">Her parmak eklemi alttaki listeden ayrı seçilir</text></svg>`;
  }
  if(region.startsWith('foot'))return `<svg class="jia-detail-diagram" viewBox="0 0 250 165" role="img" aria-label="Ayak eklemleri yakın görünüm şeması"><path d="M35 125q10-80 63-85t110 35l17 48q-80 16-190 2Z" fill="#e1f4ee" stroke="#8bbfb2" stroke-width="4"/><g fill="#139b86">${[[85,54],[110,47],[135,50],[162,65],[195,80],[85,106],[110,104],[135,105],[163,109],[195,110]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g></svg>`;
  return `<div class="jia-region-illustration">${bodySVG()}</div>`;
 }
 function detailRegion(){const r=REGION_META.find(x=>x.id===state.region);if(!r)return '';
  const els=regionEligible(r.id),done=els.filter(j=>state.joints[j.id]!==undefined).length;
  return `<section class="jia-detail"><div class="jia-detail-top"><button type="button" data-jia-region="" class="jia-back">← Bölgelere dön</button><span class="jia-region-status">${done} / ${els.length} tamamlandı</span></div><h3>${r.name}</h3><p>Ayrı ayrı işaretleyin veya muayenede normal bulunan işaretlenmemiş eklemleri tek dokunuşta “Normal” yapın.</p>${jointSVG(r.id)}<div class="jia-joint-grid">${els.map(j=>{const val=state.joints[j.id];return `<div class="jia-joint"><span>${S(j.label)}</span><div role="group" aria-label="${S(j.label)}"><button type="button" class="${val==='normal'?'is-normal':''}" data-jia-joint="${j.id}" data-jia-value="normal" aria-pressed="${val==='normal'}">Normal</button><button type="button" class="${val==='active'?'is-active':''}" data-jia-joint="${j.id}" data-jia-value="active" aria-pressed="${val==='active'}">Aktif</button></div></div>`;}).join('')}</div><button type="button" class="jia-fill" data-jia-fill="${r.id}">✓ İşaretlenmemiş ${els.length-done} eklemi normal olarak tamamla</button></section>`;
 }
 function jadas(){const cnt=state.mode==='map'?activeSet().filter(j=>state.joints[j.id]!==undefined).length:((Number.isInteger(num(state.count,0,state.variant==='10'?71:Number(state.variant)))?1:0));const tot=state.mode==='map'?activeSet().length:1;const result=calcJadas();const max=state.variant==='10'?71:Number(state.variant);
  return `${back()}${cardsTitle('JADAS / cJADAS','10, 27 veya 71 eklem üzerinden aktivite değerlendirmesi.','JİA · EKLEM HARİTASI')}
  <div class="jia-panel"><div class="jia-panel-title"><h3>Hesaplama türünü seçin</h3><p>Eklem seçimi ve tüm klinik değerler tamamlanmadan skor gösterilmez.</p></div><div class="jia-segments"><span>Eklem seti</span><div>${['10','27','71'].map(v=>`<button type="button" class="${state.variant===v?'selected':''}" data-jia-variant="${v}">JADAS-${v}</button>`).join('')}</div></div><div class="jia-segments"><span>Laboratuvar</span><div><button type="button" class="${!state.withESR?'selected':''}" data-jia-esr="no">cJADAS · ESH yok</button><button type="button" class="${state.withESR?'selected':''}" data-jia-esr="yes">JADAS · ESH var</button></div></div></div>
  <div class="jia-layout"><div><section class="jia-panel"><div class="jia-panel-title"><h3>Eklem sayımı</h3><p>Haritadan tek tek işaretleyin veya muayeneyi tamamladıysanız doğrudan aktif eklem sayısını girin.</p></div><div class="jia-segments"><span>Giriş yöntemi</span><div><button class="${state.mode==='map'?'selected':''}" type="button" data-jia-mode="map">Bölge bölge</button><button class="${state.mode==='number'?'selected':''}" type="button" data-jia-mode="number">Sayı gir</button></div></div>
  ${state.mode==='map'?`${progress(cnt,tot)}${state.region?detailRegion():regionSelector()}`:`<label class="jia-field">Muayenede tespit edilen toplam aktif eklem sayısı (0–${max})<input data-jia-input="count" inputmode="numeric" type="number" min="0" max="${max}" step="1" value="${S(state.count)}" placeholder="Ör. 4"></label>${info('Aktif eklem sayısı, muayeneyi tamamladıktan sonra girilmelidir. JADAS-10 için 10’dan fazla aktif eklem 10 olarak puanlanır; JADAS-27 yalnızca belirli 27 eklemi içerir.')}`}</section>
  <section class="jia-panel"><div class="jia-panel-title"><h3>Global değerlendirmeler</h3><p>VAS / sayısal değerlendirme: 0 = yok / en iyi, 10 = en yüksek / en kötü.</p></div>${[['phys','Hekim global hastalık aktivitesi'],['parent','Ebeveyn / hasta global iyilik hâli']].map(([id,label])=>`<label class="jia-field">${label} (0–10)<input data-jia-input="${id}" type="number" inputmode="decimal" min="0" max="10" step="0.1" placeholder="0–10" value="${S(state[id])}"></label>`).join('')}${state.withESR?`<label class="jia-field">ESH / ESR (mm/saat)<input data-jia-input="esr" type="number" inputmode="numeric" min="0" max="250" step="1" value="${S(state.esr)}" placeholder="Ör. 36"></label><small class="jia-footnote">Normalize ESH = max(0, min(10, (ESH − 20) / 10)).</small>`:''}</section></div>
  <aside class="jia-result"><span class="jia-label">${primaryTitle()} SONUCU</span>${result?`<div class="jia-result-number">${fmt(result.value)}<small> / ${result.max}</small></div><div class="jia-result-meta">${result.rawCount} aktif eklem · Skorlamada ${result.count} · Hekim ${fmt(Number(state.phys))} · Ebeveyn ${fmt(Number(state.parent))}${state.withESR?` · Normalize ESH ${fmt(result.esr)}`:''}</div><p class="jia-result-ok">✓ Tüm zorunlu alanlar tamamlandı.</p><button type="button" class="jia-copy" data-jia-copy="jadas">Sonucu kopyala</button>`:`<div class="jia-result-locked">—</div><p>Hesaplama kilitli. ${state.mode==='map'?'Tüm ilgili eklemleri Normal veya Aktif olarak değerlendirin.':'Geçerli bir aktif eklem sayısı girin.'} Ayrıca global VAS${state.withESR?' ve ESH':''} alanlarını tamamlayın.</p>`}<div class="jia-result-divider"></div><button type="button" class="jia-reset" data-jia-reset="jadas">↻ JADAS formunu sıfırla</button>${source('https://pmc.ncbi.nlm.nih.gov/articles/PMC4836071/','JADAS bileşenleri ve eklem setleri')}</aside></div>
  ${info('JADAS sonucu için tanı alt tipi ve yaşa göre doğrulanmış aktivite eşikleri bu prototipte uygulanmıyor; sonuç sayısal aktivite skorudur. Aktif artrit için özgün klinik tanımlar kullanılmalıdır.')}`;
 }
 const BASDAI=[
 'Son bir haftada yorgunluk / bitkinlik düzeyi',
 'Boyun, sırt, bel veya kalça ağrısı düzeyi',
 'Boyun, sırt veya kalça dışındaki eklemlerde ağrı / şişlik',
 'Dokunma veya basınçla hassas bölgelerde rahatsızlık',
 'Sabah tutukluğunun şiddeti',
 'Sabah tutukluğunun süresi (0 = yok, 5 = 1 saat, 10 = ≥2 saat)'
 ];
 const BASFI=[
 'Yardım almadan çorap / külotlu çorap giyme',
 'Yerden kalem almak için öne eğilme',
 'Yüksek rafa erişme',
 'Yerden / arkalıksız sandalyeden kalkma',
 'Sırtüstü uzanırken yardımsız kalkma',
 'Desteksiz 10 dakika ayakta durma',
 'Korkuluk veya baston olmadan 12–15 basamak çıkma',
 'Gövdeyi çevirmeden omuz üzerinden arkaya bakma',
 'Fiziksel olarak zorlayıcı aktiviteleri yapma',
 'Evde veya işte tüm gün boyunca aktiviteyi sürdürme'
 ];
 function choiceRow(label,id,val,values,prefix){return `<div class="jia-choice-row"><span>${S(label)}</span><div role="group" aria-label="${S(label)}" class="jia-choice-options">${values.map(([value,title])=>`<button type="button" data-jia-choice="${prefix}" data-jia-id="${id}" data-jia-value="${value}" class="${val===String(value)?'selected':''}" aria-pressed="${val===String(value)}">${title}</button>`).join('')}</div></div>`;}
 function bath(type){const questions=type==='basdai'?BASDAI:BASFI;const values=state[type];const complete=questions.every((_,i)=>values[i]!==undefined);const vals=questions.map((_,i)=>Number(values[i]));const score=complete?(type==='basdai'?(vals[0]+vals[1]+vals[2]+vals[3]+(vals[4]+vals[5])/2)/5:vals.reduce((a,b)=>a+b,0)/10):null;
  return `${back()}${cardsTitle(type==='basdai'?'BASDAI':'BASFI',type==='basdai'?'Hastalık aktivitesi · 6 soru · Son bir hafta':'Fonksiyonel kapasite · 10 soru · Son bir hafta','0–10 TIKLAMALI')}
  ${info('Bu ölçekler erişkin ankilozan spondilit / aksiyel spondiloartritte geliştirilmiştir. Çocuk ve ERA hastaları için pediatrik geçerlilik ve klinik bağlam ayrıca değerlendirilmelidir.')}
  <div class="jia-layout"><section class="jia-panel"><h3>${type==='basdai'?'Aktivite soruları':'Fonksiyon soruları'}</h3>${progress(questions.filter((_,i)=>values[i]!==undefined).length,questions.length)}<p class="jia-muted">${type==='basdai'?'0 = yok; 10 = çok şiddetli (son soru süreyi temsil eder).':'0 = kolay; 10 = mümkün değil.'}</p>${questions.map((q,i)=>choiceRow(`${i+1}. ${q}`,String(i),values[i],Array.from({length:11},(_,n)=>[String(n),String(n)]),type)).join('')}</section>
  <aside class="jia-result"><span class="jia-label">${type.toUpperCase()} SONUCU</span>${score!==null?`<div class="jia-result-number">${fmt(score)}<small> / 10</small></div><p class="jia-result-ok">✓ Tüm ${questions.length} soru tamamlandı.</p><button type="button" class="jia-copy" data-jia-copy="${type}">Sonucu kopyala</button>`:`<div class="jia-result-locked">—</div><p>${questions.filter((_,i)=>values[i]!==undefined).length} / ${questions.length} yanıt girildi. Bütün sorular tamamlanmadan hesaplama yapılmaz.</p>`}<div class="jia-result-divider"></div><button type="button" class="jia-reset" data-jia-reset="${type}">↻ Formu sıfırla</button>${source('https://www.sciencedirect.com/topics/medicine-and-dentistry/basdai','BASDAI/BASFI ölçek açıklamaları')}</aside></div>`;
 }
 const JADI_A=[];
 const jput=(id,name,region)=>JADI_A.push({id,name,region});
 jput('cerv','Servikal omurga','Baş / boyun');jput('tmj','Temporomandibular eklemler (birlikte)','Baş / boyun');
 for(const [tag,name] of [['shoulder','Omuz'],['elbow','Dirsek'],['wrist','El bileği']]) for(const side of ['R','L'])jput(`${tag}${side}`,`${side==='R'?'Sağ':'Sol'} ${name}`,'Üst ekstremite');
 for(const side of ['R','L']) for(const type of ['MCP','PIP']) for(let n=1;n<=5;n++)jput(`${type}${n}${side}`,`${side==='R'?'Sağ':'Sol'} ${type} ${n}`,'El ve parmaklar');
 for(const [tag,name] of [['hip','Kalça'],['knee','Diz'],['anklesub','Ayak bileği / subtalar (birlikte)'],['mtps','Ayak MTP eklemleri (birlikte)']])for(const side of ['R','L'])jput(`${tag}${side}`,`${side==='R'?'Sağ':'Sol'} ${name}`,'Alt ekstremite');
 if(JADI_A.length!==36)throw Error('JADI-A list must have 36 units');
 const JADI_E=[
 ['ocularR','Sağ göz hasarı','eye'],['ocularL','Sol göz hasarı','eye'],
 ['muscle','Kas atrofisi','other'],['osteo','Osteoporotik kırık / vertebra çökmesi','other'],
 ['avascular','Avasküler nekroz','other'],['spine','Bacak uzunluğu veya kalça kontraktürüne bağlı belirgin omurga eğriliği','other'],
 ['length','Bacak uzunluk farkı / segmental büyüme bozukluğu','other'],['striae','Stria rubrae','other'],
 ['atrophy','Eklem içi steroid enjeksiyonuna bağlı subkutan atrofi','other'],['growth','Büyüme geriliği','other'],
 ['puberty','Puberte gecikmesi','other'],['diabetes','Tedavi gerektiren diabetes mellitus','other'],['amyloid','Sekonder amiloidoz','other']
 ];
 function damage(type){const art=type==='jadia';const items=art?JADI_A:JADI_E;const vals=state[type];const done=items.filter(q=>vals[art?q.id:q[0]]!==undefined).length;const score=done===items.length?items.reduce((sum,q)=>sum+Number(vals[art?q.id:q[0]]),0):null;
 const groups=art?['Baş / boyun','Üst ekstremite','El ve parmaklar','Alt ekstremite']:['eye','other'];
 return `${back()}${cardsTitle(art?'JADI-A · Eklem hasarı':'JADI-E · Eklem dışı hasar',art?'36 eklem / eklem grubu, 0–2 derecelendirme':'13 kalıcı hasar maddesi · Oküler bulgularda 0–3','JİA · HASAR İNDEKSİ')}
 ${info('JADI, en az 6 ay süren ve aktif artrite bağlı olmayan kalıcı hasarı değerlendirir. Aktif eklem muayenesi ile hasar muayenesi ayrı tutulur. ERA için modifiye JADI ölçütleri farklı olabilir.')}
 <div class="jia-layout"><section class="jia-panel"><h3>${art?'Artiküler hasar':'Eklem dışı hasar'}</h3>${progress(done,items.length)}
 ${groups.map(g=>`<div class="jia-group-caption">${art?g:g==='eye'?'Oküler hasar':'Diğer organ ve sistemler'}</div>${items.filter(q=>q.region===g||(q[2]===g)).map(q=>{
  const id=art?q.id:q[0], label=art?q.name:q[1], val=vals[id];const values=art?[['0','0 · Yok'],['1','1 · Parsiyel'],['2','2 · Şiddetli']]:q[2]==='eye'?[['0','0 · Yok'],['1','1 · Hasar'],['2','2 · Cerrahi'],['3','3 · Yasal körlük']]:[['0','Yok'],['1','Var']];
  return choiceRow(label,id,val,values,type);
 }).join('')}`).join('')}
 </section><aside class="jia-result"><span class="jia-label">${type.toUpperCase()} SONUCU</span>${score!==null?`<div class="jia-result-number">${score}<small> / ${art?72:17}</small></div><p class="jia-result-ok">✓ Bütün hasar alanları tamamlandı.</p><button type="button" class="jia-copy" data-jia-copy="${type}">Sonucu kopyala</button>`:`<div class="jia-result-locked">—</div><p>${done}/${items.length} alan dolduruldu. Eksik yanıt varken toplam hasar skoru hesaplanmaz.</p>`}<div class="jia-result-divider"></div><button type="button" class="jia-reset" data-jia-reset="${type}">↻ Formu sıfırla</button>${source('https://pmc.ncbi.nlm.nih.gov/articles/PMC6615271/','JADI-A/JADI-E skor tanımları')}</aside></div>`;
 }
 function render(route){switch(route){case'jia':return hub();case'jadas':return jadas();case'basdai':return bath('basdai');case'basfi':return bath('basfi');case'jadia':return damage('jadia');case'jadie':return damage('jadie');default:return hub();}}
 function update(){const r=(location.hash||'').replace('#scores/','');document.querySelector('#app').innerHTML=render(r);}
 function onClick(e){const el=e.target.closest('[data-jia-variant],[data-jia-esr],[data-jia-mode],[data-jia-region],[data-jia-joint],[data-jia-value],[data-jia-fill],[data-jia-choice],[data-jia-reset],[data-jia-copy]');if(!el)return false;
  const d=el.dataset;
  if(d.jiaVariant){state.variant=d.jiaVariant;state.region=null;}
  else if(d.jiaEsr){state.withESR=d.jiaEsr==='yes';}
  else if(d.jiaMode){state.mode=d.jiaMode;state.region=null;}
  else if(d.jiaRegion!==undefined){state.region=d.jiaRegion||null;}
  else if(d.jiaJoint){state.joints[d.jiaJoint]=d.jiaValue;}
  else if(d.jiaFill){for(const j of regionEligible(d.jiaFill))if(state.joints[j.id]===undefined)state.joints[j.id]='normal';}
  else if(d.jiaChoice){state[d.jiaChoice][d.jiaId]=d.jiaValue;}
  else if(d.jiaReset){if(d.jiaReset==='jadas'){state.joints={};state.count='';state.phys='';state.parent='';state.esr='';state.region=null;}else state[d.jiaReset]={};}
  else if(d.jiaCopy){let str='';if(d.jiaCopy==='jadas'){const r=calcJadas();if(r)str=`${primaryTitle()}: ${fmt(r.value)}/${r.max}; aktif eklem ${r.rawCount}`;}
   else if(d.jiaCopy==='basdai'||d.jiaCopy==='basfi'){const t=d.jiaCopy,q=t==='basdai'?BASDAI:BASFI,v=state[t];if(q.every((_,i)=>v[i]!==undefined)){const a=q.map((_,i)=>Number(v[i]));const res=t==='basdai'?(a[0]+a[1]+a[2]+a[3]+(a[4]+a[5])/2)/5:a.reduce((x,y)=>x+y,0)/10;str=`${t.toUpperCase()}: ${fmt(res)}/10`;}}
   else {const t=d.jiaCopy,it=t==='jadia'?JADI_A:JADI_E,v=state[t];if(it.every(x=>v[t==='jadia'?x.id:x[0]]!==undefined)){const score=it.reduce((acc,x)=>acc+Number(v[t==='jadia'?x.id:x[0]]),0);str=`${t.toUpperCase()}: ${score}/${t==='jadia'?72:17}`;}}
   if(str && navigator.clipboard?.writeText)navigator.clipboard.writeText(str).then(()=>{if(window.showToast)window.showToast('Sonuç kopyalandı.');}).catch(()=>{});return true;
  }
  const y=window.scrollY;update();window.scrollTo(0,y);return true;
 }
 function onInput(e){if(!e.target.matches('[data-jia-input]'))return false;const k=e.target.dataset.jiaInput;state[k]=e.target.value;const input=e.target;const sel=input.selectionStart;const y=window.scrollY;update();const next=document.querySelector(`[data-jia-input="${k}"]`);next?.focus({preventScroll:true});try{next?.setSelectionRange(sel,sel)}catch{}window.scrollTo(0,y);return true;}
 return {render,onClick,onInput, state, joints, reduced, getResult:calcJadas, JADI_A, JADI_E};
})();
