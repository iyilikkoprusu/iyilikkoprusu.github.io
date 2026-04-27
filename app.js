// Appwrite Kurulumu
const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Frankfurt sunucusu için 'fra' eklendi
    .setProject('iyilikkoprusu');

const databases = new Databases(client);

// Veritabanı ve Tablo ID'leri
const DB_ID = '69efd5b5000e8d71c985';
const URUNLER_COLLECTION = 'urunler';
const SIPARISLER_COLLECTION = 'sipariler';

// DOM Elementleri
const productsGrid = document.getElementById('products-grid');
const smartLoader = document.getElementById('smart-loader');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const submitBtn = document.getElementById('submit-btn');

// SİTEYİ ANINDA AÇ
if (smartLoader) {
    smartLoader.style.display = 'none';
}

// 1. Ürünleri Çek
async function fetchProducts() {
    productsGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 opacity-70">
            <div class="w-8 h-8 border-t-2 border-blue-400 rounded-full animate-spin mb-4"></div>
            <p class="text-sm tracking-[0.2em] uppercase text-blue-300 font-light animate-pulse">Katalog Yükleniyor...</p>
        </div>
    `;

    try {
        const response = await databases.listDocuments(
            DB_ID,
            URUNLER_COLLECTION,[
                Query.notEqual('durum', 'Satıldı'),
                Query.orderDesc('$createdAt')
            ]
        );
        renderProducts(response.documents);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        productsGrid.innerHTML = `<p class="col-span-full text-center text-red-400">Veriler yüklenirken bir hata oluştu.</p>`;
    }
}

// 2. Ürünleri Ekrana Çiz
function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="col-span-full text-center text-slate-500 italic font-light">Şu an için tüm oyuncaklarımız yeni sahiplerini buldu.</p>`;
        return;
    }

    productsGrid.innerHTML = products.map(p => `
        <div id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${p.gorsel || 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=600&auto=format&fit=crop'}" 
                     alt="${p.isim}" 
                     class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span class="text-xs font-bold text-white">₺${p.fiyat}</span>
                </div>
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${p.isim || 'İsimsiz Oyuncak'}</h4>
            <p class="text-xs text-slate-400 px-2 mb-6 truncate">${p.aciklama || 'Açıklama bulunmuyor.'}</p>
            
            <button onclick="openModal('${p.$id}', '${p.isim.replace(/'/g, "\\'")}')" class="w-full bg-white/5 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 hover:border-blue-500">
                Ayırt
            </button>
        </div>
    `).join('');
}

// 3. Modal İşlemleri
window.openModal = (productId, productName) => {
    document.getElementById('selected-product-id').value = productId;
    // Ürün adını da bir hidden input'ta veya değişkende saklayalım (Formda varsa oraya yaz)
    document.getElementById('selected-product-name').value = productName;
    orderModal.classList.add('active');
};

window.closeModal = () => {
    orderModal.classList.remove('active');
    orderForm.reset();
};

// 4. Sipariş ve Stok Mantığı
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('selected-product-id').value;
    const productName = document.getElementById('selected-product-name').value;
    const studentName = document.getElementById('student-name').value;
    const studentClass = document.getElementById('student-class').value;

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<div class="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> İşleniyor...`;
    submitBtn.disabled = true;

    try {
        // A. Siparişler tablosuna kayıt ekle (PANELDEKİ İSİMLERLE EŞLEŞTİRDİK)
        await databases.createDocument(
            DB_ID,
            SIPARISLER_COLLECTION,
            ID.unique(),
            {
                urun_id: productId,
                urunAdi: productName,       // Paneldeki "urunAdi"
                aliciAdSoyad: studentName,  // Paneldeki "aliciAdSoyad"
                aliciSinif: studentClass,   // Paneldeki "aliciSinif"
                tarih: new Date().toISOString()
            }
        );

        // B. Ürünler tablosunda durumu 'Satıldı' yap
        await databases.updateDocument(
            DB_ID,
            URUNLER_COLLECTION,
            productId,
            { durum: 'Satıldı' }
        );

        closeModal();

        // C. Dissolve efekti
        const productCard = document.getElementById(`product-${productId}`);
        if (productCard) {
            productCard.classList.add('dissolve-out');
            setTimeout(() => {
                productCard.remove();
                if(productsGrid.children.length === 0) {
                    renderProducts([]);
                }
            }, 800);
        }

    } catch (error) {
        console.error("Sipariş hatası:", error);
        alert("Sipariş alınamadı: " + error.message);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
