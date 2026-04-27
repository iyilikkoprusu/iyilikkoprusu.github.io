async function siparisOlustur(urunId, urunAdi, urunFiyati) {
    // Kullanıcıya ismini ve sınıfını soralım (Şimdilik basit bir prompt ile)
    const adSoyad = prompt(`${urunAdi} için isminiz:`);
    const sinif = prompt("Sınıfınız:");

    if (!adSoyad || !sinif) return alert("Lütfen bilgileri eksiksiz girin!");

    try {
        // Appwrite Siparişler tablosuna otomatik yazıyoruz
        await databases.createDocument(
            'DATABASE_ID', 
            'SIPARISLER_TABLE_ID', // Yeni oluşturduğun siparişler tablosunun ID'si
            'unique()', // Otomatik ID oluştur
            {
                "urun_adi": urunAdi,
                "fiyat": urunFiyati,
                "alici_ad_soyad": adSoyad,
                "sinif": sinif,
                "durum": "Ödeme Bekliyor",
                "tarih": new Date().toISOString()
            }
        );
        alert(`Harika! ${urunAdi} siparişin alındı. Tenefüste görüşürüz!`);
    } catch (error) {
        console.error("Sipariş hatası:", error);
    }
}import { Client, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Ekrandaki Endpoint
    .setProject('iyilikkoprusu'); // Senin Project ID'n

const databases = new Databases(client);

export { client, databases, ID };
