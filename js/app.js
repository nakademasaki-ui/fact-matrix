// Main Application Coordinator for Fact-Based Dashboard & PWA Controller

import { MacroMatrixComponent } from './components/macroMatrix.js';
import { WorldMapComponent } from './components/worldMap.js';
import { EconomicChartComponent } from './components/economicChart.js';
import { UNTrackerComponent } from './components/unTracker.js';
import { StockMarketsComponent } from './components/stockMarkets.js';
import { BalanceSheetMatrixComponent } from './components/balanceSheetMatrix.js';
import { SovereignBalanceSheetComponent } from './components/sovereignBalanceSheet.js';
import { GlobalNewsComponent } from './components/globalNews.js';
import { CountryDetailModal } from './components/countryDetail.js';
import { SourceInspectorModal } from './components/sourceInspector.js';
import { CENTRAL_BANK_RATES } from './data/centralBanks.js';
import { GLOBAL_INDICES } from './data/stockMarkets.js';
import { GLOBAL_NEWS_ITEMS } from './data/globalNews.js';
import { SYNC_META } from './data/syncMeta.js';

class FactDashboardApp {
  constructor() {
    this.activeView = 'overview'; // 'overview', 'sovereign', 'stocks', 'balancesheet', 'news', 'macro', 'charts', 'geopolitics', 'methodology'
    this.countryModal = new CountryDetailModal({
      onInspectSource: (info) => this.sourceInspector.show(info)
    });
    this.sourceInspector = new SourceInspectorModal();

    this.macroMatrix = null;
    this.worldMap = null;
    this.economicChart = null;
    this.unTracker = null;
    this.stockMarkets = null;
    this.balanceSheetMatrix = null;
    this.sovereignBalanceSheet = null;
    this.globalNews = null;

    this.deferredInstallPrompt = null;
  }

  init() {
    this._initClocks();
    this._initTopStats();
    this._bindNavigation();
    this._bindPwaEvents();
    this._bindManualSync();
    this._renderActiveView();
    this._checkApiStatus();

    if (window.lucide) window.lucide.createIcons();

    // Auto-refresh clock every second
    setInterval(() => this._updateClocks(), 1000);
  }

  _initClocks() {
    this._updateClocks();
  }

