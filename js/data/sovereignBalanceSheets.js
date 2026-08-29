// Sovereign (General Government / Public Sector) Balance Sheets & Fiscal Facts
// Sourced directly from official National Ministries of Finance, Treasury Annual Financial Reports, and IMF Public Sector Balance Sheet (PSBS) Database.

export const SOVEREIGN_BALANCE_SHEETS = [
  {
    iso3: 'JPN',
    country: '日本 (Japan)',
    countryEn: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    ministry: '財務省 (Ministry of Finance Japan)',
    officialReportName: '国の財務書類 (連結貸借対照表)',
    officialReportCode: 'MOF-CFR-2023',
    sourceUrl: 'https://www.mof.go.jp/policy/budget/topics/financial_documents/index.html',
    pdfUrl: 'https://www.mof.go.jp/policy/budget/topics/financial_documents/2023/index.htm',
    latestFiscalYear: '2023年度 (令和5年度公表)',
    
    // Assets Breakdown (Trillion JPY & USD)
    totalAssetsLocal: '¥757.2 兆',
    totalAssetsUsdTrillion: 5.18,
    assetsToGdp: 128.4,
    financialAssetsLocal: '¥536.4 兆', // 有価証券・出資金・貸付金・外貨等
    financialAssetsUsdTrillion: 3.67,
    fixedAssetsLocal: '¥220.8 兆', // 有形固定資産（インフラ・国有地等）
    
    // Key Reserves & Funds
    sovereignFundsName: '公的年金積立金 (GPIF: 約250兆円) / 外貨準備高 (約190兆円 / $1.3T)',
    sovereignFundsUsdTrillion: 2.95,

    // Liabilities & Debt
    grossLiabilitiesLocal: '¥1,475.9 兆', // 公債＋借入金＋政府短期証券＋引当金
    grossLiabilitiesUsdTrillion: 10.10,
    grossDebtToGdp: 250.2, // IMF / MOF 総債務対GDP比
    netDebtToGdp: 154.5,   // 純債務対GDP比 (総債務 - 金融資産)
    
    // Net Worth / Equity
    netWorthLocal: '-¥718.7 兆', // 資産・負債差額 (実質債務超過額)
    netWorthUsdTrillion: -4.92,
    netWorthToGdp: -121.8,
    
    primaryBalanceToGdp: -1.5, // 基礎的財政収支
    description: '総債務比率は約250%と先進国中最大だが、GPIF（世界最大の公的年金積立金）や外貨準備など約536兆円の莫大な金融資産を保有するため、純債務比率は約154%にとどまる。'
  },
  {
    iso3: 'USA',
    country: 'アメリカ合衆国 (United States)',
    countryEn: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    ministry: 'U.S. Department of the Treasury & GAO',
    officialReportName: 'Financial Report of the United States Government',
    officialReportCode: 'US-FR-TREASURY-2023',
    sourceUrl: 'https://www.fiscal.treasury.gov/reports-statements/financial-report/',
    pdfUrl: 'https://www.fiscal.treasury.gov/files/reports-statements/financial-report/2023/financial-report-fy2023.pdf',
    latestFiscalYear: 'FY 2023 (as of Sept 30, 2023)',
    
    totalAssetsLocal: '$5.40 兆',
    totalAssetsUsdTrillion: 5.40,
    assetsToGdp: 19.8,
    financialAssetsLocal: '$2.42 兆', // 学生ローン・貸付金・現金等
    financialAssetsUsdTrillion: 2.42,
    fixedAssetsLocal: '$2.98 兆', // 防衛装備・国有不動産・インフラ
    
    sovereignFundsName: 'Social Security Trust Fund ($2.71T) / Exchange Stabilization Fund',
    sovereignFundsUsdTrillion: 2.85,

    grossLiabilitiesLocal: '$42.94 兆', // 公的保有国債＋年金受給義務等
    grossLiabilitiesUsdTrillion: 42.94,
    grossDebtToGdp: 122.3, // 連邦公債残高ベース
    netDebtToGdp: 96.5,    // 純債務対GDP比
    
    netWorthLocal: '-$37.54 兆', // 連邦政府純資産 (Net Position)
    netWorthUsdTrillion: -37.54,
    netWorthToGdp: -137.6,
    
    primaryBalanceToGdp: -3.8,
    description: '米財務省GAAP基準財務報告による総負債は約42.9兆ドル（退職軍人手当等引当金含む）。金融資産は約2.4兆ドルで、純債務比率は約96.5%。'
  },
  {
    iso3: 'NOR',
    country: 'ノルウェー (Norway)',
    countryEn: 'Norway',
    flag: '🇳🇴',
    currency: 'NOK',
    ministry: 'Norwegian Ministry of Finance / Norges Bank',
    officialReportName: 'Statsregnskapet (Government Financial Statements)',
    officialReportCode: 'NBIM-GPFG-2023',
    sourceUrl: 'https://www.nbim.no/en/the-fund/',
    pdfUrl: 'https://www.nbim.no/en/the-fund/reports-and-publications/annual-reports/',
    latestFiscalYear: '2023 Annual Report',
    
    totalAssetsLocal: 'NOK 19.2 兆',
    totalAssetsUsdTrillion: 1.82,
    assetsToGdp: 375.4,
    financialAssetsLocal: 'NOK 17.8 兆', // GPFGを含む金融資産
    financialAssetsUsdTrillion: 1.69,
    fixedAssetsLocal: 'NOK 1.4 兆',
    
    sovereignFundsName: 'Government Pension Fund Global (GPFG: 約1.72兆ドル)',
    sovereignFundsUsdTrillion: 1.72,

    grossLiabilitiesLocal: 'NOK 2.2 兆',
    grossLiabilitiesUsdTrillion: 0.21,
    grossDebtToGdp: 43.2,
    netDebtToGdp: -285.6, // 巨大な「純資産（マイナス純債務）」ポジション
    
    netWorthLocal: '+NOK 17.0 兆', // 莫大な正味純資産
    netWorthUsdTrillion: 1.61,
    netWorthToGdp: 332.2,
    
    primaryBalanceToGdp: +14.2,
    description: '世界最大の政府系ファンド（GPFG: 約1.7兆ドル）を保有。総債務43%に対し資産がGDP比375%に達し、世界有数の純資産プラス国家。'
  },
  {
    iso3: 'SGP',
    country: 'シンガポール (Singapore)',
    countryEn: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    ministry: 'Ministry of Finance Singapore (MOF)',
    officialReportName: 'Singapore Government Financial Statements',
    officialReportCode: 'SG-MOF-FS-2023',
    sourceUrl: 'https://www.mof.gov.sg/singapore-budget/budget-documents',
    pdfUrl: 'https://www.mof.gov.sg/singapore-budget/budget-archives',
    latestFiscalYear: 'FY 2023/2024',
    
    totalAssetsLocal: 'S$ 1.55 兆',
    totalAssetsUsdTrillion: 1.18,
    assetsToGdp: 232.0,
    financialAssetsLocal: 'S$ 1.42 兆',
    financialAssetsUsdTrillion: 1.08,
    fixedAssetsLocal: 'S$ 0.13 兆',
    
    sovereignFundsName: 'GIC Private Limited & Temasek Holdings (推定 約1.1兆ドル)',
    sovereignFundsUsdTrillion: 1.10,

    grossLiabilitiesLocal: 'S$ 1.15 兆', // 投資原資としての国債 (SSGS/SGS)
    grossLiabilitiesUsdTrillion: 0.88,
    grossDebtToGdp: 168.4, // 形式的総債務 (全額資産運用に充当)
    netDebtToGdp: -63.6,   // 純債務はマイナス（純資産超過）
    
    netWorthLocal: '+S$ 0.40 兆',
    netWorthUsdTrillion: 0.30,
    netWorthToGdp: 63.6,
    
    primaryBalanceToGdp: +0.8,
    description: '法制度上、赤字国債の発行が禁止されており、発行国債の全額がGIC等の資産運用（投資リターン）に裏付けられた純資産超過国家。'
  },
  {
    iso3: 'DEU',
    country: 'ドイツ (Germany)',
    countryEn: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    ministry: 'Bundesministerium der Finanzen (BMF)',
    officialReportName: 'Vermögensrechnung des Bundes (Federal Asset Accounts)',
    officialReportCode: 'BMF-VR-2023',
    sourceUrl: 'https://www.bundesfinanzministerium.de/Web/DE/Themen/Oeffentlicher_Gesamthaushalt/Bundeshaushalt/bundeshaushalt.html',
    pdfUrl: 'https://www.bundesfinanzministerium.de/',
    latestFiscalYear: '2023 Financial Year',
    
    totalAssetsLocal: '€1.65 兆',
    totalAssetsUsdTrillion: 1.80,
    assetsToGdp: 40.2,
    financialAssetsLocal: '€0.72 兆',
    financialAssetsUsdTrillion: 0.78,
    fixedAssetsLocal: '€0.93 兆', // アウトバーン・国有不動産
    
    sovereignFundsName: 'KENFO (原子力廃棄物処理基金 €24B) / KfW 政策金融公庫',
    sovereignFundsUsdTrillion: 0.12,

    grossLiabilitiesLocal: '€2.62 兆',
    grossLiabilitiesUsdTrillion: 2.86,
    grossDebtToGdp: 63.7, // マーストリヒト基準適合
    netDebtToGdp: 46.2,   // 純債務対GDP比
    
    netWorthLocal: '-€0.97 兆',
    netWorthUsdTrillion: -1.06,
    netWorthToGdp: -23.5,
    
    primaryBalanceToGdp: -1.1,
    description: '憲法の債務ブレーキ（Schuldenbremse）規律により、総債務比率63.7%・純債務比率46.2%と主要先進国中トップクラスの健全性を維持。'
  },
  {
    iso3: 'GBR',
    country: 'イギリス (United Kingdom)',
    countryEn: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    ministry: 'HM Treasury (英国財務省)',
    officialReportName: 'Whole of Government Accounts (WGA)',
    officialReportCode: 'HMT-WGA-2022-23',
    sourceUrl: 'https://www.gov.uk/government/collections/whole-of-government-accounts',
    pdfUrl: 'https://www.gov.uk/government/publications/whole-of-government-accounts-2021-to-2022',
    latestFiscalYear: '2022-23 WGA Audited',
    
    totalAssetsLocal: '£2.18 兆',
    totalAssetsUsdTrillion: 2.86,
    assetsToGdp: 83.2,
    financialAssetsLocal: '£0.64 兆',
    financialAssetsUsdTrillion: 0.84,
    fixedAssetsLocal: '£1.54 兆', // NHS施設、道路網、防衛資産
    
    sovereignFundsName: 'National Insurance Fund (£42B) / British International Investment',
    sovereignFundsUsdTrillion: 0.06,

    grossLiabilitiesLocal: '£5.12 兆', // ギルト債券残高＋公的部門年金債務(£2.5T)
    grossLiabilitiesUsdTrillion: 6.71,
    grossDebtToGdp: 100.4,
    netDebtToGdp: 89.2,
    
    netWorthLocal: '-£2.94 兆', // 純資産 (Net Liabilities)
    netWorthUsdTrillion: -3.85,
    netWorthToGdp: -112.2,
    
    primaryBalanceToGdp: -2.3,
    description: '公会計全体（WGA）基準では将来の公的年金債務（約2.5兆ポンド）が負債計上されるため、名目上の純資産はマイナス約2.9兆ポンド。'
  },
  {
    iso3: 'FRA',
    country: 'フランス (France)',
    countryEn: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    ministry: 'Ministère de l’Économie et des Finances',
    officialReportName: 'Compte Général de l’État (CGE)',
    officialReportCode: 'MINEFI-CGE-2023',
    sourceUrl: 'https://www.economie.gouv.fr/cedef/comptes-generaux-etat',
    pdfUrl: 'https://www.budget.gouv.fr/documentation/documents-budgetaires',
    latestFiscalYear: 'Exercice 2023',
    
    totalAssetsLocal: '€1.12 兆',
    totalAssetsUsdTrillion: 1.22,
    assetsToGdp: 39.8,
    financialAssetsLocal: '€0.45 兆', // 国有企業株式（EDF、エールフランス等）
    financialAssetsUsdTrillion: 0.49,
    fixedAssetsLocal: '€0.67 兆',
    
    sovereignFundsName: 'Bpifrance (フランス公的投資銀行) / 外貨準備高 (€180B)',
    sovereignFundsUsdTrillion: 0.24,

    grossLiabilitiesLocal: '€3.10 兆',
    grossLiabilitiesUsdTrillion: 3.38,
    grossDebtToGdp: 110.6,
    netDebtToGdp: 94.8,
    
    netWorthLocal: '-€1.98 兆',
    netWorthUsdTrillion: -2.16,
    netWorthToGdp: -70.4,
    
    primaryBalanceToGdp: -3.2,
    description: 'EDFなど主要戦略企業への株式出資（金融資産）を有する一方、公的債務残高は3.1兆ユーロに達し純債務対GDP比は94.8%。'
  }
];

export const getSovereignBalanceSheetByIso3 = (iso3) => SOVEREIGN_BALANCE_SHEETS.find(s => s.iso3 === iso3);
