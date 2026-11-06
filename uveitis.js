/* PedRheum Atlas v0.19 — Foeldvari et al. 2023, DOI 10.1002/acr.24963.
   Clinical flow for JIA-associated and idiopathic chronic anterior uveitis; page 5 Table 2.
   The guideline updates rather than replaces SHARE 2018. */
'use strict';
const UveitisFlow=(()=>{
const s={diagnosis:null,activity:null,poor:[],persist:null,topical:null,mtx:null,ada:null,optimized:null,third:null};
const source='https://doi.org/10.1002/acr.24963';
const checks=[['struct','Göz komplikasyonu','Posterior sineşi, band keratopatisi, glokom, katarakt, hipotoni, maküler ödem veya yoğun vitreus opasitesi'],['prior','Üveitin artritten önce başlaması','Olumsuz prognostik özellik olarak değerlendirilir'],['male','Erkek cinsiyet','Çalışmada bildirilen prognostik faktör']];
const choice=(k,v,t)=>`<button type="button" class="aav-choice ${s[k]===v?'active':''}" data-uv="${k}" data-value="${v}" aria-pressed="${s[k]===v}">${t}</button>`;
const block=(num,title,body)=>`<section class="aav-panel"><span class="step-tag">ADIM ${num}</span><h2>${title}</h2>${body}</section>`;
const note=(title,body,level='')=>`<article class="uv-reco"><strong>${title}</strong>${level?`<span class="uv-level">${level}</span>`:''}<p>${body}</p></article>`;
function selectedBad(){return s.poor.length>0}
function render(){const ready=!!s.diagnosis&&!!s.activity;const active=s.activity==='active';const poor=selectedBad();const duration=s.persist==='yes';const steroid=s.topical==='high';const systemic=poor||duration||steroid;let html=`<button type="button" class="breadcrumb-back" data-go="algorithms">← Algoritmalara dön</button>${cardsTitle('JİA ilişkili üveit / kronik anterior üveit','Foeldvari ve ark. 2023 · MIWGUC / SHARE güncellemesi · aşamalı tedavi akışı','v0.19 · 14 TEDAVİ ÖNERİSİ')}
<div class="info-banner"><span>Kaynak kapsamı: <b>JİA ilişkili üveit</b> ve <b>idiyopatik kronik anterior üveit</b>. Behçet, Blau, enfeksiyöz, intermediyer veya posterior üveit bu algoritmanın dışında. İki gözde inaktivite ve göz hekimi muayenesi tedavi kararlarının temelidir.</span></div>`;
html+=block(1,'Hastanın üveit tipi',`<div class="aav-choices">${choice('diagnosis','jiau','JİA ilişkili üveit')}${choice('diagnosis','cau','İdiyopatik kronik anterior üveit')}</div><p>Bu iki gruba aynı tedavi yaklaşımı uygulanır; ANA pozitifliği tek başına seçim ölçütü değildir.</p>`);
if(s.diagnosis)html+=block(2,'Hastalık aktivitesi',`<div class="aav-choices">${choice('activity','active','Aktif üveit')}${choice('activity','inactive','İnaktif üveit')}</div>`);
if(ready&&!active){html+=block(3,'İnaktif hastalık: sürdürme ve izlem',`${note('İnaktiviteyi doğrula','MIWGUC tanımı: her iki gözde ön kamarada inflamatuvar hücre 0; optik disk ve maküler ödem yok; vitreus haze &lt;0,5+; oftalmolog aktivite VAS = 0.')}${note('Devam eden ilaçları bireyselleştir','Bu 2023 makalesi spesifik ilaç kesme süresi veya azaltma protokolü tanımlamıyor. Mevcut tedaviyi yalnız bu kaynağa dayanarak kesme kararı verilmez.')}<p>İnaktivite tanımı ve kaynağın sınırlaması için makalenin 4. sayfasındaki Tablo 1'e bakın.</p>`);}
if(ready&&active){html+=block(3,'Kötü prognostik özellik var mı?',`<p>Birden fazla seçenek işaretlenebilir. Tek taraflı hastalık sistemik tedaviye engel değildir.</p><div class="aav-manifest">${checks.map(([id,label,desc])=>`<button type="button" class="aav-check ${s.poor.includes(id)?'active':''}" data-uv="poor" data-value="${id}" aria-pressed="${s.poor.includes(id)}"><span>${s.poor.includes(id)?'☑':'☐'}</span><span><b>${label}</b><small>${desc}</small></span></button>`).join('')}</div><p class="dose-muted">Başlangıç yaşı ve ANA pozitifliği bu makalede kötü prognoz göstergesi olarak sunulmaz.</p>`);
html+=block(4,'Üveit 3 aydan uzun süredir aktif mi?',`<div class="aav-choices">${choice('persist','yes','Evet, persistan')}${choice('persist','no','Hayır')}${choice('persist','unknown','Bilinmiyor')}</div>`);
if(s.persist)html+=block(5,'Topikal steroidle kontrol düzeyi',`<p>Bir gözde değil, tüm aktivite ve steroid bağımlılığı göz hekimiyle değerlendirilmelidir.</p><div class="aav-choices">${choice('topical','low','Az sayıda damlayla inaktif hâle gelebiliyor')}${choice('topical','high','İnaktivite için sık damla gerekiyor / kontrol edilemiyor')}${choice('topical','unclear','Henüz değerlendirilemedi')}</div>${note('Kaynak içindeki eşik farklılığı','Makalenin anlatım kısmında ≤3 damla/gün üst sınır ve en fazla 3 aylık değerlendirme belirtilirken, Tablo 2’de ≤2 damla/gün ifadesi kullanılmış. Bu farklılığı tek bir sayıya indirgemiyoruz; düşük damla hedefine ulaşamamak sistemik tedaviyi değerlendirme nedenidir.','2023, s.4–6')}`);
if(s.persist&&s.topical){html+=block(6,'Tedavi yaklaşımı — başlangıç',`${note('İlk basamak: topikal glukokortikoid','Prednizolon asetat %1 veya deksametazon %0,1 damla. Topikal/sistemik NSAİİ monoterapi olarak etkinlik göstermemiştir; yalnız destek tedavisi olabilir.','Öneri 1–3')}${systemic?note('Sistemik immünsüpresyonu başlat/değerlendir','Kötü prognostik faktör, 3 aydan uzun aktif hastalık veya topikal steroidle inaktivitenin korunamaması nedeniyle sistemik steroid-koruyucu tedavi yolu açılır. Tek taraflı tutulum engel değildir.','Öneri 4–5'):note('Yakın oftalmolojik değerlendirme','Kötü prognostik özellik seçilmedi, persistan hastalık veya steroid bağımlılığı gösterilmedi. Topikal ilk basamak ve göz hekimi izlemi; aktivite sürer veya komplikasyon gelişirse sistemik tedavi yolu yeniden değerlendirilir.','Öneri 1–5')}${note('Sistemik glukokortikoidin yeri','Gerekirse DMARD etkisi başlayana kadar köprü tedavisi, komplikasyon kurtarma tedavisi veya ameliyat çevresi destek olarak kullanılır; 3 aydan uzun sistemik GC monoterapisi önerilmez.','Öneri 6')}`);
if(systemic){html+=block(7,'Metotreksat durumu',`<div class="aav-choices">${choice('mtx','naive','MTX başlanmadı')}${choice('mtx','response','MTX ile yeterli yanıt')}${choice('mtx','fail','MTX yetersiz / tolere edilmiyor')}</div>${note('İlk sentetik DMARD: MTX','Sistemik tedavi gerektiğinde çoğu olguda ilk tercih metotreksattır. MTX intoleransında uygulama yolu değişikliği, folik asit düzenlemesi ve antiemetik yaklaşım değerlendirilebilir.','Öneri 7')}${note('MMF alternatifliği','Mikofenolat mofetil/mikofenolik asit üveit için bir seçenek olabilir; özellikle eklem hastalığının baskın olmadığı olguda. JİA artrit tedavisinin eşdeğeri değildir.','Öneri 8')}`);
if(s.mtx==='fail'){html+=block(8,'Adalimumab kullanımı ve yanıt',`<div class="aav-choices">${choice('ada','not','Henüz başlanmadı')}${choice('ada','good','Yeterli yanıt var')}${choice('ada','fail','Yetersiz yanıt / etkinlik kaybı')}</div>${note('MTX yetersizliği veya intoleransı','Adalimumab eklenmesi veya adalimumaba geçiş önerilir; ilk tercih monoklonal TNF inhibitörü olarak en güçlü kanıta sahiptir.','Öneri 9')}`);
if(s.ada==='fail'){html+=block(9,'Adalimumab optimizasyonu yapıldı mı?',`<div class="aav-choices">${choice('optimized','no','Hayır')}${choice('optimized','yes','Evet, yanıtsız')}${choice('optimized','unclear','Bilinmiyor')}</div>${note('Önce optimizasyonu değerlendir','Anti-ilaç antikorları ve farmakolojik yanıtı gözden geçir. Klinik uygunluk varsa doz/sıklık artırma, iki haftada bir uygulamadan haftalık uygulamaya geçiş düşünülebilir. Makale tek bir yüksek doz reçetesi belirlemiyor.','Öneri 10')}`);
if(s.optimized==='yes'){html+=block(10,'İleri basamak yanıtsızlık',`<div class="aav-choices">${choice('third','tnf','Başka monoklonal TNFi / tosilizumab değerlendiriliyor')}${choice('third','failed','Bu seçeneklere de dirençli')}</div>${note('Adalimumab sonrası seçenekler','İnfliksimab, golimumab veya sertolizumab gibi diğer TNFi (etanersept hariç) ya da tosilizumab düşünülebilir. Verilere göre ikinci sıradaki TNFi kanıtı infliksimab lehinedir.','Öneri 11, 13')}${note('Etanersept üveit tedavisinde kullanılmaz','Artritte etkili olabilir; JİA üveitini tedavi amacıyla önerilmez.','Öneri 12')}`);
if(s.third==='failed')html+=block(11,'Refrakter üveit seçenekleri',`${note('Abatasept, JAK inhibitörü veya rituksimab','Anti-TNF (etanersept dışındaki) ve tosilizumaba dirençli olgularda değerlendirilebilir. Makale bu üç seçenek arasında kanıta dayalı kesin bir sıralama tanımlamıyor.','Öneri 14')}${note('İlaç seçiminin gerekçesi','Gözdeki komplikasyonlar, eşlik eden artrit, önceki dozlar/yanıt, yan etki ve oftalmoloji-romatoloji ortak kararı belirleyicidir. İlgili 2023 çalışmasının kanıtları daha yeni araştırmaları içermiyor.')}`);
}
}
}
}
}
}
html+=`<section class="aav-panel"><h2>Öneri dökümü (14 başlık)</h2><details class="uv-appendix"><summary>Makaledeki önerilerin tamamını aç</summary><ol>${[
'Aktif JİA üveiti / kronik anterior üveit genellikle hemen tedavi gerektirir.',
'Topikal prednizolon asetat %1 veya deksametazon %0,1 ilk basamaktır.',
'Topikal ve sistemik NSAİİ monoterapi olarak etkili değildir.',
'Kötü prognostik faktör ve/veya persistan aktif hastalıkta, taraf ayrımı olmaksızın sistemik immünsüpresyon önerilir.',
'Az damla topikal steroidle inaktivite sağlanamıyorsa sistemik tedavi önerilir (metin ve Tablo 2 eşikleri farklı yazılmıştır).',
'Sistemik glukokortikoidler DMARD etkisine kadar köprü tedavisidir.',
'İlk sentetik DMARD genellikle metotreksattır.',
'MMF veya mikofenolik asit üveit için alternatif olabilir.',
'MTX/csDMARD yanıtsızlığı veya intoleransında adalimumab ekle/geç.',
'Adalimumab yanıtsızlığı veya etkinlik kaybında doz/sıklık artırımı değerlendir.',
'Adalimumab başarısızlığında başka TNFi (etanersept hariç) veya tosilizumab düşünülebilir.',
'Etanersept üveit tedavisi için önerilmez.',
'TNFi arasında adalimumab için kanıt en güçlü; ardından infliksimab, golimumab ve sertolizumab gelir.',
'TNFi ve tosilizumaba dirençte abatasept, JAK inhibitörleri veya rituksimab değerlendirilebilir.'
].map((x,i)=>`<li><b>${i+1}.</b> ${x}</li>`).join('')}</ol></details><p><a href="${source}" target="_blank" rel="noopener noreferrer">Kaynak: Foeldvari ve ark., Arthritis Care &amp; Research 2023;75:975–982 · DOI:10.1002/acr.24963 ↗</a></p><button type="button" class="reset-button" data-uv="reset">Baştan başla</button></section>`;
return html;}
function onClick(ev){const el=ev.target.closest('[data-uv]');if(!el)return false;const k=el.dataset.uv,v=el.dataset.value;if(k==='reset'){s.diagnosis=null;s.activity=null;s.poor=[];s.persist=null;s.topical=null;s.mtx=null;s.ada=null;s.optimized=null;s.third=null;}
else if(k==='poor'){s.poor=s.poor.includes(v)?s.poor.filter(x=>x!==v):[...s.poor,v];s.mtx=null;s.ada=null;s.optimized=null;s.third=null;}
else{const order=['diagnosis','activity','persist','topical','mtx','ada','optimized','third'];s[k]=v;for(const z of order.slice(order.indexOf(k)+1))s[z]=null;if(k==='activity')s.poor=[];}
const root=document.getElementById('app');if(root)root.innerHTML=render();return true;}
return {render,onClick};
})();
