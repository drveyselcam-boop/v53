/* Çocuk Romatoloji v0.53 — SUT 02.10.2026, koşula özel, tek ekran rapor kontrolü.
   Doğrulanmamış bilgi rapora eklenmez. Eski jenerik SUTSupport ekranı korunur ama kullanılmaz. */
const SUTSmart = (()=>{
 const SRC='02.10.2026 değişiklikleri işlenmiş SUT';
 const P=[]; let state={},active='fmf_ana_res';
 const yes=(id,label,text,required=true)=>({id,type:'yes',label,text,required});
 const choose=(id,label,values,required=true)=>({id,type:'select',label,values,required});
 const multi=(id,label,values,required=true)=>({id,type:'multi',label,values,required});
 const number=(id,label,min=null,max=null,required=true)=>({id,type:'number',label,min,max,required});
 const date=(id,label,required=true)=>({id,type:'date',label,required});
 const crp=(minCount=2)=>({id:'crp',type:'crp',label:'Atak CRP ölçümleri (tarih, sonuç, normal üst sınır)',minCount,required:true});
 const add=(id,group,drug,phase,title,ref,questions,opts={})=>P.push({id,group,drug,phase,title,ref,questions,...opts});
 const age=number('age','Yaş (yıl)',0,120),weight=number('weight','Ağırlık (kg)',0.1,250);
 const board=(txt='İlgili SUT maddesindeki sağlık kurulu, branş, rapor süresi ve reçeteleme yetkisi kontrol edildi')=>yes('board',txt,'');
 const doseQ=[number('dose','Tek uygulama dozu (mg)',0.01,10000),choose('freq','Uygulama sıklığı',[['Günde 1 kez','1x/gün'],['Günde 2 kez','2x/gün'],['Haftada 1 kez','1x/hafta'],['2 haftada 1','1x/2 hafta'],['4 haftada 1','1x/4 hafta'],['8 haftada 1','1x/8 hafta'],['Diğer','Diğer (manuel doz kontrolü)']]),choose('route','Uygulama yolu',[['SC','SC'],['IV','IV'],['PO','PO']])];
 const colQuestions=()=>[
  yes('domestic','Yurt içi kolşisin kullanıldı mı?','Yurt içi kolşisin kullanılmıştır.',false),
  yes('foreign','Yurt dışı kolşisin preparatı kullanıldı mı?','Yurt dışı kolşisin preparatı kullanılmıştır.',false),
  yes('col6','Tolere edilen maksimum dozda, yurt içi ve gerektiğinde yurt dışı preparatlarla toplam en az 6 ay kolşisin kullanıldı mı?','Tolere edilebilen maksimum dozda, yurt içi ve gerektiğinde yurt dışı kolşisin preparatları toplam en az 6 ay kullanılmıştır.'),
  yes('colFail','Bu tedaviye rağmen yeterli yanıt alınamadı mı?','Kolşisin tedavisine rağmen yeterli klinik yanıt alınamamıştır.')];
 const colTolerance=()=>[
  yes('domestic','Yurt içi kolşisin kullanıldı mı?','Yurt içi kolşisin kullanılmıştır.',false),
  yes('foreign','Yurt dışı kolşisin preparatı kullanıldı mı?','Yurt dışı kolşisin preparatı kullanılmıştır.',false),
  yes('intolerant','Kolşisine ciddi intolerans nedeniyle ilacın kullanılamadığı belgelendi mi?','Kolşisine karşı ciddi intolerans nedeniyle tedavinin sürdürülemediği belgelenmiştir.')];
 const attackQ=(min=3,period=3)=>[number('attacks',`Son ${period} ayda belgelenen atak sayısı`,min,99),crp(min),yes('acute',`Atakların akut faz yüksekliğiyle belgelendiği doğrulandı mı?`,`Son ${period} ayda akut faz reaktanları yüksekliğiyle belgelenmiş ataklar mevcuttur.`)];
 const sideEffect=()=>[
  yes('adverse','Anakinra tedavisine devamı önleyen ciddi yan etki belgelendi mi?','Anakinra tedavisine devamı engelleyen ciddi yan etki gelişmiştir.'),
  choose('adverseKind','Yan etki türü',[['allergy','Alerjik reaksiyon'],['other','Diğer ciddi yan etki']]),
  yes('consult','İlgili branş uzmanının konsültasyon notu mevcut mu?','Ciddi yan etki ilgili branş uzmanı konsültasyonu ile doğrulanmıştır.'),
  yes('allergySpec','Alerjik reaksiyon alerji uzmanı tarafından belgelenmiş mi?','Alerjik reaksiyon alerji uzmanı tarafından belgelenmiştir.'),
  choose('branch','Konsültasyonu belgeleyen uzmanlık',[['Alerji ve İmmünoloji','Alerji ve İmmünoloji'],['Çocuk Alerji ve İmmünoloji','Çocuk Alerji ve İmmünoloji'],['Romatoloji','Romatoloji'],['Çocuk Romatoloji','Çocuk Romatoloji'],['Dermatoloji','Dermatoloji'],['Diğer ilgili branş','Diğer ilgili branş']]),date('consultDate','Konsültasyon notunun tarihi')];
 // FMF – SUT 4.2.1.C-7 (2)(a), (b). İntolerans yolunda kolşisin 6 ay zorunlu değil.
 add('fmf_ana_res','FMF','Anakinra','Başlangıç','Kolşisin direnci','4.2.1.C-7 (2)(a)(1)',[age,weight,yes('noamy','AA amiloidozu bulunmadığı doğrulandı mı?','AA amiloidozu saptanmamıştır.'),...colQuestions(),...attackQ(3,3),board()],{limit:{age:2,weightExclusive:7.5},requireForeignWhenFail:true});
 add('fmf_ana_int','FMF','Anakinra','Başlangıç','Ciddi kolşisin intoleransı','4.2.1.C-7 (2)(a)(1)',[age,weight,yes('noamy','AA amiloidozu bulunmadığı doğrulandı mı?','AA amiloidozu saptanmamıştır.'),...colTolerance(),board()],{limit:{age:2,weightExclusive:7.5}});
 add('fmf_ana_cont','FMF','Anakinra','Devam','Anakinra ile yanıt / idame','4.2.1.C-7 (2)(a)(1)',[age,weight,choose('original','Anakinraya başlama nedeni',[['res','Kolşisin direnci'],['int','Ciddi kolşisin intoleransı']]),yes('domestic','Yurt içi kolşisin kullanıldı mı?','Yurt içi kolşisin kullanılmıştır.',false),yes('foreign','Yurt dışı kolşisin kullanıldı mı?','Yurt dışı kolşisin preparatı kullanılmıştır.',false),yes('response','Anakinra ile klinik yanıt elde edildi mi?','Anakinra tedavisinden klinik yanıt alınmıştır.'),board()],{limit:{age:2,weightExclusive:7.5}});
 add('fmf_ana_restart','FMF','Anakinra','Yeniden başlama','6 aydan uzun ara sonrası','4.2.1.C-7 (2)(a)(1)',[age,weight,yes('gap','Anakinraya 6 aydan uzun ara verildi mi?','Anakinra tedavisine altı aydan uzun süre ara verilmiştir.'),...attackQ(3,6),board()],{limit:{age:2,weightExclusive:7.5}});
 add('fmf_can_fail','FMF','Kanakinumab','Geçiş','3 ay anakinraya yanıtsızlık','4.2.1.C-7 (2)(a)(2)',[age,weight,yes('ana3','Anakinra ara vermeden düzenli 3 ay kullanıldı mı?','Anakinra üç ay süreyle kesintisiz uygulanmıştır.'),...attackQ(2,3),board()],{limit:{age:2,weightExclusive:7.5},attackAdult3:true});
 add('fmf_can_adverse','FMF','Kanakinumab','Geçiş','Anakinra ciddi yan etkisi / alerjisi','4.2.1.C-7 (2)(a)(2)',[age,weight,...sideEffect(),board()],{limit:{age:2,weightExclusive:7.5}});
 add('fmf_can_cont','FMF','Kanakinumab','Devam','3. ay yanıt / idame','4.2.1.C-7 (2)(a)(3)',[age,weight,yes('regular3','Kanakinumab 3 ay düzenli uygulandı mı?','Kanakinumab üç ay süreyle düzenli uygulanmıştır.'),yes('lessAttacks','Atak sıklığı ve şiddeti azaldı mı?','Üç aylık kontrolde atak sıklığı ve şiddetinde azalma saptanmıştır.'),board()]);
 add('fmf_can_restart','FMF','Kanakinumab','Yeniden başlama','6 aydan uzun ara sonrası','4.2.1.C-7 (2)(a)(3)',[age,weight,yes('gap','Kanakinumaba 6 aydan uzun ara verildi mi?','Kanakinumab tedavisine altı aydan uzun süre ara verilmiştir.'),...attackQ(3,6),board()]);
 add('fmf_can_up','FMF','Kanakinumab','Doz değişimi','150 mg’dan 300 mg’a geçiş','4.2.1.C-7 (2)(a)(4)',[age,weight,yes('prior150','150 mg/4 hafta kanakinumab kesintisiz 6 ay kullanıldı mı?','Kanakinumab 150 mg/4 hafta dozunda altı ay kesintisiz kullanılmıştır.'),...attackQ(2,3),board()],{attackAdult3:true});
 add('fmf_can_spacing','FMF','Kanakinumab','Doz aralığı','Doz aralığını açma','4.2.1.C-7 (2)(a)(3)',[age,weight,yes('noAttack6','Tedavi sırasında 6 ay ataksız geçti mi?','Kanakinumab tedavisi sırasında altı ay atak izlenmemiştir.'),yes('normalAfp','Akut faz reaktanları normal mi?','Akut faz reaktanları normal sınırlardadır.'),board()]);
 add('fmf_can_stop','FMF','Kanakinumab','Sonlandırma','Doz aralığı açıldıktan sonra sonlandırma','4.2.1.C-7 (2)(a)(3)',[age,weight,yes('twoMonth6','İki ayda bir doz aralığıyla 6 ay ataksız izlendi mi?','İki ayda bir doz aralığıyla altı ay ataksız izlenmiştir.'),yes('threeMonth6','Üç ayda bir doz aralığıyla 6 ay ataksız izlendi mi?','Üç ayda bir doz aralığıyla altı ay ataksız izlenmiştir.'),yes('normalAfp','Akut faz reaktanları normal mi?','Akut faz reaktanları normal sınırlardadır.'),board()],{noDose:true});
 add('amy_ana','FMF + AA amiloidozu','Anakinra','Başlangıç','Biyopsiyle kanıtlı AA amiloidozu','4.2.1.C-7 (2)(b)',[age,weight,yes('amyBiopsy','Herhangi bir dokuda biyopsiyle AA amiloidozu gösterildi mi?','Biyopsi ile AA tipi amiloidoz varlığı kanıtlanmıştır.'),board('Romatoloji ve/veya nefroloji uzmanı içeren resmî üçüncü basamak sağlık kurulu ve reçete yetkisi doğrulandı')]);
 add('amy_can_fail','FMF + AA amiloidozu','Kanakinumab','Geçiş','Anakinraya 3 ayda yetersiz yanıt','4.2.1.C-7 (2)(b)',[age,weight,yes('amyBiopsy','Biyopsiyle AA amiloidozu gösterildi mi?','AA tipi amiloidoz biyopsiyle kanıtlanmıştır.'),yes('ana3','Anakinra 3 ay uygulandı mı?','Anakinra üç ay süreyle uygulanmıştır.'),yes('expertNoResponse','Romatoloji/nefroloji uzmanı gerekçeli yanıtsızlığı raporladı mı?','Romatoloji ve/veya nefroloji uzmanının gerekçeli değerlendirmesinde anakinraya yeterli yanıt olmadığı belirtilmiştir.'),board()]);
 add('amy_can_adverse','FMF + AA amiloidozu','Kanakinumab','Geçiş','Anakinra ciddi yan etkisi','4.2.1.C-7 (2)(b)',[age,weight,yes('amyBiopsy','Biyopsiyle AA amiloidozu gösterildi mi?','AA tipi amiloidoz biyopsiyle kanıtlanmıştır.'),...sideEffect(),board()]);
 add('amy_can_cont','FMF + AA amiloidozu','Kanakinumab','Devam','Yanıt sonrası idame','4.2.1.C-7 (2)(b)',[age,weight,yes('amyBiopsy','AA amiloidozu biyopsiyle doğrulandı mı?','AA amiloidozu biyopsiyle kanıtlanmıştır.'),yes('response','Tedaviye yanıt elde edildi mi?','Kanakinumab ile tedavi yanıtı elde edilmiştir.'),board()]);
 add('amy_ana_cont','FMF + AA amiloidozu','Anakinra','Devam','Yanıt sonrası idame','4.2.1.C-7 (2)(b)',[age,weight,yes('amyBiopsy','AA amiloidozu biyopsiyle doğrulandı mı?','AA amiloidozu biyopsiyle kanıtlanmıştır.'),yes('response','Tedaviye yanıt elde edildi mi?','Anakinra ile tedavi yanıtı elde edilmiştir.'),board()]);
 // FMF'de yaş ve kilo sınırı tüm ilaç/rapor aşamalarında korunur.
 for(const r of P.filter(p=>p.group==='FMF'&&p.drug==='Kanakinumab'))r.limit={age:2,weightExclusive:7.5,...(r.limit||{})};
 const jiaAge=[age,weight];
 const preDmard=()=>[yes('nsaid','NSAİ tedavisi uygulandı mı?','NSAİ tedavisi uygulanmıştır.'),yes('dmard3','En az bir DMARD 3 ay kullanıldı mı?','En az üç ay DMARD tedavisi uygulanmıştır.'),multi('dmards','Kullanılan DMARD(lar)',[['Metotreksat','metotreksat (MTX)'],['Leflunomid','leflunomid'],['Sulfasalazin','sulfasalazin'],['Diğer','diğer DMARD']]),yes('noPacr30','Bu tedaviyle pACR30 yanıtı elde edilemedi mi?','Önceki tedaviye rağmen pACR30 yanıtı elde edilememiştir.')];
 const prevTNF=()=>[choose('priorDrug','Önceki anti-TNF ilacı',[['Etanersept','etanersept'],['Adalimumab','adalimumab'],['İnfliksimab','infliksimab'],['Golimumab','golimumab'],['Sertolizumab','sertolizumab']]),yes('prior3','Önceki anti-TNF en az 3 ay kullanıldı mı?','Önceki anti-TNF tedavisi en az üç ay uygulanmıştır.'),choose('failTarget','Önceki tedaviyle ulaşılamayan pACR eşiği',[[30,'pACR30'],[50,'pACR50'],[70,'pACR70'],[90,'pACR90']])];
 const follow=(threshold,months)=>[yes('monthsPassed',`${months}. ay değerlendirmesi yapıldı mı?`,`Tedavinin ${months}. ay değerlendirmesi yapılmıştır.`),choose('pacr','Mevcut ilaçla elde edilen pACR yanıtı',[[0,'pACR30 altında'],[30,'pACR30'],[50,'pACR50'],[70,'pACR70'],[90,'pACR90']]),board(),];
 const tnf=['Etanersept','Adalimumab','İnfliksimab'];
 for(const d of tnf){
  add('pjia_'+d+'_start','Poliartiküler JİA',d,'Başlangıç','İlk anti-TNF','4.2.1.C-1 (1)(b)(1)',[...jiaAge,...preDmard(),yes('uveitisNo','Eşlik eden üveit bulunmuyor mu? (Üveitte ilk anti-TNF adalimumabdır)', 'Eşlik eden üveit bulunmamaktadır.',d!=='Adalimumab'),board()],{minAge:null});
  add('pjia_'+d+'_m3','Poliartiküler JİA',d,'Devam','3. ay kontrolü','4.2.1.C-1 (1)(b)(2)',[...jiaAge,...preDmard(),...follow(30,3)],{responseMin:30});
  add('pjia_'+d+'_m6','Poliartiküler JİA',d,'Devam','6. ay ve idame','4.2.1.C-1 (1)(b)(2)',[...jiaAge,...preDmard(),...follow(50,6)],{responseMin:50});
  add('pjia_'+d+'_switch','Poliartiküler JİA',d,'Geçiş','Başka anti-TNF sonrası geçiş','4.2.1.C-1 (1)(b)',[...jiaAge,...preDmard(),...prevTNF(),board()],{previousDifferent:true});
 }
 // Tosilizumab pJİA: NSAİ ve/veya MTX veya anti-TNF; birden fazlası seçilebilir. Ön tedavi yanıtını sor, yeni ilaç yanıtını başlangıçta sorma.
 const tociBefore=()=>[
  multi('priorTypes','Tosilizumab öncesi kullanılan tedaviler (birden fazla seçilebilir)',[['NSAİ','NSAİ'],['Metotreksat','metotreksat'],['Anti-TNF','anti-TNF']]),
  choose('priorTnf','Anti-TNF seçildiyse hangi ilaç?',[["Etanersept","etanersept"],["Adalimumab","adalimumab"],["İnfliksimab","infliksimab"],["Golimumab","golimumab"],["Sertolizumab","sertolizumab"]],false),
  yes('prior3','Seçilen ön tedavi yolu toplam 3 ay uygulandı mı?','Ön tedavi üç ay süreyle uygulanmıştır.'),
  yes('noPacr30','Ön tedaviyle pACR30 yanıtı elde edilemedi mi?','Önceki tedavilerle pACR30 yanıtı elde edilememiştir.')];
 add('pjia_toci_start','Poliartiküler JİA','Tosilizumab','Başlangıç','Ön tedavi yanıtsızlığı','4.2.1.C-5 (2)(a)',[...jiaAge,yes('atLeast2','Hasta en az 2 yaşında mı?','Hasta en az iki yaşındadır.'),...tociBefore(),board()],{limit:{age:2}});
 for(const [m,t] of [[3,30],[6,50]])add('pjia_toci_m'+m,'Poliartiküler JİA','Tosilizumab','Devam',m+'. ay / idame','4.2.1.C-5 (2)(a)',[...jiaAge,...tociBefore(),...follow(t,m)],{limit:{age:2},responseMin:t});
 // sJIA — two phenotypes, distinct condition & response threshold
 for(const phenotype of ['Sistemik bulgular','Artrit baskın']){
  const q=[age,weight,yes('nsaid','NSAİ kullanıldı mı?','NSAİ tedavisi uygulanmıştır.'),yes('steroid','Sistemik kortikosteroid kullanıldı mı?','Sistemik kortikosteroid tedavisi uygulanmıştır.'),yes('three','Üç aylık tedavi tamamlandı mı?','Üç aylık başlangıç tedavisi tamamlanmıştır.'),yes('noTarget',phenotype==='Sistemik bulgular'?'3. ayda remisyona girilemedi mi?':'3. ayda pACR50 yanıtına ulaşılamadı mı?',phenotype==='Sistemik bulgular'?'Üçüncü ayda remisyon elde edilememiştir.':'Üçüncü ayda pACR50 yanıtı alınamamıştır.'),board()];
  for(const d of ['Anakinra','Tosilizumab']){
   const short=phenotype==='Sistemik bulgular'?'sys':'art';const ref=d==='Anakinra'?'4.2.1.C-7 (1)':'4.2.1.C-5 (3)';
   add('sjia_'+short+'_'+d+'_start','Sistemik JİA',d,'Başlangıç',phenotype+' – başlangıç',ref,q,{limit:{age:d==='Tosilizumab'?2:0.667,weight:d==='Anakinra'?10:null}});
   add('sjia_'+short+'_'+d+'_cont','Sistemik JİA',d,'Devam',phenotype+' – 3 aylık yanıt',ref,[...q.slice(0,2),yes('initial','Önceki NSAİ/steroid basamakları ve yanıt eksikliği raporda belgeli mi?','NSAİ/steroid basamakları sonrası yeterli yanıt alınamamış ve bu nedenle biyolojik tedaviye başlanmıştır.'),...follow(50,3)],{limit:{age:d==='Tosilizumab'?2:0.667,weight:d==='Anakinra'?10:null},responseMin:50});
  }
  add('sjia_'+(phenotype==='Sistemik bulgular'?'sys':'art')+'_cana','Sistemik JİA','Kanakinumab','Geçiş',phenotype+' – 3 ay IL-1/IL-6 yanıtsızlığı','4.2.1.C-7 (1)',[age,weight,choose('priorDrug','Önceki ilaç',[['Anakinra','anakinra'],['Tosilizumab','tosilizumab']]),yes('prior3','Önceki ilaç 3 ay kullanıldı mı?','Önceki biyolojik üç ay kullanılmıştır.'),yes('noPacr50','Önceki ilaçla pACR50 yanıtı alınamadı mı?','Önceki ilaçla pACR50 yanıtı alınamamıştır.'),board()],{limit:{age:2}});
 }
 add('sjia_can_cont','Sistemik JİA','Kanakinumab','Devam','3 aylık pACR70 kontrolü','4.2.1.C-7 (1)',[age,weight,...follow(70,3)],{limit:{age:2},responseMin:70});
 add('pjia_aba_start','Poliartiküler JİA','Abatasept','Başlangıç','Anti-TNF yanıtsızlığı','4.2.1.C-3 (2)(a)',[...jiaAge,...prevTNF(),yes('noPacr30','Önceki anti-TNF ile pACR30 yanıtı elde edilemedi mi?','Üç aylık anti-TNF tedavisiyle pACR30 yanıtı alınamamıştır.'),yes('mtxCombo','Metotreksat ile birlikte kullanılacak mı?','Metotreksat ile kombinasyon planlanmıştır.'),board()]);
 for(const [m,t] of [[3,30],[6,50]])add('pjia_aba_m'+m,'Poliartiküler JİA','Abatasept','Devam',m+'. ay / idame','4.2.1.C-3 (2)(b)',[...jiaAge,yes('initial','Abatasept öncesi 3 ay anti-TNF yanıtsızlığı ve MTX kombinasyonu belgeli mi?','Anti-TNF yanıtsızlığı sonrası metotreksatla birlikte abatasept tedavisine başlanmıştır.'),...follow(t,m)],{responseMin:t});
 const rtxPrior=()=>[yes('severe','Ciddi ve aktif GPA/MPA olduğu belgelendi mi?','Ciddi ve aktif vaskülit bulguları mevcuttur.'),choose('cycReason','Siklofosfamid kullanılamama/yanıtsızlık nedeni',[['Direnç','siklofosfamid direnci'],['Kontrendikasyon','siklofosfamid kontrendikasyonu'],['Kullanılamıyor','siklofosfamid uygulanamaması']]),yes('gc','Glukokortikoidle kombine mi uygulanacak?','Glukokortikoid ile kombinasyon planlanmıştır.')];
 for(const g of ['GPA','MPA']){
  add('rtx_'+g+'_start',g,'Rituksimab','Başlangıç','Ciddi aktif vaskülit','4.2.1.C-2 (2)',[age,weight,...rtxPrior(),board('Romatoloji/klinik immünoloji/nefroloji içeren 1 aylık sağlık kurulu raporu ve reçete yetkisi doğrulandı')]);
  add('rtx_'+g+'_again',g,'Rituksimab','Tekrar uygulama','6 ay veya daha uzun arayla','4.2.1.C-2 (2)',[age,weight,yes('sixMonths','Önceki rituksimab uygulamasından en az 6 ay geçti mi?','Önceki rituksimab uygulamasından en az altı ay geçmiştir.'),date('prevDate','Önceki rituksimab uygulama tarihi'),yes('need','Yeni uygulama gerekliliği kurul raporunda belirtildi mi?','Yeni rituksimab uygulamasına gereksinim sağlık kurulu raporunda belirtilmiştir.'),yes('gc','Glukokortikoid kombinasyonu mevcut mu?','Glukokortikoid ile kombinasyon planlanmıştır.'),board('Yeni 1 aylık sağlık kurulu raporu ve yetkili hekim doğrulandı')]);
 }
 // Erişkin RA kullanım yolları ayrı hastalık başlığıdır; pediatrik parametrelerle asla karışmaz.
 for(const d of ['Rituksimab','Abatasept','Tosilizumab']){
  const ref=d==='Rituksimab'?'4.2.1.C-2 (1)':d==='Abatasept'?'4.2.1.C-3 (1)':'4.2.1.C-5 (1)';
  const base=[age,weight,yes('age18','Hasta 18 yaş ve üzerinde mi?','Hasta erişkindir.'),number('das','Başlangıç DAS28',0,10),...(d==='Rituksimab'?[choose('reason','Önceki anti-TNF durumu',[['fail','anti-TNF yanıtsızlığı'],['contra','anti-TNF uygun değil'],['int','anti-TNF intoleransı']]),yes('mtx','Metotreksat ile kombinasyon var mı?','Metotreksat ile kombinasyon planlanmıştır.')]:d==='Abatasept'?[yes('mtx','Metotreksat ile kombinasyon var mı?','Metotreksat ile kombinasyon planlanmıştır.')]:[]),board()];
  add('ra_'+d+'_start','Erişkin RA',d,'Başlangıç','RA – başlangıç',ref,base,{limit:{age:18},dasStart:true});
  add('ra_'+d+'_cont','Erişkin RA',d,'Devam','DAS28 takip / idame',ref,[...base,number('dasNew','Güncel DAS28',0,10),choose('month','Kontrol zamanı',[['3','3. ay'],['6','6. ay'],['12','12. ay / sonrası']])],{limit:{age:18},dasFollow:true});
 }
 const esc=x=>String(x??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
 const cur=()=>P.find(p=>p.id===active)||P[0], val=k=>state[k];
 const label=(a)=>a[1];
 function field(q){const v=val(q.id);if(q.type==='crp'){
  const rows=state._crp||[{},{},{}];return `<div class="sut-field" style="grid-column:1/-1"><span>${esc(q.label)}</span><div class="sut-crp-head"><span>Tarih</span><span>CRP (mg/L)</span><span>Normal üst sınır</span></div>${rows.map((r,i)=>`<div class="sut-crp-row"><input class="sut-input" type="date" data-smart-crp="${i}" data-key="date" value="${esc(r.date||'')}"><input class="sut-input" type="number" min="0" step="any" data-smart-crp="${i}" data-key="value" value="${esc(r.value??'')}"><input class="sut-input" type="number" min="0.01" step="any" data-smart-crp="${i}" data-key="uln" value="${esc(r.uln??'')}"></div>`).join('')}<button type="button" class="sut-btn sut-muted" data-smart-action="addcrp">+ Ölçüm ekle</button></div>`;
 }
 if(q.id==='priorTnf'&&!(state.priorTypes||[]).includes('Anti-TNF'))return '';
 if(q.id==='allergySpec'&&state.adverseKind!=='allergy')return '';
 if(q.type==='yes')return `<label class="sut-field"><span>${esc(q.label)}</span><select class="sut-input" data-smart-field="${q.id}"><option value="">Seçiniz</option><option value="yes" ${v==='yes'?'selected':''}>Evet</option><option value="no" ${v==='no'?'selected':''}>Hayır</option></select></label>`;
 if(q.type==='select')return `<label class="sut-field"><span>${esc(q.label)}</span><select class="sut-input" data-smart-field="${q.id}"><option value="">Seçiniz</option>${q.values.map(([k,l])=>`<option value="${esc(k)}" ${v===k?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
 if(q.type==='multi')return `<div class="sut-field"><span>${esc(q.label)}</span>${q.values.map(([k,l])=>`<label class="sut-check"><input type="checkbox" data-smart-multi="${q.id}" data-value="${esc(k)}" ${(v||[]).includes(k)?'checked':''}><span>${esc(l)}</span></label>`).join('')}</div>`;
 if(q.type==='number')return `<label class="sut-field"><span>${esc(q.label)}</span><input class="sut-input" type="number" min="${q.min??0}" ${q.max!=null?'max="'+q.max+'"':''} step="any" data-smart-field="${q.id}" value="${esc(v??'')}"></label>`;
 if(q.type==='date')return `<label class="sut-field"><span>${esc(q.label)}</span><input class="sut-input" type="date" data-smart-field="${q.id}" value="${esc(v??'')}"></label>`;return '';
 }
 function render(){const r=cur(),drugs=[...new Set(P.map(p=>p.drug))].sort((a,b)=>a.localeCompare(b,'tr')),groups=[...new Set(P.filter(p=>p.drug===r.drug).map(p=>p.group))],scenarios=P.filter(p=>p.group===r.group&&p.drug===r.drug);
  const select=(id,list,current,labels)=>`<label class="sut-field"><span>${id==='smartDrug'?'1 · İlaç':id==='smartGroup'?'2 · Tanı':'3 · Klinik durum / rapor aşaması'}</span><select class="sut-input" id="${id}">${list.map(x=>`<option value="${esc(x)}" ${x===current?'selected':''}>${esc(labels?.[x]||x)}</option>`).join('')}</select></label>`;
  const doseQuestions=r.noDose?[]:doseQ;
  const icd=r.group==='FMF'?'E85.0':r.group==='FMF + AA amiloidozu'?'E85.0':'';const medula=r.group==='FMF'?'06.05':'';
  return `<div class="sut-panel sut-one-screen"><div class="sut-banner"><strong>SUT Rapor Oluşturucu · Tek Ekran</strong><p>Yalnızca seçilen hastalığın ve ilacın 02.10.2026 SUT koşulları sorulur. Evet denilen ve belgelenen koşullar rapora yazılır; Hayır seçilen zorunlu koşullarda rapor oluşturulmaz.</p></div><div class="resource-card" style="padding:20px"><div class="sut-unified-grid">${select('smartDrug',drugs,r.drug)}${select('smartGroup',groups,r.group)}${select('smartScenario',scenarios.map(p=>p.id),r.id,Object.fromEntries(scenarios.map(p=>[p.id,p.phase+' · '+p.title])))}</div><div class="sut-meta-grid"><div><span>ICD-10</span><strong>${esc(icd||'Teyit edilmeli')}</strong></div><div><span>MEDULA rapor teşhisi</span><strong>${esc(medula||'Teyit edilmeli')}</strong></div></div><p class="sut-source"><strong>Kaynak:</strong> ${esc(SRC)}, madde ${esc(r.ref)}. Ruhsat, MEDULA, EK-4/D muafiyet ve endikasyon dışı onay ayrıca doğrulanmalıdır.</p><h3>Yalnızca gereken klinik bilgiler</h3><div class="sut-unified-grid">${r.questions.concat(doseQuestions).map(field).join('')}</div><p class="sut-source">Doz ve sıklık hekim tarafından doğrulanır; sistem doz hesaplamaz. Zorunlu koşullarda Hayır işaretlenmesi uygunluk üretmez.</p><div class="sut-unified-actions"><button class="sut-btn" data-smart-action="make">Kontrol et ve raporu oluştur</button><button class="sut-btn sut-muted" data-smart-action="reset">Temizle</button></div><div id="smartResult" aria-live="polite"><p>Koşullar doğrulandığında standart rapor metni burada oluşacaktır.</p></div></div></div>`;
 }
 function check(r){const errs=[];const numeric=(x)=>x!==''&&x!=null&&Number.isFinite(Number(x));
  for(const q of r.questions.concat(r.noDose?[]:doseQ)){
   const v=state[q.id];if(q.type==='crp'){
     const rows=(state._crp||[]).filter(x=>x.date||x.value!==undefined||x.uln!==undefined);
     if(rows.length<q.minCount){errs.push(`En az ${q.minCount} tarihli CRP ölçümü gerekiyor.`);continue;}
     for(const x of rows){if(!x.date||!numeric(x.value)||!numeric(x.uln)||Number(x.uln)<=0||Number(x.value)<2*Number(x.uln))errs.push('CRP tarih, sonuç ve üst sınır bilgileri eksik veya sonuç 2 kat eşiğinin altında.');}
     const dates=rows.filter(x=>x.date).map(x=>x.date).sort();for(let i=1;i<dates.length;i++)if((new Date(dates[i])-new Date(dates[i-1]))/86400000<15)errs.push('CRP ölçümleri arasında en az 15 gün olmalı.');
     if(dates.some(x=>new Date(x)>new Date()))errs.push('CRP tarihi gelecekte olamaz.');continue;
   }
   if(q.id==='priorTnf'&&!(state.priorTypes||[]).includes('Anti-TNF'))continue;
   if(q.id==='allergySpec'&&state.adverseKind!=='allergy')continue;
   if(q.type==='yes'&&q.required&&v!=='yes')errs.push(q.label+' — Evet olarak doğrulanmadı.');
   if(q.type==='select'&&q.required&&!v)errs.push(q.label+' — seçilmedi.');
   if(q.type==='multi'&&q.required&&!(v||[]).length)errs.push(q.label+' — seçilmedi.');
   if(q.type==='number'&&q.required&&(!numeric(v)||(q.min!=null&&Number(v)<q.min)||(q.max!=null&&Number(v)>q.max)))errs.push(q.label+' — geçerli değer gerekiyor.');
   if(q.type==='date'&&q.required&&(!v||new Date(v)>new Date()))errs.push(q.label+' — geçerli tarih gerekli.');
  }
  if(r.id==='fmf_ana_res'&&state.domestic!=='yes')errs.push('Yurt içi kolşisin basamağı doğrulanmadı.');
  if(state.foreign==='no'&&r.id==='fmf_ana_res')errs.push('Yurt dışı kolşisin kullanılmamış: yanıtsızlık yolundaki yurtdışı preparat basamağını ve gerekçeyi doğrulayın; otomatik rapor kapalı.');
  if(r.requireForeignWhenFail&&state.foreign!=='yes')errs.push('Yurt dışı kolşisin preparatı kullanımının doğrulanması gerekiyor.');
  if(r.limit?.age!=null&&Number(state.age)<r.limit.age)errs.push('SUT yaş sınırı karşılanmıyor.');
  if(r.limit?.weightExclusive!=null&&Number(state.weight)<=r.limit.weightExclusive)errs.push('SUT kilo sınırı karşılanmıyor.');
  if(r.limit?.weight!=null&&Number(state.weight)<r.limit.weight)errs.push('SUT kilo sınırı karşılanmıyor.');
  if(r.attackAdult3&&Number(state.age)>=18&&Number(state.attacks)<3)errs.push('Erişkin hastada son üç ayda en az 3 atak gerekli.');
  if(r.responseMin!=null&&Number(state.pacr)<r.responseMin)errs.push('pACR'+r.responseMin+' yanıt eşiği karşılanmıyor.');
  if(r.previousDifferent&&state.priorDrug===r.drug)errs.push('Önceki biyolojik ilaç yeni ilaçla aynı olamaz.');
  if(r.dasStart&&Number(state.das)<=5.1)errs.push('Başlangıç DAS28 >5,1 şartı karşılanmadı.');
  if(r.dasFollow){const drop=Number(state.das)-Number(state.dasNew);if(drop <= (state.month==='3'?0.6:1.2))errs.push('DAS28 düşüş eşiği karşılanmadı.');}
  if(state.adverseKind==='allergy'&&r.questions.some(q=>q.id==='adverse')&&state.allergySpec!=='yes')errs.push('Alerji uzmanı tarafından belgelenen alerjik reaksiyon doğrulanmadı.');
  if(state.adverseKind==='allergy'&&r.questions.some(q=>q.id==='adverse')&&(!['Alerji ve İmmünoloji','Çocuk Alerji ve İmmünoloji'].includes(state.branch)))errs.push('Alerjik reaksiyon seçildi: alerji uzmanının doğrulayan konsültasyonu belirtilmeli.');
  if(r.id.startsWith('rtx_')&&r.id.endsWith('_again')&&state.prevDate){const months=(new Date()-new Date(state.prevDate))/86400000/30.4375;if(months<6)errs.push('Önceki rituksimab dozundan 6 ay geçmedi.');}
  return [...new Set(errs)];
 }
 function report(r){const text=[], grp=r.group,age=state.age,kg=state.weight;let intro=`${grp} tanısıyla izlenen ${age} yaşında, ${kg} kg ağırlığındaki hastada`;
  text.push(intro);
  for(const q of r.questions){const v=state[q.id];if(q.type==='yes'&&v==='yes'&&q.text)text.push(q.text);
   if(q.type==='multi'&&Array.isArray(v)&&v.length){text.push(`${q.id==='dmards'?'Önceki DMARD tedavileri':'Önceki tedaviler'}: ${v.map(k=>q.values.find(x=>x[0]===k)?.[1]||k).join(', ')} kullanılmıştır.`);}
  }
  if(state.priorDrug){text.push(`Önceki tedavide ${state.priorDrug} kullanılmıştır.`);}
  if(state.priorTnf)text.push(`Önceki anti-TNF tedavisi: ${state.priorTnf}.`);
  if(state.failTarget)text.push(`Önceki biyolojik tedaviyle pACR${state.failTarget} yanıtına ulaşılamamıştır.`);
  if(state.cycReason)text.push(`Siklofosfamid için ${state.cycReason} durumu belgelenmiştir.`);
  if(state.reason)text.push(`Anti-TNF tedavisi açısından ${state.reason} durumu belgelenmiştir.`);
  if(state.consultDate)text.push(`Konsültasyon tarihi: ${new Date(state.consultDate+'T12:00:00').toLocaleDateString('tr-TR')}.`);
  if(state.branch)text.push(`Konsültasyon branşı: ${state.branch}.`);
  if(state.attacks!==undefined&&state.attacks!=='')text.push(`İlgili dönemde ${state.attacks} belgeli atak geçirilmiştir.`);
  if((state._crp||[]).some(x=>x.date))text.push(`Atak CRP ölçümleri (${(state._crp||[]).filter(x=>x.date).map(x=>`${new Date(x.date+'T12:00:00').toLocaleDateString('tr-TR')}: ${x.value} mg/L, NÜS ${x.uln} mg/L`).join('; ')}).`);
  if(state.pacr!==undefined)text.push(`${r.drug} tedavisinde pACR${state.pacr==='0'?'30 altında':state.pacr} yanıtı elde edilmiştir.`);
  if(state.das!==undefined&&state.das!=='')text.push(`Başlangıç DAS28 ${state.das}${state.dasNew?' ve güncel DAS28 '+state.dasNew:''} olarak değerlendirilmiştir.`);
  const action=r.phase==='Devam'?'devam edilmesine':r.phase==='Geçiş'?'geçilmesine':r.phase==='Yeniden başlama'?'yeniden başlanmasına':r.phase==='Doz aralığı'?'doz aralığının açılmasına':r.phase==='Doz değişimi'?'doz artırılmasına':r.phase==='Sonlandırma'?'sonlandırılmasına':r.phase==='Tekrar uygulama'?'tekrar uygulanmasına':'başlanmasına';
  text.push(r.phase==='Sonlandırma'?`Bu nedenle ${r.drug} tedavisinin sonlandırılmasına karar verilmiştir.`:r.phase==='Doz aralığı'?`Bu nedenle ${r.drug} tedavisinde doz aralığının açılmasına karar verilmiştir.`:r.phase==='Doz değişimi'?`Bu nedenle ${r.drug} dozunun artırılmasına karar verilmiştir.`:`Bu nedenle ${r.drug} tedavisine ${action} karar verilmiştir.`);
  if(!r.noDose)text.push(`${r.drug}: ${state.dose} mg, ${({ 'Günde 1 kez':'1x/gün','Günde 2 kez':'2x/gün','Haftada 1 kez':'1x/hafta','2 haftada 1':'1x/2 hafta','4 haftada 1':'1x/4 hafta','8 haftada 1':'1x/8 hafta'})[state.freq]||state.freq}, ${state.route}.`);
  return text.join(' ').replace(/\s+/g,' ');
 }
 function onChange(e){const t=e.target;if(t.id==='smartDrug'){active=P.find(p=>p.drug===t.value)?.id||active;state={};document.getElementById('app').innerHTML=render();return true;}
  if(t.id==='smartGroup'){active=P.find(p=>p.drug===cur().drug&&p.group===t.value)?.id||active;state={};document.getElementById('app').innerHTML=render();return true;}
  if(t.id==='smartScenario'){active=t.value;state={};document.getElementById('app').innerHTML=render();return true;}
  if(t.hasAttribute('data-smart-field')){state[t.dataset.smartField]=t.value;return true;}
  if(t.hasAttribute('data-smart-multi')){const k=t.dataset.smartMulti;let a=new Set(state[k]||[]);t.checked?a.add(t.dataset.value):a.delete(t.dataset.value);state[k]=[...a];if(k==='priorTypes'){document.getElementById('app').innerHTML=render();}return true;}
  if(t.hasAttribute('data-smart-crp')){let i=Number(t.dataset.smartCrp);state._crp??=[{},{},{}];state._crp[i]??={};state._crp[i][t.dataset.key]=t.value;return true;}return false;
 }
 function onClick(e){const el=e.target.closest('[data-smart-action]');if(!el)return false;const a=el.dataset.smartAction;if(a==='reset'){state={};document.getElementById('app').innerHTML=render();return true;}
  if(a==='addcrp'){state._crp??=[{},{},{}];if(state._crp.length<12)state._crp.push({});document.getElementById('app').innerHTML=render();return true;}
  if(a==='make'){const r=cur(),errors=check(r),out=document.getElementById('smartResult');if(errors.length){out.innerHTML='<h3>Eksik / karşılanmayan koşullar</h3><ul>'+errors.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul><p>Bu durumda rapor üretilmez; uygun alternatif senaryoyu seçin.</p>';return true;}
   out.innerHTML=`<h3>Standart rapor açıklaması</h3><label class="sut-field"><span>Hekim tarafından düzenlenebilir metin</span><textarea id="smartText" rows="10">${esc(report(r))}</textarea></label><button class="sut-btn" data-smart-action="copy">Metni kopyala</button><p class="sut-source">SUT ${esc(r.ref)} · Doğrulanan işaretlemelerden oluşturulan taslaktır. ICD, MEDULA, ruhsat, EK-4/D ve diğer geri ödeme koşulları ayrıca kontrol edilmelidir.</p>`;return true;}
  if(a==='copy'){const x=document.getElementById('smartText');if(x){if(navigator.clipboard)navigator.clipboard.writeText(x.value).catch(()=>{x.select();document.execCommand('copy')});else{x.select();document.execCommand('copy')}}return true;}return false;
 }
 return {render,onChange,onClick,scenarios:P,check,report,select:(id,s={})=>{active=id;state=s;},getCurrent:()=>cur()};
})();
