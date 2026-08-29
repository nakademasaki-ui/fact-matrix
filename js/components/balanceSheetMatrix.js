// Component: Central Bank Balance Sheets & Quantitative Tightening (QT) Analyzer

import { CENTRAL_BANK_BALANCE_SHEETS, HISTORICAL_BALANCE_SHEETS } from '../data/balanceSheets.js';

export class BalanceSheetMatrixComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.chartInstance = null;
    this.selectedBanks = ['USA', 'EMU', 'JPN', 'CHN', 'GBR'];
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card balance-sheet-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge"><i data-lucide="layers"></i></div>
            <div>
              <h3>主要国・中央銀行バランスシート＆QT/QE進捗台帳</h3>
              <p class="subtitle">各国中銀の週次・旬次公表財務諸表に基づく総資産・対GDP比・資産圧縮進捗</p>
            </div>
          </div>

          <div class="header-actions">
            <a href="https://www.federalreserve.gov/releases/h41/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              <i data-lucide="file-text"></i> Fed H.4.1
            </a>
            <a href="https://www.ecb.europa.eu/press/wfs/html/index.en.html" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              <i data-lucide="file-text"></i> ECB WFS
            </a>
            <a href="https://www.boj.or.jp/statistics/boj/other/acboard/index.htm" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              <i data-lucide="file-text"></i> 日銀勘定
            </a>
          </div>
        </div>

        <!-- Central Bank Top Overview Cards -->
        <div class="bs-cards-grid">
          ${CENTRAL_BANK_BALANCE_SHEETS.slice(0, 4).map(bs => {
            const isQt = bs.policyStance === 'QT';
            return `
              <div class="bs-summary-card">
                <div class="bs-card-top">
                  <div class="bs-card-title">
                    <span class="flag">${bs.flag}</span>
                    <div>
                      <strong>${bs.centralBank}</strong>
                      <span class="bs-sub">${bs.officialReleaseCode}</span>
                    </div>
                  </div>
                  <span class="badge ${isQt ? 'badge-hike' : 'badge-cut'}">
                    ${bs.policyStance} (${bs.qtContractionPct.toFixed(1)}%)
                  </span>
                </div>
                <div class="bs-card-val">
                  ${bs.totalAssetsLocal} <span class="usd-eq">(約 $${bs.totalAssetsUsdTrillion}T)</span>
                </div>
                <div class="bs-metrics">
                  <div class="m-item"><span>対GDP比:</span> <strong class="${bs.assetsToGdp > 100 ? 'color-neg' : ''}">${bs.assetsToGdp}%</strong></div>
                  <div class="m-item"><span>ピーク比縮小:</span> <strong>${Math.abs(bs.qtContractionPct).toFixed(1)}% 減</strong></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Multi-Central Bank Assets Time-Series Chart (Trillion USD) -->
        <div class="chart-section-wrapper">
          <div class="chart-header-sub">
            <div>
              <h4 class="sub-section-title"><i data-lucide="bar-chart-3"></i> 主要中央銀行 総資産規模推移 (兆ドル換算: 2015-2024年)</h4>
              <p class="chart-sub-note">公表ベース総資産（米ドル換算・QE拡大期とQT縮小サイクルの推移）</p>
            </div>
            <div class="chips-list">
              ${CENTRAL_BANK_BALANCE_SHEETS.map(bs => {
                const isSelected = this.selectedBanks.includes(bs.iso3);
                return `
                  <button class="chip ${isSelected ? 'active' : ''}" data-bs-iso3="${bs.iso3}">
                    <span>${bs.flag}</span> ${bs.iso3}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          <div class="chart-canvas-box">
            <canvas id="bs-performance-canvas"></canvas>
          </div>
        </div>

        <!-- Full Balance Sheet Fact Table -->
        <div class="table-responsive">
          <table class="fact-table">
            <thead>
              <tr>
                <th>中央銀行 / 国</th>
                <th>総資産規模 (自国通貨 / USD換算)</th>
                <th class="text-right">対名目GDP比率</th>
                <th class="text-right">ピーク時残高</th>
                <th>QT（量的引き締め）進捗状況</th>
                <th>公表頻度・公式報告書</th>
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
            <span>すべてのバランスシート残高は各中央銀行の公式財務諸表および資産負債表（FRB H.4.1、ECB WFS、日銀勘定）より直接抽出されています。</span>
          </div>
          <div class="record-count">全 ${CENTRAL_BANK_BALANCE_SHEETS.length} 主要中央銀行</div>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
    this._renderChart();
  }

  _renderTableRows() {
    return CENTRAL_BANK_BALANCE_SHEETS.map(bs => {
      const isQt = bs.policyStance === 'QT';
      const pctContraction = Math.abs(bs.qtContractionPct);
      const barWidth = Math.min(pctContraction * 2, 100);

      return `
        <tr>
          <td>
            <div class="country-cell">
              <span class="flag-icon">${bs.flag}</span>
              <div>
                <strong class="country-name">${bs.centralBank}</strong>
                <span class="iso-code">${bs.country} (${bs.iso3})</span>
              </div>
            </div>
          </td>
          <td>
            <div class="cb-cell">
              <strong class="rate-value">${bs.totalAssetsLocal}</strong>
              <span class="policy-name">USD換算: 約 $${bs.totalAssetsUsdTrillion} 兆</span>
            </div>
          </td>
          <td class="text-right">
            <span class="target-badge ${bs.assetsToGdp > 100 ? 'badge-high-gdp' : ''}">${bs.assetsToGdp}%</span>
          </td>
          <td class="text-right">
            <div class="cb-cell">
              <span class="rate-value">$${bs.peakAssetsUsdTrillion}T</span>
              <span class="policy-name">${bs.peakDate}</span>
            </div>
          </td>
          <td>
            <div class="qt-progress-box">
              <div class="qt-progress-labels">
                <span class="badge ${isQt ? 'badge-hike' : 'badge-hold'}">${bs.policyStance}</span>
                <span class="qt-pct-text">ピーク比 <strong>${bs.qtContractionPct.toFixed(1)}%</strong> ($${bs.qtContractionUsdTrillion}T 減)</span>
              </div>
              <div class="qt-bar">
                <div class="qt-fill" style="width: ${barWidth}%;"></div>
              </div>
              <span class="qt-target-sub">${bs.monthlyRunoffTarget}</span>
            </div>
          </td>
          <td>
            <div class="cb-cell">
              <span class="cb-name">${bs.officialReleaseCode}</span>
              <span class="date-tag">${bs.reportFrequency} (更新: ${bs.latestStatementDate})</span>
            </div>
          </td>
          <td class="text-center">
            <div class="source-actions">
              <a href="${bs.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link-btn" title="公式報告書を開く">
                <i data-lucide="external-link"></i> 一次ソース
              </a>
              <button class="inspect-btn inspect-bs-btn" data-iso3="${bs.iso3}" title="データ検証">
                <i data-lucide="file-code"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  _renderChart() {
    const canvas = this.container.querySelector('#bs-performance-canvas');
    if (!canvas || !window.Chart) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const colors = {
      USA: '#38bdf8',
      EMU: '#818cf8',
      JPN: '#00f59b',
      CHN: '#ef4444',
      GBR: '#ec4899',
      CHE: '#f59e0b',
      CAN: '#f97316'
    };

    const labels = HISTORICAL_BALANCE_SHEETS.years.map(y => `${y}年`);

    const datasets = this.selectedBanks.map(iso3 => {
      const bs = CENTRAL_BANK_BALANCE_SHEETS.find(b => b.iso3 === iso3);
      const color = colors[iso3] || '#94a3b8';
      const series = HISTORICAL_BALANCE_SHEETS.series[iso3] || [];

      return {
        label: `${bs ? bs.flag : ''} ${bs ? bs.centralBank : iso3}`,
        data: series,
        borderColor: color,
        backgroundColor: color + '15',
        borderWidth: 2.5,
        pointBackgroundColor: color,
        pointBorderColor: '#0b0f19',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.25,
        fill: false
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
                return ` ${context.dataset.label}: $${context.parsed.y.toFixed(2)} 兆 (Trillion USD)`;
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
              callback: (val) => `$${val}T`
            }
          }
        }
      }
    });
  }

  _bindEvents() {
    // Chips toggle
    this.container.querySelectorAll('[data-bs-iso3]').forEach(chip => {
      chip.addEventListener('click', () => {
        const iso3 = chip.dataset.bsIso3;
        if (this.selectedBanks.includes(iso3)) {
          if (this.selectedBanks.length > 1) {
            this.selectedBanks = this.selectedBanks.filter(c => c !== iso3);
          }
        } else {
          this.selectedBanks.push(iso3);
        }
        this.render();
      });
    });

    // Inspect buttons
    this.container.querySelectorAll('.inspect-bs-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const iso3 = btn.dataset.iso3;
        const item = CENTRAL_BANK_BALANCE_SHEETS.find(b => b.iso3 === iso3);
        this.onInspectSource({
          title: `${item.centralBank} - バランスシート`,
          type: 'Central Bank Weekly Financial Statement (Balance Sheet)',
          sourceAgency: item.centralBank,
          sourceUrl: item.sourceUrl,
          statementCode: item.officialReleaseCode,
          data: item
        });
      });
    });
  }
}
