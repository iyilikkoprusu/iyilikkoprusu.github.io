const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('iyilikkoprusu');

const databases = new Databases(client);

const DB_ID = '69efd5b5000e8d71c985';
const URUNLER_COLLECTION = 'urunler';
const SIPARISLER_COLLECTION = 'siparisler';

const LS_ORDERS_KEY = 'iyilikkoprusu_orders_v1';
const LS_LANG_KEY = 'iyilikkoprusu_lang';
const LS_THEME_KEY = 'iyilikkoprusu_theme';

/** E.164 rakamları (başında + yok) — okul ekibi kendi hattını yazsın */
const SUPPORT_PHONE_DIGITS = '905551234567';
const SUPPORT_EMAIL = 'destek@iyilikkoprusu.org';

const LANGS = /** @type {const} */ (['tr', 'en', 'ar', 'fr', 'es']);

const SINIF_GRADES = [5, 6, 7, 8];
const SINIF_BRANCHES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** Yalnızca 5–8 / A–Z (formdan) */
const OKUL_SINIF_REGEX = /^([5-8])\/([A-Z])$/;

const ROUTES = ['anasayfa', 'vakif', 'nasil-siparis', 'magaza', 'siparislerim'];

const ROUTE_LEGACY = {
    hero: 'anasayfa',
    catalog: 'magaza',
    mission: 'vakif',
};

/** @type {typeof import('appwrite/types/models').Models.Document[]} */
let lastProductsRendered = [];

/** Sunucudan çekilmiş ürünlerin $id ile hızlı erişimi */
const productsById = {};

let activeRouteSlug = '';

let currentDetailProductId = '';

