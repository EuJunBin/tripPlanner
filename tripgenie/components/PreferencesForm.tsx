import React, { useState } from 'react';
import { UserPreferences, Language } from '../types';
import { TRAVEL_STYLES } from '../constants';
import { MapPin, Calendar, Hotel, Globe, ChevronDown, ChevronUp, Plane, Sparkles, Clock, PlaneTakeoff, Info } from 'lucide-react';

interface Props {
  onSubmit: (prefs: UserPreferences) => void;
}

const POPULAR_DESTINATIONS: Record<string, string[]> = {
    // Japan
    'japan': [
        'Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Okinawa', 'Nara', 'Fukuoka', 'Nagoya',
        'Mount Fuji', 'Arashiyama Bamboo Grove', 'Fushimi Inari Shrine', 'Tokyo Tower'
    ],
    
    // China
    'china': [
        'Beijing', 'Shanghai', 'Guangzhou', 'Chengdu', 'Xi\'an', 'Shenzhen', 'Hangzhou', 'Nanjing',
        'Great Wall of China', 'Terracotta Army', 'West Lake', 'The Bund'
    ],

    // USA
    'usa': [
        'New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Hawaii', 'Chicago', 'Miami', 'Boston', 'Orlando',
        'Statue of Liberty', 'Golden Gate Bridge', 'Grand Canyon', 'Times Square', 'Hollywood Sign'
    ],
    'united states': [
        'New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Hawaii', 'Chicago', 'Miami', 'Boston', 'Orlando',
        'Statue of Liberty', 'Golden Gate Bridge', 'Grand Canyon', 'Times Square', 'Hollywood Sign'
    ],

    // Korea
    'korea': [
        'Seoul', 'Busan', 'Jeju Island', 'Incheon', 'Daegu', 'Gyeongju',
        'Gyeongbokgung Palace', 'N Seoul Tower', 'Bukchon Hanok Village'
    ],

    // France
    'france': [
        'Paris', 'Nice', 'Lyon', 'Bordeaux', 'Marseille', 'Versailles', 'Cannes',
        'Eiffel Tower', 'Louvre Museum', 'Mont Saint-Michel'
    ],

    // Italy
    'italy': [
        'Rome', 'Venice', 'Florence', 'Milan', 'Naples', 'Pisa', 'Turin', 'Amalfi Coast',
        'Colosseum', 'Leaning Tower of Pisa', 'Trevi Fountain', 'Vatican City'
    ],

    // UK
    'uk': [
        'London', 'Edinburgh', 'Manchester', 'Liverpool', 'Birmingham', 'Oxford', 'Cambridge',
        'Big Ben', 'Tower Bridge', 'Stonehenge', 'Buckingham Palace'
    ],
    'united kingdom': [
        'London', 'Edinburgh', 'Manchester', 'Liverpool', 'Birmingham', 'Oxford', 'Cambridge',
        'Big Ben', 'Tower Bridge', 'Stonehenge', 'Buckingham Palace'
    ],

    // Thailand
    'thailand': [
        'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi', 'Koh Samui',
        'Wat Arun', 'Phi Phi Islands', 'The Grand Palace'
    ],

    // Spain
    'spain': [
        'Barcelona', 'Madrid', 'Seville', 'Valencia', 'Granada', 'Ibiza',
        'Sagrada Familia', 'Park Güell', 'Alhambra Palace'
    ],

    // Germany
    'germany': [
        'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Dresden',
        'Brandenburg Gate', 'Neuschwanstein Castle', 'Cologne Cathedral'
    ],

    // Australia
    'australia': [
        'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast', 'Adelaide',
        'Sydney Opera House', 'Great Barrier Reef', 'Uluru'
    ],

    // Canada
    'canada': [
        'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Quebec City',
        'Niagara Falls', 'Banff National Park', 'CN Tower'
    ],

    // Malaysia
    'malaysia': [
        'Kuala Lumpur', 'Penang', 'Langkawi', 'Malacca', 'Kota Kinabalu',
        'Petronas Twin Towers', 'Batu Caves', 'George Town Heritage Area'
    ],

    // Singapore
    'singapore': [
        'Marina Bay', 'Sentosa', 'Orchard Road', 'Chinatown',
        'Marina Bay Sands', 'Gardens by the Bay', 'Merlion Park'
    ],

    // Indonesia
    'indonesia': [
        'Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Lombok',
        'Borobudur Temple', 'Uluwatu Temple', 'Mount Bromo'
    ],

    // Vietnam
    'vietnam': [
        'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An', 'Nha Trang',
        'Ha Long Bay', 'Golden Bridge (Ba Na Hills)'
    ],

    // India
    'india': [
        'Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Bangalore', 'Kerala', 'Agra',
        'Taj Mahal', 'Amber Fort', 'Gateway of India'
    ],

    // Turkey
    'turkey': [
        'Istanbul', 'Cappadocia', 'Antalya', 'Ankara', 'Izmir',
        'Hagia Sophia', 'Blue Mosque', 'Pamukkale'
    ],

    // UAE
    'uae': [
        'Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah',
        'Burj Khalifa', 'Sheikh Zayed Grand Mosque', 'Palm Jumeirah'
    ],

    // Switzerland
    'switzerland': [
        'Zurich', 'Geneva', 'Lucerne', 'Interlaken', 'Zermatt',
        'Matterhorn', 'Lake Geneva', 'Jungfraujoch'
    ],

    // Netherlands
    'netherlands': [
        'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht',
        'Zaanse Schans', 'Keukenhof Gardens'
    ],

    // Greece
    'greece': [
        'Athens', 'Santorini', 'Mykonos', 'Crete', 'Thessaloniki',
        'Acropolis', 'Parthenon', 'Oia Village'
    ],

    // Brazil
    'brazil': [
        'Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília',
        'Christ the Redeemer', 'Sugarloaf Mountain', 'Iguazu Falls'
    ],

    // Egypt
    'egypt': [
        'Cairo', 'Luxor', 'Alexandria', 'Giza', 'Aswan',
        'Pyramids of Giza', 'Sphinx', 'Karnak Temple'
    ],

    // South Africa
    'south africa': [
        'Cape Town', 'Johannesburg', 'Durban', 'Pretoria',
        'Table Mountain', 'Kruger National Park', 'Cape of Good Hope'
    ]
};

