// Official United Nations Resolutions & Roll-Call Voting Facts
// Sourced directly from the United Nations Digital Library (digitallibrary.un.org) & UN Dag Hammarskjöld Library.

export const UN_RESOLUTIONS = [
  {
    id: 'A/RES/ES-11/1',
    symbol: 'ES-11/1',
    session: '11th Emergency Special Session',
    title: 'Aggression against Ukraine',
    titleJa: 'ウクライナに対する侵略（緊急特別会合決議）',
    date: '2022-03-02',
    topic: 'Security & Sovereignty',
    documentUrl: 'https://digitallibrary.un.org/record/3959039',
    pdfUrl: 'https://undocs.org/A/RES/ES-11/1',
    summaryFact: 'Demanded that the Russian Federation immediately, completely and unconditionally withdraw all of its military forces from the territory of Ukraine within its internationally recognized borders.',
    voting: {
      inFavour: 141,
      against: 5,
      abstain: 35,
      nonVoting: 12
    },
    // Country Votes: 'Y' (In favour), 'N' (Against), 'A' (Abstain), '-' (Non-voting)
    votes: {
      USA: 'Y', JPN: 'Y', DEU: 'Y', GBR: 'Y', FRA: 'Y', CAN: 'Y', AUS: 'Y', CHE: 'Y',
      KOR: 'Y', SGP: 'Y', BRA: 'Y', IDN: 'Y', SAU: 'Y', TUR: 'Y', MEX: 'Y',
      CHN: 'A', IND: 'A', ZAF: 'A',
      RUS: 'N'
    }
  },
  {
    id: 'A/RES/ES-10/22',
    symbol: 'ES-10/22',
    session: '10th Emergency Special Session',
    title: 'Illegal Israeli actions in Occupied East Jerusalem and the rest of the Occupied Palestinian Territory',
    titleJa: 'パレスチナ情勢・即時停戦要求決議',
    date: '2023-12-12',
    topic: 'Middle East & Humanitarian',
    documentUrl: 'https://digitallibrary.un.org/record/4029415',
    pdfUrl: 'https://undocs.org/A/RES/ES-10/22',
    summaryFact: 'Demanded an immediate humanitarian ceasefire, the immediate and unconditional release of all hostages, and ensuring humanitarian access.',
    voting: {
      inFavour: 153,
      against: 10,
      abstain: 23,
      nonVoting: 7
    },
    votes: {
      JPN: 'Y', FRA: 'Y', CAN: 'Y', AUS: 'Y', CHE: 'Y', BRA: 'Y', CHN: 'Y', IND: 'Y',
      RUS: 'Y', SAU: 'Y', TUR: 'Y', ZAF: 'Y', IDN: 'Y', SGP: 'Y', MEX: 'Y', KOR: 'Y',
      USA: 'N',
      GBR: 'A', DEU: 'A'
    }
  },
  {
    id: 'A/RES/78/240',
    symbol: '78/240',
    session: '78th Regular Session',
    title: 'Seizing the opportunities of safe, secure and trustworthy artificial intelligence systems for sustainable development',
    titleJa: '持続可能な開発のための安全・安心・信頼できるAIシステムの機会活用',
    date: '2024-03-21',
    topic: 'Technology & Governance',
    documentUrl: 'https://digitallibrary.un.org/record/4038815',
    pdfUrl: 'https://undocs.org/A/RES/78/240',
    summaryFact: 'First landmark global resolution on Artificial Intelligence adopted by consensus (all 193 member states), sponsored by the United States and co-sponsored by over 120 nations.',
    voting: {
      inFavour: 193,
      against: 0,
      abstain: 0,
      nonVoting: 0,
      adoptedWithoutVote: true
    },
    votes: {
      USA: 'Y', JPN: 'Y', DEU: 'Y', GBR: 'Y', FRA: 'Y', CAN: 'Y', AUS: 'Y', CHE: 'Y',
      KOR: 'Y', SGP: 'Y', BRA: 'Y', IDN: 'Y', SAU: 'Y', TUR: 'Y', MEX: 'Y',
      CHN: 'Y', IND: 'Y', ZAF: 'Y', RUS: 'Y'
    }
  },
  {
    id: 'A/RES/78/140',
    symbol: '78/140',
    session: '78th Regular Session',
    title: 'Promotion of inclusive and effective international tax cooperation at the United Nations',
    titleJa: '国連における包括的かつ実効的な国際租税協力枠組みの推進',
    date: '2023-12-22',
    topic: 'International Taxation & Economy',
    documentUrl: 'https://digitallibrary.un.org/record/4030124',
    pdfUrl: 'https://undocs.org/A/RES/78/140',
    summaryFact: 'Decided to establish a Member State-led, open-ended ad hoc intergovernmental committee to draft terms of reference for a United Nations framework convention on international tax cooperation.',
    voting: {
      inFavour: 125,
      against: 48,
      abstain: 9,
      nonVoting: 11
    },
    votes: {
      BRA: 'Y', CHN: 'Y', IND: 'Y', IDN: 'Y', MEX: 'Y', RUS: 'Y', SAU: 'Y', ZAF: 'Y', SGP: 'Y',
      USA: 'N', JPN: 'N', GBR: 'N', DEU: 'N', FRA: 'N', CAN: 'N', AUS: 'N', CHE: 'N', KOR: 'N',
      TUR: 'A'
    }
  },
  {
    id: 'A/RES/78/7',
    symbol: '78/7',
    session: '78th Regular Session',
    title: 'Necessity of ending the economic, commercial and financial embargo imposed by the United States of America against Cuba',
    titleJa: 'キューバに対する経済・商業・金融封鎖の終了の必要性',
    date: '2023-11-02',
    topic: 'Trade & Sanctions',
    documentUrl: 'https://digitallibrary.un.org/record/4025912',
    pdfUrl: 'https://undocs.org/A/RES/78/7',
    summaryFact: 'Reiterated its call upon all States to refrain from promulgating and applying laws and measures such as the US Helms-Burton Act affecting sovereignty and legitimate commercial interests of third parties.',
    voting: {
      inFavour: 187,
      against: 2,
      abstain: 1,
      nonVoting: 3
    },
    votes: {
      JPN: 'Y', GBR: 'Y', DEU: 'Y', FRA: 'Y', CAN: 'Y', AUS: 'Y', CHE: 'Y', KOR: 'Y',
      BRA: 'Y', CHN: 'Y', IND: 'Y', IDN: 'Y', MEX: 'Y', RUS: 'Y', SAU: 'Y', TUR: 'Y', ZAF: 'Y', SGP: 'Y',
      USA: 'N',
      UKR: 'A'
    }
  }
];