const I18N = {
    tr: {
        lang_label: 'Dil',
        lang_label_short: 'Dil',
        theme_toggle_aria: 'Koyu / açık tema',
        loader_text: 'Veriler çekiliyor…',
        nav_home: 'Ana sayfa',
        nav_vakif: 'Vakıf ruhu',
        nav_how: 'Nasıl yapılır?',
        nav_shop: 'Mağaza',
        nav_orders: 'Kayıtlarım',
        hero_kicker: 'TÜBİTAK 4006 okul projesi',
        hero_title_1: 'Eski oyuncaklar,',
        hero_title_2: 'Yeni umutlar.',
        hero_p: 'Akşemseddin’de dayanışma geleneğini dijital kermesle buluşturuyoruz: oyuncaklar yeniden değerlenir, gelir iyilik amaçlarına aktarılır.',
        hero_cta_catalog: 'Mağazaya git',
        hero_cta_how: 'Süreci oku',
        card_vakif_t: 'Vakıf ruhu',
        card_vakif_p: 'Amaç ve şeffaflık için kısa özet.',
        card_how_t: 'Nasıl yapılır?',
        card_how_p: 'Ayırma ve okul içi teslim adımları.',
        card_orders_t: 'Kayıtlarım',
        card_orders_p: 'Bu cihazdaki ayırma kayıtların.',
        vakif_kicker: 'Şeffaflık ve amaç',
        vakif_title: 'İyilik Köprüsü',
        vakif_intro: 'TÜBİTAK 4006 kapsamında okul dayanışması için dijital bir köprü kuruyoruz.',
        vakif_q1: 'Neden oyuncak?',
        vakif_a1: 'Oyuncakları yeniden değerlendirerek sıfır atığa katkı ve çocuklara umut hedefliyoruz.',
        vakif_q2: 'Gelirin yönü',
        vakif_a2: 'Kermes geliri duyurulan iyilik amaçları doğrultusunda kullanılır; süreç okul ve proje ekibiyle şeffaftır.',
        how_kicker: 'Akış',
        how_title: 'Nasıl yapılır?',
        how_intro: 'Okul güvenliği çerçevesinde dijital mağaza ve yüz yüze teslim.',
        how_step1_t: 'Mağazadan seç',
        how_step2_t: 'Bilgilerini gir',
        how_step2_p: '“Ayır” formunda adın soyadın ve listeden sınıf / şuben seçilir; kayıt sunucuya düşer, ürün satıldı işaretlenir.',
        how_step3_t: 'Okul içi teslim',
        how_step3_p: 'Katkı payını duyurulan saatte ve güvenli noktada teslim et; görevli öğretmen veya öğrenciyle teyit et.',
        how_step4_t: 'Bu cihazda geçmiş',
        shop_title: 'İyilik mağazası',
        shop_sub: 'Gelir duyurulan iyilik amaçlarına aktarılır.',
        shop_link_orders: 'Kayıtlarım',
        shop_link_how: 'Süreç',
        orders_kicker: 'Yerel özet',
        orders_title: 'Kayıtlarım',
        orders_intro: 'Bu sayfada yalnızca bu tarayıcıda tutulan ayırmaların görünür; adın ve sınıfın listelenir. Katkı payı için proje ekibiyle sınıfta görüş.',
        orders_count_lbl: 'Kayıtlı ayırma',
        orders_empty: 'Henüz kayıt yok. Mağazadan ayırınca adın ve sınıfın burada görünür.',
        orders_empty_link: 'Mağazaya git',
        orders_fee_lbl: 'Kermes katkı payı',
        orders_class_lbl: 'Sınıf',
        fab_label: 'Kayıtlarım',
        modal_title: 'Kermeste ayır',
        modal_name_lbl: 'Ad soyad',
        modal_name_ph: 'Örn: Ahmet Yılmaz',
        modal_sinif_lbl: 'Sınıf / şube',
        modal_sinif_hint: '5–8. sınıf ve şuben listeden seçilir.',
        modal_price_unknown: 'Katkı payı ürün kartında yazar.',
        sinif_placeholder: 'Şube seçin',
        modal_submit: 'Ayır ve onayla',
        product_reserve: 'Ayır',
        catalog_empty: 'Şu an listelenen oyuncak yok.',
        catalog_load_fail: 'Ürün listesi yüklenemedi. Bağlantı veya Appwrite izinlerini kontrol edin.',
        toast_name: 'Ad ve soyadını yazmalısın.',
        toast_ok: 'Kaydın alındı. Katkı payını proje ekibinin duyurusuna göre sınıfta teslim etmeyi unutma.',
        err_close: 'Tamam',
        err_sinif_select: 'Lütfen sınıf / şube seç.',
        support_prompt: 'Sipariş ayırtma işlemiyle ilgili bir sorun mu yaşıyorsunuz?',
        support_trigger_aria: 'İletişim ve destek',
        support_popover_title: 'İletişim ve destek',
        support_whatsapp: 'WhatsApp ile yaz',
        support_gmail: 'Gmail ile e-posta',
        support_no_refund: 'İade veya online iptal bulunmaz; yalnızca okul içi koordinasyon.',
        support_wa_prefill: 'Merhaba, İyilik Köprüsü kermesi hakkında bilgi almak istiyorum.',
        support_mail_subject: 'İyilik Köprüsü — destek',
        support_mail_body: 'Merhaba,\n\n',
        err_schema_sinif_title: 'Veritabanı: sinif alanı güncellenmeli',
        err_schema_sinif_body:
            'Sunucu sınıf bilgisini kabul etmedi. Appwrite panelinde siparisler koleksiyonundaki sinif alanını metin (okul formatı) olacak şekilde güncelleyin ve yeniden deneyin.',
        err_validation_title: 'Kayıt doğrulanamadı',
        err_validation_body: 'Sunucu gönderilen bilgilerden birini beklenen biçimde bulamadı. Formu kontrol edin veya proje ekibine danışın.',
        err_auth_title: 'Yetki uyarısı',
        err_auth_body: 'İzinler eksik görünüyor. Appwrite koleksiyon izinlerini veya oturumu kontrol edin.',
        err_network_title: 'Bağlantı sorunu',
        err_network_body: 'Appwrite’a ulaşılamadı. Bağlantıyı kontrol edip yeniden deneyin.',
        err_generic_title: 'İşlem tamamlanamadı',
        err_generic_body: 'Beklenmeyen bir sunucu yanıtı. Bir süre sonra tekrar deneyin.',
        fetch_fail_toast: 'Ürünler yüklenemedi',
        err_toast_hint: '— ayrıntılar için pencereye bak.',
        sinif_group: 'Sınıf',
    },
    en: {
        lang_label: 'Language',
        lang_label_short: 'Lang',
        theme_toggle_aria: 'Dark / light theme',
        loader_text: 'Loading…',
        nav_home: 'Home',
        nav_vakif: 'Mission',
        nav_how: 'How it works',
        nav_shop: 'Shop',
        nav_orders: 'My holds',
        hero_kicker: 'TÜBİTAK 4006 school project',
        hero_title_1: 'Old toys,',
        hero_title_2: 'new hope.',
        hero_p: 'We combine solidarity with a digital fair: toys get a second life; proceeds go to announced good causes.',
        hero_cta_catalog: 'Go to shop',
        hero_cta_how: 'Read the steps',
        card_vakif_t: 'Our spirit',
        card_vakif_p: 'Short note on purpose and transparency.',
        card_how_t: 'How it works',
        card_how_p: 'Holding a toy and handover at school.',
        card_orders_t: 'My holds',
        card_orders_p: 'Holds stored on this device.',
        vakif_kicker: 'Transparency',
        vakif_title: 'Goodness Bridge',
        vakif_intro: 'A digital bridge for our school community under TÜBİTAK 4006.',
        vakif_q1: 'Why toys?',
        vakif_a1: 'Reuse means less waste and more smiles for children.',
        vakif_q2: 'Where funds go',
        vakif_a2: 'Fair proceeds follow the causes announced by the project team.',
        how_kicker: 'Flow',
        how_title: 'How it works',
        how_intro: 'Digital shop plus in-school handover, within school safety rules.',
        how_step1_t: 'Pick in the shop',
        how_step2_t: 'Enter your details',
        how_step2_p: 'Use “Reserve”: your name and class/branch from the list; the item is marked sold for others.',
        how_step3_t: 'Pay at school',
        how_step3_p: 'Bring the contribution at the announced time and place; confirm with a teacher or student helper.',
        how_step4_t: 'History on this device',
        shop_title: 'Goodness shop',
        shop_sub: 'Proceeds go to announced causes.',
        shop_link_orders: 'My holds',
        shop_link_how: 'Steps',
        orders_kicker: 'Local summary',
        orders_title: 'My holds',
        orders_intro: 'Only holds stored in this browser are shown (name and class). Talk to the team in class about payment.',
        orders_count_lbl: 'Saved holds',
        orders_empty: 'No holds yet. After you reserve, your name and class appear here.',
        orders_empty_link: 'Go to shop',
        orders_fee_lbl: 'Fair contribution',
        orders_class_lbl: 'Class',
        fab_label: 'My holds',
        modal_title: 'Reserve at the fair',
        modal_name_lbl: 'Full name',
        modal_name_ph: 'e.g. Jane Doe',
        modal_sinif_lbl: 'Class / section',
        modal_sinif_hint: 'Choose grade 5–8 and section from the list.',
        modal_price_unknown: 'Contribution is shown on the card.',
        sinif_placeholder: 'Choose section',
        modal_submit: 'Confirm hold',
        product_reserve: 'Reserve',
        catalog_empty: 'No toys listed right now.',
        catalog_load_fail: 'Could not load the list. Check connection or Appwrite permissions.',
        toast_name: 'Please enter your full name.',
        toast_ok: 'Saved. Bring your contribution as announced in class.',
        err_close: 'OK',
        err_sinif_select: 'Please choose class / section.',
        support_prompt: 'Having trouble with reserving a toy?',
        support_trigger_aria: 'Contact and support',
        support_popover_title: 'Contact and support',
        support_whatsapp: 'Message on WhatsApp',
        support_gmail: 'Email with Gmail',
        support_no_refund: 'No online refunds or cancellations; school coordination only.',
        support_wa_prefill: 'Hello, I need help with the Goodness Bridge school fair.',
        support_mail_subject: 'Goodness Bridge — support',
        support_mail_body: 'Hello,\n\n',
        err_schema_sinif_title: 'Database: update “class” field',
        err_schema_sinif_body:
            'The server rejected the class value. In Appwrite, set the “sinif” attribute to plain text for school class codes, then try again.',
        err_validation_title: 'Could not validate',
        err_validation_body: 'The server did not accept one of the fields. Check the form or ask the project team.',
        err_auth_title: 'Permission issue',
        err_auth_body: 'Not enough rights. Check Appwrite collection permissions or session.',
        err_network_title: 'Connection issue',
        err_network_body: 'Could not reach Appwrite. Check your connection and retry.',
        err_generic_title: 'Something went wrong',
        err_generic_body: 'Unexpected server response. Please try again later.',
        fetch_fail_toast: 'Could not load products',
        err_toast_hint: '— see dialog for details.',
        sinif_group: 'Grade',
    },
    ar: {
        lang_label: 'اللغة',
        lang_label_short: 'لغة',
        theme_toggle_aria: 'الوضع الداكن / الفاتح',
        loader_text: 'جاري التحميل…',
        nav_home: 'الرئيسية',
        nav_vakif: 'الرسالة',
        nav_how: 'كيف تعمل',
        nav_shop: 'المتجر',
        nav_orders: 'حجوزاتي',
        hero_kicker: 'مشروع مدرسي TÜBİTAK 4006',
        hero_title_1: 'ألعاب قديمة،',
        hero_title_2: 'أمل جديد.',
        hero_p: 'نربط التكافل بمعرض رقمي: إعادة استخدام الألعاب وتوجيه العائد لأغراض خيرية.',
        hero_cta_catalog: 'اذهب للمتجر',
        hero_cta_how: 'اقرأ الخطوات',
        card_vakif_t: 'روح المبادرة',
        card_vakif_p: 'ملخص قصير عن الهدف والشفافية.',
        card_how_t: 'كيف تعمل',
        card_how_p: 'الحجز والتسليم داخل المدرسة.',
        card_orders_t: 'حجوزاتي',
        card_orders_p: 'سجل هذا الجهاز فقط.',
        vakif_kicker: 'الشفافية',
        vakif_title: 'جسر الخير',
        vakif_intro: 'جسر رقمي لمشروع مدرستنا ضمن TÜBİTAK 4006.',
        vakif_q1: 'لماذا الألعاب؟',
        vakif_a1: 'إعادة الاستخدام تقلل النفايات وتمنح الأطفال فرحة.',
        vakif_q2: 'وجهة العائد',
        vakif_a2: 'يُستخدم عائد المعرض للأغراض التي يعلنها الفريق.',
        how_kicker: 'التسلسل',
        how_title: 'كيف تعمل؟',
        how_intro: 'متجر رقمي وتسليم في المدرسة ضمن قواعد السلامة.',
        how_step1_t: 'اختر من المتجر',
        how_step2_t: 'أدخل بياناتك',
        how_step2_p: 'استخدم «احجز»: الاسم والصف/الشعبة من القائمة؛ يُعلّم المنتج كمباع للآخرين.',
        how_step3_t: 'التسليم في المدرسة',
        how_step3_p: 'سلّم المساهمة في الوقت والمكان المعلنين؛ تأكد مع المعلم أو المساعد.',
        how_step4_t: 'السجل على هذا الجهاز',
        shop_title: 'متجر الخير',
        shop_sub: 'العائد يُوجَّه للأغراض المعلنة.',
        shop_link_orders: 'حجوزاتي',
        shop_link_how: 'الخطوات',
        orders_kicker: 'ملخص محلي',
        orders_title: 'حجوزاتي',
        orders_intro: 'يظهر هنا الحجز المحفوظ في هذا المتصفح فقط (الاسم والصف). ناقش المساهمة مع الفريق في الصف.',
        orders_count_lbl: 'عدد الحجوزات',
        orders_empty: 'لا حجوزات بعد. بعد الحجز يظهر اسمك وصفك هنا.',
        orders_empty_link: 'اذهب للمتجر',
        orders_fee_lbl: 'مساهمة المعرض',
        orders_class_lbl: 'الصف',
        fab_label: 'حجوزاتي',
        modal_title: 'احجز في المعرض',
        modal_name_lbl: 'الاسم الكامل',
        modal_name_ph: 'مثال: أحمد محمد',
        modal_sinif_lbl: 'الصف / الشعبة',
        modal_sinif_hint: 'اختر من الصفوف 5–8 والشعبة من القائمة.',
        modal_price_unknown: 'المبلغ على البطاقة.',
        sinif_placeholder: 'اختر الشعبة',
        modal_submit: 'تأكيد الحجز',
        product_reserve: 'احجز',
        catalog_empty: 'لا توجد ألعاب في القائمة الآن.',
        catalog_load_fail: 'تعذر تحميل القائمة. تحقق من الاتصال أو أذونات Appwrite.',
        toast_name: 'يرجى إدخال الاسم الكامل.',
        toast_ok: 'تم الحفظ. سلّم المساهمة كما أعلن في الصف.',
        err_close: 'حسناً',
        err_sinif_select: 'يرجى اختيار الصف / الشعبة.',
        support_prompt: 'هل تواجه مشكلة في حجز لعبة؟',
        support_trigger_aria: 'التواصل والدعم',
        support_popover_title: 'التواصل والدعم',
        support_whatsapp: 'مراسلة عبر واتساب',
        support_gmail: 'بريد عبر Gmail',
        support_no_refund: 'لا استرداد ولا إلغاء عبر الموقع؛ التنسيق داخل المدرسة فقط.',
        support_wa_prefill: 'مرحباً، أحتاج مساعدة بخصوص معرض جسر الخير المدرسي.',
        support_mail_subject: 'جسر الخير — دعم',
        support_mail_body: 'مرحباً،\n\n',
        err_schema_sinif_title: 'قاعدة البيانات: حقل الصف',
        err_schema_sinif_body:
            'رفض الخادم قيمة الصف. في Appwrite اجعل حقل sinif نصاً عادياً لأكواد الصف ثم أعد المحاولة.',
        err_validation_title: 'لم يتم التحقق',
        err_validation_body: 'الخادم لم يقبل أحد الحقول. راجع النموذج أو اسأل فريق المشروع.',
        err_auth_title: 'صلاحيات',
        err_auth_body: 'الصلاحيات غير كافية. راجع أذونات المجموعة في Appwrite.',
        err_network_title: 'اتصال',
        err_network_body: 'تعذر الوصول إلى Appwrite. تحقق من الشبكة وأعد المحاولة.',
        err_generic_title: 'حدث خطأ',
        err_generic_body: 'استجابة غير متوقعة. حاول لاحقاً.',
        fetch_fail_toast: 'تعذر تحميل المنتجات',
        err_toast_hint: '— راجع النافذة للتفاصيل.',
        sinif_group: 'صف',
    },
    fr: {
        lang_label: 'Langue',
        lang_label_short: 'Langue',
        theme_toggle_aria: 'Thème sombre / clair',
        loader_text: 'Chargement…',
        nav_home: 'Accueil',
        nav_vakif: 'Esprit',
        nav_how: 'Comment faire',
        nav_shop: 'Boutique',
        nav_orders: 'Mes résas',
        hero_kicker: 'Projet scolaire TÜBİTAK 4006',
        hero_title_1: 'Vieux jouets,',
        hero_title_2: 'nouveaux espoirs.',
        hero_p: 'Solidarité et kermesse numérique : seconde vie pour les jouets, fonds pour des causes annoncées.',
        hero_cta_catalog: 'Voir la boutique',
        hero_cta_how: 'Lire les étapes',
        card_vakif_t: 'Notre esprit',
        card_vakif_p: 'But et transparence en bref.',
        card_how_t: 'Comment faire',
        card_how_p: 'Réservation et remise à l’école.',
        card_orders_t: 'Mes résas',
        card_orders_p: 'Sur cet appareil seulement.',
        vakif_kicker: 'Transparence',
        vakif_title: 'Pont du bien',
        vakif_intro: 'Un pont numérique pour notre communauté scolaire (TÜBİTAK 4006).',
        vakif_q1: 'Pourquoi des jouets ?',
        vakif_a1: 'Réutiliser réduit les déchets et fait sourire les enfants.',
        vakif_q2: 'Destination des fonds',
        vakif_a2: 'Les recettes suivent les causes annoncées par l’équipe.',
        how_kicker: 'Déroulé',
        how_title: 'Comment ça marche ?',
        how_intro: 'Boutique en ligne et remise à l’école, dans le cadre de sécurité.',
        how_step1_t: 'Choisir en boutique',
        how_step2_t: 'Renseigner ses infos',
        how_step2_p: '« Réserver » : nom et classe/section depuis la liste ; l’article est marqué vendu pour les autres.',
        how_step3_t: 'Paiement à l’école',
        how_step3_p: 'Apportez la contribution au créneau annoncé ; confirmez avec un enseignant ou un élève référent.',
        how_step4_t: 'Historique sur cet appareil',
        shop_title: 'Boutique solidaire',
        shop_sub: 'Les fonds vont aux causes annoncées.',
        shop_link_orders: 'Mes résas',
        shop_link_how: 'Étapes',
        orders_kicker: 'Résumé local',
        orders_title: 'Mes résas',
        orders_intro: 'Seules les résas enregistrées dans ce navigateur (nom et classe). Pour le paiement, voir l’équipe en classe.',
        orders_count_lbl: 'Résas enregistrées',
        orders_empty: 'Pas encore de résa. Après réservation, nom et classe s’affichent ici.',
        orders_empty_link: 'Aller à la boutique',
        orders_fee_lbl: 'Participation',
        orders_class_lbl: 'Classe',
        fab_label: 'Mes résas',
        modal_title: 'Réserver à la kermesse',
        modal_name_lbl: 'Nom complet',
        modal_name_ph: 'ex. Marie Dupont',
        modal_sinif_lbl: 'Classe / section',
        modal_sinif_hint: 'Choisissez le niveau 5–8 et la section dans la liste.',
        modal_price_unknown: 'Montant indiqué sur la fiche.',
        sinif_placeholder: 'Choisir la section',
        modal_submit: 'Confirmer',
        product_reserve: 'Réserver',
        catalog_empty: 'Aucun jouet listé pour le moment.',
        catalog_load_fail: 'Impossible de charger la liste. Vérifiez la connexion ou Appwrite.',
        toast_name: 'Indiquez votre nom complet.',
        toast_ok: 'Enregistré. Apportez la participation comme annoncé en classe.',
        err_close: 'OK',
        err_sinif_select: 'Choisissez la classe / section.',
        support_prompt: 'Un souci pour réserver un jouet ?',
        support_trigger_aria: 'Contact et aide',
        support_popover_title: 'Contact et aide',
        support_whatsapp: 'Écrire sur WhatsApp',
        support_gmail: 'E-mail avec Gmail',
        support_no_refund: 'Pas de remboursement ni d’annulation en ligne ; coordination à l’école seulement.',
        support_wa_prefill: 'Bonjour, j’ai besoin d’aide pour la kermesse Pont du bien.',
        support_mail_subject: 'Pont du bien — aide',
        support_mail_body: 'Bonjour,\n\n',
        err_schema_sinif_title: 'Base : champ classe',
        err_schema_sinif_body:
            'Le serveur a refusé la classe. Dans Appwrite, passez le champ sinif en texte pour les codes de classe, puis réessayez.',
        err_validation_title: 'Validation impossible',
        err_validation_body: 'Le serveur a rejeté un champ. Vérifiez le formulaire ou l’équipe projet.',
        err_auth_title: 'Autorisation',
        err_auth_body: 'Droits insuffisants. Vérifiez les permissions Appwrite.',
        err_network_title: 'Réseau',
        err_network_body: 'Impossible d’atteindre Appwrite. Vérifiez la connexion.',
        err_generic_title: 'Échec',
        err_generic_body: 'Réponse inattendue. Réessayez plus tard.',
        fetch_fail_toast: 'Chargement des produits impossible',
        err_toast_hint: '— voir la fenêtre pour détails.',
        sinif_group: 'Niveau',
    },
    es: {
        lang_label: 'Idioma',
        lang_label_short: 'Idioma',
        theme_toggle_aria: 'Tema oscuro / claro',
        loader_text: 'Cargando…',
        nav_home: 'Inicio',
        nav_vakif: 'Espíritu',
        nav_how: 'Cómo funciona',
        nav_shop: 'Tienda',
        nav_orders: 'Mis reservas',
        hero_kicker: 'Proyecto escolar TÜBİTAK 4006',
        hero_title_1: 'Juguetes viejos,',
        hero_title_2: 'nueva esperanza.',
        hero_p: 'Unimos solidaridad y feria digital: los juguetes tienen segunda vida; lo recaudado va a causas anunciadas.',
        hero_cta_catalog: 'Ir a la tienda',
        hero_cta_how: 'Ver pasos',
        card_vakif_t: 'Nuestro espíritu',
        card_vakif_p: 'Propósito y transparencia en breve.',
        card_how_t: 'Cómo funciona',
        card_how_p: 'Reserva y entrega en el colegio.',
        card_orders_t: 'Mis reservas',
        card_orders_p: 'Solo en este dispositivo.',
        vakif_kicker: 'Transparencia',
        vakif_title: 'Puente del bien',
        vakif_intro: 'Un puente digital para nuestra comunidad escolar (TÜBİTAK 4006).',
        vakif_q1: '¿Por qué juguetes?',
        vakif_a1: 'Reutilizar reduce residuos y alegra a los niños.',
        vakif_q2: 'Destino de los fondos',
        vakif_a2: 'Lo recaudado sigue las causas anunciadas por el equipo.',
        how_kicker: 'Flujo',
        how_title: '¿Cómo funciona?',
        how_intro: 'Tienda digital y entrega en el colegio, con normas de seguridad.',
        how_step1_t: 'Elige en la tienda',
        how_step2_t: 'Tus datos',
        how_step2_p: '«Reservar»: nombre y clase/sección de la lista; el artículo queda como vendido para otros.',
        how_step3_t: 'Entrega en el colegio',
        how_step3_p: 'Aporta la contribución en el horario anunciado; confirma con profesor o alumno encargado.',
        how_step4_t: 'Historial en este dispositivo',
        shop_title: 'Tienda solidaria',
        shop_sub: 'Los fondos van a causas anunciadas.',
        shop_link_orders: 'Mis reservas',
        shop_link_how: 'Pasos',
        orders_kicker: 'Resumen local',
        orders_title: 'Mis reservas',
        orders_intro: 'Solo se muestran reservas en este navegador (nombre y clase). Habla con el equipo en clase sobre el pago.',
        orders_count_lbl: 'Reservas guardadas',
        orders_empty: 'Aún no hay reservas. Al reservar, tu nombre y clase aparecen aquí.',
        orders_empty_link: 'Ir a la tienda',
        orders_fee_lbl: 'Contribución',
        orders_class_lbl: 'Clase',
        fab_label: 'Mis reservas',
        modal_title: 'Reservar en la feria',
        modal_name_lbl: 'Nombre completo',
        modal_name_ph: 'ej. Ana García',
        modal_sinif_lbl: 'Clase / sección',
        modal_sinif_hint: 'Elige curso 5–8 y sección de la lista.',
        modal_price_unknown: 'El aporte figura en la tarjeta.',
        sinif_placeholder: 'Elegir sección',
        modal_submit: 'Confirmar',
        product_reserve: 'Reservar',
        catalog_empty: 'No hay juguetes listados ahora.',
        catalog_load_fail: 'No se pudo cargar la lista. Revisa la conexión o Appwrite.',
        toast_name: 'Escribe tu nombre completo.',
        toast_ok: 'Guardado. Entrega la contribución como anuncien en clase.',
        err_close: 'OK',
        err_sinif_select: 'Elige clase / sección.',
        support_prompt: '¿Problema al reservar un juguete?',
        support_trigger_aria: 'Contacto y ayuda',
        support_popover_title: 'Contacto y ayuda',
        support_whatsapp: 'Escribir por WhatsApp',
        support_gmail: 'Correo con Gmail',
        support_no_refund: 'Sin reembolsos ni cancelaciones online; solo coordinación en el colegio.',
        support_wa_prefill: 'Hola, necesito ayuda con la feria Puente del bien.',
        support_mail_subject: 'Puente del bien — ayuda',
        support_mail_body: 'Hola,\n\n',
        err_schema_sinif_title: 'Base de datos: campo clase',
        err_schema_sinif_body:
            'El servidor rechazó la clase. En Appwrite, deja sinif como texto para códigos de clase y reintenta.',
        err_validation_title: 'No se pudo validar',
        err_validation_body: 'El servidor rechazó un campo. Revisa el formulario o al equipo.',
        err_auth_title: 'Permisos',
        err_auth_body: 'Permisos insuficientes. Revisa Appwrite.',
        err_network_title: 'Conexión',
        err_network_body: 'No se pudo conectar con Appwrite. Revisa la red.',
        err_generic_title: 'Error',
        err_generic_body: 'Respuesta inesperada. Intenta más tarde.',
        fetch_fail_toast: 'No se pudieron cargar productos',
        err_toast_hint: '— mira el diálogo para detalles.',
        sinif_group: 'Curso',
    },
};

