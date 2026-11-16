// Each row describes a historical relationship, with its source keys.
const rows = `bengal|siraj|Siraj ud-Daulah ruled Bengal as nawab when the Company attacked in 1757.|سراج‌الدوله هنگام حملهٔ کمپانی در ۱۷۵۷ نواب بنگال بود.|colonial
bengal|east-india-company|The Company acquired the diwani of Bengal in 1765, gaining authority over revenue collection.|کمپانی در ۱۷۶۵ دیوانی بنگال و اختیار گردآوری درآمد را به دست آورد.|colonial,clive
bengal|kolkata|Calcutta was the Company’s main base in Bengal.|کلکته پایگاه اصلی کمپانی در بنگال بود.|colonial,factories
bengal|murshidabad|Murshidabad was the seat of the Bengal nawabs.|مرشدآباد مقر نواب بنگال بود.|colonial,bankers
bengal|dhaka-city|Dhaka remained a center of provincial administration and commerce in Bengal.|داکا از مراکز ادارهٔ ایالتی و بازرگانی بنگال باقی ماند.|dhaka
bengal|bengal-weavers|Bengal’s textile workers supplied merchants trading across Asian and European markets.|کارگران نساجی بنگال به بازرگانانی کالا می‌رساندند که در بازارهای آسیا و اروپا دادوستد می‌کردند.|textile,cloth
bengal|plassey|The battle at Plassey changed who governed Bengal and expanded Company influence.|نبرد پلاسی حاکم بنگال را تغییر داد و نفوذ کمپانی را گسترش داد.|colonial
plassey|siraj|Siraj’s forces faced the Company army at Plassey in June 1757.|سپاه سراج در ژوئن ۱۷۵۷ در پلاسی با نیروهای کمپانی روبه‌رو شد.|colonial,clive
plassey|clive-person|Clive led the Company force at Plassey.|کلایو فرماندهٔ نیروهای کمپانی در پلاسی بود.|clive
plassey|mir-jafar|Mir Jafar joined the coalition against Siraj and became nawab after the battle.|میر جعفر به ائتلاف علیه سراج پیوست و پس از نبرد نواب شد.|colonial,bankers
plassey|jagat-sheth|The Jagat Sheth banking house helped organize the coalition against Siraj.|خاندان بانکدار جگت شت در تشکیل ائتلاف علیه سراج نقش داشت.|bankers
plassey|kolkata|The Company retook Calcutta before confronting the nawab at Plassey.|کمپانی پیش از رویارویی با نواب در پلاسی، کلکته را پس گرفت.|colonial,clive
siraj|mir-jafar|Mir Jafar was a commander under Siraj before joining the coalition against him.|میر جعفر پیش از پیوستن به ائتلاف علیه سراج، از فرماندهان او بود.|colonial,bankers
mir-jafar|clive-person|Clive and Company representatives backed Mir Jafar as a successor to Siraj in 1757.|کلایو و نمایندگان کمپانی در ۱۷۵۷ از جانشینی میر جعفر حمایت کردند.|colonial,clive
mir-jafar|jagat-sheth|The banking house supported the coalition that brought Mir Jafar to power.|خاندان بانکدار از ائتلافی حمایت کرد که میر جعفر را به قدرت رساند.|bankers
mir-jafar|nanda-kumar|Nanda Kumar served Mir Jafar as a revenue official.|ناندا کومار به‌عنوان مأمور مالی در خدمت میر جعفر بود.|nanda
jagat-sheth|murshidabad|The Jagat Sheths maintained close financial ties to the nawabi court at Murshidabad.|خاندان جگت شت با دربار نواب در مرشدآباد پیوند مالی نزدیک داشت.|bankers
east-india-company|clive-person|Clive commanded Company forces and later secured the diwani during his second governorship in Bengal.|کلایو فرماندهٔ نیروهای کمپانی بود و در دومین دورهٔ حکومتش در بنگال دیوانی را به دست آورد.|clive
east-india-company|shah-alam|Shah Alam II granted the Company revenue authority over Bengal, Bihar and Orissa in 1765.|شاه عالم دوم در ۱۷۶۵ اختیار ادارهٔ درآمدهای بنگال، بیهار و اوریسا را به کمپانی واگذار کرد.|clive,colonial
mughal-court|shah-alam|Shah Alam II issued the 1765 grant as Mughal emperor.|شاه عالم دوم واگذاری ۱۷۶۵ را در مقام امپراتور گورکانی صادر کرد.|colonial,clive
mughal-court|delhi|Delhi was a center of Mughal authority and remained a political symbol in 1857.|دهلی از مراکز اقتدار گورکانی بود و در ۱۸۵۷ همچنان نمادی سیاسی به شمار می‌رفت.|colonial,awadhSource
mughal-court|east-india-company|The Company drew on Mughal imperial authority for its 1765 revenue grant.|کمپانی در واگذاری دیوانیِ ۱۷۶۵ به اقتدار امپراتوری گورکانی تکیه داشت.|colonial,clive
east-india-company|parliament|Parliament renewed the Company’s charter and expanded oversight of its government.|پارلمان منشور کمپانی را تمدید کرد و نظارت بر حکومت آن را گسترش داد.|hansard,raj
east-india-company|directors|The directors managed Company affairs from London and answered to shareholders within the chartered structure.|مدیران امور کمپانی را از لندن اداره می‌کردند و در چارچوب منشور در برابر سهام‌داران پاسخ‌گو بودند.|hansard,proprietors
directors|london|The Company’s directors administered its affairs from London.|مدیران کمپانی امور آن را از لندن اداره می‌کردند.|hansard,factories
directors|shareholders|The directors and the Court of Proprietors were separate organs of Company government.|هیئت مدیران و مجمع مالکان دو نهاد جداگانه در ادارهٔ کمپانی بودند.|hansard,proprietors
parliament|oversight-1784|The 1784 Act established the Board of Control and increased ministerial supervision.|قانون ۱۷۸۴ هیئت نظارت را ایجاد کرد و نظارت وزیران را افزایش داد.|hansard,raj
parliament|act-1813|The 1813 charter opened most of the trade with India to private British merchants.|منشور ۱۸۱۳ بیشتر تجارت با هند را به روی بازرگانان خصوصی بریتانیا گشود.|hansard,raj
parliament|calico-history|Parliament restricted imports or domestic use of certain Indian printed cottons.|پارلمان واردات یا مصرف داخلی برخی پارچه‌های نخی چاپی هند را محدود کرد.|cloth,textile
calico-history|bengal-weavers|Restrictions in Britain altered one set of outlets for Indian textiles, alongside continuing Asian trade.|محدودیت‌های بریتانیا بخشی از بازار منسوجات هند را تغییر داد و تجارت با بازارهای آسیا ادامه یافت.|textile,cloth
east-india-company|canton|The Company traded through Canton, where its tea privileges outlasted its Indian monopoly.|کمپانی از راه کانتون تجارت می‌کرد و امتیاز تجارت چای آن پس از پایان انحصار هند نیز ادامه یافت.|cantonSource,charter,raj
canton|act-1813|The charter of 1813 retained the Company’s China and tea privileges.|منشور ۱۸۱۳ امتیازهای کمپانی در چین و تجارت چای را حفظ کرد.|hansard,raj
east-india-company|surat|Company merchants established one of their early factories at Surat.|بازرگانان کمپانی یکی از تجارتخانه‌های نخستین خود را در سورات برپا کردند.|factories,cloth
surat|bombay|Company commerce on the west coast connected Surat with the rising presidency at Bombay.|تجارت کمپانی در ساحل غربی سورات را به حوزهٔ ریاستیِ رو به گسترش بمبئی پیوند داد.|factories,cloth
tipu|mysore|Tipu Sultan succeeded Haider Ali as ruler of Mysore and resisted Company expansion.|تیپو سلطان پس از حیدر علی حاکم میسور شد و در برابر گسترش کمپانی ایستاد.|mysoreSource
mysore|east-india-company|The Company and its allies defeated Mysore in 1799 and partitioned its territory in the settlement that followed.|کمپانی و متحدانش در ۱۷۹۹ میسور را شکست دادند و در توافق پس از جنگ قلمرو آن را تقسیم کردند.|mysoreSource,raj
tipu|seringapatam|Tipu died during the assault on his capital in 1799.|تیپو در جریان یورش به پایتختش در ۱۷۹۹ کشته شد.|mysoreSource
east-india-company|hyderabad|Hyderabad retained its dynasty under a subsidiary alliance that increased Company influence.|حیدرآباد زیر چتر پیمان نظامی حمایتی دودمانش را حفظ کرد و نفوذ کمپانی افزایش یافت.|hyderabadSource
east-india-company|maratha|The Company defeated the Peshwa and curtailed Maratha power in the wars ending in 1818.|کمپانی در جنگ‌هایی که در ۱۸۱۸ پایان یافتند پیشوا را شکست داد و قدرت ماراتا را محدود کرد.|marathaSource,raj
ranjit-singh|punjab|Ranjit Singh built a Sikh state centered on Lahore.|رنجیت سینگ دولتی سیک به مرکزیت لاهور بنا کرد.|punjabSource
east-india-company|punjab|The Company annexed Punjab in 1849 after the Second Anglo-Sikh War.|کمپانی در ۱۸۴۹ پس از جنگ دوم انگلیس و سیک‌ها پنجاب را ضمیمه کرد.|punjabSource
east-india-company|awadh|The Company annexed Awadh in 1856, displacing its ruling dynasty.|کمپانی در ۱۸۵۶ اوده را ضمیمه کرد و دودمان حاکم را کنار زد.|awadhSource
awadh|uprising-1857|The recent annexation of Awadh fed resistance in 1857.|الحاق تازهٔ اوده به مقاومت در ۱۸۵۷ دامن زد.|awadhSource
delhi|uprising-1857|Rebels rallied around the Mughal emperor in Delhi.|شورشیان در دهلی گرد امپراتور گورکانی جمع شدند.|awadhSource,raj
abdul-ghani|dhaka-city|Abdul Ghani was a merchant and landholder in Dhaka.|عبدالغنی بازرگان و زمین‌دار داکا بود.|ghani
abdul-ghani|uprising-1857|Abdul Ghani sided with the British during the uprising and later intervened for some soldiers.|عبدالغنی در قیام جانب بریتانیا را گرفت و بعدتر برای برخی سربازان میانجی‌گری کرد.|ghani
uprising-1857|transfer-1858|After the uprising, Parliament transferred the Company’s governing powers to the Crown.|پارلمان پس از قیام، اختیارات حکومتی کمپانی را به تاج‌وتخت واگذار کرد.|crown,indiaAct,raj`;

export const relationships = rows.split('\n').map(row => {
 const [first,second,en,fa,citations] = row.split('|');
 return {first,second,description:[en,fa],citations:citations.split(',')};
});
export const relationshipIds = [...new Set(relationships.flatMap(({first,second})=>[first,second]))];

export function relationshipKind(entry) {
 if (['east-india-company','mughal-court','mysore','hyderabad','maratha','awadh'].includes(entry.id)) return 'Polity';
 return entry.type === 'Region' ? 'Place' : entry.type;
}
