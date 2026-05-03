const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('iyilikkoprusu');

const databases = new Databases(client);

const DB_ID = '69efd5b5000e8d71c985';
const URUNLER_COLLECTION = 'urunler';
const SIPARISLER_COLLECTION = 'sipariler';

const LS_ORDERS_KEY = 'iyilikkoprusu_orders_v1';

/** Okul sınıfı: sınıf numarası (1–12) + / veya - + şube (örn. 8/A, 10-C) */
const OKUL_SINIF_REGEX = /^([1-9]|1[0-2])[/\-]([A-Za-zÇçĞğİıÖöŞşÜü0-9]{1,4})$/u;

const ROUTES = ['anasayfa', 'vakif', 'nasil-siparis', 'magaza', 'siparislerim'];

const ROUTE_LEGACY = {
    hero: 'anasayfa',
    catalog: 'magaza',
    mission: 'vakif',
};

/** Sunucudan çekilmiş ürünlerin $id ile hızlı erişimi */
const productsById = {};

let activeRouteSlug = '';

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

/**
 * Sınıf / şube metnini doğrular ve Appwrite + yerel liste için tek biçimde döndürür.
 * @returns {{ ok: true, value: string } | { ok: false, message: string }}
 */
function validateNormalizeOkulSinif(raw) {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) {
        return {
            ok: false,
            message: 'Sınıf / şube alanı boş bırakılamaz (örn. 8/A).',
        };
    }
    const compact = trimmed.replace(/\s+/g, '');
    const m = compact.match(OKUL_SINIF_REGEX);
    if (!m) {
        return {
            ok: false,
            message:
                'Sınıfı okul formatında yaz: örn. 8/A, 9-B veya 10/C (sınıf numarası, ardından / veya -, şube).',
        };
    }
    const grade = m[1];
    const branch = m[2].toLocaleUpperCase('tr-TR');
    const value = `${grade}/${branch}`;
    return { ok: true, value };
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
        /* yok say */
    }
    return m || String(err);
}

function humanizeAppwriteError(err) {
    const raw = extractAppwriteMessage(err);
    const lower = raw.toLowerCase();

    if (isLikelySinifSchemaRejection(raw, lower)) {
        return {
            title: 'Veritabanı: sinif alanı güncellenmeli',
            body:
                'Sunucu sınıf bilgisini (örn. 8/A) kabul etmedi; büyük olasılıkla Appwrite’da `sinif` hâlâ eski enum (standard / express / premium) ile kısıtlı. Lütfen veritabanı panelinden `sinif` attribute kısıtlamasını güncelleyin: koleksiyonda bu alanı metin (string) ve okul sınıfına uygun serbest girişe izin verecek şekilde düzenleyin. Ardından formu yeniden deneyin.',
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
            title: 'Kayıt doğrulanamadı',
            body:
                'Sunucu gönderilen bilgilerden birini beklenen biçimde bulamadı. Formdaki alanları kontrol et; devam ederse proje öğretmenine veya Appwrite şemasından sorumlu arkadaşına haber ver.',
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
            title: 'Yetki uyarısı',
            body: 'Bu işlem için gereken izinler eksik görünüyor. Projede anonim oturum veya koleksiyon izinleri Appwrite konsolundan kontrol edilmeli.',
            technical: raw,
            kind: 'auth',
        };
    }

    if (
        lower.includes('network') ||
        lower.includes('failed to fetch')
    ) {
        return {
            title: 'Bağlantı sorunu',
            body: 'Ağ üzerinden Appwrite’a ulaşılamadı. Bağlantını kontrol et ve yeniden dene.',
            technical: raw,
            kind: 'network',
        };
    }

    return {
        title: 'İşlem tamamlanamadı',
        body:
            raw.length && raw.length < 220
                ? raw
                : 'Sunucudan beklenmeyen bir yanıt geldi. Konsolu açıp teknik mesajı inceleyebilir veya bir süre sonra tekrar deneyebilirsin.',
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
    errorModalTitle.textContent = summary.title;
    errorModalBody.textContent = summary.body;
    if (errorModalTechnical) {
        errorModalTechnical.textContent = summary.technical || '';
    }
    errorModal.classList.add('active');
    errorModal.setAttribute('aria-hidden', 'false');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/** Yerel sipariş satırında gösterilecek sınıf metni (yeni + eski kayıtlar) */
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

/** @returns {HTMLElement | null} */
function routePane(slug) {
    const id = slug === 'nasil-siparis'
        ? 'route-nasil-siparis'
        : `route-${slug}`;
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
    } catch {
        return [];
    }
}

function writeStoredOrders(entries) {
    localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(entries));
}

