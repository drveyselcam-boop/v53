/* Çocuk Romatoloji – SUT rapor ön kontrolü (02.10.2026 kullanıcı mevzuat paketi).
 * Yapay zekâ yoktur; her metin hekim girişlerinden deterministik üretilir.
 * Mülga/üstü çizili Word parçaları karar kurallarına aktarılmamıştır.
 */
const SUTSupport=(()=>{
 const SOURCE='02.10.2026 tarihli, değişiklikleri işlenmiş 2013 SUT';
 const rules=[
 {id:'fmf-anak',group:'FMF',drug:'Anakinra',scenario:'Amiloidoz olmadan ilk başlangıç',ref:'SUT 4.2.1.C-7 (2)(a)(1), (2)(a)(5)',mode:'standard',intro:'Amiloidozu olmayan FMF için anakinra başlangıcının ön kontrolü.', fields:[
 ['age','Hasta yaşı (yıl)','number'],['weight','Vücut ağırlığı (kg)','number'],['colMonths','Toplam kolşisin kullanım süresi (ay)','number'],['colHistory','Yurt içi ve yurt dışı kolşisin preparatları, dozları, tarihleri ve yanıtı','textarea'],['attacks','Son 3 aydaki belgeli atak sayısı','number'],['crpDates','Atak CRP ölçüm tarihleri ve sonuçları (birimler ve normal üst sınırlar dahil)','textarea']],
 checks:[['amyloid','AA amiloidoz yokluğu klinik olarak doğrulandı'],['col','Kolşisin tolere edilen maksimum dozda kullanıldı; önce yurt içi, yanıtsızsa yurt dışı preparat basamakları değerlendirildi'],['crp','Atak CRP ölçümleri en az 15 gün aralıklı ve normal üst sınırın en az iki katı'],['board','Resmî üçüncü basamak sağlık kurulunda romatoloji uzmanı ve reçete yetkisi koşulları teyit edildi']],validate(s,c){const problems=[];if(!(num(s.age)>=2))problems.push('Yaş en az 2 olmalı.');if(!(num(s.weight)>7.5))problems.push('Ağırlık 7,5 kg üzerinde olmalı.');if(!(num(s.colMonths)>=6))problems.push('En az 6 aylık kolşisin kullanımı gösterilmeli (ciddi intolerans ayrı değerlendirilir).');if(!s.colHistory?.trim())problems.push('Yurt içi / yurt dışı kolşisin kullanım öyküsü ve yanıtı raporda belirtilmeli.');if(!(num(s.attacks)>=3))problems.push('Son 3 ayda en az 3 belgeli atak gerekli.');if(!s.crpDates?.trim())problems.push('Atak CRP tarihleri, sonuçlar ve normal üst sınırlar girilmeli.');return problems;},generate(s){return `Amiloidozu olmayan FMF tanılı hastanın yaşı ${s.age} yıl, ağırlığı ${s.weight} kg'dır. Tolere edilebilen maksimum dozda kolşisin tedavisi toplam ${s.colMonths} ay uygulanmıştır. Kolşisin preparat öyküsü: ${s.colHistory.trim()}. Son 3 ayda akut faz reaktanı yüksekliği ile belgelenmiş ${s.attacks} atak bulunmaktadır. Atak dönemlerine ilişkin CRP tarihleri, sonuçları ve normal üst sınırları: ${s.crpDates.trim()}. Yukarıdaki tedavi geçmişi ve klinik veriler esas alınarak anakinra tedavisi planlanmıştır.`;}},
 {id:'fmf-cana',group:'FMF',drug:'Kanakinumab',scenario:'Anakinra sonrası geçiş',ref:'SUT 4.2.1.C-7 (2)(a)(2), (2)(a)(5)',mode:'standard',intro:'Üç ay düzenli anakinra sonrası yetersiz yanıt veya ciddi yan etki ayrımı.',fields:[['age','Yaş (yıl)','number'],['anakMonths','Kesintisiz anakinra süresi (ay)','number'],['attacks','Son 3 ayda belgeli atak','number'],['crpDates','Atak CRP tarihleri / sonuçları / normal üst sınırları','textarea']],checks:[['ineffect','Tedavi değişim nedeni yetersiz yanıttır (yan etki ayrı yoldur)'],['crp','Ataklar en az 15 gün aralıklı CRP ≥2× normal üst sınır ile belgeli'],['board','Romatoloji uzmanlı resmî üçüncü basamak sağlık kurulu ve reçete yetkisi teyit edildi']],validate(s,c){let a=[];if(!(num(s.age)>=2))a.push('Yaş en az 2 olmalı.');if(!(num(s.anakMonths)>=3))a.push('Kesintisiz anakinra en az 3 ay olmalı.');if(!(num(s.attacks)>=(num(s.age)<18?2:3)))a.push('Atak sayısı yaşa göre gerekli eşiğin altında.');if(!s.crpDates?.trim())a.push('CRP belgeleri eksik.');return a;},generate(s){return `FMF tanılı ${s.age} yaşındaki hastada kesintisiz ${s.anakMonths} ay anakinra tedavisine karşın son 3 ay içinde ${s.attacks} belgeli atak gözlenmiştir. Atak dönemlerinde en az 15 gün aralıklı CRP tetkikleri (tarih/sonuç/normal üst sınır): ${s.crpDates.trim()}. Anakinra tedavisine yetersiz yanıt nedeniyle kanakinumab tedavisine geçiş planlanmıştır.`;}},
 {id:'fmf-amy',group:'FMF',drug:'Anakinra',scenario:'Biyopsiyle kanıtlı AA amiloidoz',ref:'SUT 4.2.1.C-7 (2)(b)',mode:'standard',intro:'FMF + AA amiloidozunda biyopsi kanıtı ve ayrı rapor yetkisi.',fields:[['biopsy','AA amiloidoz biyopsi tarihi ve doku','text']],checks:[['amy','Biyopsi ile AA tipi amiloidoz doğrulandı'],['board','Resmî sağlık kurulunda romatoloji ve/veya nefroloji uzmanı bulunuyor'],['rx','Üçüncü basamak sağlık hizmet sunucusunda reçete ve en fazla 1 yıllık rapor koşulları gözden geçirildi']],validate(s){return s.biopsy?.trim()?[]:['Biyopsi bilgisi eksik.'];},generate(s){return `FMF tanılı hastada ${s.biopsy.trim()} biyopsisi ile AA tipi amiloidoz kanıtlanmıştır. SUT 4.2.1.C-7 (2)(b) kapsamında anakinra tedavisi planlanmıştır.`;}},
 {id:'jia-tnf',group:'JİA',drug:'Anti-TNF (sınıf)',scenario:'Poliartiküler JİA ilk başlangıç',ref:'SUT 4.2.1.C-1 (1)(b)(1)',mode:'standard',intro:'Poliartiküler juvenil romatoid artrit için ilk anti-TNF raporu.',fields:[['dmardHistory','Kullanılan DMARD (ilaç, süre, doz)','text'],['acr','ACR pediatrik yanıtı / değerlendirilen tarih','text']],checks:[['nsaid','NSAİ tedavisi uygulanmış'],['dmardUsed','En az bir DMARD en az 3 ay kullanılmış'],['response','ACR pediatrik 30 yanıtı alınamamış'],['uveitis','Üveit varlığı ve varsa adalimumab ilk tercih koşulu değerlendirildi'],['board','Üç aylık sağlık kurulu raporu ve reçete yetkisi ayrıca doğrulandı']],validate(s){const p=[];if(!s.dmardHistory?.trim())p.push('DMARD öyküsü yazılmalı.');if(!s.acr?.trim())p.push('ACR pediatrik yanıtı yazılmalı.');return p;},generate(s){return `Poliartiküler JİA tanılı hastada NSAİ ve DMARD tedavilerine rağmen ACR pediatrik 30 yanıtı elde edilememiştir. Ön tedavi: ${s.dmardHistory.trim()}. ACR pediatrik değerlendirme: ${s.acr.trim()}. Anti-TNF tedavisi için sağlık kurulu değerlendirmesi planlanmıştır.`;}},
 {id:'cno-tnf',group:'CNO',drug:'Anti-TNF (sınıf)',scenario:'Endikasyon dışı onay ve katılım payı',ref:'EK-4/D §15.10 Osteomiyelit (M86.3–M86.6), §15.10.1',mode:'warning',intro:'CNO için anti-TNF endikasyon dışı onayı, EK-4/D muafiyeti oluşturmaz.',fields:[['approval','Endikasyon dışı onay tarihi / sayı (varsa)','text'],['icd','Hastalık ICD kodu','text']],checks:[['permission','Endikasyon dışı kullanım onayı/istisnası resmî olarak kontrol edildi'],['exemption','EK-4/D §15.10’da osteomiyelit için antibiyotikler listelendiği ve anti-TNF’nin burada yer almadığı kontrol edildi'],['code','MEDULA rapor teşhis kodu ve katılım payı türü kurum/SGK uygulaması üzerinden teyit edildi']],validate(s){return !s.approval?.trim()?['Endikasyon dışı onay bilgisi veya muafiyet açıklaması girilmeli.']:[];},generate(s){return `CNO (ICD: ${s.icd?.trim()||'belirtilmedi'}) tanısıyla anti-TNF kullanımı için endikasyon dışı onay bilgisi: ${s.approval.trim()}. EK-4/D §15.10 kapsamında bu tanı için anti-TNF katılım payı muafiyeti listelenmediğinden, raporun katılım payı ve MEDULA teşhis türü ayrıca teyit edilmelidir.`;}}
 ];
 // Extended full-path IL-1 inhibitor report scenarios; replace legacy partial FMF entries.
 // SURF: clinical diagnosis maps to EK-4/D periodic fever heading; NOT an automatic on-label SUT pathway.
 for(const drug of ['Anakinra','Kanakinumab'])rules.push({
  id:'surf-'+(drug==='Anakinra'?'anak':'cana'),group:'SURF',drug,scenario:'Endikasyon dışı kullanım onayıyla rapor',
  ref:'EK-4/D 15.16 (R50.9); MEDULA 21.01 / 20.01 açıklamaları',mode:'warning',
  intro:'SURF klinik tanısı için periyodik ateş (R50.9) muafiyet eşleşmesi kontrol edilir. Bu, ruhsatlı endikasyon veya otomatik SGK ödeme onayı değildir.',
  fields:[['age','Yaş (yıl)','number'],['approvalNo','Sağlık Bakanlığı endikasyon dışı kullanım onay tarihi / sayısı','text'],['clinical','Klinik bulgular ve daha önceki tedaviler','textarea'],['dose','Planlanan doz ve uygulama aralığı','text']],
  checks:[['approvalVerified','Hasta bazında Bakanlık onayı veya geçerli mevzuat istisnası belgelerde doğrulandı'],['sourceVerified','EK-4/D 15.16 yıldız dipnotu, EK-4/A ve ilgili özel koşullar kontrol edildi']],
  validate(f){let e=[];if(!(num(f.age)>0))e.push('Geçerli yaş gerekli.');if(!f.approvalNo?.trim())e.push('Onay tarihi/sayısı girilmeli.');if(!f.clinical?.trim())e.push('Klinik bilgi girilmeli.');if(!f.dose?.trim())e.push('Doz ve aralık yazılmalı.');return e;},
  generate(f){return `SURF (sınıflandırılamayan tekrarlayan ateş) klinik tanısıyla izlenen ${f.age} yaşındaki hastada bulgular ve önceki tedaviler: ${f.clinical.trim()}. ${drug} tedavisi için Sağlık Bakanlığı endikasyon dışı kullanım onayı: ${f.approvalNo.trim()}. Planlanan doz/uygulama: ${f.dose.trim()}. Bu açıklamada kullanılan ICD-10 rapor tanısı: R50.9 (periyodik ateş başlığı).`;}
 });
 rules.splice(0,3,...SUT_IL1_RULES);
 rules.push(...SUT_OTHER_RULES);
 rules.push(...SUT_NEXT_RULES);
 rules.push(...SUT_V44_RULES);
 const MEDULA_URL='https://medeczane.sgk.gov.tr/doktor/faces/SaglikTesisiReceteVeRaporWebServisleri.pdf';
 // These are verified entries from the supplied 02.10.2026 EK-4/D; not a complete list.
 const exemptPairs=EK4D_DATA;
 const matchIcd=(pattern,icd)=>pattern===icd || (pattern.indexOf('.')<0 && icd.startsWith(pattern+'.'));
 const findPairs=(drug,icd)=>exemptPairs.filter(x=>matchIcd(x.icd,icd) && (x.drug===drug || (x.drug==='Anti-TNF (ilaç grubu)' && ['Adalimumab','Etanersept','İnfliksimab','Golimumab','Sertolizumab'].includes(drug))));
 function renderSearch(){return `<div class="resource-card"><h3>5. EK-4/D · Romatoloji ilaç–tanı eşleştirme tablosu</h3><p>02.10.2026 kaynaklı ${exemptPairs.length} kaynak satırı. Kaynak maddesi, yıldız ve kısıtları ile birlikte aranır. Grup satırları ve koşullu eşleşmeler kesin muafiyet kararı vermez.</p><label class="sut-field"><span>İlaç, ICD veya tanı arayın</span><input class="sut-input" data-sut-search="query" placeholder="Örn. anakinra / R50.9 / psöriatik"></label><div id="sutMatches">${renderMatches('')}</div></div>`;}
 function renderMatches(q){let f=exemptPairs.filter(x=>!q||[x.drug,x.icd,x.heading,x.clause].join(' ').toLocaleLowerCase('tr').includes(q.toLocaleLowerCase('tr')));return `<p>${f.length} eşleşme kaydı ${f.length>100?'(ilk 100 gösteriliyor)':''}</p><div style="overflow-x:auto"><table class="data-table" style="width:100%;font-size:0.83rem"><thead><tr><th>İlaç</th><th>ICD</th><th>EK-4/D maddesi</th><th>Durum / özel şart</th></tr></thead><tbody>${f.slice(0,100).map(x=>`<tr><td>${esc(x.drug)}</td><td>${esc(x.icd)}</td><td>${esc(x.clause)}</td><td>${x.star?'* Yıldızlı · ':''}${x.scope==='group'?'Grup satırı · ':''}${esc(x.note)}</td></tr>`).join('')}</tbody></table></div><p class="sut-source">EK-4/D NOT 1: EK-4/A'da bulunmayan ilaç ödenmez. NOT 2: yıldızlı etken maddelerde endikasyon uyumu veya yetkili Bakanlık izni gerekir. NOT 3: ana ICD kodları alt kodları kapsar; yalnız alt kod verilmişse diğer alt kodlar kapsama alınmaz.</p>`;}

 function renderOfflabel(){return `<div class="resource-card"><h3>6. Endikasyon dışı · MEDULA rapor teşhisi</h3><p>20.01 / 21.01 bütün endikasyon dışı kullanımlar için katılım payı ayrımına göre değerlendirilir. Bu kontrol reçete/ödeme garantisi vermez.</p><label class="sut-field"><span>İlaç</span><select class="sut-input" data-sut-off="drug"><option value="">Seçiniz</option><option>Anakinra</option><option>Kanakinumab</option><option>Adalimumab</option><option>Etanersept</option><option>İnfliksimab</option><option>Tosilizumab</option><option>Diğer</option><option>Rituksimab</option><option>Abatasept</option><option>Tofasitinib</option><option>Upadasitinib</option><option>Sekukinumab</option><option>İksekizumab</option></select></label><label class="sut-field"><span>ICD-10 tanısı (tam kod)</span><input class="sut-input" data-sut-off="icd" placeholder="Örn. E85.0 / M86.3 / R50.9" /></label><label class="sut-check"><input type="checkbox" data-sut-off="approval"><span>İlgili Bakanlık endikasyon dışı onayı / geçerli istisna kontrol edildi</span></label><button class="sut-btn" type="button" data-sut-action="offlabel">Muafiyet ve MEDULA kodunu değerlendir</button><div id="sutOffResult" aria-live="polite"><p>İlaç ve ICD-10 seçip kontrolü başlatın.</p></div><p class="sut-source">Kod dayanağı: <a href="${MEDULA_URL}" target="_blank" rel="noopener noreferrer">SGK Sağlık Tesisi Reçete ve Rapor Web Servisleri dokümanı</a>. Rapor düzenleme nedeni (yaş / doz / cinsiyet / endikasyon / SUT kuralı) ilave değer olarak girilmelidir.</p></div>`;}
 // The report path and the exemption path are distinct decisions.
 // Only direct, exact EK-4/D records can support a preliminary exemption result.
 const directPairs=(drug,icd)=>exemptPairs.filter(x=>x.drug===drug && x.icd===icd && x.scope==='specific');
 function assessment(s,r){
   const drug=r.drug,icd=(s.reportIcd||'').trim().toUpperCase(),ind=s.indicationStatus||'unknown';
   if(!icd)return {level:'pending',title:'ICD-10 girilmeli',note:'EK-4/D karşılaştırması için tam tanı kodu gerekiyor.'};
   if(!/^([A-Z][0-9]{2})(\.[0-9A-Z]{1,4})?$/.test(icd))return {level:'pending',title:'ICD-10 biçimi kontrol edilmeli',note:'Örn. E85.0 veya R50.9; yalnızca kod girin.'};
   if(drug.includes('('))return {level:'pending',title:'Etken madde seçilmeli',note:'Sınıf adı (anti-TNF gibi) EK-4/D muafiyetini tek başına doğrulamaz.'};
   const direct=directPairs(drug,icd),other=findPairs(drug,icd),sources=direct.map(x=>x.clause).filter((x,i,a)=>a.indexOf(x)===i);
   if(ind==='unknown')return {level:'pending',title:'Endikasyon durumu belirtilmeli',note:'Ruhsatlı/endikasyon dışı durumunu ilgili yaş ve tanı için doğrulayın.',direct,sources};
   if(ind==='offlabel'&&!s.approvalVerified)return {level:'pending',title:'Bakanlık onayı veya istisnası doğrulanmalı',note:'Endikasyon dışı kullanım için gerekli izin/istisna kontrolü tamamlanmadı.',direct,sources};
   if(!s.sourceVerified)return {level:'pending',title:'EK-4/D dipnot ve SUT koşulları kontrol edilmeli',note:'Kaynak koşulları ve yıldızlı hükümlerin karşılandığı ayrıca işaretlenmelidir.',direct,sources};
   if(direct.length){return {level:'conditional',title:'Doğrudan EK-4/D eşleşmesi bulundu',note:'Eşleşme, muafiyet için ön dayanak olabilir. EK-4/A, SUT özel hükümleri ve ruhsat/izin koşulları ayrıca geçerli olmalı.',direct,sources,code:ind==='offlabel'?'21.01 (ön değerlendirme)':'Endikasyon içi: normal rapor teşhis kodu ayrıca belirlenmeli'};}
   if(other.length)return {level:'pending',title:'Grup/genel veya koşullu kayıt bulundu',note:'Bu kayıtlar doğrudan muafiyet kanıtı değildir. Özel ilaç–tanı eşleşmesini kontrol edin.',direct:other,sources:other.map(x=>x.clause)};
   if(ind==='offlabel'&&s.noExemptionConfirmed)return {level:'conditional',title:'EK-4/D muafiyeti bulunmadığı hekimce teyit edildi',note:'Bu karar yalnızca hekim teyidine dayanır; veri tabanında bulunmama muafiyet yokluğu kanıtı değildir.',code:'20.01 (ön değerlendirme)',direct:[],sources:[]};
   return {level:'pending',title:'EK-4/D eşleşmesi doğrulanmadı',note:'Eşleşme görülmemesi yokluğu kanıtlamaz. Tüm ekleri inceleyin; muafiyet olmadığı teyit edilirse 20.01 değerlendirilebilir.',direct:[],sources:[]};
 }
 function renderReview(r){const s=form,a=assessment(s,r);
  return `<div class="resource-card"><h3>4. Muafiyet ve MEDULA · Aynı rapor üzerinden kontrol</h3>
    <p>Rapor metni ile kodlama ayrı süreçtir. Buradaki sonuç SGK/MEDULA kabulü değildir.</p>
    <label class="sut-field"><span>Etken madde</span><input class="sut-input" value="${esc(r.drug)}" disabled></label>
    <label class="sut-field"><span>İlgili tam ICD-10 kodu</span><input class="sut-input" data-sut-field="reportIcd" value="${esc(s.reportIcd??'')}" placeholder="Örn. R50.9 / E85.0"></label>
    <label class="sut-field"><span>Ruhsat/endikasyon durumu (yaş ve doz dahil)</span><select class="sut-input" data-sut-field="indicationStatus"><option value="unknown" ${!s.indicationStatus||s.indicationStatus==='unknown'?'selected':''}>Henüz doğrulanmadı</option><option value="onlabel" ${s.indicationStatus==='onlabel'?'selected':''}>Endikasyon dahilinde</option><option value="offlabel" ${s.indicationStatus==='offlabel'?'selected':''}>Endikasyon dışında</option></select></label>
    <label class="sut-check"><input type="checkbox" data-sut-check="approvalVerified" ${s.approvalVerified?'checked':''}><span>Endikasyon dışı ise Bakanlık onayı / geçerli istisna doğrulandı</span></label>
    <label class="sut-check"><input type="checkbox" data-sut-check="sourceVerified" ${s.sourceVerified?'checked':''}><span>EK-4/D yıldız ve dipnotları, EK-4/A ile SUT kullanım koşulları kontrol edildi</span></label>
    <label class="sut-check"><input type="checkbox" data-sut-check="noExemptionConfirmed" ${s.noExemptionConfirmed?'checked':''}><span>Yalnızca eşleşme yoksa: Güncel EK-4/D'nin tamamı incelendi, ilgili ilaç–tanı için muafiyet olmadığı teyit edildi</span></label>
    <button type="button" class="sut-btn sut-muted" data-sut-action="review">Kod ve muafiyeti değerlendir</button>
    <div id="sutReviewResult" aria-live="polite">${renderAssessment(a)}</div>
   </div>`;}
 function renderAssessment(a){return `<div class="info-banner ${a.level==='pending'?'notice-banner':''}"><strong>${esc(a.title)}</strong><p>${esc(a.note)}</p>${a.code?`<p><strong>Kod değerlendirmesi: ${esc(a.code)}</strong></p>`:''}${a.direct?.length?`<p>Dayanak: ${a.direct.map(x=>esc(x.clause)+' · '+esc(x.drug)+' / '+esc(x.icd)+(x.star?' (*)':'')).join('; ')}</p>`:''}<p>20.01 = katılım paylı, 21.01 = muaf; yalnız Bakanlık onaylı endikasyon dışı kullanımda. Nihai kayıt MEDULA'da doğrulanmalıdır.</p></div>`;}
 let current='il1-fmf-anak-start', form={}, offlabel={};const num=x=>Number(x||0);const esc=x=>String(x??'').replace(/[&<>"']/g,y=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[y]));const rule=()=>rules.find(r=>r.id===current)||rules[0];
 function identity(r){
  if(r.group==='SURF')return {icd:'R50.9',report:'21.01',offlabel:true,confidence:'conditional',explanation:'EK-4/D §15.16 kapsamında '+r.drug+' yıldızlı listelenmiştir. Bakanlık onayı ve tüm dipnot/SUT koşulları doğrulanırsa katılım paysız 21.01 değerlendirilir.'};
  if(r.group==='FMF')return {icd:'E85.0',report:'06.05',offlabel:false,confidence:'specific',explanation:'EK-4/D §6.2 FMF başlığı. Ruhsat yaş/doz ve rapor şartları ayrıca kontrol edilmelidir.'};
  if(r.group==='CNO')return {icd:'',report:'',offlabel:true,confidence:'unverified',explanation:'CNO için gerçek ICD kodu, Bakanlık onayı ve EK-4/D muafiyet yokluğu doğrulanmalı. Bunlar tamamlanmadan 20.01 otomatik atanmaz.'};
  return {icd:'',report:'',offlabel:null,confidence:'unverified',explanation:'Bu hastalık–ilaç eşleşmesinin SGK rapor kodu henüz doğrulanmadı. Kod otomatik atanmayacaktır.'};
 }

 // v0.47: keyboard-free numeric choices and structured CRP records.
 const ageChoices=()=>Array.from({length:101},(_,i)=>i);
 const weightChoices=()=>{const a=[];for(let v=2;v<=100;v+=.5)a.push(v);for(let v=101;v<=200;v++)a.push(v);return a;};
 function optionList(values,selected,unit){return `<option value="">Seçiniz</option>`+values.map(x=>`<option value="${x}" ${String(selected??'')===String(x)?'selected':''}>${x}${unit||''}</option>`).join('');}
 function renderCrpRows(){const rows=form._crpRows||Array.from({length:3},()=>({date:'',value:'',uln:''}));return `<div class="sut-crp-block"><div class="sut-crp-head"><span>Tarih</span><span>CRP sonucu (mg/L)</span><span>Normal üst sınır (mg/L)</span></div>${rows.map((r,i)=>`<div class="sut-crp-row"><input class="sut-input" type="date" aria-label="${i+1}. CRP tarihi" data-sut-crp="${i}" data-sut-crp-prop="date" value="${esc(r.date||'')}"><input class="sut-input" type="number" min="0" step="0.1" inputmode="decimal" placeholder="Örn. 28,5" aria-label="${i+1}. CRP değeri" data-sut-crp="${i}" data-sut-crp-prop="value" value="${esc(r.value??'')}"><input class="sut-input" type="number" min="0.01" step="0.1" inputmode="decimal" placeholder="Örn. 5" aria-label="${i+1}. CRP normal üst sınırı" data-sut-crp="${i}" data-sut-crp-prop="uln" value="${esc(r.uln??'')}"></div>`).join('')}<button type="button" class="sut-btn sut-muted sut-crp-add" data-sut-action="add-crp">+ CRP ölçümü ekle</button><p class="sut-source">Her atak için ölçüm tarihini, değeri ve o laboratuvarın normal üst sınırını seçin/girin. Sistem tarih aralığını ve katları kontrol eder.</p></div>`;}
 function crpErrors(){const rows=form._crpRows;if(!rows)return ['CRP tarihleri ve değerleri girilmedi.'];const filled=rows.filter(r=>r.date||r.value!==''&&r.value!=null||r.uln!==''&&r.uln!=null);const r=rule();const minNeeded=typeof r.flags?.crpMin==='function'?r.flags.crpMin(form):(r.flags?.crpMin||2);if(filled.length<minNeeded)return [`Bu durum için en az ${minNeeded} tarihli CRP ölçümü girilmeli.`];const issues=[];for(const [i,r] of filled.entries()){if(!r.date||r.value===''||r.value==null||r.uln===''||r.uln==null){issues.push(`${i+1}. CRP ölçümünde tarih, sonuç veya normal üst sınır eksik.`);continue;}const v=Number(r.value),u=Number(r.uln);if(!Number.isFinite(v)||!Number.isFinite(u)||v<0||u<=0){issues.push(`${i+1}. CRP sonuç/normal sınır geçersiz.`);continue;}if(v<2*u)issues.push(`${i+1}. CRP ölçümü normal üst sınırın iki katından düşük.`);if(r.date>new Date().toLocaleDateString('en-CA'))issues.push(`${i+1}. CRP ölçüm tarihi gelecekte.`);}const sorted=filled.filter(r=>r.date).map(r=>r.date).sort();for(let i=1;i<sorted.length;i++){const days=Math.round((Date.parse(sorted[i])-Date.parse(sorted[i-1]))/86400000);if(days<15)issues.push('CRP ölçüm tarihleri arasında en az 15 gün olmalı.');}return [...new Set(issues)];}
 function syncCrp(){const rows=(form._crpRows||[]).filter(r=>r.date&&r.value!==''&&r.value!=null&&r.uln!==''&&r.uln!=null).sort((a,b)=>a.date.localeCompare(b.date));form.crpDates=rows.map(r=>`${r.date}: CRP ${r.value} mg/L (normal üst sınır ${r.uln} mg/L, ${(+r.value/+r.uln).toFixed(1)}×)`).join('; ');form.crpLog=rows.map(r=>`${r.date} | ${r.value} | ${r.uln}`).join('\n');}
 function renderField([key,label,type]){
  if(key==='crpDates'||key==='crpLog')return `<div class="sut-field"><span>${esc(label)}</span>${renderCrpRows()}</div>`;
  if(key==='colMonths')return `<label class="sut-field"><span>${esc(label)}</span><select class="sut-input" data-sut-field="colMonths">${optionList(Array.from({length:121},(_,i)=>i),form.colMonths,' ay')}</select></label>`;
  if(key==='attacks')return `<label class="sut-field"><span>${esc(label)}</span><select class="sut-input" data-sut-field="attacks">${optionList(Array.from({length:31},(_,i)=>i),form.attacks,' atak')}</select></label>`;
  if(key==='age')return `<label class="sut-field"><span>${esc(label)}</span><select class="sut-input" data-sut-field="age">${optionList(ageChoices(),form.age,' yaş')}</select></label>`;
  if(key==='weight')return `<label class="sut-field"><span>${esc(label)}</span><select class="sut-input" data-sut-field="weight">${optionList(weightChoices(),form.weight,' kg')}</select></label>`;
  return `<label class="sut-field"><span>${esc(label)}</span>${type==='textarea'?`<textarea data-sut-field="${esc(key)}" rows="3">${esc(form[key]??'')}</textarea>`:`<input class="sut-input" type="${type}" data-sut-field="${esc(key)}" ${type==='number'?'min="0" step="any"':''} value="${esc(form[key]??'')}">`}</label>`;
 }
 // v0.49 – Structured clinical prose. This renderer does not infer dosing or eligibility.
 function plain(v){return String(v??'').trim();}
 function sentence(v){let x=plain(v).replace(/\s+/g,' ');return x?x.replace(/[.;]+$/,'')+'.':'';}
 function reportStage(r){const title=(r.scenario+' '+r.id).toLocaleLowerCase('tr');if(form.reportAction&&form.reportAction!=='auto')return form.reportAction;
  if(/geçiş|değiş|switch/.test(title))return 'switch';
  if(/devam|idame|izlem|kontrol|yeniden|tekrar|m3|m6|redose/.test(title))return 'continue';
  return 'start';
 }
 function responseInfo(r){const k=plain(form.responseMetric), val=plain(form.responseValue);if(!k||val==='')return '';
  const isPercent=['pACR','BASDAI','DAS28','JADAS'].includes(k);
  return k==='pACR'?`pACR ${val} yanıtı ${form.responseOutcome==='notmet'?'alınamamıştır':'elde edilmiştir'}`:
  `${k} değerlendirmesi ${val} olarak kaydedilmiş${form.responseOutcome==='notmet'?' olup hedef yanıt sağlanamamıştır':'tir'}`;
 }
 function scheduleText(r){const dose=plain(form.rxDose),unit=plain(form.rxUnit)||'mg',freq=plain(form.rxFrequency),route=plain(form.rxRoute),extra=plain(form.rxExtra);
  if(!dose||!freq||!route)return '';
  const routeName={SC:'subkutan',IV:'intravenöz',PO:'oral',IM:'intramüsküler'}[route]||route;
  return `${r.drug} ${dose} ${unit}, ${freq}, ${routeName} yolla uygulanmak üzere ${reportStage(r)==='continue'?'tedavisine devam edilmesine':reportStage(r)==='switch'?'tedavisine geçilmesine':'tedavisine başlanmasına'} karar verilmiştir${extra?' ('+extra+')':''}.`;
 }
 function clinicalReport(r,s){
  const stage=reportStage(r),age=plain(s.age),wt=plain(s.weight);
  const patient=`${r.group} tanısıyla izlenen${age?' '+age+' yaşında':''}${wt?' '+wt+' kg ağırlığındaki':''} hastada`;
  const parts=[];
  const months=plain(s.colMonths),attacks=plain(s.attacks),crp=plain(s.crpDates);
  const isJia=/JİA/.test(r.group);
  const prevDrug=plain(s.baselineDrug)||plain(s.dmardHistory)||plain(s.mtx)||plain(s.prior)||plain(s.therapy)||plain(s.tnfName)||plain(s.tnf)||plain(s.previousTreatment);
  const prevMonths=plain(s.baselineMonths)||plain(s.dmardMonths);
  const prevAcr=plain(s.baselineResponse)||plain(s.priorAcr)||plain(s.previousResponse)||(stage==='start'?plain(s.response)||plain(s.acr):'');
  // Continue reports repeat the initial clinical rationale before the follow-up outcome.
  if(stage==='continue'){
   if(isJia){
    const treatment=prevDrug||plain(s.baselineDrug);
    const duration=prevMonths?` toplam ${prevMonths} ay süreyle`:'';
    const initialOutcome=prevAcr!==''?(Number(prevAcr)<30?` ancak pACR30 yanıtına ulaşılamamış (pACR${prevAcr})`:` ve pACR${prevAcr} yanıtı kaydedilmiş`):' ve yeterli klinik yanıt alınamamış';
    parts.push(`${patient} daha önce ${treatment}${duration} kullanılmış${initialOutcome} olması nedeniyle ${r.drug.toLocaleLowerCase('tr-TR')} tedavisine başlanmıştır.`); if(plain(s.baselineDetails))parts.push(`Başlangıç tedavi öyküsü: ${plain(s.baselineDetails)}.`);
   }else{
    const history=prevDrug?` Daha önce ${prevDrug} kullanılmıştır.`:'';
    parts.push(`${patient} ${r.drug.toLocaleLowerCase('tr-TR')} tedavisine başlanmıştır.${history}`);
   }
  }else{
   parts.push(`${patient}${prevDrug?' daha önce '+prevDrug+' tedavisi uygulanmıştır.':' klinik değerlendirme yapılmıştır.'}`);
  }
  if(r.group==='FMF'&&months)parts.push(`Toplam ${months} ay kolşisin kullanılmıştır.`);
  if(attacks)parts.push(`Son üç ayda ${attacks} belgeli atak geçirilmiştir${crp?' (CRP ölçümleri: '+crp+')':''}.`);
  else if(crp)parts.push(`CRP ölçümleri: ${crp}.`);
  if(plain(s.biopsy))parts.push(`AA amiloidozu biyopsi bilgisi: ${plain(s.biopsy)}.`);
  if(stage==='switch'){
   const old=plain(s.priorDrug)||plain(s.tnfName)||plain(s.priorTNF);
   if(old)parts.push(`${old} tedavisiyle ${responseInfo(r)||'yeterli klinik yanıt alınamamıştır'}.`);
   if(plain(s.switchReason))parts.push(`Bu nedenle tedavi değişikliği planlanmıştır (${plain(s.switchReason)}).`);
  }else if(stage==='continue'){
   const month=plain(s.reviewMonth)||plain(s.months);
   const when=month?`Tedavinin ${month}. ayında`:'Tedavinin kontrol değerlendirmesinde';
   let result=responseInfo(r);
   if(!result){const value=plain(s.acrCurrent)||plain(s.acr)||plain(s.response);if(value)result=`pACR${value} yanıtı elde edilmiştir`;}
   if(result){
    result=result.replace(/[.]+$/,'');
    parts.push(`${when} ${result.charAt(0).toLocaleLowerCase('tr-TR')+result.slice(1)}.`);
   }
   parts.push(`${r.drug} tedavisine devam edilmesine karar verilmiştir.`);
  }else{
   if(isJia&&prevAcr!=='')parts.push(`Önceki tedaviyle pACR${prevAcr} yanıtı elde edilmiş olup yeterli yanıt sağlanamamıştır.`);
   if(r.group==='FMF'&&attacks)parts.push(`Klinik ve laboratuvar bulguları nedeniyle kolşisin direnci düşünülmüştür.`);
   if(responseInfo(r))parts.push(sentence(responseInfo(r)));
   if(stage==='start')parts.push(`${r.drug} tedavisine başlanmasına karar verilmiştir.`);
  }
  if(plain(s.rxDose)&&plain(s.rxFrequency)&&plain(s.rxRoute)){
   // Continue reports finish with the current treatment line, not a second 'decision' sentence.
   const dose=plain(s.rxDose),unit=plain(s.rxUnit)||'mg',freq=plain(s.rxFrequency),route=plain(s.rxRoute);
   const routeAbbr={SC:'SC',IV:'IV',PO:'PO',IM:'IM'}[route]||route;
   const conciseFreq={'Günde 1 kez':'1x/gün','Günde 2 kez':'2x/gün','Haftada 1 kez':'1x/hafta','2 haftada 1 kez':'1x/2 hafta','4 haftada 1 kez':'1x/4 hafta','6 haftada 1 kez':'1x/6 hafta','8 haftada 1 kez':'1x/8 hafta','Her 12 haftada bir':'1x/12 hafta'}[freq]||freq;
   parts.push(`${r.drug}: ${dose} ${unit}, ${conciseFreq}, ${routeAbbr}.`);
  }
  if(plain(s.approvalNo))parts.push(`Endikasyon dışı kullanım onay bilgisi: ${plain(s.approvalNo)}.`);
  return parts.join(' ').replace(/\s+/g,' ').trim();
 }
 function clinicalInputs(r){const stage=reportStage(r),opts=(values,selected)=>values.map(([v,l])=>`<option value="${esc(v)}" ${String(selected??'')===v?'selected':''}>${esc(l)}</option>`).join('');
  const list=(key,label,values)=>`<label class="sut-field"><span>${label}</span><select class="sut-input" data-sut-field="${key}"><option value="">Seçiniz</option>${opts(values,form[key])}</select></label>`;
  const txt=(key,label,placeholder)=>`<label class="sut-field"><span>${label}</span><input class="sut-input" data-sut-field="${key}" placeholder="${placeholder||''}" value="${esc(form[key]??'')}"></label>`;
  let html=`<div class="sut-clinical-block"><h3>6 · Rapor anlatımı ve doz şeması</h3><p class="sut-source">Doz ve sıklık hekim tarafından seçilir; sistem ilaca özgü doz veya geri ödeme uygunluğu hesaplamaz.</p><div class="sut-unified-grid">`;
  if(!r.fields.some(f=>f[0]==='age'))html+=list('age','Yaş (yıl)',Array.from({length:101},(_,i)=>[String(i),i+' yaş']));
  if(!r.fields.some(f=>f[0]==='weight'))html+=list('weight','Kilo (kg)',Array.from({length:197},(_,i)=>[String(2+i*.5),(2+i*.5)+' kg']));
  html+=`<label class="sut-field"><span>Rapor türü</span><select class="sut-input" data-sut-field="reportAction">${opts([['auto','Seçili klinik duruma göre otomatik'],['start','İlk başlangıç'],['continue','Devam / yanıt değerlendirmesi'],['switch','İlaç değişimi']],form.reportAction||'auto')}</select></label>`;
  if(stage==='continue'){
   html+='<p class="sut-source" style="grid-column:1/-1"><strong>İlk rapor öyküsü:</strong> Devam raporunda tedavinin hangi gerekçeyle başlandığı da yazılır. Aşağıdaki bilgiler hekimin doğruladığı başlangıç kayıtlarından girilmelidir.</p>';
   html+=list('baselineDrug','İlk rapordan önce kullanılan tedavi',[['Metotreksat','Metotreksat'],['Leflunomid','Leflunomid'],['Sulfasalazin','Sulfasalazin'],['Metotreksat + leflunomid','Metotreksat + leflunomid'],['Metotreksat + sulfasalazin','Metotreksat + sulfasalazin'],['Etanersept','Etanersept'],['Adalimumab','Adalimumab'],['Tosilizumab','Tosilizumab'],['Diğer','Diğer (açıklama alanında belirtin)']]);
   html+=list('baselineMonths','İlk rapordan önceki tedavi süresi',Array.from({length:61},(_,i)=>[String(i),i+' ay']));
   if(/JİA/.test(r.group))html+=list('baselineResponse','İlk rapordaki önceki tedavi pACR yanıtı',Array.from({length:101},(_,i)=>[String(i),'pACR'+i]));
   html+=txt('baselineDetails','Başlangıç raporundan ek bilgi (isteğe bağlı)','Örn. DMARD dozları / intolerans');
  }
  if(stage==='switch')html+=txt('priorDrug','Önceki biyolojik/DMARD ilaç','Örn. Etanersept')+txt('switchReason','Değişim nedeni','Örn. pACR50 yanıtı alınamadı');
  if(stage==='continue'||stage==='switch'){
   html+=list('responseMetric','Yanıt ölçütü',[['pACR','pACR (%)'],['DAS28','DAS28'],['BASDAI','BASDAI'],['JADAS','JADAS'],['other','Diğer']]);
   html+=txt('responseValue','Gerçekleşen yanıt / skor','Örn. pACR 30 için 30');
   html+=list('responseOutcome','Yanıt değerlendirmesi',[['met','Yanıt sağlandı'],['notmet','Hedef yanıt sağlanmadı']]);
   html+=list('reviewMonth','Değerlendirme ayı',Array.from({length:37},(_,i)=>[String(i),i+'. ay']));
  }
  html+=txt('rxDose','Planlanan tek uygulama dozu (zorunlu)','Örn. 20')+list('rxUnit','Doz birimi',[['mg','mg'],['mg/kg','mg/kg'],['mg/m²','mg/m²']]);
  html+=list('rxFrequency','Uygulama sıklığı',[['Günde 1 kez','Günde 1 kez'],['Günde 2 kez','Günde 2 kez'],['Haftada 1 kez','Haftada 1 kez'],['2 haftada 1 kez','2 haftada 1 kez'],['4 haftada 1 kez','4 haftada 1 kez'],['6 haftada 1 kez','6 haftada 1 kez'],['8 haftada 1 kez','8 haftada 1 kez'],['Her 12 haftada bir','Her 12 haftada bir']]);
  html+=list('rxRoute','Uygulama yolu',[['SC','SC · Subkutan'],['IV','IV · İntravenöz'],['PO','PO · Oral'],['IM','IM · İntramüsküler']]);
  html+=txt('rxExtra','Ek uygulama notu (isteğe bağlı)','Örn. 1x40 mg / 2 hafta');
  return html+'</div></div>';
 }
 // v0.51 – Condition-directed, single-screen poliarticular JIA workflow.
 // ACR values for a NEW drug are never requested before exposure.
 // Prior-treatment ACR is requested only if a previous treatment failed.
 const JIA_WIZARD_DRUGS=['Etanersept','Adalimumab','İnfliksimab','Tosilizumab'];
 const isJiaWizard=r=>r.group==='Poliartiküler JİA'&&JIA_WIZARD_DRUGS.includes(r.drug);
 for(const d of JIA_WIZARD_DRUGS){
   const origin=rules.find(x=>x.group==='Poliartiküler JİA'&&x.drug===d&&(/ilk başla|ilk rapor/i).test(x.scenario));
   if(origin)rules.push({...origin,id:'wizard-pjia-'+d.toLocaleLowerCase('tr-TR')+'-switch',scenario:'Başka biyolojik ilaçtan geçiş (yeni rapor)',checks:[],fields:[],validate:()=>[]});
 }
 const jiVals=(items,key)=>'<option value="">Seçiniz</option>'+items.map(([v,label])=>`<option value="${esc(v)}" ${String(form[key]??'')===String(v)?'selected':''}>${esc(label)}</option>`).join('');
 // FMF IL-1: clinician-verified structured questions, no free-text colHistory.
 const fmfanak=rules.find(x=>x.id==='il1-fmf-anak-start');
 if(fmfanak){
   fmfanak.fields=fmfanak.fields.filter(f=>!['colHistory','colMonths'].includes(f[0]));
   fmfanak.checks=fmfanak.checks.filter(c=>c[0]!=='maxCol');
   fmfanak.validate=(s)=>{
     const out=[];
     if(!(Number(s.age)>=2))out.push('Yaş en az 2 olmalı.');
     if(!(Number(s.weight)>7.5))out.push('Kilo 7,5 kg üzerinde olmalı.');
     if(!(Number(s.attacks)>=3))out.push('Son üç ayda en az üç belgeli atak gerekli.');
     return out;
   };
 }
 const canaAdverse=rules.filter(x=>['il1-fmf-cana-adverse','il1-amy-cana-adverse'].includes(x.id));
 for(const r of canaAdverse){
   r.fields=r.fields.filter(f=>f[0]!=='consult');
   r.checks=r.checks.filter(c=>!['adverse','consultCheck'].includes(c[0]));
 }
 function isColResistance(r){return r.id==='il1-fmf-anak-start';}
 function isCanaAdverse(r){return ['il1-fmf-cana-adverse','il1-amy-cana-adverse'].includes(r.id);}
 function il1QuickInputs(r){
  const pick=(key,label,opts)=>`<label class="sut-field"><span>${esc(label)}</span><select class="sut-input" data-sut-field="${key}"><option value="">Seçiniz</option>${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(form[key]||'')===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
  const yesno=(key,label)=>pick(key,label,[['yes','Evet'],['no','Hayır']]);
  if(isColResistance(r))return `<div class="sut-clinical-block"><h3>Kolşisin kullanımının belgelenmesi</h3><div class="sut-unified-grid">${yesno('colAll6','Yurt içi ve gerektiğinde yurt dışı preparatla toplam en az 6 ay kolşisin kullanıldı mı?')}${yesno('colDomestic3','Yurt içi kolşisin en az 3 ay kullanıldı mı?')}${yesno('colForeign','Yurt dışı kolşisin preparatı kullanıldı mı?')}</div><p class="sut-source">SUT 4.2.1.C-7 toplam en az 6 ayı düzenler; yurt içi için ayrı 3 aylık zorunluluk bu hükümde yazmaz. Rapora yalnızca doğrulanmış kullanım yazılır. Ciddi intolerans varsa ayrı senaryo seçilmelidir.</p></div>`;
  if(isCanaAdverse(r))return `<div class="sut-clinical-block"><h3>Anakinra yan etkisi / alerji</h3><div class="sut-unified-grid">${pick('canaAdverseType','Geçiş nedeni',[['allergy','Alerjik reaksiyon'],['other','Diğer ciddi yan etki']])}${form.canaAdverseType==='allergy'?yesno('canaAllergyVerified','Alerji uzmanı tarafından belgelenmiş alerjik reaksiyon var mı?'):''}${form.canaAdverseType==='other'?yesno('canaAdverseVerified','Ciddi yan etki ve gerekli uzman konsültasyonu belgelendi mi?'):''}</div></div>`;
  return '';
 }
 function il1QuickErrors(r){const e=[];
  if(isColResistance(r)){
   if(form.colAll6!=='yes')e.push('Toplam en az 6 aylık kolşisin kullanımı doğrulanmalı.');
   if(!form.colDomestic3)e.push('Yurt içi kolşisin 3 ay kullanım sorusunu yanıtlayın.');
   if(form.colForeign!=='yes')e.push('Kolşisine yanıtsızlık yolunda yurt dışı preparat kullanımı doğrulanmalı; kullanılmadıysa ilgili SUT koşulunu kontrol edin.');
  }
  if(isCanaAdverse(r)){
   if(!form.canaAdverseType)e.push('Geçiş nedeni seçilmeli.');
   if(form.canaAdverseType==='allergy'&&form.canaAllergyVerified!=='yes')e.push('Alerji uzmanının belgelediği reaksiyon doğrulanmalı.');
   if(form.canaAdverseType==='other'&&form.canaAdverseVerified!=='yes')e.push('Ciddi yan etki ve ilgili konsültasyon doğrulanmalı.');
  }
  return e;
 }
 function jiaWizard(r){
  const stage=reportStage(r), prior=plain(form.jiaPriorType),previous=plain(form.jiaPreviousBio);
  const sel=(key,label,arr)=>`<label class="sut-field"><span>${esc(label)}</span><select class="sut-input" data-sut-field="${key}">${jiVals(arr,key)}</select></label>`;
  const yn=(key,label)=>sel(key,label,[['yes','Evet'],['no','Hayır']]);
  const mon=(key,label)=>sel(key,label,Array.from({length:49},(_,i)=>[String(i),i+' ay']));
  const dmard=sel('jiaDmard','Hangi DMARD?', [['Metotreksat','Metotreksat (MTX)'],['Leflunomid','Leflunomid'],['Sulfasalazin','Sulfasalazin'],['Diğer','Diğer (raporda ayrıca belirtilir)']]);
  const pACR=sel('jiaAcr','Bu ilaçla elde edilen pACR yanıtı',[30,50,70,90].map(n=>[String(n),'pACR'+n]));
  const priorBio=sel('jiaPreviousBio','Önceki biyolojik ilaç',JIA_WIZARD_DRUGS.filter(d=>d!==r.drug).map(d=>[d,d]).concat([['Abatasept','Abatasept'],['Kanakinumab','Kanakinumab'],['Diğer','Diğer']]));
  let html='<div class="sut-clinical-block"><h3>Gerekli SUT bilgileri</h3><p class="sut-source">Bu ekranda sadece seçilen tedavi aşaması için gereken sorular gösterilir; hekim belgelerden doğrular.</p><div class="sut-unified-grid">';
  html+=sel('age','Yaş (yıl)',Array.from({length:101},(_,i)=>[String(i),i+' yaş']));
  html+=sel('weight','Kilo (kg)',Array.from({length:197},(_,i)=>[String(2+i*.5),(2+i*.5)+' kg']));
  // First-biologic TNF: DMARD course and nonresponse, never target drug pACR.
  // Tocilizumab can follow NSAID and/or MTX OR anti-TNF per C-5(2)(a).
  if(r.drug==='Tosilizumab'){
    html+='<div class="sut-field" style="grid-column:1/-1"><strong>Tosilizumab öncesi kullanılan tedaviler (birden fazla seçilebilir)</strong><p class="sut-source">Yalnızca belgelenen tedavileri işaretleyin.</p>';
    for(const [k,label] of [['jiaTociDmard','Metotreksat / DMARD'],['jiaTociNsaid','NSAİ tedavisi'],['jiaTociTnf','Anti-TNF tedavisi']])html+=`<label class="sut-check"><input type="checkbox" data-sut-check="${k}" ${form[k]===true?'checked':''}><span>${label}</span></label>`;
    html+='</div>';
    if(form.jiaTociDmard)html+=yn('jiaDmard3','DMARD en az 3 ay kullanıldı mı?')+dmard;
    if(form.jiaTociNsaid)html+=yn('jiaNsaid3','NSAİ en az 3 ay kullanıldı mı?');
    if(form.jiaTociTnf)html+=sel('jiaPreviousBio','Önceki anti-TNF',[['Etanersept','Etanersept'],['Adalimumab','Adalimumab'],['İnfliksimab','İnfliksimab'],['Golimumab','Golimumab'],['Sertolizumab','Sertolizumab']])+yn('jiaPrev3','Önceki anti-TNF en az 3 ay kullanıldı mı?');
    if((form.jiaTociDmard||form.jiaTociNsaid||form.jiaTociTnf)&&stage!=='continue')html+=yn('jiaPriorFailure','Ön tedavide pACR30 yanıtı alınamadı mı?');
  }else{
    html+=yn('jiaNsaidUsed','NSAİ tedavisi kullanıldı mı?');
    html+=yn('jiaDmard3','En az 3 ay DMARD kullandı mı?');
    if(form.jiaDmard3==='yes')html+=dmard;
    if(stage==='start')html+=yn('jiaDmardFailure','DMARD sonrası pACR30 yanıtı alınamadı mı?');
    if(stage==='start')html+=yn('jiaUveitis','Eşlik eden üveit var mı?');
    if(stage==='switch')html+=priorBio+yn('jiaPrev3','Önceki biyolojik en az 3 ay kullanıldı mı?')+sel('jiaFailedTarget','Önceki biyolojikte hangi hedefe ulaşılamadı?',[[30,'pACR30'],[50,'pACR50'],[70,'pACR70'],[90,'pACR90']]);
    if(stage==='continue'){
      html+=yn('jiaPriorBiologic','Bu ilaca başlamadan önce başka biyolojik kullanıldı mı?');
      if(form.jiaPriorBiologic==='yes')html+=priorBio+sel('jiaFailedTarget','Önceki biyolojikte hangi hedefe ulaşılamadı?',[[30,'pACR30'],[50,'pACR50'],[70,'pACR70'],[90,'pACR90']]);
    }
  }
  if(stage==='continue'){
    const month=/3\. ay/.test(r.scenario)?'3':/6\. ay/.test(r.scenario)?'6':null;
    html+=mon('jiaFollowMonth','Mevcut ilacın kontrol ayı');
    html+=pACR;
    html+=`<p class="sut-source" style="grid-column:1/-1">${month?month+'. ay raporunda gereken yanıt eşiği kuraldan kontrol edilir.':'Yanıt hedefi ilgili SUT maddesine göre kontrol edilir.'}</p>`;
  }
  html+=`<p class="sut-source" style="grid-column:1/-1">Doz ve uygulama sıklığını hekim doğrulamalıdır. Sistem doz önermez.</p>`;
  html+=`<label class="sut-field"><span>Tek uygulama dozu (mg)</span><input class="sut-input" type="number" min="0.01" step="0.01" data-sut-field="rxDose" value="${esc(form.rxDose??'')}"></label>`;
  html+=sel('rxFrequency','Sıklık',[['Günde 1 kez','Günde 1 kez'],['Haftada 1 kez','Haftada 1 kez'],['2 haftada 1 kez','2 haftada 1 kez'],['4 haftada 1 kez','4 haftada 1 kez'],['8 haftada 1 kez','8 haftada 1 kez']]);
  html+=sel('rxRoute','Uygulama yolu',[['SC','SC'],['IV','IV'],['PO','PO']]);
  html+='</div></div>';
  return html;
 }
 function jiaErrors(r){
  const e=[],stage=reportStage(r), prior=plain(form.jiaPriorType);
  const required=(key,msg)=>{if(!plain(form[key]))e.push(msg)};
  required('age','Yaş seçilmeli.');required('weight','Kilo seçilmeli.');
  if(r.drug==='Tosilizumab'){
    if(!form.jiaTociDmard&&!form.jiaTociNsaid&&!form.jiaTociTnf)e.push('En az bir ön tedavi seçilmeli.');
    if(form.jiaTociDmard){if(form.jiaDmard3!=='yes')e.push('En az 3 aylık DMARD süresi doğrulanmalı.');required('jiaDmard','DMARD adı seçilmeli.');}
    if(form.jiaTociNsaid&&form.jiaNsaid3!=='yes')e.push('En az 3 aylık NSAİ süresi doğrulanmalı.');
    if(form.jiaTociTnf){required('jiaPreviousBio','Önceki anti-TNF ilacı seçilmeli.');if(form.jiaPrev3!=='yes')e.push('Önceki anti-TNF süresi doğrulanmalı.');}
    if((form.jiaTociDmard||form.jiaTociNsaid||form.jiaTociTnf)&&stage!=='continue'&&form.jiaPriorFailure!=='yes')e.push('Ön tedavi ile pACR30 yanıtsızlığı doğrulanmalı.');
  }else{
    if(form.jiaNsaidUsed!=='yes')e.push('SUT gereği önceki NSAİ tedavisi doğrulanmalı.');
    if(form.jiaDmard3!=='yes')e.push('En az 3 ay DMARD kullanımı doğrulanmalı.');
    required('jiaDmard','Kullanılan DMARD seçilmeli.');
    if(stage==='start'&&form.jiaDmardFailure!=='yes')e.push('DMARD ile pACR30 yanıtsızlığı doğrulanmalı.');
    if(stage==='start'&&!plain(form.jiaUveitis))e.push('Üveit durumu seçilmeli.');
    if(stage==='start'&&form.jiaUveitis==='yes'&&r.drug!=='Adalimumab')e.push('Eşlik eden üveitte SUT ilk anti-TNF seçeneği adalimumabdır; bu başlangıç yolu uygun değil.');
    if(stage==='switch'){required('jiaPreviousBio','Önceki biyolojik ilaç seçilmeli.');required('jiaFailedTarget','Önceki biyolojik için karşılanmayan yanıt hedefi seçilmeli.');if(form.jiaPrev3!=='yes')e.push('Önceki biyolojik süre koşulu doğrulanmalı.');}
    if(stage==='continue'){required('jiaPriorBiologic','Önceki biyolojik öyküsü seçilmeli.');if(form.jiaPriorBiologic==='yes'){required('jiaPreviousBio','Önceki biyolojik seçilmeli.');required('jiaFailedTarget','Önceki biyolojik yanıt hedefi seçilmeli.');}}
  }
  if(stage==='continue'){
    required('jiaFollowMonth','Takip ayı seçilmeli.');required('jiaAcr','Mevcut ilaçla elde edilen pACR yanıtı seçilmeli.');
    const threshold=/6\. ay/.test(r.scenario)?50:30;
    if(plain(form.jiaAcr)&&Number(form.jiaAcr)<threshold)e.push('Seçilen pACR yanıtı bu rapor aşamasının '+threshold+' eşiğini karşılamıyor.');
    if(plain(form.jiaFollowMonth)&&Number(form.jiaFollowMonth)<(/6\. ay/.test(r.scenario)?6:3))e.push('Tedavi süresi seçilen devam raporu aşamasına uygun değil.');
  }
  required('rxDose','Doz girilmeli.');required('rxFrequency','Sıklık seçilmeli.');required('rxRoute','Uygulama yolu seçilmeli.');
  if(plain(form.rxDose)&&!(Number(form.rxDose)>0))e.push('Doz sıfırdan büyük olmalı.');
  return e;
 }
 function jiaClinicalReport(r){
  const stage=reportStage(r),d=plain(form.jiaDmard),p=plain(form.jiaPreviousBio),target=plain(form.jiaFailedTarget);
  let t=`Poliartiküler JİA tanısıyla izlenen ${plain(form.age)} yaşında, ${plain(form.weight)} kg ağırlığındaki hastada `;
  if(r.drug==='Tosilizumab'){
    const used=[];
    if(form.jiaTociDmard)used.push(`en az 3 ay DMARD (${d})`);
    if(form.jiaTociNsaid)used.push('en az 3 ay NSAİ');
    if(form.jiaTociTnf)used.push(`en az 3 ay anti-TNF (${p})`);
    t+=`${used.join(', ')} tedavileri uygulanmış, hedeflenen pACR30 yanıtı elde edilememiştir. `;
  }else{
    t+=`NSAİ tedavisi ve en az üç ay süreyle DMARD (${d}) kullanılmış, pACR30 yanıtı elde edilememiştir. `;
    if((stage==='switch'||(stage==='continue'&&form.jiaPriorBiologic==='yes'))&&p&&target)t+=`Daha sonra uygulanan ${p} tedavisiyle pACR${target} hedef yanıtına ulaşılamamıştır. `;
  }
  if(stage==='continue'){
    t+=`Bu nedenle ${r.drug} tedavisine başlanmıştır. ${r.drug} tedavisinin ${form.jiaFollowMonth}. ayında pACR${form.jiaAcr} yanıtı elde edilmesi nedeniyle tedaviye devam edilmesine karar verilmiştir. `;
  }else t+=`Bu nedenle ${r.drug} tedavisine ${stage==='switch'?'geçilmesine':'başlanmasına'} karar verilmiştir. `;
  const fr={'Günde 1 kez':'1x/gün','Haftada 1 kez':'1x/hafta','2 haftada 1 kez':'1x/2 hafta','4 haftada 1 kez':'1x/4 hafta','8 haftada 1 kez':'1x/8 hafta'}[form.rxFrequency]||form.rxFrequency;
  return t+`${r.drug}: ${form.rxDose} mg, ${fr}, ${form.rxRoute}.`;
 }
 function render(){const r=rule(),id=identity(r);
 const availableDrugs=[...new Set(rules.map(x=>x.drug))].sort((a,b)=>a.localeCompare(b,'tr'));
 const possibleGroups=[...new Set(rules.filter(x=>x.drug===r.drug).map(x=>x.group))];
 const choices=rules.filter(x=>x.group===r.group&&x.drug===r.drug);
 const selected=identity(r),pairs=selected.icd?directPairs(r.drug,selected.icd):[];
 const drugOpts=availableDrugs.map(x=>`<option ${x===r.drug?'selected':''}>${esc(x)}</option>`).join('');
 const groupOpts=possibleGroups.map(x=>`<option ${x===r.group?'selected':''}>${esc(x)}</option>`).join('');
 const scenarioOpts=choices.map(x=>`<option value="${esc(x.id)}" ${x.id===r.id?'selected':''}>${esc(x.scenario)}</option>`).join('');
 const sourceDetails=pairs.map(x=>`${x.clause}${x.star?' (*)':''}`).join(', ');
 const status=selected.confidence==='unverified'?'Henüz doğrulanmadı':selected.offlabel?'Endikasyon dışı kullanım':'Rapor kodu kaydı';
 return `<div class="sut-panel sut-one-screen"><div class="sut-banner"><strong>Romatoloji · Tek Ekranda SUT Raporu</strong><p>İlacı, hastalığı ve durumu seçin. Tanı, rapor kodu, koşullar ve standart metin aynı ekrandadır. Mevzuat: ${SOURCE}.</p></div>
 <div class="resource-card" style="padding:22px"><div class="sut-unified-grid">
 <label class="sut-field"><span>1 · İlaç</span><select class="sut-input" id="sutDrug">${drugOpts}</select></label>
 <label class="sut-field"><span>2 · Hastalık</span><select class="sut-input" id="sutGroup">${groupOpts}</select></label>
 <label class="sut-field"><span>3 · Klinik durum</span><select class="sut-input" id="sutScenario">${scenarioOpts}</select></label></div>
 <div class="sut-meta-grid"><div><span>ICD-10 tanı kodu</span><strong>${esc(id.icd||'Doğrulanacak')}</strong></div><div><span>MEDULA rapor teşhis kodu</span><strong>${esc(id.report||'Doğrulanacak')}</strong></div><div><span>Kod durumu</span><strong>${esc(status)}</strong></div></div>
 <p class="sut-description">${esc(id.explanation)}</p><p class="sut-source">İlgili kural: ${esc(r.ref)}${sourceDetails?' · EK-4/D: '+esc(sourceDetails):''}</p>
 ${r.extraWarning?`<p class="info-banner notice-banner">${esc(r.extraWarning)}</p>`:''}
 ${id.offlabel?`<div class="info-banner notice-banner"><strong>Endikasyon dışı kontrol</strong><p>20.01 katılım paylı / 21.01 katılım paysız. Önerilen kod, ilgili Bakanlık onayı, muafiyet satırı ve dipnotlar doğrulanmadan kesin değildir.</p></div>`:''}
 ${isJiaWizard(r)?jiaWizard(r):`${il1QuickInputs(r)}<div class="sut-unified-grid"><div><h3>4 · SUT kontrolü</h3><p>Hekim tarafından belgelerden teyit edilir.</p>${r.checks.map(([k,v])=>`<label class="sut-check"><input type="checkbox" data-sut-check="${esc(k)}" ${form[k]===true?'checked':''}><span>${esc(v)}</span></label>`).join('')}</div><div><h3>5 · Gerekli bilgiler</h3>${r.fields.map(renderField).join('')}</div></div>${clinicalInputs(r)}`}
 ${id.confidence==='unverified'?`<label class="sut-check"><input type="checkbox" data-sut-check="sourceVerified" ${form.sourceVerified?'checked':''}><span>Tanı, EK-4/D ve MEDULA rapor teşhis kodunu kurum ekranında ayrıca kontrol ettim.</span></label>`:''}
 <div class="sut-unified-actions"><button class="sut-btn" type="button" data-sut-action="evaluate">Raporu oluştur ve kontrol et</button><button class="sut-btn sut-muted" type="button" data-sut-action="reset">Temizle</button></div>
 <div id="sutResult" aria-live="polite"><p>Girilen bilgiler doğrulandığında rapor açıklaması burada oluşacak.</p></div>
 <p class="sut-footer">Bu uygulama otomatik MEDULA sorgusu yapmaz; kimlik bilgisi girilmemelidir. Eksik doğrulanmış kurallar kesin ödeme sonucu olarak sunulmaz. Kaynak: 02.10.2026 SUT ve EK-4/D.</p></div></div>`;
 }
 function fieldEvent(e){const t=e.target;
 if(t.hasAttribute('data-sut-crp')){const idx=Number(t.dataset.sutCrp),prop=t.dataset.sutCrpProp;form._crpRows??=Array.from({length:3},()=>({date:'',value:'',uln:''}));form._crpRows[idx][prop]=t.value;syncCrp();return true;}
if(t.dataset?.sutSearch){const el=document.getElementById('sutMatches');if(el)el.innerHTML=renderMatches(t.value||'');return true;}if(t.dataset?.sutOff){offlabel[t.dataset.sutOff]=t.type==='checkbox'?t.checked:t.value;return true;}if(t.id==='sutGroup'){const next=rules.find(x=>x.group===t.value&&x.drug===rule().drug);if(next){current=next.id;form={};document.getElementById('app').innerHTML=render();}return true;}
 if(t.id==='sutDrug'){const next=rules.find(x=>x.drug===t.value);if(next){current=next.id;form={};document.getElementById('app').innerHTML=render();}return true;}
 if(t.id==='sutScenario'){current=t.value;form={};document.getElementById('app').innerHTML=render();return true;}if(t.dataset?.sutField){form[t.dataset.sutField]=t.value;if(['reportAction','jiaDmard3','jiaPriorType','jiaPriorBiologic','canaAdverseType'].includes(t.dataset.sutField)){document.getElementById('app').innerHTML=render();return true;}if(['reportIcd','indicationStatus'].includes(t.dataset.sutField)){const out=document.getElementById('sutReviewResult');if(out)out.innerHTML=renderAssessment(assessment(form,rule()));}return true;}if(t.dataset?.sutCheck){form[t.dataset.sutCheck]=t.checked;if(['jiaTociDmard','jiaTociNsaid','jiaTociTnf'].includes(t.dataset.sutCheck)){document.getElementById('app').innerHTML=render();return true;}if(['approvalVerified','sourceVerified','noExemptionConfirmed'].includes(t.dataset.sutCheck)){const out=document.getElementById('sutReviewResult');if(out)out.innerHTML=renderAssessment(assessment(form,rule()));}return true;}return false;}
 function click(e){const el=e.target.closest('[data-sut-action]');if(!el)return false;if(el.dataset.sutAction==='offlabel'){const out=document.getElementById('sutOffResult');if(!out)return true;const drug=(offlabel.drug||'').trim(),icd=(offlabel.icd||'').trim().toUpperCase();if(!drug||!icd){out.innerHTML='<p>İlaç ve tam ICD-10 tanısı girilmeli.</p>';return true;}if(!offlabel.approval){out.innerHTML='<p>Endikasyon dışı onay/istisna doğrulanmadan rapor kodu önerilmez.</p>';return true;}const pairs=findPairs(drug,icd);if(pairs.length){const safe=pairs.every(x=>x.scope!=='group'&&x.scope!=='conditional');out.innerHTML=`<p><strong>EK-4/D eşleşmesi (${pairs.length} kaynak satırı) bulundu:</strong></p><ul>${pairs.map(x=>`<li>${esc(x.clause)} · ${esc(x.drug)} / ${esc(x.icd)} ${x.star?'(*)':''} — ${esc(x.note)}</li>`).join('')}</ul><p>${safe?'EK-4/D eşleşmesi ayrıca doğrulanan SUT ve ruhsat koşullarıyla birlikte muafiyete esas olabilir.':'Grup / koşullu kayıt bulundu: ilaca ve endikasyona özel uygunluk doğrulanmalı.'} <strong>21.01</strong> ancak katılım payı muafiyeti gerçekten doğrulanırsa değerlendirilir; aksi durumda, onaylı endikasyon dışı kullanımda <strong>20.01</strong> düşünülebilir.</p><p>Bu tablo EK-4/A ödeme kapsamı veya MEDULA kodu kesin onayı değildir.</p>`;return true;}if(['Adalimumab','Etanersept','İnfliksimab'].includes(drug)&&/^M86\.[3-6]$/.test(icd)){out.innerHTML='<p><strong>EK-4/D osteomiyelit M86.3–M86.6 için yalnızca antibiyotik satırı tespit edildi.</strong> Başka muafiyet yoksa, gerekli Bakanlık onayı sonrası <strong>20.01 – katılım paylı</strong> kod değerlendirilebilir. Kesin kod için kurum/MEDULA teyidi gerekir.</p>';return true;}
out.innerHTML='<p><strong>Eşleşme henüz doğrulanmadı.</strong> Bu sistemin sınırlı kayıtlarında bulunmaması, EK-4/D’de olmadığı anlamına gelmez. Özellikle ateş tanısında tam ICD kodu, ilişkili EK-4/D hastalık başlığı, yıldız ve dipnotlar ayrıca incelenmelidir. 20.01/21.01 otomatik atanmadı.</p>';return true;}if(el.dataset.sutAction==='review'){const out=document.getElementById('sutReviewResult');if(out)out.innerHTML=renderAssessment(assessment(form,rule()));return true;}if(el.dataset.sutAction==='add-crp'){form._crpRows??=Array.from({length:3},()=>({date:'',value:'',uln:''}));if(form._crpRows.length<12)form._crpRows.push({date:'',value:'',uln:''});const oldResult=document.getElementById('sutResult')?.innerHTML;document.getElementById('app').innerHTML=render();if(oldResult&&document.getElementById('sutResult'))document.getElementById('sutResult').innerHTML=oldResult;return true;}if(el.dataset.sutAction==='reset'){form={};document.getElementById('app').innerHTML=render();return true;}if(el.dataset.sutAction==='copy'){const field=document.getElementById('sutTemplate');if(field){navigator.clipboard?.writeText(field.value).catch(()=>{field.select();document.execCommand('copy');});}return true;}if(el.dataset.sutAction==='evaluate'&&isJiaWizard(rule())){const r=rule(),issues=jiaErrors(r),out=document.getElementById('sutResult');if(!out)return true;if(issues.length){out.innerHTML='<h3>Eksik veya karşılanmayan koşullar</h3><ul>'+issues.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p>Koşullar karşılanmadan metin üretilmez.</p>';return true;}const id=identity(r),text=jiaClinicalReport(r);out.innerHTML=`<h3>Rapor açıklaması</h3><p>ICD-10: ${esc(id.icd||'Kontrol gerekli')} · MEDULA: ${esc(id.report||'Kontrol gerekli')}</p><label class="sut-field"><span>Düzenlenebilir standart rapor metni</span><textarea id="sutTemplate" rows="7">${esc(text)}</textarea></label><button class="sut-btn" type="button" data-sut-action="copy">Metni kopyala</button><p class="sut-source">SUT ${esc(r.ref)} · Hekimin beyan ettiği bilgiler; tüm ruhsat, SUT ve EK-4/D koşulları ayrıca doğrulanmalıdır.</p>`;return true;}if(el.dataset.sutAction==='evaluate'){const r=rule(),missing=r.checks.filter(([id])=>form[id]!==true).map(x=>x[1]),errors=[...r.validate(form,form),...il1QuickErrors(r)];if(r.fields.some(([key])=>key==='crpDates'||key==='crpLog'))errors.push(...crpErrors());let out=document.getElementById('sutResult');if(!out)return true;if(missing.length||errors.length){out.innerHTML=`<h3>4. Henüz tamamlanmadı</h3><p>Standart metin üretilmedi. Aşağıdaki bilgiler kontrol edilmeli:</p><ul>${[...missing.map(x=>'İşaretlenmedi: '+x),...errors].map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>Bir koşul karşılanmıyorsa onay kutusunu işaretlemeyin. Alternatif SUT senaryosunu değerlendirin.</p>`;return true;}if(!plain(form.rxDose)||!Number.isFinite(Number(form.rxDose))||Number(form.rxDose)<=0||!plain(form.rxFrequency)||!plain(form.rxRoute)){out.innerHTML='<p><strong>Rapor henüz hazır değil.</strong> Hekim tarafından doğrulanan doz, uygulama sıklığı ve yol seçilmelidir.</p>';return true;}if(reportStage(r)==='switch'&&!isCanaAdverse(r)&&(!plain(form.priorDrug)||!plain(form.switchReason))){out.innerHTML='<p><strong>İlaç değişimi için önceki ilaç ve değişim gerekçesi girilmeli.</strong></p>';return true;}if(reportStage(r)==='continue'&&/JİA/.test(r.group)&&(!plain(form.baselineDrug)||!plain(form.baselineMonths)||plain(form.baselineResponse)==='')){out.innerHTML='<p><strong>Devam raporunun başlangıç öyküsü eksik.</strong> Önceki tedavi, kullanım süresi ve başlangıçtaki pACR yanıtını seçin. Bunlar girilmeden metin oluşturulmaz.</p>';return true;}if(reportStage(r)==='continue'&&(!plain(form.responseMetric)||!plain(form.responseValue)||!plain(form.responseOutcome))){out.innerHTML='<p><strong>Devam raporunda yanıt ölçütü, değeri ve karşılanıp karşılanmadığı girilmeli.</strong></p>';return true;}let msg=clinicalReport(r,form),mapped=identity(r);
 if(isColResistance(r)){
  const clause=`Yurt içi kolşisin ${form.colDomestic3==='yes'?'en az 3 ay süreyle kullanılmıştır':'kullanım süresi 3 aydan kısadır'}. Yurt dışı kolşisin preparatı kullanılmıştır. Yurt içi ve yurt dışı preparatlarla toplam en az 6 ay kolşisin uygulanmasına rağmen yeterli yanıt alınamamıştır. `;
  msg=msg.replace('Klinik ve laboratuvar bulguları nedeniyle kolşisin direnci düşünülmüştür.',clause+'Klinik ve laboratuvar bulguları nedeniyle kolşisin direnci düşünülmüştür.');
 }
 if(isCanaAdverse(r)){
  const clause=form.canaAdverseType==='allergy'?'Anakinra tedavisi sırasında gelişen alerjik reaksiyon alerji uzmanı tarafından belgelenmiştir. ':'Anakinra tedavisine devamı engelleyen ciddi yan etki ve ilgili uzman konsültasyonu belgelenmiştir. ';
  msg=msg.replace('Bu nedenle ',clause+'Bu nedenle ');
  if(!msg.includes(clause))msg=msg.replace(/(Kanakinumab tedavisine)/,clause+'$1');
  if(!msg.includes(clause))msg+=' '+clause;
  if(!msg.includes('kanakinumab tedavisine geçilmesine')&&!msg.includes('Kanakinumab tedavisine geçilmesine'))msg+=' Bu nedenle kanakinumab tedavisine geçilmesine karar verilmiştir.';
 }
out.innerHTML=`<h3>Rapor açıklaması</h3><p><strong>ICD-10: ${esc(mapped.icd||'Henüz doğrulanmadı')} · MEDULA rapor kodu: ${esc(mapped.report||'Henüz doğrulanmadı')}</strong></p><p><strong>Ön kontrol:</strong> İşaretlemeler ve alanlar tamamlandı. Bu sonuç SGK ödeme uygunluğu/nihai MEDULA kabulü anlamına gelmez; özellikle ${mapped.offlabel?'endikasyon dışı onay ve EK-4/D dipnotları':'ruhsat ve SUT koşulları'} kurumda doğrulanmalıdır.</p><label class="sut-field"><span>Standart rapor açıklaması (düzenlenebilir)</span><textarea id="sutTemplate" rows="7">${esc(msg)}</textarea></label><button class="sut-btn" type="button" data-sut-action="copy">Metni kopyala</button><p class="sut-source">Dayanak: ${esc(r.ref)} · ${SOURCE}</p>`;return true;}return false;}
 return {render,onChange:fieldEvent,onClick:click};
})();
