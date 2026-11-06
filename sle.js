/* PedRheum Atlas – SLE calculators. No data is stored or transmitted. */
'use strict';
const SLETools=(()=>{
 const answers={sledai:{},bilag:{},sledas:{},slicc:{}};
 const sources={
  sledai:[['Gladman et al., J Rheumatol 2002;29:288–291','https://pubmed.ncbi.nlm.nih.gov/11838846/'],['SLEDAI-2K değerlendirme formu (kılavuz eki)','https://portal.guiasalud.es/wp-content/uploads/2020/10/gpc_549_lupus_sescs_compl_en_caduc-1.pdf']],
  bilag:[['Yee et al., Rheumatology 2010;49:1665–1669','https://pubmed.ncbi.nlm.nih.gov/20181671/'],['BILAG-2004 ölçek ve kullanım açıklaması','https://pmc.ncbi.nlm.nih.gov/articles/PMC3812450/']],
  sledas:[['Jesus et al., Ann Rheum Dis 2019;78:365–371','https://pubmed.ncbi.nlm.nih.gov/30626657/'],['SLE-DAS formülü (kaynaklı yayıncı sayfası)','https://akp-pharma-digital.com/products/plaquenil/sle-score-sledas'],['Aktivite sınırları (Rheumatology 2023)','https://academic.oup.com/rheumatology/article/62/12/3909/7082518']],
  slicc:[['SLICC/ACR DI formu (kılavuz eki, s. 307)','https://portal.guiasalud.es/wp-content/uploads/2020/10/gpc_549_lupus_sescs_compl_en_caduc-1.pdf'],['SLICC/ACR Damage Index, değerlendirme özeti','https://pmc.ncbi.nlm.nih.gov/articles/PMC3812450/']]
 };
 const info={
  sledai:{name:'SLEDAI-2K',label:'Hastalık aktivitesi',subtitle:'24 ağırlıklı bulgu · Son 10 gün · Evet/Hayır',detail:'Yalnızca SLE aktivitesine atfedilebilen bulguları işaretleyin. Enfeksiyon, ilaç etkisi ve diğer nedenler uygun şekilde dışlanmalıdır.'},
  bilag:{name:'BILAG-2004',label:'Organ bazlı aktivite',subtitle:'9 organ sistemi · Son 4 hafta (önceki 4 hafta ile karşılaştırma) · A–E',detail:'BILAG-2004’ün 97 öğeden organ derecesi üreten özgün algoritması bu sürümde uygulanmadı. Bu modüle yalnızca özgün BILAG değerlendirmesiyle önceden belirlediğiniz A–E derecelerini girin.'},
  sledas:{name:'SLE-DAS',label:'Hastalık aktivitesi',subtitle:'17 klinik/laboratuvar alan · Son 30 gün · Evet/Hayır + sayı',detail:'Özgün SLE-DAS matematiksel formülü kullanılır. Bazı bulguların pozitif seçilmesi hâlinde ek sayısal veri gerekir. Sayısal değerler uygun aralıkta değilse sonuç çıkmaz.'},
  slicc:{name:'SLICC/ACR Damage Index',label:'Kalıcı organ hasarı',subtitle:'12 sistem · 41 özgün hasar öğesi · Dokunmatik seçim',detail:'Bu bir aktivite skoru değil, SLE başlangıcından sonra birikmiş kalıcı hasar indeksidir. Çoğu bulgu ≥6 ay sürmeli; infarkt gibi geri dönüşsüz olaylar istisnadır. Pediatrik uygulama uzman yorumu gerektirir.'}
 };
 const DESCRIPTORS=[
  ['Nöropsikiyatrik / vasküler',[
   ['nobet','Nöbet',8,'Yeni başlayan; metabolik, enfeksiyöz ve ilaç nedenleri dışlanmalı'],['psikoz','Psikoz',8,'SLE’ye bağlı işlevselliği bozan psikotik tablo'],['organik','Organik beyin sendromu',8,'Akut konfüzyon/bilişsel bozulma; diğer nedenleri dışlayın'],['gorme','Görme bozukluğu',8,'SLE’ye bağlanabilen retinal/oküler bulgu'],['kraniyal','Kraniyal sinir bozukluğu',8,'SLE’ye atfedilen kraniyal nöropati'],['basagrisi','Lupus baş ağrısı',8,'Özgün tanıma uygun şiddetli, devamlı baş ağrısı'],['svo','Serebrovasküler olay',8,'SLE aktivitesine atfedilebilen yeni olay'],['vaskulit','Vaskülit',8,'Klinik veya histolojik aktif vaskülit']]],
  ['Kas-iskelet / böbrek',[
   ['artrit','Artrit',4,'≥2 eklemde inflamatuvar artrit'],['miyozit','Miyozit',4,'Proksimal güçsüzlük/ağrı + kas enzim artışı veya objektif kanıt'],['silendir','İdrar silendirleri',4,'Hematik/granüler silendirler; aktif lupus kaynaklı'],['hematuri','Hematüri',4,'>5 eritrosit/büyük büyütme alanı; taş/enfeksiyon dışla'],['proteinuri','Proteinüri',4,'>0,5 g/24 saat; SLEDAI-2K’de kalıcı proteinüri de puanlanır'],['piyuri','Piyüri',4,'>5 lökosit/büyük büyütme alanı; enfeksiyonu dışla']]],
  ['Mukokütanöz / serozal / immünolojik',[
   ['dokuntu','Döküntü',2,'Devam eden SLE’ye bağlı inflamatuvar döküntü'],['alopesi','Alopesi',2,'Devam eden aktif SLE’ye bağlı anormal saç kaybı'],['ulser','Mukozal ülser',2,'Devam eden oral/nazal SLE ülseri'],['plorit','Plörit',2,'Tipik bulgular ve/veya objektif plörit kanıtı'],['perikardit','Perikardit',2,'Tipik bulgular, sürtünme sesi, efüzyon veya EKG kanıtı'],['kompleman','Düşük kompleman',2,'C3, C4 veya CH50 laboratuvar alt sınırı altında'],['dsdna','Artmış anti-dsDNA',2,'Laboratuvar referansına göre yüksek']]],
  ['Genel / hematolojik',[
   ['ates','Ateş',1,'>38°C; enfeksiyon dışlanmalı'],['trombosit','Trombositopeni',1,'<100 × 10⁹/L; diğer nedenleri dışlayın'],['lokopeni','Lökopeni',1,'<3 × 10⁹/L; ilaca bağlı nedenleri dışlayın']]]
 ];
 const sledaiItems=DESCRIPTORS.flatMap(g=>g[1].map(x=>({id:x[0],label:x[1],weight:x[2],hint:x[3]})));
 const bilagNames=['Konstitüsyonel','Mukokütanöz','Nöropsikiyatrik','Kas-iskelet','Kardiyorespiratuvar','Gastrointestinal','Oftalmik','Renal','Hematolojik'];
 const bilagItems=bilagNames.map((label,i)=>({id:'org'+i,label,hint:'Özgün BILAG-2004 formu ve puanlama algoritmasıyla belirlenmiş organ derecesini girin.'}));
 const sleDasData=[
  ['artrit','Artrit (inflamatuvar)', 'yesno','Aktif şiş eklem sayısı ayrıca sorulur (28 eklem değerlendirmesi).'],
  ['mukovask','Mukokütanöz vaskülit','yesno','Klinik mukokütanöz vaskülit'],['lokal','Lokalize döküntü','yesno','Lokalize aktif kutanöz döküntü'],['genel','Yaygın döküntü','yesno','Yaygın aktif kutanöz döküntü'],
  ['alopesi','Alopesi','yesno','Aktif lupusa bağlı saç dökülmesi'],['ulser','Mukozal ülser','yesno','SLE’ye bağlı mukozal ülser'],['hipoc','Düşük kompleman','yesno','Düşük C3/C4/CH50'],['anti','Artmış anti-dsDNA','yesno','Referans üstünde anti-dsDNA'],
  ['protein','Proteinüri >500 mg/24 saat','yesno','Evet seçilirse 24 saatlik proteinüri (mg) girin.'],['tromb','Trombosit <100 × 10⁹/L','yesno','Evet seçilirse trombosit sayısı (×10⁹/L) girin.'],['leuk','Lökosit <3 × 10⁹/L','yesno','Evet seçilirse lökosit sayısı (×10⁹/L) girin.'],
  ['neuro','Nöropsikiyatrik tutulum','yesno','Aktif SLE’ye bağlı nöropsikiyatrik tutulum'],['sistemik','Sistemik vaskülit','yesno','Aktif sistemik vaskülit'],['kardio','Kardiyak/pulmoner tutulum','yesno','SLE’ye bağlı aktif kardiyopulmoner tutulum'],['miyozit','Miyozit','yesno','Aktif inflamatuvar miyozit'],['serozit','Serozit','yesno','Aktif serozit'],['hemoliz','Hemolitik anemi','yesno','Aktif hemolitik anemi']
 ];
 const sledasItems=sleDasData.map(([id,label,type,hint])=>({id,label,hint}));
 // SDI: 41 original sub-items; 3 renal options condensed into one mutually-exclusive selector.
 const SDI=[
  ['Göz',[['katarakt','Katarakt (herhangi bir gözde)',1],['retina','Retinal değişiklik veya optik atrofi',1]]],
  ['Nöropsikiyatrik',[['kognitif','Kalıcı bilişsel bozukluk veya majör psikoz',1],['nobet','≥6 ay tedavi gerektiren nöbet',1],['svo','Serebrovasküler olay veya cerrahi rezeksiyon (≥2 olayda 2 puan)',2],['noro','Kraniyal veya periferik nöropati (optik hariç)',1],['miyelit','Transvers miyelit',1]]],
  ['Böbrek',[['renal','Böbrek hasarının düzeyi (ayrıntılı tek seçim)',3]]],
  ['Akciğer',[['pht','Pulmoner hipertansiyon',1],['fibrozis','Pulmoner fibrozis',1],['shrinking','Shrinking lung',1],['plevra','Plevral fibrozis',1],['infarkt','Pulmoner infarkt veya cerrahi rezeksiyon',1]]],
  ['Kardiyovasküler',[['anjina','Anjina veya koroner bypass',1],['mi','Miyokard infarktüsü (≥2 olayda 2 puan)',2],['kmp','Kardiyomiyopati / ventrikül disfonksiyonu',1],['kapak','Valvüler hastalık',1],['peri','≥6 ay perikardit veya perikardiektomi',1]]],
  ['Periferik damar',[['klodikasyon','≥6 ay klodikasyon',1],['minordoku','Minör doku kaybı',1],['majordoku','Önemli doku kaybı (≥2 bölgede 2 puan)',2],['venoz','Kronik venöz tromboz / staz bulguları',1]]],
  ['Gastrointestinal',[['gisinfarkt','İnfarkt veya barsak/organ rezeksiyonu (≥2 bölgede 2 puan)',2],['mezenter','Mezenter iskemi / yetmezliği',1],['peritonit','Kronik peritonit',1],['striktur','GİS striktürü veya üst GİS cerrahisi',1],['pankreas','Enzim replasmanı gerektiren pankreatik yetmezlik',1]]],
  ['Kas-iskelet',[['atrofi','Kas atrofisi veya kalıcı güçsüzlük',1],['artropati','Deforman veya erozif artrit',1],['osteoporoz','Fraktür veya vertebral çökme ile osteoporoz',1],['avn','Avasküler nekroz (≥2 bölgede 2 puan)',2],['osteomiyelit','Mikrobiyolojik kanıtlı osteomiyelit',1],['tendon','Tendon rüptürü',1]]],
  ['Deri',[['skarlısaç','Skarlı kronik alopesi',1],['skar','Yaygın skar veya pannikülit',1],['deriülser','>6 ay devam eden deri ülseri',1]]],
  ['Gonadal',[['gonadal','Erken gonadal yetmezlik (ölçek özgün tanımı)',1]]],
  ['Endokrin',[['diyabet','Diabetes mellitus',1]]],
  ['Malignite',[['kanser','Malignite (≥2 farklı bölge için 2 puan)',2]]]
 ];
 const sliccItems=SDI.flatMap(g=>g[1].map(x=>({id:x[0],label:x[1],weight:x[2]})));
 const LABELS={yes:'Evet',no:'Hayır'};
 const grades={A:12,B:8,C:1,D:0,E:0};
 function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
 function opts(id,item,arr){let selected=answers[id][item.id];return `<div class="lupus-options" role="group" aria-label="${escape(item.label)}">${arr.map(([v,l])=>`<button type="button" data-lupus-option="${id}" data-field="${item.id}" data-value="${v}" aria-pressed="${selected===v}" class="lupus-pill ${selected===v?'is-on':''}">${escape(l)}</button>`).join('')}</div>`}
 function row(id,item,arr,tag=''){return `<div class="lupus-row" id="field-${item.id}"><div class="lupus-item-head"><b>${escape(item.label)}</b>${tag?`<span class="lupus-weight">${tag}</span>`:''}</div>${item.hint?`<div class="lupus-hint">${escape(item.hint)}</div>`:''}${opts(id,item,arr)}</div>`}
 function group(name,contents,extra=''){return `<section class="lupus-group"><div class="lupus-group-title"><h3>${escape(name)}</h3>${extra?`<span>${extra}</span>`:''}</div>${contents}</section>`}
 function getFields(id){return {sledai:sledaiItems,bilag:bilagItems,sledas:sledasItems,slicc:sliccItems}[id]}
 function state(id){const items=getFields(id),ans=answers[id];let done=items.filter(x=>ans[x.id]!==undefined).length,extra=0,totalExtra=0,error='';if(id==='sledas'){
  const spec=[['artrit','sjc',0,28,'Şiş eklem sayısı'],['protein','prot',500.0000001,1e8,'24 saatlik proteinüri'],['tromb','plt',0.0000001,100,'Trombosit'],['leuk','wbc',0.0000001,3,'Lökosit']];
  for(const [flag,field,min,max,label] of spec){if(ans[flag]==='yes'){totalExtra++;let value=Number(ans[field]);const has=ans[field]!==undefined&&String(ans[field]).trim()!==''; const valid=has&&Number.isFinite(value)&&value>=min&&value<=max&&(flag!=='artrit'||(Number.isInteger(value)&&value>=1))&&(flag!=='tromb'||value<100)&&(flag!=='leuk'||value<3);if(valid)extra++;else if(has)error=`${label}: uygun aralıkta sayı girilmeli.`;}}
  // When arthritis is present, at least one swollen joint is required, despite the 0-28 input range.
 }
 return {done:done+extra,total:items.length+totalExtra,ready:done===items.length&&extra===totalExtra,error};
 }
 function sum(id){const a=answers[id];if(!state(id).ready)return null;
  if(id==='sledai')return sledaiItems.reduce((n,x)=>n+(a[x.id]==='yes'?x.weight:0),0);
  if(id==='bilag')return bilagItems.reduce((n,x)=>n+grades[a[x.id]],0);
  if(id==='slicc')return sliccItems.reduce((n,x)=>n+(x.id==='renal'?({none:0,gfr:1,prot:1,both:2,esrd:3}[a[x.id]]??NaN):Number(a[x.id])),0);
  const on=k=>a[k]==='yes'?1:0;
  const p=on('protein'),t=on('tromb'),l=on('leuk'),ar=on('artrit');
  const val=0.366+3.132*ar+0.454*(ar?Number(a.sjc):0)+4.408*on('mukovask')+3.138*on('lokal')+3.887*on('genel')+0.973*on('alopesi')+2.769*on('ulser')+0.754*on('hipoc')+0.956*on('anti')-17.584*p+(p?3.811*Math.log(Number(a.prot)):0)+26.105*t-(t?5.577*Math.log(Number(a.plt)):0)+6.118*l-(l?5.058*Math.log(Number(a.wbc)):0)+18*on('neuro')+18*on('sistemik')+18*on('kardio')+9*on('miyozit')+6*on('serozit')+9*on('hemoliz');
  return Math.round(val*100)/100;
 }
 function category(id,val){if(id==='sledai')return val===0?'Aktivite saptanmadı (indeks 0)':val<=5?'Hafif aktivite (yaygın kullanılan sınıflama)':val<=10?'Orta aktivite (yaygın kullanılan sınıflama)':val<=19?'Yüksek aktivite (yaygın kullanılan sınıflama)':'Çok yüksek aktivite (yaygın kullanılan sınıflama)';
  if(id==='sledas')return val<=2.08?'Remisyon aralığı (yalnızca indeks)':val<=7.64?'Hafif aktivite aralığı':'Orta/ağır aktivite aralığı';
  if(id==='slicc')return val===0?'Kaydedilen kalıcı hasar yok':'Birikmiş organ hasarı var (≥1)';
  return 'Organ derecelerinin sayısal karşılığı (A=12, B=8, C=1, D/E=0)';
 }
 function references(id){return `<div class="lupus-references"><h3>Kaynaklar ve doğrulama</h3>${sources[id].map(([t,url])=>`<a href="${url}" rel="noopener noreferrer" target="_blank">${escape(t)} ↗</a>`).join('')}</div>`}
 function detail(id){const cfg=info[id];const st=state(id),score=sum(id);let body='';
  if(id==='sledai')body=DESCRIPTORS.map(([g,items])=>group(g,items.map(([key,label,weight,hint])=>row(id,{id:key,label,hint},[['no','Hayır'],['yes','Evet']],`${weight} puan`)).join(''))).join('');
  if(id==='bilag')body=group('BILAG-2004 organ dereceleri',bilagItems.map(x=>row(id,x,['A','B','C','D','E'].map(v=>[v,v]),'A–E')).join(''));
  if(id==='sledas')body=group('Klinik ve laboratuvar bulguları',sledasItems.map(x=>{
   let html=row(id,x,[['no','Hayır'],['yes','Evet']]);if(answers.sledas[x.id]!=='yes')return html;
   const fields={artrit:['sjc','Şiş eklem sayısı (28 eklem)',1,28,1,'Örn. 3'],protein:['prot','24 saatlik proteinüri (mg)',500.01,10000000,1,'Örn. 950'],tromb:['plt','Trombosit (×10⁹/L)',0.001,99.999,0.01,'Örn. 65'],leuk:['wbc','Lökosit (×10⁹/L)',0.001,2.999,0.01,'Örn. 2.1']};const d=fields[x.id];if(!d)return html;const [key,label,min,max,step,placeholder]=d;
   return html+`<div class="lupus-extra"><label for="lupus-n-${key}">${label} <span>zorunlu</span></label><input id="lupus-n-${key}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" placeholder="${placeholder}" data-lupus-number="${key}" value="${escape(answers.sledas[key]??'')}"><small>Yalnızca bu bulgu “Evet” ise sayı gerekir.</small></div>`;
  }).join(''));
  if(id==='slicc')body=SDI.map(([name,items])=>group(name,items.map(([key,label,weight])=>{
   if(key==='renal')return row(id,{id:key,label,hint:'Son dönem böbrek yetmezliği seçilirse GFR ve proteinüri ile ayrıca toplanmaz.'},[['none','Yok'],['gfr','GFR < %50 (1)'],['prot','Proteinüri ≥3,5 g/gün (1)'],['both','Her ikisi (2)'],['esrd','Son dönem (3)']]);
   return row(id,{id:key,label,hint:weight===2?'Tek olay/bölge için 1, birden fazla için 2 puan.':undefined},weight===2?[['0','0'],['1','1'],['2','2']]:[['0','Hayır'],['1','Evet']],weight===2?'0–2 puan':'0–1 puan');
  }).join(''))).join('');
  const interpretation=st.ready?category(id,score):'';
  const note=id==='bilag'?'ÖNEMLİ: Organ dereceleri bu sitede belirlenmez; 97 öğelik özgün algoritmanın yerine geçen bir hesaplayıcı değildir. Girdiğiniz klinisyen derecelerinin toplamı gösterilir.':id==='slicc'?'SLICC/ACR DI aktivite veya tedavi önerisi oluşturmaz. Hasar kalıcıdır; değerlendirme için özgün klinik tanımlar kullanılmalıdır.':id==='sledas'?'SLE-DAS aktivite sınırları esas olarak erişkin SLE çalışmalarından türetilmiştir; yalnızca skora göre çocuk hastaya tedavi kararı verilmemelidir.':'SLEDAI-2K için gösterilen aktivite etiketleri geleneksel tanımlayıcı aralıklardır, özgün skorun zorunlu kategorileri değildir.';
  return `<button type="button" class="breadcrumb-back" data-go="scores/sle">${icon('back')} SLE skorlarına dön</button>
  <div class="lupus-heading"><div><span class="lupus-eyebrow">SİSTEMİK LUPUS ERİTEMATOZUS · ${cfg.label.toLocaleUpperCase('tr')}</span><h1>${cfg.name}</h1><p>${cfg.subtitle}</p></div><span class="lupus-chip">ETKİLEŞİMLİ</span></div>
  <div class="lupus-alert ${id==='bilag'?'lupus-warning':''}">${icon('info')}<span>${cfg.detail}</span></div>
  <div class="lupus-two-col"><div class="lupus-questions"><div class="lupus-topline"><div><b>Değerlendirme formu</b><small>${id==='slicc'?'Kalıcı hasar · özgün 41 öğe':id==='bilag'?'Klinisyen tarafından verilen 9 derece':'Tüm bulguları ayrı ayrı işaretleyin'}</small></div><span class="lupus-counter">${st.done} / ${st.total}</span></div><div class="lupus-progress"><div style="width:${(100*st.done/st.total).toFixed(2)}%"></div></div>
  ${body}</div><aside class="lupus-aside"><div class="lupus-result"><div class="lupus-result-kicker">HESAPLAMA SONUCU</div>${st.ready?`<div class="lupus-big-number" id="lupus-result">${score.toLocaleString('tr-TR',{maximumFractionDigits:2})}<span>${id==='sledai'?'/ 105':id==='slicc'?'/ 47':'puan'}</span></div><div class="lupus-complete">${icon('check')} Tüm zorunlu alanlar tamamlandı</div><p class="lupus-interpretation">${interpretation}</p>${id==='bilag'?`<div class="lupus-grade-summary">${bilagItems.map(x=>`<span>${x.label}: <b>${answers.bilag[x.id]}</b></span>`).join('')}</div>`:''}`:`<div class="lupus-no-score" id="lupus-result">—</div><p class="lupus-locked">${icon('clock')} Eksik veya geçersiz yanıt varken puan hesaplanmaz.</p><p class="lupus-pending">${st.total-st.done} alan kaldı</p>${st.error?`<p class="lupus-field-error">${escape(st.error)}</p>`:''}`}</div>
  <div class="lupus-side-note">${icon('alert')}<p>${note}</p></div><div class="lupus-actions"><button type="button" data-lupus-copy="${id}" ${st.ready?'':'disabled'}>${icon('copy')} Sonucu kopyala</button><button type="button" data-lupus-reset="${id}">${icon('refresh')} Formu sıfırla</button></div>${references(id)}
  <div class="lupus-privacy">${icon('shield')} Girilen bulgular yalnızca bu sekmede tutulur; sunucuya gönderilmez.</div></aside></div>${st.ready?`<button type="button" class="lupus-sticky-result" data-lupus-scroll>Sonuç hazır · ${score.toLocaleString('tr-TR',{maximumFractionDigits:2})} puan ${icon('chevron')}</button>`:''}`;
 }
 function icon(n){return `<svg class="icon" aria-hidden="true"><use href="#i-${n}"></use></svg>`}
 function hub(){return `<div class="lupus-hub"><button type="button" class="breadcrumb-back" data-go="scores">${icon('back')} Tüm skorlara dön</button><div class="lupus-heading"><div><span class="lupus-eyebrow">HASTALIK BAZLI SKORLAR</span><h1>Sistemik lupus eritematozus</h1><p>Aktivite ve kalıcı organ hasarını ayrı araçlarla değerlendirin.</p></div><span class="lupus-chip">6 ARAÇ</span></div><div class="lupus-hub-grid">${['sledai','bilag','sledas','doris','lldas','slicc'].map((id,i)=>`<button type="button" class="lupus-hub-card" data-go="scores/${id}"><div class="lupus-hub-icon">${icon('score')}</div><span class="lupus-hub-type">${info[id]?.label||({doris:'Remisyon hedefi',lldas:'Düşük hastalık aktivitesi'}[id])}</span><h2>${info[id]?.name||({doris:'DORIS 2021',lldas:'LLDAS'}[id])}</h2><p>${info[id]?.subtitle||({doris:'Klinik remisyon · Tedavi hedefi',lldas:'Düşük aktivite · Tedavi hedefi'}[id])}</p><div class="lupus-hub-bottom"><span>${id==='bilag'?'Organ derecelerini gir':'Skor formunu aç'}</span>${icon('arrow')}</div></button>`).join('')}</div><div class="lupus-alert">${icon('info')}<span>BILAG-2004 bu sürümde hekim tarafından önceden belirlenmiş A–E organ derecelerini toplar; 97 bulgudan otomatik organ derecesi üretmez. DORIS ve LLDAS, tamamlanmış SLEDAI-2K formundan yararlanır; tüm ek koşullar tamamlanmadan sonuç üretmez.</span></div></div>`}
 function render(id){return id==='sle'?hub():detail(id)}
 function rerender(id,field,value){const target=document.querySelector('#app');if(!target)return;target.innerHTML=render(id);if(field){const focus=Array.from(target.querySelectorAll('[data-lupus-option]')).find(x=>x.dataset.field===field&&x.dataset.value===value);focus?.focus({preventScroll:true});}}
 function clearDependent(id,field,value){if(id!=='sledas')return;const map={artrit:'sjc',protein:'prot',tromb:'plt',leuk:'wbc'};if(map[field]&&value==='no')delete answers.sledas[map[field]]}
 document.addEventListener('click',e=>{
  const option=e.target.closest('[data-lupus-option]');if(option){const {lupusOption:id,field,value}=option.dataset;answers[id][field]=value;clearDependent(id,field,value);rerender(id,field,value);return;}
  const reset=e.target.closest('[data-lupus-reset]');if(reset){const id=reset.dataset.lupusReset;answers[id]={};rerender(id);document.querySelector('.lupus-heading')?.scrollIntoView({block:'start'});return;}
  const copy=e.target.closest('[data-lupus-copy]');if(copy){const id=copy.dataset.lupusCopy;if(!state(id).ready)return;const message=`${info[id].name}: ${sum(id)}${id==='bilag'?' (organ dereceleri klinisyen tarafından girilmiştir)':''}`;navigator.clipboard?.writeText(message).then(()=>{if(typeof showToast==='function')showToast('Sonuç kopyalandı.')}).catch(()=>{if(typeof showToast==='function')showToast('Kopyalama izni verilmedi.')});return;}
  if(e.target.closest('[data-lupus-scroll]'))document.querySelector('.lupus-result')?.scrollIntoView({behavior:'smooth',block:'center'});
 });
 document.addEventListener('change',e=>{
  const el=e.target.closest('[data-lupus-number]');if(!el)return;
  const key=el.dataset.lupusNumber;
  answers.sledas[key]=el.value;
  const id='sledas';const scroll=window.scrollY;
  document.querySelector('#app').innerHTML=render(id);
  window.scrollTo(0,scroll);
  document.querySelector(`#lupus-n-${key}`)?.focus({preventScroll:true});
 });
 return {render,state,sum,answers,items:{sledai:sledaiItems,bilag:bilagItems,sledas:sledasItems,slicc:sliccItems}};
})();
