// Language card data — 9 priority allergens × 8 languages
// Phrases and names should be verified by native speakers before production use.

export type AllergenCard = {
  code: string
  englishName: string
  severity: 'ana' | 'var' | 'add'
  localName: string
  romanization?: string        // pronunciation guide for non-Latin scripts
  phrase: string               // "I am allergic to X"
  phraseRomanization?: string
  hiddenNames: string[]        // how it appears on menus / labels in this cuisine
}

export type Language = {
  code: string
  name: string
  nativeName: string
  flag: string
  scriptType: 'latin' | 'cjk' | 'thai' | 'hangul'
  cards: AllergenCard[]
}

const ALLERGENS_BASE = [
  { code: 'PNUT',     englishName: 'Peanut',        severity: 'ana' as const },
  { code: 'MILK',     englishName: 'Milk / Dairy',  severity: 'ana' as const },
  { code: 'EGG',      englishName: 'Egg',           severity: 'ana' as const },
  { code: 'WHEAT',    englishName: 'Wheat',         severity: 'var' as const },
  { code: 'SOY',      englishName: 'Soy',           severity: 'var' as const },
  { code: 'SES',      englishName: 'Sesame',        severity: 'ana' as const },
  { code: 'FISH',     englishName: 'Fish',          severity: 'ana' as const },
  { code: 'CRUST',    englishName: 'Crustaceans',   severity: 'ana' as const },
  { code: 'TREE_NUT', englishName: 'Tree Nuts',     severity: 'ana' as const },
]

