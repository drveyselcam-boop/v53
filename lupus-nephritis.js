/* Çocuk Romatoloji · Lupus nefriti · kaynak bağlantılı klinik akış v0.29 */
'use strict';
const LNFlow=(()=>{
 const S={guide:'acr',stage:'initial',clazz:'34',protein:'1-3',gfr:'normal',activity:'active',extra:'no',response:'none',previous:'dual',risk:'no',pregnancy:'no',age:'child',time:'6',tma:'no'};
 const links={acr:'https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/acr.25528',eular:'https://www.sciencedirect.com/science/article/pii/S0003496725044127',kdigo:'https://kdigo.org/wp-content/uploads/2024/01/KDIGO-2024-Lupus-Nephritis-Guideline.pdf'};
 const opts={guide:[['acr','ACR 2024 / 2025'],['eular','EULAR 2025'],['kdigo','KDIGO 2024']],stage:[['screen','Tarama / biyopsi'],['initial','İlk tedavi / relaps'],['follow','Yanıt / izlem'],['resistant','Yetersiz yanıt / direnç'],['support','Koruyucu yaklaşım']],clazz:[['unknown','Biyopsi yok / belirsiz'],['12','Sınıf I–II'],['34','Sınıf III / IV'],['345','Sınıf III / IV + V'],['5','Saf sınıf V'],['6','Sınıf VI / ileri kronik hasar']],protein:[['under05','<0,5 g/g'],['05-1','0,5–<1 g/g'],['1-3','1–<3 g/g'],['3plus','≥3 g/g'],['nephrotic','Nefrotik düzey / sendrom']],gfr:[['normal','Korunmuş / stabil'],['reduced','Azalmış'],['under45','eGFR ≤45 mL/dk/1,73m²'],['falling','Hızla kötüleşen']],activity:[['active','Aktif lezyon'],['mixed','Aktivite + kronisite'],['chronic','Yalnız kronik hasar'],['unknown','Bilinmiyor']],extra:[['no','Yok / hafif'],['yes','Orta-ağır ekstrarenal SLE']],response:[['none','Henüz ölçülmedi'],['complete','Tam yanıt'],['partial','Kısmi yanıt'],['lack','Yanıtsız / progresyon'],['relapse','Renal relaps']],previous:[['dual','İkili tedavi'],['triple','Üçlü tedavi'],['two','İki standart rejim başarısız']],risk:[['no','Yok'],['yes','TMA / APS / tromboz şüphesi']],pregnancy:[['no','Gebelik planı yok'],['yes','Gebelik / gebelik planı']],age:[['child','Çocuk / adolesan'],['adult','Erişkin']],time:[['3','≤3 ay'],['6','6. ay'],['12','12. ay'],['24','≥24. ay']],tma:[['no','Yok'],['yes','TMA / APS şüphesi']]};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const box=(title,txt,cls='')=>`<div class="ln-node ${cls}"><strong>${esc(title)}</strong>${txt?`<small>${esc(txt)}</small>`:''}</div>`;
 const choice=(k,label)=>`<label class="ln-field"><span>${label}</span><select data-ln="${k}">${opts[k].map(([v,t])=>`<option value="${v}" ${S[k]===v?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
 const line=(title,opts)=>`<div class="ln-path">${box(title,'','head')}${opts.map((x,i)=>`<div class="ln-down">↓</div>${box(x[0],x[1]||'')}`).join('')}</div>`;
 const items=[];
 function add(h,d){items.push([h,d]);}
 function treatment(){let c=S.clazz,g=S.guide; if(c==='unknown'){add('Renal biyopsi','ISN/RPS sınıfı + aktivite/kronisite · nefropatolog değerlendirmesi');add('Sınıfa göre tedavi','Biyopsi mümkün değilse nefritik / nefrotik fenotipe göre uzman değerlendirmesi');return;}
 if(S.activity==='chronic'||c==='6'){add('Kronik hasar','Nefroproteksiyon · KBH bakımı · uygun ise renal replasman / transplant değerlendirmesi');if(c==='345')add('Eşlik eden V','Membranöz komponentin aktivitesini ayrıca değerlendir');return;}
 if(c==='12'){add('Sınıf I–II','Ekstrarenal SLE tedavisi · HCQ · RAASİ / KB kontrolü');add('Proteinüri / podositopati','Nefrotik sendromda lupus podositopatisi için yeniden değerlendirme');return;}
 if(c==='34'||c==='345'){
  if(g==='acr'){
   add('IV GC pulsu','Metilprednizolon 250–1000 mg/gün × 1–3 gün (erişkin rehber aralığı)');add('Oral GC azaltma','Prednizon ≤0,5 mg/kg/gün; en çok 40 mg/gün → 6. ayda ≤5 mg/gün hedef');
   add('Üçlü A','MPAA + belimumab + GC');add('Üçlü B','MPAA + CNI + GC');add('Üçlü C','Euro-Lupus düşük doz IV CYC + belimumab + GC → CYC sonrası MPAA');
   if(S.extra==='yes')add('Ekstrarenal SLE','Belimumab içeren rejim tercihi');if(['3plus','nephrotic'].includes(S.protein))add('Yüksek proteinüri','MPAA + CNI seçeneğini değerlendir');
  } else if(g==='kdigo'){
   add('GC + MPAA','MMF / mikofenolik asit analoğu');add('GC + IV CYC','Euro-Lupus düşük doz rejimi');add('GC + belimumab','MPAA veya düşük doz IV CYC ile');
   if(S.gfr!=='under45'&&S.gfr!=='falling')add('GC + MPAA + CNI','eGFR ağır bozulmamışsa');else add('CNI temkin','Düşük / kötüleşen eGFR: CNI güvenlilik incelemesi');
  } else {
   add('İmmün tedavi','GC + MPAA veya IV CYC');add('Erken kombinasyon','MPAA + belimumab veya MPAA + CNI gibi rejimleri değerlendir');add('B hücresi hedefi','Seçilmiş olguda obinutuzumab / rituksimab değerlendirmesi (erişim ve endikasyon kontrolü)');
  }
 } else if(c==='5'){
  if(g==='acr'){
   if(['1-3','3plus','nephrotic'].includes(S.protein)){add('Saf V · ≥1 g/g','GC pulsu + oral GC azaltma + MPAA + CNI (koşullu)');}else{add('Saf V · <1 g/g','GC ve/veya MPAA, AZA ya da CNI (koşullu)');}
  }else if(g==='kdigo'){
   add('Saf V','HCQ · RAASİ · KB/lipit kontrolü'); if(['nephrotic','3plus'].includes(S.protein))add('Nefrotik proteinüri','GC + MPAA / CNI / seçilmiş alternatif immünsüpresyon');else add('Nefrotik olmayan','Seyir ve proteinüriye göre bireyselleştirilmiş immünsüpresyon');
  }else{add('Saf V','Proteinüri, nefrotik durum ve fonksiyona göre GC + MPAA/CNI seçenekleri');}
 }
 if(S.gfr==='falling')add('Acil progresyon','Gecikmeden yeniden değerlendirme / tedavi yoğunlaştırma');
 if(S.risk==='yes'||S.tma==='yes')add('TMA / APS','TMA nedenleri · APS · kompleman aracılı TMA ayırıcı tanısı');
 if(S.pregnancy==='yes')add('Gebelik planı','MPAA / MTX / CYC teratojenitesi · AZA ve gebelikle uyumlu seçenekler için ortak plan');
 if(S.age==='child')add('Pediatrik uyarlama','Erişkin sabit dozlarını doğrudan kullanma · kilo/BSA ve ruhsat/kanıt kontrolü');
 }
 function follow(){add('İzlem','Proteinüri (UPCR/24 saat) · kreatinin/eGFR · idrar sedimenti · C3/C4 · anti-dsDNA · KB');
  if(S.guide==='kdigo'){add('Tam renal yanıt','Proteinüri <0,5 g/g + stabil/iyileşmiş böbrek fonksiyonu');add('Kısmi renal yanıt','Proteinüri ≥%50 azalma ve <3 g/g + stabil/iyileşmiş fonksiyon (6–12 ay)');}else{add('Yanıt hedefi','Proteinüri azalması + eGFR stabilizasyonu · süre ve seyir birlikte yorumlanır');}
  if(S.response==='complete'){add('Tam yanıt','Mevcut etkili rejimi sürdür / steroid azalt');add(S.guide==='acr'?'Toplam tedavi 3–5 yıl':'Uzun dönem tedavi','Stabilite ve relaps riskiyle kişiselleştir');}
  else if(S.response==='partial'){add('Kısmi yanıt','Düzenli iyileşiyorsa mevcut rejimi sürdür; kötüleşirse değiştir');}
  else if(S.response==='lack'||S.response==='relapse'){add('Yanıtsızlık / relaps','Doz · uyum · ilaç maruziyeti · enfeksiyon · TMA · kronik hasar');add('Yeniden biyopsi','Aktivite/kronisiteyi ve alternatif nedeni değerlendir');}
  if(S.gfr==='falling')add('Erken aksiyon','6–12 ay beklemeden tedaviyi yeniden değerlendir');
 }
 function resistant(){add('İlk kontrol','Adherans · ilaç dozu · tolerabilite · enfeksiyon · tanı · aktivite/kronisite');
 if(S.guide==='acr'){
  if(S.previous==='dual')add('İkili → üçlü','GC + MPAA + belimumab / CNI veya CYC + belimumab');
  if(S.previous==='triple')add('Üçlü → alternatif','Diğer üçlü rejime geç veya anti-CD20 eklemeyi değerlendir');
  if(S.previous==='two')add('Refrakter (≥2 rejim)','Anti-CD20 · MPAA + belimumab + CNI · araştırma tedavisi');
 }else if(S.guide==='kdigo'){
  add('Rejim değişimi','MPAA ↔ CYC · belimumab/CNI ekleme veya uygun alternatif');add('Refrakter','Rituksimab veya genişletilmiş immünsüpresyon (uzman merkez)');
 }else{add('Yeniden sınıflama','Tekrar biyopsi / kronisite ve ilaç uyumu');add('İmmün tedavi değişikliği','MPAA · CYC · CNI · belimumab · anti-CD20 seçenekleri');}
 add('Kötüleşen eGFR','Erken yoğunlaştırma / nefroloji iş birliği');
 }
 function screening(){add('SLE taraması','Proteinüri ve idrar incelemesi');if(S.guide==='acr')add('ACR zamanlama','Renal hastalık yoksa 6–12 ayda bir; ekstrarenal alevlenmede tekrar');
 add('Biyopsi','UPCR >0,5 g/g ve/veya açıklanamayan böbrek fonksiyon bozukluğu');add('Patoloji','ISN/RPS I–VI · aktivite/kronisite · eşlik eden TMA');
 if(S.clazz==='unknown')add('Biyopsi alınamıyorsa','Nefritik fenotip: III/IV; nefrotik fenotip: V yönünden uzman değerlendirmesi');
 }
 function supportive(){add('Temel tedavi','HCQ (kontrendikasyon yoksa) · böbrek fonksiyonuna göre değerlendirme');add('Nefroproteksiyon','RAASİ (uygunsa) · KB kontrolü · proteinüri izlemi');add('Komorbiditeler','Dislipidemi · enfeksiyon / aşı · kemik sağlığı · kardiyovasküler risk');add('Üreme sağlığı','Gebelik planı · teratojen ilaçlar · kontrasepsiyon');add('Tromboz','Nefrotik durum / APS / albumin düzeyi ile antikoagülasyon değerlendirmesi');add('KBH','İleri nefroloji / diyaliz / transplant planı');}
 function build(){items.length=0;if(S.stage==='screen')screening();else if(S.stage==='initial')treatment();else if(S.stage==='follow')follow();else if(S.stage==='resistant')resistant();else supportive();return items;}
 function render(){const rows=build();return `<div class="ln-page"><button type="button" class="breadcrumb-back" data-go="algorithms">← Algoritmalar</button><div class="dose-page-head"><span class="eyebrow">LUPUS NEFRİTİ · KARAR ALGORİTMASI</span><h1>ACR / EULAR / KDIGO</h1><p>Kılavuz → klinik durum → biyopsi → tedavi → yanıt.</p></div>
 <section class="ln-panel"><div class="ln-opts">${choice('guide','Kılavuz')}${choice('stage','Aşama')}${choice('age','Hasta grubu')}</div></section>
 <section class="ln-panel"><h2>Hasta özellikleri</h2><div class="ln-opts">${choice('clazz','Biyopsi sınıfı')}${choice('activity','Patoloji aktivitesi')}${choice('protein','Proteinüri / UPCR')}${choice('gfr','Böbrek fonksiyonu')}${choice('extra','Ekstrarenal SLE')}${choice('risk','TMA / APS')}${choice('pregnancy','Gebelik planı')}${choice('time','Tedavinin süresi')}${S.stage==='follow'?choice('response','Renal yanıt'):''}${S.stage==='resistant'?choice('previous','Önceki tedavi'):''}</div></section>
 <section class="ln-panel"><div class="ln-head"><h2>Tedavi akışı</h2><a href="${links[S.guide]}" target="_blank" rel="noopener">${S.guide.toUpperCase()} · Kaynak ↗</a></div><div class="ln-path">${rows.map((r,i)=>`${i?'<div class="ln-down">↓</div>':''}${box(...r)}`).join('')}</div></section>
 <section class="ln-panel ln-small"><strong>Ortak izlem</strong><div class="ln-chips"><span>UPCR</span><span>eGFR</span><span>KB</span><span>C3 / C4</span><span>anti-dsDNA</span><span>Sediment</span><span>Adherans</span><span>Toksisite</span></div></section>
 <p class="ln-foot">Kaynak özeti; resmî kılavuz akış şeması değildir. İlaçların yaş, eGFR, gebelik ve ruhsat özellikleri ayrıca değerlendirilmelidir. Özellikle EULAR 2025'in tüm alt önerilerinin birebir dijital transkripsiyonu değildir.</p></div>`;}
 function onChange(e){let el=e.target.closest('[data-ln]');if(!el)return false;S[el.dataset.ln]=el.value;document.querySelector('#app').innerHTML=render();return true;}
 return {render,onChange};
})();
