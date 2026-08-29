// Component: Sovereign / National Balance Sheet & Solvency Analyzer Wrapper

import { SOVEREIGN_BALANCE_SHEETS, getSovereignBalanceSheetByIso3 } from '../data/sovereignBalanceSheets.js';
import { SovereignSolvencyComponent } from './sovereignSolvency.js';

export class SovereignBalanceSheetComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.selectedIso3 = 'JPN';
    this.activeSubTab = 'T_ACCOUNT'; // 'T_ACCOUNT' or 'SOLVENCY_RANKING'
    this.chartInstance = null;
    this.solvencySubComponent = null;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card sovereign-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge icon-badge-cyan"><i data-lucide="building-2"></i></div>
            <div>
              <h3>国家のバランスシート＆財政破綻（デフォルト）確率分析</h3>
              <p class="subtitle">各国財務省公表の公式財務書類、ソブリンCDSスプレッド、IMF対外資産負債統計</p>
            </div>
          </div>

          <div class="header-actions">
            <div class="btn-group">
              <button class="btn btn-sm ${this.activeSubTab === 'T_ACCOUNT' ? 'active' : ''}" data-sov-subtab="T_ACCOUNT">
                <i data-lucide="scale"></i> 貸借対照表 (T勘定) ＆ 純債務
              </button>
              <button class="btn btn-sm ${this.activeSubTab === 'SOLVENCY_RANKING' ? 'active' : ''}" data-sov-subtab="SOLVENCY_RANKING">
                <i data-lucide="shield-alert"></i> 破綻確率ランキング＆健全性5指標
              </button>
            </div>
          </div>
        </div>

        <div class="sov-content-container" id="sov-sub-content">
          ${this.activeSubTab === 'T_ACCOUNT' ? this._renderTAccountSection() : `<div id="solvency-ranking-container"></div>`}
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();

    if (this.activeSubTab === 'T_ACCOUNT') {
      this._renderDebtChart();
    } else {
      this.solvencySubComponent = new SovereignSolvencyComponent('solvency-ranking-container', {
        onInspectSource: this.onInspectSource
      });
      this.solvencySubComponent.render();
    }
  }

  _renderTAccountSection() {
    const currentCountry = getSovereignBalanceSheetByIso3(this.selectedIso3) || SOVEREIGN_BALANCE_SHEETS[0];

    return `
      <!-- Country Pill Selector -->
      <div class="t-account-selector-bar">
        <span class="selector-lbl">表示対象国 (T勘定):</span>
        <div class="btn-group">
          ${SOVEREIGN_BALANCE_SHEETS.map(s => `
            <button class="btn btn-sm ${s.iso3 === this.selectedIso3 ? 'active' : ''}" data-sov-iso3="${s.iso3}">
              <span>${s.flag}</span> ${s.countryEn}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Visual T-Account (貸借対照表) Container -->
      <div class="t-account-wrapper">
        <div class="t-account-header">
          <div class="t-account-title">
            <span class="flag-large">${currentCountry.flag}</span>
            <div>
              <h4>${currentCountry.country} 連結貸借対照表 (Sovereign Balance Sheet)</h4>
              <p class="t-report-code">一次資料: <strong>${currentCountry.ministry}</strong> 策定 <code>${currentCountry.officialReportName}</code> (${currentCountry.latestFiscalYear})</p>
            </div>
          </div>
          <div class="t-quick-badges">
            <span class="badge ${currentCountry.netDebtToGdp < 0 ? 'badge-cut' : 'badge-hike'}">
              実質純債務: ${currentCountry.netDebtToGdp}% of GDP
            </span>
            <span class="badge badge-api">
              PB収支: ${currentCountry.primaryBalanceToGdp > 0 ? '+' : ''}${currentCountry.primaryBalanceToGdp}%
            </span>
          </div>
        </div>

        <!-- T-Account Two Columns (Assets vs Liabilities & Equity) -->
        <div class="t-account-columns">
          <!-- Left Side: ASSETS (資産の部) -->
          <div class="t-col t-col-assets">
            <div class="t-col-header">
              <span class="col-title"><i data-lucide="shield"></i> 【資産の部】国家が保有する財産</span>
              <strong class="col-total">${currentCountry.totalAssetsLocal} <span class="usd-sub">(約 $${currentCountry.totalAssetsUsdTrillion} 兆)</span></strong>
            </div>
            <div class="t-account-items">
              <div class="t-item highlight-item">
                <div class="t-item-main">
                  <strong>流動性金融資産（有価証券・外貨・出資金・貸付金）</strong>
                  <span class="t-item-note">${currentCountry.sovereignFundsName}</span>
                </div>
                <span class="t-item-val">${currentCountry.financialAssetsLocal}</span>
              </div>
              <div class="t-item">
                <div class="t-item-main">
                  <strong>有形固定資産（社会資本インフラ・国有地・公有財産）</strong>
                  <span class="t-item-note">道路網、港湾、治水施設、国有林野、公用施設等</span>
                </div>
                <span class="t-item-val">${currentCountry.fixedAssetsLocal}</span>
              </div>
              <div class="t-item meta-summary">
                <span>総資産対名目GDP比率</span>
                <strong>${currentCountry.assetsToGdp}% of GDP</strong>
              </div>
            </div>
          </div>

          <!-- Right Side: LIABILITIES & NET WORTH (負債・純資産の部) -->
          <div class="t-col t-col-liabilities">
            <div class="t-col-header">
              <span class="col-title"><i data-lucide="file-minus"></i> 【負債・純資産の部】義務および正味財産</span>
              <strong class="col-total">総負債: ${currentCountry.grossLiabilitiesLocal}</strong>
            </div>
            <div class="t-account-items">
              <div class="t-item">
                <div class="t-item-main">
                  <strong>国家の総負債（公債・国債・借入金・公的引当金）</strong>
                  <span class="t-item-note">国債発行残高、政府短期証券、退職給付引当金等</span>
                </div>
                <span class="t-item-val val-neg">${currentCountry.grossLiabilitiesLocal}</span>
              </div>
              <div class="t-item ${currentCountry.netWorthUsdTrillion >= 0 ? 'highlight-item-pos' : 'highlight-item-neg'}">
                <div class="t-item-main">
                  <strong>国家の正味純資産（資産 − 負債）</strong>
                  <span class="t-item-note">${currentCountry.netWorthUsdTrillion >= 0 ? '公的資産超過（純資産プラス）' : '実質的な債務超過額（将来の税収等で補填）'}</span>
                </div>
                <span class="t-item-val ${currentCountry.netWorthUsdTrillion >= 0 ? 'val-pos' : 'val-neg'}">
                  ${currentCountry.netWorthLocal} (${currentCountry.netWorthToGdp}% of GDP)
                </span>
              </div>
              <div class="t-item meta-summary">
                <span>形式的総債務対GDP比率 (Gross Debt)</span>
                <strong class="val-neg">${currentCountry.grossDebtToGdp}% of GDP</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="t-account-footer-note">
          <i data-lucide="info"></i>
          <span><strong>客観的ファクト解説:</strong> ${currentCountry.description}</span>
        </div>
      </div>

      <!-- Comparative Chart: Gross Debt vs Net Debt (% of GDP) -->
      <div class="chart-section-wrapper">
        <div class="chart-header-sub">
          <div>
            <h4 class="sub-section-title"><i data-lucide="bar-chart-2"></i> 総債務（Gross Debt） vs 実質純債務（Net Debt）国際比較対比チャート</h4>
            <p class="chart-sub-note">総債務（外形上の借金）から保有金融資産を差し引いた「実質純債務」との乖離比較（対GDP比 %）</p>
          </div>
        </div>
        <div class="chart-canvas-box">
          <canvas id="debt-comparison-canvas"></canvas>
        </div>
      </div>

      <!-- Full Sovereign Balance Sheet Fact Table -->
      <div class="table-responsive">
        <table class="fact-table">
          <thead>
            <tr>
              <th>国・主権国家</th>
              <th>財務当局 / 公式会計書類</th>
              <th class="text-right">総資産残高 (Local / USD)</th>
              <th class="text-right">総債務比率 (Gross)</th>
              <th class="text-right">実質純債務比率 (Net)</th>
              <th class="text-right">正味純資産対GDP比</th>
              <th>主要公的ファンド・準備金</th>
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
          <span>すべての国家資産負債データは各国財務省公表の公式財務諸表およびIMF公的セクターバランスシート（PSBS）データベースから直接引用されています。</span>
        </div>
        <div class="record-count">全 ${SOVEREIGN_BALANCE_SHEETS.length} 主要主権国家</div>
      </div>
    `;
  }

  _renderTableRows() {
    return SOVEREIGN_BALANCE_SHEETS.map(s => {
      const isNetPos = s.netDebtToGdp < 0;
      return `
        <tr>
          <td>
            <div class="country-cell" role="button" data-sov-click="${s.iso3}">
              <span class="flag-icon">${s.flag}</span>
              <div>
                <strong class="country-name">${s.country}</strong>
                <span class="iso-code">${s.iso3} / ${s.currency}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="cb-cell">
              <strong class="cb-name">${s.ministry}</strong>
              <span class="policy-name">${s.officialReportName}</span>
            </div>
          </td>
          <td class="text-right">
            <strong class="rate-value">${s.totalAssetsLocal}</strong>
            <span class="policy-name">約 $${s.totalAssetsUsdTrillion} 兆</span>
          </td>
          <td class="text-right">
            <span class="target-badge badge-high-gdp">${s.grossDebtToGdp}%</span>
          </td>
          <td class="text-right">
            <span class="rate-value ${isNetPos ? 'color-pos' : 'color-neg'}">${s.netDebtToGdp}%</span>
          </td>
          <td class="text-right">
            <span class="target-badge ${s.netWorthToGdp >= 0 ? 'badge-cut' : ''}">${s.netWorthToGdp}%</span>
          </td>
          <td>
            <span class="sovereign-fund-tag" title="${s.sovereignFundsName}">
              ${s.sovereignFundsName.length > 35 ? s.sovereignFundsName.slice(0, 35) + '...' : s.sovereignFundsName}
            </span>
          </td>
          <td class="text-center">
            <div class="source-actions">
              <a href="${s.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link-btn" title="財務省公式報告書を開く">
                <i data-lucide="external-link"></i> 財務省一次資料
              </a>
              <button class="inspect-btn inspect-sov-btn" data-iso3="${s.iso3}" title="データ検証">
                <i data-lucide="file-code"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  _renderDebtChart() {
    const canvas = this.container.querySelector('#debt-comparison-canvas');
    if (!canvas || !window.Chart) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = SOVEREIGN_BALANCE_SHEETS.map(s => `${s.flag} ${s.countryEn}`);
    const grossData = SOVEREIGN_BALANCE_SHEETS.map(s => s.grossDebtToGdp);
    const netData = SOVEREIGN_BALANCE_SHEETS.map(s => s.netDebtToGdp);

    const ctx = canvas.getContext('2d');
    this.chartInstance = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '総債務対GDP比 (Gross Debt % of GDP)',
            data: grossData,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: '実質純債務対GDP比 (Net Debt % of GDP = 総債務 - 金融資産)',
            data: netData,
            backgroundColor: 'rgba(56, 189, 248, 0.8)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
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
                return ` ${context.dataset.label}: ${context.parsed.y}% of GDP`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#cbd5e1', font: { family: 'Inter, sans-serif', size: 12 } }
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
    // Sub-tab switching
    this.container.querySelectorAll('[data-sov-subtab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeSubTab = btn.dataset.sovSubtab;
        this.render();
      });
    });

    // Country selector buttons
    this.container.querySelectorAll('[data-sov-iso3]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedIso3 = btn.dataset.sovIso3;
        this.render();
      });
    });

    // Country row click
    this.container.querySelectorAll('[data-sov-click]').forEach(elem => {
      elem.addEventListener('click', () => {
        this.selectedIso3 = elem.dataset.sovClick;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Inspect buttons
    this.container.querySelectorAll('.inspect-sov-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const iso3 = btn.dataset.iso3;
        const item = SOVEREIGN_BALANCE_SHEETS.find(s => s.iso3 === iso3);
        this.onInspectSource({
          title: `${item.country} - 国家バランスシート`,
          type: 'National Ministry of Finance Consolidated Financial Statement',
          sourceAgency: item.ministry,
          sourceUrl: item.sourceUrl,
          statementCode: item.officialReportCode,
          data: item
        });
      });
    });
  }
}