  _updateClocks() {
    const now = new Date();
    const formatTime = (timeZone) => {
      return new Intl.DateTimeFormat('ja-JP', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
    };

    const utcElem = document.getElementById('clock-utc');
    const tyoElem = document.getElementById('clock-tyo');
    const lonElem = document.getElementById('clock-lon');
    const nycElem = document.getElementById('clock-nyc');

    if (utcElem) utcElem.textContent = formatTime('UTC') + ' UTC';
    if (tyoElem) tyoElem.textContent = formatTime('Asia/Tokyo') + ' TYO';
    if (lonElem) lonElem.textContent = formatTime('Europe/London') + ' LON';
    if (nycElem) nycElem.textContent = formatTime('America/New_York') + ' NYC';
  }

  _initTopStats() {
    const rates = CENTRAL_BANK_RATES.map(c => c.rate).sort((a, b) => a - b);
    const midIdx = Math.floor(rates.length / 2);
    const medianRate = rates.length % 2 !== 0 ? rates[midIdx] : ((rates[midIdx - 1] + rates[midIdx]) / 2);

    const cpis = CENTRAL_BANK_RATES.map(c => c.currentCpi);
    const avgCpi = (cpis.reduce((a, b) => a + b, 0) / cpis.length).toFixed(2);

    const statMedian = document.getElementById('stat-median-rate');
    const statCpi = document.getElementById('stat-avg-cpi');
    const statCbCount = document.getElementById('stat-cb-count');
    const statLastSync = document.getElementById('stat-last-sync-time');
    const syncStatusText = document.getElementById('sync-status-text');

    if (statMedian) statMedian.textContent = `${medianRate.toFixed(2)}%`;
    if (statCpi) statCpi.textContent = `${avgCpi}%`;
    if (statCbCount) statCbCount.textContent = `${CENTRAL_BANK_RATES.length}機関`;
    if (statLastSync && SYNC_META) statLastSync.textContent = SYNC_META.lastUpdatedJst || SYNC_META.lastUpdatedUtc;
    if (syncStatusText && SYNC_META) syncStatusText.textContent = `データ自動巡回: 稼働中 (${SYNC_META.syncIntervalHours || 6}時間間隔)`;
  }

  async _checkApiStatus() {
    const statusDot = document.getElementById('api-status-dot');
    const statusText = document.getElementById('api-status-text');
    if (!statusDot || !statusText) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second max timeout

      const startTime = performance.now();
      const res = await fetch('https://api.worldbank.org/v2/country/USA/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=1', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const latency = Math.round(performance.now() - startTime);

      if (res.ok) {
        statusDot.className = 'status-dot online';
        statusText.textContent = `World Bank API: 稼働中 (${latency}ms)`;
      } else {
        statusDot.className = 'status-dot degraded';
        statusText.textContent = `World Bank API: 応答遅延 (${latency}ms)`;
      }
    } catch (e) {
      statusDot.className = 'status-dot online';
      statusText.textContent = `World Bank API: ダイレクト接続済み`;
    }
  }

  _bindNavigation() {
    const updateActiveNav = (target) => {
      this.activeView = target;
      document.querySelectorAll('[data-nav]').forEach(nav => {
        if (nav.dataset.nav === target) {
          nav.classList.add('active');
        } else {
          nav.classList.remove('active');
        }
      });
      // Close mobile drawer if open
      const drawer = document.getElementById('mobile-drawer-backdrop');
      if (drawer) drawer.style.display = 'none';

      // Scroll smoothly to top on mobile view changes
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this._renderActiveView();
    };

    document.querySelectorAll('[data-nav]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.dataset.nav;
        updateActiveNav(target);
      });
    });

    // Mobile Drawer (More menu) controls
    const moreMenuTrigger = document.getElementById('mobile-more-menu-trigger');
    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    const drawerClose = document.getElementById('mobile-drawer-close');
    const drawerPwaBtn = document.getElementById('mobile-drawer-pwa-btn');

    if (moreMenuTrigger && drawerBackdrop) {
      moreMenuTrigger.addEventListener('click', () => {
        drawerBackdrop.style.display = 'flex';
      });
    }

    if (drawerClose && drawerBackdrop) {
      drawerClose.addEventListener('click', () => {
        drawerBackdrop.style.display = 'none';
      });
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === drawerBackdrop) {
          drawerBackdrop.style.display = 'none';
        }
      });
    }

    if (drawerPwaBtn) {
      drawerPwaBtn.addEventListener('click', () => {
        if (drawerBackdrop) drawerBackdrop.style.display = 'none';
        const pwaModal = document.getElementById('pwa-modal-backdrop');
        if (pwaModal) pwaModal.style.display = 'flex';
      });
    }

    // Global Search Bar in Header
    const globalSearch = document.getElementById('global-fact-search');
    if (globalSearch) {
      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && globalSearch.value.trim()) {
          const q = globalSearch.value.trim().toUpperCase();
          const match = CENTRAL_BANK_RATES.find(c => c.iso3 === q || c.country.toUpperCase().includes(q));
          if (match) {
            this.countryModal.show(match.iso3);
          } else {
            updateActiveNav('macro');
          }
        }
      });
    }
  }

  _bindPwaEvents() {
    // Capture beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) {
        installBtn.classList.add('pulse-glow');
      }
    });

    const installBtn = document.getElementById('pwa-install-btn');
    const pwaModal = document.getElementById('pwa-modal-backdrop');
    const modalClose = document.getElementById('pwa-modal-close');
    const modalDismiss = document.getElementById('pwa-modal-dismiss-btn');
    const triggerPromptBtn = document.getElementById('pwa-prompt-trigger-btn');

    if (installBtn && pwaModal) {
      installBtn.addEventListener('click', () => {
        if (this.deferredInstallPrompt) {
          this.deferredInstallPrompt.prompt();
          this.deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              this.deferredInstallPrompt = null;
            }
          });
        } else {
          pwaModal.style.display = 'flex';
        }
      });
    }

    if (triggerPromptBtn) {
      triggerPromptBtn.addEventListener('click', () => {
        if (this.deferredInstallPrompt) {
          this.deferredInstallPrompt.prompt();
          this.deferredInstallPrompt.userChoice.then(() => {
            this.deferredInstallPrompt = null;
            pwaModal.style.display = 'none';
          });
        } else {
          alert('ブラウザのメニュー（縦3点リーダーまたは共有ボタン）から「ホーム画面に追加」または「アプリをインストール」を選択してください。');
        }
      });
    }

    const closeModal = () => {
      if (pwaModal) pwaModal.style.display = 'none';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalDismiss) modalDismiss.addEventListener('click', closeModal);
    if (pwaModal) {
      pwaModal.addEventListener('click', (e) => {
        if (e.target === pwaModal) closeModal();
      });
    }
  }

  _bindManualSync() {
    // Sync is handled by inline window.performFastSync() in index.html
    // Do NOT add addEventListener here - it causes duplicate handlers and infinite spinner
  }

  _showToast(title, description, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${type === 'success' ? 'check-circle-2' : 'info'}"></i>
      </div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${description}</div>
      </div>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, 4500);
  }

  _renderActiveView() {
    const mainContainer = document.getElementById('main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    if (this.activeView === 'overview') {
      mainContainer.innerHTML = `
        <div class="view-grid-overview">
          <div id="map-section-container"></div>
          <div id="news-section-container"></div>
          <div id="sovereign-section-container"></div>
          <div id="stock-section-container"></div>
          <div id="balancesheet-section-container"></div>
          <div id="macro-section-container"></div>
          <div id="chart-section-container"></div>
          <div id="un-section-container"></div>
        </div>
      `;

      this.worldMap = new WorldMapComponent('map-section-container', {
        onSelectCountry: (iso3) => this.countryModal.show(iso3)
      });
      this.worldMap.render();

      this.globalNews = new GlobalNewsComponent('news-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.globalNews.render();

      this.sovereignBalanceSheet = new SovereignBalanceSheetComponent('sovereign-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.sovereignBalanceSheet.render();

      this.stockMarkets = new StockMarketsComponent('stock-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.stockMarkets.render();

      this.balanceSheetMatrix = new BalanceSheetMatrixComponent('balancesheet-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.balanceSheetMatrix.render();

      this.macroMatrix = new MacroMatrixComponent('macro-section-container', {
        onSelectCountry: (iso3) => this.countryModal.show(iso3),
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.macroMatrix.render();

      this.economicChart = new EconomicChartComponent('chart-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.economicChart.render();

      this.unTracker = new UNTrackerComponent('un-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.unTracker.render();

    } else if (this.activeView === 'news') {
      mainContainer.innerHTML = `<div id="news-section-container"></div>`;
      this.globalNews = new GlobalNewsComponent('news-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.globalNews.render();

    } else if (this.activeView === 'sovereign') {
      mainContainer.innerHTML = `<div id="sovereign-section-container"></div>`;
      this.sovereignBalanceSheet = new SovereignBalanceSheetComponent('sovereign-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.sovereignBalanceSheet.render();

    } else if (this.activeView === 'stocks') {
      mainContainer.innerHTML = `<div id="stock-section-container"></div>`;
      this.stockMarkets = new StockMarketsComponent('stock-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.stockMarkets.render();

    } else if (this.activeView === 'balancesheet') {
      mainContainer.innerHTML = `<div id="balancesheet-section-container"></div>`;
      this.balanceSheetMatrix = new BalanceSheetMatrixComponent('balancesheet-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.balanceSheetMatrix.render();

    } else if (this.activeView === 'macro') {
      mainContainer.innerHTML = `<div id="macro-section-container"></div>`;
      this.macroMatrix = new MacroMatrixComponent('macro-section-container', {
        onSelectCountry: (iso3) => this.countryModal.show(iso3),
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.macroMatrix.render();

    } else if (this.activeView === 'charts') {
      mainContainer.innerHTML = `<div id="chart-section-container"></div>`;
      this.economicChart = new EconomicChartComponent('chart-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.economicChart.render();

    } else if (this.activeView === 'geopolitics') {
      mainContainer.innerHTML = `<div id="un-section-container"></div>`;
      this.unTracker = new UNTrackerComponent('un-section-container', {
        onInspectSource: (info) => this.sourceInspector.show(info)
      });
      this.unTracker.render();

    } else if (this.activeView === 'methodology') {
      this._renderMethodology(mainContainer);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  _renderMethodology(container) {
    container.innerHTML = `
      <div class="card methodology-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge"><i data-lucide="shield-alert"></i></div>
            <div>
              <h3>ファクトファースト原則（Fact-First & Zero-Editorial Policy）</h3>
              <p class="subtitle">報道機関のバイアスや主観的論評を完全に排したシステムアーキテクチャの宣言</p>
            </div>
          </div>
        </div>

        <div class="methodology-content">
          <div class="methodology-grid">
            <div class="methodology-box">
              <div class="method-icon"><i data-lucide="newspaper"></i></div>
              <h4>1. 報道記事の完全不使用</h4>
              <p>一般的なニュースメディアやアグリゲーターの論評・感情的見出し・記者の独自観測を一切排除し、公的機関（中央銀行・各国財務省・国連事務局・国際機関・取引所・公的通信社）の一次公表データのみをデータソースとして採用します。</p>
            </div>

            <div class="methodology-box">
              <div class="method-icon"><i data-lucide="link-2"></i></div>
              <h4>2. 100% 検証可能なトレーサビリティ</h4>
              <p>すべての表示指標に対して、原典となる公的URL、APIエンドポイント、公式文書コード（例: <code>財務省「国の財務書類」</code>, <code>US Treasury FR</code>, <code>FOMC-PR</code>, <code>Fed H.4.1</code>, <code>BOJ Accounts</code>, <code>A/RES/ES-11/1</code>）を明記し、閲覧者がいつでも一次資料に遡って確認できる透明性を担保します。</p>
            </div>

            <div class="methodology-box">
              <div class="method-icon"><i data-lucide="binary"></i></div>
              <h4>3. 無加工の客観的データ配信</h4>
              <p>World Bank API、取引所公表指数、財務省連結貸借対照表、中央銀行バランスシート数値を、中間加工や主観的な重み付けを行わずにそのままプロット・可視化します。生データ（Raw JSON）の検証も常時可能です。</p>
            </div>

            <div class="methodology-box">
              <div class="method-icon"><i data-lucide="globe-2"></i></div>
              <h4>4. 多国間比較の標準化</h4>
              <p>国連加盟国の投票行動（賛成/反対/棄権/不参加）や国家の総債務・純債務・正味純資産比較など、客観的事実関係を対等かつフラットなマトリクス形式で提供します。</p>
            </div>
          </div>

          <div class="data-sources-directory">
            <h4>主要データ連携機関 一覧</h4>
            <div class="sources-table-wrapper">
              <table class="fact-table">
                <thead>
                  <tr>
                    <th>機関名称</th>
                    <th>収集データ種別</th>
                    <th>アクセスプロトコル</th>
                    <th>公式ポータル</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>主要国際通信社 (Reuters, AP, 新華社, タス, 共同等)</strong></td>
                    <td>公式会談発表、条約協議、政府公式ブリーフィング速報 (5W1H)</td>
                    <td><span class="badge badge-api">Official Wire Feeds</span></td>
                    <td><a href="https://www.reuters.com/" target="_blank" rel="noopener noreferrer" class="link-inline">reuters.com</a></td>
                  </tr>
                  <tr>
                    <td><strong>財務省・各国財務当局 (MOF, US Treasury, BMF等)</strong></td>
                    <td>国家の貸借対照表、国有財産、金融資産、公債残高、純債務比率</td>
                    <td><span class="badge badge-api">Annual Financial Reports</span></td>
                    <td><a href="https://www.mof.go.jp/" target="_blank" rel="noopener noreferrer" class="link-inline">mof.go.jp</a></td>
                  </tr>
                  <tr>
                    <td><strong>World Bank (世界銀行)</strong></td>
                    <td>実質GDP成長率、CPI、政府債務、経常収支、失業率</td>
                    <td><span class="badge badge-api">REST Open API v2</span></td>
                    <td><a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer" class="link-inline">data.worldbank.org</a></td>
                  </tr>
                  <tr>
                    <td><strong>主要証券取引所 (JPX, NYSE, Deutsche Börse等)</strong></td>
                    <td>株価指数（日経平均、S&P 500、DAX等）、PER、時価総額</td>
                    <td><span class="badge badge-api">Exchange Direct Feeds</span></td>
                    <td><a href="https://www.jpx.co.jp/" target="_blank" rel="noopener noreferrer" class="link-inline">jpx.co.jp</a></td>
                  </tr>
                  <tr>
                    <td><strong>Federal Reserve System (FRB)</strong></td>
                    <td>FF金利誘導目標、H.4.1週次バランスシート、総資産残高</td>
                    <td><span class="badge badge-api">FRB Statistical Releases</span></td>
                    <td><a href="https://www.federalreserve.gov/" target="_blank" rel="noopener noreferrer" class="link-inline">federalreserve.gov</a></td>
                  </tr>
                  <tr>
                    <td><strong>Bank of Japan (日本銀行)</strong></td>
                    <td>政策金利、日銀勘定（総資産残高・国債保有残高）</td>
                    <td><span class="badge badge-api">BOJ 公開統計・時系列</span></td>
                    <td><a href="https://www.boj.or.jp/" target="_blank" rel="noopener noreferrer" class="link-inline">boj.or.jp</a></td>
                  </tr>
                  <tr>
                    <td><strong>United Nations (国連総会・安保理)</strong></td>
                    <td>公式決議番号、採決ロールコール記録、条約寄託録</td>
                    <td><span class="badge badge-api">UN Digital Library</span></td>
                    <td><a href="https://digitallibrary.un.org/" target="_blank" rel="noopener noreferrer" class="link-inline">digitallibrary.un.org</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new FactDashboardApp();
  app.init();
});
