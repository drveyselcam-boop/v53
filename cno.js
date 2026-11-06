'use strict';
/* CNO/CRMO: separate clinical, classification and MRI tools.
 * CROMRIS descriptive units != the original portal's 720-point index.
 */
const CNOTools=(()=>{
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=n=>typeof svg==='function'?svg(n):'';
const TOOLS=[
 ['classification','2025 EULAR/ACR','Pediatrik sınıflama','3 giriş + 4 dışlama + 9 alan · ≥55','SINIFLAMA'],
 ['cdas','CNO-CDAS','Klinik aktivite','Ağrı + hasta global + aktif kemik odağı · 0–30','KLİNİK'],
 ['pedcno','PedCNO 30/50/70','Tedavi yanıtı','5 ölçüt · Başlangıç/izlem karşılaştırması','YANIT'],
 ['rinbo','RINBO / mRINBO','MR hastalık yükü','Lezyon sayısı, boyut, ekstraosseöz ve spinal bulgular','MR'],
 ['cromris','CROMRIS / RAI-CROMRIS','Bölgesel MR kayıt aracı','8 anatomik bölge · kemik birimleri · RAI uyarlaması','MR']
];
const SOURCES={
 classification:[['https://turkjpediatr.org/article/view/7367/','2025 EULAR/ACR ağırlıklı tablo (2026 derleme)'],['https://pubmed.ncbi.nlm.nih.gov/40342207/','EULAR/ACR kriterleri · özgün yayın']],
 cdas:[['https://pmc.ncbi.nlm.nih.gov/articles/PMC10543471/','CARRA CNO-CDAS çalışması']],
 pedcno:[['https://pmc.ncbi.nlm.nih.gov/articles/PMC2888230/','PedCNO özgün yanıt kriterleri'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC12221992/','PedCNO yanıt/aktivite kısıtları']],
 rinbo:[['https://pmc.ncbi.nlm.nih.gov/articles/PMC9526975/','RINBO ve mRINBO karşılaştırması'],['https://pubmed.ncbi.nlm.nih.gov/27663226/','RINBO özgün çalışma']],
 cromris:[['https://pmc.ncbi.nlm.nih.gov/articles/PMC12317626/','CROMRIS web arayüzü çalışması'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC8364123/','RAI-CROMRIS uyarlaması'],['https://www.carearthritis.com/mriportal/crmo/index/','Özgün CROMRIS portalı']]
};
const CLSD=[
 ['biopsy','Kemik biyopsisi',[['none','Yapılmadı veya fibrozis/inflamasyon yok',0],['inflammation','Yalnız inflamasyon',9],['fibrosis','Yalnız fibrozis',11],['both','İnflamasyon ve fibrozis',17]]],
 ['age','Semptomların başladığı yaş',[['young','3 yaş altı',0],['old','≥3 yaş',17]]],
 ['site','Lezyon yerleşimi',[['clavicle','Klavikula ve/veya mandibula',16],['other','Klavikula, mandibula, kafatası ve el dışındaki kemikler',9],['head','Klavikula/mandibula olmadan kafatası veya el',0]]],
 ['pattern','Lezyon dağılımı',[['sym','Çok odaklı, en az bir kemikte iki taraflı simetrik',9],['multi','Çok odaklı, simetri yok',7],['single-no','Tek odaklı, tüm vücut görüntüleme yapılmadı',3],['single-yes','Tek odaklı, tüm vücut görüntüleme yapıldı',0]]],
 ['other','CNO öncesinde eşlik eden hastalık',[['ibd','İnflamatuvar bağırsak hastalığı',9],['skin','İBH olmadan kutanöz inflamatuvar hastalık',8],['axial','İBH/kutanöz hastalık olmadan aksiyel artrit',5],['none','Yok',0]]],
 ['hb','Hemoglobin',[['high','≥10 g/dL',8],['low','<10 g/dL',0]]],
 ['fever','Enfeksiyonla ilişkili olmayan >38 °C ateş',[['no','Yok',8],['yes','Var',0]]],
 ['esr','ESH',[['low','<60 mm/saat',8],['high','≥60 mm/saat',0]]],
 ['crp','CRP',[['low','<30 mg/L',8],['high','≥30 mg/L',0]]]
];
const ENTRY=[['duration','Kemik ağrısı ve/veya kas-iskelet işlev kısıtlılığı ≥6 hafta'],['child','Hastalık başlangıcı 18 yaşından önce'],['imaging','Artrit kaynaklı olmayan kemikte tipik anormal görüntüleme']];
const EXCL=[['mimic','Malignite, enfeksiyon, metabolik/monogenik taklitçi için doğrulayıcı kanıt'],['plt','Trombosit <100.000/mm³'],['ldh','Malignite düşündüren patolojik LDH'],['ab','Yalnız antimikrobiyal tedaviye tam ve kalıcı yanıt']];
const PED=[['esr','ESH','mm/saat',500],['lesions','MR aktif kemik lezyonu sayısı','odak',500],['phys','Hekim global aktivite VAS','0–10',10],['patient','Hasta/ebeveyn global aktivite VAS','0–10',10],['chaq','CHAQ engellilik indeksi','0–3',3]];
const REGIONS=[['head','Baş / çene'],['torso','Toraks / kaburga'],['arms','Kollar'],['hands','Eller'],['spine','Omurga'],['pelvis','Pelvis'],['legs','Bacaklar'],['feet','Ayaklar']];
function generateBones(){const a=[];const add=(g,name,sp=false)=>a.push({id:'b'+a.length,group:g,name,sp});
 for(const s of ['Sağ','Sol'])for(const x of ['Kafatası','Maksilla','Mandibula'])add('head',s+' '+x);
 for(const s of ['Sağ','Sol'])for(const x of ['Klavikula','Skapula'])add('torso',s+' '+x);add('torso','Sternum');
 for(const s of ['Sağ','Sol'])for(let i=1;i<=12;i++)add('torso',`${s} ${i}. kosta`);
 for(const s of ['Sağ','Sol'])for(const x of ['Humerus','Radius','Ulna'])for(const seg of ['Proksimal','Orta','Distal'])add('arms',`${s} ${x} · ${seg}`);
 for(const s of ['Sağ','Sol'])for(const x of ['Karpal','Metakarpal','Falanks'])add('hands',`${s} ${x} kemikler`);
 for(let i=1;i<=7;i++)add('spine','C'+i,true);for(let i=1;i<=12;i++)add('spine','T'+i,true);for(let i=1;i<=5;i++)add('spine','L'+i,true);
 for(const s of ['Sağ','Sol'])for(const x of ['Asetabulum','İlium','Pubis','İskiyum','Sakroiliak kemik bölgesi'])add('pelvis',`${s} ${x}`);
 for(const s of ['Sağ','Sol']){for(const x of ['Femur','Tibia','Fibula'])for(const seg of ['Proksimal','Orta','Distal'])add('legs',`${s} ${x} · ${seg}`);add('legs',`${s} Patella`);}
 for(const s of ['Sağ','Sol'])for(const x of ['Ön ayak','Orta ayak','Arka ayak'])add('feet',`${s} ${x}`);
 return a;}
const BONES=generateBones();
const state={classification:{entry:{},excl:{},domain:{}},cdas:{},pedcno:{},rinbo:{},rinboMode:'rinbo',mri:{},region:'legs',focus:BONES.find(x=>x.group==='legs').id};
const val=v=>v===undefined||v===null||String(v).trim()===''?null:Number.isFinite(Number(v))?Number(v):null;
const valid=(v,min=0,max=Infinity)=>val(v)!==null&&val(v)>=min&&val(v)<=max;
const opts=(tag,key,items,selected)=>`<div class="cno-options" role="group">${items.map(([v,text,p])=>`<button type="button" data-cno-opt="${tag}" data-key="${key}" data-value="${v}" class="${selected===v?'chosen':''}" aria-pressed="${selected===v}"><span>${esc(text)}</span>${p!==undefined?`<small>${p} p.</small>`:''}</button>`).join('')}</div>`;
const yn=(tag,key,label,selected)=>`<div class="cno-yn"><b>${esc(label)}</b>${opts(tag,key,[['yes','Evet'],['no','Hayır']],selected)}</div>`;
const num=(tag,key,label,value,max=9999,step='any',unit='')=>`<label class="cno-num"><span>${esc(label)} ${unit?`<small>(${esc(unit)})</small>`:''}</span><input data-cno-num="${tag}" data-key="${key}" type="number" min="0" max="${max}" step="${step}" inputmode="decimal" value="${value??''}" placeholder="Değer girin" /></label>`;
function sources(id){return `<div class="cno-references"><h3>Bilimsel kaynaklar ve sınırlamalar</h3>${SOURCES[id].map(([u,l])=>`<a target="_blank" rel="noopener noreferrer" href="${u}">${esc(l)} ↗</a>`).join('')}<p>Bu prototip klinik kullanım öncesi özgün formlarla ve lisanslarıyla doğrulanmalıdır. Kişisel bilgiler sunucuya gönderilmez; veriler yalnızca sayfa açıkken bellekte tutulur.</p></div>`;}
function result(title,score,max,text,detail=''){return `<section class="cno-result"><div class="cno-kicker">${title}</div>${score===null?`<div class="cno-pending">—</div><p>Tüm gerekli alanlar tamamlandığında hesaplanır.</p>`:`<div class="cno-value" data-cno-score>${score}${max?`<span> / ${max}</span>`:''}</div><p>${text}</p>`}${detail}</section>`;}
function wrap(id,title,desc,form,side){return `<button class="breadcrumb-back" data-go="scores/cno">${ico('back')} CNO merkezine dön</button>${cardsTitle(title,desc,'CNO / CRMO')}<div class="cno-layout"><section class="cno-form">${form}</section><aside class="cno-side">${side}${sources(id)}</aside></div>`;}
function banner(text){return `<div class="cno-banner">${ico('info')}<span>${text}</span></div>`;}
function hub(){return `<button class="breadcrumb-back" data-go="scores">${ico('back')} Skor listesine dön</button>${cardsTitle('CNO / CRMO','Sınıflama, klinik aktivite, tedavi yanıtı ve MR yükü','5 ETKİLEŞİMLİ ARAÇ')}
<div class="cno-hero"><strong>CNO<span>+</span></strong><p><b>Kemik inflamasyonunun klinik ve radyolojik izlemi.</b> 2025 EULAR/ACR sınıflaması, CNO-CDAS, PedCNO, RINBO ve bölgesel CROMRIS kayıtları.</p></div>
<div class="cno-hub-grid">${TOOLS.map(([id,title,sub,desc,tag],i)=>`<button type="button" class="cno-tile" data-go="scores/${id}"><span>${tag}</span><em>0${i+1}</em><h2>${title}</h2><b>${sub}</b><p>${desc}</p><small>Hesaplayıcıyı aç ${ico('arrow')}</small></button>`).join('')}</div>${banner('CROMRIS ve RAI-CROMRIS aynı şey değildir. Radyolojik indeksleri klinik aktivite veya tanı yerine kullanmayın.')}`;}
function classificationResult(){const s=state.classification;if(!ENTRY.every(([k])=>s.entry[k]!==undefined)||!EXCL.every(([k])=>s.excl[k]!==undefined)||!CLSD.every(([k])=>s.domain[k]!==undefined))return null;
 const score=CLSD.reduce((sum,[id,,list])=>sum+(list.find(row=>row[0]===s.domain[id])?.[2]??0),0);
 const eligible=ENTRY.every(([k])=>s.entry[k]==='yes'),excluded=EXCL.some(([k])=>s.excl[k]==='yes');return {score,eligible,excluded,pass:eligible&&!excluded&&score>=55};}
function classification(){const s=state.classification,r=classificationResult(),done=ENTRY.filter(([k])=>s.entry[k]!==undefined).length+EXCL.filter(([k])=>s.excl[k]!==undefined).length+CLSD.filter(([k])=>s.domain[k]!==undefined).length;
 let form=banner('<b>2025 EULAR/ACR pediatrik sınıflaması:</b> Zorunlu giriş, dışlama ve dokuz puan alanı birlikte değerlendirilir. Bu bir <b>araştırma sınıflama</b> aracıdır; klinik tanı yerine geçmez.');
 form+=`<div class="cno-progress"><b>${done}/16 alan tamamlandı</b><div><span style="width:${(done/16*100).toFixed(1)}%"></span></div></div>`;
 form+=`<details class="cno-group" data-cno-section="entry" open><summary>1 · Zorunlu giriş koşulları <small>${ENTRY.filter(([k])=>s.entry[k]!==undefined).length}/3</small></summary><div>${ENTRY.map(([k,l])=>yn('clsEntry',k,l,s.entry[k])).join('')}</div></details>`;
 form+=`<details class="cno-group" data-cno-section="excl" open><summary>2 · Dışlama koşulları <small>${EXCL.filter(([k])=>s.excl[k]!==undefined).length}/4</small></summary><div><p class="cno-hint">Bu bölümde “Evet” dışlama bulunduğunu gösterir. LDH için özgün kriterler tek bir kesin laboratuvar eşiği belirtmez.</p>${EXCL.map(([k,l])=>yn('clsExcl',k,l,s.excl[k])).join('')}</div></details>`;
 form+=`<h3 class="cno-subhead">3 · Ağırlıklı alanlar</h3>`+CLSD.map(([k,l,options],i)=>`<details class="cno-group" data-cno-section="domain-${k}" ${i===0?'open':''}><summary>${i+1}. ${l} <small>${s.domain[k]!==undefined?'✓':'—'}</small></summary><div>${opts('clsDomain',k,options,s.domain[k])}</div></details>`).join('');
 const extra=r?`<div class="cno-verdict ${r.pass?'yes':'no'}">${r.pass?'2025 sınıflama kriterleri karşılanıyor':!r.eligible?'Zorunlu giriş koşulu karşılanmıyor':r.excluded?'En az bir dışlama koşulu mevcut':'Toplam puan 55 altında'}</div><div class="cno-facts">Giriş: ${r.eligible?'uygun':'uygun değil'} · Dışlama: ${r.excluded?'mevcut':'yok'} · Puan: ${r.score}</div>`:'';
 return wrap('classification','2025 EULAR/ACR CNO sınıflaması','Giriş/dışlama koşulları + 9 ağırlıklı alan · ≥55 puan',form,result('AĞIRLIKLI SINIFLAMA',r?.score??null,'100',r?'≥55 ve uygun ön koşullarla sınıflama.':'',extra)+`<button class="cno-reset" data-cno-reset="classification">${ico('refresh')} Formu sıfırla</button>`);
}
function cdasResult(){const s=state.cdas;if(!valid(s.pain,0,10)||!valid(s.global,0,10)||!valid(s.count,0,1000)||!Number.isInteger(val(s.count)))return null;return {score:val(s.pain)+val(s.global)+Math.min(10,val(s.count)),count:val(s.count)};}
function cdas(){const s=state.cdas,r=cdasResult();const form=banner('<b>CARRA CNO-CDAS:</b> klinik olarak aktif kemik odağı sayısı (üst sınır 10), hasta/ebeveyn ağrı VAS ve genel aktivite VAS toplamı. Radyolojik lezyon sayısıyla karıştırılmamalıdır.')+`<div class="cno-number-grid">${num('cdas','pain','Hasta/ebeveyn ağrı VAS',s.pain,10,0.1,'0–10')}${num('cdas','global','Hasta/ebeveyn global aktivite VAS',s.global,10,0.1,'0–10')}${num('cdas','count','Klinik olarak aktif kemik odağı',s.count,1000,1,'odak')}</div><p class="cno-hint">Klinik odak: odaksal hassasiyet, şişlik ve/veya ısı artışı. Her aktif kemik odağı 1 puan; 10’un üzeri 10 ile sınırlandırılır.</p>`;
 return wrap('cdas','CNO-CDAS','Klinik hastalık aktivitesi · 0–30',form,result('CNO-CDAS',r?Number(r.score.toFixed(1)):null,'30',r?'Daha yüksek puan daha fazla klinik aktiviteyi ifade eder.':'',r?`<div class="cno-facts">Aktif kemik odakları: ${r.count}${r.count>10?' (puanlamada 10)':''}</div>`:'')+`<button class="cno-reset" data-cno-reset="cdas">${ico('refresh')} Formu sıfırla</button>`);
}
function pedResult(){const a=[];for(const [id,,unit,max] of PED){const b=state.pedcno[id+'b'],f=state.pedcno[id+'f'];if(!valid(b,0,max)||!valid(f,0,max)||(id==='lesions'&&(!Number.isInteger(val(b))||!Number.isInteger(val(f)))))return null;a.push({id,b:val(b),f:val(f)});}
 const grades=[30,50,70,90].map(t=>{let improved=0,worsened=0;for(const x of a){if(x.b>0&&(x.b-x.f)/x.b*100>=t-1e-9)improved++;if(x.b===0?x.f>0:(x.f-x.b)/x.b*100>t+1e-9)worsened++;}return {threshold:t,improved,worsened,pass:improved>=3&&worsened<=1};});return {grades};}
function pedcno(){const r=pedResult();let form=banner('<b>Özgün PedCNO beşlisi:</b> ESH, görüntülemede aktif lezyon sayısı, hekim global VAS, hasta/ebeveyn global VAS ve CHAQ. Ağrı VAS bu beşlinin ayrı bir ölçütü değildir.')+`<div class="cno-ped-list">`;
 form+=PED.map(([id,l,unit,max])=>`<div class="cno-ped-pair"><h3>${esc(l)} <small>(${esc(unit)})</small></h3><div>${num('pedcno',id+'b','Başlangıç',state.pedcno[id+'b'],max,id==='lesions'?1:0.1)}${num('pedcno',id+'f','İzlem',state.pedcno[id+'f'],max,id==='lesions'?1:0.1)}</div></div>`).join('')+'</div>';
 form+='<p class="cno-hint">Başlangıç 0 ise yüzde iyileşme hesaplanmaz; 0’dan daha yüksek değere çıkış kötüleşme sayılır. Eşit kalma iyileşme değildir.</p>';
 const extra=r?`<div class="cno-grade-grid">${r.grades.map(g=>`<div class="cno-grade ${g.pass?'met':'unmet'}"><b>PedCNO${g.threshold}</b><strong>${g.pass?'Karşılanıyor':'Karşılanmıyor'}</strong><small>İyileşen ${g.improved}/5 · Kötüleşen ${g.worsened}/5</small></div>`).join('')}</div><p class="cno-hint">PedCNO90 sonradan araştırmalarda kullanılan ek yanıt seviyesidir.</p>`:'';
 return wrap('pedcno','PedCNO yanıt ölçütleri','Tedavi öncesi/sonrası · PedCNO30 / 50 / 70 (ve 90)',form,result('PEDCNO DEĞERLENDİRMESİ',r?'Tamamlandı':null,'',r?'Beş ölçütün tamamı değerlendirildi.':'',extra)+`<button class="cno-reset" data-cno-reset="pedcno">${ico('refresh')} Formu sıfırla</button>`);
}
function rinboResult(){const s=state.rinbo,n=val(s.count);if(n===null||n<0||!Number.isInteger(n))return null;if(n===0)return {empty:true};if(!valid(s.size,0,2000)||['soft','hyper','spinal','deform'].some(k=>!['yes','no'].includes(s[k])))return null;
 const size=val(s.size),npts=n===1?1:n<=4?2:3,spts=state.rinboMode==='mrinbo'?(size<20?1:size<=50?2:3):(size<10?1:size<=100?2:3);const extras=['soft','hyper','spinal','deform'].reduce((t,k)=>t+(s[k]==='yes'?1:0),0);return {score:npts+spts+extras,npts,spts,extras};}
function rinbo(){const s=state.rinbo,r=rinboResult(),n=val(s.count);let form=banner('<b>RINBO (0–10)</b> aktif lezyon sayısı, en büyük lezyon çapı, periosteal/yumuşak doku, hiperostoz ve vertebra bulgularını toplar. <b>mRINBO</b> boyut eşiklerini çocuklara yönelik olarak değiştirir.');
 form+=`<h3 class="cno-subhead">Radyolojik indeks sürümü</h3>${opts('rinboMode','mode',[['rinbo','Özgün RINBO · <10 / 10–100 / >100 mm'],['mrinbo','Modifiye RINBO · <20 / 20–50 / >50 mm']],state.rinboMode)}`;
 form+=`<div class="cno-number-grid">${num('rinbo','count','Radyolojik aktif lezyon sayısı',s.count,300,1,'odak')}${n>0?num('rinbo','size','En büyük aktif lezyon çapı',s.size,2000,0.1,'mm'):''}</div>`;
 if(n>0)form+=`<h3 class="cno-subhead">Ekstramedüller ve spinal tutulum</h3>${[['soft','Periost reaksiyonu ve/veya komşu yumuşak doku ödemi'],['hyper','Hiperostoz'],['spinal','Radyolojik aktif vertebra lezyonu'],['deform','CNO ilişkili vertebra korpus deformitesi']].map(([k,l])=>yn('rinbo',k,l,s[k])).join('')}`;
 const extra=r?.empty?'<div class="cno-verdict no">Aktif radyolojik odak yok: özgün RINBO aktif lezyonlar için tanımlanmıştır.</div>':r?`<div class="cno-facts">Odak sayısı: ${r.npts} + çap: ${r.spts} + ek/spinal: ${r.extras}</div>`:'';
 return wrap('rinbo','RINBO / mRINBO','Tüm vücut MR · radyolojik aktivite yükü',form,result('MR HASTALIK YÜKÜ',r&&!r.empty?r.score:null,'10',r&&!r.empty?'Daha yüksek skor daha fazla MR aktivite yükü gösterir.':'',extra)+`<button class="cno-reset" data-cno-reset="rinbo">${ico('refresh')} Formu sıfırla</button>`);
}
function boneDone(b){const d=state.mri[b.id];return !!d&&(d.active==='no'||d.active==='yes'&&['1','2','3'].includes(d.extent)&&['yes','no'].includes(d.soft)&&['yes','no'].includes(d.expand)&&(!b.sp||['yes','no'].includes(d.collapse)));}
function boneScore(b){if(!boneDone(b))return null;const v=state.mri[b.id];return v.active==='no'?0:1+Number(v.extent)+(v.soft==='yes'?1:0)+(v.expand==='yes'?1:0)+(b.sp&&v.collapse==='yes'?1:0);}
function mriResult(){if(!BONES.every(boneDone))return null;return {score:BONES.reduce((t,b)=>t+boneScore(b),0),active:BONES.filter(b=>state.mri[b.id]?.active==='yes').length,count:BONES.length};}
function skeleton(){const coords=[['head',104,34,18],['torso',103,112,22],['arms',37,153,20],['hands',19,221,16],['spine',103,173,14],['pelvis',103,229,22],['legs',71,313,27],['feet',69,391,18]];
 return `<svg class="cno-skeleton" viewBox="0 0 210 430" role="img" aria-label="Bölge seçilebilir iskelet şeması"><g fill="none" stroke="#b6d0d0" stroke-width="11" stroke-linecap="round"><path d="M104 67V221 M68 105 31 196 19 237 M139 105 176 196 190 237 M83 235 71 350 65 404 M128 235 138 350 151 404 M71 110h67"/></g><g fill="#e1eeea" stroke="#96b8b6" stroke-width="2"><circle cx="104" cy="40" r="31"/><path d="M76 88 Q105 80 132 88 L136 198 Q103 214 73 198Z"/><path d="M74 210Q103 200 134 210L128 244 81 244Z"/></g>${coords.map(([k,x,y,r])=>`<g class="cno-map-pin ${state.region===k?'active':''}" data-cno-region="${k}" role="button" tabindex="0" aria-label="${REGIONS.find(v=>v[0]===k)[1]}"><circle cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y+5}">${REGIONS.findIndex(v=>v[0]===k)+1}</text></g>`).join('')}</svg>`;}
function cromris(){const region=state.region,units=BONES.filter(b=>b.group===region),focus=units.find(b=>b.id===state.focus)||units[0];const s=state.mri[focus.id]||{},r=mriResult();const done=BONES.filter(boneDone).length,active=BONES.filter(b=>state.mri[b.id]?.active==='yes').length;
 let form=banner('<b>CROMRIS MR kemik birimleri:</b> bölge seçilip her birimde lezyon var/yok, STIR yaygınlığı, periosteal/yumuşak doku bulgusu ve ekspansiyon ayrı işaretlenir. <b>RAI-CROMRIS</b> bu kayıtlardan türetilen farklı bir indekstir. Bu sadeleştirilmiş kemik birimi listesi, özgün CARE Arthritis portalının tam 720 puan ölçeği yerine <b>geçmez</b>.');
 form+=`<div class="cno-progress"><b>${done}/${BONES.length} kemik birimi yanıtlandı · ${active} aktif</b><div><span style="width:${(100*done/BONES.length).toFixed(2)}%"></span></div></div>`;
 form+=`<div class="cno-mri-columns"><div class="cno-mri-region">${skeleton()}<div class="cno-region-grid">${REGIONS.map(([id,l])=>{const arr=BONES.filter(b=>b.group===id),n=arr.filter(boneDone).length;return `<button type="button" class="cno-region ${region===id?'selected':''}" data-cno-region="${id}"><strong>${l}</strong><small>${n}/${arr.length}</small></button>`}).join('')}</div></div><div class="cno-mri-editor"><div class="cno-mri-header"><h3>${REGIONS.find(x=>x[0]===region)[1]}</h3><span>${units.filter(boneDone).length}/${units.length}</span></div>
 <button type="button" class="cno-normal" data-cno-normal="${region}">✓ Bölgedeki eksik birimleri normal olarak onayla</button>
 <div class="cno-bones">${units.map(b=>`<button type="button" class="cno-bone ${focus.id===b.id?'selected':''} ${state.mri[b.id]?.active==='yes'?'positive':boneDone(b)?'negative':''}" data-cno-bone="${b.id}"><span>${esc(b.name)}</span><small>${boneDone(b)?state.mri[b.id].active==='yes'?'AKTİF':'NORMAL':'—'}</small></button>`).join('')}</div>
 <div class="cno-unit-form"><h3>${esc(focus.name)}</h3>${opts('mriActive',focus.id,[['no','Aktif ilik ödemi yok'],['yes','Aktif kemik iliği STIR hiperintensitesi mevcut']],s.active)}`;
 if(s.active==='yes')form+=`<h4>Aktif lezyonun özellikleri</h4><p class="cno-hint">Lezyonun kapladığı göreli kemik birimi hacmi</p>${opts('mriExtent',focus.id,[['1','<%25',1],['2','%25–50',2],['3','>%50',3]],s.extent)}${yn('mriSoft',focus.id,'Yumuşak doku/periost hiperintensitesi',s.soft)}${yn('mriExpand',focus.id,'Kemikte ekspansiyon',s.expand)}${focus.sp?yn('mriCollapse',focus.id,'Vertebra yükseklik kaybı / kompresyon',s.collapse):''}`;
 form+='</div></div></div>';
 const extra=r?`<div class="cno-facts">${r.active} aktif kemik birimi; ${r.count} birim kayıtlı · RAI toplam ${r.score}</div>`:`<p class="cno-hint">Toplam için ${BONES.length-done} birim eksik. Bu ekranın yerel RAI puanı, özgün CROMRIS 720 puanlık kapsam ile doğrudan karşılaştırılamaz.</p>`;
 return wrap('cromris','CROMRIS / RAI-CROMRIS','Mobilde bölge bölge MR bulgu kaydı · araştırma uyarlaması',form,result('RAI-CROMRIS · YEREL KAYIT',r?.score??null,'',r?'Kayıtlı birimlerin toplam aktivite puanı.':'',extra)+`<button class="cno-reset" data-cno-reset="cromris">${ico('refresh')} MR kayıtlarını sıfırla</button>`);
}
const pages={cno:hub,classification,cdas,pedcno,rinbo,cromris};
function render(id){return (pages[id]||hub)();}
function repaint(){const route=decodeURIComponent(location.hash.slice(1)).split('/')[1]||'cno',root=document.querySelector('#app');if(!root)return;
 const y=window.scrollY,open=Array.from(root.querySelectorAll('details[data-cno-section][open]')).map(e=>e.dataset.cnoSection);
 const boneScroll=root.querySelector('.cno-bones')?.scrollTop||0;
 root.innerHTML=render(route);
 if(open.length){root.querySelectorAll('details[data-cno-section]').forEach(e=>e.open=open.includes(e.dataset.cnoSection));}
 if(root.querySelector('.cno-bones'))root.querySelector('.cno-bones').scrollTop=boneScroll;
 window.scrollTo(0,y);
}
function onClick(e){const t=e.target.closest('[data-cno-opt],[data-cno-region],[data-cno-bone],[data-cno-normal],[data-cno-reset]');if(!t)return false;
 if(t.hasAttribute('data-cno-opt')){const kind=t.dataset.cnoOpt,k=t.dataset.key,v=t.dataset.value;
  if(kind==='clsEntry')state.classification.entry[k]=v;
  else if(kind==='clsExcl')state.classification.excl[k]=v;
  else if(kind==='clsDomain')state.classification.domain[k]=v;
  else if(kind==='rinboMode')state.rinboMode=v;
  else if(kind==='rinbo')state.rinbo[k]=v;
  else if(kind==='mriActive'){const x=state.mri[k]??={};x.active=v;if(v==='no'){delete x.extent;delete x.soft;delete x.expand;delete x.collapse;}}
  else if(kind==='mriExtent')(state.mri[k]??={}).extent=v;
  else if(kind==='mriSoft')(state.mri[k]??={}).soft=v;
  else if(kind==='mriExpand')(state.mri[k]??={}).expand=v;
  else if(kind==='mriCollapse')(state.mri[k]??={}).collapse=v;
 }else if(t.hasAttribute('data-cno-region')){state.region=t.dataset.cnoRegion;state.focus=BONES.find(b=>b.group===state.region).id;}
 else if(t.hasAttribute('data-cno-bone'))state.focus=t.dataset.cnoBone;
 else if(t.hasAttribute('data-cno-normal')){for(const b of BONES.filter(b=>b.group===t.dataset.cnoNormal))if(!state.mri[b.id]?.active)state.mri[b.id]={active:'no'};}
 else if(t.hasAttribute('data-cno-reset')){const k=t.dataset.cnoReset;if(k==='classification')state.classification={entry:{},excl:{},domain:{}};if(k==='cdas')state.cdas={};if(k==='pedcno')state.pedcno={};if(k==='rinbo'){state.rinbo={};state.rinboMode='rinbo';}if(k==='cromris')state.mri={};}
 repaint();return true;}
function onInput(e){const t=e.target.closest('[data-cno-num]');if(!t)return false;state[t.dataset.cnoNum][t.dataset.key]=t.value;return true;}
function onChange(e){const t=e.target.closest('[data-cno-num]');if(!t)return false;
 const kind=t.dataset.cnoNum,key=t.dataset.key;state[kind][key]=t.value;
 if(kind==='rinbo'&&key==='count'){repaint();return true;}
 // Only refresh the result panel. Recreating all input fields on blur
 // would destroy focus on the next field and discard the user's typing.
 const route=decodeURIComponent(location.hash.slice(1)).split('/')[1]||'cno';
 const tmp=document.createElement('div');tmp.innerHTML=render(route);
 const fresh=tmp.querySelector('.cno-side'),current=document.querySelector('#app .cno-side');
 if(current&&fresh)current.innerHTML=fresh.innerHTML;
 return true;}
function onKeydown(e){if(e.key!=='Enter'&&e.key!==' ')return false;const t=e.target.closest('.cno-map-pin');if(!t)return false;e.preventDefault();state.region=t.dataset.cnoRegion;state.focus=BONES.find(b=>b.group===state.region).id;repaint();return true;}
return {render,onClick,onInput,onChange,onKeydown,state,TOOLS,BONES,REGIONS,CLSD,classificationResult,cdasResult,pedResult,rinboResult,mriResult,boneDone,boneScore};
})();
