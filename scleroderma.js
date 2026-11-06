'use strict';
/* Scleroderma tools v0.7. Pure calculation functions and in-memory UI state.
 * LoSCAT: Kelsey/Torok 2013 (18 anatomical areas, 3 activity and 3 damage items).
 * J4S: domains are clinician-assigned 0–4 grades, not automated criteria.
 */
const SclerodermaTools=(()=>{
  const REGIONS=[
    {key:'head',name:'Baş / yüz',group:'Merkez',view:'front',x:104,y:30},
    {key:'neck',name:'Boyun',group:'Merkez',view:'front',x:104,y:57},
    {key:'chest',name:'Göğüs',group:'Merkez',view:'front',x:104,y:91},
    {key:'abdomen',name:'Karın',group:'Merkez',view:'front',x:104,y:135},
    {key:'upper_back',name:'Üst sırt',group:'Sırt',view:'back',x:104,y:88},
    {key:'lower_back',name:'Alt sırt',group:'Sırt',view:'back',x:104,y:138},
    {key:'arm_r',name:'Sağ üst kol',group:'Sağ kol ve el',view:'front',x:55,y:106},
    {key:'forearm_r',name:'Sağ önkol',group:'Sağ kol ve el',view:'front',x:38,y:157},
    {key:'hand_r',name:'Sağ el / parmaklar',group:'Sağ kol ve el',view:'front',x:25,y:199},
    {key:'arm_l',name:'Sol üst kol',group:'Sol kol ve el',view:'front',x:153,y:106},
    {key:'forearm_l',name:'Sol önkol',group:'Sol kol ve el',view:'front',x:171,y:157},
    {key:'hand_l',name:'Sol el / parmaklar',group:'Sol kol ve el',view:'front',x:185,y:199},
    {key:'thigh_r',name:'Sağ kalça / uyluk',group:'Sağ bacak ve ayak',view:'front',x:82,y:205},
    {key:'leg_r',name:'Sağ bacak',group:'Sağ bacak ve ayak',view:'front',x:75,y:279},
    {key:'foot_r',name:'Sağ ayak',group:'Sağ bacak ve ayak',view:'front',x:67,y:350},
    {key:'thigh_l',name:'Sol kalça / uyluk',group:'Sol bacak ve ayak',view:'front',x:126,y:205},
    {key:'leg_l',name:'Sol bacak',group:'Sol bacak ve ayak',view:'front',x:133,y:279},
    {key:'foot_l',name:'Sol ayak',group:'Sol bacak ve ayak',view:'front',x:143,y:350}
  ];
  const GROUPS=['Merkez','Sırt','Sağ kol ve el','Sol kol ve el','Sağ bacak ve ayak','Sol bacak ve ayak'];
  const FIELDS={
    activity:[
      {id:'new',name:'Yeni lezyon / genişleme (son 1 ay)',levels:['Yok','Var (+3)'],values:[0,3],note:'Son bir ayda yeni lezyon gelişimi veya mevcut lezyonda genişleme.'},
      {id:'ery',name:'Eritem',levels:['0 · Yok','1 · Hafif / pembe','2 · Belirgin kırmızı','3 · Koyu kırmızı / viyolase'],values:[0,1,2,3],note:'Lezyonun aktif sınırındaki eritemi değerlendirin.'},
      {id:'thick',name:'Deri kalınlığı',levels:['0 · Normal','1 · Hafif; hareketli','2 · Orta; hareket kısıtlı','3 · Belirgin; hareketsiz'],values:[0,1,2,3],note:'Lezyon kenarındaki kalınlaşmayı yakın sağlam deriyle karşılaştırın.'}
    ],
    damage:[
      {id:'dermal',name:'Dermal atrofi',levels:['0 · Yok','1 · Parlak cilt','2 · Görünür damarlar / hafif çöküklük','3 · Belirgin “cliff-drop”'],values:[0,1,2,3]},
      {id:'subcut',name:'Subkutan atrofi',levels:['0 · Yok','1 · Düzleşme / ≤1/3 kayıp','2 · Konkav görünüm / 1/3–2/3 kayıp','3 · >2/3 belirgin kayıp'],values:[0,1,2,3]},
      {id:'pigment',name:'Dispigmentasyon',levels:['0 · Yok','1 · Hafif','2 · Orta','3 · Şiddetli'],values:[0,1,2,3],note:'Hiperpigmentasyon veya hipopigmentasyondan baskın olanı değerlendirin.'}
    ]
  };
  const J4S=[
    {id:'general',name:'Genel durum',weight:1,detail:'Genel sistemik ağırlık'},
    {id:'vascular',name:'Periferik vasküler',weight:1,detail:'Raynaud, dijital iskemi ve vasküler tutulum'},
    {id:'skin',name:'Deri',weight:1,detail:'Kutanöz tutulum'},
    {id:'osteo',name:'Osteoartiküler',weight:.5,detail:'Eklem ve tendon tutulumu'},
    {id:'muscle',name:'Kas',weight:.5,detail:'Kas tutulumu'},
    {id:'gi',name:'Gastrointestinal',weight:1,detail:'Gastrointestinal tutulum'},
    {id:'resp',name:'Solunum',weight:2,detail:'Akciğer tutulumu · ağırlık ×2'},
    {id:'cardiac',name:'Kardiyak',weight:2,detail:'Kalp tutulumu · ağırlık ×2'},
    {id:'renal',name:'Böbrek',weight:1,detail:'Renal tutulum'}
  ];
  const state={site:'head',group:'Merkez',mode:'activity',view:'front',loscat:{activity:{},damage:{}},j4s:{},rcs:{},pga:{a:'',d:''}};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ico=n=>typeof svg==='function'?svg(n):'';
  const link=(url,title)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`;
  const sources=`<div class="scl-sources"><h3>Bilimsel kaynaklar</h3>${link('https://pmc.ncbi.nlm.nih.gov/articles/PMC3720681/','Pediatrik LoSCAT validasyonu (Kelsey & Torok, 2013)')}${link('https://pmc.ncbi.nlm.nih.gov/articles/PMC3498950/','LoSDI geliştirme ve tanımlar')}${link('https://pubmed.ncbi.nlm.nih.gov/22886849/','J4S: La Torre ve ark., 2012')}${link('https://academic.oup.com/rheumatology/article/60/4/1651/5956234','SHARE: Juvenil sistemik skleroz önerileri')}${link('https://pmc.ncbi.nlm.nih.gov/articles/PMC6293480/','Raynaud Condition Score')}
   <p>Bu prototip tanı veya tedavi önerisi oluşturmaz. Ölçek uygulama kılavuzu ve kullanım izinleri klinik yayından önce doğrulanmalıdır.</p></div>`;
  const header=(title,sub,badge)=>`<button type="button" class="breadcrumb-back" data-go="scores/scleroderma">${ico('back')} Skleroderma merkezine dön</button>${cardsTitle(title,sub,badge)}`;
  const notice=(txt)=>`<div class="scl-note">${ico('info')}<span>${txt}</span></div>`;
  function countMode(mode){const fields=FIELDS[mode];let n=0;for(const site of REGIONS){for(const f of fields){if(Number.isFinite(state.loscat[mode][site.key]?.[f.id]))n++;}}return n;}
  function totalMode(mode){return REGIONS.length*FIELDS[mode].length;}
  function calcLo(mode){if(countMode(mode)!==totalMode(mode))return null;return REGIONS.reduce((s,site)=>s+FIELDS[mode].reduce((q,f)=>q+state.loscat[mode][site.key][f.id],0),0);}
  function completedSite(site,mode){return FIELDS[mode].every(f=>Number.isFinite(state.loscat[mode][site.key]?.[f.id]));}
  function siteHasValue(site,mode){return Object.values(state.loscat[mode][site.key]||{}).some(v=>v>0);}
  function calcJ4S(){if(J4S.some(d=>!Number.isInteger(state.j4s[d.id])))return null;return J4S.reduce((s,d)=>s+state.j4s[d.id]*d.weight,0);}
  function calcRCS(){const values=Array.from({length:7},(_,i)=>state.rcs[String(i)]);return values.every(v=>Number.isInteger(v)&&v>=0&&v<=10)?Math.round(values.reduce((a,b)=>a+b,0)/7*100)/100:null;}
  const progress=(done,all)=>`<div class="scl-progress"><span>Değerlendirme tamamlanma durumu</span><b>${done} / ${all}</b></div><div class="scl-track" role="progressbar" aria-valuemin="0" aria-valuemax="${all}" aria-valuenow="${done}"><span style="width:${done/all*100}%"></span></div>`;
  function hub(){return `${cardsTitle('Skleroderma skor merkezi','Juvenil sistemik skleroz ve lokalize skleroderma için ayrı aktivite, şiddet ve hasar değerlendirmeleri.','SKLERODERMA · V0.7')}
    <div class="scl-hub-intro"><div><span class="scl-eyebrow">PEDİATRİK ODAKLI KLİNİK ARAÇLAR</span><h2>Sistemik ve lokalize sklerodermayı ayrı değerlendirin.</h2><p>Deri kalınlığı, morfea aktivitesi, kalıcı kutanöz hasar, organ şiddeti ve Raynaud izlemi.</p></div><div class="scl-hub-mark">SSc <span>+</span> LoS</div></div>
    <div class="scl-hub-section"><span>01 · SİSTEMİK SKLEROZ</span><div class="scl-hub-grid"><button data-go="scores/mrss" class="scl-linkcard"><strong>mRSS</strong><h3>Modified Rodnan Skin Score</h3><p>17 alan, 0–3 puan; toplam 0–51.</p><small>Deri kalınlığı ${ico('arrow')}</small></button><button data-go="scores/j4s" class="scl-linkcard"><strong>J4S</strong><h3>Juvenile Systemic Sclerosis Severity Score</h3><p>9 organ alanı, klinisyen derecelendirmesi; ağırlıklı 0–40.</p><small>Sistemik hastalık şiddeti ${ico('arrow')}</small></button><button data-go="scores/rcs" class="scl-linkcard"><strong>RCS</strong><h3>Raynaud Condition Score</h3><p>7 günlük 0–10 hasta değerlendirmesinin ortalaması.</p><small>Raynaud semptom yükü ${ico('arrow')}</small></button></div></div>
    <div class="scl-hub-section"><span>02 · LOKALİZE SKLERODERMA / MORFEA</span><div class="scl-hub-grid"><button data-go="scores/mlossi" class="scl-linkcard"><strong>mLoSSI</strong><h3>LoSCAT · Aktivite</h3><p>18 bölge; yeni/genişleyen lezyon, eritem, deri kalınlığı. 0–162.</p><small>Aktiviteyi değerlendir ${ico('arrow')}</small></button><button data-go="scores/losdi" class="scl-linkcard"><strong>LoSDI</strong><h3>LoSCAT · Hasar</h3><p>18 bölge; dermal ve subkutan atrofi, dispigmentasyon. 0–162.</p><small>Hasarı değerlendir ${ico('arrow')}</small></button></div></div>
    ${notice('LoSCAT 18 anatomik alanı kullanır; <b>mRSS ise 17 farklı anatomik alanla sistemik skleroz içindir.</b> Bu iki skor birbirinin yerine geçmez. J4S pediatrik şiddet aracıdır; tam organ sınıflama kriterleri olmadan otomatik organ derecesi atanmaz.')}${sources}`;}
  function outline(view){const isBack=view==='back';const paths=`<g fill="none" stroke="#a9c6c8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="104" cy="28" r="19"/><path d="M96 47v11M112 47v11M91 58q-17 8-31 15l-17 54-17 58q-2 10 6 12t13-5l21-55 12-34 4 61q9 9 22 10 14-1 23-10l4-61 12 34 21 55q5 7 13 5t6-12l-17-58-17-54q-14-7-31-15M85 167l-18 71 1 70-9 40q1 12 12 13l13-2 3-48 16-68M123 167l18 71-1 70 9 40q-1 12-12 13l-13-2-3-48-16-68"/>${isBack?'<path d="M104 63v97" stroke-dasharray="3 6"/>':'<path d="M85 91h38M86 136h36" opacity=".4"/>'}</g>`;
  const sites=REGIONS.filter(r=>r.view===view || (view==='back'&&!['upper_back','lower_back'].includes(r.key)&&false));
  return `<div class="scl-silhouette"><div class="scl-view-toggle"><button class="${view==='front'?'selected':''}" data-scl-view="front">Ön</button><button class="${view==='back'?'selected':''}" data-scl-view="back">Arka</button></div><svg viewBox="0 0 210 378" aria-label="Şematik vücut bölgesi haritası" role="img">${paths}${sites.map(r=>{const done=completedSite(r,state.mode),active=siteHasValue(r,state.mode),selected=state.site===r.key;return `<g tabindex="0" role="button" aria-label="${esc(r.name)}" data-scl-site="${r.key}" class="scl-map-point ${selected?'current':''} ${done?'done':''} ${active?'marked':''}"><circle cx="${r.x}" cy="${r.y}" r="${selected?12:9}"/><text x="${r.x}" y="${r.y+3.6}" text-anchor="middle">${done?'✓':'+'}</text></g>`;}).join('')}</svg><div class="scl-map-legend"><span><i class="active"></i> Lezyon/hasar</span><span><i class="done"></i> Tamamlandı</span><span><i class="empty"></i> Eksik</span></div><small>Şematik harita, anatomik sınırların kesin gösterimi değildir. Bölge listesinden de seçim yapabilirsiniz.</small></div>`;}
  function regionTabs(){return `<div class="scl-region-tabs" role="group" aria-label="Vücut bölgesi grupları">${GROUPS.map(g=>{const subset=REGIONS.filter(r=>r.group===g),done=subset.filter(s=>completedSite(s,state.mode)).length;return `<button type="button" class="${g===state.group?'selected':''}" aria-pressed="${g===state.group}" data-scl-group="${esc(g)}"><span>${esc(g)}</span><small>${done}/${subset.length}</small></button>`;}).join('')}</div>`;}
  function regionList(){return `<div class="scl-region-list">${REGIONS.filter(r=>r.group===state.group).map(r=>{const complete=completedSite(r,state.mode),active=siteHasValue(r,state.mode),v=state.site===r.key;return `<button type="button" class="${v?'selected':''}" data-scl-site="${r.key}"><span class="scl-dot ${complete?(active?'positive':'complete'):''}"></span><span>${r.name}</span><small>${complete?(active?'Bulgulu':'Tamam'):'Eksik'}</small></button>`;}).join('')}</div>`;}
  function fieldsForm(site,mode){return `<div class="scl-site-head"><div><span>SEÇİLEN BÖLGE</span><h3>${site.name}</h3></div><button class="scl-zero" type="button" data-scl-zero="${mode}">Bu bölümde ${mode==='activity'?'aktivite':'hasar'} yok (0)</button></div><div class="scl-fields">${FIELDS[mode].map(f=>{const val=state.loscat[mode][site.key]?.[f.id];return `<section class="scl-field"><h4>${f.name}</h4>${f.note?`<p>${f.note}</p>`:''}<div role="group" class="scl-options" aria-label="${esc(f.name)}">${f.values.map((n,i)=>`<button type="button" aria-pressed="${val===n}" class="${val===n?'selected':''}" data-scl-field="${f.id}" data-scl-val="${n}">${f.levels[i]}</button>`).join('')}</div></section>`;}).join('')}</div><div class="scl-site-paging"><button type="button" data-scl-prev ${REGIONS.findIndex(r=>r.key===site.key)===0?'disabled':''}>← Önceki bölge</button><button type="button" data-scl-next ${REGIONS.findIndex(r=>r.key===site.key)===REGIONS.length-1?'disabled':''}>Sonraki bölge →</button></div>`;}
  function resultPane(name,value,max,done,total,detail,copy){return `<aside class="scl-result"><span class="scl-eyebrow">${name} · HESAPLAMA</span>${value===null?`<div class="scl-result-missing">—</div><strong>Henüz hesaplanmadı</strong><p>Eksik alanlar var. ${done}/${total} giriş tamamlandı. Boş alanları sıfır saymıyoruz.</p>`:`<div class="scl-result-number" data-scl-score="${copy}">${Number.isInteger(value)?value:value.toFixed(2)}<span> / ${max}</span></div><strong>Değerlendirme tamamlandı</strong><p>${detail}</p><button type="button" class="scl-main-btn" data-scl-copy="${copy}">${ico('copy')} Sonucu kopyala</button>`}
  ${progress(done,total)}<button type="button" class="scl-ghost-btn" data-scl-reset="${copy}">${ico('refresh')} Formu sıfırla</button><p class="scl-disclaimer">Bu sonuç tek başına hastalık aktivitesi sınıflaması veya tedavi kararı değildir.</p></aside>`;}
  function loscat(type){const mode=type==='mlossi'?'activity':'damage';state.mode=mode;const current=REGIONS.find(r=>r.key===state.site)||REGIONS[0];const done=countMode(mode),total=totalMode(mode),score=calcLo(mode);
    return `${header(mode==='activity'?'mLoSSI · LoSCAT Aktivite':'LoSDI · LoSCAT Hasar','18 anatomik bölge · 3 parametre / bölge · Toplam 0–162',mode==='activity'?'MORFEA · AKTİVİTE':'MORFEA · HASAR')}
    <div class="scl-switch"><button type="button" ${mode==='activity'?'class="selected"':''} data-go="scores/mlossi">mLoSSI · Aktivite ${calcLo('activity')!==null?'✓':''}</button><button type="button" ${mode==='damage'?'class="selected"':''} data-go="scores/losdi">LoSDI · Hasar ${calcLo('damage')!==null?'✓':''}</button></div>
    ${notice('Aynı anatomik bölgede birden fazla lezyon varsa <b>her parametre için en yüksek değeri</b> kullanın; farklı parametrelerde farklı lezyonlar esas alınabilir. Lezyon olmayan bölgeler <b>“aktivite/hasar yok (0)”</b> ile açıkça tamamlanmalıdır.')}
    <div class="scl-workbench"><div class="scl-left"><section class="scl-paper">${progress(done,total)}<div class="scl-geometry">${outline(state.view)}<div class="scl-choose"><h3>Bölge bölge değerlendirme</h3><p>Telefonda önce vücut bölümünü, sonra ayrıntılı alanı açın.</p>${regionTabs()}${regionList()}</div></div></section><section class="scl-paper scl-input-paper">${fieldsForm(current,mode)}</section></div>${resultPane(mode==='activity'?'mLoSSI':'LoSDI',score,162,done,total,mode==='activity'?'Daha yüksek toplam daha fazla kutanöz aktiviteyi gösterir.':'Daha yüksek toplam daha fazla kalıcı kutanöz hasarı gösterir.',type)}</div>
    ${notice('mLoSSI yalnızca deri aktivitesini; LoSDI yalnızca kutanöz hasarı değerlendirir. Derin doku, eklem, göz veya nörolojik tutulum için ayrıca klinik değerlendirme gerekir.')}${sources}`;
  }
  function j4s(){const done=J4S.filter(d=>Number.isInteger(state.j4s[d.id])).length,score=calcJ4S();return `${header('J4S · Juvenile Systemic Sclerosis Severity Score','9 sistem · Klinik derece girişi · Ağırlıklı toplam 0–40','JSSc · ŞİDDET')}
    ${notice('<b>Önemli:</b> Bu form J4S organ derecelerini 0–4 olarak <b>uzmanın önceden belirlediğini varsayar</b>. Özgün J4S’nin 16 alt ölçütüne göre otomatik 0–4 derece tayin etmez. Orijinal puanlama yönergesiyle derecelendirme yapmadan kullanılmamalıdır.')}
    <div class="scl-workbench"><section class="scl-paper"><h2>Organ ve sistem şiddeti</h2><p>Her organ sistemine özgün J4S kriterlerine göre 0–4 şiddet derecesini seçin. Kardiyak ve solunum dereceleri ×2; osteoartiküler ve kas dereceleri ×0,5 ile ağırlıklandırılır.</p>${progress(done,9)}
    ${J4S.map(d=>`<div class="scl-j4s-row"><div><h3>${d.name}</h3><p>${d.detail}</p></div><span class="scl-weight">× ${d.weight.toString().replace('.',',')}</span><div class="scl-numbers" role="group" aria-label="${esc(d.name)} şiddeti">${[0,1,2,3,4].map(v=>`<button type="button" class="${state.j4s[d.id]===v?'selected':''}" aria-pressed="${state.j4s[d.id]===v}" data-scl-j4s="${d.id}" data-scl-val="${v}">${v}</button>`).join('')}</div></div>`).join('')}</section>${resultPane('J4S',score,40,done,9,'Daha yüksek ağırlıklı toplam daha ağır sistemik organ tutulumu anlamına gelir.','j4s')}</div>${notice('J4S pediatrik kullanımda önerilmiş <b>öncül bir şiddet indeksidir</b>. Pediatrik hastalık aktivite indeksi değildir ve klinik doğrulamasının sınırlılıkları vardır.')}${sources}`;}
  function rcs(){const done=Object.values(state.rcs).filter(v=>Number.isInteger(v)).length,score=calcRCS();return `${header('Raynaud Condition Score · RCS','7 günlük öz değerlendirme · Her gün 0–10 · Haftalık ortalama 0–10','RAYNAUD · HASTA BİLDİRİMİ')}
    ${notice('Bu araç <b>7 günlük RCS günlüğünün ortalamasını</b> hesaplar. Hasta her gün atak sıklığı/süresi, ağrı, uyuşma, yanma ve günlük el işlevine etkisini birlikte değerlendirir. RCS bir sistemik skleroz aktivite indeksi değildir.')}
    <div class="scl-workbench"><section class="scl-paper"><h2>7 günlük Raynaud günlüğü</h2><p>0 = Raynaud nedeniyle zorluk yok, 10 = aşırı zorluk. Her gün ayrı işaretlenmelidir.</p>${progress(done,7)}
    ${Array.from({length:7},(_,i)=>`<div class="scl-rcs-row"><h3>${i+1}. gün</h3><div class="scl-numbers rcs" role="group" aria-label="${i+1}. gün Raynaud skoru">${Array.from({length:11},(_,n)=>`<button type="button" class="${state.rcs[String(i)]===n?'selected':''}" aria-pressed="${state.rcs[String(i)]===n}" data-scl-rcs="${i}" data-scl-val="${n}">${n}</button>`).join('')}</div></div>`).join('')}</section>${resultPane('RCS',score,10,done,7,'Günlük 0–10 öz değerlendirmelerin aritmetik ortalaması. Klinik belirteçlerle birlikte yorumlanmalıdır.','rcs')}</div>${sources}`;}
  function render(which){switch(which){case 'scleroderma':return hub();case 'mlossi':case 'losdi':return loscat(which);case 'j4s':return j4s();case 'rcs':return rcs();default:return hub();}}
  function redraw(focusSelector){const route=(location.hash||'').slice(1).split('/')[1]||'scleroderma';const root=document.querySelector('#app');if(!root)return;const scroll=window.scrollY;root.innerHTML=render(route);window.scrollTo({top:scroll,behavior:'instant'});if(focusSelector)root.querySelector(focusSelector)?.focus({preventScroll:true});}
  function siteGroup(k){return REGIONS.find(r=>r.key===k)?.group||'Merkez';}
  function onClick(e){const el=e.target.closest('[data-scl-group],[data-scl-site],[data-scl-view],[data-scl-zero],[data-scl-field],[data-scl-j4s],[data-scl-rcs],[data-scl-prev],[data-scl-next],[data-scl-reset],[data-scl-copy]');if(!el)return false;const d=el.dataset;
    if(d.sclGroup){state.group=d.sclGroup;const next=REGIONS.find(r=>r.group===d.sclGroup);if(next)state.site=next.key;state.view=state.group==='Sırt'?'back':'front';}
    else if(d.sclSite){state.site=d.sclSite;state.group=siteGroup(state.site);state.view=REGIONS.find(r=>r.key===state.site)?.view||'front';}
    else if(d.sclView){state.view=d.sclView;if(d.sclView==='back'){state.site='upper_back';state.group='Sırt';}else if(state.group==='Sırt'){state.site='head';state.group='Merkez';}}
    else if(d.sclZero){const m=d.sclZero;state.loscat[m][state.site]=Object.fromEntries(FIELDS[m].map(f=>[f.id,0]));}
    else if(d.sclField){const target=state.loscat[state.mode];target[state.site]??={};target[state.site][d.sclField]=Number(d.sclVal);}
    else if(d.sclJ4s){state.j4s[d.sclJ4s]=Number(d.sclVal);}
    else if(d.sclRcs!==undefined){state.rcs[d.sclRcs]=Number(d.sclVal);}
    else if('sclPrev'in d||'sclNext'in d){const index=REGIONS.findIndex(r=>r.key===state.site),next=REGIONS[index+('sclNext' in d?1:-1)];if(next){state.site=next.key;state.group=next.group;state.view=next.view;}}
    else if(d.sclReset){if(d.sclReset==='mlossi')state.loscat.activity={};else if(d.sclReset==='losdi')state.loscat.damage={};else if(d.sclReset==='j4s')state.j4s={};else if(d.sclReset==='rcs')state.rcs={};}
    else if(d.sclCopy){let value=null,text='';if(d.sclCopy==='mlossi'){value=calcLo('activity');text=`mLoSSI: ${value}/162`;}else if(d.sclCopy==='losdi'){value=calcLo('damage');text=`LoSDI: ${value}/162`;}else if(d.sclCopy==='j4s'){value=calcJ4S();text=`J4S (klinisyen dereceleri): ${value}/40`;}else if(d.sclCopy==='rcs'){value=calcRCS();text=`Raynaud Condition Score (7 günlük ortalama): ${value}/10`;}if(value!==null&&navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>showToast('Sonuç panoya kopyalandı.')).catch(()=>showToast('Pano erişimi başarısız.'));return true;}
    redraw();return true;
  }
  function onKey(e){if(!['Enter',' '].includes(e.key))return false;const el=e.target.closest('g[data-scl-site]');if(!el)return false;e.preventDefault();const fake={target:el};return onClick(fake);}
  return {render,onClick,onKey,state,REGIONS,FIELDS,J4S,calcLo,calcJ4S,calcRCS,countMode};
})();