// UI Translations
const UI_TEXT: Record<Language, any> = {
  'English': {
    subtitle: "Plan your dream trip in 30 seconds.",
    whereLabel: "Where to?",
    wherePlaceholder: "e.g. Japan, France, or New York",
    departLabel: "Depart from?",
    departPlaceholder: "e.g. London, Singapore",
    whenLabel: "When / How long?",
    whenPlaceholder: "e.g. Oct 10 - Oct 15 OR 5 Days",
    advanced: "Advanced Settings (Optional)",
    layoverLabel: "Layover / Stopover",
    layoverPlaceholder: "e.g. 10h stop in Dubai",
    hotelLabel: "Hotel / Accommodation",
    hotelPlaceholder: "e.g. Hilton Osaka",
    styleLabel: "Travel Style",
    constraintsLabel: "Constraints / Special Requests",
    constraintsPlaceholder: "e.g. No spicy food, travelling with elderly...",
    button: "Generate Trip"
  },
  '中文': {
    subtitle: "30秒规划您的梦想之旅。",
    whereLabel: "去哪里？",
    wherePlaceholder: "例如：日本，法国，纽约",
    departLabel: "出发地？",
    departPlaceholder: "例如：上海，北京",
    whenLabel: "时间 / 多久？",
    whenPlaceholder: "例如：10月1日 - 10月7日 或 5天",
    advanced: "高级设置 (可选)",
    layoverLabel: "中转 / 停留",
    layoverPlaceholder: "例如：在迪拜停留10小时",
    hotelLabel: "酒店 / 住宿",
    hotelPlaceholder: "例如：大阪希尔顿",
    styleLabel: "旅行风格",
    constraintsLabel: "限制 / 特殊要求",
    constraintsPlaceholder: "例如：不吃辣，带老人出行...",
    button: "生成行程"
  },
  '日本語': {
    subtitle: "30秒で夢の旅行プランを作成。",
    whereLabel: "どこへ？",
    wherePlaceholder: "例：日本、フランス、ニューヨーク",
    departLabel: "出発地",
    departPlaceholder: "例：東京、大阪",
    whenLabel: "いつ / 期間？",
    whenPlaceholder: "例：10月10日〜10月15日 または 5日間",
    advanced: "詳細設定 (任意)",
    layoverLabel: "乗り継ぎ / 経由",
    layoverPlaceholder: "例：ドバイで10時間待機",
    hotelLabel: "ホテル / 宿泊先",
    hotelPlaceholder: "例：ヒルトン大阪",
    styleLabel: "旅行スタイル",
    constraintsLabel: "制約 / 特別なリクエスト",
    constraintsPlaceholder: "例：辛いものはダメ、高齢者同伴...",
    button: "プランを作成"
  },
  'Hindi': {
    subtitle: "30 सेकंड में अपनी सपनों की यात्रा की योजना बनाएं।",
    whereLabel: "कहाँ जाना है?",
    wherePlaceholder: "जैसे जापान, फ्रांस",
    departLabel: "कहाँ से प्रस्थान?",
    departPlaceholder: "जैसे दिल्ली, मुंबई",
    whenLabel: "कब / कितने समय के लिए?",
    whenPlaceholder: "जैसे 5 दिन",
    advanced: "उन्नत सेटिंग्स (वैकल्पिक)",
    layoverLabel: "लेओवर / पड़ाव",
    layoverPlaceholder: "जैसे दुबई में 8 घंटे",
    hotelLabel: "होटल / आवास",
    hotelPlaceholder: "जैसे हिल्टन",
    styleLabel: "यात्रा शैली",
    constraintsLabel: "विशेष अनुरोध",
    constraintsPlaceholder: "जैसे मसालेदार भोजन नहीं",
    button: "यात्रा बनाएँ"
  },
  'Spanish': {
    subtitle: "Planifica el viaje de tus sueños en 30 segundos.",
    whereLabel: "¿A dónde?",
    wherePlaceholder: "ej. Japón, Francia",
    departLabel: "¿Desde dónde?",
    departPlaceholder: "ej. Madrid, México",
    whenLabel: "¿Cuándo / Cuánto tiempo?",
    whenPlaceholder: "ej. 5 días",
    advanced: "Configuración avanzada (Opcional)",
    layoverLabel: "Escala",
    layoverPlaceholder: "ej. 10h en Dubái",
    hotelLabel: "Hotel / Alojamiento",
    hotelPlaceholder: "ej. Hilton",
    styleLabel: "Estilo de viaje",
    constraintsLabel: "Restricciones",
    constraintsPlaceholder: "ej. Sin comida picante",
    button: "Generar Viaje"
  },
  'Arabic': {
    subtitle: "خطط لرحلة أحلامك في 30 ثانية.",
    whereLabel: "إلى أين؟",
    wherePlaceholder: "مثلاً: اليابان، فرنسا",
    departLabel: "المغادرة من؟",
    departPlaceholder: "مثلاً: الرياض، دبي",
    whenLabel: "متى / المدة؟",
    whenPlaceholder: "مثلاً: 5 أيام",
    advanced: "إعدادات متقدمة (اختياري)",
    layoverLabel: "توقف / ترانزيت",
    layoverPlaceholder: "مثلاً: توقف 8 ساعات في دبي",
    hotelLabel: "فندق / إقامة",
    hotelPlaceholder: "مثلاً: هيلتون",
    styleLabel: "أسلوب السفر",
    constraintsLabel: "قيود / طلبات خاصة",
    constraintsPlaceholder: "مثلاً: لا طعام حار",
    button: "إنشاء رحلة"
  },
  'French': {
    subtitle: "Planifiez votre voyage de rêve en 30 secondes.",
    whereLabel: "Où allez-vous ?",
    wherePlaceholder: "ex. Japon, France",
    departLabel: "Départ de ?",
    departPlaceholder: "ex. Paris, Lyon",
    whenLabel: "Quand / Combien de temps ?",
    whenPlaceholder: "ex. 5 jours",
    advanced: "Paramètres avancés (Facultatif)",
    layoverLabel: "Escale",
    layoverPlaceholder: "ex. 10h à Dubaï",
    hotelLabel: "Hôtel / Hébergement",
    hotelPlaceholder: "ex. Hilton",
    styleLabel: "Style de voyage",
    constraintsLabel: "Contraintes",
    constraintsPlaceholder: "ex. Pas de nourriture épicée",
    button: "Générer le voyage"
  },
  'Portuguese': {
    subtitle: "Planeje a viagem dos seus sonhos em 30 segundos.",
    whereLabel: "Para onde?",
    wherePlaceholder: "ex. Japão, França",
    departLabel: "Partindo de?",
    departPlaceholder: "ex. São Paulo, Lisboa",
    whenLabel: "Quando / Quanto tempo?",
    whenPlaceholder: "ex. 5 dias",
    advanced: "Configurações avançadas (Opcional)",
    layoverLabel: "Escala",
    layoverPlaceholder: "ex. 10h em Dubai",
    hotelLabel: "Hotel / Acomodação",
    hotelPlaceholder: "ex. Hilton",
    styleLabel: "Estilo de viagem",
    constraintsLabel: "Restrições",
    constraintsPlaceholder: "ex. Sem comida picante",
    button: "Gerar Viagem"
  },
  'Russian': {
    subtitle: "Спланируйте путешествие мечты за 30 секунд.",
    whereLabel: "Куда?",
    wherePlaceholder: "например, Япония, Франция",
    departLabel: "Откуда?",
    departPlaceholder: "например, Москва",
    whenLabel: "Когда / Как долго?",
    whenPlaceholder: "например, 5 дней",
    advanced: "Дополнительные настройки",
    layoverLabel: "Пересадка",
    layoverPlaceholder: "например, 10 часов в Дубае",
    hotelLabel: "Отель / Проживание",
    hotelPlaceholder: "например, Хилтон",
    styleLabel: "Стиль путешествия",
    constraintsLabel: "Ограничения",
    constraintsPlaceholder: "например, без острой еды",
    button: "Создать маршрут"
  },
  'Indonesian': {
    subtitle: "Rencanakan perjalanan impian Anda dalam 30 detik.",
    whereLabel: "Mau ke mana?",
    wherePlaceholder: "cth. Jepang, Prancis",
    departLabel: "Berangkat dari?",
    departPlaceholder: "cth. Jakarta, Bali",
    whenLabel: "Kapan / Berapa lama?",
    whenPlaceholder: "cth. 5 hari",
    advanced: "Pengaturan Lanjutan (Opsional)",
    layoverLabel: "Transit",
    layoverPlaceholder: "cth. transit 8 jam di Dubai",
    hotelLabel: "Hotel / Akomodasi",
    hotelPlaceholder: "cth. Hilton",
    styleLabel: "Gaya Perjalanan",
    constraintsLabel: "Batasan / Permintaan Khusus",
    constraintsPlaceholder: "cth. Tidak makan pedas",
    button: "Buat Perjalanan"
  },
  'Korean': {
    subtitle: "30초 만에 꿈의 여행을 계획하세요.",
    whereLabel: "어디로?",
    wherePlaceholder: "예: 일본, 프랑스",
    departLabel: "출발지?",
    departPlaceholder: "예: 서울, 부산",
    whenLabel: "언제 / 기간?",
    whenPlaceholder: "예: 5일",
    advanced: "고급 설정 (선택 사항)",
    layoverLabel: "경유 / 스탑오버",
    layoverPlaceholder: "예: 두바이에서 10시간 체류",
    hotelLabel: "호텔 / 숙소",
    hotelPlaceholder: "예: 힐튼",
    styleLabel: "여행 스타일",
    constraintsLabel: "제약 사항 / 특별 요청",
    constraintsPlaceholder: "예: 매운 음식 못 먹음",
    button: "여행 생성"
  },
  'Thai': {
    subtitle: "วางแผนทริปในฝันของคุณใน 30 วินาที",
    whereLabel: "จะไปที่ไหน?",
    wherePlaceholder: "เช่น ญี่ปุ่น, ฝรั่งเศส",
    departLabel: "เดินทางจาก?",
    departPlaceholder: "เช่น กรุงเทพฯ",
    whenLabel: "เมื่อไหร่ / นานแค่ไหน?",
    whenPlaceholder: "เช่น 5 วัน",
    advanced: "การตั้งค่าขั้นสูง (ไม่บังคับ)",
    layoverLabel: "แวะพัก / เปลี่ยนเครื่อง",
    layoverPlaceholder: "เช่น แวะดูไบ 8 ชม.",
    hotelLabel: "โรงแรม / ที่พัก",
    hotelPlaceholder: "เช่น ฮิลตัน",
    styleLabel: "สไตล์การท่องเที่ยว",
    constraintsLabel: "ข้อจำกัด / คำขอพิเศษ",
    constraintsPlaceholder: "เช่น ไม่กินเผ็ด",
    button: "สร้างทริป"
  }
};

const PreferencesForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserPreferences>({
    destination: '',
    departFrom: '',
    duration: '',
    layover: '',
    hotel: '',
    style: [],
    constraints: '',
    language: 'English',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const t = UI_TEXT[formData.language];

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFormData({ ...formData, destination: val });

      const lowerVal = val.toLowerCase().trim();
      const matchedKey = Object.keys(POPULAR_DESTINATIONS).find(key => key.includes(lowerVal) || lowerVal.includes(key));
      
      if (matchedKey && val.length > 2) {
          setSuggestions(POPULAR_DESTINATIONS[matchedKey]);
      } else {
          setSuggestions([]);
      }
  };

  const applySuggestion = (city: string) => {
      setFormData({ ...formData, destination: `${city}, ${formData.destination}` });
      setSuggestions([]); 
  };

  const handleStyleToggle = (style: string) => {
    setFormData(prev => {
      const styles = prev.style || [];
      if (styles.includes(style)) {
        return { ...prev, style: styles.filter(s => s !== style) };
      }
      return { ...prev, style: [...styles, style] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destination && formData.duration) {
      onSubmit(formData);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto" dir={formData.language === 'Arabic' ? 'rtl' : 'ltr'}>
      <div className="min-h-full flex flex-col items-center justify-center p-4 py-10">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white relative">
            <div className={`absolute top-4 ${formData.language === 'Arabic' ? 'left-4' : 'right-4'}`}>
                <select 
                className="bg-indigo-700 text-white text-sm rounded px-2 py-1 border-none focus:ring-0 cursor-pointer"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value as Language})}
                >
                <option value="English">English</option>
                <option value="中文">中文</option>
                <option value="日本語">日本語</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="Arabic">Arabic</option>
                <option value="French">French</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Russian">Russian</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Korean">Korean</option>
                <option value="Thai">Thai</option>
                </select>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Plane className={`w-8 h-8 ${formData.language === 'Arabic' ? 'transform scale-x-[-1]' : ''}`} /> TripGenie
            </h1>
            <p className="text-indigo-200 mt-2">{t.subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Main Inputs */}
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.whereLabel}</label>
                <div className="relative">
                    <MapPin className={`absolute top-3 text-gray-400 w-5 h-5 ${formData.language === 'Arabic' ? 'right-3' : 'left-3'}`} />
                    <input
                    type="text"
                    required
                    placeholder={t.wherePlaceholder}
                    className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formData.language === 'Arabic' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    value={formData.destination}
                    onChange={handleDestinationChange}
                    />
                </div>
                {suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 animate-fadeIn">
                        <span className="text-xs text-gray-500 w-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Popular picks:
                        </span>
                        {suggestions.map(city => (
                            <button
                                key={city}
                                type="button"
                                onClick={() => applySuggestion(city)}
                                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 border border-indigo-100 transition"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.departLabel}</label>
                    <div className="relative">
                        <PlaneTakeoff className={`absolute top-3 text-gray-400 w-5 h-5 ${formData.language === 'Arabic' ? 'right-3' : 'left-3'}`} />
                        <input
                        type="text"
                        placeholder={t.departPlaceholder}
                        className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formData.language === 'Arabic' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        value={formData.departFrom || ''}
                        onChange={(e) => setFormData({ ...formData, departFrom: e.target.value })}
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.whenLabel}</label>
                    <div className="relative">
                        <Calendar className={`absolute top-3 text-gray-400 w-5 h-5 ${formData.language === 'Arabic' ? 'right-3' : 'left-3'}`} />
                        <input
                        type="text"
                        required
                        placeholder={t.whenPlaceholder}
                        className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${formData.language === 'Arabic' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>
                    </div>
                </div>
            </div>

            {/* Advanced Accordion */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700"
                >
                <span>{t.advanced}</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                    
                    {/* TIP */}
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex gap-2 items-start">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                            Tip: Selecting more options and details may increase the planning time slightly.
                        </p>
                    </div>

                    <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{t.layoverLabel}</label>
                    <div className="relative">
                        <Clock className={`absolute top-2.5 text-gray-400 w-4 h-4 ${formData.language === 'Arabic' ? 'right-3' : 'left-3'}`} />
                        <input
                        type="text"
                        placeholder={t.layoverPlaceholder}
                        className={`w-full py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 ${formData.language === 'Arabic' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                        value={formData.layover || ''}
                        onChange={(e) => setFormData({ ...formData, layover: e.target.value })}
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{t.hotelLabel}</label>
                    <div className="relative">
                        <Hotel className={`absolute top-2.5 text-gray-400 w-4 h-4 ${formData.language === 'Arabic' ? 'right-3' : 'left-3'}`} />
                        <input
                        type="text"
                        placeholder={t.hotelPlaceholder}
                        className={`w-full py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 ${formData.language === 'Arabic' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                        value={formData.hotel || ''}
                        onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                        />
                    </div>
                    </div>

                    {/* MOVED: Constraints now above Style */}
                    <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{t.constraintsLabel}</label>
                    <textarea
                        rows={2}
                        placeholder={t.constraintsPlaceholder}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500"
                        value={formData.constraints || ''}
                        onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    />
                    </div>

                    {/* MOVED: Style is now last */}
                    <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">{t.styleLabel}</label>
                    <div className="flex flex-wrap gap-2">
                        {TRAVEL_STYLES.map(style => (
                        <button
                            key={style}
                            type="button"
                            onClick={() => handleStyleToggle(style)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            formData.style?.includes(style)
                                ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {style}
                        </button>
                        ))}
                    </div>
                    </div>

                </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <Globe className="w-5 h-5" />
                {t.button}
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;