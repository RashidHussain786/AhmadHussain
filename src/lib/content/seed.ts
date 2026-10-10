// ============================================================
//  STARTING DATA — used only the first time, to fill data.json.
//  After that, all changes are made in the admin panel (/admin)
//  and saved in data.json (Vercel Blob in production, .data/ locally).
// ============================================================

import type { Buyer, Category, Content, Item } from "./types";

const buyer = (icon: string, en: string, hi: string): Buyer => ({ icon, name: { en, hi } });

const item = (id: string, en: string, hi: string, photo?: string): Item => ({ id, name: { en, hi }, photo });

const CATEGORIES: Category[] = [
  {
    slug: "shaadi-puja",
    season: { en: "All year · peak in wedding season", hi: "पूरे साल · शादी के मौसम में ज़्यादा" },
    buyers: [
      buyer("👨‍👩‍👧", "Families preparing a wedding", "शादी की तैयारी करने वाले परिवार"),
      buyer("🙏", "Home & temple puja", "घर व मंदिर की पूजा"),
      buyer("🏪", "Shops in nearby towns", "आस-पास के शहरों की दुकानें"),
    ],
    icon: "💍",
    name: { en: "Shaadi & Puja Items", hi: "शादी एवं पूजा सामग्री" },
    description: {
      en: "Paag, mala, sindoor-daani and everything needed for wedding rituals and sindoordaan.",
      hi: "पाग, माला, सिंदूरदानी और शादी व सिंदूरदान की हर रस्म का सामान।",
    },
    image: {
      src: "/photos/categories/shaadi-puja.jpg",
      alt: { en: "Sindoor box held during a wedding ritual", hi: "शादी की रस्म में सिंदूरदानी" },
    },
    allYear: true,
    items: [
      item("paag", "Paag — red, yellow & white", "पाग — लाल, पीला व सफ़ेद"),
      item("makhmali-paag", "Makhmali Paag (velvet & zari)", "मखमली पाग (ज़री वाला)"),
      item("maur", "Maur / Mukut for groom", "मौर / मुकुट"),
      item("jaimala", "Jaimala & Mala", "जयमाला एवं माला", "/photos/items/jaimala.jpg"),
      item("sindoor", "Sindoor", "सिंदूर", "/photos/items/sindoor.jpg"),
      item("sindoor-daani", "Sindoor-daani (sindoor box)", "सिंदूरदानी", "/photos/items/sindoor-daani.jpg"),
      item("kalawa", "Kalawa / Mauli", "कलावा / मौली", "/photos/items/kalawa.jpg"),
      item("chunri", "Chunri", "चुनरी", "/photos/items/chunri.jpg"),
      item("puja-thali", "Puja Thali", "पूजा थाली", "/photos/items/puja-thali.jpg"),
      item("kalash", "Kalash", "कलश", "/photos/items/kalash.jpg"),
    ],
  },
  {
    slug: "fishing",
    season: { en: "All year", hi: "पूरे साल" },
    buyers: [
      buyer("🎣", "Fishermen", "मछुआरे"),
      buyer("🐟", "Pond owners & fish farmers", "पोखर मालिक व मछली पालक"),
      buyer("🏪", "Shops in nearby villages", "आस-पास के गाँवों की दुकानें"),
    ],
    icon: "🎣",
    name: { en: "Fishing Nets & Hooks", hi: "मछली का जाल एवं कांटा" },
    description: {
      en: "Phenka jaal, phansa jaal, hooks and line for ponds and rivers — all sizes.",
      hi: "फेंका जाल, फंसा जाल, कांटा और डोरी — तालाब व नदी के लिए, हर साइज़ में।",
    },
    image: {
      src: "/photos/categories/fishing.jpg",
      alt: { en: "Fisherman throwing a cast net into a river", hi: "नदी में जाल फेंकता मछुआरा" },
    },
    allYear: true,
    items: [
      item("phenka-jaal", "Phenka / Jhaki Jaal (cast net)", "फेंका / झाकी जाल", "/photos/items/phenka-jaal.jpg"),
      item("phansa-jaal", "Phansa Jaal (gill net)", "फंसा जाल", "/photos/items/phansa-jaal.jpg"),
      item("jaal-all-sizes", "Nets in all sizes", "हर साइज़ का जाल", "/photos/items/jaal-all-sizes.jpg"),
      item("kaanta", "Hooks / Kaanta", "कांटा", "/photos/items/kaanta.jpg"),
      item("dori", "Fishing line / Dori", "डोरी", "/photos/items/dori.jpg"),
      item("bansi", "Bansi (fishing rod)", "बंसी", "/photos/items/bansi.jpg"),
    ],
  },
  {
    slug: "durga-puja",
    season: { en: "September – October", hi: "सितंबर – अक्टूबर" },
    buyers: [
      buyer("🎨", "Murti makers (kalakar)", "मूर्तिकार (कलाकार)"),
      buyer("🎪", "Pandal committees", "पंडाल समितियाँ"),
      buyer("🙏", "Home & temple puja", "घर व मंदिर की पूजा"),
    ],
    icon: "🔱",
    name: { en: "Durga Puja Items", hi: "दुर्गा पूजा सामग्री" },
    description: {
      en: "Colours for Maa Durga's face and eyes, kesh, mukut, jewellery and vastra for murti makers and pandals.",
      hi: "माँ दुर्गा के चेहरे व आँखों के रंग, केश, मुकुट, गहने और वस्त्र — मूर्तिकार और पंडालों के लिए।",
    },
    image: {
      src: "/photos/categories/durga-puja.jpg",
      alt: { en: "Decorated Maa Durga murti", hi: "सजी हुई माँ दुर्गा की मूर्ति" },
    },
    dates: ["2026-10-17", "2027-10-06", "2028-09-25", "2029-10-13", "2030-10-03"],
    dateLabel: { en: "Maha Saptami", hi: "महासप्तमी" },
    items: [
      item("murti-colours", "Murti colours (poster & acrylic)", "मूर्ति रंग (पोस्टर व एक्रेलिक)", "/photos/items/murti-colours.jpg"),
      item("face-eye-colours", "Colours for face & eyes", "चेहरे व आँखों के रंग", "/photos/items/face-eye-colours.jpg"),
      item("murti-kesh", "Kesh / Hair", "केश / बाल"),
      item("durga-mukut", "Mukut (crown)", "मुकुट", "/photos/items/durga-mukut.jpg"),
      item("durga-jewellery", "Jewellery & Shringar", "गहने एवं श्रृंगार", "/photos/items/durga-jewellery.jpg"),
      item("durga-saree", "Saree & Vastra", "साड़ी एवं वस्त्र", "/photos/items/durga-saree.jpg"),
      item("chunri", "Chunri", "चुनरी", "/photos/items/chunri.jpg"),
      item("zari-glitter", "Zari, glitter & decoration", "ज़री, चमकी व सजावट", "/photos/items/zari-glitter.jpg"),
    ],
  },
  {
    slug: "muharram",
    season: { en: "May – June (changes every year)", hi: "मई – जून (हर साल बदलता है)" },
    buyers: [
      buyer("🕌", "Tajiya & sipal makers", "ताज़िया व सिपल बनाने वाले"),
      buyer("👥", "Muharram committees", "मुहर्रम कमेटियाँ"),
      buyer("🏪", "Shops in nearby towns", "आस-पास के शहरों की दुकानें"),
    ],
    icon: "🌙",
    name: { en: "Muharram Items", hi: "मुहर्रम का सामान" },
    description: {
      en: "Coloured paper, panni, paper flowers and jhalar for making tajiya and sipal.",
      hi: "ताज़िया और सिपल बनाने के लिए रंगीन कागज़, पन्नी, कागज़ के फूल और झालर।",
    },
    image: {
      src: "/photos/categories/muharram.jpg",
      alt: { en: "Decorated tajiya in a Muharram procession", hi: "मुहर्रम जुलूस में सजा ताज़िया" },
    },
    dates: ["2026-06-26", "2027-06-16", "2028-06-04", "2029-05-25", "2030-05-14"],
    dateLabel: { en: "Ashura (10th Muharram)", hi: "आशूरा (10 मुहर्रम)" },
    items: [
      item("coloured-paper", "Coloured paper", "रंगीन कागज़", "/photos/items/coloured-paper.jpg"),
      item("panni", "Shiny foil paper / Panni", "पन्नी (चमकीला कागज़)", "/photos/items/panni.jpg"),
      item("glitter-paper", "Glitter paper", "चमकी कागज़", "/photos/items/glitter-paper.jpg"),
      item("jaali-paper", "Design-cut / Jaali paper", "जाली कागज़", "/photos/items/jaali-paper.jpg"),
      item("paper-flowers", "Paper flowers", "कागज़ के फूल", "/photos/items/paper-flowers.jpg"),
      item("jhalar", "Jhalar / Frill", "झालर"),
      item("tinsel", "Tinsel & decoration", "सजावट का सामान", "/photos/items/tinsel.jpg"),
    ],
  },
  {
    slug: "janmashtami",
    season: { en: "August – September", hi: "अगस्त – सितंबर" },
    buyers: [
      buyer("🏠", "Homes with Laddu Gopal ji", "लड्डू गोपाल जी वाले घर"),
      buyer("🛕", "Temples", "मंदिर"),
      buyer("🏪", "Shops in nearby towns", "आस-पास के शहरों की दुकानें"),
    ],
    icon: "🦚",
    name: { en: "Janmashtami Items", hi: "जन्माष्टमी का सामान" },
    description: {
      en: "Poshak, jhula, mukut, bansuri and shringar for Laddu Gopal ji.",
      hi: "लड्डू गोपाल जी के लिए पोशाक, झूला, मुकुट, बांसुरी और श्रृंगार।",
    },
    image: {
      src: "/photos/categories/janmashtami.jpg",
      alt: { en: "Decorated Krishna murti", hi: "सजी हुई कृष्ण जी की मूर्ति" },
    },
    dates: ["2026-09-04", "2027-08-25", "2028-08-13", "2029-09-01", "2030-08-21"],
    dateLabel: { en: "Janmashtami", hi: "जन्माष्टमी" },
    items: [
      item("laddu-gopal-poshak", "Laddu Gopal Poshak", "लड्डू गोपाल पोशाक", "/photos/items/laddu-gopal-poshak.jpg"),
      item("jhula", "Jhula / Palna", "झूला / पालना", "/photos/items/jhula.jpg"),
      item("krishna-mukut", "Mukut", "मुकुट", "/photos/items/krishna-mukut.jpg"),
      item("bansuri", "Bansuri", "बांसुरी", "/photos/items/bansuri.jpg"),
      item("singhasan", "Singhasan", "सिंहासन"),
      item("krishna-shringar", "Shringar & Mala", "श्रृंगार एवं माला", "/photos/items/krishna-shringar.jpg"),
      item("mor-pankh", "Mor Pankh", "मोर पंख", "/photos/items/mor-pankh.jpg"),
    ],
  },
  {
    slug: "saraswati-puja",
    season: { en: "January – February", hi: "जनवरी – फ़रवरी" },
    buyers: [
      buyer("🎨", "Murti makers (kalakar)", "मूर्तिकार (कलाकार)"),
      buyer("🏫", "Schools, coaching & student committees", "स्कूल, कोचिंग व छात्र समितियाँ"),
      buyer("🎪", "Pandal committees", "पंडाल समितियाँ"),
    ],
    icon: "🎼",
    name: { en: "Saraswati Puja Items", hi: "सरस्वती पूजा सामग्री" },
    description: {
      en: "Murti colours, kesh, mukut, jewellery, yellow & white vastra and veena for Maa Saraswati.",
      hi: "माँ सरस्वती के लिए मूर्ति रंग, केश, मुकुट, गहने, पीले-सफ़ेद वस्त्र और वीणा।",
    },
    image: {
      src: "/photos/categories/saraswati-puja.jpg",
      alt: { en: "Saraswati murti in a workshop", hi: "कारखाने में माँ सरस्वती की मूर्ति" },
    },
    dates: ["2026-01-23", "2027-02-11", "2028-01-31", "2029-01-19", "2030-02-07"],
    dateLabel: { en: "Vasant Panchami", hi: "वसंत पंचमी" },
    items: [
      item("murti-colours", "Murti colours (poster & acrylic)", "मूर्ति रंग (पोस्टर व एक्रेलिक)", "/photos/items/murti-colours.jpg"),
      item("face-eye-colours", "Colours for face & eyes", "चेहरे व आँखों के रंग", "/photos/items/face-eye-colours.jpg"),
      item("murti-kesh", "Kesh / Hair", "केश / बाल"),
      item("saraswati-mukut-jewellery", "Mukut & Jewellery", "मुकुट एवं गहने", "/photos/items/saraswati-mukut-jewellery.jpg"),
      item("yellow-white-saree", "Yellow & white Saree / Vastra", "पीली व सफ़ेद साड़ी / वस्त्र", "/photos/items/yellow-white-saree.jpg"),
      item("veena", "Veena", "वीणा", "/photos/items/veena.jpg"),
      item("saraswati-decoration", "Decoration items", "सजावट का सामान", "/photos/items/saraswati-decoration.jpg"),
    ],
  },
  {
    slug: "diwali",
    season: { en: "October – November", hi: "अक्टूबर – नवंबर" },
    buyers: [
      buyer("👨‍👩‍👧", "Families", "परिवार"),
      buyer("🏪", "Shops in nearby villages", "आस-पास के गाँवों की दुकानें"),
    ],
    icon: "🪔",
    name: { en: "Diwali Items", hi: "दीपावली का सामान" },
    description: {
      en: "Phuljhadi and small crackers — limited stock, only in the festival season.",
      hi: "फुलझड़ी और छोटे पटाखे — सीमित स्टॉक, सिर्फ़ त्योहार के मौसम में।",
    },
    image: {
      src: "/photos/categories/diwali.jpg",
      alt: { en: "People holding sparklers on Diwali", hi: "दीपावली पर फुलझड़ी" },
    },
    dates: ["2026-11-08", "2027-10-29", "2028-10-17", "2029-11-05", "2030-10-26"],
    dateLabel: { en: "Lakshmi Puja", hi: "लक्ष्मी पूजा" },
    items: [
      item("phuljhadi", "Phuljhadi", "फुलझड़ी", "/photos/items/phuljhadi.jpg"),
      item("anar", "Anar", "अनार", "/photos/items/anar.jpg"),
      item("chakri", "Chakri", "चकरी", "/photos/items/chakri.jpg"),
      item("small-crackers", "Small crackers", "छोटे पटाखे", "/photos/items/small-crackers.jpg"),
    ],
  },
  {
    slug: "vishwakarma-puja",
    season: { en: "September", hi: "सितंबर" },
    buyers: [
      buyer("🚚", "Truck, auto & tractor owners", "ट्रक, ऑटो व ट्रैक्टर मालिक"),
      buyer("🏭", "Factories & workshops", "कारखाने व वर्कशॉप"),
      buyer("🎪", "Puja committees", "पूजा समितियाँ"),
    ],
    icon: "🛠️",
    name: { en: "Vishwakarma Puja Items", hi: "विश्वकर्मा पूजा सामग्री" },
    description: {
      en: "Chunri for Bhagwan Vishwakarma and for decorating vehicles and machines.",
      hi: "भगवान विश्वकर्मा के लिए चुनरी, और गाड़ी व मशीन सजाने के लिए चुनरी।",
    },
    image: {
      src: "/photos/categories/vishwakarma-puja.jpg",
      alt: { en: "Colourfully decorated truck", hi: "रंग-बिरंगा सजा ट्रक" },
    },
    dates: ["2026-09-17", "2027-09-17", "2028-09-16", "2029-09-17", "2030-09-17"],
    dateLabel: { en: "Vishwakarma Puja", hi: "विश्वकर्मा पूजा" },
    items: [
      item("bhagwan-chunri", "Chunri for Bhagwan", "भगवान की चुनरी", "/photos/items/bhagwan-chunri.jpg"),
      item("vehicle-chunri", "Vehicle chunri", "गाड़ी की चुनरी", "/photos/items/vehicle-chunri.jpg"),
      item("machine-chunri", "Machine chunri", "मशीन की चुनरी"),
      item("marigold-mala", "Mala", "माला", "/photos/items/marigold-mala.jpg"),
      item("ribbon", "Ribbon & decoration", "रिबन एवं सजावट", "/photos/items/ribbon.jpg"),
    ],
  },
];

export const SEED_CONTENT: Content = {
  shop: {
    name: { en: "Ahmad Hussain", hi: "अहमद हुसैन" },
    tagline: {
      en: "Shaadi, Puja & Festival Items — Wholesale & Retail",
      hi: "शादी, पूजा एवं त्योहार का सामान — थोक एवं खुदरा",
    },
    phone: "+91 88776 99552",
    whatsapp: "918877699552",
    address: {
      en: "Main Bazar, Dalsinghsarai, Samastipur, Bihar 848114, India",
      hi: "मेन बाज़ार, दलसिंहसराय, समस्तीपुर, बिहार 848114, भारत",
    },
    hours: {
      en: "Every day · 8:00 AM – 9:00 PM",
      hi: "रोज़ · सुबह 8:00 – रात 9:00",
    },
    mapQuery: "Main Bazar, Dalsinghsarai, Samastipur, Bihar 848114",
  },
  categories: CATEGORIES,
};
