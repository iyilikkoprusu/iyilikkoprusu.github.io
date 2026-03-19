Kod yedeği-|-|
-|-|-|-|-|-|/
| V1 |
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İyilik Köprüsü | Akşemseddin Hafız İmam Hatip Ortaokulu</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Outfit', sans-serif;
            scroll-behavior: smooth;
            overflow-x: hidden;
        }
        .hero-gradient {
            background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%);
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .nav-link {
            position: relative;
            transition: color 0.3s;
        }
        .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: #fbbf24;
            transition: width 0.3s;
        }
        .nav-link:hover::after {
            width: 100%;
        }
        .lang-btn {
            transition: all 0.3s ease;
        }
        .lang-btn.active {
            background-color: #fbbf24;
            color: #1e3a8a;
            font-weight: bold;
        }
        /* Özel süzülme animasyonu için */
        .float-animation {
            animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">

    <!-- Navigasyon -->
    <nav class="fixed w-full z-50 glass-card shadow-lg transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <div class="flex flex-col items-start leading-tight">
                    <span class="text-xl font-bold text-blue-800 tracking-tight" data-tr="İyilik Köprüsü" data-en="Bridge of Kindness">İyilik Köprüsü</span>
                    <span class="text-[10px] text-slate-500 font-medium uppercase" data-tr="Akşemseddin Hafız İHO" data-en="Akşemseddin Hafiz Secondary School">Akşemseddin Hafız İHO</span>
                </div>
                
                <div class="hidden md:flex space-x-8 text-sm font-semibold items-center">
                    <a href="#ana-sayfa" class="nav-link text-slate-700" data-tr="Ana Sayfa" data-en="Home">Ana Sayfa</a>
                    <a href="#vakif" class="nav-link text-slate-700" data-tr="Vakıf Senedi" data-en="Charter">Vakıf Senedi</a>
                    <a href="#galeri" class="nav-link text-slate-700" data-tr="İyilik Mağazası" data-en="Kindness Shop">İyilik Mağazası</a>
                    <a href="#seffaflik" class="nav-link text-slate-700" data-tr="Şeffaflık" data-en="Transparency">Şeffaflık</a>
                    
                    <div class="flex bg-slate-100 rounded-full p-1 ml-4 border border-slate-200">
                        <button onclick="changeLanguage('tr')" id="btn-tr" class="lang-btn active px-3 py-1 rounded-full text-xs">TR</button>
                        <button onclick="changeLanguage('en')" id="btn-en" class="lang-btn px-3 py-1 rounded-full text-xs">EN</button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Bölümü -->
    <section id="ana-sayfa" class="min-h-screen flex items-center hero-gradient text-white pt-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
            
            <div class="md:w-3/5 space-y-8" data-aos="fade-right">
                <div class="inline-block px-4 py-1 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-200 text-sm font-bold tracking-wider uppercase" data-tr="Bolu'dan Dünyaya Bir Miras" data-en="A Heritage from Bolu to the World">
                    Akşemseddin İHO'dan Dünyaya Bir Miras
                </div>
                <h1 class="text-5xl md:text-7xl font-extrabold leading-tight">
                    <span data-tr="Geçmişin Ruhu," data-en="Spirit of the Past,">Geçmişin Ruhu,</span><br>
                    <span class="text-yellow-400" data-tr="Geleceğin Teknolojisi" data-en="Technology of the Future">Geleceğin Teknolojisi</span>
                </h1>
                <p class="text-xl text-slate-300 max-w-2xl leading-relaxed" data-tr="Akşemseddin Hafız İmam Hatip Ortaokulu öğrencileri olarak, 600 yıllık vakıf geleneğimizi dijital dünya ile birleştiriyoruz." data-en="As students of Akşemseddin Hafız Imam Hatip Secondary School, we combine our 600-year-old endowment tradition with the digital world.">
                    Akşemseddin Hafız İmam Hatip Ortaokulu öğrencileri olarak, 600 yıllık vakıf geleneğimizi dijital dünya ile birleştiriyoruz.
                </p>
                <div class="flex flex-wrap gap-5">
                    <a href="#galeri" class="bg-yellow-400 text-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition shadow-2xl" data-tr="Hemen Keşfet" data-en="Explore Now">Hemen Keşfet</a>
                    <a href="#vakif" class="border-2 border-white/30 backdrop-blur-sm px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition" data-tr="Vakıf Senedimiz" data-en="Our Charter">Vakıf Senedimiz</a>
                </div>
            </div>

            <div class="md:w-2/5" data-aos="fade-left">
                <div class="relative float-animation">
                    <div class="absolute -inset-4 bg-yellow-400/20 rounded-full blur-3xl"></div>
                    <div class="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
                        <div class="bg-white rounded-2xl p-8 text-center">
                            <i class="fas fa-hand-holding-heart text-7xl text-blue-600 mb-6"></i>
                            <h3 class="text-blue-900 font-bold text-2xl mb-2" data-tr="Gönüllü Kumbarası" data-en="Voluntary Bank">Gönüllü Kumbarası</h3>
                            <p class="text-slate-500 text-sm" data-tr="Oyuncaklarınız Gazze'ye ve yetimlere umut oluyor." data-en="Your toys become hope for Gaza and orphans.">Oyuncaklarınız Gazze'ye ve yetimlere umut oluyor.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Sayaç Bölümü (Impact) -->
    <section class="py-16 bg-white border-b relative z-20">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center" data-aos="zoom-in" data-aos-delay="100">
                <div class="text-5xl font-black text-blue-700 mb-2">150+</div>
                <div class="text-slate-500 font-semibold uppercase text-xs tracking-widest" data-tr="Bağışlanan Oyuncak" data-en="Donated Toys">Bağışlanan Oyuncak</div>
            </div>
            <div class="text-center" data-aos="zoom-in" data-aos-delay="200">
                <div class="text-5xl font-black text-green-600 mb-2">₺4.5K</div>
                <div class="text-slate-500 font-semibold uppercase text-xs tracking-widest" data-tr="Gazze Desteği" data-en="Gaza Support">Gazze Desteği</div>
            </div>
            <div class="text-center" data-aos="zoom-in" data-aos-delay="300">
                <div class="text-5xl font-black text-purple-600 mb-2">85kg</div>
                <div class="text-slate-500 font-semibold uppercase text-xs tracking-widest" data-tr="Geri Dönüşüm" data-en="Recycling">Geri Dönüşüm</div>
            </div>
            <div class="text-center" data-aos="zoom-in" data-aos-delay="400">
                <div class="text-5xl font-black text-orange-500 mb-2">100%</div>
                <div class="text-slate-500 font-semibold uppercase text-xs tracking-widest" data-tr="Şeffaflık" data-en="Transparency">Şeffaflık</div>
            </div>
        </div>
    </section>

    <!-- Vakıf Senedi (Akşemseddin Ruhu) -->
    <section id="vakif" class="py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center gap-16">
                <div class="md:w-1/2" data-aos="fade-right">
                    <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800" alt="Vakıf" class="rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
                </div>
                <div class="md:w-1/2 space-y-6" data-aos="fade-left">
                    <h2 class="text-4xl font-bold text-slate-900" data-tr="Akşemseddin'in Vakıf Düsturu" data-en="Akşemseddin's Endowment Principle">Akşemseddin'in Vakıf Düsturu</h2>
                    <div class="w-20 h-1.5 bg-yellow-400 rounded-full"></div>
                    <p class="text-lg text-slate-600 leading-relaxed italic" data-tr="&quot;İnsanın en hayırlısı, insanlara faydalı olanıdır.&quot; düsturuyla, Bolu'muzun manevi önderi Akşemseddin Hazretleri'nin mirasını okulumuzda yaşatıyoruz." data-en="&quot;The best of people are those who are most useful to people.&quot; With this principle, we keep the legacy of Akşemseddin Hazretleri, the spiritual leader of Bolu, alive in our school.">
                        "İnsanın en hayırlısı, insanlara faydalı olanıdır." düsturuyla, Bolu'muzun manevi önderi Akşemseddin Hazretleri'nin mirasını okulumuzda yaşatıyoruz.
                    </p>
                    <div class="space-y-4 pt-4">
                        <div class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div class="bg-blue-100 p-3 rounded-xl text-blue-600"><i class="fas fa-scroll"></i></div>
                            <div>
                                <h4 class="font-bold" data-tr="Dijital Protokol" data-en="Digital Protocol">Dijital Protokol</h4>
                                <p class="text-sm text-slate-500" data-tr="Sitemizin anayasası: %100 bağış odaklı." data-en="The constitution of our site: 100% donation-focused.">Sitemizin anayasası: %100 bağış odaklı.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mağaza / Galeri -->
    <section id="galeri" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-4xl font-bold mb-4" data-tr="İyilik Mağazası" data-en="Kindness Shop">İyilik Mağazası</h2>
                <p class="text-slate-500" data-tr="Her alışveriş, Gazze'deki bir çocuğun yüzünde tebessüme dönüşür." data-en="Every purchase turns into a smile on a child's face in Gaza.">Her alışveriş, Gazze'deki bir çocuğun yüzünde tebessüme dönüşür.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Örnek Kart -->
                <div class="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                    <div class="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center">
                        <i class="fas fa-puzzle-piece text-6xl text-slate-300 group-hover:scale-110 transition duration-500"></i>
                        <div class="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase" data-tr="Yeni" data-en="New">Yeni</div>
                    </div>
                    <div class="p-6">
                        <h4 class="font-bold text-lg mb-2 text-slate-800" data-tr="Zeka Oyunları Seti" data-en="Brain Games Set">Zeka Oyunları Seti</h4>
                        <p class="text-slate-500 text-sm mb-6" data-tr="Eğitici ve geliştirici, temiz durumda." data-en="Educational and developmental, in clean condition.">Eğitici ve geliştirici, temiz durumda.</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-black text-blue-700">₺150</span>
                            <button class="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 shadow-lg flex items-center justify-center"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <!-- Kart 2 -->
                <div class="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                    <div class="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center">
                        <i class="fas fa-car-side text-6xl text-slate-300 group-hover:scale-110 transition duration-500"></i>
                    </div>
                    <div class="p-6">
                        <h4 class="font-bold text-lg mb-2 text-slate-800" data-tr="Uzaktan Kumandalı Araba" data-en="Remote Control Car">Uzaktan Kumandalı Araba</h4>
                        <p class="text-slate-500 text-sm mb-6" data-tr="Hız tutkunları için sağlam bir tercih." data-en="A solid choice for speed enthusiasts.">Hız tutkunları için sağlam bir tercih.</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-black text-blue-700">₺200</span>
                            <button class="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 shadow-lg flex items-center justify-center"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <!-- Kart 3 -->
                <div class="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden" data-aos="fade-up" data-aos-delay="300">
                    <div class="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center">
                        <i class="fas fa-palette text-6xl text-slate-300 group-hover:scale-110 transition duration-500"></i>
                    </div>
                    <div class="p-6">
                        <h4 class="font-bold text-lg mb-2 text-slate-800" data-tr="Sanat ve Boyama Kiti" data-en="Art and Painting Kit">Sanat ve Boyama Kiti</h4>
                        <p class="text-slate-500 text-sm mb-6" data-tr="Hayal gücünü geliştiren set." data-en="A set that improves imagination.">Hayal gücünü geliştiren set.</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-black text-blue-700">₺90</span>
                            <button class="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 shadow-lg flex items-center justify-center"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <!-- Kart 4 -->
                <div class="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden" data-aos="fade-up" data-aos-delay="400">
                    <div class="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center">
                        <i class="fas fa-chess-knight text-6xl text-slate-300 group-hover:scale-110 transition duration-500"></i>
                    </div>
                    <div class="p-6">
                        <h4 class="font-bold text-lg mb-2 text-slate-800" data-tr="Ahşap Satranç Takımı" data-en="Wooden Chess Set">Ahşap Satranç Takımı</h4>
                        <p class="text-slate-500 text-sm mb-6" data-tr="Zihin egzersizi için ideal." data-en="Ideal for mental exercise.">Zihin egzersizi için ideal.</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-black text-blue-700">₺180</span>
                            <button class="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 shadow-lg flex items-center justify-center"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Şeffaflık Raporu -->
    <section id="seffaflik" class="py-24 bg-slate-900 text-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-20 items-center">
                <div data-aos="fade-right">
                    <h2 class="text-4xl font-bold mb-6" data-tr="Emanete Sadakat" data-en="Fidelity to the Trust">Emanete Sadakat</h2>
                    <p class="text-slate-400 mb-8 leading-relaxed" data-tr="Tüm bağışlarımız AFAD ve Kızılay'ın resmi Gazze/Yetim hesaplarına aktarılmaktadır. Okulumuz Akşemseddin Hafız İmam Hatip Ortaokulu güvencesiyle her kuruş takip edilebilir." data-en="All our donations are transferred to the official Gaza/Orphan accounts of AFAD and Red Crescent. Every penny can be tracked under the guarantee of our school, Akşemseddin Hafız Imam Hatip Secondary School.">
                        Tüm bağışlarımız AFAD ve Kızılay'ın resmi Gazze/Yetim hesaplarına aktarılmaktadır. Okulumuz Akşemseddin Hafız İmam Hatip Ortaokulu güvencesiyle her kuruş takip edilebilir.
                    </p>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h5 class="font-bold text-yellow-400 mb-2" data-tr="Açık Raporlama" data-en="Open Reporting">Açık Raporlama</h5>
                            <p class="text-xs text-slate-500" data-tr="Haftalık makbuz paylaşımı." data-en="Weekly receipt sharing.">Haftalık makbuz paylaşımı.</p>
                        </div>
                        <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h5 class="font-bold text-blue-400 mb-2" data-tr="Doğrudan Destek" data-en="Direct Support">Doğrudan Destek</h5>
                            <p class="text-xs text-slate-500" data-tr="Aracı olmadan, tam yardım." data-en="Full help without intermediaries.">Aracı olmadan, tam yardım.</p>
                        </div>
                    </div>
                </div>
                <div class="relative" data-aos="zoom-in">
                    <div class="w-full aspect-square bg-blue-600/20 rounded-full flex items-center justify-center border-4 border-dashed border-white/20">
                        <div class="text-center p-12">
                            <i class="fas fa-qrcode text-8xl mb-4 text-yellow-400"></i>
                            <p class="text-sm font-bold uppercase tracking-tighter" data-tr="Raporları İndir" data-en="Download Reports">Raporları İndir</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white py-12 border-t border-slate-100">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="text-center md:text-left">
                    <h3 class="text-xl font-bold text-blue-900">Akşemseddin Hafız İHO</h3>
                    <p class="text-slate-500 text-sm" data-tr="İyilik Köprüsü - TÜBİTAK 4006 Tasarım Projesi" data-en="Kindness Bridge - TUBITAK 4006 Design Project">İyilik Köprüsü - TÜBİTAK 4006 Tasarım Projesi</p>
                </div>
                <div class="flex space-x-4">
                    <a href="#" class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><i class="fas fa-envelope"></i></a>
                </div>
            </div>
            <div class="mt-12 pt-8 border-t border-slate-50 text-center text-[10px] text-slate-400 uppercase tracking-widest">
                &copy; 2026 Bolu Akşemseddin Hafız İmam Hatip Ortaokulu
            </div>
        </div>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        // Animasyonları başlat
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-back'
        });

        // Dil Değiştirme Fonksiyonu
        function changeLanguage(lang) {
            const trElements = document.querySelectorAll('[data-tr]');
            
            // Butonları aktif et
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('btn-' + lang).classList.add('active');

            trElements.forEach(el => {
                if (lang === 'en') {
                    el.innerText = el.getAttribute('data-en');
                } else {
                    el.innerText = el.getAttribute('data-tr');
                }
            });

            // HTML lang özelliğini güncelle
            document.documentElement.lang = lang;
        }

        // Scroll efektleri
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.classList.add('py-1');
                nav.classList.add('bg-white/95');
            } else {
                nav.classList.remove('py-1');
                nav.classList.remove('bg-white/95');
            }
        });
    </script>
