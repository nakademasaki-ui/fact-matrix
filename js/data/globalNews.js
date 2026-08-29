// Primary Multi-Polar Global News & Official Wire Dataset
// Sourced from internationally recognized news wire services (Reuters, AP, Al Jazeera, Xinhua, TASS, Kyodo, Yonhap, Straits Times, PTI).
// Zero-Editorial Rule: Focuses on factual announcements, official statements, and verifiable events.

export const REGIONAL_BLOCS = {
  WEST: { nameJa: '西側諸国 (West)', flag: '🇺🇸🇪🇺', color: '#38bdf8' },
  MIDEAST: { nameJa: '中東 (Middle East)', flag: '🇸🇦🇶🇦', color: '#f59e0b' },
  CHINA: { nameJa: '中国 (China)', flag: '🇨🇳', color: '#ef4444' },
  RUSSIA: { nameJa: 'ロシア (Russia)', flag: '🇷🇺', color: '#a855f7' },
  ASIA: { nameJa: 'アジア (Asia)', flag: '🇯🇵🇸🇬', color: '#00f59b' }
};

export const GLOBAL_NEWS_ITEMS = [
  // --- WEST (西側) ---
  {
    id: 'news-west-01',
    bloc: 'WEST',
    outlet: 'Reuters (ロイター通信)',
    outletType: '国際通信社 (英国/国際)',
    country: 'United Kingdom / Global',
    flag: '🇬🇧',
    category: 'Economy & Trade',
    categoryJa: '経済・金融',
    publishedAt: '2024-08-29 18:30 UTC',
    titleJa: '米連邦準備制度、9月FOMCに向け労働市場・インフレデータを精査',
    titleEn: 'Fed officials signal openness to rate adjustments as labor market cools',
    factSummary: '米連邦準備制度理事会（FRB）高官が、インフレ鈍化と労働市場の緩やかな軟化を受け、次期FOMCでの金融政策見直しの選択肢を示唆した。',
    officialSourceRef: 'Federal Reserve Board Public Speeches',
    url: 'https://www.reuters.com/markets/',
    urlDomain: 'reuters.com'
  },
  {
    id: 'news-west-02',
    bloc: 'WEST',
    outlet: 'Associated Press (AP通信)',
    outletType: '国際通信社 (米国)',
    country: 'United States',
    flag: '🇺🇸',
    category: 'Geopolitics',
    categoryJa: '外交・安全保障',
    publishedAt: '2024-08-29 16:15 UTC',
    titleJa: '国連総会、人工知能（AI）のグローバル・ガバナンス枠組みに関する決議草案を討議',
    titleEn: 'UN General Assembly deliberates draft principles on safe AI development',
    factSummary: '国連総会にて、開発途上国を含む持続可能な開発目標（SDGs）達成に向けたAIの安全性・公平なアクセスに関する多国間協議が進行。',
    officialSourceRef: 'UN GA Session Press Summary A/78/PV',
    url: 'https://apnews.com/',
    urlDomain: 'apnews.com'
  },

  // --- MIDDLE EAST (中東) ---
  {
    id: 'news-mideast-01',
    bloc: 'MIDEAST',
    outlet: 'Al Jazeera (アルジャジーラ)',
    outletType: '中東独立系国際報道 (カタール)',
    country: 'Qatar',
    flag: '🇶🇦',
    category: 'Geopolitics',
    categoryJa: '外交・安全保障',
    publishedAt: '2024-08-29 17:45 UTC',
    titleJa: 'ガザ人道停戦・人質解放交渉、カイロおよびドーハで仲介国協議が継続',
    titleEn: 'Mediators continue technical negotiations on Gaza humanitarian truce framework',
    factSummary: 'エジプト、カタール、米国の仲介代表団が、休戦期間の境界管理および人道物資回廊の設置に関する具体的条項の詰めの協議を継続。',
    officialSourceRef: 'Qatar Ministry of Foreign Affairs Official Briefing',
    url: 'https://www.aljazeera.com/news/',
    urlDomain: 'aljazeera.com'
  },
  {
    id: 'news-mideast-02',
    bloc: 'MIDEAST',
    outlet: 'Arab News (アラブ・ニュース)',
    outletType: '日刊英字紙 (サウジアラビア)',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    category: 'Energy & Trade',
    categoryJa: 'エネルギー・通商',
    publishedAt: '2024-08-29 14:20 UTC',
    titleJa: 'OPECプラス合同閣僚監視委員会、原油自主減産の段階的調整方針を維持',
    titleEn: 'OPEC+ JMMC reaffirms commitment to market stability and phased production plans',
    factSummary: 'OPECプラス閣僚委員会は、世界の原油需要見通しと在庫動向を精査し、自主減産の段階的縮小計画に関する現行方針を確認。',
    officialSourceRef: 'OPEC Secretariat Press Release 12/2024',
    url: 'https://www.arabnews.com/business',
    urlDomain: 'arabnews.com'
  },

  // --- CHINA (中国) ---
  {
    id: 'news-china-01',
    bloc: 'CHINA',
    outlet: 'Xinhua News Agency (新華社)',
    outletType: '中国国営通信社 (中国公式発表一次資料)',
    country: 'China',
    flag: '🇨🇳',
    category: 'Economy & Trade',
    categoryJa: '経済・金融',
    publishedAt: '2024-08-29 15:00 UTC',
    titleJa: '中国国務院、内需拡大と先端製造業への金融支援強化に関する指針を通知',
    titleEn: 'State Council issues guidelines to bolster domestic demand and advanced equipment upgrades',
    factSummary: '中国政府は、大規模設備更新と消費財の買い替え促進に向け、特別国債および財政補助金を活用する具体的実施策を公表。',
    officialSourceRef: '中国国務院公報 (Gov.cn Official Gazette)',
    url: 'https://english.news.cn/',
    urlDomain: 'news.cn'
  },
  {
    id: 'news-china-02',
    bloc: 'CHINA',
    outlet: 'Caixin Global (財新)',
    outletType: '独立系経済メディア (中国)',
    country: 'China',
    flag: '🇨🇳',
    category: 'Economy & Trade',
    categoryJa: 'マクロ経済・市場',
    publishedAt: '2024-08-29 11:30 UTC',
    titleJa: '中国人民銀行、国債売買オペレーションの制度設計を完了し運用体制を整備',
    titleEn: 'PBOC prepares open market Treasury bond trading mechanisms to manage yield curve',
    factSummary: '中国人民銀行は、流動性管理およびイールドカーブの安定化を目的に、国債売買を公開市場操作に正式に組み入れる手続きを完了。',
    officialSourceRef: '中国人民銀行 公開市場業務公告',
    url: 'https://www.caixinglobal.com/',
    urlDomain: 'caixinglobal.com'
  },

  // --- RUSSIA (ロシア) ---
  {
    id: 'news-russia-01',
    bloc: 'RUSSIA',
    outlet: 'TASS News Agency (タス通信)',
    outletType: 'ロシア連邦国営通信社 (クレムリン公式一次資料)',
    country: 'Russia',
    flag: '🇷🇺',
    category: 'Geopolitics',
    categoryJa: '外交・安全保障',
    publishedAt: '2024-08-29 16:40 UTC',
    titleJa: 'ロシア外務省、秋のBRICSカザン首脳会議に向け加盟国通貨決済システムの準備状況を発表',
    titleEn: 'Russian MFA highlights preparations for BRICS Pay settlement system ahead of Kazan Summit',
    factSummary: 'ロシア外務省は、2024年10月のBRICSカザン首脳会議に向け、自国通貨建て決済インフラおよび多国間決済メカニズムの作業進捗を公表。',
    officialSourceRef: 'Russian Ministry of Foreign Affairs Press Briefing',
    url: 'https://tass.com/',
    urlDomain: 'tass.com'
  },
  {
    id: 'news-russia-02',
    bloc: 'RUSSIA',
    outlet: 'Interfax (インターファクス通信)',
    outletType: '独立系通信社 (ロシア/ユーラシア)',
    country: 'Russia',
    flag: '🇷🇺',
    category: 'Energy & Trade',
    categoryJa: 'エネルギー・通商',
    publishedAt: '2024-08-29 13:10 UTC',
    titleJa: 'ロシア中銀、最新インフレ統計を受けインフレ期待抑制に向けた金融スタンスを維持',
    titleEn: 'Bank of Russia notes persistent domestic demand pressures in latest monetary bulletin',
    factSummary: 'ロシア中央銀行は、8月のインフレ傾向および企業融資データに基づき、目標インフレ率4%達成に向けた引き締め的政策姿勢を継続。',
    officialSourceRef: 'Bank of Russia Monetary Policy Report',
    url: 'https://interfax.com/',
    urlDomain: 'interfax.com'
  },

  // --- ASIA (アジア) ---
  {
    id: 'news-asia-01',
    bloc: 'ASIA',
    outlet: 'Kyodo News (共同通信)',
    outletType: '一般社団法人 共同通信社 (日本)',
    country: 'Japan',
    flag: '🇯🇵',
    category: 'Economy & Trade',
    categoryJa: '経済・金融',
    publishedAt: '2024-08-29 17:00 UTC',
    titleJa: '日銀・植田総裁、経済・物価見通しが実現すれば利上げ姿勢を継続する方針を再確認',
    titleEn: 'BOJ Governor Ueda affirms policy rate hike stance if economic outlook materialized',
    factSummary: '衆参両院の閉会中審査にて、日銀総裁は7月の追加利上げの背景を説明し、基調的な物価上昇率が目標に沿って推移すれば段階的利上げを行う方針を答弁。',
    officialSourceRef: '衆議院 財務金融委員会 議事速報',
    url: 'https://nordot.app/kyodo',
    urlDomain: 'kyodo.co.jp'
  },
  {
    id: 'news-asia-02',
    bloc: 'ASIA',
    outlet: 'The Straits Times (ストレーツ・タイムズ)',
    outletType: 'シンガポール主要紙 (ASEAN報道)',
    country: 'Singapore',
    flag: '🇸🇬',
    category: 'Economy & Trade',
    categoryJa: '通商・サプライチェーン',
    publishedAt: '2024-08-29 12:45 UTC',
    titleJa: 'ASEAN経済相会議、デジタル経済枠組み協定（DEFA）交渉の年内進捗を確認',
    titleEn: 'ASEAN Economic Ministers review progress on Digital Economy Framework Agreement (DEFA)',
    factSummary: 'ASEAN諸国の経済閣僚は、域内の電子商取引、越境データ流通、デジタル決済のシームレス化を目指す包括協定の策定協議を推進。',
    officialSourceRef: 'ASEAN Secretariat Joint Media Statement',
    url: 'https://www.straitstimes.com/global',
    urlDomain: 'straitstimes.com'
  },
  {
    id: 'news-asia-03',
    bloc: 'ASIA',
    outlet: 'PTI (Press Trust of India)',
    outletType: 'インド代表通信社 (インド)',
    country: 'India',
    flag: '🇮🇳',
    category: 'Economy & Trade',
    categoryJa: '経済・インフラ',
    publishedAt: '2024-08-29 10:15 UTC',
    titleJa: 'インド統計局、第1四半期実質GDP成長率を公表（製造業・公的インフラ投資が牽引）',
    titleEn: 'India Ministry of Statistics releases Q1 GDP growth estimates led by manufacturing sector',
    factSummary: 'インド統計・計画実施省は、国内固定資本形成およびサービス業の堅調な拡大により四半期GDPが年率6.7%成長を記録したと公表。',
    officialSourceRef: 'Ministry of Statistics & Programme Implementation (MOSPI)',
    url: 'https://www.ptinews.com/',
    urlDomain: 'ptinews.com'
  }
];

