// Component: Global Stock Market Indices & Capitalization Analyzer

import { GLOBAL_INDICES, HISTORICAL_INDICES_PERFORMANCE } from '../data/stockMarkets.js';

export class StockMarketsComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.chartInstance = null;
    this.selectedIndices = ['USA', 'JPN', 'DEU', 'CHN', 'IND'];
    this.sortBy = 'ytdReturn';
    this.sortOrder = 'desc';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card stock-markets-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge icon-badge-cyan"><i data-lucide="trending-up"></i></div>
            <div>
              <h3>世界主要株式市場・株価指数＆時価総額ファクト</h3>
              <p class="subtitle">公的取引所・指数算出機関公表の株価指数・PER・対GDP時価総額比率</p>
            </div>
          </div>

          <div class="header-actions">
            <div class="btn-group">
              <button class="btn btn-sm active" id="btn-show-chart"><i data-lucide="line-chart"></i> 相対推移チャート</button>
            </div>
          </div>
        </div>

        <!-- Quick Summary Cards for Key Indices -->
        <div class="stock-cards-grid">
          ${GLOBAL_INDICES.slice(0, 4).map(idx => {
            const isPos = idx.ytdReturn >= 0;
            return `
              <div class="stock-index-card">
                <div class="stock-card-top">
                  <div class="stock-card-title">
                    <span class="flag">${idx.flag}</span>
                    <div>
                      <strong>${idx.name}</strong>
                      <span class="stock-sym">${idx.code} (${idx.exchange})</span>
                    </div>
                  </div>
                  <span class="badge ${isPos ? 'badge-cut' : 'badge-hike'}">
                    ${isPos ? '+' : ''}${idx.ytdReturn.toFixed(2)}% YTD
                  </span>
                </div>
                <div class="stock-card-value">
                  ${idx.currentLevel.toLocaleString()} <span class="currency">${idx.currency}</span>
                </div>
                <div class="stock-card-metrics">
                  <div class="m-item"><span>PER:</span> <strong>${idx.peRatio}倍</strong></div>
                  <div class="m-item"><span>1年騰落:</span> <strong class="${idx.oneYearReturn >= 0 ? 'color-pos' : 'color-neg'}">${idx.oneYearReturn > 0 ? '+' : ''}${idx.oneYearReturn}%</strong></div>
                  <div class="m-item"><span>時価総額/GDP:</span> <strong>${idx.marketCapToGdp}%</strong></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Normalized Multi-Year Index Performance Chart -->
        <div class="chart-section-wrapper">
          <div class="chart-header-sub">
            <div>
              <h4 class="sub-section-title"><i data-lucide="activity"></i> 主要市場の累積相対リターン推移 (2019年末 = 100)</h4>
              <p class="chart-sub-note">配当非再投資の公的価格指数ベース・各国通貨建て正規化比較</p>
            </div>
            <div class="chips-list">
              ${GLOBAL_INDICES.map(idx => {
                const isSelected = this.selectedIndices.includes(idx.countryIso3);
                return `
                  <button class="chip ${isSelected ? 'active' : ''}" data-stock-iso3="${idx.countryIso3}">
                    <span>${idx.flag}</span> ${idx.code}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          <div class="chart-canvas-box">
            <canvas id="stock-performance-canvas"></canvas>
          </div>
        </div>

        <!-- Full Indices Fact Table -->
        <div class="table-responsive">
          <table class="fact-table">
            <thead>
              <tr>
                <th data-sort="name" class="sortable">指数名称 / 国 <span class="sort-icon">${this._getSortIcon('name')}</span></th>
                <th>公的算出機関 / 取引所</th>
                <th data-sort="currentLevel" class="sortable text-right">最新値 <span class="sort-icon">${this._getSortIcon('currentLevel')}</span></th>
                <th data-sort="ytdReturn" class="sortable text-right">年初来騰落 (YTD) <span class="sort-icon">${this._getSortIcon('ytdReturn')}</span></th>
                <th data-sort="oneYearReturn" class="sortable text-right">1年騰落率 <span class="sort-icon">${this._getSortIcon('oneYearReturn')}</span></th>
                <th data-sort="peRatio" class="sortable text-right">実績PER <span class="sort-icon">${this._getSortIcon('peRatio')}</span></th>
                <th data-sort="marketCapToGdp" class="sortable text-right">時価総額/GDP比 <span class="sort-icon">${this._getSortIcon('marketCapToGdp')}</span></th>
                <th class="text-center">一次情報元</th>
              </tr>
            </thead>
            <tbody>
              ${this._renderTableRows()}
            </tbody>
          </table>
        </div>

        <div class="card-footer">
          <div class="fact-disclaimer">
            <i data-lucide="shield-check"></i>
            <span>各指数の公表値・構成銘柄は、取引所（JPX、NYSE、Deutsche Börse等）の公表基準データに基づきます。</span>
          </div>
          <div class="record-count">全 ${GLOBAL_INDICES.length} 主要指数</div>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
    this._renderChart();
  }

  _getSortIcon(column) {
    if (this.sortBy !== column) return '↕';
    return this.sortOrder === 'asc' ? '▲' : '▼';
  }

  _renderTableRows() {
    let items = [...GLOBAL_INDICES];

    items.sort((a, b) => {
      let valA = a[this.sortBy];
      let valB = b[this.sortBy];

      if (typeof valA === 'string') {
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return items.map(idx => {
      const isPos = idx.ytdReturn >= 0;
      const is1YPos = idx.oneYearReturn >= 0;
      return `
        <tr>
          <td>
            <div class="country-cell">
              <span class="flag-icon">${idx.flag}</span>
              <div>
                <strong class="country-name">${idx.name}</strong>
                <span class="iso-code">${idx.symbol} / ${idx.country}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="cb-cell">
              <span class="cb-name">${idx.provider}</span>
              <span class="policy-name">${idx.exchange}</span>
            </div>
          </td>
          <td class="text-right">
            <span class="rate-value">${idx.currentLevel.toLocaleString()} ${idx.currency}</span>
          </td>
          <td class="text-right">
            <span class="badge ${isPos ? 'badge-cut' : 'badge-hike'}">
              ${isPos ? '+' : ''}${idx.ytdReturn.toFixed(2)}%
            </span>
          </td>
          <td class="text-right">
            <span class="rate-value ${is1YPos ? 'color-pos' : 'color-neg'}">
              ${is1YPos ? '+' : ''}${idx.oneYearReturn.toFixed(2)}%
            </span>
          </td>
          <td class="text-right">
            <span class="yield-value">${idx.peRatio.toFixed(1)}倍</span>
          </td>
          <td class="text-right">
            <span class="target-badge">${idx.marketCapToGdp.toFixed(1)}%</span>
          </td>
          <td class="text-center">
            <div class="source-actions">
              <a href="${idx.officialUrl}" target="_blank" rel="noopener noreferrer" class="source-link-btn" title="公式指数ポータルを開く">
                <i data-lucide="external-link"></i> 取引所公表
              </a>
              <button class="inspect-btn inspect-stock-btn" data-symbol="${idx.symbol}" title="データ検証">
                <i data-lucide="file-code"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  _renderChart() {
    const canvas = this.container.querySelector('#stock-performance-canvas');
    if (!canvas || !window.Chart) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const colors = {
      USA: '#38bdf8',
      JPN: '#00f59b',
      DEU: '#f59e0b',
      GBR: '#ec4899',
      CHN: '#ef4444',
      IND: '#10b981',
      BRA: '#a855f7',
      EMU: '#818cf8'
    };

    const labels = HISTORICAL_INDICES_PERFORMANCE.years.map(y => `${y}年`);

    const datasets = this.selectedIndices.map(iso3 => {
      const idx = GLOBAL_INDICES.find(i => i.countryIso3 === iso3);
      const color = colors[iso3] || '#94a3b8';
      const series = HISTORICAL_INDICES_PERFORMANCE.series[iso3] || [];

      return {
        label: `${idx ? idx.flag : ''} ${idx ? idx.name : iso3}`,
        data: series,
        borderColor: color,
        backgroundColor: color + '15',
        borderWidth: 2.5,
        pointBackgroundColor: color,
        pointBorderColor: '#0b0f19',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.25
      };
    });

    const ctx = canvas.getContext('2d');
    this.chartInstance = new window.Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: { family: 'Inter, sans-serif', size: 12 },
              usePointStyle: true,
              padding: 14
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const diff = (context.parsed.y - 100).toFixed(1);
                const sign = diff >= 0 ? '+' : '';
                return ` ${context.dataset.label}: ${context.parsed.y} (累積: ${sign}${diff}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono, monospace', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.07)' },
            ticks: {
              color: '#64748b',
              font: { family: 'JetBrains Mono, monospace', size: 11 },
              callback: (val) => `${val}`
            }
          }
        }
      }
    });
  }

  _bindEvents() {
    // Chips toggle
    this.container.querySelectorAll('[data-stock-iso3]').forEach(chip => {
      chip.addEventListener('click', () => {
        const iso3 = chip.dataset.stockIso3;
        if (this.selectedIndices.includes(iso3)) {
          if (this.selectedIndices.length > 1) {
            this.selectedIndices = this.selectedIndices.filter(c => c !== iso3);
          }
        } else {
          this.selectedIndices.push(iso3);
        }
        this.render();
      });
    });

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

    // Inspect buttons
    this.container.querySelectorAll('.inspect-stock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sym = btn.dataset.symbol;
        const item = GLOBAL_INDICES.find(i => i.symbol === sym);
        this.onInspectSource({
          title: `${item.name} (${item.code})`,
          type: 'Stock Exchange Official Index Fact',
          sourceAgency: item.provider,
          sourceUrl: item.officialUrl,
          statementCode: item.symbol,
          data: item
        });
      });
    });
  }
}
