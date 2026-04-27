async function oyuncakAyirt(urunId, urunAdi, fiyat) {
    const isim = prompt("Adın Soyadın:");
    const sinif = prompt("Sınıfın (Örn: 8-C):");

    if(!isim || !sinif) return alert("Hoppala! Bilgileri girmeden iyilik köprüsü kurulmaz.");

    try {
        // 1. ADIM: Siparişi oluştur
        await databases.createDocument('DATABASE_ID', 'SIPARISLER_ID', 'unique()', {
            "urun_adi": urunAdi,
            "alici_ad_soyad": isim,
            "sinif": sinif,
            "fiyat": fiyat,
            "durum": "Ödeme Bekliyor" // Varsayılan durum
        });

        // 2. ADIM: Ürünü 'Satıldı' olarak işaretle (Kimse bir daha almasın)
        await databases.updateDocument('DATABASE_ID', 'URUNLER_ID', urunId, {
            "durum": "Satıldı" 
        });

        alert(`Tamamdır ${isim}! Oyuncağı senin için ayırdım. Teneffüste parayı getir, oyuncağını al. Gazze'deki kardeşlerimize selam olsun!`);
        location.reload(); // Sayfayı yenile ki ürün 'Satıldı' görünsün
    } catch (error) {
        alert("Bir hata oluştu, ID'leri kontrol et kral!");
    }
}