function pushStoredOrder(entry) {
    const list = readStoredOrders();
    list.unshift(entry);
    writeStoredOrders(list);
}

function formatTrDate(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
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

        row.innerHTML = `
            <div class="space-y-1 min-w-0">
                <h3 class="text-white font-semibold truncate">${escapeHtml(o.urunAdi || 'Oyuncak')}</h3>
                <p class="text-slate-400 text-sm font-light">
                    <span class="text-slate-300">${escapeHtml(o.aliciAdSoyad || '')}</span>${sinifMetni ? `${o.aliciAdSoyad ? ' · ' : ''}<span class="text-blue-300/90">Sınıf ${escapeHtml(sinifMetni)}</span>` : ''}
                </p>
                ${o.ref ? `<p class="text-[10px] uppercase tracking-[0.2em] text-slate-600">Kayıt: ${escapeHtml(o.ref)}</p>` : ''}
            </div>
            <div class="shrink-0 flex flex-col items-start md:items-end gap-1 text-sm">
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500">Kermes katkı payı</span>
                <span class="text-white font-light text-lg">${escapeHtml(katki)}</span>
                <span class="text-slate-500 text-xs">${escapeHtml(formatTrDate(o.tarihISO || ''))}</span>
            </div>`;
        listRoot.appendChild(row);
    });
}

window.openModal = (productId) => {
    const p = productsById[productId];
    const productIdInput = document.getElementById('selected-product-id');
    const productNameInput = document.getElementById('selected-product-name');
    const productPriceInput = document.getElementById('selected-product-price');
    const caption = document.getElementById('modal-product-caption');

    const name = p
        ? p.baslik || p.urunAdi || p.isim || 'İsimsiz oyuncak'
        : 'Ürün';
    const price = p && p.fiyat != null ? Number(p.fiyat) : '';

    if (productIdInput) productIdInput.value = productId;
    if (productNameInput) productNameInput.value = name;
    if (productPriceInput) productPriceInput.value =
        typeof price === 'number' && !Number.isNaN(price) ? String(price) : '';

    if (caption) {
        const priceTxt =
            typeof price === 'number' && !Number.isNaN(price)
                ? `Kermes katkı payı: ₺${price}`
                : 'Katkı payı ürün kartında yazar.';
        caption.textContent = `${name} — ${priceTxt}`;
    }

    if (orderModal) orderModal.classList.add('active');
};

window.closeModal = () => {
    if (orderModal) orderModal.classList.remove('active');
    if (orderForm) orderForm.reset();
};

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
            Query.notEqual('durum', 'Satıldı'),
            Query.orderDesc('$createdAt'),
        ]);

        response.documents.forEach((doc) => {
            productsById[doc.$id] = doc;
        });
        console.log('Gelen ürünler:', response.documents);
        renderProducts(response.documents);
    } catch (error) {
        console.error('Yükleme hatası:', error);
        if (productsGrid) {
            productsGrid.innerHTML =
                '<p class="col-span-full text-center py-12 text-red-300/90 text-sm">Ürün listesi şu anda yüklenemedi. Ağ bağlantını ve Appwrite izin ayarlarını kontrol et.</p>';
        }
        const h = humanizeAppwriteError(error);
        toast(`Ürünler yüklenemedi — ${h.body.slice(0, 120)}${h.body.length > 120 ? '…' : ''}`, 'error');
    } finally {
        hideSmartLoaderSoon();
    }
}

