'use strict';
/* JDM calculators: MMT-8 (bilateral 0–150), CMAS (14 manoeuvres 0–52).
   Not a substitute for standardized administration / permissions. All inputs ephemeral. */
const JDMTools = (() => {
 const MUSCLES = [
  {id:'neck',name:'Boyun fleksörleri',latin:'Neck flexors',group:'aksiyel',region:'Boyun · aksiyel'},
  {id:'deltoid',name:'Deltoid (orta bölüm)',latin:'Deltoid middle',group:'proksimal',region:'Omuz'},
  {id:'biceps',name:'Biseps brakii',latin:'Biceps brachii',group:'proksimal',region:'Dirsek fleksiyonu'},
  {id:'glutmax',name:'Gluteus maksimus',latin:'Gluteus maximus',group:'proksimal',region:'Kalça ekstansiyonu'},
  {id:'glutmed',name:'Gluteus medius',latin:'Gluteus medius',group:'proksimal',region:'Kalça abdüksiyonu'},
  {id:'quad',name:'Kuadriseps',latin:'Quadriceps',group:'proksimal',region:'Diz ekstansiyonu'},
  {id:'wrist',name:'El bileği ekstansörleri',latin:'Wrist extensors',group:'distal',region:'El bileği'},
  {id:'ankle',name:'Ayak bileği dorsifleksörleri',latin:'Ankle dorsiflexors',group:'distal',region:'Ayak bileği'}
 ];
 const CMAS = [
  {id:'head',name:'Baş kaldırma · boyun fleksiyonu',max:5,group:'Yatak üzerinde',short:'Başın havada tutulma süresi',levels:['Baş kaldırılamıyor','1–9 saniye','10–29 saniye','30–59 saniye','60–119 saniye','120 saniye veya üzeri']},
  {id:'legtarget',name:'Bacağı kaldırıp hedefe dokunma',max:2,group:'Yatak üzerinde',short:'Sırtüstü pozisyonda hedefe uzanma',levels:['Bacak yataktan ayrılamıyor','Bacak kalkıyor, hedefe değmiyor','Bacak hedefe ulaşabiliyor']},
  {id:'legtime',name:'Düz bacağı havada tutma',max:5,group:'Yatak üzerinde',short:'Düz bacak kaldırma süresi',levels:['Kaldıramıyor','1–9 saniye','10–29 saniye','30–59 saniye','60–119 saniye','120 saniye veya üzeri']},
  {id:'turn',name:'Sırtüstünden yüzüstüne dönme',max:3,group:'Yatak üzerinde',short:'Dönme sırasında kolun serbestleşmesi',levels:['Dönüşü yapamıyor','Yan döner, kolunu kurtaramaz','Kolunu zorlanarak kurtarır','Dönüşü zorlanmadan tamamlar']},
  {id:'situps',name:'Mekik hareketleri · 6 ayrı deneme',max:6,group:'Gövde ve üst ekstremite',short:'Her hareket 1 puan; altı denemeyi ayrı işaretleyin'},
  {id:'supinesit',name:'Sırtüstünden oturur duruma geçme',max:3,group:'Gövde ve üst ekstremite',short:'Muayene masasında oturur duruma geçiş',levels:['Yardım almadan yapamaz','Çok zorlanarak yapar','Biraz zorlanır','Zorlanmadan yapar']},
  {id:'armraise',name:'Kolları baş üzerine kaldırma',max:3,group:'Gövde ve üst ekstremite',short:'Bilek yüksekliği ve dirseklerin ekstansiyonu',levels:['Bilekleri omuz seviyesine kaldıramaz','Omuz seviyesine kaldırır','Baş üstüne kaldırır, dirsekler tam açık değil','Dirsekler açık, kollar tam yukarıda']},
  {id:'armtime',name:'Kolları baş üzerinde tutma',max:4,group:'Gövde ve üst ekstremite',short:'Bilekler baş seviyesinin üstünde tutulur',levels:['Baş seviyesine kaldıramaz','1–9 saniye','10–29 saniye','30–59 saniye','60 saniye veya üzeri']},
  {id:'floorsit',name:'Ayaktayken yere oturma',max:3,group:'Yerde ve ayakta',short:'Destek, denge ve iniş kontrolü',levels:['Güvenli biçimde yapamaz','Sandalyeden destek alır','Desteksiz ancak zorlanır','Zorlanmadan yapar']},
  {id:'allfours',name:'Dört ayak pozisyonuna geçme',max:4,group:'Yerde ve ayakta',short:'Emekleme ve tek bacak kaldırma',levels:['Dört ayak duruşuna geçemez','Pozisyonu ancak korur','Baş dik, sırt düz; emekleyemez','Emekleyebilir','Dengeyi koruyup bacağını kaldırır']},
  {id:'floorrise',name:'Yerden ayağa kalkma',max:4,group:'Yerde ve ayakta',short:'Destek ihtiyacı ve kalkış güçlüğü',levels:['Sandalye desteğiyle bile yapamaz','Sandalye desteği gerekir','Diz, uyluk veya yerden elle destek alır','Elle destek gerekmez; hafif zorlanır','Desteksiz ve zorlanmadan kalkar']},
  {id:'chairrise',name:'Sandalyeden kalkma',max:4,group:'Yerde ve ayakta',short:'Sandalyeden kalkmak için gereken destek',levels:['Sandalyeden kalkamaz','Oturak kenarlarından destek alır','Diz/uyluklarından destek alır','Elle destek olmadan biraz zorlanır','Desteksiz ve zorlanmadan kalkar']},
  {id:'step',name:'Basamağa çıkma',max:3,group:'Yerde ve ayakta',short:'Basamağa çıkarken destek gereksinimi',levels:['Basamağa çıkamaz','Masa veya muayeneciden destek alır','Uyluk/dizinden destek alır','Destek olmadan çıkar']},
  {id:'pencil',name:'Yerden kalemi alıp doğrulma',max:3,group:'Yerde ve ayakta',short:'Eğilme ve doğrulurken telafi hareketleri',levels:['Kalemi alıp doğrulamaz','Elleriyle yoğun diz/uyluk desteği alır','Kısa süreli destek veya yavaşlık vardır','Desteksiz ve zorlanmadan yapar']}
 ];
 const SITUPS = [
  'Eller uylukta · ayaklar sabitlenmiş',
  'Kollar göğüste çapraz · ayaklar sabitlenmiş',
  'Eller baş arkasında · ayaklar sabitlenmiş',
  'Eller uylukta · ayaklar sabitlenmemiş',
  'Kollar göğüste çapraz · ayaklar sabitlenmemiş',
  'Eller baş arkasında · ayaklar sabitlenmemiş'
 ];
 if(MUSCLES.length!==8 || CMAS.length!==14 || CMAS.reduce((s,q)=>s+q.max,0)!==52)throw Error('JDM scale definitions invalid');
 const state={mmt:{},cmas:{},situps:{},detail:null};
 const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const completed=(d,k)=>Object.hasOwn(d,k) && d[k]!==undefined;
 const sum=values=>values.reduce((a,b)=>a+b,0);
 const MMT_ITEMS=[MUSCLES[0],...['Sağ','Sol'].flatMap(side=>MUSCLES.slice(1).map(m=>({...m,id:(side==='Sağ'?'r-':'l-')+m.id,side})))];
 const calcMMT=()=>MMT_ITEMS.every(m=>completed(state.mmt,m.id)) ? sum(MMT_ITEMS.map(m=>Number(state.mmt[m.id]))) : null;
 const cmasMissing=()=>CMAS.filter(m=>m.id!=='situps'&&!completed(state.cmas,m.id)).length+SITUPS.filter((_,i)=>!completed(state.situps,String(i))).length;
 const calcCMAS=()=>cmasMissing()===0 ? sum(CMAS.filter(m=>m.id!=='situps').map(m=>Number(state.cmas[m.id])))+sum(SITUPS.map((_,i)=>Number(state.situps[i]))) : null;
 const progress=(n,total)=>`<div class="jdm-progress-top"><span>Değerlendirme tamamlanma durumu</span><b>${n} / ${total}</b></div><div class="jdm-progress"><div style="width:${100*n/total}%"></div></div>`;
 const back=()=>`<button type="button" class="breadcrumb-back" data-go="scores/jdm">← JDM araçlarına dön</button>`;
 const ref=(title,url)=>`<a target="_blank" rel="noopener noreferrer" href="${url}">${title} ↗</a>`;
 const info=msg=>`<div class="jdm-note">${msg}</div>`;
 function hub(){return `${cardsTitle('Juvenil dermatomiyozit','Standart kas gücü ve fiziksel fonksiyon değerlendirmeleri.','JDM · KAS / FONKSİYON')}
 <div class="jdm-intro"><div><div class="jdm-overline">JDM DEĞERLENDİRME MERKEZİ</div><h2>Kas gücünü ve işlevini<br>aynı yerde değerlendirin.</h2><p>MMT-8 kas gücünü, CMAS ise çocuğun 14 hareket sırasındaki performansını değerlendirir. Sonuç için her değerlendirme alanının tamamlanması gerekir.</p></div><div class="jdm-intro-stats"><div><b>8</b><span>kas grubu</span></div><div><b>14</b><span>CMAS hareketi</span></div></div></div>
 <div class="jdm-tool-grid"><button type="button" data-go="scores/mmt8" class="jdm-tool-card"><span class="jdm-card-tag">KAS GÜCÜ</span><div class="jdm-card-icon">${svg('score')}</div><h3>MMT-8</h3><p>Boyun 10 + sağ 70 + sol 70 · Toplam 0–150</p><span class="jdm-card-bottom">Hesaplayıcıyı aç ${svg('arrow')}</span></button><button type="button" data-go="scores/cmas" class="jdm-tool-card"><span class="jdm-card-tag">FONKSİYON & DAYANIKLILIK</span><div class="jdm-card-icon">${svg('target')}</div><h3>CMAS</h3><p>14 görev · Zaman ve hareket bazlı puanlama · Toplam 0–52</p><span class="jdm-card-bottom">Hesaplayıcıyı aç ${svg('arrow')}</span></button></div>
 ${info('Her iki ölçekte yüksek skor daha iyi kas gücü/fonksiyon anlamına gelir. Bu iki skor tek başına genel JDM hastalık aktivitesini veya hasarını belirlemez. Uygulama sırasında standart muayene protokolüne uyulmalıdır.')}
 <div class="jdm-reference-panel"><h3>Özgün standartlar ve kullanım</h3>${ref('NIH / IMACS — MMT-8, CMAS ve kullanım belgeleri','https://www.niehs.nih.gov/research/resources/imacs/diseaseactivity')}${ref('CMAS standart puanlama ve hareket tanımları','https://www.criteria.blood.gov.au/NeurologicalScales')}</div>`;}
 function result(type,n,total,value,max,infoText,source){const ready=value!==null;
 return `<aside class="jdm-result"><span class="jdm-result-eyebrow">${type} · SONUÇ</span>${ready?`<div class="jdm-result-value" data-jdm-score="${type.toLowerCase()}">${value}<span> / ${max}</span></div><p class="jdm-ready">✓ Tüm zorunlu alanlar tamamlandı.</p><p>${infoText}</p><button type="button" data-jdm-copy="${type.toLowerCase()}" class="jdm-primary">${svg('copy')} Sonucu kopyala</button>`:`<div class="jdm-locked" aria-label="Skor hesaplanmadı">—</div><p>Henüz ${total-n} değerlendirme eksik. <strong>Eksik veriyle toplam skor hesaplanmaz.</strong></p>`}<div class="jdm-result-foot"><button type="button" data-jdm-reset="${type.toLowerCase()}" class="jdm-secondary">${svg('refresh')} Formu sıfırla</button><div><b>Özgün kaynaklar</b>${source}</div><small>Uzman değerlendirmesi ve kullanım izinleri kontrol edilmeden hasta yönetimi için tek başına kullanılmamalıdır.</small></div></aside>`;}
 const MMT_LEVELS=[
  'Kas hareketi yok',
  'Yer çekimi elimine edilmiş düzlemde eksik hareket açıklığı',
  'Yer çekimi elimine edilmiş düzlemde tam hareket açıklığı',
  'Yer çekimine karşı kısmi hareket açıklığı',
  'Test pozisyonundan kademeli olarak bırakır',
  'Direnç olmadan test pozisyonunu korur',
  'Hafif dirence karşı test pozisyonunu korur',
  'Hafif–orta dirence karşı test pozisyonunu korur',
  'Orta dirence karşı test pozisyonunu korur',
  'Orta–kuvvetli dirence karşı test pozisyonunu korur',
  'Kuvvetli dirence karşı test pozisyonunu korur'
 ];
 function muscleRow(m){const val=state.mmt[m.id];return `<div class="jdm-question"><div class="jdm-question-head"><div><span class="jdm-group-label">${m.group.toUpperCase()} · ${m.region}</span><h3>${m.name}</h3><small>${m.latin}${m.id==='neck'?' · aksiyel':` · ${m.side}`}</small></div><span class="jdm-question-state">${val===undefined?'Yanıt bekleniyor':`${val} / 10`}</span></div><label for="mmt-${m.id}">Kas gücü puanı ve değerlendirme tanımı</label><select id="mmt-${m.id}" class="jdm-mmt-select" data-jdm-mmt-select="${m.id}"><option value="">Bir değerlendirme seçin</option>${MMT_LEVELS.map((label,v)=>`<option value="${v}" ${val===v?'selected':''}>${v} — ${label}</option>`).join('')}</select></div>`;}
 function mmt(){const done=MMT_ITEMS.filter(m=>completed(state.mmt,m.id)).length;const score=calcMMT();
 const subtotal=(side)=>{const items=MMT_ITEMS.filter(m=>m.side===side),n=items.filter(m=>completed(state.mmt,m.id)).length;return n===7?sum(items.map(m=>Number(state.mmt[m.id]))):'—';};
 return `${back()}${cardsTitle('MMT-8 · Bilateral Manual Muscle Testing','Boyun 10 + sağ 70 + sol 70 · toplam 0–150','JDM · KAS GÜCÜ')}
 ${info('<b>Bilateral MMT-8 (0–150):</b> Boyun fleksörleri bir kez değerlendirilir (0–10). Diğer 7 kas sağ ve sol için ayrı ayrı puanlanır (70 + 70). Tüm puanlar aynı formda seçilir.')}
 <div class="jdm-layout"><section class="jdm-main"><div class="jdm-sheet-head"><h2>Kas gücü muayenesi</h2><p>Boyun ve sağ/sol kas gruplarını 0–10 Türkçe açıklamalı puan seçenekleriyle değerlendir.</p>${progress(done,15)}<div class="jdm-mini-note">Boyun: <b>${completed(state.mmt,'neck')?state.mmt.neck:'—'}/10</b> · Sağ: <b>${subtotal('Sağ')}/70</b> · Sol: <b>${subtotal('Sol')}/70</b></div></div>
 <div class="jdm-section-title">Boyun fleksörleri · 0–10</div>${muscleRow(MUSCLES[0])}
 ${['Sağ','Sol'].map(side=>`<div class="jdm-section-title">${side} taraf · 7 kas · 0–70</div>${MMT_ITEMS.filter(m=>m.side===side).map(muscleRow).join('')}`).join('')}
 </section>${result('MMT8',done,15,score,150,'Boyun (10) + sağ taraf (70) + sol taraf (70). Yüksek puan daha iyi kas gücünü gösterir.',`${ref('NIH / IMACS MMT-8 kaynakları','https://www.niehs.nih.gov/research/resources/imacs/diseaseactivity')}${ref('Rider ve ark. (2010)','https://pubmed.ncbi.nlm.nih.gov/20391500/')}`)}</div>
 <div class="jdm-guide"><h3>0–10 Kendall kas gücü ölçeği</h3><p>Her kas için 0–10 puan ve ilgili Türkçe kuvvet tanımını seçin. Toplam 15 test alanının tamamı doldurulduğunda 150 üzerinden sonuç oluşur.</p></div>`;}
 function cmasRow(q){if(q.id==='situps')return `<div class="jdm-question"><div class="jdm-question-head"><div><span class="jdm-group-label">5. HAREKET · 0–6 PUAN</span><h3>${q.name}</h3><small>PDF'deki altı varyasyon ayrı değerlendirilir. Her biri 0 veya 1 puan.</small></div><span class="jdm-question-state">${SITUPS.filter((_,i)=>completed(state.situps,String(i))).length}/6</span></div><div class="jdm-situps">${SITUPS.map((name,i)=>`<div class="jdm-situp"><span>${i+1}. ${name}</span><div role="group" aria-label="${htmlEscape(name)}"><button type="button" data-jdm-situp="${i}" data-jdm-value="0" class="${state.situps[i]===0?'selected':''}" aria-pressed="${state.situps[i]===0}">0 · Yapamadı</button><button type="button" data-jdm-situp="${i}" data-jdm-value="1" class="${state.situps[i]===1?'selected':''}" aria-pressed="${state.situps[i]===1}">1 · Yapabildi</button></div></div>`).join('')}</div></div>`;
 const v=state.cmas[q.id];const idx=CMAS.findIndex(x=>x.id===q.id);return `<div class="jdm-question"><div class="jdm-question-head"><div><span class="jdm-group-label">${idx+1}. HAREKET · 0–${q.max} PUAN</span><h3>${q.name}</h3><small>${q.short}</small></div><span class="jdm-question-state">${v===undefined?'Yanıt bekleniyor':`${v} / ${q.max}`}</span></div><div class="jdm-levels" role="group" aria-label="${htmlEscape(q.name)} ayrıntılı puanlama">${q.levels.map((description,n)=>`<button type="button" data-jdm-cmas="${q.id}" data-jdm-value="${n}" aria-pressed="${v===n}" class="jdm-cmas-choice ${v===n?'selected':''}"><strong>${n}</strong><span>${htmlEscape(description)}</span></button>`).join('')}</div></div>`;}
 function cmas(){const n=19-cmasMissing();const score=calcCMAS();return `${back()}${cardsTitle('CMAS · Childhood Myositis Assessment Scale','14 hareket · Kas gücü, fiziksel fonksiyon ve dayanıklılık · 0–52','JDM · FONKSİYON')}
 ${info('<b>Standart CMAS protokolü:</b> Hareketler sırasıyla uygulanmalı; 4., 8. ve 12. maddeler için özgün yayındaki baskı hataları yerine güncel doğrulanmış puanlama kullanılmalıdır. Mekik maddesinde 6 farklı deneme puanlanır. <b>Boş bırakılan hiçbir hareket 0 sayılmaz.</b>')}
 <div class="jdm-layout"><section class="jdm-main"><div class="jdm-sheet-head"><h2>Fonksiyon değerlendirmesi</h2><p>Her hareketi gözlemleyerek puan seçin. Ayrıntılı kriterler için “puanların yanındaki açıklamayı okuyup uygun seçeneğe dokunun.</p>${progress(n,19)}<div class="jdm-mini-note">13 hareket puanlaması + 6 mekik denemesi = 19 gerekli işaretleme; toplam <b>14 ana CMAS hareketi</b>.</div></div>
 ${['Yatak üzerinde','Gövde ve üst ekstremite','Yerde ve ayakta'].map(group=>`<div class="jdm-section-title">${group}</div>${CMAS.filter(q=>q.group===group).map(cmasRow).join('')}`).join('')}</section>${result('CMAS',n,19,score,52,'Yüksek puan daha iyi gözlenen fiziksel fonksiyon ve dayanıklılığı gösterir. Yaşa göre değerlendirme bağlamı önemlidir.',`${ref('NIEHS/IMACS resmî CMAS kaynakları','https://www.niehs.nih.gov/research/resources/imacs/diseaseactivity')}${ref('CMAS 14 madde puanlama çizelgesi','https://www.criteria.blood.gov.au/NeurologicalScales')}`)}</div>`;}
 function render(t){switch(t){case 'jdm':return hub();case 'mmt8':return mmt();case 'cmas':return cmas();default:return hub();}}
 function update(){const r=(location.hash||'').replace('#scores/','');const root=document.querySelector('#app');if(root)root.innerHTML=render(r);}
 function onInput(e){if(!e.target.matches('[data-jdm-mmt-select]'))return false; const id=e.target.dataset.jdmMmtSelect; if(e.target.value==='')delete state.mmt[id];else state.mmt[id]=Number(e.target.value);update();return true;}
 function onClick(e){const el=e.target.closest('[data-jdm-mmt],[data-jdm-cmas],[data-jdm-situp],[data-jdm-explain],[data-jdm-reset],[data-jdm-copy]');if(!el)return false;const d=el.dataset;const y=window.scrollY;
 if(d.jdmMmt){state.mmt[d.jdmMmt]=Number(d.jdmValue);}
 else if(d.jdmCmas){state.cmas[d.jdmCmas]=Number(d.jdmValue);}
 else if(d.jdmSitup!==undefined){state.situps[d.jdmSitup]=Number(d.jdmValue);}
 else if(d.jdmExplain){state.detail=state.detail===d.jdmExplain?null:d.jdmExplain;}
 else if(d.jdmReset){if(d.jdmReset==='mmt8'){state.mmt={};}else{state.cmas={};state.situps={};state.detail=null;}}
 else if(d.jdmCopy){let str='';if(d.jdmCopy==='mmt8'&&calcMMT()!==null)str=`MMT-8 (bilateral): ${calcMMT()}/150`;
  if(d.jdmCopy==='cmas'&&calcCMAS()!==null)str=`CMAS: ${calcCMAS()}/52`;
  if(str&&navigator.clipboard?.writeText)navigator.clipboard.writeText(str).then(()=>{if(typeof showToast==='function')showToast('Sonuç panoya kopyalandı.');}).catch(()=>{});return true;}
 update();window.scrollTo({top:y,behavior:'instant'});return true;
 }
 return {render,onClick,onInput,state,MUSCLES,CMAS,SITUPS,calcMMT,calcCMAS};
})();