const smartLoader = document.getElementById('smart-loader');
const productsGrid = document.getElementById('products-grid');
const orderModal = document.getElementById('order-modal');
const productDetailModal = document.getElementById('product-detail-modal');
const orderForm = document.getElementById('order-form');
const submitBtn = document.getElementById('submit-btn');
const toastEl = document.getElementById('toast');
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const errorModal = document.getElementById('error-modal');
const errorModalTitle = document.getElementById('error-modal-title');
const errorModalBody = document.getElementById('error-modal-body');
const errorModalTechnical = document.getElementById('error-modal-technical');
const errorModalClose = document.getElementById('error-modal-close');
const supportPopover = document.getElementById('support-popover');

function getLang() {
    const l = document.documentElement.getAttribute('data-lang') || 'tr';
    return LANGS.includes(l) ? l : 'tr';
}

function t(key) {
    const lang = getLang();
    const pack = I18N[lang] || I18N.tr;
    return pack[key] ?? I18N.tr[key] ?? key;
}

function logErr(scope, detail, err) {
    console.error(`[İyilik Köprüsü][${scope}]`, detail, err);
    if (err && err.stack) console.error(`[İyilik Köprüsü][${scope}] stack`, err.stack);
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const k = el.getAttribute('data-i18n');
        if (k) el.textContent = t(k);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const k = el.getAttribute('data-i18n-placeholder');
        if (k) el.setAttribute('placeholder', t(k));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const k = el.getAttribute('data-i18n-title');
        if (k) el.setAttribute('title', t(k));
    });
    const lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const step1 = document.querySelector('.how-step1-p');
    const step4 = document.querySelector('.how-step4-p');
    const linkShop = `<a href="#magaza" class="text-emerald-800 dark:text-blue-400 hover:underline underline-offset-4">${escapeHtml(t('nav_shop'))}</a>`;
    const linkOrders = `<a href="#siparislerim" class="text-emerald-800 dark:text-blue-400 hover:underline underline-offset-4">${escapeHtml(t('nav_orders'))}</a>`;
    if (step1) {
        step1.innerHTML =
            lang === 'ar'
                ? `تصفح الألعاب في ${linkShop}؛ السعر والصورة على البطاقة.`
                : lang === 'en'
                  ? `Browse toys in the ${linkShop}; photo and contribution are on each card.`
                  : lang === 'fr'
                    ? `Parcourez les jouets dans la ${linkShop} ; photo et participation sur la fiche.`
                    : lang === 'es'
                      ? `Mira los juguetes en la ${linkShop}; foto y aporte en cada tarjeta.`
                      : `${linkShop} bölümünden oyuncağı seç; fotoğraf ve katkı payı karttadır.`;
    }
    if (step4) {
        step4.innerHTML =
            lang === 'ar'
                ? `تتبع حجوزاتك من ${linkOrders}. القائمة محلية في هذا المتصفح فقط.`
                : lang === 'en'
                  ? `Track holds on ${linkOrders}. The list stays only in this browser.`
                  : lang === 'fr'
                    ? `Suivez vos résas sur ${linkOrders}. Liste locale à ce navigateur.`
                    : lang === 'es'
                      ? `Revisa reservas en ${linkOrders}. Lista solo en este navegador.`
                      : `Ayırmalarını ${linkOrders} üzerinden takip et; liste yalnızca bu tarayıcıdadır.`;
    }
    populateStudentSinifSelect();
    if (lastProductsRendered.length) renderProducts(lastProductsRendered);
    if (activeRouteSlug === 'siparislerim') renderOrdersList();
    renderSupportPopoverContent();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initLangSelectors() {
    const mk = (sel) => {
        if (!sel) return;
        sel.innerHTML = '';
        LANGS.forEach((code) => {
            const o = document.createElement('option');
            o.value = code;
            o.textContent = code.toUpperCase();
            sel.appendChild(o);
        });
        sel.value = getLang();
        sel.addEventListener('change', () => {
            const v = sel.value;
            if (!LANGS.includes(v)) return;
            localStorage.setItem(LS_LANG_KEY, v);
            document.documentElement.setAttribute('data-lang', v);
            const other = sel.id === 'lang-select' ? document.getElementById('lang-select-mobile') : document.getElementById('lang-select');
            if (other) other.value = v;
            applyI18n();
        });
    };
    mk(document.getElementById('lang-select'));
    mk(document.getElementById('lang-select-mobile'));
}

function initTheme() {
    const stored = localStorage.getItem(LS_THEME_KEY);
    const theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcons();
}

function updateThemeToggleIcons() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.icon-theme-light').forEach((el) => el.classList.toggle('hidden', dark));
    document.querySelectorAll('.icon-theme-dark').forEach((el) => el.classList.toggle('hidden', !dark));
}

function toggleTheme() {
    const next =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(LS_THEME_KEY, next);
    updateThemeToggleIcons();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

let supportOpen = false;
let supportHoverTimer = null;
let activeSupportTrigger = null;

function renderSupportPopoverContent() {
    if (!supportPopover) return;
    const wa = `https://wa.me/${SUPPORT_PHONE_DIGITS}?text=${encodeURIComponent(t('support_wa_prefill'))}`;
    const sub = encodeURIComponent(t('support_mail_subject'));
    const body = encodeURIComponent(t('support_mail_body'));
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${sub}&body=${body}`;
    supportPopover.innerHTML = `
        <h4>${escapeHtml(t('support_popover_title'))}</h4>
        <a href="${wa}" target="_blank" rel="noopener noreferrer">💬 ${escapeHtml(t('support_whatsapp'))}</a>
        <a href="${gmail}" target="_blank" rel="noopener noreferrer">✉️ ${escapeHtml(t('support_gmail'))}</a>
        <p class="support-muted">${escapeHtml(t('support_no_refund'))}</p>
    `;
}

function positionSupportPopover(anchor) {
    if (!supportPopover) return;
    supportPopover.style.position = 'fixed';
    const r = anchor.getBoundingClientRect();
    const w = 300;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = r.bottom + 10;
    const estH = 200;
    if (top + estH > window.innerHeight - 8) top = Math.max(8, r.top - estH - 8);
    supportPopover.style.left = `${left}px`;
    supportPopover.style.top = `${top}px`;
    supportPopover.style.width = `${w}px`;
}

function openSupport(anchor) {
    if (!supportPopover) return;
    activeSupportTrigger = anchor;
    renderSupportPopoverContent();
    supportPopover.classList.add('is-open');
    supportPopover.setAttribute('aria-hidden', 'false');
    anchor.querySelector('[data-support-trigger]')?.setAttribute('aria-expanded', 'true');
    positionSupportPopover(anchor);
    supportOpen = true;
}

function closeSupport() {
    if (!supportPopover) return;
    supportPopover.classList.remove('is-open');
    supportPopover.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('[data-support-trigger]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    supportOpen = false;
    activeSupportTrigger = null;
}

let supportGlobalListenersBound = false;

function bindSupportAnchor(anchor, canHover) {
    if (anchor.dataset.supportBound === '1') return;
    anchor.dataset.supportBound = '1';
    const btn = anchor.querySelector('[data-support-trigger]');
    if (!btn) return;
    if (canHover) {
        const onEnter = () => {
            clearTimeout(supportHoverTimer);
            supportHoverTimer = setTimeout(() => openSupport(anchor), 100);
        };
        const onLeave = () => {
            clearTimeout(supportHoverTimer);
            supportHoverTimer = setTimeout(() => {
                if (!supportPopover?.matches(':hover')) closeSupport();
            }, 220);
        };
        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
    }
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (canHover) return;
        if (supportOpen && activeSupportTrigger === anchor) closeSupport();
        else openSupport(anchor);
    });
}

function initSupportTriggers() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (supportPopover && canHover && !supportPopover.dataset.hoverBridge) {
        supportPopover.dataset.hoverBridge = '1';
        supportPopover.addEventListener('mouseenter', () => clearTimeout(supportHoverTimer));
        supportPopover.addEventListener('mouseleave', () => {
            clearTimeout(supportHoverTimer);
            supportHoverTimer = setTimeout(() => closeSupport(), 220);
        });
    }
    document.querySelectorAll('[data-support-anchor]').forEach((anchor) => {
        if (anchor.closest('#products-grid')) return;
        bindSupportAnchor(anchor, canHover);
    });
    if (productsGrid && !productsGrid.dataset.supportClickBound) {
        productsGrid.dataset.supportClickBound = '1';
        productsGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-support-trigger]');
            if (!btn || !productsGrid.contains(btn)) return;
            e.preventDefault();
            e.stopPropagation();
            const anchor = btn.closest('[data-support-anchor]');
            if (!anchor) return;
            if (supportOpen && activeSupportTrigger === anchor) closeSupport();
            else openSupport(anchor);
        });
    }
    if (!supportGlobalListenersBound) {
        supportGlobalListenersBound = true;
        document.addEventListener('click', (e) => {
            if (!supportOpen) return;
            if (e.target.closest('#support-popover')) return;
            if (e.target.closest('[data-support-trigger]')) return;
            closeSupport();
        });
        window.addEventListener(
            'scroll',
            () => {
                if (supportOpen) closeSupport();
            },
            true,
        );
        window.addEventListener('resize', () => {
            if (supportOpen && activeSupportTrigger) positionSupportPopover(activeSupportTrigger);
        });
    }
}

function populateStudentSinifSelect() {
    const sel = document.getElementById('student-sinif');
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = t('sinif_placeholder');
    sel.appendChild(ph);
    SINIF_GRADES.forEach((g) => {
        const og = document.createElement('optgroup');
        og.label = `${t('sinif_group')} ${g}`;
        SINIF_BRANCHES.forEach((b) => {
            const o = document.createElement('option');
            const val = `${g}/${b}`;
            o.value = val;
            o.textContent = val;
            og.appendChild(o);
        });
        sel.appendChild(og);
    });
    if (prev && [...sel.options].some((o) => o.value === prev)) {
        sel.value = prev;
        ph.selected = false;
    }
}

/**
 * @returns {{ ok: true, value: string } | { ok: false, message: string }}
 */
function validateNormalizeOkulSinif(raw) {
    const compact = String(raw ?? '')
        .trim()
        .replace(/\s+/g, '')
        .replace(/-/g, '/')
        .toUpperCase();
    const m = compact.match(OKUL_SINIF_REGEX);
    if (!m) {
        return { ok: false, message: t('err_sinif_select') };
    }
    return { ok: true, value: `${m[1]}/${m[2]}` };
}

function isLikelySinifSchemaRejection(raw, lower) {
    if (!lower) return false;
    const mentionsSinif =
        lower.includes('sinif') ||
        lower.includes('"sinif"') ||
        lower.includes("'sinif'");
    if (!mentionsSinif) return false;
    const docStruct =
        lower.includes('invalid document structure') ||
        lower.includes('invalid format') ||
        lower.includes('has invalid format');
    const enumOrChoice =
        lower.includes('enum') ||
        /\b(standard|express|premium)\b/i.test(raw);
    return docStruct || enumOrChoice;
}

function toast(msg, variant = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.setAttribute('data-variant', variant === 'error' ? 'error' : 'info');
    toastEl.style.opacity = '1';
    clearTimeout(toast._t);
    const dur = variant === 'error' ? 6500 : 3400;
    toast._t = setTimeout(() => {
        toastEl.style.opacity = '0';
    }, dur);
}

function extractAppwriteMessage(err) {
    if (!err) return '';
    let m = typeof err.message === 'string' ? err.message : '';
    try {
        if (typeof err.response === 'string' && err.response) {
            const j = JSON.parse(err.response);
            m = j.message || j.errors?.[0]?.message || m;
        } else if (err.response && typeof err.response === 'object') {
            m = err.response.message || err.errors?.[0]?.message || m;
        }
    } catch (_) {
        /* ignore */
    }
    return m || String(err);
}

function humanizeAppwriteError(err) {
    const raw = extractAppwriteMessage(err);
    const lower = raw.toLowerCase();

    if (isLikelySinifSchemaRejection(raw, lower)) {
        return {
            titleKey: 'err_schema_sinif_title',
            bodyKey: 'err_schema_sinif_body',
            technical: raw,
            kind: 'schema-sinif',
        };
    }

    if (
        lower.includes('invalid document structure') ||
        lower.includes('has invalid format') ||
        lower.includes('invalid format')
    ) {
        return {
            titleKey: 'err_validation_title',
            bodyKey: 'err_validation_body',
            technical: raw,
            kind: 'validation',
        };
    }

    if (
        lower.includes('unauthorized') ||
        lower.includes('not authorized') ||
        lower.includes(' 401 ')
    ) {
        return {
            titleKey: 'err_auth_title',
            bodyKey: 'err_auth_body',
            technical: raw,
            kind: 'auth',
        };
    }

    if (lower.includes('network') || lower.includes('failed to fetch')) {
        return {
            titleKey: 'err_network_title',
            bodyKey: 'err_network_body',
            technical: raw,
            kind: 'network',
        };
    }

    return {
        titleKey: 'err_generic_title',
        bodyKey: 'err_generic_body',
        technical: raw,
        kind: 'generic',
    };
}

window.closeErrorModal = () => {
    if (!errorModal) return;
    errorModal.classList.remove('active');
    errorModal.setAttribute('aria-hidden', 'true');
};

function openErrorModal(summary) {
    if (!errorModal || !errorModalTitle || !errorModalBody) return;
    const title = summary.titleKey ? t(summary.titleKey) : summary.title;
    const body = summary.bodyKey ? t(summary.bodyKey) : summary.body;
    errorModalTitle.textContent = title;
    errorModalBody.textContent = body;
    if (errorModalTechnical) {
        errorModalTechnical.textContent = summary.technical || '';
    }
    errorModal.classList.add('active');
    errorModal.setAttribute('aria-hidden', 'false');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function siparisLocalSinifGoster(o) {
    if (o.sinif && String(o.sinif).trim()) return String(o.sinif).trim();
    if (o.sinifEtiket) return String(o.sinifEtiket);
    if (o.sinifKey) return String(o.sinifKey);
    return '';
}

function getRouteSlugFromLocation() {
    let raw = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
    raw = raw.split('/')[0] || 'anasayfa';
    raw = ROUTE_LEGACY[raw] || raw;
    if (!ROUTES.includes(raw)) return 'anasayfa';
    return raw;
}

function navigateTo(slug) {
    const next = ROUTES.includes(slug) ? slug : 'anasayfa';
    window.location.hash = `#${next}`;
}

function setMobileMenuOpen(open) {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.toggle('hidden', !open);
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    const openIc = mobileToggle.querySelector('.menu-icon-open');
    const closeIc = mobileToggle.querySelector('.menu-icon-close');
    if (openIc) openIc.classList.toggle('hidden', open);
    if (closeIc) closeIc.classList.toggle('hidden', !open);
}

function routePane(slug) {
    const id = slug === 'nasil-siparis' ? 'route-nasil-siparis' : `route-${slug}`;
    return document.getElementById(id);
}

function applyRoute(slug) {
    activeRouteSlug = slug;

    ROUTES.forEach((r) => {
        const pane = routePane(r);
        if (!pane) return;
        if (r === slug) pane.classList.remove('hidden');
        else pane.classList.add('hidden');
    });

    document.querySelectorAll('.nav-link, .nav-link-mobile, .nav-brand').forEach((el) => {
        el.classList.remove('nav-active');
    });

    document.querySelectorAll(`[href="#${slug}"]`).forEach((el) => {
        el.classList.add('nav-active');
    });
    if (slug === 'anasayfa') {
        document.querySelectorAll('[href="#"], [href="#anasayfa"]').forEach((el) => {
            el.classList.add('nav-active');
        });
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    if (slug === 'siparislerim') {
        renderOrdersList();
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function readStoredOrders() {
    try {
        const raw = localStorage.getItem(LS_ORDERS_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        logErr('localStorage_read_orders', { key: LS_ORDERS_KEY }, e);
        return [];
    }
}

function writeStoredOrders(entries) {
    try {
        localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(entries));
    } catch (e) {
        logErr('localStorage_write_orders', { key: LS_ORDERS_KEY }, e);
    }
}

function pushStoredOrder(entry) {
    const list = readStoredOrders();
    list.unshift(entry);
    writeStoredOrders(list);
}

function formatLocaleDate(iso) {
    try {
        const d = new Date(iso);
        const loc = { tr: 'tr-TR', en: 'en-GB', ar: 'ar', fr: 'fr', es: 'es' }[getLang()] || 'tr-TR';
        return d.toLocaleString(loc, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        logErr('format_date', { iso }, e);
        return iso || '';
    }
}

function renderOrdersList() {
    const listRoot = document.getElementById('orders-list');
    const emptyRoot = document.getElementById('orders-empty');
    const countEl = document.getElementById('orders-count');
    const entries = readStoredOrders();

    if (countEl) countEl.textContent = String(entries.length);

    if (!listRoot || !emptyRoot) return;

    listRoot.innerHTML = '';

    if (entries.length === 0) {
        emptyRoot.classList.remove('hidden');
        return;
    }
    emptyRoot.classList.add('hidden');

    entries.forEach((o) => {
        const katki =
            typeof o.katki === 'number' && !Number.isNaN(o.katki)
                ? `₺${o.katki}`
                : '—';
        const row = document.createElement('article');
        row.className =
            'glass-panel rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4';
        const sinifMetni = siparisLocalSinifGoster(o);
        const feeLbl = escapeHtml(t('orders_fee_lbl'));
        const clsLbl = escapeHtml(t('orders_class_lbl'));

        row.innerHTML = `
            <div class="space-y-1 min-w-0">
                <h3 class="text-white font-semibold truncate">${escapeHtml(o.urunAdi || '—')}</h3>
                <p class="text-slate-400 text-sm font-light">
                    <span class="text-slate-300">${escapeHtml(o.aliciAdSoyad || '')}</span>${sinifMetni ? `${o.aliciAdSoyad ? ' · ' : ''}<span class="text-emerald-800 dark:text-blue-300/90">${clsLbl} ${escapeHtml(sinifMetni)}</span>` : ''}
                </p>
                ${o.ref ? `<p class="text-[10px] uppercase tracking-[0.2em] text-slate-600">ID ${escapeHtml(o.ref)}</p>` : ''}
            </div>
            <div class="shrink-0 flex flex-col items-start md:items-end gap-1 text-sm">
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500">${feeLbl}</span>
                <span class="text-white font-light text-lg">${escapeHtml(katki)}</span>
                <span class="text-slate-500 text-xs">${escapeHtml(formatLocaleDate(o.tarihISO || ''))}</span>
            </div>`;
        listRoot.appendChild(row);
    });
}

window.openDetailModal = (productId) => {
    const p = productsById[productId];
    const detailImage = document.getElementById('detail-image');
    const detailTitle = document.getElementById('detail-title');
    const detailDescription = document.getElementById('detail-description');

    const name = p
        ? p.baslik || p.urunAdi || p.isim || '—'
        : '—';
    const image = p
        ? p.resimUrl || p.gorsel || CATALOG_IMG_FALLBACK
        : CATALOG_IMG_FALLBACK;
    const description = p && p.aciklama != null ? String(p.aciklama) : '';

    if (detailImage) detailImage.src = image;
    if (detailTitle) detailTitle.textContent = name;
    if (detailDescription) detailDescription.textContent = description;

    currentDetailProductId = productId;

    if (productDetailModal) productDetailModal.classList.add('active');
};

window.closeDetailModal = () => {
    if (productDetailModal) productDetailModal.classList.remove('active');
    currentDetailProductId = '';
};

window.openOrderModalFromDetail = () => {
    if (currentDetailProductId) {
        closeDetailModal();
        window.openModal(currentDetailProductId);
    }
};

window.openModal = (productId) => {
    const p = productsById[productId];
    const productIdInput = document.getElementById('selected-product-id');
    const productNameInput = document.getElementById('selected-product-name');
    const caption = document.getElementById('modal-product-caption');

    const name = p
        ? p.baslik || p.urunAdi || p.isim || '—'
        : '—';

    if (productIdInput) productIdInput.value = productId;
    if (productNameInput) productNameInput.value = name;

    if (caption) {
        caption.textContent = name;
    }

    if (orderModal) orderModal.classList.add('active');
};

window.closeModal = () => {
    if (orderModal) orderModal.classList.remove('active');
    if (orderForm) orderForm.reset();
    populateStudentSinifSelect();
};

if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
        if (e.target === productDetailModal) {
            closeDetailModal();
        }
    });
}

function hideSmartLoaderSoon() {
    if (!smartLoader) return;
    smartLoader.style.opacity = '0';
    smartLoader.style.pointerEvents = 'none';
    setTimeout(() => {
        smartLoader.style.display = 'none';
    }, 700);
}

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(DB_ID, URUNLER_COLLECTION, [
            Query.orderDesc('$createdAt'),
        ]);

        response.documents.forEach((doc) => {
            productsById[doc.$id] = doc;
        });
        lastProductsRendered = response.documents;
        console.log('[İyilik Köprüsü][fetch_products] OK', { count: response.documents.length });
        renderProducts(response.documents);
    } catch (error) {
        logErr('fetch_products', { db: DB_ID, collection: URUNLER_COLLECTION }, error);
        if (productsGrid) {
            productsGrid.innerHTML = `<p class="col-span-full text-center py-12 text-red-600/90 dark:text-red-300/90 text-sm">${escapeHtml(t('catalog_load_fail'))}</p>`;
        }
        const h = humanizeAppwriteError(error);
        const brief = h.bodyKey ? t(h.bodyKey) : h.body;
        toast(`${t('fetch_fail_toast')} — ${brief.slice(0, 100)}${brief.length > 100 ? '…' : ''}`, 'error');
    } finally {
        hideSmartLoaderSoon();
    }
}