function renderProducts(products) {
    if (!productsGrid) return;
    if (products.length === 0) {
        productsGrid.innerHTML =
            '<p class="col-span-full text-center py-12 text-slate-400 font-light">Satışta oyuncak yok veya liste henüz boş.</p>';
        return;
    }

    productsGrid.innerHTML = products
        .map((p) => {
            const urunIsmi =
                p.baslik ||
                p.urunAdi ||
                p.isim ||
                p.baslik ||
                'İsimsiz Oyuncak';
            const safeName = escapeHtml(urunIsmi);
            const urunGorsel =
                p.resimUrl || p.gorsel || p.resimUrl || 'https://via.placeholder.com/600';
            const urunFiyat = p.fiyat != null ? p.fiyat : 0;

            return `
        <article id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${escapeHtml(urunGorsel)}" alt="${safeName}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" loading="lazy" decoding="async">
                <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <span class="text-xs font-bold text-white">₺${escapeHtml(String(urunFiyat))}</span>
                </div>
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${safeName}</h4>
            <p class="text-xs text-slate-400 px-2 mb-6 line-clamp-2 min-h-[2.5rem]">${escapeHtml(p.aciklama || '')}</p>
            <button type="button"
                class="reserve-btn w-full bg-white/5 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                data-product-id="${escapeHtml(p.$id)}">
                Ayır
            </button>
        </article>`;
        })
        .join('');
}

if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-product-id]');
        if (!btn || !productsGrid.contains(btn)) return;
        const id = btn.getAttribute('data-product-id');
        if (!id || !productsById[id]) return;
        window.openModal(id);
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

if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId =
            document.getElementById('selected-product-id')?.value ?? '';
        const productName =
            document.getElementById('selected-product-name')?.value ||
            'Bilinmiyor';
        const priceRaw =
            document.getElementById('selected-product-price')?.value ?? '';
        const studentName =
            document.getElementById('student-name')?.value?.trim() || '';
        const sinifRaw =
            document.getElementById('student-sinif')?.value ?? '';
        const sinifCheck = validateNormalizeOkulSinif(sinifRaw);
        if (!sinifCheck.ok) {
            toast(sinifCheck.message, 'error');
            return;
        }
        const sinifValue = sinifCheck.value;

        if (!productId || !studentName) {
            toast('Ad ve soyadını yazmalısın.', 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span>Gönderiliyor...</span>';
        }

        const iso = new Date().toISOString();

        try {
            const katkiParsed = priceRaw !== '' ? Number(priceRaw) : null;

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

            await databases.updateDocument(DB_ID, URUNLER_COLLECTION, productId, {
                durum: 'Satıldı',
            });

            delete productsById[productId];

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

            toast(
                'Kaydın alındı. Katkı payını proje ekibinin duyurusuna göre sınıfta teslim etmeyi unutma.',
            );
            if (activeRouteSlug === 'siparislerim') {
                renderOrdersList();
            }
        } catch (err) {
            console.error('Sipariş hatası:', err);
            const summary = humanizeAppwriteError(err);
            toast(summary.title + ' — ayrıntılar için pencereye bak.', 'error');
            openErrorModal(summary);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML =
                    '<span>Ayır ve onayla</span><i data-lucide="arrow-right" class="w-4 h-4"></i>';
                lucide.createIcons();
            }
        }
    });
}

function onRouteChange() {
    applyRoute(getRouteSlugFromLocation());
}

window.addEventListener('hashchange', onRouteChange);

document.addEventListener('DOMContentLoaded', () => {
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
    });

    onRouteChange();
    renderOrdersList();
    fetchProducts();
});

window.navigateTo = navigateTo;
window.getActiveRouteSlug = () => activeRouteSlug;
