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

/** E.164 rakamları (başında + yok) */
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

const productsById = {};
let activeRouteSlug = '';

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
        orders_intro: 'Bu sayfada yalnızca bu tarayıcıda tutulan ayırmaların görünür; adın ve sınıfın listelenir.',
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
        support_no_refund: 'İade veya online iptal bulunmaz.',
        support_wa_prefill: 'Merhaba, İyilik Köprüsü kermesi hakkında bilgi almak istiyorum.',
        support_mail_subject: 'İyilik Köprüsü — destek',
        support_mail_body: 'Merhaba,\n\n',
        err_schema_sinif_title: 'Veritabanı: sinif alanı güncellenmeli',
        err_schema_sinif_body: 'Sunucu sınıf bilgisini kabul etmedi.',
        err_validation_title: 'Kayıt doğrulanamadı',
        err_validation_body: 'Sunucu gönderilen bilgilerden birini beklenen biçimde bulamadı.',
        err_auth_title: 'Yetki uyarısı',
        err_auth_body: 'İzinler eksik görünüyor.',
        err_network_title: 'Bağlantı sorunu',
        err_network_body: 'Appwrite’a ulaşılamadı.',
        err_generic_title: 'İşlem tamamlanamadı',
        err_generic_body: 'Beklenmeyen bir sunucu yanıtı.',
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
        hero_p: 'Proceeds go to announced good causes.',
        hero_cta_catalog: 'Go to shop',
        hero_cta_how: 'Read the steps',
        card_vakif_t: 'Our spirit',
        card_vakif_p: 'Short note on purpose.',
        card_how_t: 'How it works',
        card_how_p: 'Holding a toy and handover.',
        card_orders_t: 'My holds',
        card_orders_p: 'Holds on this device.',
        vakif_kicker: 'Transparency',
        vakif_title: 'Goodness Bridge',
        vakif_intro: 'A digital bridge for our school community.',
        how_kicker: 'Flow',
        how_title: 'How it works',
        how_intro: 'Digital shop plus in-school handover.',
        shop_title: 'Goodness shop',
        shop_sub: 'Proceeds go to announced causes.',
        orders_kicker: 'Local summary',
        orders_title: 'My holds',
        orders_intro: 'Only holds on this browser are shown.',
        orders_count_lbl: 'Saved holds',
        orders_empty: 'No holds yet.',
        orders_empty_link: 'Go to shop',
        orders_fee_lbl: 'Contribution',
        orders_class_lbl: 'Class',
        fab_label: 'My holds',
        modal_title: 'Reserve',
        modal_name_lbl: 'Full name',
        modal_name_ph: 'e.g. Jane Doe',
        modal_sinif_lbl: 'Class / section',
        modal_sinif_hint: 'Choose grade 5–8 and section.',
        modal_price_unknown: 'Check the card.',
        sinif_placeholder: 'Choose section',
        modal_submit: 'Confirm hold',
        product_reserve: 'Reserve',
        catalog_empty: 'No toys listed.',
        catalog_load_fail: 'Could not load.',
        toast_name: 'Enter your name.',
        toast_ok: 'Saved.',
        err_close: 'OK',
        err_sinif_select: 'Choose class.',
        support_prompt: 'Trouble reserving?',
        support_trigger_aria: 'Contact',
        support_popover_title: 'Contact',
        support_whatsapp: 'WhatsApp',
        support_gmail: 'Email',
        support_no_refund: 'School coordination only.',
        support_wa_prefill: 'Hello, I need help.',
        support_mail_subject: 'Support',
        support_mail_body: 'Hello,\n\n',
        err_schema_sinif_title: 'Database error',
        err_schema_sinif_body: 'Class field error.',
        err_validation_title: 'Validation failed',
        err_validation_body: 'Check form fields.',
        err_auth_title: 'Permission error',
        err_auth_body: 'Access denied.',
        err_network_title: 'Network error',
        err_network_body: 'Check connection.',
        err_generic_title: 'Error',
        err_generic_body: 'Try again later.',
        fetch_fail_toast: 'Load failed',
        err_toast_hint: 'Check dialog.',
        sinif_group: 'Grade',
    },
    ar: {
        lang_label: 'اللغة',
        lang_label_short: 'لغة',
        theme_toggle_aria: 'الوضع الداكن / المضيء',
        loader_text: 'جاري التحميل...',
        nav_home: 'الرئيسية',
        nav_vakif: 'المهمة',
        nav_how: 'كيف يعمل؟',
        nav_shop: 'المتجر',
        nav_orders: 'حجوزاتي',
        hero_kicker: 'مشروع مدرسي TÜBİTAK 4006',
        hero_title_1: 'ألعاب قديمة،',
        hero_title_2: 'أمل جديد.',
        hero_p: 'تذهب العائدات إلى قضايا خيرية معلنة.',
        hero_cta_catalog: 'الذهاب للمتجر',
        hero_cta_how: 'اقرأ الخطوات',
        card_vakif_t: 'روحنا',
        card_vakif_p: 'ملاحظة قصيرة عن الهدف.',
        card_how_t: 'كيف يعمل؟',
        card_how_p: 'حجز اللعبة والتسليم.',
        card_orders_t: 'حجوزاتي',
        card_orders_p: 'الحجوزات على هذا الجهاز.',
        vakif_kicker: 'الشفافية',
        vakif_title: 'جسر الخير',
        vakif_intro: 'جسر رقمي لمجتمع مدرستنا.',
        how_kicker: 'التدفق',
        how_title: 'كيف يعمل؟',
        how_intro: 'متجر رقمي بالإضافة إلى تسليم في المدرسة.',
        shop_title: 'متجر الخير',
        shop_sub: 'تذهب العائدات لقضايا معلنة.',
        orders_kicker: 'ملخص محلي',
        orders_title: 'حجوزاتي',
        orders_intro: 'تظهر فقط الحجوزات على هذا المتصفح.',
        orders_count_lbl: 'الحجوزات المحفوظة',
        orders_empty: 'لا توجد حجوزات بعد.',
        orders_empty_link: 'اذهب للمتجر',
        orders_fee_lbl: 'المساهمة',
        orders_class_lbl: 'الفصل',
        fab_label: 'حجوزاتي',
        modal_title: 'حجز',
        modal_name_lbl: 'الاسم الكامل',
        modal_name_ph: 'مثال: أحمد محمد',
        modal_sinif_lbl: 'الفصل / الشعبة',
        modal_sinif_hint: 'اختر الصف 5-8 والشعبة.',
        modal_price_unknown: 'تحقق من البطاقة.',
        sinif_placeholder: 'اختر الشعبة',
        modal_submit: 'تأكيد الحجز',
        product_reserve: 'حجز',
        catalog_empty: 'لا توجد ألعاب مدرجة.',
        catalog_load_fail: 'تعذر التحميل.',
        toast_name: 'أدخل اسمك.',
        toast_ok: 'تم الحفظ.',
        err_close: 'حسنًا',
        err_sinif_select: 'اختر فصلاً.',
        support_prompt: 'هل تواجه مشكلة؟',
        support_trigger_aria: 'اتصال',
        support_popover_title: 'اتصال',
        support_whatsapp: 'واتساب',
        support_gmail: 'بريد إلكتروني',
        support_no_refund: 'تنسيق مدرسي فقط.',
        support_wa_prefill: 'مرحباً، أحتاج للمساعدة.',
        support_mail_subject: 'دعم',
        support_mail_body: 'مرحباً،\n\n',
        err_schema_sinif_title: 'خطأ في قاعدة البيانات',
        err_schema_sinif_body: 'خطأ في حقل الفصل.',
        err_validation_title: 'فشل التحقق',
        err_validation_body: 'تحقق من حقول النموذج.',
        err_auth_title: 'خطأ في الإذن',
        err_auth_body: 'تم رفض الوصول.',
        err_network_title: 'خطأ في الاتصال',
        err_network_body: 'تحقق من الاتصال.',
        err_generic_title: 'خطأ',
        err_generic_body: 'حاول لاحقاً.',
        fetch_fail_toast: 'فشل التحميل',
        err_toast_hint: 'تحقق من الحوار.',
        sinif_group: 'الصف',
    },
    fr: {
        lang_label: 'Langue',
        lang_label_short: 'Langue',
        theme_toggle_aria: 'Mode sombre / clair',
        loader_text: 'Chargement...',
        nav_home: 'Accueil',
        nav_vakif: 'Mission',
        nav_how: 'Comment ça marche',
        nav_shop: 'Boutique',
        nav_orders: 'Mes réservations',
        hero_kicker: 'Projet scolaire TÜBİTAK 4006',
        hero_title_1: 'Vieux jouets,',
        hero_title_2: 'nouvel espoir.',
        hero_p: 'Les bénéfices vont à des causes annoncées.',
        hero_cta_catalog: 'Aller à la boutique',
        hero_cta_how: 'Lire les étapes',
        card_vakif_t: 'Notre esprit',
        card_vakif_p: 'Courte note sur le but.',
        card_how_t: 'Comment ça marche',
        card_how_p: 'Réserver un jouet et remise.',
        card_orders_t: 'Mes réservations',
        card_orders_p: 'Réservations sur cet appareil.',
        vakif_kicker: 'Transparence',
        vakif_title: 'Pont de bonté',
        vakif_intro: 'Un pont numérique pour notre école.',
        how_kicker: 'Flux',
        how_title: 'Comment ça marche',
        how_intro: 'Boutique numérique plus remise à l\'école.',
        shop_title: 'Boutique de bonté',
        shop_sub: 'Bénéfices pour les causes annoncées.',
        orders_kicker: 'Résumé local',
        orders_title: 'Mes réservations',
        orders_intro: 'Seules les réservations sur ce navigateur sont affichées.',
        orders_count_lbl: 'Réservations enregistrées',
        orders_empty: 'Aucune réservation.',
        orders_empty_link: 'Aller à la boutique',
        orders_fee_lbl: 'Contribution',
        orders_class_lbl: 'Classe',
        fab_label: 'Mes réservations',
        modal_title: 'Réserver',
        modal_name_lbl: 'Nom complet',
        modal_name_ph: 'ex: Jean Dupont',
        modal_sinif_lbl: 'Classe / section',
        modal_sinif_hint: 'Choisissez la 5e-8e et la section.',
        modal_price_unknown: 'Vérifiez la carte.',
        sinif_placeholder: 'Choisissez la section',
        modal_submit: 'Confirmer',
        product_reserve: 'Réserver',
        catalog_empty: 'Aucun jouet répertorié.',
        catalog_load_fail: 'Échec du chargement.',
        toast_name: 'Entrez votre nom.',
        toast_ok: 'Enregistré.',
        err_close: 'OK',
        err_sinif_select: 'Choisissez une classe.',
        support_prompt: 'Un problème?',
        support_trigger_aria: 'Contact',
        support_popover_title: 'Contact',
        support_whatsapp: 'WhatsApp',
        support_gmail: 'Email',
        support_no_refund: 'Coordination scolaire uniquement.',
        support_wa_prefill: 'Bonjour, j\'ai besoin d\'aide.',
        support_mail_subject: 'Support',
        support_mail_body: 'Bonjour,\n\n',
        err_schema_sinif_title: 'Erreur base de données',
        err_schema_sinif_body: 'Erreur champ classe.',
        err_validation_title: 'Échec validation',
        err_validation_body: 'Vérifiez les champs.',
        err_auth_title: 'Erreur permission',
        err_auth_body: 'Accès refusé.',
        err_network_title: 'Erreur réseau',
        err_network_body: 'Vérifiez la connexion.',
        err_generic_title: 'Erreur',
        err_generic_body: 'Réessayez plus tard.',
        fetch_fail_toast: 'Échec chargement',
        err_toast_hint: 'Vérifiez le dialogue.',
        sinif_group: 'Niveau',
    },
    es: {
        lang_label: 'Idioma',
        lang_label_short: 'Idioma',
        theme_toggle_aria: 'Modo oscuro / claro',
        loader_text: 'Cargando...',
        nav_home: 'Inicio',
        nav_vakif: 'Misión',
        nav_how: 'Cómo funciona',
        nav_shop: 'Tienda',
        nav_orders: 'Mis reservas',
        hero_kicker: 'Proyecto escolar TÜBİTAK 4006',
        hero_title_1: 'Juguetes viejos,',
        hero_title_2: 'nueva esperanza.',
        hero_p: 'Las ganancias van a causas anunciadas.',
        hero_cta_catalog: 'Ir a la tienda',
        hero_cta_how: 'Leer pasos',
        card_vakif_t: 'Nuestro espíritu',
        card_vakif_p: 'Nota breve sobre el propósito.',
        card_how_t: 'Cómo funciona',
        card_how_p: 'Reservar un juguete y entrega.',
        card_orders_t: 'Mis reservas',
        card_orders_p: 'Reservas en este dispositivo.',
        vakif_kicker: 'Transparencia',
        vakif_title: 'Puente de Bondad',
        vakif_intro: 'Un puente digital para nuestra escuela.',
        how_kicker: 'Flujo',
        how_title: 'Cómo funciona',
        how_intro: 'Tienda digital más entrega en la escuela.',
        shop_title: 'Tienda de bondad',
        shop_sub: 'Ganancias para causas anunciadas.',
        orders_kicker: 'Resumen local',
        orders_title: 'Mis reservas',
        orders_intro: 'Solo se muestran reservas en este navegador.',
        orders_count_lbl: 'Reservas guardadas',
        orders_empty: 'No hay reservas.',
        orders_empty_link: 'Ir a la tienda',
        orders_fee_lbl: 'Contribución',
        orders_class_lbl: 'Clase',
        fab_label: 'Mis reservas',
        modal_title: 'Reservar',
        modal_name_lbl: 'Nombre completo',
        modal_name_ph: 'ej: Juan Pérez',
        modal_sinif_lbl: 'Clase / sección',
        modal_sinif_hint: 'Elija 5º-8º y sección.',
        modal_price_unknown: 'Ver tarjeta.',
        sinif_placeholder: 'Elija sección',
        modal_submit: 'Confirmar',
        product_reserve: 'Reservar',
        catalog_empty: 'No hay juguetes.',
        catalog_load_fail: 'Error al cargar.',
        toast_name: 'Ingrese su nombre.',
        toast_ok: 'Guardado.',
        err_close: 'OK',
        err_sinif_select: 'Elija clase.',
        support_prompt: '¿Problemas?',
        support_trigger_aria: 'Contacto',
        support_popover_title: 'Contacto',
        support_whatsapp: 'WhatsApp',
        support_gmail: 'Email',
        support_no_refund: 'Solo coordinación escolar.',
        support_wa_prefill: 'Hola, necesito ayuda.',
        support_mail_subject: 'Soporte',
        support_mail_body: 'Hola,\n\n',
        err_schema_sinif_title: 'Error base de datos',
        err_schema_sinif_body: 'Error campo clase.',
        err_validation_title: 'Error validación',
        err_validation_body: 'Revise los campos.',
        err_auth_title: 'Error permiso',
        err_auth_body: 'Acceso denegado.',
        err_network_title: 'Error red',
        err_network_body: 'Revise conexión.',
        err_generic_title: 'Error',
        err_generic_body: 'Intente más tarde.',
        fetch_fail_toast: 'Error carga',
        err_toast_hint: 'Ver diálogo.',
        sinif_group: 'Grado',
    }
};