</body>
</html>

---

| V2 |
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İyilik Köprüsü - Akşemseddin Hafız İHO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
        .hero-gradient { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); }
        [v-cloak] { display: none; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">

    <div id="app">
        <!-- Navigation -->
        <nav class="fixed top-0 w-full glass shadow-sm z-50 h-20 border-b border-slate-100">
            <div class="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                <div class="flex items-center gap-3 cursor-pointer" id="nav-home">
                    <img src="pictures/ap_iyilikkoprusu_logo.png" alt="Logo" class="h-12 w-auto" onerror="this.style.display='none'">
                    <div class="flex flex-col">
                        <span class="font-bold text-lg text-blue-900 leading-none">İyilik Köprüsü</span>
                        <span class="text-[10px] text-slate-500 uppercase tracking-tighter">Akşemseddin Hafız İHO</span>
                    </div>
                </div>

                <div class="flex items-center gap-8">
                    <ul class="hidden md:flex gap-6 text-sm font-bold text-slate-600" id="main-menu">
                        <li class="cursor-pointer hover:text-blue-600 transition" onclick="showTab('home')">Ana Sayfa</li>
                        <li class="cursor-pointer hover:text-blue-600 transition" onclick="showTab('catalog')">Katalog</li>
                        <li id="admin-link" class="hidden cursor-pointer text-red-600 font-black transition" onclick="showTab('admin')">YÖNETİM</li>
                    </ul>

                    <div id="auth-section">
                        <!-- Burası JS ile dolacak -->
                        <button onclick="handleLogin()" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2">
                            Google ile Giriş
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="pt-24 pb-20">
            <!-- Home Section -->
            <section id="tab-home" class="tab-content max-w-7xl mx-auto px-6">
                <div class="hero-gradient rounded-[3rem] p-8 md:p-12 text-white mb-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-2xl shadow-blue-200">
                    <div class="z-10 text-center md:text-left">
                        <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight">İyiliğe Atılan <br>Her Adım Bir Köprü.</h1>
                        <p class="text-blue-100 max-w-md mb-8">Akşemseddin'in vakıf ruhunu 2026'nın dijital imkanlarıyla Gazze ve yetimler için birleştiriyoruz.</p>
                        <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button onclick="showTab('catalog')" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-2xl font-black hover:scale-105 transition shadow-lg shadow-yellow-500/20">KATALOĞU GÖR</button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-8 md:mt-0 z-10 w-full md:w-auto" id="stats-container">
                        <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col justify-center">
                            <p class="text-[10px] text-blue-200 uppercase font-bold">Toplam Bağış</p>
                            <p class="text-xl font-black mt-1" id="stat-donation">₺0</p>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col justify-center">
                            <p class="text-[10px] text-blue-200 uppercase font-bold">Gönüllü</p>
                            <p class="text-xl font-black mt-1" id="stat-volunteers">0</p>
                        </div>
                    </div>
                    <img src="pictures/iyilikkoprusu_logo.png" class="absolute -right-20 -bottom-20 opacity-10 w-96 h-auto grayscale brightness-0 invert pointer-events-none" onerror="this.style.display='none'">
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-20">
                    <div class="relative rounded-[2rem] overflow-hidden group h-64 shadow-md">
                        <img src="pictures/picture_1.webp" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Vakıf" onerror="this.src='https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?auto=format&fit=crop&q=80&w=800'">
                        <div class="absolute inset-0 bg-black/40 flex items-end p-8">
                            <h3 class="text-white font-bold text-2xl">Vakıf Senedimiz</h3>
                        </div>
                    </div>
                    <div class="relative rounded-[2rem] overflow-hidden group h-64 shadow-md">
                        <img src="pictures/picture_2.webp" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Miras" onerror="this.src='https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'">
                        <div class="absolute inset-0 bg-black/40 flex items-end p-8">
                            <h3 class="text-white font-bold text-2xl">Akşemseddin Mirası</h3>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Catalog Section -->
            <section id="tab-catalog" class="tab-content hidden max-w-7xl mx-auto px-6">
                <h2 class="text-3xl font-black mb-8 flex items-center gap-3">🎁 Oyuncak Kataloğu</h2>
                <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Ürünler buraya yüklenecek -->
                </div>
            </section>

            <!-- Admin Section -->
            <section id="tab-admin" class="tab-content hidden max-w-7xl mx-auto px-6">
                <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                    <div class="flex justify-between items-center mb-8">
                        <h2 class="text-2xl font-black">⚙️ Yönetim Paneli</h2>
                        <span class="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-bold uppercase">Yönetici Modu</span>
                    </div>
                    <div class="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 class="font-bold mb-4 text-slate-500 uppercase text-xs">Yeni Ürün Kaydı</h3>
                            <div class="space-y-4" id="add-product-form">
                                <input id="p-name" class="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition" placeholder="Ürün Adı">
                                <input id="p-price" class="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition" placeholder="Fiyat (₺)" type="number">
                                <input id="p-image" class="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition" placeholder="Fotoğraf Dosya Adı (Örn: robot.webp)">
                                <button onclick="addProduct()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">Kataloğa Kaydet</button>
                            </div>
                        </div>
                        <div class="border-l border-slate-100 pl-0 md:pl-12">
                            <h3 class="font-bold mb-4 text-slate-500 uppercase text-xs">Gelen Siparişler</h3>
                            <div id="admin-orders" class="space-y-3">
                                <!-- Siparişler buraya yüklenecek -->
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Profile Section -->
            <section id="tab-profile" class="tab-content hidden max-w-2xl mx-auto px-6 text-center">
                <div id="profile-info" class="mb-8"></div>
                <div class="text-left bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 class="font-bold text-lg mb-6 flex items-center gap-2">📜 Sipariş ve Bağış Geçmişim</h3>
                    <div id="user-orders" class="space-y-4"></div>
                </div>
            </section>
        </main>

        <footer class="bg-white border-t border-slate-100 py-12">
            <div class="max-w-7xl mx-auto px-6 text-center">
                <p class="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">Akşemseddin Hafız İmam Hatip Ortaokulu 2026</p>
                <p class="text-slate-300 text-[10px] uppercase">İyilik Köprüsü - TÜBİTAK 4006 Tasarım Projesi</p>
            </div>
        </footer>
    </div>

    <!-- Firebase Scripts -->
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
        import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
        import { getFirestore, doc, onSnapshot, collection, query, where, addDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

        // --- KONFİGÜRASYON ---
        const firebaseConfig = {
            apiKey: "AIzaSyDsFxrU2nEG6pXScBFyARF62GjwLlI_YJI",
            authDomain: "iyilikkoprusu-51686.firebaseapp.com",
            projectId: "iyilikkoprusu-51686",
            storageBucket: "iyilikkoprusu-51686.firebasestorage.app",
            messagingSenderId: "247908360681",
            appId: "1:247908360681:web:0ac7677e85dea46b77ab78",
            measurementId: "G-G2RT5GWYSK"
        };

        const ADMIN_EMAILS = ["admin@aks-iho.com", "proje.ogretmeni@gmail.com"];

        // --- INIT ---
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const provider = new GoogleAuthProvider();

        let currentUser = null;
        let isAdmin = false;

        // --- GLOBAL FUNCTIONS (WINDOW EXPOSE) ---
        window.handleLogin = async () => {
            try { await signInWithPopup(auth, provider); } 
            catch (e) { console.error(e); }
        };

        window.handleLogout = () => signOut(auth);

        window.showTab = (tabId) => {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        };

        window.handleOrder = async (pName, pPrice) => {
            if (!currentUser) return alert("Sipariş için giriş yapmalısınız.");
            try {
                await addDoc(collection(db, "orders"), {
                    userId: currentUser.uid,
                    userName: currentUser.displayName,
                    productName: pName,
                    price: pPrice,
                    status: 'pending',
                    createdAt: serverTimestamp()
                });
                alert("Sipariş alındı! Lütfen ödemeyi okul kumbarasına yapın.");
            } catch (e) { alert("Hata oluştu."); }
        };

        window.addProduct = async () => {
            const name = document.getElementById('p-name').value;
            const price = document.getElementById('p-price').value;
            const img = document.getElementById('p-image').value;
            if(!name || !price) return alert("Eksik bilgi!");
            await addDoc(collection(db, "products"), { name, price: Number(price), imageFileName: img });
            alert("Ürün eklendi.");
        };

        window.updateOrderStatus = async (id, status) => {
            await updateDoc(doc(db, "orders", id), { status });
        };

        // --- AUTH OBSERVER ---
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            const authDiv = document.getElementById('auth-section');
            const adminLink = document.getElementById('admin-link');
            
            if (user) {
                isAdmin = ADMIN_EMAILS.includes(user.email);
                if (isAdmin) adminLink.classList.remove('hidden');
                
                authDiv.innerHTML = `
                    <div class="flex items-center gap-4 border-l pl-4">
                        <div class="text-right hidden sm:block">
                            <p class="text-xs font-bold leading-none">${user.displayName}</p>
                            <p class="text-[10px] text-blue-600 font-medium">${isAdmin ? 'Yönetici' : 'Bağışçı'}</p>
                        </div>
                        <img src="${user.photoURL}" onclick="showTab('profile')" class="w-10 h-10 rounded-full border-2 border-blue-100 cursor-pointer hover:border-blue-500 transition">
                        <button onclick="handleLogout()" class="text-slate-400 hover:text-red-500 transition">Çıkış</button>
                    </div>
                `;
                renderProfile();
                listenUserOrders();
                if(isAdmin) listenAllOrders();
            } else {
                isAdmin = false;
                adminLink.classList.add('hidden');
                authDiv.innerHTML = `<button onclick="handleLogin()" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition">Google ile Giriş</button>`;
            }
        });

        // --- DATA LISTENERS ---
        // Products
        onSnapshot(collection(db, "products"), (snap) => {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = snap.docs.map(doc => {
                const p = doc.data();
                return `
                    <div class="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition">
                        <div class="h-48 rounded-[2rem] bg-slate-100 overflow-hidden mb-4">
                            <img src="pictures/${p.imageFileName}" onerror="this.src='https://via.placeholder.com/300?text=Oyuncak'" class="w-full h-full object-cover">
                        </div>
                        <div class="px-2 flex justify-between items-center">
                            <div>
                                <h3 class="font-bold text-slate-800">${p.name}</h3>
                                <span class="text-xl font-black text-blue-700">₺${p.price}</span>
                            </div>
                            <button onclick="handleOrder('${p.name}', ${p.price})" class="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition">🛒</button>
                        </div>
                    </div>
                `;
            }).join('');
        });

        // Stats
        onSnapshot(doc(db, "settings", "global_stats"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                document.getElementById('stat-donation').innerText = `₺${data.totalDonation || 0}`;
                document.getElementById('stat-volunteers').innerText = data.volunteerCount || 0;
            }
        });

        function listenUserOrders() {
            const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
            onSnapshot(q, (snap) => {
                const container = document.getElementById('user-orders');
                if (snap.empty) {
                    container.innerHTML = `<p class="text-center text-slate-400 italic">Henüz siparişiniz yok.</p>`;
                    return;
                }
                container.innerHTML = snap.docs.map(doc => {
                    const o = doc.data();
                    const statusClass = o.status === 'pending' ? 'text-orange-500 bg-orange-50' : 'text-green-600 bg-green-50';
                    const statusText = o.status === 'pending' ? 'BEKLEMEDE' : 'ALINDI';
                    return `
                        <div class="flex justify-between items-center py-4 border-b border-slate-50">
                            <div>
                                <p class="font-bold text-slate-800">${o.productName}</p>
                                <p class="text-[10px] text-slate-400 uppercase font-bold">${o.createdAt?.toDate().toLocaleDateString() || 'Yeni'}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-sm font-black">₺${o.price}</span>
                                <span class="px-2 py-1 rounded-lg text-[10px] font-bold ${statusClass}">${statusText}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            });
        }

        function listenAllOrders() {
            onSnapshot(collection(db, "orders"), (snap) => {
                const container = document.getElementById('admin-orders');
                container.innerHTML = snap.docs.map(d => {
                    const o = d.data();
                    if(o.status !== 'pending') return '';
                    return `
                        <div class="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                            <div>
                                <p class="font-bold text-sm">${o.productName}</p>
                                <p class="text-[10px] text-slate-400">${o.userName}</p>
                            </div>
                            <button onclick="updateOrderStatus('${d.id}', 'completed')" class="text-green-600 hover:bg-green-100 p-2 rounded-lg transition">✅</button>
                        </div>
                    `;
                }).join('');
            });
        }

        function renderProfile() {
            document.getElementById('profile-info').innerHTML = `
                <img src="${currentUser.photoURL}" class="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-xl mb-4">
                <h2 class="text-2xl font-bold">${currentUser.displayName}</h2>
                <p class="text-slate-500">${currentUser.email}</p>
            `;
        }

    </script>
</body>
</html>

---

| V3 |
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İyilik Köprüsü | Akşemseddin İHO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"></script>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        
        :root { --blue: #1e3a8a; --gold: #fbbf24; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; scroll-behavior: smooth; }
        .serif { font-family: 'Playfair Display', serif; }

        /* Splash Screen */
        #splash-screen {
            position: fixed; inset: 0; background: var(--blue); z-index: 10000;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
        }
        .scribble-path { fill: none; stroke: var(--gold); stroke-width: 3; stroke-linecap: round; }

        /* Custom UI */
        .glass-nav { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
        .section-page { display: none; }
        .section-page.active { display: block; animation: fadeInUp 0.6s ease; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .mobile-menu { transform: translateX(100%); transition: transform 0.3s ease; }
        .mobile-menu.open { transform: translateX(0); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 overflow-x-hidden">

    <!-- AÇILIŞ EKRANI -->
    <div id="splash-screen">
        <svg class="w-64 h-32" viewBox="0 0 200 100">
            <path class="scribble-path" d="M20,50 C40,20 60,80 80,50 C100,20 120,80 140,50 C160,20 180,80 190,50" />
        </svg>
        <h1 id="splash-text" class="text-white text-2xl font-black mt-4 uppercase tracking-[0.3em] opacity-0">İyilik Köprüsü</h1>
    </div>

    <!-- NAVBAR -->
    <nav class="glass-nav fixed top-0 w-full z-50 h-20 border-b border-slate-100 px-4 md:px-8">
        <div class="max-w-7xl mx-auto h-full flex justify-between items-center">
            <a href="#" onclick="showSection('home')" class="flex items-center gap-3">
                <div class="bg-blue-900 p-2 rounded-lg text-white"><i data-lucide="bridge"></i></div>
                <div>
                    <span class="block font-black text-blue-950 leading-none text-sm md:text-base">İyilik Köprüsü</span>
                    <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Dijital Vakıf Sistemi</span>
                </div>
            </a>

            <!-- Desktop Menu -->
            <ul class="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <li><button onclick="showSection('home')" class="nav-link hover:text-blue-600 transition">Ana Sayfa</button></li>
                <li><button onclick="showSection('mission')" class="nav-link hover:text-blue-600 transition">Vakıf Ruhu</button></li>
                <li><button onclick="showSection('catalog')" class="nav-link hover:text-blue-600 transition">Mağaza</button></li>
            </ul>

            <div class="flex items-center gap-4">
                <div id="auth-btns">
                    <button onclick="openLoginModal()" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100">Giriş Yap</button>
                </div>
                <div id="user-info" class="hidden flex items-center gap-3">
                    <img id="user-avatar" class="w-9 h-9 rounded-full border-2 border-white shadow-sm cursor-pointer" onclick="showSection('profile')">
                    <button onclick="appLogout()" class="text-slate-300 hover:text-red-500"><i data-lucide="log-out" class="w-4 h-4"></i></button>
                </div>
                <button class="md:hidden text-slate-600" onclick="toggleMobileMenu()"><i data-lucide="menu"></i></button>
            </div>
        </div>
    </nav>

    <!-- MOBİL MENÜ -->
    <div id="mobile-menu" class="mobile-menu fixed inset-0 bg-white z-[60] p-8 md:hidden">
        <div class="flex justify-between mb-12">
            <span class="font-black text-blue-900">MENÜ</span>
            <button onclick="toggleMobileMenu()"><i data-lucide="x"></i></button>
        </div>
        <ul class="flex flex-col gap-6 text-2xl font-black text-slate-800">
            <li><button onclick="showSection('home'); toggleMobileMenu()">Ana Sayfa</button></li>
            <li><button onclick="showSection('mission'); toggleMobileMenu()">Vakıf Ruhu</button></li>
            <li><button onclick="showSection('catalog'); toggleMobileMenu()">Mağaza</button></li>
            <li><button onclick="showSection('profile'); toggleMobileMenu()">Profilim</button></li>
        </ul>
    </div>

    <!-- MAIN -->
    <main class="pt-24 pb-12 px-4 md:px-8">
        
        <!-- SECTION: HOME -->
        <section id="sec-home" class="section-page active max-w-7xl mx-auto">
            <!-- Hero -->
            <div class="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 shadow-xl border border-slate-100 overflow-hidden relative mb-12">
                <div class="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div data-aos="fade-right">
                        <span class="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase mb-6 tracking-widest border border-blue-100">Tübitak 4006 / 2026</span>
                        <h1 class="serif text-4xl md:text-7xl text-slate-900 leading-[1.1] mb-8">Eski Oyuncağın <br><span class="text-blue-600 italic">Yeni Bir Umut.</span></h1>
                        <p class="text-slate-500 text-base md:text-lg mb-10 max-w-md leading-relaxed">Akşemseddin'in şifacı ve paylaşımcı ruhunu, modern sosyal girişimcilikle birleştirdik. Atıl oyuncaklar Gazze'ye yardıma dönüşüyor.</p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button onclick="showSection('catalog')" class="bg-blue-900 text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">Hemen Bağışla <i data-lucide="heart"></i></button>
                            <button onclick="showSection('mission')" class="bg-slate-100 text-slate-700 px-8 py-5 rounded-2xl font-black">Proje Detayları</button>
                        </div>
                    </div>
                    <div class="flex justify-center" data-aos="zoom-in">
                        <div class="relative">
                            <div class="bg-white p-4 md:p-8 rounded-[3rem] shadow-2xl border-4 border-slate-50 transform rotate-2">
                                <img src="photos/qr_code.png" class="w-40 h-40 md:w-64 md:h-64" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=iyilikkoprusu'">
                            </div>
                            <div class="absolute -top-6 -right-6 bg-yellow-400 p-4 rounded-2xl shadow-lg animate-bounce hidden md:block">
                                <i data-lucide="qr-code" class="text-blue-900"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16" data-aos="fade-up">
                <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
                    <span class="block text-3xl font-black text-blue-600 mb-1">250+</span>
                    <span class="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Bağışlanan Oyuncak</span>
                </div>
                <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
                    <span class="block text-3xl font-black text-green-600 mb-1">₺12K</span>
                    <span class="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Gazze Fonu</span>
                </div>
                <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
                    <span class="block text-3xl font-black text-yellow-600 mb-1">15+</span>
                    <span class="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Gönüllü Ekip</span>
                </div>
                <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
                    <span class="block text-3xl font-black text-red-600 mb-1">100%</span>
                    <span class="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Şeffaf Bağış</span>
                </div>
            </div>

            <!-- Akşemseddin Köşesi -->
            <div class="grid lg:grid-cols-2 gap-12 items-center mb-20 bg-blue-950 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
                <div data-aos="fade-right">
                    <h2 class="serif text-3xl md:text-5xl mb-6 italic text-yellow-400 underline decoration-blue-500">Akşemseddin’in Mirası</h2>
                    <p class="text-blue-100/80 leading-relaxed mb-8">Bolu'nun manevi rehberi Akşemseddin Hazretleri'nin "şifa ve yardımlaşma" felsefesi, bugün dijital bir kodla hayat buluyor. Biz sadece oyuncak satmıyoruz; bir vakıf kültürünü yazılımla geleceğe taşıyoruz.</p>
                    <ul class="space-y-4">
                        <li class="flex items-center gap-4 text-sm font-bold"><i data-lucide="check-circle" class="text-yellow-400"></i> Anonim Bağış Protokolü</li>
                        <li class="flex items-center gap-4 text-sm font-bold"><i data-lucide="check-circle" class="text-yellow-400"></i> İnsan Onurunu Koruyan Ticaret</li>
                        <li class="flex items-center gap-4 text-sm font-bold"><i data-lucide="check-circle" class="text-yellow-400"></i> Yerelden Küresele İyilik Ağı</li>
                    </ul>
                </div>
                <div class="relative" data-aos="fade-left">
                    <div class="aspect-video bg-blue-900/50 rounded-3xl flex items-center justify-center border border-blue-800">
                        <i data-lucide="scroll" class="w-20 h-20 text-blue-700/50"></i>
                        <span class="absolute bottom-4 text-[10px] uppercase font-black tracking-widest text-blue-400">Dijital Vakıf Senedi Algoritması</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: MISSION (VAKIF RUHU) -->
        <section id="sec-mission" class="section-page max-w-4xl mx-auto">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="serif text-4xl italic mb-4">Proje Anayasası</h2>
                <p class="text-slate-500">TÜBİTAK 4006 Teknik Uygulama Süreçleri</p>
            </div>
            <div class="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-slate-100">
                <div class="grid gap-12">
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0"><i data-lucide="recycle"></i></div>
                        <div>
                            <h3 class="text-xl font-black mb-2">1. Aşama: Sıfır Atık Geri Kazanım</h3>
                            <p class="text-slate-500 text-sm leading-relaxed">Okulumuzda kurulan "İyilik Kumbarası" ile toplanan oyuncaklar, teknik ekibimiz tarafından temizlenir ve barkodlanır.</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0"><i data-lucide="code"></i></div>
                        <div>
                            <h3 class="text-xl font-black mb-2">2. Aşama: Dijital Envanter Yönetimi</h3>
                            <p class="text-slate-500 text-sm leading-relaxed">Oyuncaklar bu platforma yüklenir. Firebase Realtime Database ile stoklar anlık olarak yönetilir.</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 flex-shrink-0"><i data-lucide="globe"></i></div>
                        <div>
                            <h3 class="text-xl font-black mb-2">3. Aşama: Sosyal Paylaşım Ekonomisi</h3>
                            <p class="text-slate-500 text-sm leading-relaxed">Elde edilen gelir, Gazze'deki çocuklar ve yerel yetimler için belirlenen yardım fonuna şeffaf bir şekilde aktarılır.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: CATALOG -->
        <section id="sec-catalog" class="section-page max-w-7xl mx-auto">
            <div class="flex justify-between items-end mb-12">
                <h2 class="serif text-4xl italic">Oyuncak Mağazası</h2>
                <span class="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Güncel Stok</span>
            </div>
            <div id="catalog-grid" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Ürünler -->
            </div>
        </section>

        <!-- SECTION: PROFILE -->
        <section id="sec-profile" class="section-page max-w-2xl mx-auto">
            <div id="profile-content" class="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div class="flex flex-col items-center mb-12">
                    <img id="profile-img-large" class="w-32 h-32 rounded-3xl border-4 border-slate-50 shadow-xl mb-6">
                    <h2 id="profile-name" class="serif text-3xl italic">Bağışçı Profili</h2>
                    <p id="profile-email" class="text-slate-400">email@adres.com</p>
                </div>
                <h3 class="font-black text-xs uppercase tracking-widest mb-6 text-slate-400">Bağış Geçmişim</h3>
                <div id="user-orders" class="space-y-4">
                    <!-- Bağışlar -->
                </div>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t border-slate-100 py-16 text-center">
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Akşemseddin Hafız İHO | TÜBİTAK 4006</p>
    </footer>

    <!-- LOGIN MODAL -->
    <div id="login-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] hidden flex items-center justify-center p-4">
        <div id="login-box" class="bg-white w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <button onclick="closeLoginModal()" class="absolute top-6 right-6 text-slate-300 hover:text-red-500"><i data-lucide="x"></i></button>
            
            <div id="auth-forms">
                <div class="text-center mb-8">
                    <h3 class="serif text-2xl italic mb-2" id="auth-title">Hoş Geldiniz</h3>
                    <p class="text-slate-400 text-sm">İyilik dünyasına adım atın.</p>
                </div>

                <!-- Email Login Form -->
                <div id="email-form" class="space-y-4 mb-6">
                    <input type="email" id="input-email" placeholder="E-posta Adresiniz" class="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-600 transition text-sm">
                    <input type="password" id="input-pass" placeholder="Şifreniz" class="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-600 transition text-sm">
                    <div class="flex gap-2">
                        <button id="btn-login" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100">Giriş</button>
                        <button id="btn-register" class="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-200 transition">Kayıt Ol</button>
                    </div>
                </div>

                <div class="flex items-center gap-4 mb-6 opacity-20"><hr class="flex-1"><span>veya</span><hr class="flex-1"></div>

                <button id="btn-google" class="w-full bg-white border border-slate-100 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition shadow-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5"> Google ile Giriş
                </button>
            </div>
        </div>
    </div>

    <!-- SCRIPTS -->
    <script>
        AOS.init({ duration: 800, once: true });
        lucide.createIcons();

        // SPLASH
        window.addEventListener('load', () => {
            const tl = anime.timeline({ easing: 'easeInOutQuart' });
            tl.add({ targets: '.scribble-path', strokeDashoffset: [anime.setDashoffset, 0], duration: 1500, delay: 500 })
              .add({ targets: '#splash-text', opacity: [0, 1], translateY: [10, 0], duration: 800, offset: '-=500' })
              .add({ targets: '#splash-screen', opacity: 0, duration: 800, delay: 1000, complete: () => {
                document.getElementById('splash-screen').style.display = 'none';
              }});
        });

        // NAVIGATION
        window.showSection = (id) => {
            document.querySelectorAll('.section-page').forEach(s => s.classList.remove('active'));
            document.getElementById('sec-' + id).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => AOS.refresh(), 100);
        };

        window.toggleMobileMenu = () => document.getElementById('mobile-menu').classList.toggle('open');

        // MODAL
        window.openLoginModal = () => {
            const m = document.getElementById('login-modal');
            m.classList.remove('hidden');
            setTimeout(() => m.classList.add('opacity-100'), 10);
        };
        window.closeLoginModal = () => {
            const m = document.getElementById('login-modal');
            m.classList.remove('opacity-100');
            setTimeout(() => m.classList.add('hidden'), 300);
        };
    </script>

    <!-- FIREBASE -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, 
                 createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, collection, onSnapshot, addDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // CONFIG (Replace with your actual keys from conf.md)
        const firebaseConfig = {
            apiKey: "API_KEY",
            authDomain: "PROJECT_ID.firebaseapp.com",
            projectId: "PROJECT_ID",
            storageBucket: "PROJECT_ID.appspot.com",
            messagingSenderId: "SENDER_ID",
            appId: "APP_ID"
        };
        
        let app, auth, db, currentUser = null;
        try {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
        } catch(e) { console.warn("Firebase not configured"); }

        if(auth) {
            // Google Login
            document.getElementById('btn-google').onclick = () => {
                signInWithPopup(auth, new GoogleAuthProvider()).then(() => closeLoginModal());
            };

            // Email Login
            document.getElementById('btn-login').onclick = () => {
                const e = document.getElementById('input-email').value;
                const p = document.getElementById('input-pass').value;
                signInWithEmailAndPassword(auth, e, p).then(() => closeLoginModal()).catch(err => alert("Giriş Hatası: " + err.message));
            };

            // Email Register
            document.getElementById('btn-register').onclick = () => {
                const e = document.getElementById('input-email').value;
                const p = document.getElementById('input-pass').value;
                createUserWithEmailAndPassword(auth, e, p).then(() => closeLoginModal()).catch(err => alert("Kayıt Hatası: " + err.message));
            };

            window.appLogout = () => signOut(auth);

            onAuthStateChanged(auth, (user) => {
                currentUser = user;
                const logged = !!user;
                document.getElementById('auth-btns').classList.toggle('hidden', logged);
                document.getElementById('user-info').classList.toggle('hidden', !logged);
                
                if(logged) {
                    const avatar = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=1e3a8a&color=fff`;
                    document.getElementById('user-avatar').src = avatar;
                    document.getElementById('profile-img-large').src = avatar;
                    document.getElementById('profile-email').innerText = user.email;
                    document.getElementById('profile-name').innerText = user.displayName || user.email.split('@')[0];

                    // Bağış Geçmişi
                    onSnapshot(query(collection(db, "orders"), where("userId", "==", user.uid)), (snap) => {
                        const list = document.getElementById('user-orders');
                        if(snap.empty) {
                            list.innerHTML = `<p class="text-slate-300 italic text-center py-8 text-sm">Henüz bir bağış kaydınız yok.</p>`;
                            return;
                        }
                        list.innerHTML = snap.docs.map(doc => {
                            const d = doc.data();
                            return `
                                <div class="p-5 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                                    <span class="font-bold text-slate-700">${d.productName}</span>
                                    <span class="text-blue-600 font-black">₺${d.price}</span>
                                </div>
                            `;
                        }).join('');
                    });
                }
            });

            // Katalog
            onSnapshot(collection(db, "products"), (snap) => {
                const grid = document.getElementById('catalog-grid');
                if(snap.empty) {
                    grid.innerHTML = `<p class="col-span-full py-20 text-center text-slate-400 italic">Ürünler depodan yükleniyor...</p>`;
                    return;
                }
                grid.innerHTML = snap.docs.map((doc, i) => {
                    const p = doc.data();
                    return `
                        <div class="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group" data-aos="fade-up" data-aos-delay="${i*50}">
                            <div class="h-44 bg-slate-100 rounded-[2rem] mb-4 overflow-hidden relative">
                                <img src="${p.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onerror="this.src='https://via.placeholder.com/300?text=Oyuncak'">
                            </div>
                            <h4 class="font-black text-slate-800 mb-4 px-2 truncate">${p.name}</h4>
                            <div class="flex justify-between items-center px-2">
                                <span class="text-xl font-black text-blue-600">₺${p.price}</span>
                                <button onclick="orderProduct('${p.name}', ${p.price})" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Bağışla</button>
                            </div>
                        </div>
                    `;
                }).join('');
                setTimeout(() => { lucide.createIcons(); AOS.refresh(); }, 200);
            });

            window.orderProduct = async (name, price) => {
                if(!currentUser) { openLoginModal(); return; }
                if(confirm(`"${name}" oyuncağını bağışlamayı onaylıyor musunuz?`)) {
                    await addDoc(collection(db, "orders"), {
                        userId: currentUser.uid,
                        productName: name,
                        price: price,
                        createdAt: new Date()
                    });
                    showSection('profile');
                }
            };
        }
    </script>
</body>
</html>

