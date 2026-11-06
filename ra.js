/* EULAR RA 2025 update — published 2026. Adult population. */
'use strict';
const RAFlow=(()=>{
 let stage='initial', response='none';
 const stages=[['initial','Tanı / İlk tedavi'],['review','3–6. ay değerlendirmesi'],['failure','bDMARD / JAKi yanıtsızlığı'],['remission','Kalıcı remisyon']];
 const steps={
 initial:{title:'Yeni tanı / ilk tedavi',items:[['RA tanısı kondu','DMARD tedavisini geciktirmeden başlat. Başlangıç aktivitesi ve komorbiditeleri kaydet.'],['İlk tercih: metotreksat','Folat desteğiyle, uygun doz ve uygulama yolu; kontrendikasyon veya erken intoleransta leflunomid ya da sülfasalazin.'],['Kısa süreli glukokortikoid düşünülebilir','csDMARD başlarken/değiştirirken köprüleme; klinik olarak mümkün olan en kısa sürede azalt ve kes.'],['Treat-to-target izlem','Kalıcı remisyon veya düşük hastalık aktivitesi hedefi; aktif hastalıkta 1–3 ayda bir aktivite değerlendirmesi.']]},
 review:{title:'Tedavi hedefi değerlendirmesi',items:[['En geç 3. ay','Belirgin iyileşme yoksa tedavi stratejisini değiştir; uyum, MTX optimizasyonu ve alternatif nedenleri gözden geçir.'],['6. ay','Remisyon veya düşük hastalık aktivitesi hedefine ulaşılamadıysa tedaviyi değiştir.'],['csDMARD stratejisi yetersiz','bDMARD ekle: TNFi veya başka etki mekanizmalı biyolojik ajan; bireysel hastalık profili ve eşlik eden hastalıkları dikkate al.'],['JAK inhibitörü alternatif olabilir','MACE, malignite, VTE ve diğer güvenlilik risklerini dikkatlice değerlendir; yaş, kontrendikasyon ve ruhsatı kontrol et.'],['Kombinasyon yaklaşımı','b/tsDMARD için csDMARD ile kombinasyon tercih edilir; csDMARD kullanılamıyorsa IL-6 yolu inhibitörleri veya JAKi monoterapisi avantajlı olabilir.']]},
 failure:{title:'İlk ileri tedaviye yanıtsızlık',items:[['Tanı ve tedavi yeterliliğini tekrar değerlendir','Aktiviteyi doğrula, enfeksiyon ve komorbiditeyi dışla, maruziyet ve uyumu kontrol et.'],['Başka bir bDMARD veya tsDMARD seç','Aynı biyolojik sınıf içinde ikinci ajan ya da farklı etki mekanizmasına geçilebilir.'],['TNFi / IL-6Ri başarısızlığı','Aynı sınıfta ikinci molekül veya farklı mekanizma uygundur; önceki intolerans ve hastalık özelliğine göre seç.'],['JAK inhibitörü düşünülüyorsa','Kardiyovasküler olay, malignite ve tromboemboli risklerini yeniden tart; bireysel risk ve ruhsatı dikkate al.']]},
 remission:{title:'Kalıcı klinik remisyon',items:[['Ön koşul','Glukokortikoid kesilmiş olmalı ve kalıcı remisyon doğrulanmalı.'],['DMARD sürdür','Tamamen kesmek yerine devam et; uygun hastada dikkatli doz azaltımı değerlendirilebilir.'],['Yakın takip','Azaltma sonrası alevlenme riskini izle; relapsta etkin rejimi yeniden kur.']]}
 };
 const recs=[
 'Tanıyla birlikte DMARD başla.', 'Remisyon veya düşük aktiviteyi hedefle.', 'Aktif hastalıkta her 1–3 ay izle; 3. ayda iyileşme, 6. ayda hedef yoksa değiştir.',
 'İlk stratejide MTX; uygun değilse leflunomid veya sülfasalazin.', 'csDMARD başlama/değişiminde kısa süreli glukokortikoid düşün, hızla kes.',
 'csDMARD hedefe ulaştırmadıysa bDMARD ekle; JAKi için risk değerlendirmesi yap.',
 'b/tsDMARDı mümkünse csDMARDla birlikte kullan; csDMARD kullanılamıyorsa IL-6i/JAKi monoterapisi öne çıkabilir.',
 'İlk b/tsDMARD yanıtsızlığında aynı veya farklı sınıftan alternatif bDMARD/tsDMARD seç.',
 'Glukokortikoid kesilmiş ve kalıcı remisyonda DMARD devamı önerilir; doz azaltımı düşünülebilir.'
 ];
 const link='https://doi.org/10.1016/j.ard.2026.01.023';
 function render(){let d=steps[stage];return `<button type="button" class="breadcrumb-back" data-go="algorithms">← Algoritmalara dön</button>
 ${cardsTitle('Romatoid artrit · EULAR tedavi algoritması','EULAR 2025 update · 12–13 Mart 2026 çevrim içi yayım · Erişkin RA','EULAR · 2026 YAYIMI')}
 <div class="info-banner notice-banner"><span><b>Yaş kapsamı: erişkin RA.</b> Bu algoritma <b>juvenil idiyopatik artrit (JİA)</b> için geçerli bir pediatrik tedavi önerisi değildir. Çocuk hastalarda ACR/JİA ve ilgili pediatrik kılavuzlara başvurulmalıdır. İleri tedavilerde enfeksiyon taraması, aşılar ve ruhsat/geri ödeme koşulları ayrıca değerlendirilir.</span></div>
 <section class="aav-panel behcet-panel"><span class="step-tag">KLİNİK KARAR</span><h2>Hangi aşamadasınız?</h2><div class="aav-choices">${stages.map(([id,name])=>`<button type="button" class="behcet-choice ${stage===id?'active':''}" data-ra="stage" data-value="${id}" aria-pressed="${stage===id}">${name}</button>`).join('')}</div></section>
 <section class="aav-panel behcet-panel behcet-outcome"><span class="step-tag">TEDAVİ ŞEMASI</span><h2>${d.title}</h2><div class="ra-flow">${d.items.map(([title,body],i)=>`<div class="ra-node"><span class="ra-count">${i+1}</span><div><strong>${title}</strong><p>${body}</p></div></div>`).join('')}</div></section>
 <section class="aav-panel behcet-panel"><h2>Dokuz EULAR önerisinin klinik özeti</h2><ol class="behcet-steps">${recs.map(x=>`<li>${x}</li>`).join('')}</ol></section>
 <section class="aav-panel behcet-panel"><h2>Kaynak ve kapsam</h2><p>Smolen JS ve ark. <i>EULAR recommendations for the management of rheumatoid arthritis with synthetic and biologic disease-modifying antirheumatic drugs: 2025 update.</i> Ann Rheum Dis. 2026;85:991–1009. DOI: 10.1016/j.ard.2026.01.023. <a href="${link}" target="_blank" rel="noopener noreferrer">Özgün kılavuz ↗</a></p><p>9 öneri ve 5 temel ilke; özgün figür birebir kopyalanmamış, Türkçe klinik akış olarak özetlenmiştir.</p></section>`;}
 function onClick(e){let el=e.target.closest('[data-ra]');if(!el)return false;if(el.dataset.ra==='stage')stage=el.dataset.value;let mount=document.querySelector('#app');if(mount){let y=scrollY;mount.innerHTML=render();scrollTo(0,y);}return true;}
 return {render,onClick};
})();