const smartLoader = document.getElementById('smart-loader');
const productsGrid = document.getElementById('products-grid');
const orderModal = document.getElementById('order-modal');
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
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const k = el.getAttribute('data-i18n');
        if (k) el.textContent = t(k);
    });
    const lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
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
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(LS_THEME_KEY, next);
    updateThemeToggleIcons();
    if (typeof lucide !== 'undefined') lucide.createIcons();
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

function validateNormalizeOkulSinif(raw) {
    const compact = String(raw ?? '').trim().replace(/\s+/g, '').replace(/-/g, '/').toUpperCase();
    const m = compact.match(OKUL_SINIF_REGEX);
    if (!m) return { ok: false, message: t('err_sinif_select') };
    return { ok: true, value: `${m[1]}/${m[2]}` };
}

function toast(msg, variant = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.setAttribute('data-variant', variant === 'error' ? 'error' : 'info');
    toastEl.style.opacity = '1';
    clearTimeout(toast._t);
    const dur = variant === 'error' ? 6500 : 3400;
    toast._t = setTimeout(() => { toastEl.style.opacity = '0'; }, dur);
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
    } catch (_) {}
    return m || String(err);
}

function humanizeAppwriteError(err) {
    const raw = extractAppwriteMessage(err);
    const lower = raw.toLowerCase();

    if (lower.includes('invalid format') || lower.includes('invalid document structure')) {
        return { titleKey: 'err_validation_title', bodyKey: 'err_validation_body', technical: raw };
    }
    if (lower.includes('unauthorized') || lower.includes('401')) {
        return { titleKey: 'err_auth_title', bodyKey: 'err_auth_body', technical: raw };
    }
    if (lower.includes('network') || lower.includes('fetch')) {
        return { titleKey: 'err_network_title', bodyKey: 'err_network_body', technical: raw };
    }
    return { titleKey: 'err_generic_title', bodyKey: 'err_generic_body', technical: raw };
}

