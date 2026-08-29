// Component: Country Primary Facts Detail Modal

import { COUNTRIES, getCountryByIso3 } from '../data/countries.js';
import { getCentralBankByIso3 } from '../data/centralBanks.js';
import { UN_RESOLUTIONS, MULTILATERAL_TREATIES } from '../data/unResolutions.js';

export class CountryDetailModal {
  constructor(options = {}) {
    this.onInspectSource = options.onInspectSource || (() => {});
    this.modalElem = null;
    this._createModalContainer();
  }

  _createModalContainer() {
    let elem = document.getElementById('country-detail-modal');
    if (!elem) {
      elem = document.createElement('div');
      elem.id = 'country-detail-modal';
      elem.className = 'modal-backdrop';
      elem.style.display = 'none';
      document.body.appendChild(elem);
    }
    this.modalElem = elem;
  }

  show(iso3) {
    const country = getCountryByIso3(iso3);
    const cb = getCentralBankByIso3(iso3);

    if (!country) return;

    // Collect UN resolution stances for this country
    const unStances = UN_RESOLUTIONS.map(res => {
      const vote = res.votes ? res.votes[iso3] : null;
      let label = '無投票 / その他';
      let badgeClass = 'vote-none';
      if (res.voting.adoptedWithoutVote || vote === 'Y') {
        label = '賛成 (In Favour)';
        badgeClass = 'vote-favour';
      } else if (vote === 'N') {
        label = '反対 (Against)';
        badgeClass = 'vote-against';
      } else if (vote === 'A') {
        label = '棄権 (Abstain)';
        badgeClass = 'vote-abstain';
      }
      return { res, label, badgeClass };
    });

    // Collect Treaty Statuses for this country
    const treatyStances = MULTILATERAL_TREATIES.map(t => {
      const status = t.statuses[iso3] || '公表情報なし / 未批准';
      return { treaty: t, status };
    });

    this.modalElem.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="country-modal-title">
            <span class="modal-flag">${country.flag}</span>
            <div>
              <h3>${country.nameJa} (${country.name})</h3>
              <div class="modal-badges">
                <span class="badge badge-iso">${country.iso3} / ${country.iso2}</span>
                <span class="badge badge-region">${country.region}</span>
                <span class="badge badge-currency">通貨: ${country.currency}</span>
                ${(country.blocs || []).map(b => `<span class="badge badge-bloc">${b}</span>`).join('')}
              </div>
            </div>
          </div>
          <button class="modal-close-btn" id="country-modal-close"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <!-- Central Bank & Financial Facts -->
          <div class="detail-section">
            <h4 class="section-title"><i data-lucide="landmark"></i> 中央銀行・金融政策の一次情報</h4>
            ${cb ? `
              <div class="fact-grid">
                <div class="fact-card">
                  <span class="label">管轄中央銀行</span>
                  <strong class="val">${cb.centralBank}</strong>
                  <span class="sub">${cb.sourceAgency}</span>
                </div>
                <div class="fact-card highlight-card">
                  <span class="label">政策金利 (Policy Rate)</span>
                  <strong class="val">${cb.rateDisplay}</strong>
                  <span class="sub">直近改定: ${cb.lastChangeDate} (${cb.direction})</span>
                </div>
                <div class="fact-card">
                  <span class="label">最新CPI (インフレ率)</span>
                  <strong class="val">${cb.currentCpi}%</strong>
                  <span class="sub">公的物価目標: ${cb.inflationTarget}</span>
                </div>
                <div class="fact-card">
                  <span class="label">国債10年利回り</span>
                  <strong class="val">${cb.tenYearYield}%</strong>
                  <span class="sub">実質利回り: ${(cb.tenYearYield - cb.currentCpi).toFixed(2)}%</span>
                </div>
                <div class="fact-card">
                  <span class="label">中銀総資産 (Balance Sheet)</span>
                  <strong class="val">${cb.balanceSheet}</strong>
                  <span class="sub">公表残高ベース</span>
                </div>
                <div class="fact-card">
                  <span class="label">公式発表文書コード</span>
                  <strong class="val monospace">${cb.statementCode}</strong>
                  <a href="${cb.sourceUrl}" target="_blank" rel="noopener noreferrer" class="link-inline">公式発表を開く <i data-lucide="external-link"></i></a>
                </div>
              </div>
            ` : `<p class="empty-note">主要中央銀行データに直接登録されていません。</p>`}
          </div>

          <!-- UN Resolution Votes -->
          <div class="detail-section">
            <h4 class="section-title"><i data-lucide="vote"></i> 国連公式決議における投票レコード</h4>
            <div class="un-record-list">
              ${unStances.map(item => `
                <div class="un-record-item">
                  <div class="un-rec-info">
                    <span class="un-rec-symbol">${item.res.symbol} (${item.res.date})</span>
                    <strong class="un-rec-title">${item.res.titleJa}</strong>
                  </div>
                  <span class="vote-card-badge ${item.badgeClass}">${item.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Treaties -->
          <div class="detail-section">
            <h4 class="section-title"><i data-lucide="scroll"></i> 主要多国間条約 批准状況</h4>
            <div class="treaty-record-list">
              ${treatyStances.map(item => `
                <div class="treaty-record-item">
                  <div>
                    <strong>${item.treaty.nameJa}</strong>
                    <div class="treaty-sub">${item.treaty.name}</div>
                  </div>
                  <span class="treaty-status-badge">${item.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="country-modal-close-bottom">閉じる</button>
          <a href="${country.cbUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <i data-lucide="external-link"></i> ${country.nameJa} 公式中銀ポータル
          </a>
        </div>
      </div>
    `;

    this.modalElem.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();

    // Bind Close
    const close = () => { this.modalElem.style.display = 'none'; };
    const closeBtn = this.modalElem.querySelector('#country-modal-close');
    const closeBottom = this.modalElem.querySelector('#country-modal-close-bottom');
    if (closeBtn) closeBtn.onclick = close;
    if (closeBottom) closeBottom.onclick = close;
    this.modalElem.onclick = (e) => {
      if (e.target === this.modalElem) close();
    };
  }
}
