# v0.50 — Devam raporları başlangıç raporunun öyküsünü içerir
- JİA devam raporlarında önceki ilaç, başlangıçtaki tedavi süresi ve pACR yanıtı yapılandırılmış seçimlerden alınır.
- İlk raporun gerekçesi -> biyolojik tedavinin başlanması -> takip ayındaki yanıt -> devam kararı -> güncel doz/sıklık/yol sırasıyla yazılır.
- Veri yoksa başlangıç öyküsü uydurulmaz; devam raporu oluşturulmaz.
- SUT uygunluğu ve kodlar son klinik/mevzuat doğrulaması gerektirir.

# Çocuk Romatoloji v0.48 — Kolay veri girişi

- Önceki tek ekran formu korunmuştur.
- Yaş ve kilo serbest metin yerine seçim listesi olarak verilir.
- CRP ölçümleri: takvimden tarih, sayı girişinden sonuç ve laboratuvar normal üst sınırı; yeni ölçüm satırı eklenebilir.
- CRP verileri mevcut kuralların beklediği açıklama alanına otomatik çevrilir ve tarih aralığı/iki kat sınırına karşı kontrol edilir.
- Diğer SUT modülleri korunmuştur.
- Klinik doğruluk ve MEDULA kabulü hekim/kurum doğrulaması gerektirir.

# Çocuk Romatoloji v0.46 — Tek ekran SUT rapor oluşturucu

- İlacı seç → hastalığı seç → klinik durumu seç → koşullar ve verileri tamamla → standart rapor metnini üret.
- Ayrı EK-4/D arama, bağımsız endikasyon dışı formu ve ikinci MEDULA ekranı kullanıcı arayüzünden kaldırıldı. Alttaki eşleşme verisi korundu.
- FMF: E85.0, SGK rapor teşhisi 06.05 (resmî SGK teşhis listesi).
- SURF: R50.9, endikasyon dışı kullanım onayıyla EK-4/D 15.16 eşleşmesinden 21.01 ön değerlendirmesi; onay ve yıldız dipnotu teyidi zorunlu.
- Diğer tanılarda doğrulanmamış MEDULA kodları otomatik doldurulmaz. CNO M86.3 yalnız örnek ICD olup klinik kod teyidi gerektirir.
- Hastaya ait kimlik bilgileri girilmemeli; uygulama elektronik SGK sorgusu yapmaz.
- Mevcut v0.45 kural senaryoları korunur.

Kaynaklar: 02.10.2026 SUT ve EK-4/D (kullanıcı dosyaları); SGK rapor teşhis listesi / MEDULA rapor servis kılavuzu.
# v0.45 — Rapor + EK-4/D + MEDULA tek akış
- Rapor senaryosunda tam ICD ve ruhsat/endikasyon durumu aynı ekrana bağlandı.
- Doğrudan, spesifik ilaç–ICD eşleşmesi ve teyit edilmiş dipnotlar bulunmadığında 21.01 önerilmiyor.
- 20.01 için listenin tamamında muafiyet bulunmadığı hekim tarafından ayrıca doğrulanmalı.
- Grup ve genel eşleşmelerden kesin muafiyet çıkartılmıyor.
- Önceki rapor şablonları korunmuştur; bu sürüm nihai mevzuat denetimi değildir.

# v0.44 — SUT romatoloji yeni senaryoları ve ek kontroller
Kaynak: Kullanıcının 02.10.2026 SUT ana metni, üstü çizilmemiş 4.2.1.C-6 (1–5), C-9 (3), C-10 (2).
- Erişkin RA: Tofasitinib, upadasitinib, barisitinib başlangıç / 3. ay / 6. ay + izlem.
- Erişkin PsA: Tofasitinib ve upadasitinib başlangıç / 12. hafta; sekukinumab ve iksekizumab başlangıç / 16. hafta.
- Erişkin ankilozan spondilit: Tofasitinib ve upadasitinib başlangıç / 12. hafta.
- Erişkin nr-axSpA: Upadasitinib başlangıç / 12. hafta.
- RA DAS28 >0,6 / >1,2 ve aksiyel BASDAI ≥2 
## v0.48 — SUT alan düzeltmeleri
- IL-1 rapor kurallarının kullandığı `crpLog`, takvimli CRP satırlarına bağlandı (`crpDates` ile birlikte güncellenir).
- `colMonths` 0–120 ay ve `attacks` 0–30 adet seçilebilir hale getirildi.
- CRP tarihlerinin, sonuçlarının ve normal üst sınırlarının kaydedilmesi; atak sayısı ve 15 günlük aralık doğrulaması tek forma bağlandı.
- SUT girdileri yalnızca girilen belgelerin ön kontrolüdür; klinik doğrulama gerektirir.


## v0.49 – Klinik rapor dili
- Tek ekranlı SUT akışına standart klinik cümle üreticisi eklendi.
- Başlangıç, devam ve tedavi değişimi için ayrı dil; pACR/DAS28/BASDAI/JADAS yanıt alanları.
- Yaş, kilo ve hekim seçimiyle doz/birim/sıklık/uygulama yolu rapora eklenir; otomatik doz önerilmez.
- Önceki SUT koşul kontrolleri korunur. Bu sürümün tarayıcı ve tüm mevzuat senaryoları için eksiksiz klinik doğrulaması yapılmamıştır.


v0.51: Poliartiküler JİA için Etanersept, Adalimumab, İnfliksimab ve Tosilizumab rapor akışında koşula göre değişen sade form; başlangıçta yeni ilacın pACR yanıtı sorulmaz; devamda yeni ilacın pACR yanıtı sorulur; geçişte önceki ilacın yanıtsızlığı sorgulanır. Tosilizumab öncesi NSAİ/MTX/anti-TNF seçenekleri SUT 4.2.1.C-5 (2) gereği ayrı tutulur. Bu modül tüm klinik/ruhsat şartlarını kapsamaz.


v0.52: JİA önceki biyolojik pACR30/50/70/90; tosilizumab öncesi NSAİ/DMARD/anti-TNF birden çok seçim ve senaryoya göre doğrulama; anakinra FMF kolşisin yurt içi/yurt dışı evet/hayır ve toplam 6 ay doğrulama; kanakinumab geçişinde alerji uzmanı belgeli reaksiyon veya diğer ciddi yan etki dalları. 02.10.2026 SUT 4.2.1.C-7 yurt dışı için ayrı 3 aylık zorunluluk getirmez.