// Cross-Comparison Topics: How different regional wires report on the same global issue
export const CROSS_COMPARISON_TOPICS = [
  {
    topicId: 'TOPIC_BRICS_SETTLEMENT',
    titleJa: '同一テーマ多極対比①: 「BRICS決済システム＆脱ドル・自国通貨決済の推進」',
    date: '2024年8月',
    perspectives: [
      {
        bloc: 'WEST',
        outlet: 'Reuters (西側)',
        flag: '🇬🇧',
        stanceTitle: '米ドル支配への直接的脅威は限定的とする見方',
        quote: 'アナリストや西側財務当局は、BRICS加盟国間の規制・流動性の乖離や人民元等の為替規制により、即座にドル決済を代替する実行力には多くの課題が残ると分析。'
      },
      {
        bloc: 'CHINA',
        outlet: 'Xinhua (中国)',
        flag: '🇨🇳',
        stanceTitle: '多極化と国際金融システムの多元化を重視',
        quote: '自国通貨決済の拡大は貿易コストの削減と為替リスク回避に資するものであり、グローバルサウス諸国の正当な金融自立の権利であると強調。'
      },
      {
        bloc: 'RUSSIA',
        outlet: 'TASS (ロシア)',
        flag: '🇷🇺',
        stanceTitle: '西側の単独制裁に対する防衛インフラと位置付け',
        quote: '西側による金融制裁やSWIFT排除への対抗措置として、独立したデジタル通貨・メッセージング基盤「BRICS Pay」の創設が不可欠であると表明。'
      },
      {
        bloc: 'ASIA',
        outlet: 'The Straits Times (ASEAN)',
        flag: '🇸🇬',
        stanceTitle: '域内ローカル通貨決済（LCT）との両立・バランス外交',
        quote: 'ASEAN諸国は独自に進めるQRコード相互決済やLCT推進を軸としつつ、米ドルとBRICS枠組みの双方との実利的な協調関係を維持する姿勢。'
      }
    ]
  },
  {
    topicId: 'TOPIC_MIDEAST_ENERGY',
    titleJa: '同一テーマ多極対比②: 「中東原油需給＆OPECプラス自主減産方針」',
    date: '2024年8月',
    perspectives: [
      {
        bloc: 'WEST',
        outlet: 'Bloomberg (西側)',
        flag: '🇺🇸',
        stanceTitle: '世界景気減速懸念と非OPEC（米・ガイアナ等）増産圧力に注目',
        quote: '中国の需要軟化と米国の過去最高水準の産油量により、OPECプラスが計画する減産解除は市場供給過剰を招くリスクがあると指摘。'
      },
      {
        bloc: 'MIDEAST',
        outlet: 'Arab News (サウジ)',
        flag: '🇸🇦',
        stanceTitle: '市場の安定性と長期的な上流投資不足への警鐘',
        quote: '自主減産は投機的ボラティリティから市場を守る予防的措置であり、エネルギー転換期における油田開発投資の継続が必要不可欠と主張。'
      },
      {
        bloc: 'ASIA',
        outlet: 'Kyodo News (日本)',
        flag: '🇯🇵',
        stanceTitle: '輸入インフレ圧力とエネルギー調達多角化の観点',
        quote: '原油価格の推移と円安が国内物価・電気ガス代に与える影響を警戒し、中東依存度低減と備蓄放出・再生可能エネルギー導入を注視。'
      }
    ]
  }
];