const CATALOG_IMG_FALLBACK =
    'https://via.placeholder.com/600/e2e8f0/64748b?text=%C3%9Cr%C3%BCn';

function renderProducts(products) {
    if (!productsGrid) return;
    try {
        if (!Array.isArray(products) || products.length === 0) {
            productsGrid.innerHTML = `<p class="col-span-full text-center py-12 text-slate-500 font-light">${escapeHtml(t('catalog_empty'))}</p>`;
            return;
        }

        const reserve = escapeHtml(t('product_reserve'));
        const imgOnError = `this.onerror=null;this.src='${CATALOG_IMG_FALLBACK}';`;

        productsGrid.innerHTML = products
            .map((p) => {
                const urunIsmi =
                    p.baslik ||
                    p.urunAdi ||
                    p.isim ||
                    '—';
                const safeName = escapeHtml(urunIsmi);
                const urunGorsel =
                    p.resimUrl || p.gorsel || CATALOG_IMG_FALLBACK;
                const aciklama = p.aciklama != null ? String(p.aciklama) : '';

                return `
        <article id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${escapeHtml(urunGorsel)}" alt="${safeName}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" loading="lazy" decoding="async" onerror="${imgOnError}">
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${safeName}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 px-2 mb-4 line-clamp-2 min-h-[2.5rem]">${escapeHtml(aciklama)}</p>
            <div class="support-help-row px-2 mb-3 !mt-0 !gap-2">
                <span class="support-help-text !text-[11px] leading-snug">${escapeHtml(t('support_prompt'))}</span>
                <button type="button" class="support-help-trigger !w-8 !h-8" data-support-trigger aria-expanded="false" data-i18n-title="support_trigger_aria" title="${escapeHtml(t('support_trigger_aria'))}">
                    <i data-lucide="help-circle" class="w-4 h-4"></i>
                </button>
            </div>
            <button type="button"
                class="reserve-btn w-full bg-white/10 hover:bg-emerald-700/90 dark:hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                data-product-id="${escapeHtml(p.$id)}">
                ${reserve}
            </button>
        </article>`;
            })
            .join('');
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        document.querySelectorAll('#products-grid [data-support-anchor]').forEach((anchor) => {
            bindSupportAnchor(anchor, canHover);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (err) {
        logErr('render_products', { count: products?.length }, err);
        productsGrid.innerHTML = `<p class="col-span-full text-center py-12 text-red-600/90 dark:text-red-300/90 text-sm">${escapeHtml(t('catalog_load_fail'))}</p>`;
    }
}

if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
        const article = e.target.closest('[id^="product-"]');
        if (!article || !productsGrid.contains(article)) return;
        const id = article.id.replace('product-', '');
        if (!id || !productsById[id]) return;
        window.openDetailModal(id);
    });
}

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const willOpen = mobileMenu.classList.contains('hidden');
        setMobileMenuOpen(willOpen);
    });
}

document.querySelectorAll('[data-nav-link], .nav-brand').forEach((el) => {
    el.addEventListener('click', () => setMobileMenuOpen(false));
});

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);

if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId =
            document.getElementById('selected-product-id')?.value ?? '';
        const productName =
            document.getElementById('selected-product-name')?.value || '—';
        const studentName =
            document.getElementById('student-name')?.value?.trim() || '';
        const sinifRaw = document.getElementById('student-sinif')?.value ?? '';
        const sinifCheck = validateNormalizeOkulSinif(sinifRaw);
        if (!sinifCheck.ok) {
            toast(sinifCheck.message, 'error');
            return;
        }
        const sinifValue = sinifCheck.value;

        if (!productId) {
            toast('Ürün bilgisi eksik. Lütfen sayfayı yenileyin.', 'error');
            return;
        }

        if (!studentName) {
            toast(t('toast_name'), 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>…</span>';
        }

        const iso = new Date().toISOString();

        try {
            const created = await databases.createDocument(
                DB_ID,
                SIPARISLER_COLLECTION,
                ID.unique(),
                {
                    urunAdi: productName,
                    aliciAdSoyad: studentName,
                    sinif: sinifValue,
                    tarih: iso,
                },
            );

            delete productsById[productId];
            lastProductsRendered = lastProductsRendered.filter((d) => d.$id !== productId);

            pushStoredOrder({
                localId: crypto.randomUUID(),
                urunRef: productId,
                urunAdi: productName,
                aliciAdSoyad: studentName,
                sinif: sinifValue,
                katki: null,
                ref: created.$id ?? null,
                tarihISO: iso,
            });

            window.closeModal();
            document.getElementById(`product-${productId}`)?.remove();

            toast(t('toast_ok'));
            if (activeRouteSlug === 'siparislerim') {
                renderOrdersList();
            }
        } catch (err) {
            logErr('order_submit', { productId, sinif: sinifValue }, err);
            const summary = humanizeAppwriteError(err);
            toast(`${t(summary.titleKey || 'err_generic_title')} ${t('err_toast_hint')}`, 'error');
            openErrorModal(summary);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span data-i18n="modal_submit">${escapeHtml(t('modal_submit'))}</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    });
}

function onRouteChange() {
    applyRoute(getRouteSlugFromLocation());
}

window.addEventListener('hashchange', onRouteChange);

document.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem(LS_LANG_KEY);
    if (storedLang && LANGS.includes(storedLang)) {
        document.documentElement.setAttribute('data-lang', storedLang);
    }
    initTheme();
    initLangSelectors();
    initSupportTriggers();
    populateStudentSinifSelect();
    applyI18n();

    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
        history.replaceState(
            null,
            '',
            `${window.location.pathname}${window.location.search}#anasayfa`,
        );
    }

    errorModalClose?.addEventListener('click', window.closeErrorModal);
    errorModal?.addEventListener('click', (ev) => {
        if (ev.target === errorModal) window.closeErrorModal();
    });
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && errorModal?.classList.contains('active')) {
            window.closeErrorModal();
        }
        if (ev.key === 'Escape' && supportOpen) closeSupport();
    });

    onRouteChange();
    renderOrdersList();
    fetchProducts();
});

