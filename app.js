const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('iyilikkoprusu');

const databases = new Databases(client);

const DB_ID = '69efd5b5000e8d71c985';
const URUNLER_COLLECTION = 'urunler';
const SIPARISLER_COLLECTION = 'sipariler';

const productsGrid = document.getElementById('products-grid');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const submitBtn = document.getElementById('submit-btn');

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(DB_ID, URUNLER_COLLECTION, [
            Query.notEqual('durum', 'Satıldı'),
            Query.orderDesc('$createdAt')
        ]);
        console.log("Gelen Veri:", response.documents);
        renderProducts(response.documents);
    } catch (error) {
        console.error("Yükleme Hatası:", error);
    } finally {
        // Loader'ı gizle
        const loader = document.getElementById('smart-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 700);
        }
    }
}

function renderProducts(products) {
    if (!productsGrid) return;
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="col-span-full text-center py-12">Ürün bulunamadı.</p>`;
        return;
    }

    productsGrid.innerHTML = products.map(p => {
        const urunIsmi = p.baslik || p.urunAdi || p.isim || p['baslik'] || 'İsimsiz Oyuncak'; 
        const urunGorsel = p.resimUrl || p.gorsel || p['resimUrl'] || 'https://via.placeholder.com/600';
        const urunFiyat = p.fiyat || 0;

        return `
        <div id="product-${p.$id}" class="glass-panel p-5 rounded-[2rem] border border-white/5 group hover:-translate-y-2 transition-all duration-500">
            <div class="aspect-square bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <img src="${urunGorsel}" alt="${urunIsmi}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700">
                <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <span class="text-xs font-bold text-white">₺${urunFiyat}</span>
                </div>
            </div>
            <h4 class="font-semibold text-white mb-1 px-2 truncate">${urunIsmi}</h4>
            <p class="text-xs text-slate-400 px-2 mb-6 truncate">${p.aciklama || ''}</p>
            <button onclick="openModal('${p.$id}', '${urunIsmi.replace(/'/g, "\\'")}')" class="w-full bg-white/5 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300">
                Ayırt
            </button>
        </div>`;
    }).join('');
}

window.openModal = (productId, productName) => {
    const productIdInput = document.getElementById('selected-product-id');
    const productNameInput = document.getElementById('selected-product-name');
    
    if (productIdInput) productIdInput.value = productId;
    if (productNameInput) productNameInput.value = productName;
    
    if (orderModal) {
        orderModal.classList.add('active');
    }
};

window.closeModal = () => {
    if (orderModal) {
        orderModal.classList.remove('active');
    }
    if (orderForm) {
        orderForm.reset();
    }
};

if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId = document.getElementById('selected-product-id')?.value;
        const productName = document.getElementById('selected-product-name')?.value || "Bilinmeyen";
        const studentName = document.getElementById('student-name')?.value;
        const studentClass = document.getElementById('student-class')?.value;

        if (!productId || !studentName || !studentClass) {
            alert("Lütfen tüm alanları doldurunuz!");
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = "...";
        }

        try {
            await databases.createDocument(DB_ID, SIPARISLER_COLLECTION, ID.unique(), {
                urunAdi: productName,
                aliciAdSoyad: studentName,
                sinif: studentClass,
                tarih: new Date().toISOString()
            });

            await databases.updateDocument(DB_ID, URUNLER_COLLECTION, productId, {
                durum: 'Satıldı'
            });

            closeModal();
            document.getElementById(`product-${productId}`)?.remove();
            alert("Başarılı!");
        } catch (err) {
            console.error("Sipariş Hatası:", err);
            alert("Hata: " + err.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Ayırt ve Bağışla";
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchProducts);
