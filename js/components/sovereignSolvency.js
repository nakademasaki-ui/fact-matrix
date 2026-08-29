// Component: Sovereign Default Probability Ranking & 5-Dimensional Solvency Analyzer

import { SOVEREIGN_DEFAULT_RANKING, getSolvencyDataByIso3 } from '../data/sovereignSolvency.js';

export class SovereignSolvencyComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.chartInstance = null;
    this.sortBy = 'fiveYearDefaultProb';
    this.sortOrder = 'asc'; // lowest risk first by default
    this.selectedCountries = ['JPN', 'USA', 'DEU', 'GBR', 'FRA', 'TUR', 'ARG'];
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card solvency-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge icon-badge-cyan"><i data-lucide="shield-alert"></i></div>
            <div>
              <h3>世界主要国 財政破綻（デフォルト）確率ランキング＆真の財務健全性</h3>
              <p class="subtitle">国際金融市場（ソブリンCDSスプレッド）およびIMF/日銀統計に基づく「5年以内 破綻確率」と「5大健全性指標」</p>
            </div>
          </div>

          <div class="header-actions">
            <a href="https://www.dtcc.com/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="国際決済機関 DTCC">
              <i data-lucide="external-link"></i> DTCC / CDS市場
            </a>
          </div>
        </div>

        <!-- Key Highlights Cards for Japan's True Resilience -->
        <div class="solvency-highlights-grid">
          <div class="solvency-hl-card highlight-japan">
            <div class="hl-badge-top">
              <span>🇯🇵 日本の市場評価</span>
              <span class="badge badge-cut">世界第4位の超低リスク</span>
            </div>
            <div class="hl-main-val">
              1.81% <span class="hl-sub-text">5年以内 破綻確率</span>
            </div>
            <p class="hl-desc">
              総債務250%にもかかわらず、ソブリンCDS市場は<strong>米国（3.12%）や英国（2.63%）より破綻確率が低い</strong>と評価。
            </p>
          </div>

          <div class="solvency-hl-card">
            <div class="hl-badge-top">
              <span>対外純資産残高 (NIIP)</span>
              <span class="badge badge-api">33年連続 世界第1位</span>
            </div>
            <div class="hl-main-val color-pos">
              +82.5% <span class="hl-sub-text">対GDP比 (約470兆円)</span>
            </div>
            <p class="hl-desc">
              国全体として世界に最もお金を貸している純債権国。資本逃避による国家破綻の余地がない最大の防壁。
            </p>
          </div>

          <div class="solvency-hl-card">
            <div class="hl-badge-top">
              <span>国債の外国人保有率</span>
              <span class="badge badge-cut">わずか 7.8%</span>
            </div>
            <div class="hl-main-val">
              92.2% <span class="hl-sub-text">国内保有率 (日銀・国民)</span>
            </div>
            <p class="hl-desc">
              欧米諸国（米24%、仏51%）と異なり、海外投機筋による売り崩しや国債取り付け騒ぎが起きない構造。
            </p>
          </div>

          <div class="solvency-hl-card">
            <div class="hl-badge-top">
              <span>自国通貨（円）建て比率</span>
              <span class="badge badge-api">外債ゼロ (100%)</span>
            </div>
            <div class="hl-main-val color-pos">
              100% <span class="hl-sub-text">自国通貨発行権</span>
            </div>
            <p class="hl-desc">
              新興国のような「ドル不足による債務不履行（デフォルト）」が理論上発生しない構造。
            </p>
          </div>
        </div>

        <!-- Multi-Dimensional Solvency Comparison Chart -->
        <div class="chart-section-wrapper">
          <div class="chart-header-sub">
            <div>
              <h4 class="sub-section-title"><i data-lucide="bar-chart-2"></i> 5年以内 財政破綻（デフォルト）確率 国際比較 (%)</h4>
              <p class="chart-sub-note">ソブリンCDSスプレッドからISDA標準モデル（回収率40%）により逆算された市場推計値</p>
            </div>
          </div>
          <div class="chart-canvas-box" style="height: 320px;">
            <canvas id="default-prob-canvas"></canvas>
          </div>
        </div>

        <!-- Full Default Probability Ranking & 5-Metric Fact Table -->
        <div class="table-responsive">
          <table class="fact-table">
            <thead>
              <tr>
                <th data-sort="rank" class="sortable text-center">順位 <span class="sort-icon">${this._getSortIcon('rank')}</span></th>
                <th data-sort="country" class="sortable">国・地域 <span class="sort-icon">${this._getSortIcon('country')}</span></th>
                <th data-sort="fiveYearDefaultProb" class="sortable text-right">5年以内 破綻確率 <span class="sort-icon">${this._getSortIcon('fiveYearDefaultProb')}</span></th>
                <th data-sort="cds5yBps" class="sortable text-right">5年CDS (bps) <span class="sort-icon">${this._getSortIcon('cds5yBps')}</span></th>
                <th class="text-center">S&P / Moody's</th>
                <th data-sort="niipToGdp" class="sortable text-right">対外純資産/GDP <span class="sort-icon">${this._getSortIcon('niipToGdp')}</span></th>
                <th data-sort="foreignDebtOwnershipPct" class="sortable text-right">外国人保有率 <span class="sort-icon">${this._getSortIcon('foreignDebtOwnershipPct')}</span></th>
                <th data-sort="grossDebtToGdp" class="sortable text-right">総債務比率 <span class="sort-icon">${this._getSortIcon('grossDebtToGdp')}</span></th>
                <th>市場の客観的評価・構造的特徴</th>
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
            <span>破綻確率はソブリンCDS（Credit Default Swap）市場実勢値に基づき、ISDA（国際スワップデリバティブズ協会）標準算式により客観的に算出されています。</span>
          </div>
          <div class="record-count">全 ${SOVEREIGN_DEFAULT_RANKING.length} カ国 比較</div>
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
    let items = [...SOVEREIGN_DEFAULT_RANKING];

    items.sort((a, b) => {
      let valA = a[this.sortBy];
      let valB = b[this.sortBy];

      if (typeof valA === 'string') {
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return items.map((item, idx) => {
      const isJapan = item.iso3 === 'JPN';
      const probColor = this._getProbColor(item.fiveYearDefaultProb);
      const isNiipPos = item.niipToGdp >= 0;

      return `
        <tr class="${isJapan ? 'row-japan-highlight' : ''}">
          <td class="text-center">
            <span class="rank-badge ${item.rank <= 3 ? 'rank-top' : ''}">#${item.rank}</span>
          </td>
          <td>
            <div class="country-cell">
              <span class="flag-icon">${item.flag}</span>
              <div>
                <strong class="country-name">${item.country}</strong>
                <span class="iso-code">${item.iso3} / 10年利回り: ${item.tenYearYield}%</span>
              </div>
            </div>
          </td>
          <td class="text-right">
            <div class="prob-cell">
              <strong class="prob-value" style="color: ${probColor};">${item.fiveYearDefaultProb.toFixed(2)}%</strong>
              <div class="prob-mini-bar">
                <div class="prob-mini-fill" style="width: ${Math.min(item.fiveYearDefaultProb * 1.4, 100)}%; background: ${probColor};"></div>
              </div>
            </div>
          </td>
          <td class="text-right">
            <span class="cds-bps monospace">${item.cds5yBps} bps</span>
          </td>
          <td class="text-center">
            <span class="rating-badge">${item.creditRatingSp} / ${item.creditRatingMoodys}</span>
          </td>
          <td class="text-right">
            <span class="niip-val ${isNiipPos ? 'color-pos' : 'color-neg'}">${isNiipPos ? '+' : ''}${item.niipToGdp.toFixed(1)}%</span>
          </td>
          <td class="text-right">
            <span class="foreign-val ${item.foreignDebtOwnershipPct < 15 ? 'color-pos' : ''}">${item.foreignDebtOwnershipPct.toFixed(1)}%</span>
          </td>
          <td class="text-right">
            <span class="gross-val ${item.grossDebtToGdp > 150 ? 'badge-high-gdp' : ''}">${item.grossDebtToGdp.toFixed(1)}%</span>
          </td>
          <td>
            <span class="solvency-note" title="${item.notes}">${item.notes}</span>
          </td>
          <td class="text-center">
            <button class="inspect-btn inspect-solvency-btn" data-iso3="${item.iso3}" title="データ検証">
              <i data-lucide="file-code"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  _getProbColor(prob) {
    if (prob <= 2.0) return '#00f59b'; // Emerald
    if (prob <= 4.0) return '#38bdf8'; // Cyan/Blue
    if (prob <= 10.0) return '#f59e0b'; // Amber
    return '#ef4444'; // Rose
  }

  _renderChart() {
    const canvas = this.container.querySelector('#default-prob-canvas');
    if (!canvas || !window.Chart) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const sorted = [...SOVEREIGN_DEFAULT_RANKING].sort((a, b) => a.fiveYearDefaultProb - b.fiveYearDefaultProb);
    const labels = sorted.map(s => `${s.flag} ${s.countryEn}`);
    const dataValues = sorted.map(s => s.fiveYearDefaultProb);
    const backgroundColors = sorted.map(s => {
      if (s.iso3 === 'JPN') return '#00e5ff'; // highlight Japan in cyan
      if (s.fiveYearDefaultProb <= 2.0) return 'rgba(16, 185, 129, 0.75)';
      if (s.fiveYearDefaultProb <= 4.0) return 'rgba(56, 189, 248, 0.75)';
      if (s.fiveYearDefaultProb <= 10.0) return 'rgba(245, 158, 11, 0.75)';
      return 'rgba(239, 68, 68, 0.85)';
    });

    const ctx = canvas.getContext('2d');
    this.chartInstance = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '5年以内 財政破綻（デフォルト）確率 (%)',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: '#0b0f19',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const item = sorted[context.dataIndex];
                return [
                  ` 5年破綻確率: ${item.fiveYearDefaultProb.toFixed(2)}%`,
                  ` 5年CDS: ${item.cds5yBps} bps`,
                  ` 格付け: ${item.creditRatingSp} (${item.riskTierJa})`,
                  ` 総債務対GDP: ${item.grossDebtToGdp}%`,
                  ` 対外純資産/GDP: ${item.niipToGdp > 0 ? '+' : ''}${item.niipToGdp}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#cbd5e1', font: { family: 'Inter, sans-serif', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.07)' },
            ticks: {
              color: '#64748b',
              font: { family: 'JetBrains Mono, monospace', size: 11 },
              callback: (val) => `${val}%`
            }
          }
        }
      }
    });
  }

  _bindEvents() {
    // Sort Headers
    this.container.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (this.sortBy === col) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortBy = col;
          this.sortOrder = (col === 'fiveYearDefaultProb' || col === 'cds5yBps' || col === 'rank') ? 'asc' : 'desc';
        }
        this.render();
      });
    });

    // Inspect buttons
    this.container.querySelectorAll('.inspect-solvency-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const iso3 = btn.dataset.iso3;
        const item = SOVEREIGN_DEFAULT_RANKING.find(s => s.iso3 === iso3);
        this.onInspectSource({
          title: `${item.country} - ソブリンCDS＆財務健全性指標`,
          type: 'Sovereign CDS & Solvency Metrics (DTCC / IMF / MOF)',
          sourceAgency: item.sourceAgency,
          sourceUrl: 'https://www.dtcc.com/',
          statementCode: `CDS-5Y-${item.iso3}`,
          data: item
        });
      });
    });
  }
}
