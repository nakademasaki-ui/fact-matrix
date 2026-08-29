// Component: Multi-Country Economic Time-Series Comparison Chart

import { worldBankApi, INDICATORS } from '../services/worldBank.js';
import { COUNTRIES, getCountryByIso3 } from '../data/countries.js';

export class EconomicChartComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.selectedIndicatorKey = 'GDP_GROWTH';
    this.selectedCountries = ['USA', 'JPN', 'DEU', 'CHN', 'IND'];
    this.chartInstance = null;
    this.currentData = null;
    this.isLoading = false;
  }

  render() {
    if (!this.container) return;

    const indicator = INDICATORS[this.selectedIndicatorKey];

    this.container.innerHTML = `
      <div class="card chart-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge"><i data-lucide="line-chart"></i></div>
            <div>
              <h3>世界銀行 (World Bank) 一次統計 時系列比較</h3>
              <p class="subtitle">公的APIから直接取得した国際比較可能な標準化時系列データ</p>
            </div>
          </div>

          <div class="header-actions chart-controls">
            <div class="select-wrapper">
              <label for="indicator-select"><i data-lucide="layers"></i> 指標選択:</label>
              <select id="indicator-select" class="form-select">
                ${Object.keys(INDICATORS).map(key => `
                  <option value="${key}" ${key === this.selectedIndicatorKey ? 'selected' : ''}>
                    ${INDICATORS[key].nameJa} [${INDICATORS[key].code}]
                  </option>
                `).join('')}
              </select>
            </div>
            
            <button class="btn btn-secondary btn-sm" id="export-csv-btn" title="表示中の生データをCSV出力">
              <i data-lucide="download"></i> CSVエクスポート
            </button>
            <button class="btn btn-secondary btn-sm" id="inspect-wb-api-btn" title="World Bank APIクエリを検証">
              <i data-lucide="code-2"></i> API検証
            </button>
          </div>
        </div>

        <!-- Country Selector Chips -->
        <div class="country-chips-bar">
          <span class="chips-label">比較対象国 (選択切替):</span>
          <div class="chips-list">
            ${COUNTRIES.map(c => {
              const isSelected = this.selectedCountries.includes(c.iso3);
              return `
                <button class="chip ${isSelected ? 'active' : ''}" data-iso3="${c.iso3}">
                  <span>${c.flag}</span> ${c.iso3}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Chart Canvas Container -->
        <div class="chart-wrapper">
          <div class="chart-loading-overlay" id="chart-loading" style="${this.isLoading ? 'display:flex;' : 'display:none;'}">
            <div class="spinner"></div>
            <span>World Bank API から最新データを同期中...</span>
          </div>
          <div class="canvas-container">
            <canvas id="economic-canvas"></canvas>
          </div>
        </div>

        <!-- Indicator Metadata & Footnotes -->
        <div class="indicator-meta-panel">
          <div class="meta-row">
            <span class="meta-label">公式指標定義:</span>
            <span class="meta-desc">${indicator.definition}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">原資料作成機関:</span>
            <span class="meta-source">${indicator.source}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="fact-disclaimer">
            <i data-lucide="database"></i>
            <span>World Bank Open Data API (<code>api.worldbank.org/v2</code>) にダイレクト接続しています。</span>
          </div>
          <a href="${indicator.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link-btn">
            <i data-lucide="external-link"></i> 世銀ポータルで確認
          </a>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
    this._loadChartData();
  }

  async _loadChartData() {
    const indicator = INDICATORS[this.selectedIndicatorKey];
    this.isLoading = true;
    const loadingElem = this.container.querySelector('#chart-loading');
    if (loadingElem) loadingElem.style.display = 'flex';

    try {
      const data = await worldBankApi.fetchIndicatorData(
        this.selectedCountries,
        indicator.code,
        '2014:2024'
      );
      this.currentData = data;
      this._renderChartJs(data, indicator);
    } catch (e) {
      console.error('Failed to load chart data:', e);
    } finally {
      this.isLoading = false;
      if (loadingElem) loadingElem.style.display = 'none';
    }
  }

  _renderChartJs(data, indicator) {
    const canvas = this.container.querySelector('#economic-canvas');
    if (!canvas || !window.Chart) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Prepare distinct colors
    const colors = {
      USA: '#38bdf8',
      JPN: '#00f59b',
      DEU: '#f59e0b',
      GBR: '#ec4899',
      FRA: '#818cf8',
      CHN: '#ef4444',
      IND: '#10b981',
      BRA: '#a855f7',
      CAN: '#f97316',
      AUS: '#06b6d4',
      KOR: '#eab308',
      CHE: '#14b8a6',
      RUS: '#fb7185',
      SAU: '#a3e635',
      TUR: '#f43f5e'
    };

    // Extract all unique years sorted
    const yearsSet = new Set();
    Object.values(data.series).forEach(points => {
      points.forEach(p => yearsSet.add(p.year));
    });
    const labels = Array.from(yearsSet).sort((a, b) => a - b);

    const datasets = this.selectedCountries.map(iso3 => {
      const countryMeta = getCountryByIso3(iso3);
      const color = colors[iso3] || '#94a3b8';
      const seriesPoints = data.series[iso3] || [];
      const pointMap = {};
      seriesPoints.forEach(p => { pointMap[p.year] = p.value; });

      const values = labels.map(yr => pointMap[yr] !== undefined ? pointMap[yr] : null);

      return {
        label: `${countryMeta ? countryMeta.flag : ''} ${countryMeta ? countryMeta.nameJa : iso3} (${iso3})`,
        data: values,
        borderColor: color,
        backgroundColor: color + '22',
        borderWidth: 2.5,
        pointBackgroundColor: color,
        pointBorderColor: '#0b0f19',
        pointHoverRadius: 6,
        pointRadius: 4,
        tension: 0.25,
        spanGaps: true
      };
    });

    const ctx = canvas.getContext('2d');
    this.chartInstance = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(y => `${y}年`),
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: { family: 'Inter, sans-serif', size: 12 },
              usePointStyle: true,
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            callbacks: {
              label: (context) => {
                const val = context.parsed.y !== null ? context.parsed.y.toFixed(indicator.decimals) : 'N/A';
                return ` ${context.dataset.label}: ${val} ${indicator.unit}`;
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
              callback: (val) => `${val}${indicator.unit}`
            }
          }
        }
      }
    });
  }

  _exportCsv() {
    if (!this.currentData) return;
    const indicator = INDICATORS[this.selectedIndicatorKey];
    const data = this.currentData;

    const yearsSet = new Set();
    Object.values(data.series).forEach(pts => pts.forEach(p => yearsSet.add(p.year)));
    const years = Array.from(yearsSet).sort((a, b) => a - b);

    let csvContent = `Year,` + this.selectedCountries.join(',') + `\n`;
    years.forEach(yr => {
      const row = [yr];
      this.selectedCountries.forEach(iso3 => {
        const pts = data.series[iso3] || [];
        const item = pts.find(p => p.year === yr);
        row.push(item !== undefined && item.value !== null ? item.value : '');
      });
      csvContent += row.join(',') + `\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WorldBank_${indicator.code}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  _bindEvents() {
    // Indicator select
    const select = this.container.querySelector('#indicator-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.selectedIndicatorKey = e.target.value;
        this.render();
      });
    }

    // Country chips toggle
    this.container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const iso3 = chip.dataset.iso3;
        if (this.selectedCountries.includes(iso3)) {
          if (this.selectedCountries.length > 1) {
            this.selectedCountries = this.selectedCountries.filter(c => c !== iso3);
          }
        } else {
          if (this.selectedCountries.length < 8) {
            this.selectedCountries.push(iso3);
          } else {
            alert('同時に比較できる国は最大8カ国までです。');
          }
        }
        this.render();
      });
    });

    // CSV Export
    const csvBtn = this.container.querySelector('#export-csv-btn');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => this._exportCsv());
    }

    // Inspect API
    const inspectBtn = this.container.querySelector('#inspect-wb-api-btn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        const indicator = INDICATORS[this.selectedIndicatorKey];
        this.onInspectSource({
          title: `World Bank API: ${indicator.nameJa}`,
          type: 'REST JSON Endpoint',
          sourceAgency: 'World Bank Open Data Group',
          sourceUrl: indicator.sourceUrl,
          apiEndpoint: this.currentData ? this.currentData.apiEndpoint : '',
          rawCount: this.currentData ? this.currentData.rawCount : 0,
          data: this.currentData
        });
      });
    }
  }
}
