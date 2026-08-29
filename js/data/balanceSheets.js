// Primary Central Bank Balance Sheets & Quantitative Tightening (QT/QE) Ledger
// Sourced directly from official weekly/monthly Central Bank Financial Statements (Fed H.4.1, ECB WFS, BOJ Accounts).

export const CENTRAL_BANK_BALANCE_SHEETS = [
  {
    iso3: 'USA',
    centralBank: 'Federal Reserve (Fed)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    totalAssetsUsdTrillion: 7.18,
    totalAssetsLocal: '$7.18T',
    assetsToGdp: 25.4,
    peakAssetsUsdTrillion: 8.96,
    peakDate: '2022-04-13',
    qtContractionUsdTrillion: 1.78,
    qtContractionPct: -19.87, // % contraction from peak
    policyStance: 'QT', // 'QT', 'QE', 'HOLD'
    monthlyRunoffTarget: 'Treasuries: $25B/mo, MBS: $35B/mo',
    reportFrequency: 'Weekly (Every Thursday)',
    officialReleaseCode: 'Fed Statistical Release H.4.1',
    sourceUrl: 'https://www.federalreserve.gov/releases/h41/',
    latestStatementDate: '2024-08-22',
    description: 'コロナ禍の8.96兆ドルから量的引き締め（QT）により1.78兆ドル超の資産圧縮を実施中。'
  },
  {
    iso3: 'EMU',
    centralBank: 'European Central Bank (ECB)',
    country: 'Euro Area',
    flag: '🇪🇺',
    currency: 'EUR',
    totalAssetsUsdTrillion: 7.12, // €6.52T converted at 1.09
    totalAssetsLocal: '€6.52T',
    assetsToGdp: 45.8,
    peakAssetsUsdTrillion: 9.62, // €8.83T
    peakDate: '2022-06-24',
    qtContractionUsdTrillion: 2.50,
    qtContractionPct: -26.16,
    policyStance: 'QT',
    monthlyRunoffTarget: 'APP: Full Runoff, PEPP: -€7.5B/mo from July 2024',
    reportFrequency: 'Weekly (Every Tuesday)',
    officialReleaseCode: 'ECB Consolidated Weekly Financial Statement',
    sourceUrl: 'https://www.ecb.europa.eu/press/wfs/html/index.en.html',
    latestStatementDate: '2024-08-20',
    description: 'TLTRO返済および資産購入プログラム（APP/PEPP）の再投資縮小により2.3兆ユーロ超の圧縮を進行。'
  },
  {
    iso3: 'JPN',
    centralBank: 'Bank of Japan (BOJ)',
    country: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    totalAssetsUsdTrillion: 5.16, // ¥753T at 146 USD/JPY
    totalAssetsLocal: '¥753.4T',
    assetsToGdp: 126.8, // Over 100% of GDP
    peakAssetsUsdTrillion: 5.35, // ¥758T
    peakDate: '2023-12-31',
    qtContractionUsdTrillion: 0.19,
    qtContractionPct: -0.61,
    policyStance: 'TAPER',
    monthlyRunoffTarget: '国債買入月額を現行6兆円から2026年1-3月に月3兆円へ段階的減額',
    reportFrequency: '旬次 (毎月10日・20日・月末)',
    officialReleaseCode: '日本銀行勘定 (BOJ Accounts)',
    sourceUrl: 'https://www.boj.or.jp/statistics/boj/other/acboard/index.htm',
    latestStatementDate: '2024-08-20',
    description: '対GDP比126%超と主要中銀中最大。2024年7月会合で長期国債買入の段階的減額計画を決定。'
  },
  {
    iso3: 'CHN',
    centralBank: "People's Bank of China (PBOC)",
    country: 'China',
    flag: '🇨🇳',
    currency: 'CNY',
    totalAssetsUsdTrillion: 6.15, // ¥43.8T at 7.12 USD/CNY
    totalAssetsLocal: '¥43.82T',
    assetsToGdp: 34.2,
    peakAssetsUsdTrillion: 6.42,
    peakDate: '2024-01-31',
    qtContractionUsdTrillion: 0.27,
    qtContractionPct: -4.20,
    policyStance: 'EASING',
    monthlyRunoffTarget: '国債売買オペ（買い入れ・売りオペ）の開始',
    reportFrequency: 'Monthly',
    officialReleaseCode: 'PBOC Balance Sheet of Monetary Authority',
    sourceUrl: 'http://www.pbc.gov.cn/diaochatongjisi/116263/116282/index.html',
    latestStatementDate: '2024-07-31',
    description: '預金準備率引き下げ（RRR）やリバースレポ、国債売買を活用した流動性供給オペレーション。'
  },
  {
    iso3: 'GBR',
    centralBank: 'Bank of England (BOE)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    totalAssetsUsdTrillion: 1.15, // £875B
    totalAssetsLocal: '£875B',
    assetsToGdp: 32.1,
    peakAssetsUsdTrillion: 1.48, // £1.12T
    peakDate: '2021-12-31',
    qtContractionUsdTrillion: 0.33,
    qtContractionPct: -21.87,
    policyStance: 'QT',
    monthlyRunoffTarget: 'APF ギルト保有残高を年1,000億ポンドペースで削減 (能動的売却含む)',
    reportFrequency: 'Weekly',
    officialReleaseCode: 'BOE Bank Return & APF Statement',
    sourceUrl: 'https://www.bankofengland.co.uk/markets/bank-of-england-weekly-report',
    latestStatementDate: '2024-08-21',
    description: '国債の満期償還だけでなく市場への能動的売却（Active QT）を実施し残高を圧縮中。'
  },
  {
    iso3: 'CHE',
    centralBank: 'Swiss National Bank (SNB)',
    country: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    totalAssetsUsdTrillion: 0.96, // CHF 810B
    totalAssetsLocal: 'CHF 810B',
    assetsToGdp: 102.5,
    peakAssetsUsdTrillion: 1.18, // CHF 1.05T
    peakDate: '2021-12-31',
    qtContractionUsdTrillion: 0.22,
    qtContractionPct: -22.85,
    policyStance: 'QT',
    monthlyRunoffTarget: '為替介入および外貨資産の売却調整',
    reportFrequency: 'Monthly',
    officialReleaseCode: 'SNB Balance sheet items',
    sourceUrl: 'https://data.snb.ch/en/topics/snb#!/cube/snbbalsit',
    latestStatementDate: '2024-07-31',
    description: '外貨準備（米国株・欧州債等）を中心とする巨大なバランスシート。外貨売却による為替防衛・資産圧縮。'
  },
  {
    iso3: 'CAN',
    centralBank: 'Bank of Canada (BOC)',
    country: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    totalAssetsUsdTrillion: 0.22, // C$305B
    totalAssetsLocal: 'C$305B',
    assetsToGdp: 14.1,
    peakAssetsUsdTrillion: 0.44, // C$575B
    peakDate: '2021-03-31',
    qtContractionUsdTrillion: 0.22,
    qtContractionPct: -46.95,
    policyStance: 'QT',
    monthlyRunoffTarget: '満期再投資の停止による自然償還',
    reportFrequency: 'Weekly',
    officialReleaseCode: 'BOC Weekly Financial Statement',
    sourceUrl: 'https://www.bankofcanada.ca/rates/banking-and-financial-statistics/bank-of-canada-assets-and-liabilities-weekly-formerly-b2/',
    latestStatementDate: '2024-08-21',
    description: '先進国中最も速いペースでバランスシートを圧縮し、ピーク比で約47%の資産を削減。'
  }
];

// Historical Central Bank Assets (in Trillions USD, 2015-2024)
export const HISTORICAL_BALANCE_SHEETS = {
  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  series: {
    USA: [4.49, 4.45, 4.45, 4.06, 4.17, 7.36, 8.76, 8.55, 7.71, 7.18], // Fed
    EMU: [3.02, 3.86, 5.34, 5.38, 5.24, 8.53, 9.72, 8.48, 7.62, 7.12], // ECB
    JPN: [3.18, 4.08, 4.62, 5.04, 5.31, 6.84, 6.32, 5.51, 5.35, 5.16], // BOJ
    CHN: [4.89, 5.02, 5.58, 5.23, 5.21, 5.92, 6.22, 5.98, 6.31, 6.15], // PBOC
    GBR: [0.62, 0.53, 0.65, 0.63, 0.64, 1.18, 1.48, 1.25, 1.21, 1.15]  // BOE
  }
};