window.navigateTo = navigateTo;
window.getActiveRouteSlug = () => activeRouteSlug;
const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('iyilikkoprusu');

const databases = new Databases(client);

const DB_ID = '69efd5b5000e8d71c985';
const URUNLER_COLLECTION = 'urunler';
const SIPARISLER_COLLECTION = 'siparisler';

const LS_ORDERS_KEY = 'iyilikkoprusu_orders_v1';
const LS_LANG_KEY = 'iyilikkoprusu_lang';
const LS_THEME_KEY = 'iyilikkoprusu_theme';

/** E.164 rakamları (başında + yok) — okul ekibi kendi hattını yazsın */
const SUPPORT_PHONE_DIGITS = '905551234567';
const SUPPORT_EMAIL = 'destek@iyilikkoprusu.org';

const LANGS = /** @type {const} */ (['tr', 'en', 'ar', 'fr', 'es']);

const SINIF_GRADES = [5, 6, 7, 8];
const SINIF_BRANCHES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** Yalnızca 5–8 / A–Z (formdan) */
const OKUL_SINIF_REGEX = /^([5-8])\/([A-Z])$/;

const ROUTES = ['anasayfa', 'vakif', 'nasil-siparis', 'magaza', 'siparislerim'];

const ROUTE_LEGACY = {
    hero: 'anasayfa',
    catalog: 'magaza',
    mission: 'vakif',
};

/** @type {typeof import('appwrite/types/models').Models.Document[]} */
let lastProductsRendered = [];

/** Sunucudan çekilmiş ürünlerin $id ile hızlı erişimi */
const productsById = {};

let activeRouteSlug = '';

let currentDetailProductId = '';

