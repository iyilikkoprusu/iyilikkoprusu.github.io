// Appwrite Kurulumu
const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('iyilikkoprusu');

const databases = new Databases(client);

// Veritabanı Bilgileri (Birebir senin panelin)
const DB_ID = '69efd5b5000e8d71c985';
const URUNLER_COLLECTION = 'urunler';
const SIPARISLER_COLLECTION = 'sipariler'; // Senin dediğin gibi: sipariler

const productsGrid = document.getElementById('products-grid');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const submitBtn = document.getElementById('submit-btn');

// 1. Ürünleri Çek
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            DB_ID,
            URUNLER_COLLECTION, [
                Query.notEqual('durum', 'Satıldı'),
                Query.orderDesc('$createdAt')
            ]
        );
        renderProducts(response.documents);
    } catch (error) {
        console.error("Hata:", error);
    }
}

// 2. Ürünleri Çiz (Sütun isimleri: baslik, resimUrl)
function renderProducts(products) {
    if (!productsGrid) return;
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="col-span-full text-center text-slate-500 py-12 italic font-light">Katalog şu an boş.</p>`;
        return;
    }

    productsGrid.innerHTML = products.map(p => {
        // Appwrite'daki gerçek sütun isimlerin:
        const urunIsmi = p.baslik || 'İsimsiz Ürün'; 
        const urunGorsel = p.resimUrl || 'https://via.placeholder.com/600';
        const urunFiyat = p.fiyat || '0';

        return `
        <div id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${urunGorsel}" alt="${urunIsmi}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700">
                <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <span class="text-xs font-bold text-white">₺${urunFiyat}</span>
                </div>
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${urunIsmi}</h4>
            <p class="text-xs text-slate-400 px-2 mb-6 truncate">${p.aciklama || 'Bilgi yok.'}</p>
            <button onclick="openModal('${p.$id}', '${urunIsmi.replace(/'/g, "\\'")}')" class="w-full bg-white/5 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase transition-all">
                Ayırt
            </button>
        </div>`;
    }).join('');
}

// 3. Modal İşlemleri
window.openModal = (productId, productName) => {
    document.getElementById('selected-product-id').value = productId;
    const nameInput = document.getElementById('selected-product-name');
    if (nameInput) nameInput.value = productName;
    orderModal.classList.add('active');
};

window.closeModal = () => {
    orderModal.classList.remove('active');
    orderForm.reset();
};

// 4. Sipariş Gönder (Sütun isimleri: urunAdi, aliciAdSoyad, sinif)
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('selected-product-id').value;
    const productName = document.getElementById('selected-product-name')?.value || "Ürün";
    const studentName = document.getElementById('student-name').value;
    const studentClass = document.getElementById('student-class').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = "İşleniyor...";

    try {
        // A. Sipariş Kaydı (Senin sipariler tablonun sütunlarına göre)
        await databases.createDocument(
            DB_ID,
            SIPARISLER_COLLECTION,
            ID.unique(),
            {
                urunAdi: productName,       // Tablo: urunAdi
                aliciAdSoyad: studentName,  // Tablo: aliciAdSoyad
                sinif: studentClass,        // Tablo: sinif
                tarih: new Date().toISOString()
            }
        );

        // B. Ürün Durumu Güncelle
        await databases.updateDocument(
            DB_ID,
            URUNLER_COLLECTION,
            productId,
            { durum: 'Satıldı' }
        );

        closeModal();
        const card = document.getElementById(`product-${productId}`);
        if (card) card.style.display = 'none';

    } catch (error) {
        console.error("Hata:", error);
        alert("Sipariş alınamadı: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Ayırt ve Bağışla";
    }
});

document.addEventListener('DOMContentLoaded', fetchProducts);
