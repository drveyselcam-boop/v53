# Çocuk Romatoloji v0.53 — SUT rapor oluşturucu yeniden yapılandırma

**Kaynak:** Kullanıcının ilettiği 02.10.2026 değişiklikleri işlenmiş 2013 SUT ana metni. Word belgesinde üstü çizili eski hükümler hariç tutularak 4.2.1.C-1, C-2, C-3, C-5 ve C-7 maddelerinden kurallar yapılandırılmıştır.

- Tek ekran: ilaç → tanı → senaryo → yalnız ilgili Evet/Hayır, seçim ve tarih/sayı alanları → rapor.
- Yeni modül `sut-smart.js` ve mevcut siteye entegrasyon. Eski genel modül dosyaları geriye dönük kaynak olarak korunmuştur, aktif SUT ekranında kullanılmaz.
- 55 yapılandırılmış senaryo: FMF ve AA amiloidozu (anakinra/kanakinumab), poliartiküler ve sistemik JİA (anti-TNF, tosilizumab, abatasept, anakinra/kanakinumab), GPA/MPA (rituksimab), erişkin RA (rituksimab, abatasept, tosilizumab).
- Anakinra FMF direnç yolu: yurt içi, yurt dışı, toplam 6 ay, atak sayısı ve tarih/CRP üst sınırları. Ciddi kolşisin intoleransı yolu ayrı; kolşisin kullanımı yine sorulur, hayır denilenler rapora yazılmaz.
- Kanakinumab ciddi yan etki: uzman konsültasyonu branşı/tarihi, alerjik reaksiyonda alerji uzmanı doğrulaması.
- pJİA: ilk başlangıçta yeni ilacın pACR yanıtı sorulmaz. Devamda pACR yanıtı, değişimde önceki biyolojik ve yanıtsızlık. Tosilizumab öncesi birden fazla tedavi seçimi desteklenir.
- İlgisiz DMARD / pACR soruları FMF ekranına gelmez.
- Eksik/olumsuz zorunlu koşullarda rapor otomatik oluşturulmaz. Rapor metni AI olmadan şablonla hazırlanır, dozu hekim girer.
- FMF için E85.0 ve 06.05 kodu gösterilir; diğer tanılarda doğrulanmamış MEDULA kodu uydurulmaz. Ek-4/D ve Bakanlık onayı ayrıca kontrol edilmelidir.

**Kapsam sınırı:** Bu sürüm 55 seçilmiş senaryonun yeniden yapılandırılmış ilk sürümüdür; tüm romatoloji ilaçlarının tüm SUT endikasyonları ve ruhsat koşulları henüz kapsanmamaktadır. Raporun oluşması SGK/MEDULA kabulü anlamına gelmez. Kullanmadan önce uzman/mevzuat doğrulaması gerekir.

**Test:** JS sözdizimi ve 55 senaryo pozitif testleri; 6 olumsuz/doğrulama testi tamamlandı. Tarayıcı testi, çalışma ortamında web sayfalarının açılması engellendiği için yapılamadı.
