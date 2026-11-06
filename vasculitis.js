'use strict';
/* PedRheum Atlas v0.9 vasculitis calculators; state only in page memory.
 * ITAS2010: Misra 2013, 44 scored clinical items.
 * BVASv3: 56 manifestations with official per-organ caps and persistent/new mode.
 * PVAS: complete 64-item pediatric checklist; clinician-entered organ points (no unverified weighting).
 * Kobayashi: 7-input 0-11 IVIG non-response risk score.
 */
const VasculitisTools = (()=>{
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ico=n=>typeof svg==='function'?svg(n):'';
 const link=(u,t)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${t} ↗</a>`;
 const sourceLinks={
  itas:[['https://pubmed.ncbi.nlm.nih.gov/23594468/','Misra ve ark., ITAS2010 geliştirme ve validasyon'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC10985707/','Takayasu kılavuzu, ITAS2010 Tablo 3']],
  bvas:[['https://www.unn.no/documents/kvalitetsregistre/norsk%20vaskulittregister%20og%20biobank/bvasv3_scoring.pdf','BVAS v3: özgün ağırlıklı puanlama formu'],['https://pubmed.ncbi.nlm.nih.gov/19035451/','BVAS v3 validasyon yayını']],
  pvas:[['https://vaskulit.hacettepe.edu.tr/belge/pvas121119.pdf','Hacettepe: Türkçe PVAS formu ve açıklama'],['https://ard.bmj.com/content/72/10/1628','Dolezalova ve ark., PVAS validasyonu'],['https://canvasc.ca/wp-content/uploads/2021/10/PVAS.pdf','PVAS özgün madde formu']],
  kobayashi:[['https://www.jstage.jst.go.jp/article/circj/84/8/84_CJ-19-1094/_html/-char/en','JCS/JSCS 2020 Kawasaki kılavuzu, Tablo 4'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC11790979/','Japonya dışındaki topluluklarda performans']]
 };
 const sources=id=>`<div class="vas-sources"><strong>Bilimsel referanslar</strong>${sourceLinks[id].map(([u,t])=>link(u,t)).join('')}<p>Bu klinik hesaplayıcılar prototiptir. Ölçek tanımları, uygulama eğitimi ve kullanım izinleri klinik uygulamadan önce doğrulanmalıdır.</p></div>`;
 const G=(key,name,items,maxP=0,maxN=0)=>({key,name,maxP,maxN,items:items.map((r,i)=>({id:key+'_'+i, name:r[0],p:r[1]||0,n:r[2]||0,extra:r[3]||''}))});
 const BVAS=[
  G('general','1 · Genel durum', [['Miyalji',1,1],['Artralji veya artrit',1,1],['Ateş ≥38 °C',2,2],['Kilo kaybı ≥2 kg',2,2]],2,3),
  G('skin','2 · Kutanöz',[['Enfarkt / splinter hemoraji',1,2],['Purpura',1,2],['Deri ülseri',1,4],['Gangren',2,6],['Diğer deri vasküliti',1,2]],3,6),
  G('eye','3 · Mukoza ve göz',[['Oral ülser / granülom',1,2],['Genital ülser',1,1],['Adneksiyal inflamasyon',2,4],['Belirgin proptozis',2,4],['Sklerit / episklerit',1,2],['Konjonktivit / blefarit / keratit',1,1],['Görme bulanıklığı',2,3],['Ani görme kaybı',0,6,'Persistan olarak puanlanmaz'],['Üveit',2,6],['Retinal vaskülit / eksüda / hemoraji / tromboz',2,6]],3,6),
  G('ent','4 · Kulak-burun-boğaz',[['Kanlı burun akıntısı / krut / ülser / granülom',2,4],['Paranazal sinüs tutulumu',1,2],['Subglottik stenoz',3,6],['İleti tipi işitme kaybı',1,3],['Sensörinöral işitme kaybı',2,6]],3,6),
  G('chest','5 · Solunum',[['Hışıltı / wheeze',1,2],['Nodül veya kavite',0,3,'Persistan olarak puanlanmaz'],['Plevral efüzyon / plörit',2,4],['İnfiltrasyon',2,4],['Endobronşiyal tutulum',2,4],['Masif hemoptizi / alveoler hemoraji',4,6],['Solunum yetmezliği',4,6]],3,6),
  G('cv','6 · Kardiyovasküler',[['Nabız kaybı',1,4],['Kapak hastalığı',2,4],['Perikardit',1,3],['İskemik kardiyak ağrı',2,4],['Kardiyomiyopati',3,6],['Konjestif kalp yetmezliği',3,6]],3,6),
  G('abd','7 · Gastrointestinal',[['Peritonit / peritonizm',3,9],['Kanlı ishal',3,9],['İskemik karın ağrısı',2,6]],4,9),
  G('renal','8 · Renal',[['Hipertansiyon',1,4],['Proteinüri',2,4],['Hematüri',3,6],['Kreatinin 125–249 µmol/L',0,4,'Yalnız ilk değerlendirmede'],['Kreatinin 250–499 µmol/L',0,6,'Yalnız ilk değerlendirmede'],['Kreatinin ≥500 µmol/L',0,8,'Yalnız ilk değerlendirmede'],['Kreatinin artışı >%30 veya klirens düşüşü >%25',0,6,'Persistan olarak puanlanmaz']],6,12),
  G('neuro','9 · Nörolojik',[['Baş ağrısı',1,1],['Menenjit',1,3],['Organik konfüzyon',1,3],['Nöbet (hipertansiyona bağlı olmayan)',3,9],['İnme / serebrovasküler olay',3,9],['Omurilik lezyonu',3,9],['Kraniyal sinir felci',3,6],['Duyusal periferik nöropati',3,6],['Mononöritis multipleks',3,9]],6,9)
 ];
 // PVAS 64 items, in the exact 9 clinical categories from the pediatric form.
 // Per-item weightings of the additional pediatric entries cannot be independently
 // established from an accessible primary scoring key. Their presence is recorded,
 // but PVAS organ scores MUST be assigned/confirmed from a validated scoring key.
 const PVAS=[
  G('general','1 · Genel durum',[['Miyalji'],['Artralji / artrit'],['Ateş ≥38 °C'],['Kilo kaybı ≥%5'] ],2,3),
  G('skin','2 · Kutanöz',[['Polimorf döküntü'],['Livedo'],['Pannikülit'],['Purpura'],['Cilt nodülleri'],['Enfarkt (tırnak kenarı / splinter kanama)'],['Ülser (tam kat nekroz)'],['Gangren'],['Diğer deri vasküliti']],3,6),
  G('eye','3 · Mukoza ve göz',[['Oral ülser / granülom'],['Genital ülser'],['Adneksiyal inflamasyon'],['Önemli proptozis'],['Episklerit / sklerit'],['Konjonktivit / blefarit / keratit'],['Üveit'],['Görme bulanıklığı'],['Ani görme kaybı'],['Retinal vaskülit / eksüda / hemoraji / tromboz']],3,6),
  G('ent','4 · Kulak-burun-boğaz',[['Nazal akıntı / ülser / granülom'],['Paranazal sinüs tutulumu'],['Subglottik stenoz / stridor / ses kısıklığı'],['İleti tipi işitme kaybı'],['Sensörinöral işitme kaybı']],3,6),
  G('chest','5 · Solunum',[['Hışıltı veya ekspiratuvar dispne'],['Endobronşiyal / endotrakeal tutulum'],['Nodül / kavite'],['Plevral efüzyon / plörezi'],['İnfiltrasyon'],['Masif hemoptizi / alveoler kanama'],['Solunum yetmezliği']],3,6),
  G('cv','6 · Kardiyovasküler',[['Nabız kaybı'],['Ulaşılabilen arterlerde üfürüm'],['Kan basıncı farklılığı'],['Ekstremitelerde klaudikasyo'],['İskemik kalp ağrısı'],['Kardiyomiyopati'],['Konjestif kalp yetmezliği'],['Kalp kapak hastalığı'],['Perikardit']],3,6),
  G('abd','7 · Gastrointestinal',[['Karın ağrısı'],['Peritonit'],['Dışkıda kan / kanlı ishal'],['Barsak iskemisi']],4,9),
  G('renal','8 · Renal',[['Hipertansiyon (boya göre >95. persentil)'],['Proteinüri (>0,3 g/24 saat veya >20 mg/mmol kreatinin)'],['Hematüri (≥2+ veya ≥5 eritrosit/hpf ya da eritrosit silendiri)'],['GFR 50–80 ml/dk/1,73 m²'],['GFR 15–49 ml/dk/1,73 m²'],['GFR <15 ml/dk/1,73 m²'],['Kreatininde >%10 artış veya GFR’de >%25 azalma']],6,12),
  G('neuro','9 · Nörolojik',[['Baş ağrısı'],['Menenjit / ensefalit'],['Organik konfüzyon / bilişsel disfonksiyon'],['Nöbet (hipertansiyona bağlı olmayan)'],['İnme'],['Kord lezyonu'],['Kraniyal sinir felci'],['Periferik duyusal nöropati'],['Motor mononöritis multipleks']],6,9)
 ];
 const ITAS=[
  G('sys','1 · Sistemik',[['Halsizlik / >2 kg kilo kaybı',0,1],['Miyalji / artralji / artrit',0,1],['Baş ağrısı',0,1]]),
  G('abd','2 · Abdominal',[['Şiddetli karın ağrısı',0,1]]),
  G('gu','3 · Genitoüriner',[['Düşük (abortus)',0,1]]),
  G('kid','4 · Renal',[['Diyastolik hipertansiyon (>90 mmHg)',0,2],['Sistolik hipertansiyon (>140 mmHg)',0,1]]),
  G('neuro','5 · Nörolojik',[['İnme',0,2],['Hipertansif olmayan nöbet',0,1],['Senkop',0,1],['Vertigo / baş dönmesi',0,1]]),
  G('cv','6 · Kardiyovasküler',[['Yeni damar üfürümü (genel)',0,2],['Sağ karotis üfürümü',0,1],['Sol karotis üfürümü',0,1],['Sağ subklavyen üfürümü',0,1],['Sol subklavyen üfürümü',0,1],['Sağ renal arter üfürümü',0,1],['Sol renal arter üfürümü',0,1],['Nabız asimetrisi',0,2],['Kan basıncı asimetrisi',0,1],['Yeni nabız kaybı (genel)',0,2],['Sağ karotis nabız kaybı',0,1],['Sol karotis nabız kaybı',0,1],['Sağ subklavyen nabız kaybı',0,1],['Sol subklavyen nabız kaybı',0,1],['Sağ brakiyal nabız kaybı',0,1],['Sol brakiyal nabız kaybı',0,1],['Sağ radiyal nabız kaybı',0,1],['Sol radiyal nabız kaybı',0,1],['Sağ femoral nabız kaybı',0,1],['Sol femoral nabız kaybı',0,1],['Sağ popliteal nabız kaybı',0,1],['Sol popliteal nabız kaybı',0,1],['Sağ posterior tibial nabız kaybı',0,1],['Sol posterior tibial nabız kaybı',0,1],['Sağ dorsalis pedis nabız kaybı',0,1],['Sol dorsalis pedis nabız kaybı',0,1],['Klaudikasyo (genel)',0,2],['Kol klaudikasyosu',0,1],['Bacak klaudikasyosu',0,1],['Karotidodini',0,2],['Aort kapak yetersizliği',0,1],['Miyokard enfarktüsü / anjina',0,1],['Kardiyomiyopati / kalp yetmezliği',0,1]])
 ];
 const KOB=[
  {id:'sodium',title:'Serum sodyum (Na)',unit:'mmol/L',points:2,threshold:'≤133',test:v=>v<=133,min:90,max:170,step:0.1},
  {id:'day',title:'İlk IVIG başlanılan hastalık günü',unit:'gün',points:2,threshold:'≤4. gün',test:v=>v<=4,min:1,max:90,step:1},
  {id:'ast',title:'AST',unit:'U/L',points:2,threshold:'≥100',test:v=>v>=100,min:0,max:100000,step:1},
  {id:'neutrophil',title:'Nötrofil oranı',unit:'%',points:2,threshold:'≥%80',test:v=>v>=80,min:0,max:100,step:0.1},
  {id:'crp',title:'CRP',unit:'mg/dL',points:1,threshold:'≥10 mg/dL (100 mg/L)',test:v=>v>=10,min:0,max:3000,step:0.01},
  {id:'platelet',title:'Trombosit',unit:'×10³/µL',points:1,threshold:'≤300',test:v=>v<=300,min:0,max:3000,step:1},
  {id:'age',title:'Yaş',unit:'ay',points:1,threshold:'≤12 ay',test:v=>v<=12,min:0,max:240,step:1}
 ];
 const state={itas:{},bvas:{},pvas:{},pvasScores:{},kob:{},mode:{bvas:'new',pvas:'new'},group:{itas:'sys',bvas:'general',pvas:'general'},crpUnit:'mgdL',first:true};
 const count=(groups,data)=>groups.flatMap(g=>g.items).filter(i=>data[i.id]!==undefined).length;
 const itemsCount=groups=>groups.reduce((s,g)=>s+g.items.length,0);
 function calcITAS(){
  if(count(ITAS,state.itas)!==44)return null;
  // A positive artery-site entry must be consistent with the corresponding umbrella manifestation.
  for(const [parent,children] of [[0,[1,2,3,4,5,6]],[9,Array.from({length:16},(_,k)=>10+k)],[26,[27,28]]]){
   const positive=children.some(k=>state.itas['cv_'+k]==='yes');
   if(positive !== (state.itas['cv_'+parent]==='yes'))return null;
  }
  return ITAS.flatMap(g=>g.items).reduce((s,i)=>s+(state.itas[i.id]==='yes'?i.n:0),0);
 }
 function calcBVAS(){if(count(BVAS,state.bvas)!==56)return null;
  const mode=state.mode.bvas;
  const yes=k=>state.bvas['renal_'+k]==='yes';
  // The creatinine bands are mutually exclusive, and initial-visit only.
  if([3,4,5].filter(yes).length>1)return null;
  if(mode==='persistent' && BVAS.some(g=>g.items.some(i=>state.bvas[i.id]==='yes'&&i.p===0)))return null;

  const vals={};let total=0;
  for(const g of BVAS){const cap=mode==='new'?g.maxN:g.maxP;
   const subtotal=g.items.reduce((s,i)=>s+(state.bvas[i.id]==='yes'?(mode==='new'?i.n:i.p):0),0);
   vals[g.key]=Math.min(cap,subtotal);total+=vals[g.key];
  }
  return {total,vals,mode};
 }
 function calcPVAS(){if(count(PVAS,state.pvas)!==64)return null;const mode=state.mode.pvas;const values={};let s=0;
  for(const g of PVAS){const raw=state.pvasScores[g.key];const cap=mode==='new'?g.maxN:g.maxP;
   if(!Number.isInteger(raw)||raw<0||raw>cap)return null;
   const hasYes=g.items.some(i=>state.pvas[i.id]==='yes');
   if(!hasYes&&raw!==0)return null;
   if(hasYes&&raw===0)return null;
   values[g.key]=raw;s+=raw;
  }
  return {total:s,vals:values,mode};
 }
 function kobNum(field){const raw=state.kob[field.id];if(raw===undefined||raw==='')return null;const v=Number(raw);if(!Number.isFinite(v)||v<field.min||v>field.max||(field.step===1&&!Number.isInteger(v)))return null;return v;}
 function calcKob(){if(KOB.some(f=>kobNum(f)===null))return null;return KOB.reduce((s,f)=>s+(f.test(kobNum(f))?f.points:0),0);}
 const progress=(n,total)=>`<div class="vas-progress"><span>Doldurulan alanlar</span><strong>${n} / ${total}</strong></div><div class="vas-track" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="${total}"><span style="width:${100*n/total}%"></span></div>`;
 const note=html=>`<div class="vas-notice">${ico('info')}<div>${html}</div></div>`;
 const heading=(title,sub,type)=>`<button type="button" class="breadcrumb-back" data-go="scores/vasculitis">${ico('back')} Vaskülit merkezine dön</button>${cardsTitle(title,sub,type)}`;
 const mini=(short,name,desc,id)=>`<button type="button" class="vas-hub-card" data-go="scores/${id}"><span class="vas-mini">${short}</span><h3>${name}</h3><p>${desc}</p><strong>Hesaplayıcıyı aç ${ico('arrow')}</strong></button>`;
 function hub(){return `${cardsTitle('Vaskülit skor merkezi','Takayasu arteriti, genel sistemik vaskülit ve Kawasaki hastalığı için aktivite ve risk değerlendirmeleri.','VASKÜLİT · V0.9')}
 <section class="vas-hero"><span class="vas-eyebrow">PEDRHEUM · VASKÜLİT</span><h2>Her hastalığa uygun değerlendirme.</h2><p>Mobilde bir organ sistemini açın, bulguları işaretleyin, tamamlanmamış formlarda sonuç kilitli kalsın.</p><div class="vas-small-pills"><span>Takayasu</span><span>PVAS</span><span>BVAS v3</span><span>Kawasaki</span></div></section>
 <div class="vas-hub-grid">${mini('ITAS','ITAS2010 · Takayasu','44 bulgu · 7 ağırlıklı gösterge · 0–51 klinik aktivite','itas')}${mini('PVAS','PVAS · Pediatrik vaskülit','64 madde · 9 sistem · doğrulanmış organ puanlarıyla 0–63','pvas')}${mini('BVAS','BVAS v3 · Genel vaskülit','56 bulgu · 9 sistem · yeni/kötüleşen veya persistan 0–63','bvas')}${mini('KD','Kobayashi · Kawasaki','7 tedavi öncesi veri · IVIG yanıtsızlığı için 0–11','kobayashi')}</div>
 ${note('<b>Önemli:</b> ITAS2010, çocukluk çağı Takayasu vaskülitinde özel olarak valide edilmemiştir. PVAS, çocukluk çağı sistemik vaskülitlerinde geliştirildi. Kobayashi’nin Japonya dışındaki performansı değişken olabilir.')} ${sources('pvas')}`;}
 function switcher(groups,id){return `<div class="vas-tabs" role="tablist" aria-label="Organ sistemi">${groups.map(g=>{const done=g.items.filter(i=>state[id][i.id]!==undefined).length;return `<button role="tab" aria-selected="${state.group[id]===g.key}" class="${state.group[id]===g.key?'current':''}" data-vas-group="${g.key}" data-vas-kind="${id}"><span>${g.name.replace(/^\d+ · /,'')}</span><small>${done}/${g.items.length}</small></button>`;}).join('')}</div>`;}
 function fillGroup(id,g){return `<button type="button" class="vas-absence" data-vas-none="${id}" data-vas-section="${g.key}">${ico('check')} Bu sistemde aktif bulgu yok: hepsini “Yok” işaretle</button>`;}
 function ynRows(id,g){return g.items.map(i=>`<div class="vas-question"><div class="vas-question-head"><strong>${esc(i.name)}</strong>${id==='itas'?`<small>+${i.n}</small>`:''}</div>${i.extra?`<p>${esc(i.extra)}</p>`:''}<div class="vas-btn-row">${[['no','Yok'],['yes','Var']].map(([v,label])=>`<button type="button" data-vas-answer="${v}" data-vas-kind="${id}" data-vas-item="${i.id}" class="${state[id][i.id]===v?'selected':''}" aria-pressed="${state[id][i.id]===v}">${label}</button>`).join('')}</div></div>`).join('');}
 function resultCard(n,total,score,max,unit,copyText,interpret,details=''){return `<aside class="vas-result"><span class="vas-result-top">SONUÇ</span>${score===null?`<div class="vas-locked">—</div><p><b>Sonuç kilitli.</b> Tüm gerekli alanlar tamamlanmadan hesaplama yapılmaz.</p><small>${total-n} yanıt / onay eksik olabilir.</small>`:`<strong class="vas-score" data-vas-score="${unit}">${score}<span> / ${max}</span></strong><p>${interpret}</p>${details}<button class="vas-copy" data-vas-copy="${unit}" type="button">${ico('copy')} Sonucu kopyala</button>`}</aside>`;}
 function generic(id){const itas=id==='itas',pvas=id==='pvas',gs=itas?ITAS:pvas?PVAS:BVAS,s=state[id],group=gs.find(g=>g.key===state.group[id])||gs[0],n=count(gs,s),total=itemsCount(gs),result=itas?calcITAS():pvas?calcPVAS():calcBVAS(),score=result===null?null:itas?result:result.total,cap=itas?51:63,mode=state.mode[id];
 const title=itas?'ITAS2010 · Takayasu':pvas?'PVAS · Pediatrik Vaskülit Aktivite Skoru':'BVAS v3 · Birmingham Vaskülit Aktivite Skoru';
 const sub=itas?'44 maddelik klinik form · Son 3 ayda yeni veya kötüleşen bulgular':pvas?'64 maddelik pediatrik organ formu · 9 sistem · Klinik puan onayı':'56 maddelik aktivite formu · Yeni/kötüleşen veya persistan bulgular';
 const special=pvas?note('<b>PVAS puanlama güvenliği:</b> 64 maddenin tamamı işaretlenir; pediatrik ek maddelerin özgün ağırlıklarına dair yeterli açık puanlama anahtarı bulunmadığından <b>organ puanını hekim, özgün PVAS anahtarına göre onaylar.</b> Yalnızca işaretlerden otomatik ve doğrulanmamış puan üretmiyoruz.'):itas?note('ITAS2010 toplamı 44 bulgudan hesaplanır. Damar üfürümü, nabız kaybı, klaudikasyo için <b>genel bulgu ve anatomik bölge maddeleri ayrı</b> puanlanır. Son 3 ayda yeni/kötüleşen ve vaskülite atfedilebilen bulguları işaretleyin. Görüntüleme bulguları indekse dahil değildir.'):note('BVAS v3: Bulgular vaskülite bağlı olmalı. Bu sürüm 56 standart maddeyi kapsar; özgün formdaki serbest “diğer bulgu” alanı ek puana çevrilmez. <b>Yeni/kötüleşen</b> modunda son 4 haftada gelişen/kötüleşen herhangi bir bulgu varsa tüm bulgular ilgili sütunun ağırlıklarıyla puanlanır. <b>Persistan</b> modu yalnızca bütün bulgular persistan ise kullanılır. Her organın üst sınırı uygulanır.');
 const modeBox=itas?'':`<div class="vas-mode"><strong>Hastalık paterni</strong><div class="vas-btn-row">${[['new','Yeni / kötüleşen'],['persistent','Tümü persistan']].map(([v,l])=>`<button class="${mode===v?'selected':''}" type="button" data-vas-mode="${v}" data-vas-kind="${id}">${l}</button>`).join('')}</div><small>İlk değerlendirmede bütün aktif bulgular yeni/kötüleşen olarak kabul edilir.</small></div>`;
 const subtotal=(pvas?`<div class="vas-organ-confirm"><label for="vas-organ-score-${group.key}">Bu organın doğrulanmış PVAS puanı · ${mode==='new'?'Yeni/kötüleşen':'Persistan'} (0–${mode==='new'?group.maxN:group.maxP})</label><select id="vas-organ-score-${group.key}" data-vas-pvas-score="${group.key}"><option value="">Puanı seçin…</option>${Array.from({length:(mode==='new'?group.maxN:group.maxP)+1},(_,i)=>`<option value="${i}" ${state.pvasScores[group.key]===i?'selected':''}>${i} puan</option>`).join('')}</select><small>Aktif bulgu olmayan sistemlerde puan 0 olmalıdır. Bulgusu olan sistem 0 puan alamaz.</small></div>`:'');
 const extra=itas?`<div class="vas-formula">7 madde ×2, diğer 37 madde ×1. Maksimum 51. Damar genel bulgusu ve anatomik lokalizasyon tutarlı seçilmelidir.</div>`:pvas?`<div class="vas-formula">9 organ puanı, yeni/kötüleşen maksimum 63; tümü persistan maksimum 33.</div>`:`<div class="vas-formula">9 organ üst sınırı uygulanır. Yeni/kötüleşen 0–63; persistan 0–33. Persistan olarak puanlanamayan bulgular ve aynı anda birden fazla kreatinin bandı seçilirse sonuç kilitlenir.</div>`;
 const interpret=itas?(score>=2?'ITAS2010 ≥2: klinik aktivite lehine eşik karşılanıyor.':'ITAS2010 <2: klinik aktivite eşiğinin altında.'):`${mode==='new'?'Yeni/kötüleşen':'Tümü persistan'} dönem için toplam aktivite puanı. Sayısal değer tek başına tedavi kararı değildir.`;
 const error=n===total&&score===null?note(pvas?'64 madde tamamlandı ancak her organ için doğrulanmış puan seçilmeli; bulgu varsa puan sıfır olamaz.':itas?'Anatomik damar bulguları ile bunların genel başlıkları tutarsız işaretlenmiş. Üfürüm, nabız kaybı ve klaudikasyo genel/yerleşim seçimini yeniden kontrol edin.':'Persistan olarak puanlanamayan aktif bir bulgu veya birden fazla kreatinin bandı işaretlenmiş; formu gözden geçirin.'):'';
 return `${heading(title,sub,itas?'TAKAYASU':pvas?'PEDİATRİK':'GENEL VASKÜLİT')}${special}${error}${modeBox}${progress(n,total)}<div class="vas-layout"><section class="vas-main"><h2>Organ sistemi seçin</h2>${switcher(gs,id)}<div class="vas-section"><div class="vas-section-head"><h3>${group.name}</h3><span>${group.items.filter(i=>s[i.id]!==undefined).length} / ${group.items.length}</span></div>${fillGroup(id,group)}${ynRows(id,group)}${subtotal}</div><div class="vas-foot-actions"><button type="button" data-vas-reset="${id}">${ico('refresh')} Formu sıfırla</button>${gs.findIndex(g=>g.key===group.key)<gs.length-1?`<button type="button" data-vas-next="${id}">Sonraki sisteme geç ${ico('arrow')}</button>`:''}</div></section><aside class="vas-right">${resultCard(n,total,score,cap,id,'',interpret,score===null?'':extra)}${pvas?`<div class="vas-confirm-progress"><b>Onaylanan organ puanı:</b> ${gs.filter(g=>Number.isInteger(state.pvasScores[g.key])).length} / 9</div>`:''}${sources(id)}</aside></div>`;
 }
 function kob(){const n=KOB.filter(f=>kobNum(f)!==null).length,v=calcKob();const scoreMsg=v===null?'':v>=5?'Yüksek risk · Japon kılavuzuna göre ≥5':v===4?'4 puan · Orijinal bazı çalışmalarda risk eşiği; 2020 JCS tablosunda yüksek risk ≥5':'0–3 puan · 2020 JCS eşiğine göre düşük risk';
 return `${heading('Kobayashi · Kawasaki IVIG yanıtsızlık riski','İlk intravenöz immünglobulin tedavisi öncesinde 7 değişken · 0–11 puan','KAWASAKİ')}
 ${note('Kobayashi skoru <b>IVIG yanıtsızlığını öngörmek</b> için Japonya’da geliştirilmiştir, tanı ölçütü değildir. 2020 Japon kılavuz tablosunda ≥5 yüksek risk; bazı özgün/diğer yayınlarda ≥4 kullanılmıştır. Japonya dışı ve pediatrik alt gruplarda performansı değişebilir.')}${progress(n,7)}
 <div class="vas-layout"><section class="vas-main"><div class="vas-kob-head"><h2>Tedavi öncesi laboratuvar ve klinik veriler</h2><p>CRP birimini seçebilirsiniz. Eksik alanlar otomatik sıfır kabul edilmez.</p></div><div class="vas-unit"><span>CRP birimi</span><button class="${state.crpUnit==='mgdL'?'selected':''}" data-vas-unit="mgdL">mg/dL</button><button class="${state.crpUnit==='mgL'?'selected':''}" data-vas-unit="mgL">mg/L</button></div>
 ${KOB.map(f=>{const val=state.kob[f.id]??'';const given=kobNum(f),points=given===null?null:f.test(given)?f.points:0;return `<div class="vas-kob-row"><div class="vas-kob-label"><strong>${f.title}</strong><small>Eşik: ${f.threshold}</small></div><div class="vas-kob-entry"><input aria-label="${f.title}" inputmode="decimal" type="number" data-vas-kob="${f.id}" min="${f.min}" max="${f.id==='crp'&&state.crpUnit==='mgL'?30000:f.max}" step="${f.step}" value="${f.id==='crp'&&state.crpUnit==='mgL'&&val!==''?Number(val)*10:val}" placeholder="Değer"><span>${f.id==='crp'&&state.crpUnit==='mgL'?'mg/L':f.unit}</span></div><div class="vas-kob-points ${points===null?'pending':points>0?'positive':'zero'}">${points===null?'—':`+${points}`} <small>/ ${f.points}</small></div></div>`;}).join('')}
 <div class="vas-foot-actions"><button data-vas-reset="kobayashi" type="button">${ico('refresh')} Formu sıfırla</button></div></section><aside class="vas-right">${resultCard(n,7,v,11,'kobayashi','',scoreMsg,v===null?'':`<p class="vas-subnote">Yüksek risk sonucu, otomatik steroid veya biyolojik tedavi endikasyonu anlamına gelmez. Klinik bulgular ve ekokardiyografi ile birlikte değerlendirilmelidir.</p>`)}${sources('kobayashi')}</aside></div>`;}
 function render(id){if(id==='vasculitis')return hub();if(id==='kobayashi')return kob();if(['itas','pvas','bvas'].includes(id))return generic(id);return hub();}
 function update(preserve){if(typeof currentRoute!=='function')return;const id=currentRoute().split('/')[1];if(!['vasculitis','kobayashi','itas','bvas','pvas'].includes(id))return;
  const y=window.scrollY;document.querySelector('#app').innerHTML=render(id);window.scrollTo({top:y,behavior:'instant'});
  if(preserve){const el=document.querySelector(preserve);if(el)el.focus({preventScroll:true});}
 }
 function onClick(e){const target=(selector)=>e.target.closest(selector);
  const group=target('[data-vas-group]');if(group){state.group[group.dataset.vasKind]=group.dataset.vasGroup;update();return true;}
  const answer=target('[data-vas-answer]');if(answer){state[answer.dataset.vasKind][answer.dataset.vasItem]=answer.dataset.vasAnswer;update(`[data-vas-answer="${answer.dataset.vasAnswer}"][data-vas-item="${answer.dataset.vasItem}"]`);return true;}
  const absent=target('[data-vas-none]');if(absent){const id=absent.dataset.vasNone;const gs=id==='itas'?ITAS:id==='bvas'?BVAS:PVAS;const g=gs.find(g=>g.key===absent.dataset.vasSection);g.items.forEach(i=>state[id][i.id]='no');if(id==='pvas')state.pvasScores[g.key]=0;update();return true;}
  const mode=target('[data-vas-mode]');if(mode){state.mode[mode.dataset.vasKind]=mode.dataset.vasMode;if(mode.dataset.vasKind==='pvas')state.pvasScores={};update();return true;}
  const next=target('[data-vas-next]');if(next){const id=next.dataset.vasNext;const gs=id==='itas'?ITAS:id==='pvas'?PVAS:BVAS;const i=gs.findIndex(g=>g.key===state.group[id]);state.group[id]=gs[Math.min(i+1,gs.length-1)].key;update();return true;}
  const unit=target('[data-vas-unit]');if(unit){state.crpUnit=unit.dataset.vasUnit;update();return true;}
  const reset=target('[data-vas-reset]');if(reset){const id=reset.dataset.vasReset;if(id==='kobayashi')state.kob={};else{state[id]={};if(id==='pvas')state.pvasScores={};state.group[id]=id==='itas'?'sys':'general';}update();return true;}
  const copy=target('[data-vas-copy]');if(copy){const id=copy.dataset.vasCopy;const result=id==='kobayashi'?calcKob():id==='itas'?calcITAS():id==='pvas'?calcPVAS():calcBVAS();if(result===null)return true;const score=typeof result==='number'?result:result.total;const msg=`${{itas:'ITAS2010',bvas:'BVAS v3',pvas:'PVAS',kobayashi:'Kobayashi'}[id]}: ${score}/${id==='kobayashi'?11:id==='itas'?51:63}${id==='bvas'||id==='pvas'?' ('+state.mode[id]+')':''}`;navigator.clipboard?.writeText(msg).then(()=>showToast('Sonuç panoya kopyalandı.')).catch(()=>showToast('Pano izni verilemedi.'));return true;}
  return false;
 }
 function onInput(e){const el=e.target;
  if(el?.hasAttribute('data-vas-kob')){const raw=el.value;const id=el.dataset.vasKob;state.kob[id]=raw===''?'':(id==='crp'&&state.crpUnit==='mgL'?String(Number(raw)/10):raw); // update the result only on change / blur to preserve keyboard
   update(`[data-vas-kob="${id}"]`);return true;}
  if(el?.hasAttribute('data-vas-pvas-score')){state.pvasScores[el.dataset.vasPvasScore]=el.value===''?undefined:Number(el.value);update();return true;}
  return false;
 }
 return {render,onClick,onInput,BVAS,PVAS,ITAS,KOB,state,calcITAS,calcBVAS,calcPVAS,calcKob,itemsCount};
})();