const I18N = {
    tr: {
        lang_label: 'Dil',
        lang_label_short: 'Dil',
        theme_toggle_aria: 'Koyu / açık tema',
        loader_text: 'Veriler çekiliyor…',
        nav_home: 'Ana sayfa',
        nav_vakif: 'Vakıf ruhu',
        nav_how: 'Nasıl yapılır?',
        nav_shop: 'Mağaza',
        nav_orders: 'Kayıtlarım',
        hero_kicker: 'TÜBİTAK 4006 okul projesi',
        hero_title_1: 'Eski oyuncaklar,',
        hero_title_2: 'Yeni umutlar.',
        hero_p: 'Akşemseddin’de dayanışma geleneğini dijital kermesle buluşturuyoruz: oyuncaklar yeniden değerlenir, gelir iyilik amaçlarına aktarılır.',
        hero_cta_catalog: 'Mağazaya git',
        hero_cta_how: 'Süreci oku',
        card_vakif_t: 'Vakıf ruhu',
        card_vakif_p: 'Amaç ve şeffaflık için kısa özet.',
        card_how_t: 'Nasıl yapılır?',
        card_how_p: 'Ayırma ve okul içi teslim adımları.',
        card_orders_t: 'Kayıtlarım',
        card_orders_p: 'Bu cihazdaki ayırma kayıtların.',
        vakif_kicker: 'Şeffaflık ve amaç',
        vakif_title: 'İyilik Köprüsü',
        vakif_intro: 'TÜBİTAK 4006 kapsamında okul dayanışması için dijital bir köprü kuruyoruz.',
        vakif_q1: 'Neden oyuncak?',
        vakif_a1: 'Oyuncakları yeniden değerlendirerek sıfır atığa katkı ve çocuklara umut hedefliyoruz.',
        vakif_q2: 'Gelirin yönü',
        vakif_a2: 'Kermes geliri duyurulan iyilik amaçları doğrultusunda kullanılır; süreç okul ve proje ekibiyle şeffaftır.',
        how_kicker: 'Akış',
        how_title: 'Nasıl yapılır?',
        how_intro: 'Okul güvenliği çerçevesinde dijital mağaza ve yüz yüze teslim.',
        how_step1_t: 'Mağazadan seç',
        how_step2_t: 'Bilgilerini gir',
        how_step2_p: '“Ayır” formunda adın soyadın ve listeden sınıf / şuben seçilir; kayıt sunucuya düşer, ürün satıldı işaretlenir.',
        how_step3_t: 'Okul içi teslim',
        how_step3_p: 'Katkı payını duyurulan saatte ve güvenli noktada teslim et; görevli öğretmen veya öğrenciyle teyit et.',
        how_step4_t: 'Bu cihazda geçmiş',
        shop_title: 'İyilik mağazası',
        shop_sub: 'Gelir duyurulan iyilik amaçlarına aktarılır.',
        shop_link_orders: 'Kayıtlarım',
        shop_link_how: 'Süreç',
        orders_kicker: 'Yerel özet',
        orders_title: 'Kayıtlarım',
        orders_intro: 'Bu sayfada yalnızca bu tarayıcıda tutulan ayırmaların görünür; adın ve sınıfın listelenir. Katkı payı için proje ekibiyle sınıfta görüş.',
        orders_count_lbl: 'Kayıtlı ayırma',
        orders_empty: 'Henüz kayıt yok. Mağazadan ayırınca adın ve sınıfın burada görünür.',
        orders_empty_link: 'Mağazaya git',
        orders_fee_lbl: 'Kermes katkı payı',
        orders_class_lbl: 'Sınıf',
        fab_label: 'Kayıtlarım',
        modal_title: 'Kermeste ayır',
        modal_name_lbl: 'Ad soyad',
        modal_name_ph: 'Örn: Ahmet Yılmaz',
        modal_sinif_lbl: 'Sınıf / şube',
        modal_sinif_hint: '5–8. sınıf ve şuben listeden seçilir.',
        modal_price_unknown: 'Katkı payı ürün kartında yazar.',
        sinif_placeholder: 'Şube seçin',
        modal_submit: 'Ayır ve onayla',
        product_reserve: 'Ayır',
        catalog_empty: 'Şu an listelenen oyuncak yok.',
        catalog_load_fail: 'Ürün listesi yüklenemedi. Bağlantı veya Appwrite izinlerini kontrol edin.',
        toast_name: 'Ad ve soyadını yazmalısın.',
        toast_ok: 'Kaydın alındı. Katkı payını proje ekibinin duyurusuna göre sınıfta teslim etmeyi unutma.',
        err_close: 'Tamam',
        err_sinif_select: 'Lütfen sınıf / şube seç.',
        support_prompt: 'Sipariş ayırtma işlemiyle ilgili bir sorun mu yaşıyorsunuz?',
        support_trigger_aria: 'İletişim ve destek',
        support_popover_title: 'İletişim ve destek',
        support_whatsapp: 'WhatsApp ile yaz',
        support_gmail: 'Gmail ile e-posta',
        support_no_refund: 'İade veya online iptal bulunmaz; yalnızca okul içi koordinasyon.',
        support_wa_prefill: 'Merhaba, İyilik Köprüsü kermesi hakkında bilgi almak istiyorum.',
        support_mail_subject: 'İyilik Köprüsü — destek',
        support_mail_body: 'Merhaba,\n\n',
        err_schema_sinif_title: 'Veritabanı: sinif alanı güncellenmeli',
        err_schema_sinif_body:
            'Sunucu sınıf bilgisini kabul etmedi. Appwrite panelinde siparisler koleksiyonundaki sinif alanını metin (okul formatı) olacak şekilde güncelleyin ve yeniden deneyin.',
        err_validation_title: 'Kayıt doğrulanamadı',
        err_validation_body: 'Sunucu gönderilen bilgilerden birini beklenen biçimde bulamadı. Formu kontrol edin veya proje ekibine danışın.',
        err_auth_title: 'Yetki uyarısı',
        err_auth_body: 'İzinler eksik görünüyor. Appwrite koleksiyon izinlerini veya oturumu kontrol edin.',
        err_network_title: 'Bağlantı sorunu',
        err_network_body: 'Appwrite’a ulaşılamadı. Bağlantıyı kontrol edip yeniden deneyin.',
        err_generic_title: 'İşlem tamamlanamadı',
        err_generic_body: 'Beklenmeyen bir sunucu yanıtı. Bir süre sonra tekrar deneyin.',
        fetch_fail_toast: 'Ürünler yüklenemedi',
        err_toast_hint: '— ayrıntılar için pencereye bak.',
        sinif_group: 'Sınıf',
    },
    en: {
        lang_label: 'Language',
        lang_label_short: 'Lang',
        theme_toggle_aria: 'Dark / light theme',
        loader_text: 'Loading…',
        nav_home: 'Home',
        nav_vakif: 'Mission',
        nav_how: 'How it works',
        nav_shop: 'Shop',
        nav_orders: 'My holds',
        hero_kicker: 'TÜBİTAK 4006 school project',
        hero_title_1: 'Old toys,',
        hero_title_2: 'new hope.',
        hero_p: 'We combine solidarity with a digital fair: toys get a second life; proceeds go to announced good causes.',
        hero_cta_catalog: 'Go to shop',
        hero_cta_how: 'Read the steps',
        card_vakif_t: 'Our spirit',
        card_vakif_p: 'Short note on purpose and transparency.',
        card_how_t: 'How it works',
        card_how_p: 'Holding a toy and handover at school.',
        card_orders_t: 'My holds',
        card_orders_p: 'Holds stored on this device.',
        vakif_kicker: 'Transparency',
        vakif_title: 'Goodness Bridge',
        vakif_intro: 'A digital bridge for our school community under TÜBİTAK 4006.',
        vakif_q1: 'Why toys?',
        vakif_a1: 'Reuse means less waste and more smiles for children.',
        vakif_q2: 'Where funds go',
        vakif_a2: 'Fair proceeds follow the causes announced by the project team.',
        how_kicker: 'Flow',
        how_title: 'How it works',
        how_intro: 'Digital shop plus in-school handover, within school safety rules.',
        how_step1_t: 'Pick in the shop',
        how_step2_t: 'Enter your details',
        how_step2_p: 'Use “Reserve”: your name and class/branch from the list; the item is marked sold for others.',
        how_step3_t: 'Pay at school',
        how_step3_p: 'Bring the contribution at the announced time and place; confirm with a teacher or student helper.',
        how_step4_t: 'History on this device',
        shop_title: 'Goodness shop',
        shop_sub: 'Proceeds go to announced causes.',
        shop_link_orders: 'My holds',
        shop_link_how: 'Steps',
        orders_kicker: 'Local summary',
        orders_title: 'My holds',
        orders_intro: 'Only holds stored in this browser are shown (name and class). Talk to the team in class about payment.',
        orders_count_lbl: 'Saved holds',
        orders_empty: 'No holds yet. After you reserve, your name and class appear here.',
        orders_empty_link: 'Go to shop',
        orders_fee_lbl: 'Fair contribution',
        orders_class_lbl: 'Class',
        fab_label: 'My holds',
        modal_title: 'Reserve at the fair',
        modal_name_lbl: 'Full name',
        modal_name_ph: 'e.g. Jane Doe',
        modal_sinif_lbl: 'Class / section',
        modal_sinif_hint: 'Choose grade 5–8 and section from the list.',
        modal_price_unknown: 'Contribution is shown on the card.',
        sinif_placeholder: 'Choose section',
        modal_submit: 'Confirm hold',
        product_reserve: 'Reserve',
        catalog_empty: 'No toys listed right now.',
        catalog_load_fail: 'Could not load the list. Check connection or Appwrite permissions.',
        toast_name: 'Please enter your full name.',
        toast_ok: 'Saved. Bring your contribution as announced in class.',
        err_close: 'OK',
        err_sinif_select: 'Please choose class / section.',
        support_prompt: 'Having trouble with reserving a toy?',
        support_trigger_aria: 'Contact and support',
        support_popover_title: 'Contact and support',
        support_whatsapp: 'Message on WhatsApp',
        support_gmail: 'Email with Gmail',
        support_no_refund: 'No online refunds or cancellations; school coordination only.',
        support_wa_prefill: 'Hello, I need help with the Goodness Bridge school fair.',
        support_mail_subject: 'Goodness Bridge — support',
        support_mail_body: 'Hello,\n\n',
        err_schema_sinif_title: 'Database: update “class” field',
        err_schema_sinif_body:
            'The server rejected the class value. In Appwrite, set the “sinif” attribute to plain text for school class codes, then try again.',
        err_validation_title: 'Could not validate',
        err_validation_body: 'The server did not accept one of the fields. Check the form or ask the project team.',
        err_auth_title: 'Permission issue',
        err_auth_body: 'Not enough rights. Check Appwrite collection permissions or session.',
        err_network_title: 'Connection issue',
        err_network_body: 'Could not reach Appwrite. Check your connection and retry.',
        err_generic_title: 'Something went wrong',
        err_generic_body: 'Unexpected server response. Please try again later.',
        fetch_fail_toast: 'Could not load products',
        err_toast_hint: '— see dialog for details.',
        sinif_group: 'Grade',
    },
    ar: {
        lang_label: 'اللغة',
        lang_label_short: 'لغة',
        theme_toggle_aria: 'الوضع الداكن / الفاتح',
        loader_text: 'جاري التحميل…',
        nav_home: 'الرئيسية',
        nav_vakif: 'الرسالة',
        nav_how: 'كيف تعمل',
        nav_shop: 'المتجر',
        nav_orders: 'حجوزاتي',
        hero_kicker: 'مشروع مدرسي TÜBİTAK 4006',
        hero_title_1: 'ألعاب قديمة،',
        hero_title_2: 'أمل جديد.',
        hero_p: 'نربط التكافل بمعرض رقمي: إعادة استخدام الألعاب وتوجيه العائد لأغراض خيرية.',
        hero_cta_catalog: 'اذهب للمتجر',
        hero_cta_how: 'اقرأ الخطوات',
        card_vakif_t: 'روح المبادرة',
        card_vakif_p: 'ملخص قصير عن الهدف والشفافية.',
        card_how_t: 'كيف تعمل',
        card_how_p: 'الحجز والتسليم داخل المدرسة.',
        card_orders_t: 'حجوزاتي',
        card_orders_p: 'سجل هذا الجهاز فقط.',
        vakif_kicker: 'الشفافية',
        vakif_title: 'جسر الخير',
        vakif_intro: 'جسر رقمي لمشروع مدرستنا ضمن TÜBİTAK 4006.',
        vakif_q1: 'لماذا الألعاب؟',
        vakif_a1: 'إعادة الاستخدام تقلل النفايات وتمنح الأطفال فرحة.',
        vakif_q2: 'وجهة العائد',
        vakif_a2: 'يُستخدم عائد المعرض للأغراض التي يعلنها الفريق.',
        how_kicker: 'التسلسل',
        how_title: 'كيف تعمل؟',
        how_intro: 'متجر رقمي وتسليم في المدرسة ضمن قواعد السلامة.',
        how_step1_t: 'اختر من المتجر',
        how_step2_t: 'أدخل بياناتك',
        how_step2_p: 'استخدم «احجز»: الاسم والصف/الشعبة من القائمة؛ يُعلّم المنتج كمباع للآخرين.',
        how_step3_t: 'التسليم في المدرسة',
        how_step3_p: 'سلّم المساهمة في الوقت والمكان المعلنين؛ تأكد مع المعلم أو المساعد.',
        how_step4_t: 'السجل على هذا الجهاز',
        shop_title: 'متجر الخير',
        shop_sub: 'العائد يُوجَّه للأغراض المعلنة.',
        shop_link_orders: 'حجوزاتي',
        shop_link_how: 'الخطوات',
        orders_kicker: 'ملخص محلي',
        orders_title: 'حجوزاتي',
        orders_intro: 'يظهر هنا الحجز المحفوظ في هذا المتصفح فقط (الاسم والصف). ناقش المساهمة مع الفريق في الصف.',
        orders_count_lbl: 'عدد الحجوزات',
        orders_empty: 'لا حجوزات بعد. بعد الحجز يظهر اسمك وصفك هنا.',
        orders_empty_link: 'اذهب للمتجر',
        orders_fee_lbl: 'مساهمة المعرض',
        orders_class_lbl: 'الصف',
        fab_label: 'حجوزاتي',
        modal_title: 'احجز في المعرض',
        modal_name_lbl: 'الاسم الكامل',
        modal_name_ph: 'مثال: أحمد محمد',
        modal_sinif_lbl: 'الصف / الشعبة',
        modal_sinif_hint: 'اختر من الصفوف 5–8 والشعبة من القائمة.',
        modal_price_unknown: 'المبلغ على البطاقة.',
        sinif_placeholder: 'اختر الشعبة',
        modal_submit: 'تأكيد الحجز',
        product_reserve: 'احجز',
        catalog_empty: 'لا توجد ألعاب في القائمة الآن.',
        catalog_load_fail: 'تعذر تحميل القائمة. تحقق من الاتصال أو أذونات Appwrite.',
        toast_name: 'يرجى إدخال الاسم الكامل.',
        toast_ok: 'تم الحفظ. سلّم المساهمة كما أعلن في الصف.',
        err_close: 'حسناً',
        err_sinif_select: 'يرجى اختيار الصف / الشعبة.',
        support_prompt: 'هل تواجه مشكلة في حجز لعبة؟',
        support_trigger_aria: 'التواصل والدعم',
        support_popover_title: 'التواصل والدعم',
        support_whatsapp: 'مراسلة عبر واتساب',
        support_gmail: 'بريد عبر Gmail',
        support_no_refund: 'لا استرداد ولا إلغاء عبر الموقع؛ التنسيق داخل المدرسة فقط.',
        support_wa_prefill: 'مرحباً، أحتاج مساعدة بخصوص معرض جسر الخير المدرسي.',
        support_mail_subject: 'جسر الخير — دعم',
        support_mail_body: 'مرحباً،\n\n',
        err_schema_sinif_title: 'قاعدة البيانات: حقل الصف',
        err_schema_sinif_body:
            'رفض الخادم قيمة الصف. في Appwrite اجعل حقل sinif نصاً عادياً لأكواد الصف ثم أعد المحاولة.',
        err_validation_title: 'لم يتم التحقق',
        err_validation_body: 'الخادم لم يقبل أحد الحقول. راجع النموذج أو اسأل فريق المشروع.',
        err_auth_title: 'صلاحيات',
        err_auth_body: 'الصلاحيات غير كافية. راجع أذونات المجموعة في Appwrite.',
        err_network_title: 'اتصال',
        err_network_body: 'تعذر الوصول إلى Appwrite. تحقق من الشبكة وأعد المحاولة.',
        err_generic_title: 'حدث خطأ',
        err_generic_body: 'استجابة غير متوقعة. حاول لاحقاً.',
        fetch_fail_toast: 'تعذر تحميل المنتجات',
        err_toast_hint: '— راجع النافذة للتفاصيل.',
        sinif_group: 'صف',
    },
    fr: {
        lang_label: 'Langue',
        lang_label_short: 'Langue',
        theme_toggle_aria: 'Thème sombre / clair',
        loader_text: 'Chargement…',
        nav_home: 'Accueil',
        nav_vakif: 'Esprit',
        nav_how: 'Comment faire',
        nav_shop: 'Boutique',
        nav_orders: 'Mes résas',
        hero_kicker: 'Projet scolaire TÜBİTAK 4006',
        hero_title_1: 'Vieux jouets,',
        hero_title_2: 'nouveaux espoirs.',
        hero_p: 'Solidarité et kermesse numérique : seconde vie pour les jouets, fonds pour des causes annoncées.',
        hero_cta_catalog: 'Voir la boutique',
        hero_cta_how: 'Lire les étapes',
        card_vakif_t: 'Notre esprit',
        card_vakif_p: 'But et transparence en bref.',
        card_how_t: 'Comment faire',
        card_how_p: 'Réservation et remise à l’école.',
        card_orders_t: 'Mes résas',
        card_orders_p: 'Sur cet appareil seulement.',
        vakif_kicker: 'Transparence',
        vakif_title: 'Pont du bien',
        vakif_intro: 'Un pont numérique pour notre communauté scolaire (TÜBİTAK 4006).',
        vakif_q1: 'Pourquoi des jouets ?',
        vakif_a1: 'Réutiliser réduit les déchets et fait sourire les enfants.',
        vakif_q2: 'Destination des fonds',
        vakif_a2: 'Les recettes suivent les causes annoncées par l’équipe.',
        how_kicker: 'Déroulé',
        how_title: 'Comment ça marche ?',
        how_intro: 'Boutique en ligne et remise à l’école, dans le cadre de sécurité.',
        how_step1_t: 'Choisir en boutique',
        how_step2_t: 'Renseigner ses infos',
        how_step2_p: '« Réserver » : nom et classe/section depuis la liste ; l’article est marqué vendu pour les autres.',
        how_step3_t: 'Paiement à l’école',
        how_step3_p: 'Apportez la contribution au créneau annoncé ; confirmez avec un enseignant ou un élève référent.',
        how_step4_t: 'Historique sur cet appareil',
        shop_title: 'Boutique solidaire',
        shop_sub: 'Les fonds vont aux causes annoncées.',
        shop_link_orders: 'Mes résas',
        shop_link_how: 'Étapes',
        orders_kicker: 'Résumé local',
        orders_title: 'Mes résas',
        orders_intro: 'Seules les résas enregistrées dans ce navigateur (nom et classe). Pour le paiement, voir l’équipe en classe.',
        orders_count_lbl: 'Résas enregistrées',
        orders_empty: 'Pas encore de résa. Après réservation, nom et classe s’affichent ici.',
        orders_empty_link: 'Aller à la boutique',
        orders_fee_lbl: 'Participation',
        orders_class_lbl: 'Classe',
        fab_label: 'Mes résas',
        modal_title: 'Réserver à la kermesse',
        modal_name_lbl: 'Nom complet',
        modal_name_ph: 'ex. Marie Dupont',
        modal_sinif_lbl: 'Classe / section',
        modal_sinif_hint: 'Choisissez le niveau 5–8 et la section dans la liste.',
        modal_price_unknown: 'Montant indiqué sur la fiche.',
        sinif_placeholder: 'Choisir la section',
        modal_submit: 'Confirmer',
        product_reserve: 'Réserver',
        catalog_empty: 'Aucun jouet listé pour le moment.',
        catalog_load_fail: 'Impossible de charger la liste. Vérifiez la connexion ou Appwrite.',
        toast_name: 'Indiquez votre nom complet.',
        toast_ok: 'Enregistré. Apportez la participation comme annoncé en classe.',
        err_close: 'OK',
        err_sinif_select: 'Choisissez la classe / section.',
        support_prompt: 'Un souci pour réserver un jouet ?',
        support_trigger_aria: 'Contact et aide',
        support_popover_title: 'Contact et aide',
        support_whatsapp: 'Écrire sur WhatsApp',
        support_gmail: 'E-mail avec Gmail',
        support_no_refund: 'Pas de remboursement ni d’annulation en ligne ; coordination à l’école seulement.',
        support_wa_prefill: 'Bonjour, j’ai besoin d’aide pour la kermesse Pont du bien.',
        support_mail_subject: 'Pont du bien — aide',
        support_mail_body: 'Bonjour,\n\n',
        err_schema_sinif_title: 'Base : champ classe',
        err_schema_sinif_body:
            'Le serveur a refusé la classe. Dans Appwrite, passez le champ sinif en texte pour les codes de classe, puis réessayez.',
        err_validation_title: 'Validation impossible',
        err_validation_body: 'Le serveur a rejeté un champ. Vérifiez le formulaire ou l’équipe projet.',
        err_auth_title: 'Autorisation',
        err_auth_body: 'Droits insuffisants. Vérifiez les permissions Appwrite.',
        err_network_title: 'Réseau',
        err_network_body: 'Impossible d’atteindre Appwrite. Vérifiez la connexion.',
        err_generic_title: 'Échec',
        err_generic_body: 'Réponse inattendue. Réessayez plus tard.',
        fetch_fail_toast: 'Chargement des produits impossible',
        err_toast_hint: '— voir la fenêtre pour détails.',
        sinif_group: 'Niveau',
    },
    es: {
        lang_label: 'Idioma',
        lang_label_short: 'Idioma',
        theme_toggle_aria: 'Tema oscuro / claro',
        loader_text: 'Cargando…',
        nav_home: 'Inicio',
        nav_vakif: 'Espíritu',
        nav_how: 'Cómo funciona',
        nav_shop: 'Tienda',
        nav_orders: 'Mis reservas',
        hero_kicker: 'Proyecto escolar TÜBİTAK 4006',
        hero_title_1: 'Juguetes viejos,',
        hero_title_2: 'nueva esperanza.',
        hero_p: 'Unimos solidaridad y feria digital: los juguetes tienen segunda vida; lo recaudado va a causas anunciadas.',
        hero_cta_catalog: 'Ir a la tienda',
        hero_cta_how: 'Ver pasos',
        card_vakif_t: 'Nuestro espíritu',
        card_vakif_p: 'Propósito y transparencia en breve.',
        card_how_t: 'Cómo funciona',
        card_how_p: 'Reserva y entrega en el colegio.',
        card_orders_t: 'Mis reservas',
        card_orders_p: 'Solo en este dispositivo.',
        vakif_kicker: 'Transparencia',
        vakif_title: 'Puente del bien',
        vakif_intro: 'Un puente digital para nuestra comunidad escolar (TÜBİTAK 4006).',
        vakif_q1: '¿Por qué juguetes?',
        vakif_a1: 'Reutilizar reduce residuos y alegra a los niños.',
        vakif_q2: 'Destino de los fondos',
        vakif_a2: 'Lo recaudado sigue las causas anunciadas por el equipo.',
        how_kicker: 'Flujo',
        how_title: '¿Cómo funciona?',
        how_intro: 'Tienda digital y entrega en el colegio, con normas de seguridad.',
        how_step1_t: 'Elige en la tienda',
        how_step2_t: 'Tus datos',
        how_step2_p: '«Reservar»: nombre y clase/sección de la lista; el artículo queda como vendido para otros.',
        how_step3_t: 'Entrega en el colegio',
        how_step3_p: 'Aporta la contribución en el horario anunciado; confirma con profesor o alumno encargado.',
        how_step4_t: 'Historial en este dispositivo',
        shop_title: 'Tienda solidaria',
        shop_sub: 'Los fondos van a causas anunciadas.',
        shop_link_orders: 'Mis reservas',
        shop_link_how: 'Pasos',
        orders_kicker: 'Resumen local',
        orders_title: 'Mis reservas',
        orders_intro: 'Solo se muestran reservas en este navegador (nombre y clase). Habla con el equipo en clase sobre el pago.',
        orders_count_lbl: 'Reservas guardadas',
        orders_empty: 'Aún no hay reservas. Al reservar, tu nombre y clase aparecen aquí.',
        orders_empty_link: 'Ir a la tienda',
        orders_fee_lbl: 'Contribución',
        orders_class_lbl: 'Clase',
        fab_label: 'Mis reservas',
        modal_title: 'Reservar en la feria',
        modal_name_lbl: 'Nombre completo',
        modal_name_ph: 'ej. Ana García',
        modal_sinif_lbl: 'Clase / sección',
        modal_sinif_hint: 'Elige curso 5–8 y sección de la lista.',
        modal_price_unknown: 'El aporte figura en la tarjeta.',
        sinif_placeholder: 'Elegir sección',
        modal_submit: 'Confirmar',
        product_reserve: 'Reservar',
        catalog_empty: 'No hay juguetes listados ahora.',
        catalog_load_fail: 'No se pudo cargar la lista. Revisa la conexión o Appwrite.',
        toast_name: 'Escribe tu nombre completo.',
        toast_ok: 'Guardado. Entrega la contribución como anuncien en clase.',
        err_close: 'OK',
        err_sinif_select: 'Elige clase / sección.',
        support_prompt: '¿Problema al reservar un juguete?',
        support_trigger_aria: 'Contacto y ayuda',
        support_popover_title: 'Contacto y ayuda',
        support_whatsapp: 'Escribir por WhatsApp',
        support_gmail: 'Correo con Gmail',
        support_no_refund: 'Sin reembolsos ni cancelaciones online; solo coordinación en el colegio.',
        support_wa_prefill: 'Hola, necesito ayuda con la feria Puente del bien.',
        support_mail_subject: 'Puente del bien — ayuda',
        support_mail_body: 'Hola,\n\n',
        err_schema_sinif_title: 'Base de datos: campo clase',
        err_schema_sinif_body:
            'El servidor rechazó la clase. En Appwrite, deja sinif como texto para códigos de clase y reintenta.',
        err_validation_title: 'No se pudo validar',
        err_validation_body: 'El servidor rechazó un campo. Revisa el formulario o al equipo.',
        err_auth_title: 'Permisos',
        err_auth_body: 'Permisos insuficientes. Revisa Appwrite.',
        err_network_title: 'Conexión',
        err_network_body: 'No se pudo conectar con Appwrite. Revisa la red.',
        err_generic_title: 'Error',
        err_generic_body: 'Respuesta inesperada. Intenta más tarde.',
        fetch_fail_toast: 'No se pudieron cargar productos',
        err_toast_hint: '— mira el diálogo para detalles.',
        sinif_group: 'Curso',
    },
};