export const LANGUAGES: Language[] = [
  {
    code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', scriptType: 'cjk',
    cards: [
      { ...ALLERGENS_BASE[0], localName: 'ピーナッツ・落花生', romanization: 'Pīnattsu / Rakkasei', phrase: '私はピーナッツアレルギーがあります。', phraseRomanization: 'Watashi wa pīnattsu arerugī ga arimasu.', hiddenNames: ['落花生 (rakkasei)', '落花生油', 'ピーナッツバター', 'アラキス油'] },
      { ...ALLERGENS_BASE[1], localName: '乳製品・牛乳', romanization: 'Nyūseihin / Gyūnyū', phrase: '私は乳製品アレルギーがあります。', phraseRomanization: 'Watashi wa nyūseihin arerugī ga arimasu.', hiddenNames: ['バター', 'チーズ', '生クリーム', 'ホエイ', 'カゼイン', '乳糖'] },
      { ...ALLERGENS_BASE[2], localName: '卵', romanization: 'Tamago', phrase: '私は卵アレルギーがあります。', phraseRomanization: 'Watashi wa tamago arerugī ga arimasu.', hiddenNames: ['マヨネーズ', '卵白 (ranpaku)', '卵黄 (ran\'ō)', '茶碗蒸し'] },
      { ...ALLERGENS_BASE[3], localName: '小麦', romanization: 'Komugi', phrase: '私は小麦アレルギーがあります。', phraseRomanization: 'Watashi wa komugi arerugī ga arimasu.', hiddenNames: ['醤油 (shōyu)', 'うどん', 'パン粉 (panko)', '麩 (fu)', 'そうめん', '天ぷら粉'] },
      { ...ALLERGENS_BASE[4], localName: '大豆', romanization: 'Daizu', phrase: '私は大豆アレルギーがあります。', phraseRomanization: 'Watashi wa daizu arerugī ga arimasu.', hiddenNames: ['醤油 (shōyu)', '味噌 (miso)', '豆腐 (tōfu)', '枝豆 (edamame)', '油揚げ', 'もやし'] },
      { ...ALLERGENS_BASE[5], localName: 'ごま・胡麻', romanization: 'Goma', phrase: '私はごまアレルギーがあります。', phraseRomanization: 'Watashi wa goma arerugī ga arimasu.', hiddenNames: ['ごま油 (goma abura)', '練りごま (nerigoma)', 'すりごま', 'タヒニ'] },
      { ...ALLERGENS_BASE[6], localName: '魚・魚介類', romanization: 'Sakana', phrase: '私は魚アレルギーがあります。', phraseRomanization: 'Watashi wa sakana arerugī ga arimasu.', hiddenNames: ['出汁 (dashi)', '鰹節 (katsuobushi)', '煮干し (niboshi)', '魚醤 (gyoshō)'] },
      { ...ALLERGENS_BASE[7], localName: '甲殻類（えび・かに）', romanization: 'Kōkakurui (ebi / kani)', phrase: '私は甲殻類アレルギーがあります（えび・かに）。', phraseRomanization: 'Watashi wa kōkakurui arerugī ga arimasu.', hiddenNames: ['えびせん', 'えびだし', 'かに風味かまぼこ'] },
      { ...ALLERGENS_BASE[8], localName: 'ナッツ類（木の実）', romanization: 'Nattsu-rui', phrase: '私はナッツ類アレルギーがあります（ピーナッツを除く）。', phraseRomanization: 'Watashi wa nattsu-rui arerugī ga arimasu.', hiddenNames: ['アーモンド', 'くるみ', 'カシューナッツ', 'ピスタチオ', 'ヘーゼルナッツ', 'マカデミアナッツ'] },
    ],
  },
  {
    code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭', scriptType: 'thai',
    cards: [
      { ...ALLERGENS_BASE[0], localName: 'ถั่วลิสง', romanization: 'Thua lisong', phrase: 'ฉันแพ้ถั่วลิสง กรุณาอย่าใส่ถั่วลิสงในอาหารของฉัน', phraseRomanization: 'Chan phae thua lisong. Karuna ya sai thua lisong nai ahan khong chan.', hiddenNames: ['น้ำมันถั่วลิสง', 'ซอสสะเต๊ะ', 'น้ำจิ้มถั่วลิสง', 'แกงมัสมั่น'] },
      { ...ALLERGENS_BASE[1], localName: 'นม / ผลิตภัณฑ์จากนม', romanization: 'Nom / Palittaphan chak nom', phrase: 'ฉันแพ้นมและผลิตภัณฑ์จากนม', phraseRomanization: 'Chan phae nom lae palittaphan chak nom.', hiddenNames: ['เนย (noei)', 'ครีม (khrim)', 'ชีส (chis)', 'โยเกิร์ต', 'เวย์โปรตีน'] },
      { ...ALLERGENS_BASE[2], localName: 'ไข่', romanization: 'Khai', phrase: 'ฉันแพ้ไข่', phraseRomanization: 'Chan phae khai.', hiddenNames: ['ไข่ดาว', 'ไข่เจียว', 'มายองเนส', 'ไข่ขาว'] },
      { ...ALLERGENS_BASE[3], localName: 'แป้งสาลี / ข้าวสาลี', romanization: 'Paeng sali / Khao sali', phrase: 'ฉันแพ้แป้งสาลีและกลูเตน', phraseRomanization: 'Chan phae paeng sali lae gluten.', hiddenNames: ['ซีอิ๊วขาว (soy sauce with wheat)', 'ซอสปรุงรส', 'ขนมปัง', 'เส้นหมี่ (wheat noodles)'] },
      { ...ALLERGENS_BASE[4], localName: 'ถั่วเหลือง', romanization: 'Thua lueang', phrase: 'ฉันแพ้ถั่วเหลือง', phraseRomanization: 'Chan phae thua lueang.', hiddenNames: ['เต้าหู้ (tofu)', 'เต้าเจี้ยว', 'ซีอิ๊ว (soy sauce)', 'น้ำมันถั่วเหลือง'] },
      { ...ALLERGENS_BASE[5], localName: 'งา', romanization: 'Nga', phrase: 'ฉันแพ้งา', phraseRomanization: 'Chan phae nga.', hiddenNames: ['น้ำมันงา (sesame oil)', 'ขนมงา', 'ซอสงา'] },
      { ...ALLERGENS_BASE[6], localName: 'ปลา', romanization: 'Pla', phrase: 'ฉันแพ้ปลา กรุณาอย่าใส่น้ำปลาในอาหารของฉัน', phraseRomanization: 'Chan phae pla. Karuna ya sai nam pla.', hiddenNames: ['น้ำปลา (nam pla)', 'ปลาร้า (fermented fish)', 'น้ำพริกปลา', 'ปลาแห้ง'] },
      { ...ALLERGENS_BASE[7], localName: 'กุ้ง / ปู / กั้ง', romanization: 'Kung / Puu / Gang', phrase: 'ฉันแพ้กุ้ง ปู และสัตว์น้ำที่มีเปลือก', phraseRomanization: 'Chan phae kung, puu, lae sat nam thi mi plueang.', hiddenNames: ['กะปิ (shrimp paste — in most curry pastes)', 'น้ำพริกแกง', 'กุ้งแห้ง'] },
      { ...ALLERGENS_BASE[8], localName: 'ถั่วต้นไม้', romanization: 'Thua ton mai', phrase: 'ฉันแพ้ถั่วต้นไม้ทุกชนิด (ยกเว้นถั่วลิสง)', phraseRomanization: 'Chan phae thua ton mai thuk chanit.', hiddenNames: ['อัลมอนด์', 'วอลนัท', 'มะม่วงหิมพานต์ (cashew)', 'ถั่วพิสตาชิโอ', 'เม็ดมะม่วงหิมพานต์'] },
    ],
  },
  {
    code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', scriptType: 'latin',
    cards: [
      { ...ALLERGENS_BASE[0], localName: 'Arachide / Cacahuète', phrase: 'Je suis allergique aux arachides.', hiddenNames: ['huile d\'arachide', 'beurre de cacahuète', 'extrait d\'arachide'] },
      { ...ALLERGENS_BASE[1], localName: 'Lait / Produits laitiers', phrase: 'Je suis allergique aux produits laitiers.', hiddenNames: ['beurre', 'crème', 'fromage', 'lactosérum (whey)', 'caséine', 'lactose'] },
      { ...ALLERGENS_BASE[2], localName: 'Œuf', phrase: 'Je suis allergique aux œufs.', hiddenNames: ['mayonnaise', 'meringue', 'albumine', 'lécithine d\'œuf', 'ovalbumine'] },
      { ...ALLERGENS_BASE[3], localName: 'Blé / Farine de blé', phrase: 'Je suis allergique au blé et au gluten.', hiddenNames: ['farine', 'pain', 'pâtes', 'épeautre', 'kamut', 'semoule', 'chapelure'] },
      { ...ALLERGENS_BASE[4], localName: 'Soja', phrase: 'Je suis allergique au soja.', hiddenNames: ['tofu', 'miso', 'tempeh', 'sauce soja', 'lécithine de soja', 'protéines de soja'] },
      { ...ALLERGENS_BASE[5], localName: 'Sésame', phrase: 'Je suis allergique au sésame.', hiddenNames: ['huile de sésame', 'tahini', 'halva', 'graines de sésame', 'pain bagel'] },
      { ...ALLERGENS_BASE[6], localName: 'Poisson', phrase: 'Je suis allergique au poisson.', hiddenNames: ['sauce de poisson', 'sauce Worcestershire', 'bouillabaisse', 'bouillon de poisson', 'colature d\'anchois'] },
      { ...ALLERGENS_BASE[7], localName: 'Crustacés', phrase: 'Je suis allergique aux crustacés.', hiddenNames: ['bisque', 'sauce cocktail', 'bouillabaisse', 'bouillon de crustacés'] },
      { ...ALLERGENS_BASE[8], localName: 'Fruits à coque', phrase: 'Je suis allergique aux fruits à coque.', hiddenNames: ['amande', 'noix', 'noix de cajou', 'noisette', 'pistache', 'noix du Brésil', 'noix de macadamia', 'praline', 'massepain (amande)'] },
    ],
  },
  {
    code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', scriptType: 'latin',
    cards: [
      { ...ALLERGENS_BASE[0], localName: 'Cacahuete / Maní', phrase: 'Soy alérgico/a al cacahuete.', hiddenNames: ['aceite de cacahuete', 'mantequilla de maní', 'extracto de cacahuete'] },
      { ...ALLERGENS_BASE[1], localName: 'Leche / Lácteos', phrase: 'Soy alérgico/a a los lácteos.', hiddenNames: ['mantequilla', 'crema', 'queso', 'suero de leche (whey)', 'caseína', 'lactosa'] },
      { ...ALLERGENS_BASE[2], localName: 'Huevo', phrase: 'Soy alérgico/a a los huevos.', hiddenNames: ['mayonesa', 'merengue', 'albúmina', 'lecitina de huevo'] },
      { ...ALLERGENS_BASE[3], localName: 'Trigo / Harina de trigo', phrase: 'Soy alérgico/a al trigo y al gluten.', hiddenNames: ['harina', 'pan', 'pasta', 'espelta', 'sémola', 'kamut', 'pan rallado'] },
      { ...ALLERGENS_BASE[4], localName: 'Soja', phrase: 'Soy alérgico/a a la soja.', hiddenNames: ['tofu', 'miso', 'tempeh', 'salsa de soja', 'lecitina de soja'] },
      { ...ALLERGENS_BASE[5], localName: 'Sésamo / Ajonjolí', phrase: 'Soy alérgico/a al sésamo.', hiddenNames: ['aceite de sésamo', 'tahini / tahina', 'halva', 'semillas de sésamo'] },
      { ...ALLERGENS_BASE[6], localName: 'Pescado', phrase: 'Soy alérgico/a al pescado.', hiddenNames: ['salsa de pescado', 'salsa Worcestershire', 'caldo de pescado', 'anchoas'] },
      { ...ALLERGENS_BASE[7], localName: 'Crustáceos / Mariscos', phrase: 'Soy alérgico/a a los crustáceos.', hiddenNames: ['bisque', 'caldo de marisco', 'salsa de gambas'] },
      { ...ALLERGENS_BASE[8], localName: 'Frutos secos de árbol', phrase: 'Soy alérgico/a a los frutos secos de árbol.', hiddenNames: ['almendra', 'nuez', 'anacardo / cajú', 'avellana', 'pistacho', 'nuez de macadamia', 'nuez de Brasil', 'mazapán (almendra)'] },
    ],
  },
  {
    code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', scriptType: 'latin',
    cards: [
      { ...ALLERGENS_BASE[0], localName: 'Arachidi', phrase: 'Sono allergico/a alle arachidi.', hiddenNames: ['olio di arachidi', 'burro di arachidi', 'estratto di arachidi'] },
      { ...ALLERGENS_BASE[1], localName: 'Latte / Latticini', phrase: 'Sono allergico/a ai latticini.', hiddenNames: ['burro', 'panna', 'formaggio', 'siero di latte (whey)', 'caseina', 'lattosio'] },
      { ...ALLERGENS_BASE[2], localName: 'Uova', phrase: 'Sono allergico/a alle uova.', hiddenNames: ['maionese', 'meringa', 'albumina', 'pasta all\'uovo', 'lecitina di uovo'] },
      { ...ALLERGENS_BASE[3], localName: 'Frumento / Grano', phrase: 'Sono allergico/a al frumento e al glutine.', hiddenNames: ['farina', 'pane', 'pasta', 'farro', 'semola', 'spelta', 'pangrattato', 'cous cous'] },
      { ...ALLERGENS_BASE[4], localName: 'Soia', phrase: 'Sono allergico/a alla soia.', hiddenNames: ['tofu', 'miso', 'tempeh', 'salsa di soia', 'lecitina di soia', 'proteine di soia'] },
      { ...ALLERGENS_BASE[5], localName: 'Sesamo', phrase: 'Sono allergico/a al sesamo.', hiddenNames: ['olio di sesamo', 'tahini', 'halva', 'semi di sesamo', 'pane con sesamo'] },
      { ...ALLERGENS_BASE[6], localName: 'Pesce', phrase: 'Sono allergico/a al pesce.', hiddenNames: ['salsa di pesce', 'colatura di alici', 'brodo di pesce', 'Worcestershire', 'pasta d\'acciughe'] },
      { ...ALLERGENS_BASE[7], localName: 'Crostacei', phrase: 'Sono allergico/a ai crostacei.', hiddenNames: ['bisque', 'brodetto', 'brodo di crostacei', 'pasta con gamberi'] },
      { ...ALLERGENS_BASE[8], localName: 'Frutta a guscio', phrase: 'Sono allergico/a alla frutta a guscio.', hiddenNames: ['mandorla', 'noce', 'anacardio', 'nocciola', 'pistacchio', 'noce di macadamia', 'noce del Brasile', 'marzapane (mandorle)', 'croccante'] },
    ],
  },
  {
    code: 'zh', name: 'Mandarin Chinese', nativeName: '普通话', flag: '🇨🇳', scriptType: 'cjk',
    cards: [
      { ...ALLERGENS_BASE[0], localName: '花生', romanization: 'Huāshēng', phrase: '我对花生过敏，请不要在我的食物中加花生。', phraseRomanization: 'Wǒ duì huāshēng guòmǐn, qǐng bùyào jiā huāshēng.', hiddenNames: ['花生油 (huāshēng yóu)', '花生酱 (peanut butter)', '花生粉', '混合坚果'] },
      { ...ALLERGENS_BASE[1], localName: '牛奶 / 乳制品', romanization: 'Niúnǎi / Rǔzhìpǐn', phrase: '我对乳制品过敏。', phraseRomanization: 'Wǒ duì rǔzhìpǐn guòmǐn.', hiddenNames: ['黄油 (huángyóu)', '奶酪 (nǎilào)', '奶油 (nǎiyóu)', '乳清 (whey)', '酪蛋白'] },
      { ...ALLERGENS_BASE[2], localName: '鸡蛋', romanization: 'Jīdàn', phrase: '我对鸡蛋过敏。', phraseRomanization: 'Wǒ duì jīdàn guòmǐn.', hiddenNames: ['蛋黄酱 (mayonnaise)', '蛋白 (egg white)', '蛋黄', '茶叶蛋', '蛋花汤'] },
      { ...ALLERGENS_BASE[3], localName: '小麦', romanization: 'Xiǎomài', phrase: '我对小麦过敏，请问这道菜含有小麦吗？', phraseRomanization: 'Wǒ duì xiǎomài guòmǐn.', hiddenNames: ['酱油 (jiàngyóu)', '面条 (noodles)', '面粉 (flour)', '饺子皮', '包子皮', '馒头'] },
      { ...ALLERGENS_BASE[4], localName: '大豆 / 黄豆', romanization: 'Dàdòu / Huángdòu', phrase: '我对大豆过敏。', phraseRomanization: 'Wǒ duì dàdòu guòmǐn.', hiddenNames: ['酱油 (jiàngyóu)', '豆腐 (dòufu)', '豆豉 (black bean paste)', '毛豆 (edamame)', '豆浆 (soy milk)', '腐乳'] },
      { ...ALLERGENS_BASE[5], localName: '芝麻', romanization: 'Zhīma', phrase: '我对芝麻过敏。', phraseRomanization: 'Wǒ duì zhīma guòmǐn.', hiddenNames: ['芝麻油 (zhīma yóu)', '芝麻酱 (sesame paste)', '芝麻糊', '芝麻汤圆', '烧饼 (may contain)'] },
      { ...ALLERGENS_BASE[6], localName: '鱼 / 鱼类', romanization: 'Yú / Yúlèi', phrase: '我对鱼过敏。', phraseRomanization: 'Wǒ duì yú guòmǐn.', hiddenNames: ['鱼露 (yúlù — fish sauce)', '鱼干 (dried fish)', '鱼汤 (fish broth)', '虾酱 (may contain)', '蚝油 (oyster sauce)'] },
      { ...ALLERGENS_BASE[7], localName: '虾 / 螃蟹 / 龙虾', romanization: 'Xiā / Pángxiè / Lóngxiā', phrase: '我对虾和螃蟹等甲壳类海鲜过敏。', phraseRomanization: 'Wǒ duì xiā hé pángxiè guòmǐn.', hiddenNames: ['虾酱 (shrimp paste)', '虾皮 (dried shrimp)', '虾干', '龙虾汤'] },
      { ...ALLERGENS_BASE[8], localName: '坚果（树坚果）', romanization: 'Jiānguǒ', phrase: '我对坚果过敏（花生除外，花生是豆类）。', phraseRomanization: 'Wǒ duì jiānguǒ guòmǐn.', hiddenNames: ['杏仁 (almond)', '核桃 (walnut)', '腰果 (cashew)', '榛子 (hazelnut)', '开心果 (pistachio)', '夏威夷果 (macadamia)'] },
    ],
  },
  {
    code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', scriptType: 'hangul',
    cards: [
      { ...ALLERGENS_BASE[0], localName: '땅콩', romanization: 'Ddangkong', phrase: '저는 땅콩 알레르기가 있습니다.', phraseRomanization: 'Jeoneun ddangkong allereugi ga itsseumnida.', hiddenNames: ['땅콩기름', '땅콩버터', '땅콩소스', '혼합 견과류'] },
      { ...ALLERGENS_BASE[1], localName: '우유 / 유제품', romanization: 'Uyu / Yujepu', phrase: '저는 유제품 알레르기가 있습니다.', phraseRomanization: 'Jeoneun yujepu allereugi ga itsseumnida.', hiddenNames: ['버터', '치즈', '크림', '카제인', '유청 (whey)', '연유'] },
      { ...ALLERGENS_BASE[2], localName: '달걀 / 계란', romanization: 'Dalgyal / Gyeran', phrase: '저는 달걀 알레르기가 있습니다.', phraseRomanization: 'Jeoneun dalgyal allereugi ga itsseumnida.', hiddenNames: ['마요네즈', '머랭', '계란찜', '달걀말이', '알부민'] },
      { ...ALLERGENS_BASE[3], localName: '밀 / 밀가루', romanization: 'Mil / Milgaru', phrase: '저는 밀 알레르기가 있습니다.', phraseRomanization: 'Jeoneun mil allereugi ga itsseumnida.', hiddenNames: ['간장 (contains wheat)', '국수', '라면', '만두피', '밀가루 튀김옷', '빵가루'] },
      { ...ALLERGENS_BASE[4], localName: '대두 / 콩', romanization: 'Daedu / Kong', phrase: '저는 대두 알레르기가 있습니다.', phraseRomanization: 'Jeoneun daedu allereugi ga itsseumnida.', hiddenNames: ['간장', '된장', '두부', '콩나물', '두유', '청국장', '고추장 (may contain)'] },
      { ...ALLERGENS_BASE[5], localName: '참깨', romanization: 'Chamkkae', phrase: '저는 참깨 알레르기가 있습니다.', phraseRomanization: 'Jeoneun chamkkae allereugi ga itsseumnida.', hiddenNames: ['참기름 (sesame oil)', '깨소금', '참깨 드레싱', '깨묻힌 음식'] },
      { ...ALLERGENS_BASE[6], localName: '생선', romanization: 'Saengseon', phrase: '저는 생선 알레르기가 있습니다.', phraseRomanization: 'Jeoneun saengseon allereugi ga itsseumnida.', hiddenNames: ['젓갈 (fermented seafood)', '액젓 (fish sauce)', '어묵 (fishcake)', '멸치 (anchovy) 육수'] },
      { ...ALLERGENS_BASE[7], localName: '갑각류 (새우, 게)', romanization: 'Gapgangnyu (saeu, ge)', phrase: '저는 갑각류 알레르기가 있습니다.', phraseRomanization: 'Jeoneun gapgangnyu allereugi ga itsseumnida.', hiddenNames: ['새우젓 (salted fermented shrimp)', '새우 가루', '게장', '새우 육수'] },
      { ...ALLERGENS_BASE[8], localName: '견과류 (나무 열매)', romanization: 'Gyeon-gwaryu', phrase: '저는 견과류 알레르기가 있습니다 (땅콩 제외).', phraseRomanization: 'Jeoneun gyeon-gwaryu allereugi ga itsseumnida.', hiddenNames: ['아몬드', '호두', '캐슈넛', '헤이즐넛', '피스타치오', '마카다미아', '잣 (pine nut)'] },
    ],
  },
  {
    code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', scriptType: 'latin',
    cards: [
      { ...ALLERGENS_BASE[0], localName: 'Đậu phộng / Lạc', phrase: 'Tôi bị dị ứng với đậu phộng.', hiddenNames: ['dầu đậu phộng', 'nước chấm đậu phộng', 'tương đậu phộng', 'pad thai (thường có)'] },
      { ...ALLERGENS_BASE[1], localName: 'Sữa / Sản phẩm từ sữa', phrase: 'Tôi bị dị ứng với sữa và các sản phẩm từ sữa.', hiddenNames: ['bơ', 'kem', 'phô mai', 'sữa đặc', 'sữa bột', 'váng sữa (whey)'] },
      { ...ALLERGENS_BASE[2], localName: 'Trứng', phrase: 'Tôi bị dị ứng với trứng.', hiddenNames: ['mayonnaise', 'lòng trắng trứng', 'trứng chiên', 'bánh có trứng'] },
      { ...ALLERGENS_BASE[3], localName: 'Lúa mì / Bột mì', phrase: 'Tôi bị dị ứng với lúa mì và gluten.', hiddenNames: ['bột mì', 'bánh mì', 'mì (wheat noodles)', 'nước tương (soy sauce with wheat)', 'bột chiên giòn'] },
      { ...ALLERGENS_BASE[4], localName: 'Đậu nành', phrase: 'Tôi bị dị ứng với đậu nành.', hiddenNames: ['đậu hũ / tàu hũ (tofu)', 'tương (soy sauce)', 'nước tương', 'tương đậu', 'sữa đậu nành'] },
      { ...ALLERGENS_BASE[5], localName: 'Mè / Vừng', phrase: 'Tôi bị dị ứng với mè.', hiddenNames: ['dầu mè (sesame oil)', 'bánh mè', 'tahini', 'chè mè đen'] },
      { ...ALLERGENS_BASE[6], localName: 'Cá', phrase: 'Tôi bị dị ứng với cá. Xin đừng cho nước mắm vào.', hiddenNames: ['nước mắm (fish sauce — rất phổ biến)', 'mắm (fermented fish paste)', 'cá khô', 'nước dùng cá'] },
      { ...ALLERGENS_BASE[7], localName: 'Tôm / Cua', phrase: 'Tôi bị dị ứng với tôm và cua.', hiddenNames: ['mắm tôm (shrimp paste — rất phổ biến)', 'tôm khô', 'nước dùng tôm', 'bánh tôm'] },
      { ...ALLERGENS_BASE[8], localName: 'Hạt cứng (hạt từ cây)', phrase: 'Tôi bị dị ứng với các loại hạt cứng từ cây.', hiddenNames: ['hạnh nhân (almond)', 'óc chó (walnut)', 'hạt điều (cashew)', 'hạt phỉ (hazelnut)', 'hồ trăn (pistachio)', 'hạt mắc ca (macadamia)'] },
    ],
  },
]

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code)
}

export const SEVERITY_STYLES = {
  ana: { border: 'border-red-200',    bg: 'bg-red-50',    badge: 'bg-red-100 text-red-700',    label: 'Anaphylactic risk' },
  var: { border: 'border-yellow-200', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', label: 'Variable severity' },
  add: { border: 'border-gray-200',   bg: 'bg-gray-50',   badge: 'bg-gray-100 text-gray-600',  label: 'Sensitivity' },
}
