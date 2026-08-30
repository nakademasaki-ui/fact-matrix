// Component: Multilateral Global News Wire & Cross-Perspective Analyzer

import { REGIONAL_BLOCS, GLOBAL_NEWS_ITEMS, CROSS_COMPARISON_TOPICS } from '../data/globalNews.js';

export class GlobalNewsComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.selectedBloc = 'ALL'; // 'ALL', 'WEST', 'MIDEAST', 'CHINA', 'RUSSIA', 'ASIA'
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.activeViewTab = 'FEED'; // 'FEED' or 'CROSS_COMPARISON'
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card news-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge icon-badge-cyan"><i data-lucide="radio"></i></div>
            <div>
              <h3>多極型 世界主要報道・公式通信社ヘッドライン</h3>
              <p class="subtitle">西側・中東・中国・ロシア・アジアの主要通信社による事実関係・公的発表の多角収集</p>
            </div>
          </div>

          <div class="header-actions">
            <div class="btn-group">
              <button class="btn btn-sm ${this.activeViewTab === 'FEED' ? 'active' : ''}" data-news-tab="FEED">
                <i data-lucide="list"></i> 報道タイムライン
              </button>
              <button class="btn btn-sm ${this.activeViewTab === 'CROSS_COMPARISON' ? 'active' : ''}" data-news-tab="CROSS_COMPARISON">
                <i data-lucide="split"></i> 同一テーマ 多極視点対比
              </button>
            </div>
            <button class="btn btn-sm btn-outline-cyan" id="news-refresh-trigger" title="通信社一次速報を最新取得">
              <i data-lucide="refresh-cw"></i> <span>最新化</span>
            </button>
          </div>
        </div>

        <!-- Regional Bloc & Category Filter Bar -->
        <div class="news-filter-bar">
          <div class="filter-group-region">
            <span class="filter-lbl">発信極・地域:</span>
            <div class="btn-group">
              <button class="btn btn-sm ${this.selectedBloc === 'ALL' ? 'active' : ''}" data-bloc="ALL">🌍 すべて</button>
              <button class="btn btn-sm ${this.selectedBloc === 'WEST' ? 'active' : ''}" data-bloc="WEST">🇺🇸🇬🇧 西側 (West)</button>
              <button class="btn btn-sm ${this.selectedBloc === 'MIDEAST' ? 'active' : ''}" data-bloc="MIDEAST">🇶🇦🇸🇦 中東 (Mideast)</button>
              <button class="btn btn-sm ${this.selectedBloc === 'CHINA' ? 'active' : ''}" data-bloc="CHINA">🇨🇳 中国 (China)</button>
              <button class="btn btn-sm ${this.selectedBloc === 'RUSSIA' ? 'active' : ''}" data-bloc="RUSSIA">🇷🇺 ロシア (Russia)</button>
              <button class="btn btn-sm ${this.selectedBloc === 'ASIA' ? 'active' : ''}" data-bloc="ASIA">🇯🇵🇸🇬 アジア (Asia)</button>
            </div>
          </div>

          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="news-search-input" placeholder="キーワード・機関名で検索..." value="${this.searchQuery}" />
          </div>
        </div>

        <div class="news-main-body">
          ${this.activeViewTab === 'FEED' ? this._renderNewsFeed() : this._renderCrossComparison()}
        </div>

        <div class="card-footer">
          <div class="fact-disclaimer">
            <i data-lucide="shield-check"></i>
            <span>主観的な社説や論評を排し、各通信社（Reuters、AP、新華社、タス通信、共同通信等）が公表した客観的事実および公式発表のみを掲載しています。</span>
          </div>
          <div class="record-count">全 ${GLOBAL_NEWS_ITEMS.length} 配信レポート</div>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  _renderNewsFeed() {
    let items = [...GLOBAL_NEWS_ITEMS];

    if (this.selectedBloc !== 'ALL') {
      items = items.filter(i => i.bloc === this.selectedBloc);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      items = items.filter(i => 
        i.titleJa.toLowerCase().includes(q) ||
        i.titleEn.toLowerCase().includes(q) ||
        i.factSummary.toLowerCase().includes(q) ||
        i.outlet.toLowerCase().includes(q)
      );
    }

    if (items.length === 0) {
      return `
        <div class="empty-news-state">
          <i data-lucide="alert-circle"></i>
          <p>該当する条件の一次報道は見つかりませんでした。</p>
        </div>
      `;
    }

    return `
      <div class="news-feed-grid">
        ${items.map(item => {
          const blocMeta = REGIONAL_BLOCS[item.bloc];
          return `
            <div class="news-item-card" data-bloc="${item.bloc}">
              <div class="news-item-header">
                <div class="outlet-info">
                  <span class="flag-icon">${item.flag}</span>
                  <div>
                    <strong class="outlet-name">${item.outlet}</strong>
                    <span class="outlet-type">${item.outletType}</span>
                  </div>
                </div>
                <div class="news-meta-badges">
                  <span class="badge badge-bloc-tag" style="background: ${blocMeta.color}15; color: ${blocMeta.color}; border: 1px solid ${blocMeta.color}35;">
                    ${blocMeta.nameJa}
                  </span>
                  <span class="news-time">${item.publishedAt}</span>
                </div>
              </div>

              <div class="news-item-content">
                <h4 class="news-title-ja">${item.titleJa}</h4>
                <p class="news-title-en"><em>${item.titleEn}</em></p>
                <div class="news-fact-box">
                  <strong>客観事実要約:</strong> ${item.factSummary}
                </div>
              </div>

              <div class="news-item-footer">
                <span class="source-ref-badge" title="公式引用資料">
                  <i data-lucide="file-check-2"></i> ${item.officialSourceRef}
                </span>
                <div class="news-actions">
                  <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="source-link-btn" title="通信社記事を開く (${item.urlDomain})">
                    <i data-lucide="external-link"></i> ${item.urlDomain}
                  </a>
                  <button class="inspect-btn inspect-news-btn" data-news-id="${item.id}" title="生データ検証">
                    <i data-lucide="file-code"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  _renderCrossComparison() {
    return `
      <div class="cross-comparison-container">
        <div class="cross-intro-box">
          <i data-lucide="split"></i>
          <div>
            <strong>同一国際情勢に対する「多極的視点」の対比</strong>
            <p>西側通信社、中東メディア、中国新華社、ロシアタス通信、アジア通信社が、同一のグローバル事象をどのように伝えているかを並列比較します。</p>
          </div>
        </div>

        <div class="topics-list">
          ${CROSS_COMPARISON_TOPICS.map(topic => `
            <div class="topic-card">
              <div class="topic-card-header">
                <h4>${topic.titleJa}</h4>
                <span class="topic-date">${topic.date}</span>
              </div>
              <div class="perspectives-grid">
                ${topic.perspectives.map(p => {
                  const blocMeta = REGIONAL_BLOCS[p.bloc];
                  return `
                    <div class="perspective-card" style="border-top: 3px solid ${blocMeta.color};">
                      <div class="p-header">
                        <span class="p-flag">${p.flag}</span>
                        <div>
                          <strong class="p-outlet">${p.outlet}</strong>
                          <span class="p-bloc-name">${blocMeta.nameJa}</span>
                        </div>
                      </div>
                      <div class="p-stance-title">${p.stanceTitle}</div>
                      <p class="p-quote">"${p.quote}"</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  _bindEvents() {
    // View Tab toggle (Feed vs Cross Comparison)
    this.container.querySelectorAll('[data-news-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnElem = e.target.closest('button');
        this.activeViewTab = btnElem.dataset.newsTab;
        this.render();
      });
    });

    // News refresh trigger
    const newsRefresh = this.container.querySelector('#news-refresh-trigger');
    if (newsRefresh) {
      newsRefresh.addEventListener('click', () => {
        const globalSyncBtn = document.getElementById('manual-sync-btn');
        if (globalSyncBtn) globalSyncBtn.click();
      });
    }

    // Bloc filter buttons
    this.container.querySelectorAll('[data-bloc]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnElem = e.target.closest('button');
        this.selectedBloc = btnElem.dataset.bloc;
        this.render();
      });
    });

    // Search Input
    const searchInput = this.container.querySelector('#news-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const bodyElem = this.container.querySelector('.news-main-body');
        if (bodyElem && this.activeViewTab === 'FEED') {
          bodyElem.innerHTML = this._renderNewsFeed();
          if (window.lucide) window.lucide.createIcons();
          this._bindItemEvents();
        }
      });
    }

    this._bindItemEvents();
  }

  _bindItemEvents() {
    // Inspect News JSON
    this.container.querySelectorAll('.inspect-news-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.newsId;
        const item = GLOBAL_NEWS_ITEMS.find(n => n.id === id);
        this.onInspectSource({
          title: `${item.outlet} - 一次報道速報`,
          type: 'Official Wire Release (5W1H Fact)',
          sourceAgency: item.outlet,
          sourceUrl: item.url,
          statementCode: item.officialSourceRef,
          data: item
        });
      });
    });
  }
}