const smartLoader = document.getElementById('smart-loader');
const productsGrid = document.getElementById('products-grid');
const orderModal = document.getElementById('order-modal');
const productDetailModal = document.getElementById('product-detail-modal');
const orderForm = document.getElementById('order-form');
const submitBtn = document.getElementById('submit-btn');
const toastEl = document.getElementById('toast');
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const errorModal = document.getElementById('error-modal');
const errorModalTitle = document.getElementById('error-modal-title');
const errorModalBody = document.getElementById('error-modal-body');
const errorModalTechnical = document.getElementById('error-modal-technical');
const errorModalClose = document.getElementById('error-modal-close');
const supportPopover = document.getElementById('support-popover');

function getLang() {
    const l = document.documentElement.getAttribute('data-lang') || 'tr';
    return LANGS.includes(l) ? l : 'tr';
}

function t(key) {
    const lang = getLang();
    const pack = I18N[lang] || I18N.tr;
    return pack[key] ?? I18N.tr[key] ?? key;
}

function logErr(scope, detail, err) {
    console.error(`[İyilik Köprüsü][${scope}]`, detail, err);
    if (err && err.stack) console.error(`[İyilik Köprüsü][${scope}] stack`, err.stack);
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const k = el.getAttribute('data-i18n');
        if (k) el.textContent = t(k);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const k = el.getAttribute('data-i18n-placeholder');
        if (k) el.setAttribute('placeholder', t(k));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const k = el.getAttribute('data-i18n-title');
        if (k) el.setAttribute('title', t(k));
    });
    const lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const step1 = document.querySelector('.how-step1-p');
    const step4 = document.querySelector('.how-step4-p');
    const linkShop = `<a href="#magaza" class="text-emerald-800 dark:text-blue-400 hover:underline underline-offset-4">${escapeHtml(t('nav_shop'))}</a>`;
    const linkOrders = `<a href="#siparislerim" class="text-emerald-800 dark:text-blue-400 hover:underline underline-offset-4">${escapeHtml(t('nav_orders'))}</a>`;
    if (step1) {
        step1.innerHTML =
            lang === 'ar'
                ? `تصفح الألعاب في ${linkShop}؛ السعر والصورة على البطاقة.`
                : lang === 'en'
                  ? `Browse toys in the ${linkShop}; photo and contribution are on each card.`
                  : lang === 'fr'
                    ? `Parcourez les jouets dans la ${linkShop} ; photo et participation sur la fiche.`
                    : lang === 'es'
                      ? `Mira los juguetes en la ${linkShop}; foto y aporte en cada tarjeta.`
                      : `${linkShop} bölümünden oyuncağı seç; fotoğraf ve katkı payı karttadır.`;
    }
    if (step4) {
        step4.innerHTML =
            lang === 'ar'
                ? `تتبع حجوزاتك من ${linkOrders}. القائمة محلية في هذا المتصفح فقط.`
                : lang === 'en'
                  ? `Track holds on ${linkOrders}. The list stays only in this browser.`
                  : lang === 'fr'
                    ? `Suivez vos résas sur ${linkOrders}. Liste locale à ce navigateur.`
                    : lang === 'es'
                      ? `Revisa reservas en ${linkOrders}. Lista solo en este navegador.`
                      : `Ayırmalarını ${linkOrders} üzerinden takip et; liste yalnızca bu tarayıcıdadır.`;
    }
    populateStudentSinifSelect();
    if (lastProductsRendered.length) renderProducts(lastProductsRendered);
    if (activeRouteSlug === 'siparislerim') renderOrdersList();
    renderSupportPopoverContent();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initLangSelectors() {
    const mk = (sel) => {
        if (!sel) return;
        sel.innerHTML = '';
        LANGS.forEach((code) => {
            const o = document.createElement('option');
            o.value = code;
            o.textContent = code.toUpperCase();
            sel.appendChild(o);
        });
        sel.value = getLang();
        sel.addEventListener('change', () => {
            const v = sel.value;
            if (!LANGS.includes(v)) return;
            localStorage.setItem(LS_LANG_KEY, v);
            document.documentElement.setAttribute('data-lang', v);
            const other = sel.id === 'lang-select' ? document.getElementById('lang-select-mobile') : document.getElementById('lang-select');
            if (other) other.value = v;
            applyI18n();
        });
    };
    mk(document.getElementById('lang-select'));
    mk(document.getElementById('lang-select-mobile'));
}

function initTheme() {
    const stored = localStorage.getItem(LS_THEME_KEY);
    const theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcons();
}

function updateThemeToggleIcons() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.icon-theme-light').forEach((el) => el.classList.toggle('hidden', dark));
    document.querySelectorAll('.icon-theme-dark').forEach((el) => el.classList.toggle('hidden', !dark));
}

function toggleTheme() {
    const next =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(LS_THEME_KEY, next);
    updateThemeToggleIcons();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

let supportOpen = false;
let supportHoverTimer = null;
let activeSupportTrigger = null;

function renderSupportPopoverContent() {
    if (!supportPopover) return;
    const wa = `https://wa.me/${SUPPORT_PHONE_DIGITS}?text=${encodeURIComponent(t('support_wa_prefill'))}`;
    const sub = encodeURIComponent(t('support_mail_subject'));
    const body = encodeURIComponent(t('support_mail_body'));
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${sub}&body=${body}`;
    supportPopover.innerHTML = `
        <h4>${escapeHtml(t('support_popover_title'))}</h4>
        <a href="${wa}" target="_blank" rel="noopener noreferrer">💬 ${escapeHtml(t('support_whatsapp'))}</a>
        <a href="${gmail}" target="_blank" rel="noopener noreferrer">✉️ ${escapeHtml(t('support_gmail'))}</a>
        <p class="support-muted">${escapeHtml(t('support_no_refund'))}</p>
    `;
}

function positionSupportPopover(anchor) {
    if (!supportPopover) return;
    supportPopover.style.position = 'fixed';
    const r = anchor.getBoundingClientRect();
    const w = 300;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = r.bottom + 10;
    const estH = 200;
    if (top + estH > window.innerHeight - 8) top = Math.max(8, r.top - estH - 8);
    supportPopover.style.left = `${left}px`;
    supportPopover.style.top = `${top}px`;
    supportPopover.style.width = `${w}px`;
}

function openSupport(anchor) {
    if (!supportPopover) return;
    activeSupportTrigger = anchor;
    renderSupportPopoverContent();
    supportPopover.classList.add('is-open');
    supportPopover.setAttribute('aria-hidden', 'false');
    anchor.querySelector('[data-support-trigger]')?.setAttribute('aria-expanded', 'true');
    positionSupportPopover(anchor);
    supportOpen = true;
}

function closeSupport() {
    if (!supportPopover) return;
    supportPopover.classList.remove('is-open');
    supportPopover.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('[data-support-trigger]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    supportOpen = false;
    activeSupportTrigger = null;
}

let supportGlobalListenersBound = false;

function bindSupportAnchor(anchor, canHover) {
    if (anchor.dataset.supportBound === '1') return;
    anchor.dataset.supportBound = '1';
    const btn = anchor.querySelector('[data-support-trigger]');
    if (!btn) return;
    if (canHover) {
        const onEnter = () => {
            clearTimeout(supportHoverTimer);
            supportHoverTimer = setTimeout(() => openSupport(anchor), 100);
        };
        const onLeave = () => {
            clearTimeout(supportHoverTimer);
            supportHoverTimer = setTimeout(() => {
                if (!supportPopover?.matches(':hover')) closeSupport();
            }, 220);
        };
        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
    }
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (canHover) return;
        if (supportOpen && activeSupportTrigger === anchor) closeSupport();
        else openSupport(anchor);
    });
}

function initSupportTriggers() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (supportPopover && canHover && !supportPopover.dataset.hoverBridge) {
        supportPopover.dataset.hoverBridge = '1';
        supportPopover.addEventListener('mouseenter', () => clearTimeout(supportHoverTimer));
        supportPopover.addEventListener('mouseleave', () => {
            clearTimeout(supportHoverTimer);
            supportHoverTimer = setTimeout(() => closeSupport(), 220);
        });
    }
    document.querySelectorAll('[data-support-anchor]').forEach((anchor) => {
        if (anchor.closest('#products-grid')) return;
        bindSupportAnchor(anchor, canHover);
    });
    if (productsGrid && !productsGrid.dataset.supportClickBound) {
        productsGrid.dataset.supportClickBound = '1';
        productsGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-support-trigger]');
            if (!btn || !productsGrid.contains(btn)) return;
            e.preventDefault();
            e.stopPropagation();
            const anchor = btn.closest('[data-support-anchor]');
            if (!anchor) return;
            if (supportOpen && activeSupportTrigger === anchor) closeSupport();
            else openSupport(anchor);
        });
    }
    if (!supportGlobalListenersBound) {
        supportGlobalListenersBound = true;
        document.addEventListener('click', (e) => {
            if (!supportOpen) return;
            if (e.target.closest('#support-popover')) return;
            if (e.target.closest('[data-support-trigger]')) return;
            closeSupport();
        });
        window.addEventListener(
            'scroll',
            () => {
                if (supportOpen) closeSupport();
            },
            true,
        );
        window.addEventListener('resize', () => {
            if (supportOpen && activeSupportTrigger) positionSupportPopover(activeSupportTrigger);
        });
    }
}

function populateStudentSinifSelect() {
    const sel = document.getElementById('student-sinif');
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = t('sinif_placeholder');
    sel.appendChild(ph);
    SINIF_GRADES.forEach((g) => {
        const og = document.createElement('optgroup');
        og.label = `${t('sinif_group')} ${g}`;
        SINIF_BRANCHES.forEach((b) => {
            const o = document.createElement('option');
            const val = `${g}/${b}`;
            o.value = val;
            o.textContent = val;
            og.appendChild(o);
        });
        sel.appendChild(og);
    });
    if (prev && [...sel.options].some((o) => o.value === prev)) {
        sel.value = prev;
        ph.selected = false;
    }
}

/**
 * @returns {{ ok: true, value: string } | { ok: false, message: string }}
 */
function validateNormalizeOkulSinif(raw) {
    const compact = String(raw ?? '')
        .trim()
        .replace(/\s+/g, '')
        .replace(/-/g, '/')
        .toUpperCase();
    const m = compact.match(OKUL_SINIF_REGEX);
    if (!m) {
        return { ok: false, message: t('err_sinif_select') };
    }
    return { ok: true, value: `${m[1]}/${m[2]}` };
}

function isLikelySinifSchemaRejection(raw, lower) {
    if (!lower) return false;
    const mentionsSinif =
        lower.includes('sinif') ||
        lower.includes('"sinif"') ||
        lower.includes("'sinif'");
    if (!mentionsSinif) return false;
    const docStruct =
        lower.includes('invalid document structure') ||
        lower.includes('invalid format') ||
        lower.includes('has invalid format');
    const enumOrChoice =
        lower.includes('enum') ||
        /\b(standard|express|premium)\b/i.test(raw);
    return docStruct || enumOrChoice;
}

function toast(msg, variant = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.setAttribute('data-variant', variant === 'error' ? 'error' : 'info');
    toastEl.style.opacity = '1';
    clearTimeout(toast._t);
    const dur = variant === 'error' ? 6500 : 3400;
    toast._t = setTimeout(() => {
        toastEl.style.opacity = '0';
    }, dur);
}

function extractAppwriteMessage(err) {
    if (!err) return '';
    let m = typeof err.message === 'string' ? err.message : '';
    try {
        if (typeof err.response === 'string' && err.response) {
            const j = JSON.parse(err.response);
            m = j.message || j.errors?.[0]?.message || m;
        } else if (err.response && typeof err.response === 'object') {
            m = err.response.message || err.errors?.[0]?.message || m;
        }
    } catch (_) {
        /* ignore */
    }
    return m || String(err);
}

function humanizeAppwriteError(err) {
    const raw = extractAppwriteMessage(err);
    const lower = raw.toLowerCase();

    if (isLikelySinifSchemaRejection(raw, lower)) {
        return {
            titleKey: 'err_schema_sinif_title',
            bodyKey: 'err_schema_sinif_body',
            technical: raw,
            kind: 'schema-sinif',
        };
    }

    if (
        lower.includes('invalid document structure') ||
        lower.includes('has invalid format') ||
        lower.includes('invalid format')
    ) {
        return {
            titleKey: 'err_validation_title',
            bodyKey: 'err_validation_body',
            technical: raw,
            kind: 'validation',
        };
    }

    if (
        lower.includes('unauthorized') ||
        lower.includes('not authorized') ||
        lower.includes(' 401 ')
    ) {
        return {
            titleKey: 'err_auth_title',
            bodyKey: 'err_auth_body',
            technical: raw,
            kind: 'auth',
        };
    }

    if (lower.includes('network') || lower.includes('failed to fetch')) {
        return {
            titleKey: 'err_network_title',
            bodyKey: 'err_network_body',
            technical: raw,
            kind: 'network',
        };
    }

    return {
        titleKey: 'err_generic_title',
        bodyKey: 'err_generic_body',
        technical: raw,
        kind: 'generic',
    };
}

window.closeErrorModal = () => {
    if (!errorModal) return;
    errorModal.classList.remove('active');
    errorModal.setAttribute('aria-hidden', 'true');
};

function openErrorModal(summary) {
    if (!errorModal || !errorModalTitle || !errorModalBody) return;
    const title = summary.titleKey ? t(summary.titleKey) : summary.title;
    const body = summary.bodyKey ? t(summary.bodyKey) : summary.body;
    errorModalTitle.textContent = title;
    errorModalBody.textContent = body;
    if (errorModalTechnical) {
        errorModalTechnical.textContent = summary.technical || '';
    }
    errorModal.classList.add('active');
    errorModal.setAttribute('aria-hidden', 'false');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function siparisLocalSinifGoster(o) {
    if (o.sinif && String(o.sinif).trim()) return String(o.sinif).trim();
    if (o.sinifEtiket) return String(o.sinifEtiket);
    if (o.sinifKey) return String(o.sinifKey);
    return '';
}

function getRouteSlugFromLocation() {
    let raw = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
    raw = raw.split('/')[0] || 'anasayfa';
    raw = ROUTE_LEGACY[raw] || raw;
    if (!ROUTES.includes(raw)) return 'anasayfa';
    return raw;
}

function navigateTo(slug) {
    const next = ROUTES.includes(slug) ? slug : 'anasayfa';
    window.location.hash = `#${next}`;
}

function setMobileMenuOpen(open) {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.toggle('hidden', !open);
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    const openIc = mobileToggle.querySelector('.menu-icon-open');
    const closeIc = mobileToggle.querySelector('.menu-icon-close');
    if (openIc) openIc.classList.toggle('hidden', open);
    if (closeIc) closeIc.classList.toggle('hidden', !open);
}

function routePane(slug) {
    const id = slug === 'nasil-siparis' ? 'route-nasil-siparis' : `route-${slug}`;
    return document.getElementById(id);
}

function applyRoute(slug) {
    activeRouteSlug = slug;

    ROUTES.forEach((r) => {
        const pane = routePane(r);
        if (!pane) return;
        if (r === slug) pane.classList.remove('hidden');
        else pane.classList.add('hidden');
    });

    document.querySelectorAll('.nav-link, .nav-link-mobile, .nav-brand').forEach((el) => {
        el.classList.remove('nav-active');
    });

    document.querySelectorAll(`[href="#${slug}"]`).forEach((el) => {
        el.classList.add('nav-active');
    });
    if (slug === 'anasayfa') {
        document.querySelectorAll('[href="#"], [href="#anasayfa"]').forEach((el) => {
            el.classList.add('nav-active');
        });
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    if (slug === 'siparislerim') {
        renderOrdersList();
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function readStoredOrders() {
    try {
        const raw = localStorage.getItem(LS_ORDERS_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        logErr('localStorage_read_orders', { key: LS_ORDERS_KEY }, e);
        return [];
    }
}

function writeStoredOrders(entries) {
    try {
        localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(entries));
    } catch (e) {
        logErr('localStorage_write_orders', { key: LS_ORDERS_KEY }, e);
    }
}

function pushStoredOrder(entry) {
    const list = readStoredOrders();
    list.unshift(entry);
    writeStoredOrders(list);
}

function formatLocaleDate(iso) {
    try {
        const d = new Date(iso);
        const loc = { tr: 'tr-TR', en: 'en-GB', ar: 'ar', fr: 'fr', es: 'es' }[getLang()] || 'tr-TR';
        return d.toLocaleString(loc, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        logErr('format_date', { iso }, e);
        return iso || '';
    }
}

function renderOrdersList() {
    const listRoot = document.getElementById('orders-list');
    const emptyRoot = document.getElementById('orders-empty');
    const countEl = document.getElementById('orders-count');
    const entries = readStoredOrders();

    if (countEl) countEl.textContent = String(entries.length);

    if (!listRoot || !emptyRoot) return;

    listRoot.innerHTML = '';

    if (entries.length === 0) {
        emptyRoot.classList.remove('hidden');
        return;
    }
    emptyRoot.classList.add('hidden');

    entries.forEach((o) => {
        const katki =
            typeof o.katki === 'number' && !Number.isNaN(o.katki)
                ? `₺${o.katki}`
                : '—';
        const row = document.createElement('article');
        row.className =
            'glass-panel rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4';
        const sinifMetni = siparisLocalSinifGoster(o);
        const feeLbl = escapeHtml(t('orders_fee_lbl'));
        const clsLbl = escapeHtml(t('orders_class_lbl'));

        row.innerHTML = `
            <div class="space-y-1 min-w-0">
                <h3 class="text-white font-semibold truncate">${escapeHtml(o.urunAdi || '—')}</h3>
                <p class="text-slate-400 text-sm font-light">
                    <span class="text-slate-300">${escapeHtml(o.aliciAdSoyad || '')}</span>${sinifMetni ? `${o.aliciAdSoyad ? ' · ' : ''}<span class="text-emerald-800 dark:text-blue-300/90">${clsLbl} ${escapeHtml(sinifMetni)}</span>` : ''}
                </p>
                ${o.ref ? `<p class="text-[10px] uppercase tracking-[0.2em] text-slate-600">ID ${escapeHtml(o.ref)}</p>` : ''}
            </div>
            <div class="shrink-0 flex flex-col items-start md:items-end gap-1 text-sm">
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500">${feeLbl}</span>
                <span class="text-white font-light text-lg">${escapeHtml(katki)}</span>
                <span class="text-slate-500 text-xs">${escapeHtml(formatLocaleDate(o.tarihISO || ''))}</span>
            </div>`;
        listRoot.appendChild(row);
    });
}

window.openDetailModal = (productId) => {
    const p = productsById[productId];
    const detailImage = document.getElementById('detail-image');
    const detailTitle = document.getElementById('detail-title');
    const detailDescription = document.getElementById('detail-description');

    const name = p
        ? p.baslik || p.urunAdi || p.isim || '—'
        : '—';
    const image = p
        ? p.resimUrl || p.gorsel || CATALOG_IMG_FALLBACK
        : CATALOG_IMG_FALLBACK;
    const description = p && p.aciklama != null ? String(p.aciklama) : '';

    if (detailImage) detailImage.src = image;
    if (detailTitle) detailTitle.textContent = name;
    if (detailDescription) detailDescription.textContent = description;

    currentDetailProductId = productId;

    if (productDetailModal) productDetailModal.classList.add('active');
};

window.closeDetailModal = () => {
    if (productDetailModal) productDetailModal.classList.remove('active');
    currentDetailProductId = '';
};

window.openOrderModalFromDetail = () => {
    if (currentDetailProductId) {
        closeDetailModal();
        window.openModal(currentDetailProductId);
    }
};

window.openModal = (productId) => {
    const p = productsById[productId];
    const productIdInput = document.getElementById('selected-product-id');
    const productNameInput = document.getElementById('selected-product-name');
    const caption = document.getElementById('modal-product-caption');

    const name = p
        ? p.baslik || p.urunAdi || p.isim || '—'
        : '—';

    if (productIdInput) productIdInput.value = productId;
    if (productNameInput) productNameInput.value = name;

    if (caption) {
        caption.textContent = name;
    }

    if (orderModal) orderModal.classList.add('active');
};

window.closeModal = () => {
    if (orderModal) orderModal.classList.remove('active');
    if (orderForm) orderForm.reset();
    populateStudentSinifSelect();
};

if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
        if (e.target === productDetailModal) {
            closeDetailModal();
        }
    });
}

function hideSmartLoaderSoon() {
    if (!smartLoader) return;
    smartLoader.style.opacity = '0';
    smartLoader.style.pointerEvents = 'none';
    setTimeout(() => {
        smartLoader.style.display = 'none';
    }, 700);
}

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(DB_ID, URUNLER_COLLECTION, [
            Query.orderDesc('$createdAt'),
        ]);

        response.documents.forEach((doc) => {
            productsById[doc.$id] = doc;
        });
        lastProductsRendered = response.documents;
        console.log('[İyilik Köprüsü][fetch_products] OK', { count: response.documents.length });
        renderProducts(response.documents);
    } catch (error) {
        logErr('fetch_products', { db: DB_ID, collection: URUNLER_COLLECTION }, error);
        if (productsGrid) {
            productsGrid.innerHTML = `<p class="col-span-full text-center py-12 text-red-600/90 dark:text-red-300/90 text-sm">${escapeHtml(t('catalog_load_fail'))}</p>`;
        }
        const h = humanizeAppwriteError(error);
        const brief = h.bodyKey ? t(h.bodyKey) : h.body;
        toast(`${t('fetch_fail_toast')} — ${brief.slice(0, 100)}${brief.length > 100 ? '…' : ''}`, 'error');
    } finally {
        hideSmartLoaderSoon();
    }
}

