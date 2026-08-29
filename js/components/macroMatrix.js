// Component: Central Bank & Macroeconomic Fact Matrix

import { CENTRAL_BANK_RATES } from '../data/centralBanks.js';
import { COUNTRIES, getCountryByIso3 } from '../data/countries.js';

export class MacroMatrixComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onSelectCountry = options.onSelectCountry || (() => {});
    this.onInspectSource = options.onInspectSource || (() => {});
    this.filterBloc = 'ALL';
    this.searchQuery = '';
    this.sortBy = 'rate';
    this.sortOrder = 'desc';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card macro-matrix-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge"><i data-lucide="landmark"></i></div>
            <div>
              <h3>中央銀行 政策金利＆主要マクロ指標マトリクス</h3>
              <p class="subtitle">公的機関（各国中央銀行・IMF）の公表一次データ</p>
            </div>
          </div>
          <div class="header-actions">
            <div class="search-box">
              <i data-lucide="search"></i>
              <input type="text" id="macro-search" placeholder="国名・中銀名で検索..." value="${this.searchQuery}" />
            </div>
            <div class="btn-group filter-bloc-group">
              <button class="btn btn-sm ${this.filterBloc === 'ALL' ? 'active' : ''}" data-bloc="ALL">すべて</button>
              <button class="btn btn-sm ${this.filterBloc === 'G7' ? 'active' : ''}" data-bloc="G7">G7</button>
              <button class="btn btn-sm ${this.filterBloc === 'G20' ? 'active' : ''}" data-bloc="G20">G20</button>
              <button class="btn btn-sm ${this.filterBloc === 'BRICS' ? 'active' : ''}" data-bloc="BRICS">BRICS</button>
              <button class="btn btn-sm ${this.filterBloc === 'OECD' ? 'active' : ''}" data-bloc="OECD">OECD</button>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="fact-table">
            <thead>
              <tr>
                <th data-sort="country" class="sortable">国・地域 <span class="sort-icon">${this._getSortIcon('country')}</span></th>
                <th data-sort="centralBank" class="sortable">中央銀行・政策金利名 <span class="sort-icon">${this._getSortIcon('centralBank')}</span></th>
                <th data-sort="rate" class="sortable text-right">政策金利 <span class="sort-icon">${this._getSortIcon('rate')}</span></th>
                <th data-sort="currentCpi" class="sortable text-right">最新CPI (物価) <span class="sort-icon">${this._getSortIcon('currentCpi')}</span></th>
                <th class="text-center">物価目標</th>
                <th data-sort="tenYearYield" class="sortable text-right">国債10年利回り <span class="sort-icon">${this._getSortIcon('tenYearYield')}</span></th>
                <th class="text-center">直近決定日</th>
                <th class="text-center">一次情報元</th>
              </tr>
            </thead>
            <tbody id="macro-tbody">
              ${this._renderRows()}
            </tbody>
          </table>
        </div>

        <div class="card-footer">
          <div class="fact-disclaimer">
            <i data-lucide="shield-check"></i>
            <span>本データは各中央銀行の公式声明文および公開市場操作記録から直接引用されています（メディアの独自試算・論評を含みません）。</span>
          </div>
          <div class="record-count">全 ${CENTRAL_BANK_RATES.length} 対象国</div>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  _getSortIcon(column) {
    if (this.sortBy !== column) return '↕';
    return this.sortOrder === 'asc' ? '▲' : '▼';
  }

  _renderRows() {
    let items = CENTRAL_BANK_RATES.map(cb => {
      const c = getCountryByIso3(cb.iso3) || {};
      return { ...cb, meta: c };
    });

    // Filtering by Bloc
    if (this.filterBloc !== 'ALL') {
      items = items.filter(item => item.meta.blocs && item.meta.blocs.includes(this.filterBloc));
    }

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      items = items.filter(item => 
        (item.country && item.country.toLowerCase().includes(q)) ||
        (item.meta.nameJa && item.meta.nameJa.toLowerCase().includes(q)) ||
        (item.centralBank && item.centralBank.toLowerCase().includes(q)) ||
        (item.iso3 && item.iso3.toLowerCase().includes(q))
      );
    }

    // Sorting
    items.sort((a, b) => {
      let valA = a[this.sortBy];
      let valB = b[this.sortBy];

      if (this.sortBy === 'country') {
        valA = a.meta.nameJa || a.country;
        valB = b.meta.nameJa || b.country;
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA === undefined || valA === null) valA = -99999;
      if (valB === undefined || valB === null) valB = -99999;

      if (typeof valA === 'string') {
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    if (items.length === 0) {
      return `
        <tr>
          <td colspan="8" class="text-center empty-state">
            <i data-lucide="alert-circle"></i>
            <p>条件に一致する公的データが見つかりませんでした。</p>
          </td>
        </tr>
      `;
    }

    return items.map(item => {
      const flag = item.meta.flag || '🌐';
      const nameJa = item.meta.nameJa || item.country;
      const directionBadge = this._getDirectionBadge(item.direction);
      const realRate = (item.rate - item.currentCpi).toFixed(2);
      const isPositiveReal = (item.rate - item.currentCpi) >= 0;

      return `
        <tr class="country-row" data-iso3="${item.iso3}">
          <td>
            <div class="country-cell" role="button" title="クリックして国の詳細ファクトを表示">
              <span class="flag-icon">${flag}</span>
              <div>
                <strong class="country-name">${nameJa}</strong>
                <span class="iso-code">${item.iso3} / ${item.meta.currency || ''}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="cb-cell">
              <span class="cb-name">${item.centralBank}</span>
              <span class="policy-name">${item.policyRateName}</span>
            </div>
          </td>
          <td class="text-right">
            <div class="rate-cell">
              <span class="rate-value">${item.rateDisplay}</span>
              ${directionBadge}
            </div>
          </td>
          <td class="text-right">
            <span class="cpi-value ${item.currentCpi > 4 ? 'cpi-high' : ''}">${item.currentCpi.toFixed(2)}%</span>
            <span class="real-rate ${isPositiveReal ? 'real-pos' : 'real-neg'}" title="実質政策金利 (政策金利 - CPI)">実質: ${realRate}%</span>
          </td>
          <td class="text-center">
            <span class="target-badge">${item.inflationTarget}</span>
          </td>
          <td class="text-right">
            <span class="yield-value">${item.tenYearYield.toFixed(2)}%</span>
          </td>
          <td class="text-center">
            <span class="date-tag">${item.lastChangeDate}</span>
          </td>
          <td class="text-center">
            <div class="source-actions">
              <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link-btn" title="公式発表元を開く (${item.sourceAgency})">
                <i data-lucide="external-link"></i> 一次ソース
              </a>
              <button class="inspect-btn" data-iso3="${item.iso3}" title="データ定義・JSONを検証">
                <i data-lucide="file-code"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  _getDirectionBadge(direction) {
    if (direction === 'HIKE') {
      return '<span class="badge badge-hike"><i data-lucide="trending-up"></i> 利上げ</span>';
    } else if (direction === 'CUT') {
      return '<span class="badge badge-cut"><i data-lucide="trending-down"></i> 利下げ</span>';
    }
    return '<span class="badge badge-hold"><i data-lucide="minus"></i> 据え置き</span>';
  }

  _bindEvents() {
    // Filter Buttons
    this.container.querySelectorAll('.filter-bloc-group button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterBloc = e.target.dataset.bloc;
        this.render();
      });
    });

    // Search Input
    const searchInput = this.container.querySelector('#macro-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const tbody = this.container.querySelector('#macro-tbody');
        if (tbody) {
          tbody.innerHTML = this._renderRows();
          if (window.lucide) window.lucide.createIcons();
          this._bindRowEvents();
        }
      });
    }

    // Sort Headers
    this.container.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (this.sortBy === col) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortBy = col;
          this.sortOrder = 'desc';
        }
        this.render();
      });
    });

    this._bindRowEvents();
  }

  _bindRowEvents() {
    // Row click for country detail
    this.container.querySelectorAll('.country-row .country-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const row = cell.closest('.country-row');
        const iso3 = row.dataset.iso3;
        this.onSelectCountry(iso3);
      });
    });

    // Inspect buttons
    this.container.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const iso3 = btn.dataset.iso3;
        const item = CENTRAL_BANK_RATES.find(cb => cb.iso3 === iso3);
        this.onInspectSource({
          title: `${item.country} - ${item.centralBank}`,
          type: 'Central Bank Policy Statement',
          sourceAgency: item.sourceAgency,
          sourceUrl: item.sourceUrl,
          minutesUrl: item.lastMeetingMinutesUrl,
          statementCode: item.statementCode,
          data: item
        });
      });
    });
  }
}
