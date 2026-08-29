// Component: Interactive Fact World Map

import { COUNTRIES, getCountryByIso3 } from '../data/countries.js';
import { CENTRAL_BANK_RATES, getCentralBankByIso3 } from '../data/centralBanks.js';
import { UN_RESOLUTIONS } from '../data/unResolutions.js';

export class WorldMapComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onSelectCountry = options.onSelectCountry || (() => {});
    this.activeLayer = 'POLICY_RATE'; // 'POLICY_RATE', 'CPI', 'UN_UKRAINE', 'UN_MIDEAST'
    this.selectedIso3 = null;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card map-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge"><i data-lucide="globe"></i></div>
            <div>
              <h3>グローバル・ファクト・インタラクティブマップ</h3>
              <p class="subtitle">客観的指標および国連公式投票レコードの地理的分布</p>
            </div>
          </div>
          <div class="header-actions map-layer-controls">
            <label class="layer-label">レイヤー切替:</label>
            <div class="btn-group">
              <button class="btn btn-sm ${this.activeLayer === 'POLICY_RATE' ? 'active' : ''}" data-layer="POLICY_RATE">
                <i data-lucide="percent"></i> 政策金利
              </button>
              <button class="btn btn-sm ${this.activeLayer === 'CPI' ? 'active' : ''}" data-layer="CPI">
                <i data-lucide="activity"></i> CPI物価
              </button>
              <button class="btn btn-sm ${this.activeLayer === 'UN_UKRAINE' ? 'active' : ''}" data-layer="UN_UKRAINE">
                <i data-lucide="vote"></i> 国連決議 ES-11/1 (ウクライナ)
              </button>
              <button class="btn btn-sm ${this.activeLayer === 'UN_MIDEAST' ? 'active' : ''}" data-layer="UN_MIDEAST">
                <i data-lucide="vote"></i> 国連決議 ES-10/22 (中東停戦)
              </button>
            </div>
          </div>
        </div>

        <div class="map-wrapper">
          <div class="map-svg-container" id="svg-world-map">
            ${this._generateMapSvg()}
          </div>
          <div class="map-tooltip" id="map-tooltip" style="display: none;"></div>
          <div class="map-legend">
            ${this._getLegendContent()}
          </div>
        </div>

        <div class="card-footer">
          <div class="fact-disclaimer">
            <i data-lucide="info"></i>
            <span>国をクリックすると、その国の公的統計および条約批准状況を詳細確認できます。</span>
          </div>
          <div class="active-layer-indicator">
            現在表示中: <strong>${this._getLayerTitle()}</strong>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  _getLayerTitle() {
    switch (this.activeLayer) {
      case 'POLICY_RATE': return '中央銀行 政策金利水準 (%)';
      case 'CPI': return '消費者物価指数 (CPI 年率 %)';
      case 'UN_UKRAINE': return '国連総会決議 A/RES/ES-11/1 投票結果';
      case 'UN_MIDEAST': return '国連総会決議 A/RES/ES-10/22 投票結果';
      default: return '';
    }
  }

  _getLegendContent() {
    if (this.activeLayer === 'POLICY_RATE') {
      return `
        <div class="legend-title">政策金利 水準</div>
        <div class="legend-items">
          <span class="legend-item"><i style="background: #00f59b"></i> 0.0% ~ 2.0%</span>
          <span class="legend-item"><i style="background: #38bdf8"></i> 2.1% ~ 4.5%</span>
          <span class="legend-item"><i style="background: #f59e0b"></i> 4.6% ~ 7.0%</span>
          <span class="legend-item"><i style="background: #ef4444"></i> 7.1%+</span>
          <span class="legend-item"><i style="background: #273549"></i> 未登録/その他</span>
        </div>
      `;
    } else if (this.activeLayer === 'CPI') {
      return `
        <div class="legend-title">CPI インフレ率</div>
        <div class="legend-items">
          <span class="legend-item"><i style="background: #00f59b"></i> < 2.0%</span>
          <span class="legend-item"><i style="background: #38bdf8"></i> 2.0% ~ 3.5%</span>
          <span class="legend-item"><i style="background: #f59e0b"></i> 3.6% ~ 6.0%</span>
          <span class="legend-item"><i style="background: #ef4444"></i> > 6.0%</span>
        </div>
      `;
    } else {
      return `
        <div class="legend-title">国連公式投票ステータス</div>
        <div class="legend-items">
          <span class="legend-item"><i style="background: #10b981"></i> 賛成 (In Favour)</span>
          <span class="legend-item"><i style="background: #ef4444"></i> 反対 (Against)</span>
          <span class="legend-item"><i style="background: #f59e0b"></i> 棄権 (Abstain)</span>
          <span class="legend-item"><i style="background: #273549"></i> その他 / 不参加</span>
        </div>
      `;
    }
  }

  _getColorForCountry(iso3) {
    if (this.activeLayer === 'POLICY_RATE') {
      const cb = getCentralBankByIso3(iso3);
      if (!cb) return '#1e293b';
      if (cb.rate <= 2.0) return '#00f59b';
      if (cb.rate <= 4.5) return '#38bdf8';
      if (cb.rate <= 7.0) return '#f59e0b';
      return '#ef4444';
    } else if (this.activeLayer === 'CPI') {
      const cb = getCentralBankByIso3(iso3);
      if (!cb) return '#1e293b';
      if (cb.currentCpi < 2.0) return '#00f59b';
      if (cb.currentCpi <= 3.5) return '#38bdf8';
      if (cb.currentCpi <= 6.0) return '#f59e0b';
      return '#ef4444';
    } else {
      const resId = this.activeLayer === 'UN_UKRAINE' ? 'A/RES/ES-11/1' : 'A/RES/ES-10/22';
      const res = UN_RESOLUTIONS.find(r => r.id === resId);
      if (!res || !res.votes || !res.votes[iso3]) return '#1e293b';
      const v = res.votes[iso3];
      if (v === 'Y') return '#10b981';
      if (v === 'N') return '#ef4444';
      if (v === 'A') return '#f59e0b';
      return '#1e293b';
    }
  }

  _generateMapSvg() {
    // Stylized vector map polygons and coordinate nodes for major economic/political entities
    const countryPolygons = [
      { iso3: 'USA', name: 'USA', x: 190, y: 150, w: 120, h: 70, path: 'M 140 120 L 260 120 L 250 190 L 160 180 Z' },
      { iso3: 'CAN', name: 'Canada', x: 180, y: 80, w: 140, h: 60, path: 'M 130 60 L 270 50 L 260 110 L 140 110 Z' },
      { iso3: 'MEX', name: 'Mexico', x: 180, y: 220, w: 60, h: 40, path: 'M 160 190 L 210 190 L 230 240 L 190 240 Z' },
      { iso3: 'BRA', name: 'Brazil', x: 300, y: 310, w: 90, h: 90, path: 'M 280 270 L 350 270 L 360 360 L 300 370 Z' },
      { iso3: 'GBR', name: 'UK', x: 440, y: 110, w: 30, h: 30, path: 'M 435 95 L 455 95 L 450 125 L 435 125 Z' },
      { iso3: 'DEU', name: 'Germany', x: 480, y: 120, w: 30, h: 30, path: 'M 470 110 L 495 110 L 495 135 L 470 135 Z' },
      { iso3: 'FRA', name: 'France', x: 455, y: 135, w: 30, h: 30, path: 'M 450 130 L 475 130 L 470 155 L 450 155 Z' },
      { iso3: 'CHE', name: 'Switzerland', x: 475, y: 140, w: 18, h: 18, path: 'M 470 138 L 485 138 L 485 150 L 470 150 Z' },
      { iso3: 'EMU', name: 'EU/Euro Area', x: 500, y: 145, w: 40, h: 40, path: 'M 490 140 L 530 140 L 525 170 L 490 170 Z' },
      { iso3: 'TUR', name: 'Turkey', x: 560, y: 160, w: 45, h: 25, path: 'M 545 155 L 590 155 L 585 175 L 545 175 Z' },
      { iso3: 'RUS', name: 'Russia', x: 650, y: 90, w: 220, h: 70, path: 'M 530 60 L 850 50 L 820 120 L 540 120 Z' },
      { iso3: 'SAU', name: 'Saudi Arabia', x: 580, y: 220, w: 60, h: 50, path: 'M 560 200 L 620 200 L 610 250 L 565 240 Z' },
      { iso3: 'ZAF', name: 'South Africa', x: 520, y: 360, w: 50, h: 40, path: 'M 500 350 L 550 350 L 540 390 L 505 385 Z' },
      { iso3: 'IND', name: 'India', x: 675, y: 210, w: 60, h: 70, path: 'M 650 180 L 710 180 L 690 255 L 660 230 Z' },
      { iso3: 'CHN', name: 'China', x: 740, y: 160, w: 110, h: 80, path: 'M 680 130 L 810 130 L 800 200 L 710 200 Z' },
      { iso3: 'KOR', name: 'South Korea', x: 810, y: 165, w: 22, h: 22, path: 'M 805 160 L 825 160 L 825 180 L 805 180 Z' },
      { iso3: 'JPN', name: 'Japan', x: 840, y: 165, w: 30, h: 45, path: 'M 830 150 L 855 150 L 850 200 L 835 190 Z' },
      { iso3: 'IDN', name: 'Indonesia', x: 760, y: 275, w: 80, h: 25, path: 'M 725 265 L 815 265 L 805 285 L 730 285 Z' },
      { iso3: 'SGP', name: 'Singapore', x: 740, y: 255, w: 16, h: 16, path: 'M 735 250 L 748 250 L 748 260 L 735 260 Z' },
      { iso3: 'AUS', name: 'Australia', x: 800, y: 340, w: 100, h: 70, path: 'M 760 310 L 860 310 L 850 380 L 770 380 Z' }
    ];

    const shapes = countryPolygons.map(c => {
      const color = this._getColorForCountry(c.iso3);
      const isSelected = this.selectedIso3 === c.iso3;
      return `
        <g class="country-shape ${isSelected ? 'selected' : ''}" data-iso3="${c.iso3}">
          <path d="${c.path}" fill="${color}" stroke="#0b0f19" stroke-width="1.5" />
          <text x="${c.x}" y="${c.y}" fill="#ffffff" font-size="11" font-weight="600" text-anchor="middle" pointer-events="none">
            ${c.iso3}
          </text>
        </g>
      `;
    }).join('');

    return `
      <svg viewBox="0 0 920 440" class="world-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Ocean Background with subtle coordinates -->
        <rect width="920" height="440" fill="#0c121e" rx="8" />
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="920" height="440" fill="url(#grid)" />
        <line x1="0" y1="220" x2="920" y2="220" stroke="rgba(56, 189, 248, 0.15)" stroke-dasharray="4 4" stroke-width="1" />
        
        <!-- Country Shapes -->
        ${shapes}
      </svg>
    `;
  }

  _bindEvents() {
    // Layer switch buttons
    this.container.querySelectorAll('.map-layer-controls button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnElem = e.target.closest('button');
        this.activeLayer = btnElem.dataset.layer;
        this.render();
      });
    });

    const tooltip = this.container.querySelector('#map-tooltip');
    const svgContainer = this.container.querySelector('#svg-world-map');

    // Country hover & click handlers
    this.container.querySelectorAll('.country-shape').forEach(elem => {
      const iso3 = elem.dataset.iso3;
      const meta = getCountryByIso3(iso3);
      const cb = getCentralBankByIso3(iso3);

      elem.addEventListener('mouseenter', (e) => {
        const rect = svgContainer.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
        
        let content = `<strong>${meta ? meta.flag : ''} ${meta ? meta.nameJa : iso3} (${iso3})</strong><hr/>`;
        
        if (this.activeLayer === 'POLICY_RATE' && cb) {
          content += `
            <div class="tt-row"><span>政策金利:</span> <strong>${cb.rateDisplay}</strong></div>
            <div class="tt-row"><span>中銀:</span> <span>${cb.centralBank}</span></div>
            <div class="tt-row"><span>直近決定:</span> <span>${cb.lastChangeDate}</span></div>
          `;
        } else if (this.activeLayer === 'CPI' && cb) {
          content += `
            <div class="tt-row"><span>CPI物価:</span> <strong>${cb.currentCpi}%</strong></div>
            <div class="tt-row"><span>物価目標:</span> <span>${cb.inflationTarget}</span></div>
            <div class="tt-row"><span>実質金利:</span> <span>${(cb.rate - cb.currentCpi).toFixed(2)}%</span></div>
          `;
        } else {
          const resId = this.activeLayer === 'UN_UKRAINE' ? 'A/RES/ES-11/1' : 'A/RES/ES-10/22';
          const res = UN_RESOLUTIONS.find(r => r.id === resId);
          const voteCode = res && res.votes ? res.votes[iso3] : null;
          const voteText = voteCode === 'Y' ? '賛成 (In Favour)' : (voteCode === 'N' ? '反対 (Against)' : (voteCode === 'A' ? '棄権 (Abstain)' : '不参加/無投票'));
          content += `
            <div class="tt-row"><span>決議:</span> <span>${res.symbol}</span></div>
            <div class="tt-row"><span>投票スタンス:</span> <strong>${voteText}</strong></div>
            <div class="tt-row"><span>採択日:</span> <span>${res.date}</span></div>
          `;
        }

        content += `<div class="tt-hint">クリックして詳細ファクトを開く</div>`;

        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
        
        const posX = elemRect.left - rect.left + (elemRect.width / 2);
        const posY = elemRect.top - rect.top - 10;
        tooltip.style.left = `${posX}px`;
        tooltip.style.top = `${posY}px`;
      });

      elem.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      elem.addEventListener('click', () => {
        this.selectedIso3 = iso3;
        this.onSelectCountry(iso3);
      });
    });
  }
}