const CATALOG_IMG_FALLBACK =
    'https://via.placeholder.com/600/e2e8f0/64748b?text=%C3%9Cr%C3%BCn';

function renderProducts(products) {
    if (!productsGrid) return;
    try {
        if (!Array.isArray(products) || products.length === 0) {
            productsGrid.innerHTML = `<p class="col-span-full text-center py-12 text-slate-500 font-light">${escapeHtml(t('catalog_empty'))}</p>`;
            return;
        }

        const reserve = escapeHtml(t('product_reserve'));
        const imgOnError = `this.onerror=null;this.src='${CATALOG_IMG_FALLBACK}';`;

        productsGrid.innerHTML = products
            .map((p) => {
                const urunIsmi =
                    p.baslik ||
                    p.urunAdi ||
                    p.isim ||
                    '—';
                const safeName = escapeHtml(urunIsmi);
                const urunGorsel =
                    p.resimUrl || p.gorsel || CATALOG_IMG_FALLBACK;
                const aciklama = p.aciklama != null ? String(p.aciklama) : '';

                return `
        <article id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${escapeHtml(urunGorsel)}" alt="${safeName}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" loading="lazy" decoding="async" onerror="${imgOnError}">
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${safeName}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 px-2 mb-4 line-clamp-2 min-h-[2.5rem]">${escapeHtml(aciklama)}</p>
            <div class="support-help-row px-2 mb-3 !mt-0 !gap-2">
                <span class="support-help-text !text-[11px] leading-snug">${escapeHtml(t('support_prompt'))}</span>
                <button type="button" class="support-help-trigger !w-8 !h-8" data-support-trigger aria-expanded="false" data-i18n-title="support_trigger_aria" title="${escapeHtml(t('support_trigger_aria'))}">
                    <i data-lucide="help-circle" class="w-4 h-4"></i>
                </button>
            </div>
            <button type="button"
                class="reserve-btn w-full bg-white/10 hover:bg-emerald-700/90 dark:hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                data-product-id="${escapeHtml(p.$id)}">
                ${reserve}
            </button>
        </article>`;
            })
            .join('');
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        document.querySelectorAll('#products-grid [data-support-anchor]').forEach((anchor) => {
            bindSupportAnchor(anchor, canHover);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (err) {
        logErr('render_products', { count: products?.length }, err);
        productsGrid.innerHTML = `<p class="col-span-full text-center py-12 text-red-600/90 dark:text-red-300/90 text-sm">${escapeHtml(t('catalog_load_fail'))}</p>`;
    }
}

if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
        const article = e.target.closest('[id^="product-"]');
        if (!article || !productsGrid.contains(article)) return;
        const id = article.id.replace('product-', '');
        if (!id || !productsById[id]) return;
        window.openDetailModal(id);
    });
}

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const willOpen = mobileMenu.classList.contains('hidden');
        setMobileMenuOpen(willOpen);
    });
}

document.querySelectorAll('[data-nav-link], .nav-brand').forEach((el) => {
    el.addEventListener('click', () => setMobileMenuOpen(false));
});

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);

if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId =
            document.getElementById('selected-product-id')?.value ?? '';
        const productName =
            document.getElementById('selected-product-name')?.value || '—';
        const studentName =
            document.getElementById('student-name')?.value?.trim() || '';
        const sinifRaw = document.getElementById('student-sinif')?.value ?? '';
        const sinifCheck = validateNormalizeOkulSinif(sinifRaw);
        if (!sinifCheck.ok) {
            toast(sinifCheck.message, 'error');
            return;
        }
        const sinifValue = sinifCheck.value;

        if (!productId || !studentName) {
            toast(t('toast_name'), 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>…</span>';
        }

        const iso = new Date().toISOString();

        try {
            const created = await databases.createDocument(
                DB_ID,
                SIPARISLER_COLLECTION,
                ID.unique(),
                {
                    urunAdi: productName,
                    aliciAdSoyad: studentName,
                    sinif: sinifValue,
                    tarih: iso,
                },
            );

            delete productsById[productId];
            lastProductsRendered = lastProductsRendered.filter((d) => d.$id !== productId);

            pushStoredOrder({
                localId: crypto.randomUUID(),
                urunRef: productId,
                urunAdi: productName,
                aliciAdSoyad: studentName,
                sinif: sinifValue,
                katki:
                    katkiParsed != null && !Number.isNaN(katkiParsed)
                        ? katkiParsed
                        : null,
                ref: created.$id ?? null,
                tarihISO: iso,
            });

            window.closeModal();
            document.getElementById(`product-${productId}`)?.remove();

            toast(t('toast_ok'));
            if (activeRouteSlug === 'siparislerim') {
                renderOrdersList();
            }
        } catch (err) {
            logErr('order_submit', { productId, sinif: sinifValue }, err);
            const summary = humanizeAppwriteError(err);
            toast(`${t(summary.titleKey || 'err_generic_title')} ${t('err_toast_hint')}`, 'error');
            openErrorModal(summary);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span data-i18n="modal_submit">${escapeHtml(t('modal_submit'))}</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    });
}

function onRouteChange() {
    applyRoute(getRouteSlugFromLocation());
}

window.addEventListener('hashchange', onRouteChange);

document.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem(LS_LANG_KEY);
    if (storedLang && LANGS.includes(storedLang)) {
        document.documentElement.setAttribute('data-lang', storedLang);
    }
    initTheme();
    initLangSelectors();
    initSupportTriggers();
    populateStudentSinifSelect();
    applyI18n();

    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
        history.replaceState(
            null,
            '',
            `${window.location.pathname}${window.location.search}#anasayfa`,
        );
    }

    errorModalClose?.addEventListener('click', window.closeErrorModal);
    errorModal?.addEventListener('click', (ev) => {
        if (ev.target === errorModal) window.closeErrorModal();
    });
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && errorModal?.classList.contains('active')) {
            window.closeErrorModal();
        }
        if (ev.key === 'Escape' && supportOpen) closeSupport();
    });

    onRouteChange();
    renderOrdersList();
    fetchProducts();
});

window.navigateTo = navigateTo;
window.getActiveRouteSlug = () => activeRouteSlug;