function openErrorModal(summary) {
    if (!errorModal || !errorModalTitle || !errorModalBody) return;
    errorModalTitle.textContent = t(summary.titleKey);
    errorModalBody.textContent = t(summary.bodyKey);
    if (errorModalTechnical) errorModalTechnical.textContent = summary.technical || '';
    errorModal.classList.add('active');
}

function applyRoute(slug) {
    activeRouteSlug = slug;
    ROUTES.forEach((r) => {
        const pane = document.getElementById(r === 'nasil-siparis' ? 'route-nasil-siparis' : `route-${r}`);
        if (pane) r === slug ? pane.classList.remove('hidden') : pane.classList.add('hidden');
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (slug === 'siparislerim') renderOrdersList();
}

function readStoredOrders() {
    try {
        const raw = localStorage.getItem(LS_ORDERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function writeStoredOrders(entries) {
    try { localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(entries)); } catch (e) {}
}

function renderOrdersList() {
    const listRoot = document.getElementById('orders-list');
    const emptyRoot = document.getElementById('orders-empty');
    const entries = readStoredOrders();
    if (!listRoot || !emptyRoot) return;
    listRoot.innerHTML = '';
    if (entries.length === 0) {
        emptyRoot.classList.remove('hidden');
        return;
    }
    emptyRoot.classList.add('hidden');
    entries.forEach((o) => {
        const row = document.createElement('article');
        row.className = 'glass-panel rounded-[2rem] border border-white/5 p-6 flex justify-between items-center';
        row.innerHTML = `
            <div>
                <h3 class="text-white font-semibold">${o.urunAdi}</h3>
                <p class="text-slate-400 text-sm">${o.aliciAdSoyad} · ${o.sinif}</p>
            </div>
            <span class="text-white font-light text-lg">₺${o.katki}</span>`;
        listRoot.appendChild(row);
    });
}

function renderSupportPopoverContent() {
    if (!supportPopover) return;
    supportPopover.innerHTML = `
        <h4 class="font-bold text-white mb-2">${t('support_popover_title')}</h4>
        <p class="text-slate-400 text-xs mb-4">${t('support_prompt')}</p>
        <div class="grid gap-2">
            <a href="https://wa.me/${SUPPORT_PHONE_DIGITS}?text=${encodeURIComponent(t('support_wa_prefill'))}" target="_blank" class="bg-emerald-600 text-white p-2 rounded-lg text-center text-xs font-bold">${t('support_whatsapp')}</a>
            <a href="mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t('support_mail_subject'))}" class="bg-blue-600 text-white p-2 rounded-lg text-center text-xs font-bold">${t('support_gmail')}</a>
        </div>
        <p class="text-slate-500 text-[10px] mt-4">${t('support_no_refund')}</p>`;
}

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(DB_ID, URUNLER_COLLECTION, [Query.orderDesc('$createdAt')]);
        response.documents.forEach((doc) => { productsById[doc.$id] = doc; });
        lastProductsRendered = response.documents;
        renderProducts(response.documents);
    } catch (error) {
        logErr('fetchProducts', 'Fail', error);
    } finally {
        if (smartLoader) smartLoader.style.display = 'none';
    }
}

function renderProducts(products) {
    if (!productsGrid) return;
    if (!products.length) {
        productsGrid.innerHTML = `<p class="col-span-full text-center py-12">${t('catalog_empty')}</p>`;
        return;
    }
    productsGrid.innerHTML = products.map((p) => `
        <article class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${p.resimUrl || ''}" class="w-full h-full object-cover">
                <div class="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full"><span class="text-xs font-bold text-white">₺${p.fiyat}</span></div>
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${p.baslik || p.urunAdi}</h4>
            <button type="button" class="w-full bg-white/10 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold mt-4" onclick="openModal('${p.$id}')">${t('product_reserve')}</button>
        </article>`).join('');
}

if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pId = document.getElementById('selected-product-id').value;
        const pName = document.getElementById('selected-product-name').value;
        const price = document.getElementById('selected-product-price').value;
        const sName = document.getElementById('student-name').value.trim();
        const sSinif = validateNormalizeOkulSinif(document.getElementById('student-sinif').value);

        if (!sSinif.ok || !sName) {
            toast(t('toast_name'), 'error');
            return;
        }

        try {
            if (submitBtn) submitBtn.disabled = true;
            await databases.createDocument(DB_ID, SIPARISLER_COLLECTION, ID.unique(), {
                urunAdi: pName,
                aliciAdSoyad: sName,
                sinif: sSinif.value,
                tarih: new Date().toISOString()
            });

            const orders = readStoredOrders();
            orders.unshift({ urunAdi: pName, aliciAdSoyad: sName, sinif: sSinif.value, katki: Number(price) });
            writeStoredOrders(orders);

            window.closeModal();
            toast(t('toast_ok'));
        } catch (err) {
            openErrorModal(humanizeAppwriteError(err));
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

function getRouteSlugFromLocation() {
    let raw = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
    raw = raw.split('/')[0] || 'anasayfa';
    raw = ROUTE_LEGACY[raw] || raw;
    return ROUTES.includes(raw) ? raw : 'anasayfa';
}

window.addEventListener('hashchange', () => applyRoute(getRouteSlugFromLocation()));
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLangSelectors();
    applyI18n();
    applyRoute(getRouteSlugFromLocation());
    fetchProducts();
});