export const MULTILATERAL_TREATIES = [
  {
    id: 'PARIS-AGREEMENT',
    name: 'Paris Agreement (UNFCCC)',
    nameJa: '気候変動パリ協定',
    depositary: 'Secretary-General of the United Nations',
    entryIntoForce: '2016-11-04',
    totalParties: 195,
    officialLink: 'https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=XXVII-7-d&chapter=27&clang=_en',
    statuses: {
      USA: 'Ratified (2016 / Rejoined 2021)',
      JPN: 'Ratified (2016)',
      DEU: 'Ratified (2016)',
      GBR: 'Ratified (2016)',
      FRA: 'Ratified (2016)',
      CHN: 'Ratified (2016)',
      IND: 'Ratified (2016)',
      BRA: 'Ratified (2016)',
      RUS: 'Accepted (2019)',
      CAN: 'Ratified (2016)',
      AUS: 'Ratified (2016)',
      KOR: 'Ratified (2016)'
    }
  },
  {
    id: 'ROME-STATUTE',
    name: 'Rome Statute of the International Criminal Court (ICC)',
    nameJa: '国際刑事裁判所規程 (ローマ規程)',
    depositary: 'Secretary-General of the United Nations',
    entryIntoForce: '2002-07-01',
    totalParties: 124,
    officialLink: 'https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=XVIII-10&chapter=18&clang=_en',
    statuses: {
      USA: 'Signed (2000, not ratified / Informational withdrawal 2002)',
      JPN: 'Acceded (2007)',
      DEU: 'Ratified (2000)',
      GBR: 'Ratified (2001)',
      FRA: 'Ratified (2000)',
      CAN: 'Ratified (2000)',
      AUS: 'Ratified (2002)',
      BRA: 'Ratified (2002)',
      KOR: 'Ratified (2002)',
      ZAF: 'Ratified (2000)',
      MEX: 'Ratified (2005)',
      CHN: 'Non-Signatory',
      IND: 'Non-Signatory',
      RUS: 'Signed (2000, intention not to become party stated 2016)'
    }
  },
  {
    id: 'NPT',
    name: 'Treaty on the Non-Proliferation of Nuclear Weapons (NPT)',
    nameJa: '核兵器不拡散条約 (NPT)',
    depositary: 'Russia, UK, USA',
    entryIntoForce: '1970-03-05',
    totalParties: 191,
    officialLink: 'https://www.un.org/disarmament/wmd/nuclear/npt/',
    statuses: {
      USA: 'Nuclear-Weapon State Party (1968/1970)',
      RUS: 'Nuclear-Weapon State Party (1968/1970)',
      GBR: 'Nuclear-Weapon State Party (1968/1970)',
      FRA: 'Nuclear-Weapon State Party (Acceded 1992)',
      CHN: 'Nuclear-Weapon State Party (Acceded 1992)',
      JPN: 'Non-Nuclear State Party (Ratified 1976)',
      DEU: 'Non-Nuclear State Party (Ratified 1975)',
      IND: 'Non-Party',
      PAK: 'Non-Party',
      ISR: 'Non-Party',
      PRK: 'Withdrew (2003)'
    }
  },
  {
    id: 'UNCLOS',
    name: 'United Nations Convention on the Law of the Sea (UNCLOS)',
    nameJa: '国連海洋法条約',
    depositary: 'Secretary-General of the United Nations',
    entryIntoForce: '1994-11-16',
    totalParties: 169,
    officialLink: 'https://www.un.org/depts/los/convention_agreements/convention_overview_convention.htm',
    statuses: {
      USA: 'Non-Party (Signed Part XI Agreement only)',
      JPN: 'Ratified (1996)',
      CHN: 'Ratified (1996)',
      DEU: 'Acceded (1994)',
      GBR: 'Acceded (1997)',
      FRA: 'Ratified (1996)',
      IND: 'Ratified (1995)',
      RUS: 'Ratified (1997)',
      BRA: 'Ratified (1988)',
      AUS: 'Ratified (1994)',
      CAN: 'Ratified (2003)'
    }
  }
];
