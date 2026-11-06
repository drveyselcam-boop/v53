'use strict';
/* PedRheum Atlas FMF / autoinflammation tools, v0.10.
 * Educational/prototype implementation; patient data kept only in live JS memory.
 * References in UI. Never silently impute negative clinical findings.
 */
const FMFTools=(()=>{
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ico=n=>typeof svg==='function'?svg(n):'';
 const tools=[
  ['issf','ISSF','FMF hastalık şiddeti','9 alan · 0–10 · Hafif / Orta / Ağır','ŞİDDET'],
  ['aidai','AIDAI','Otoinflamatuvar aktivite günlüğü','12 belirti · Her gün ayrı · Aylık toplam','AKTİVİTE'],
  ['pras','Modifiye Pras','Çocukluk çağı FMF şiddeti','6 alan · Yaşa uyarlanmış Pras','ŞİDDET'],
  ['fmf50','FMF50','Tedavi yanıtı','Tedavi öncesi/sonrası 6 alan · ≥%50 yanıt','TEDAVİ YANITI'],
  ['pediatric','Yalçınkaya–Özen','Pediatrik FMF klinik kriterleri','5 klinik kriter · ≥2 karşılandığında','TANI KRİTERLERİ'],
  ['eurofever','Eurofever/PRINTO','FMF sınıflama kriterleri','MEFV genotipi + 4 klinik özellik','SINIFLAMA']
 ];
 const links={
 issf:[['https://pubmed.ncbi.nlm.nih.gov/26823530/','Demirkaya ve ark. 2016 · ISSF'],['https://www.mdpi.com/2075-4418/15/9/1077','ISSF puanlama tablosu']],
 aidai:[['https://ard.bmj.com/content/73/12/2168','Piram ve ark. 2014 · AIDAI validasyonu'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC4251184/','AIDAI · 12 belirti ve puanlama']],
 pras:[['https://www.mdpi.com/2075-4418/15/9/1077','Çocuklara uyarlanmış Pras puanlama tablosu'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC6267760/','Pras şiddet skoru kullanımı']],
 fmf50:[['https://pubmed.ncbi.nlm.nih.gov/24570027/','FMF50 özgün çalışma'],['https://pubmed.ncbi.nlm.nih.gov/25946762/','FMF50 · kısıtlılık değerlendirmesi']],
 pediatric:[['https://doi.org/10.1093/rheumatology/ken509','Yalçınkaya ve ark. 2009 · Pediatrik kriterler']],
 eurofever:[['https://pmc.ncbi.nlm.nih.gov/articles/PMC11562618/','Eurofever/PRINTO FMF sınıflama tablosu'],['https://www.mdpi.com/2073-4409/11/14/2231','2019 Eurofever/PRINTO kriterleri']]
 };
 const ISSF=[
  {id:'chronic',name:'Kronik sekel',hint:'AA amiloidoz, büyüme geriliği veya splenomegali gibi',opts:[['0','Yok',0],['1','Var',1]]},
  {id:'dysfunction',name:'Organ disfonksiyonu',hint:'AA amiloidozuna bağlı nefrotik düzeyde proteinüri',opts:[['0','Yok',0],['1','Var',1]]},
  {id:'failure',name:'Organ yetmezliği',hint:'Örn. AA ilişkili böbrek veya kalp yetmezliği',opts:[['0','Yok',0],['1','Var',1]]},
  {id:'freq',name:'Ortalama aylık atak sıklığı',hint:'Birbirini dışlayan seçenekler: 1–2/ay = 1, >2/ay = 2 puan',opts:[['0','Ayda 1’den az',0],['1','Ayda 1–2',1],['2','Ayda 2’den fazla',2]]},
  {id:'apr',name:'Ataksız dönemde yüksek akut faz reaktanları',hint:'Atak sonrası yeterli süre geçtikten sonra devam eden yükselme',opts:[['0','Hayır',0],['1','Evet',1]]},
  {id:'sites',name:'Tek bir atakta ikiden fazla tutulum bölgesi',hint:'Peritonit, plörit, sinovit gibi',opts:[['0','Hayır',0],['1','Evet',1]]},
  {id:'types',name:'Hastalık seyri boyunca ikiden fazla atak tipi',hint:'Farklı klinik atak tipleri',opts:[['0','Hayır',0],['1','Evet',1]]},
  {id:'long',name:'Bir yılda ≥3 atakta sürenin >72 saat olması',hint:'Uzamış atak kriteri',opts:[['0','Hayır',0],['1','Evet',1]]},
  {id:'leg',name:'Egzersizle tetiklenen bacak ağrısı',hint:'Alternatif nedenler dışlanmış olmalı',opts:[['0','Hayır',0],['1','Evet',1]]}
 ];
 const PRAS=[
  {id:'age',name:'Hastalık başlangıç yaşı',hint:'Çocuklara uyarlanmış Pras sürümü',opts:[['a','<6 yaş',4],['b','6–10 yaş',3],['c','>10 yaş',2]]},
  {id:'freq',name:'Aylık atak sıklığı',opts:[['a','Ayda 1’den az',1],['b','Ayda 1–2',2],['c','Ayda 2’den fazla',3]]},
  {id:'arth',name:'Artrit',opts:[['a','Yok',0],['b','Akut artrit',2],['c','Uzamış/kronik artrit',3]]},
  {id:'ele',name:'Erizipel benzeri eritem',opts:[['0','Yok',0],['1','Var',2]]},
  {id:'amy',name:'AA amiloidozu',opts:[['0','Yok',0],['1','Var',3]]},
  {id:'col',name:'Atakları kontrol için gerekli kolşisin dozu',hint:'Yaşa uygun karşılaştırma: <5 yaş 0,5 mg/gün; 5–10 yaş 1 mg/gün; >10 yaş 1,5 mg/gün. Bu bir tedavi önerisi değildir.',opts:[['a','Yaşa uygun dozun altında',0],['b','Yaşa uygun dozda',1],['c','Yaşa uygun dozun üzerinde',2]]}
 ];
 const PED=[
  {id:'fever',name:'Tekrarlayan ateş',hint:'Aksiller >38 °C; 6–72 saat; ≥3 atak'},
  {id:'abd',name:'Karın ağrısı',hint:'6–72 saat; ≥3 atak'},
  {id:'chest',name:'Göğüs ağrısı',hint:'6–72 saat; ≥3 atak'},
  {id:'arth',name:'Oligoartrit',hint:'6–72 saat; ≥3 atak'},
  {id:'family',name:'Ailede FMF öyküsü',hint:'Klinik kriter'}
 ];
 const EURO=[
  {id:'duration',name:'Atak süresi 1–3 gün'},
  {id:'arth',name:'Artrit'},
  {id:'chest',name:'Göğüs ağrısı'},
  {id:'abd',name:'Karın ağrısı'}
 ];
 const SYM=[
  ['fever','Ateş ≥38 °C'],['general','Genel belirtiler / iyi hissetmeme'],['abd','Karın ağrısı'],['nv','Bulantı / kusma'],
  ['diarrhea','İshal'],['headache','Baş ağrısı'],['chest','Göğüs ağrısı'],['nodes','Ağrılı lenf düğümü'],
  ['myalgia','Artralji veya miyalji'],['swelling','Eklem şişliği'],['eyes','Göz bulguları'],['rash','Döküntü']
 ];
 const FMF50_FIELDS=[
  ['frequency','Aylık atak sıklığı','atak/ay',null],['duration','Atak süresi','saat',null],
  ['patient','Hasta/ebeveyn global VAS','0–10',10],['physician','Hekim global VAS','0–10',10],
  ['arthritis','Artritli atak sıklığı','atak/ay',null],['reactant','Akut faz reaktanı','seçilen belirtecin birimi',null]
 ];
 const state={issf:{},pras:{},pediatric:{},eurofever:{},genotype:null,aidai:{},month:new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0'),day:1,aidaiPain:{},fmf50:{},fmf50Marker:'CRP',fmf50Compliance:null};
 const full=(items,answers)=>items.every(i=>answers[i.id]!==undefined);
 const rawScore=(items,answers)=>full(items,answers)?items.reduce((sum,i)=>sum+(i.opts.find(o=>o[0]===answers[i.id])?.[2]??0),0):null;
 const issf=()=>rawScore(ISSF,state.issf);
 const pras=()=>rawScore(PRAS,state.pras);
 const ped=()=>full(PED,state.pediatric)?PED.reduce((sum,i)=>sum+(state.pediatric[i.id]==='yes'),0):null;
 const euro=()=>state.genotype!==null&&full(EURO,state.eurofever)?{count:EURO.filter(i=>state.eurofever[i.id]==='yes').length,pass:EURO.filter(i=>state.eurofever[i.id]==='yes').length >= (state.genotype==='confirm'?1:2)}:null;
 const daysInMonth=(m)=>{const a=/^(\d{4})-(\d{2})$/.exec(m||'');if(!a)return 0;const y=Number(a[1]),n=Number(a[2]);if(n<1||n>12||y<1900||y>2100)return 0;return new Date(y,n,0).getDate();};
 const keyForDay=(d)=>state.month+'-'+String(d).padStart(2,'0');
 const daily=(d)=>state.aidai[keyForDay(d)]||(state.aidai[keyForDay(d)]={});
 const countDay=(d)=>SYM.filter(([id])=>daily(d)[id]!==undefined).length;
 const aidai=()=>{const n=daysInMonth(state.month);if(!n||Array.from({length:n},(_,i)=>i+1).some(d=>countDay(d)!==SYM.length))return null;
  let total=0,feverDays=0,symptomDays=0;for(let d=1;d<=n;d++){let has=false;const x=daily(d);SYM.forEach(([id])=>{if(x[id]==='yes'){total++;has=true;if(id==='fever')feverDays++;}});if(has)symptomDays++;}
  return {total,days:n,max:n*12,feverDays,symptomDays};};
 function fmf50(){const entries=[];for(const [id,,,max] of FMF50_FIELDS){const b=state.fmf50[id+'_before'],a=state.fmf50[id+'_after'];if(b===undefined||a===undefined||b===''||a==='')return null;
  const before=Number(b),after=Number(a);if(!Number.isFinite(before)||!Number.isFinite(after)||before<0||after<0||(max!==null&&(before>max||after>max)))return null;
  const improving=before>0&&after<=before/2;
  const worsening=after>before+1e-8;
  entries.push({id,before,after,improving,worsening});}
  if(state.fmf50Compliance===null)return null;
  const good=entries.filter(x=>x.improving).length,worsened=entries.some(x=>x.worsening);
  return {good,worsened,pass:good>=5&&!worsened&&state.fmf50Compliance==='yes',compliant:state.fmf50Compliance==='yes',entries};
 }
 const getResult=id=>id==='issf'?issf():id==='pras'?pras():id==='pediatric'?ped():id==='eurofever'?euro():id==='aidai'?aidai():fmf50();
 function sources(id){return `<div class="fmf-ref"><b>Kaynaklar ve sınırlar</b>${links[id].map(([u,t])=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${esc(t)} ↗</a>`).join('')}<p>Bu araç, klinik karar desteği için hazırlanmış bir prototiptir. Özellikle tanı/sınıflama kriterleri klinik değerlendirme yerine geçmez. Hasta verileri bu prototipte sunucuya gönderilmez veya kalıcı olarak kaydedilmez.</p></div>`;}
 function hub(){return `<button class="breadcrumb-back" data-go="scores">${ico('back')} Skor listesine dön</button>${cardsTitle('FMF & Otoinflamasyon','Ailesel Akdeniz ateşinde aktivite, şiddet, yanıt ve klinik kriterleri ayrı değerlendirin.','6 ETKİLEŞİMLİ ARAÇ')}
 <div class="fmf-banner"><div class="fmf-banner-emblem">FMF<span>+</span></div><div><strong>Atak günlüğünden hastalık şiddetine.</strong><p>AIDAI gün gün kaydedilir; ISSF ve Pras şiddeti, FMF50 ise tedavi yanıtını ölçer. Yalçınkaya–Özen ile Eurofever/PRINTO puanları tanısal/sınıflama amaçlıdır.</p></div></div>
 <div class="fmf-hub-grid">${tools.map(([id,t,sub,desc,tag],i)=>`<button class="fmf-hub-card" data-go="scores/${id}"><span class="fmf-category">${tag}</span><span class="fmf-tile-number">0${i+1}</span><h2>${t}</h2><strong>${sub}</strong><p>${desc}</p><span class="fmf-open">Hesaplayıcıyı aç ${ico('arrow')}</span></button>`).join('')}</div>
 <div class="fmf-note">${ico('info')} FMF/otoinflamasyon değerlendirmelerinde aktivite, şiddet, tedavi yanıtı ve sınıflama farklı amaçlara hizmet eder; sonuçlar birbirine dönüştürülemez.</div>`;}
 function choices(id,item,current){return `<div class="fmf-item"><div><b>${item.name}</b>${item.hint?`<small>${item.hint}</small>`:''}</div><div class="fmf-choices" role="group" aria-label="${esc(item.name)}">${item.opts.map(([key,name,pts])=>`<button type="button" data-fmf-choice="${id}" data-fmf-item="${item.id}" data-fmf-value="${key}" class="${current===key?'chosen':''}" aria-pressed="${current===key}">${esc(name)}<small>${pts} p.</small></button>`).join('')}</div></div>`;}
 function yesNo(id,item,current){return `<div class="fmf-item"><div><b>${item.name}</b>${item.hint?`<small>${item.hint}</small>`:''}</div><div class="fmf-choices" role="group" aria-label="${esc(item.name)}">${[['no','Hayır'],['yes','Evet']].map(([v,l])=>`<button type="button" data-fmf-choice="${id}" data-fmf-item="${item.id}" data-fmf-value="${v}" class="${v===current?'chosen':''}" aria-pressed="${v===current}">${l}</button>`).join('')}</div></div>`;}
 const progress=(done,total)=>`<div class="fmf-progress"><span>Form ilerlemesi</span><strong>${done} / ${total}</strong></div><div class="fmf-progress-bar"><span style="width:${100*done/total}%"></span></div>`;
 function descriptor(id,v){if(id==='issf')return v<=2?'Hafif hastalık':v<=5?'Orta şiddette hastalık':'Ağır hastalık';if(id==='pras')return v<=5?'Hafif hastalık':v<=9?'Orta şiddette hastalık':'Ağır hastalık';if(id==='pediatric')return v>=2?'En az iki klinik kriter karşılanıyor':'İki klinik kriter karşılanmıyor';if(id==='eurofever')return v.pass?'FMF sınıflama koşulu karşılanıyor':'FMF sınıflama koşulu karşılanmıyor';if(id==='aidai')return v.total>=9?'AIDAI ≥9: Aktivite lehine':'AIDAI <9: İnaktif hastalık lehine';if(id==='fmf50')return !v.compliant?'Değerlendirme için tedavi uyumu şartı karşılanmadı':v.pass?'FMF50 yanıt koşulları karşılandı':'FMF50 yanıt koşulları karşılanmadı';return ''}
 function displayScore(id,result,done,total){let main,sub,extra='';
  if(result===null){main='<span class="fmf-placeholder">—</span>';sub=`${total-done} zorunlu alan eksik. Tamamlanmadan sonuç gösterilmez.`;}
  else if(id==='issf'){main=`${result}<small>/ 10</small>`;sub=descriptor(id,result);}
  else if(id==='pras'){main=`${result}<small>puan</small>`;sub=descriptor(id,result);extra='Çocuklara uyarlanmış Pras varyantı kullanılmıştır. Yaşa göre kolşisin karşılaştırması bir reçete önerisi değildir.';}
  else if(id==='pediatric'){main=`${result}<small>/ 5 kriter</small>`;sub=descriptor(id,result);extra='Bu değerlendirme kesin FMF tanısı koymaz; alternatif nedenlerin dışlanması ve klinik bağlam şarttır.';}
  else if(id==='eurofever'){main=`${result.count}<small>/ 4 özellik</small>`;sub=descriptor(id,result);extra=`Seçilen MEFV kategorisi için en az ${state.genotype==='confirm'?1:2} klinik özellik gerekli. Bu bir sınıflama aracıdır; tek başına tanı değildir.`;}
  else if(id==='aidai'){main=`${result.total}<small>/ ${result.max}</small>`;sub=descriptor(id,result);extra=`${result.days} gün · ${result.feverDays} ateş günü · ${result.symptomDays} semptom günü. Analjezik kullanımı toplama dahil değildir.`;}
  else if(id==='fmf50'){main=`${result.good}<small>/ 6</small>`;sub=descriptor(id,result);extra=`${result.worsened?'En az bir kriter kötüleşmiş.':'Hiçbir kriterde kötüleşme yok.'} ${result.compliant?'Uyum koşulu işaretlendi.':'Uyum koşulu sağlanmıyor.'} Başlangıç değeri 0 olan bir parametrede %50 iyileşme hesaplanamaz.`;}
  return `<div class="fmf-result-card" id="fmf-result"><span class="fmf-kicker">${id==='fmf50'?'≥%50 İYİLEŞEN ÖLÇÜT':'HESAPLAMA SONUCU'}</span><div class="fmf-result-num" ${result!==null?'data-fmf-score="'+id+'"':''}>${main}</div><b class="fmf-verdict">${esc(sub)}</b>${extra?`<p>${extra}</p>`:''}${result!==null?`<button type="button" class="fmf-copy" data-fmf-copy="${id}">${ico('copy')} Sonucu kopyala</button>`:''}</div>`;}
 function shell(id,form,done,total){const item=tools.find(x=>x[0]===id),result=getResult(id);return `<button class="breadcrumb-back" data-go="scores/fmf">${ico('back')} FMF merkezine dön</button>${cardsTitle(item[1],item[2]+' · '+item[3],item[4])}
 <div class="fmf-layout"><section class="fmf-form"><div class="fmf-form-header"><div><h2>Değerlendirme</h2><p>Yanıtlanmayan alanlar otomatik “normal/yok” sayılmaz.</p></div></div>${progress(done,total)}${form}<div class="fmf-foot"><button type="button" data-fmf-reset="${id}">${ico('refresh')} Formu sıfırla</button></div></section><aside class="fmf-aside">${displayScore(id,result,done,total)}${sources(id)}</aside></div>`;}
 function simple(id){const items=id==='issf'?ISSF:id==='pras'?PRAS:id==='pediatric'?PED:EURO,data=state[id],done=items.filter(i=>data[i.id]!==undefined).length;
  const genotype=id==='eurofever'?`<div class="fmf-geno"><strong>MEFV genotipinin klinik sınıflandırması</strong><p>Doğrulayıcı: patojenik / olası patojenik bialelik varyantlar. Doğrulayıcı olmayan: diğer test edilmiş genotipler. Genetik test yapılmadıysa sonuç yorumlanamaz.</p><div class="fmf-choices">${[['confirm','Doğrulayıcı'],['other','Doğrulayıcı değil']].map(([v,l])=>`<button data-fmf-genotype="${v}" class="${state.genotype===v?'chosen':''}" type="button">${l}</button>`).join('')}</div></div>`:'';
  const lines=items.map(i=>i.opts?choices(id,i,data[i.id]):yesNo(id,i,data[i.id])).join('');return shell(id,genotype+lines,done+(id==='eurofever'&&state.genotype!==null?1:0),items.length+(id==='eurofever'?1:0));}
 function aidaiView(){const n=daysInMonth(state.month),d=Math.min(state.day,n),x=daily(d),doneDays=Array.from({length:n},(_,i)=>i+1).filter(i=>countDay(i)===SYM.length).length,dayAnswered=countDay(d);
  const calendar=`<div class="fmf-month-row"><label for="fmf-month">Değerlendirilen ay</label><input type="month" id="fmf-month" data-fmf-month value="${esc(state.month)}" min="2000-01" max="2100-12"></div><div class="fmf-days">${Array.from({length:n},(_,i)=>i+1).map(i=>`<button type="button" data-fmf-day="${i}" class="${d===i?'active ':''}${countDay(i)===12?'complete':''}" aria-label="${i}. gün, ${countDay(i)} / 12 yanıtlandı"><span>${i}</span><span class="fmf-day-dot">${countDay(i)===12?'✓':countDay(i)>0?'•':''}</span></button>`).join('')}</div>`;
  const fields=SYM.map(([id,name])=>yesNo('aidai',{id,name},x[id])).join('');
  const form=`${calendar}<div class="fmf-day-title"><h3>${d}. günün belirtileri</h3><small>${dayAnswered}/12 yanıt</small></div><button type="button" class="fmf-all-clear" data-fmf-day-clear="${d}">${ico('check')} Bu günün tüm belirtilerini “Yok” olarak işaretle</button>${fields}
 <div class="fmf-optional"><b>Ek kayıt · Analjezik kullanımı</b><p>AIDAI toplamına katılmaz.</p><div class="fmf-choices">${[['no','Almadı'],['yes','Aldı']].map(([v,l])=>`<button type="button" data-fmf-pain="${v}" class="${state.aidaiPain[keyForDay(d)]===v?'chosen':''}">${l}</button>`).join('')}</div></div>
 <div class="fmf-diary-tools"><button type="button" data-fmf-export>${ico('copy')} Ayın kayıtlarını JSON olarak kaydet</button><button type="button" data-fmf-import-open>${ico('book')} Kayıt dosyasını içe aktar</button><input type="file" accept=".json,application/json" data-fmf-import-file id="fmf-import-file" hidden></div>
 <p class="fmf-diary-note">Kayıtlar otomatik saklanmaz. Bir sonraki ziyarette sürdürmek için dosyayı indirip gerektiğinde geri yükleyin. Dışa aktarılan dosyayı kişisel sağlık verisi olarak koruyun.</p>
 <div class="fmf-next"><button type="button" data-fmf-step="-1" ${d===1?'disabled':''}>← Önceki gün</button><button type="button" data-fmf-step="1" ${d===n?'disabled':''}>Sonraki gün →</button></div><div class="fmf-inline-note">Dönem: ${n} gün. Aylık toplam, günlük 12 belirtinin Evet (1) sayılarının toplamıdır. Sonucun görünmesi için her günün 12 maddesi yanıtlanmalıdır.</div>`;
 return shell('aidai',form,doneDays,n);}
 function fmf50View(){const done=FMF50_FIELDS.reduce((s,[id])=>s+['before','after'].filter(p=>validEntry(id,p)).length,0)+(state.fmf50Compliance!==null?1:0),total=FMF50_FIELDS.length*2+1;
 const form=`<div class="fmf-geno"><strong>Tedaviye uyum / uygun en yüksek doz değerlendirmesi</strong><p>Özgün FMF50 çalışmasında tedavi uyumu değerlendirme için temel koşuldu. Uyum yeterli değilse yanıt kriterleri geçerli kabul edilmez.</p><div class="fmf-choices">${[['yes','Yeterli'],['no','Yetersiz']].map(([v,l])=>`<button type="button" data-fmf-compliance="${v}" class="${state.fmf50Compliance===v?'chosen':''}">${l}</button>`).join('')}</div></div>
 <div class="fmf-marker"><label for="fmf-marker-select">Akut faz reaktanı (iki ölçümde aynı)</label><select id="fmf-marker-select" data-fmf-marker><option value="CRP" ${state.fmf50Marker==='CRP'?'selected':''}>CRP</option><option value="SAA" ${state.fmf50Marker==='SAA'?'selected':''}>SAA</option><option value="ESR" ${state.fmf50Marker==='ESR'?'selected':''}>ESH / ESR</option></select></div>
 ${FMF50_FIELDS.map(([id,name,unit,max])=>`<div class="fmf-paired"><b>${name}${id==='reactant'?' · '+state.fmf50Marker:''}</b><small>${id==='reactant'?(state.fmf50Marker==='ESR'?'mm/saat':'mg/L'):unit}</small><div class="fmf-paired-cols">${[['before','Başlangıç'],['after','İzlem']].map(([v,l])=>`<label><span>${l}</span><input type="number" data-fmf-number="${id}" data-fmf-period="${v}" inputmode="decimal" min="0" ${max===null?'':`max="${max}"`} step="any" placeholder="—" value="${esc(state.fmf50[id+'_'+v]??'')}"></label>`).join('')}</div></div>`).join('')}
 <div class="fmf-inline-note">≥%50 iyileşme 6 ölçütten en az 5’inde olmalı ve hiçbirinde kötüleşme olmamalı. Başlangıçta sıfır olan değerler iyileşme hanesine yazılmaz; ancak izlemde artarsa kötüleşme sayılır. Özellikle bazalde artrit atağı olmayan hastalarda ölçeğin duyarlılığı sınırlı olabilir.</div>`;
 return shell('fmf50',form,done,total);}
 function validEntry(id,period){const v=state.fmf50[id+'_'+period],x=Number(v);return v!==undefined&&v!==''&&Number.isFinite(x)&&x>=0&&(!['patient','physician'].includes(id)||x<=10);}
 function render(id){if(id==='fmf')return hub();if(id==='aidai')return aidaiView();if(id==='fmf50')return fmf50View();if(['issf','pras','pediatric','eurofever'].includes(id))return simple(id);return hub();}
 function update(focus){if(typeof currentRoute!=='function')return;const id=currentRoute().split('/')[1];if(!['fmf','issf','pras','pediatric','eurofever','aidai','fmf50'].includes(id))return;const y=window.scrollY;document.querySelector('#app').innerHTML=render(id);window.scrollTo({top:y,behavior:'instant'});if(focus)document.querySelector(focus)?.focus({preventScroll:true});}
 function onClick(e){let t=e.target.closest('[data-fmf-choice]');if(t){const {fmfChoice:id,fmfItem:item,fmfValue:value}=t.dataset;if(id==='aidai')daily(state.day)[item]=value;else state[id][item]=value;update(`[data-fmf-choice="${id}"][data-fmf-item="${item}"][data-fmf-value="${value}"]`);return true;}
  t=e.target.closest('[data-fmf-genotype]');if(t){state.genotype=t.dataset.fmfGenotype;update();return true;}
  t=e.target.closest('[data-fmf-day]');if(t){state.day=Number(t.dataset.fmfDay);update();return true;}
  t=e.target.closest('[data-fmf-day-clear]');if(t){SYM.forEach(([id])=>daily(state.day)[id]='no');update();return true;}
  t=e.target.closest('[data-fmf-step]');if(t){state.day=Math.max(1,Math.min(daysInMonth(state.month),state.day+Number(t.dataset.fmfStep)));update();return true;}
  t=e.target.closest('[data-fmf-pain]');if(t){state.aidaiPain[keyForDay(state.day)]=t.dataset.fmfPain;update();return true;}
  t=e.target.closest('[data-fmf-compliance]');if(t){state.fmf50Compliance=t.dataset.fmfCompliance;update();return true;}
  t=e.target.closest('[data-fmf-export]');if(t){const month=state.month;const records={},analgesic={};for(let d=1;d<=daysInMonth(month);d++){const k=keyForDay(d);if(state.aidai[k])records[k]=state.aidai[k];if(state.aidaiPain[k])analgesic[k]=state.aidaiPain[k];}const value={format:'pedrheum-aidai-v1',month,records,analgesic};const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`AIDAI-${month}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);showToast('Günlük dosyası indirildi.');return true;}
  t=e.target.closest('[data-fmf-import-open]');if(t){document.querySelector('#fmf-import-file')?.click();return true;}
  t=e.target.closest('[data-fmf-reset]');if(t){const id=t.dataset.fmfReset;if(id==='aidai'){Object.keys(state.aidai).filter(k=>k.startsWith(state.month+'-')).forEach(k=>delete state.aidai[k]);Object.keys(state.aidaiPain).filter(k=>k.startsWith(state.month+'-')).forEach(k=>delete state.aidaiPain[k]);state.day=1;}
   else if(id==='fmf50'){state.fmf50={};state.fmf50Compliance=null;}else {state[id]={};if(id==='eurofever')state.genotype=null;}update();showToast('Form sıfırlandı.');return true;}
  t=e.target.closest('[data-fmf-copy]');if(t){const id=t.dataset.fmfCopy,res=getResult(id);if(res===null)return true;const val=typeof res==='number'?res:id==='aidai'?res.total:id==='eurofever'?res.count:res.good;
    const note=descriptor(id,res);const msg=`${tools.find(x=>x[0]===id)[1]}: ${val}. ${note}`;navigator.clipboard?.writeText(msg).then(()=>showToast('Sonuç kopyalandı.')).catch(()=>showToast('Pano izni verilemedi.'));return true;}
  return false;}
 function onInput(e){const t=e.target;if(t.hasAttribute('data-fmf-import-file')){const file=t.files?.[0];if(!file)return true;if(file.size>1000000){showToast('Dosya boyutu çok büyük.');return true;}
    file.text().then(content=>{const data=JSON.parse(content);if(data.format!=='pedrheum-aidai-v1'||!daysInMonth(data.month)||typeof data.records!=='object'||!data.records)throw new Error('biçim');const rec={},pain={};for(const [k,v] of Object.entries(data.records)){if(!k.startsWith(data.month+'-')||!Number(k.slice(8))||Number(k.slice(8))>daysInMonth(data.month)||!v||typeof v!=='object')throw new Error('tarih');const vals={};for(const [id,value] of Object.entries(v)){if(!SYM.some(s=>s[0]===id)||!['yes','no'].includes(value))throw new Error('yanıt');vals[id]=value;}rec[k]=vals;}
      for(const [k,v] of Object.entries(data.analgesic||{})){if(!k.startsWith(data.month+'-')||!['yes','no'].includes(v))throw new Error('analjezik');pain[k]=v;}
      for(const k of Object.keys(state.aidai))if(k.startsWith(data.month+'-'))delete state.aidai[k];for(const k of Object.keys(state.aidaiPain))if(k.startsWith(data.month+'-'))delete state.aidaiPain[k];Object.assign(state.aidai,rec);Object.assign(state.aidaiPain,pain);state.month=data.month;state.day=1;update();showToast('Günlük kaydı içe aktarıldı.');
    }).catch(()=>showToast('Günlük dosyası okunamadı veya geçersiz.'));return true;}
  if(t.hasAttribute('data-fmf-month')){const val=t.value;if(!daysInMonth(val))return false;state.month=val;state.day=1;update();return true;}
  if(t.hasAttribute('data-fmf-marker')){state.fmf50Marker=t.value;delete state.fmf50.reactant_before;delete state.fmf50.reactant_after;update();return true;}
  if(t.hasAttribute('data-fmf-number')){const k=t.dataset.fmfNumber+'_'+t.dataset.fmfPeriod;state.fmf50[k]=t.value; // don't rerender while number input has focus
   const res=document.querySelector('.fmf-aside');if(res){const id='fmf50',done=FMF50_FIELDS.reduce((s,[it])=>s+['before','after'].filter(p=>validEntry(it,p)).length,0)+(state.fmf50Compliance!==null?1:0);res.innerHTML=displayScore(id,getResult(id),done,13)+sources(id);}
   const count=document.querySelector('.fmf-progress strong');if(count){const done=FMF50_FIELDS.reduce((s,[it])=>s+['before','after'].filter(p=>validEntry(it,p)).length,0)+(state.fmf50Compliance!==null?1:0);count.textContent=`${done} / 13`;const prog=document.querySelector('.fmf-progress-bar span');if(prog)prog.style.width=`${100*done/13}%`;}return true;}
  return false;}
 return {render,onClick,onInput,state,ISSF,PRAS,PED,EURO,SYM,daysInMonth,issf,pras,aidai,ped,euro,fmf50};
})();
