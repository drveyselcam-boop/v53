'use strict';
/* Published guideline library. Guideline year and publication year shown separately. */
const GuidelineLibrary=(()=>{
 const items=[
 ['FMF','EULAR/PReS','2024','2025','Çocuk + erişkin','https://doi.org/10.1016/j.ard.2025.01.028','Ailesel Akdeniz ateşi · Tedavi ve izlem'],
 ['Still / sJİA','EULAR/PReS','2024','2024','Çocuk + erişkin','https://doi.org/10.1136/ard-2024-225851','Still hastalığı · Sistemik JİA ve erişkin Still'],
 ['sJİA','APLAR','2026','2026','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC13458428/','Sistemik JİA · Asya-Pasifik uzlaşı önerileri'],
 ['JİA','ACR/AF','2019','2019','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC6561125/','Poliartrit · Sakroiliit · Entezit'],
 ['JİA','ACR','2021','2022','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC10124899/','Oligoartrit · TME · Sistemik JİA'],
 ['JİA · Üveit','ACR/AF','2019','2019','Çocuk','https://rheumatology.org/juvenile-idiopathic-arthritis-guideline','JİA ilişkili üveit · Tarama ve tedavi'],
 ['Aşılama','ACR','2022','2023','Çocuk + erişkin','https://pmc.ncbi.nlm.nih.gov/articles/PMC10291822/','Romatolojik hastalıklarda aşılama'],
 ['Aşılama','EULAR/PReS','2021','2023','Çocuk','https://ard.bmj.com/content/82/1/35','Pediatrik otoimmün romatolojik hastalıklar'],
 ['PsA','EULAR','2023','2024','Erişkin','https://pmc.ncbi.nlm.nih.gov/articles/PMC11103320/','Psöriatik artrit · Farmakolojik tedavi'],
 ['PsA','GRAPPA','2021','2022','Erişkin','https://pmc.ncbi.nlm.nih.gov/articles/PMC9244095/','Psöriatik artrit · Tutulum alanlarına göre tedavi'],
 ['SLE','ACR','2025','2026','Çocuk + erişkin','https://pubmed.ncbi.nlm.nih.gov/41182321/','Sistemik lupus · Ekstrarenal tutulum'],
 ['Lupus nefriti','ACR','2024','2025','Çocuk + erişkin','https://doi.org/10.1002/acr.25528','Lupus nefriti · Tarama ve tedavi'],
 ['Lupus nefriti','EULAR','2025','2026','Çocuk + erişkin','https://pubmed.ncbi.nlm.nih.gov/41107121/','SLE ile böbrek tutulumu'],
 ['Sistemik skleroz','EULAR','2023','2025','Erişkin','https://doi.org/10.1136/ard-2024-226430','Sistemik skleroz · Organlara göre tedavi'],
 ['AAV','BSR','2025','2025','Çocuk + erişkin','https://doi.org/10.1093/rheumatology/keaf240','ANCA ilişkili vaskülit'],
 ['AAV','EULAR','2022','2024','Çoğunlukla erişkin','https://ard.bmj.com/content/83/1/30','GPA · MPA · EGPA'],
 ['AAV','ACR/VF','2021','2021','Çocuk + erişkin','https://rheumatology.org/vasculitis-guideline','ANCA ilişkili vaskülit'],
 ['Behçet','EULAR','2025','2026','Çoğunlukla erişkin','https://doi.org/10.1016/j.ard.2026.02.009','Behçet sendromu · Güncelleme'],
 ['Behçet','BSR/BAD','2025','2025','Çocuk + erişkin','https://www.rheumatology.org.uk/guidelines','Behçet · Living guideline'],
 ['Romatoid artrit','EULAR','2025','2026','Erişkin','https://doi.org/10.1016/j.ard.2026.01.023','RA · csDMARD ve biyolojik tedavi'],
 ['Aksiyel SpA','ASAS/EULAR','2022','2023','Erişkin','https://www.asas-group.org/asas-eular-recommendations-for-the-management-of-axspa-2022-update/','Aksiyel spondiloartrit · Tedavi'],
 ['Aksiyel SpA','BSR','2025','2025','Erişkin','https://www.rheumatology.org.uk/guidelines','Biyolojik ve hedefe yönelik tedaviler'],
 ['Büyük damar vasküliti','EULAR','2025','2026','Çoğunlukla erişkin','https://www.eular.org/recommendations-management','PMR ve primer büyük damar vasküliti'],
 ['csDMARD izlem','BSR','2025','2025','Çocuk + erişkin','https://www.rheumatology.org.uk/guidelines','DMARD reçetelendirme ve izlem'],

 ['SHARE · JDM','SHARE/PReS','2016','2017','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC5284351/','Juvenil dermatomiyozit · Tanı ve tedavi'],
 ['SHARE · Üveit','SHARE/PReS','2018','2018','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC6059050/','JİA ilişkili üveit · Tarama ve tedavi'],
 ['SHARE · Üveit','MIWGUC','2022','2023','Çocuk','https://doi.org/10.1002/acr.24963','JİA ilişkili ve kronik anterior üveit · Güncelleme'],
 ['SHARE · SLE','SHARE/PReS','2017','2017','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','Çocukluk başlangıçlı SLE · Tanı ve tedavi önerileri'],
 ['SHARE · Lupus nefriti','SHARE/PReS','2017','2017','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','Çocukluk başlangıçlı lupus nefriti'],
 ['SHARE · APS','SHARE/PReS','2017','2017','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','Pediatrik antifosfolipid sendromu'],
 ['SHARE · Otoinflamasyon','SHARE/PReS','2015','2015','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','Pediatrik otoinflamatuvar hastalıklar'],
 ['JDM · Treat-to-target','PReS/CARRA','2025','2025','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC12229752/','Juvenil dermatomiyozit · Hedefe yönelik tedavi'],
 ['JDM · CARRA','CARRA','CTP','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','İndüksiyon · İdame · Persistan deri · Refrakter JDM'],
 ['CARRA · JİA','CARRA','CTP','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','Sistemik ve poliartiküler JİA · Uzlaşı tedavi planları'],
 ['CARRA · CNO','CARRA','2018','2018','Çocuk','https://pmc.ncbi.nlm.nih.gov/articles/PMC5938153/','CRMO / CNO · Uzlaşı tedavi planları'],
 ['CARRA · AAV','CARRA','CTP','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','Şiddetli pediatrik AAV · Uzlaşı tedavi planı'],
 ['CARRA · Lupus nefriti','CARRA','CTP','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','Lupus nefriti · Uzlaşı tedavi planı'],
 ['CARRA · Morfea','CARRA','CTP','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','Juvenil lokalize skleroderma · Uzlaşı tedavi planı'],
 ['CARRA · PFAPA','CARRA','CTP','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','PFAPA · Uzlaşı tedavi planı'],
 ['SLE','EULAR','2023','2024','Çoğunlukla erişkin','https://doi.org/10.1136/ard-2023-224762','Sistemik lupus eritematozus · Farmakolojik tedavi'],
 ['Lupus nefriti','KDIGO','2024','2024','Çocuk + erişkin','https://kdigo.org/guidelines/lupus-nephritis/','Lupus nefriti · KDIGO rehberi ve ekleri'],
 ['Lupus nefriti','EULAR/ERA-EDTA','2019','2020','Çoğunlukla erişkin','https://ard.bmj.com/content/79/6/713','Lupus nefriti · Önceki öneriler'],
 ['AAV · GPA/MPA','ACR/VF','2021','2021','Çocuk + erişkin','https://rheumatology.org/vasculitis-guideline','GPA/MPA · Remisyon indüksiyonu ve idame'],
 ['AAV · EGPA','ACR/VF','2021','2021','Çocuk + erişkin','https://rheumatology.org/vasculitis-guideline','EGPA · ACR/VF önerileri'],
 ['AAV','BSR','2025','2025','Çocuk + erişkin','https://pmc.ncbi.nlm.nih.gov/articles/PMC12316377/','GPA · MPA · EGPA · BSR tam metin'],
 ['Miyozit · JDM','BSR','2022','2022','Çocuk + erişkin','https://www.rheumatology.org.uk/guidelines','İdiyopatik inflamatuvar miyopatiler · JDM dahil'],
 ['Vaskülit','BSR','2025','2025','Çocuk + erişkin','https://www.rheumatology.org.uk/guidelines','BSR kılavuz kütüphanesi · Vaskülit ve Behçet'],
 ['İmmünsüpresyon izlem','BSR','2025','2025','Çocuk + erişkin','https://www.rheumatology.org.uk/guidelines','DMARD güvenlilik ve laboratuvar izlem önerileri'],
 ['JİA · MTX','MARAJIA','2018','2018','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','JİA · Metotreksat uygulama ve takip uzlaşısı'],
 ['JİA · Treat-to-target','PReS','2018','2018','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','JİA · Hedefe yönelik tedavi önerileri'],

 ['Lupus nefriti','KDIGO','2024','2024','Çocuk + erişkin','https://kdigo.org/wp-content/uploads/2024/01/KDIGO-2024-Lupus-Nephritis-Guideline.pdf','Tam metin · KDIGO 2024 (PDF)'],
 ['Lupus nefriti','KDIGO','2024','2024','Çocuk + erişkin','https://kdigo.org/wp-content/uploads/2024/01/KDIGO-2024-Lupus-Nephritis-Guideline_Executive-Summary.pdf','Özet · KDIGO 2024 (PDF)'],
 ['Lupus nefriti','EULAR','2025','2026','Çocuk + erişkin','https://doi.org/10.1016/j.ard.2025.09.007','2025 güncellemesi · Böbrek tutulumlu SLE'],
 ['Lupus nefriti','ACR','2024','2025','Çocuk + erişkin','https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/acr.25528','ACR özgün yayın · Tedavi / tarama / izlem'],
 ['Lupus nefriti','KDIGO','2024','2024','Çocuk + erişkin','https://kdigo.org/guidelines/lupus-nephritis/','Ekler · Uygulama noktaları · Klinik özetler'],
 ['Lupus nefriti','SHARE/PReS','2017','2017','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','Pediatrik lupus nefriti · SHARE kaynak arşivi'],
 ['SLE','ACR','2025','2026','Çocuk + erişkin','https://doi.org/10.1002/acr.25690','Ekstrarenal SLE · Güncel özgün makale'],
 ['Vaskülit · GCA / TAK / PMR','EULAR','2025','2026','Çoğunlukla erişkin','https://pubmed.ncbi.nlm.nih.gov/42481270/','Polimiyalji romatika ve büyük damar vasküliti'],
 ['Romatoloji · kılavuz dizini','EULAR','Arşiv','Güncel sayfa','Çocuk + erişkin','https://www.eular.org/recommendations-management','EULAR · Tüm tedavi önerileri, güncellemeler'],
 ['Romatoloji · kılavuz dizini','ACR','Arşiv','Güncel sayfa','Çocuk + erişkin','https://rheumatology.org/clinical-practice-guidelines','ACR · Tüm klinik uygulama kılavuzları'],
 ['Romatoloji · kılavuz dizini','BSR','Arşiv','Güncel sayfa','Çocuk + erişkin','https://www.rheumatology.org.uk/guidelines','BSR · Kılavuzlar, izlem ve tedavi'],
 ['Pediatrik romatoloji · dizin','PReS','Arşiv','Güncel sayfa','Çocuk','https://www.pres.eu/clinical-affairs/share-recommendations.html','SHARE · Pediatrik uzlaşı belgeleri'],
 ['Pediatrik romatoloji · dizin','CARRA','Arşiv','Güncel sayfa','Çocuk','https://carragroup.org/research/consensus-treatment-plans/','CTP · JDM, JİA, CNO, SLE, vaskülit ve diğerleri'],
 ['Nefroloji · glomerülonefrit','KDIGO','Arşiv','Güncel sayfa','Çocuk + erişkin','https://kdigo.org/guidelines/','KDIGO · Glomerüler hastalıklar ve böbrek rehberleri'],
 ];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const GROUPS=[
 ['JİA ve üveit',/^(JİA|SHARE · Üveit|CARRA · JİA)/],
 ['Otoinflamatuvar hastalıklar ve CNO',/^(FMF|Still|sJİA|SHARE · Otoinflamasyon|CARRA · CNO|CARRA · PFAPA)/],
 ['SLE, lupus nefriti ve APS',/^(SLE|Lupus nefriti|SHARE · SLE|SHARE · Lupus nefriti|SHARE · APS|CARRA · Lupus nefriti)/],
 ['Vaskülit ve Behçet',/^(AAV|Behçet|Vaskülit|Büyük damar vasküliti|CARRA · AAV)/],
 ['JDM ve skleroderma',/^(SHARE · JDM|JDM|Miyozit|Sistemik skleroz|CARRA · Morfea)/],
 ['Artrit ve spondiloartrit (erişkin)',/^(PsA|Romatoid artrit|Aksiyel SpA)/],
 ['Aşılama ve ilaç izlemi',/^(Aşılama|csDMARD izlem|İmmünsüpresyon izlem)/],
 ['Kurum kılavuz dizinleri',/dizin|Nefroloji · glomerülonefrit/i]
 ];
 function groupFor(x){const match=GROUPS.find(g=>g[1].test(x[0]));return match?match[0]:'Diğer kılavuzlar';}
 function cleanName(x){let n=x[0].replace(/^SHARE · /,'').replace(/^CARRA · /,'').replace(/^JDM · CARRA$/,'JDM').replace(/^JDM · Treat-to-target$/,'JDM').replace(/^JİA · Treat-to-target$/,'JİA').replace(/^JİA · MTX$/,'JİA').replace(/^AAV · (GPA\/MPA|EGPA)$/,'AAV').replace(/^Vaskülit · GCA \/ TAK \/ PMR$/,'Büyük damar vasküliti').replace(/^Miyozit · JDM$/,'JDM').replace(/^SHARE · /,'');
 if(n.includes('dizin')||n.startsWith('Nefroloji ·'))return x[1]+' kılavuz dizini';
 if(n==='İmmünsüpresyon izlem')return 'DMARD izlem';
 if(n==='csDMARD izlem')return 'DMARD izlem';
 return n;
 }
 const getId=x=>`${cleanName(x)}-${/^\d{4}$/.test(x[2])?x[2]:x[2]==='CTP'?'CTP':'Arşiv'}-${x[1]}`;
 // Aynı belgenin farklı URL'lerini tek kayıtta tut; farklı içerik / konular korunur.
 function records(){const out=[],byKey=new Map();for(const x of items){const topic=cleanName(x),id=getId(x);let key=[id,x[6].replace(/Tam metin · |Özet · |Ekler · |ACR özgün yayın · |2025 güncellemesi · /g,'')].join('|');
 // Aynı lupus nefriti kılavuzunun PDF / özet / kurum sayfasını birleştir.
 if(topic==='Lupus nefriti'&&['KDIGO','ACR','EULAR','SHARE/PReS'].includes(x[1]))key=id;
 if(topic==='SLE'&&x[1]==='ACR')key=id;
 if(topic==='AAV'&&x[1]==='BSR')key=id;
 if(topic==='DMARD izlem'&&x[1]==='BSR')key=id;
 if(topic==='JİA'&&x[1]==='ACR/AF')key=id;
 if(!byKey.has(key)){const record={id,topic,year:x[2],pub:x[3],org:x[1],pop:x[4],desc:x[6],links:[],group:groupFor(x)};byKey.set(key,record);out.push(record);}
 const rec=byKey.get(key);if(!rec.links.some(y=>y.url===x[5]))rec.links.push({url:x[5],label:x[6]});
 }return out;}
 const data=records();
 function filters(){return `<div class="gl-tools"><input id="gl-search" type="search" placeholder="Hastalık, yıl veya kurum ara" autocomplete="off" aria-label="Kılavuzlarda ara"><select id="gl-area" aria-label="Kılavuz grubu"><option value="">Tüm hastalık grupları</option>${GROUPS.map(g=>`<option value="${esc(g[0])}">${esc(g[0])}</option>`).join('')}</select><select id="gl-pop" aria-label="Hasta grubu"><option value="">Tüm yaş grupları</option><option value="Çocuk">Çocuk içeren</option><option value="Erişkin">Erişkin içeren</option></select></div>`;}
 function render(){return `<div class="gl-page"><div class="dose-page-head"><h1>Kılavuzlar</h1><p>Hastalık gruplarına göre kılavuzlar ve uzlaşı tedavi planları</p></div>${filters()}<div id="gl-list">${cards()}</div><p class="gl-foot">Başlık biçimi: Hastalık – kılavuz yılı – kurum. Yayın yılı farklıysa ayrıca gösterilir. CTP ve arşiv kayıtlarında doğrulanmış tek bir yıl bulunmadığında yıl yerine belge türü belirtilir. Erişkin kılavuzları pediatrik öneri olarak yorumlanmamalıdır.</p></div>`;}
 function card(x){const primary=x.links[0];return `<article class="gl-item"><div class="gl-item-top"><h3>${esc(x.id)}</h3></div><p>${esc(x.desc)}</p><div class="gl-meta"><span>${esc(x.pop)}</span>${x.pub!==x.year?`<span>Yayın: ${esc(x.pub)}</span>`:''}</div><div class="gl-links"><a href="${esc(primary.url)}" target="_blank" rel="noopener noreferrer">Kaynağı aç ↗</a>${x.links.slice(1).map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${/Özet/.test(l.label)?'Özet':/PDF|Tam metin/.test(l.label)?'PDF / tam metin':/Ekler/.test(l.label)?'Ekler':'Alternatif bağlantı'} ↗</a>`).join('')}</div></article>`;}
 function cards(q='',pop='',area=''){const s=q.toLocaleLowerCase('tr');const matches=data.filter(x=>[x.id,x.topic,x.desc,x.org,x.group,String(x.pub)].join(' ').toLocaleLowerCase('tr').includes(s)&&(!pop||x.pop.includes(pop))&&(!area||x.group===area));if(!matches.length)return '<div class="empty-state">Eşleşen kılavuz bulunamadı.</div>';return GROUPS.map(g=>{const group=matches.filter(x=>x.group===g[0]);if(!group.length)return '';return `<section class="gl-group"><div class="gl-group-heading"><h2>${esc(g[0])}</h2><span>${group.length} kayıt</span></div><div class="gl-list">${group.map(card).join('')}</div></section>`;}).join('')+((matches.some(x=>x.group==='Diğer kılavuzlar'))?`<section class="gl-group"><div class="gl-group-heading"><h2>Diğer kılavuzlar</h2></div><div class="gl-list">${matches.filter(x=>x.group==='Diğer kılavuzlar').map(card).join('')}</div></section>`:'');}
 function onInput(e){if(!['gl-search','gl-pop','gl-area'].includes(e.target.id))return false;const el=document.getElementById('gl-list');if(el)el.innerHTML=cards(document.getElementById('gl-search')?.value||'',document.getElementById('gl-pop')?.value||'',document.getElementById('gl-area')?.value||'');return true;}
 return {render,onInput};
})();
