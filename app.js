/**
 * İyilik Köprüsü - Appwrite Bağlantı Dosyası
 * Nyx Labs 2026
 */

// Appwrite Kurulumu
const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Frankfurt sunucusu
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

// SİTEYİ ANINDA AÇ: Yükleyiciyi gizle
if (smartLoader) {
    smartLoader.style.display = 'none';
}

// 1. Ürünleri Appwrite'dan Çek
async function fetchProducts() {
    productsGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 opacity-70">
            <div class="w-8 h-8 border-t-2 border-blue-400 rounded-full animate-spin mb-4"></div>
            <p class="text-sm tracking-[0.2em] uppercase text-blue-300 font-light animate-pulse">Katalog Hazırlanıyor...</p>
        </div>
    `;

    try {
        // Sadece 'Satıldı' olmayanları getir
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
        productsGrid.innerHTML = `<p class="col-span-full text-center text-red-400">Sunucu bağlantısı kurulamadı.</p>`;
    }
}

// 2. Ürünleri Ekrana Çiz (Paneldeki 'baslik' ve 'resimUrl' kullanıldı)
function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="col-span-full text-center text-slate-500 italic font-light py-12">Şu an tüm ürünler tükendi. İlginize teşekkürler!</p>`;
        return;
    }

    productsGrid.innerHTML = products.map(p => {
        // Appwrite panelindeki Attribute Key'ler:
        const urunIsmi = p.baslik || 'İsimsiz Ürün'; 
        const urunGorsel = p.resimUrl || 'https://via.placeholder.com/600x600?text=Gorsel+Yok';
        const urunFiyat = p.fiyat || '0';

        return `
        <div id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${urunGorsel}" 
                     alt="${urunIsmi}" 
                     class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span class="text-xs font-bold text-white">₺${urunFiyat}</span>
                </div>
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${urunIsmi}</h4>
            <p class="text-xs text-slate-400 px-2 mb-6 truncate">${p.aciklama || 'Detaylı bilgi bulunmuyor.'}</p>
            
            <button onclick="openModal('${p.$id}', '${urunIsmi.replace(/'/g, "\\'")}')" 
                    class="w-full bg-white/5 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 hover:border-blue-500">
                Ayırt
            </button>
        </div>
    `}).join('');
}

// 3. Modal İşlemleri
window.openModal = (productId, productName) => {
    document.getElementById('selected-product-id').value = productId;
    // HTML'e eklediğimiz gizli inputa ürün ismini yazıyoruz
    if(document.getElementById('selected-product-name')) {
        document.getElementById('selected-product-name').value = productName;
    }
    orderModal.classList.add('active');
};

window.closeModal = () => {
    orderModal.classList.remove('active');
    orderForm.reset();
};

// 4. Sipariş Gönderimi ve Stok Güncelleme
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('selected-product-id').value;
    const productName = document.getElementById('selected-product-name')?.value || "Bilinmeyen Ürün";
    const studentName = document.getElementById('student-name').value;
    const studentClass = document.getElementById('student-class').value;

    // Yükleniyor durumu
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<div class="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> İşleniyor...`;
    submitBtn.disabled = true;

    try {
        // A. Sipariş Kaydı Oluştur (Panel isimlerine tam uyumlu)
        await databases.createDocument(
            DB_ID,
            SIPARISLER_COLLECTION,
            ID.unique(),
            {
                urun_id: productId,
                urunAdi: productName,       // Panel: urunAdi
                aliciAdSoyad: studentName,  // Panel: aliciAdSoyad
                aliciSinif: studentClass,   // Panel: aliciSinif
                tarih: new Date().toISOString()
            }
        );

        // B. Ürünün Durumunu Güncelle
        await databases.updateDocument(
            DB_ID,
            URUNLER_COLLECTION,
            productId,
            { durum: 'Satıldı' }
        );

        // C. Başarı ve Animasyon
        closeModal();

        const productCard = document.getElementById(`product-${productId}`);
        if (productCard) {
            productCard.classList.add('dissolve-out'); // Buharlaşma efekti
            setTimeout(() => {
                productCard.remove();
                if(productsGrid.children.length === 0) renderProducts([]);
            }, 800);
        }

    } catch (error) {
        console.error("İşlem hatası:", error);
        alert("Üzgünüz, sipariş alınamadı: " + error.message);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Başlangıç
document.addEventListener('DOMContentLoaded', fetchProducts);
