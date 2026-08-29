// Component: United Nations Official Resolutions & International Treaties Tracker

import { UN_RESOLUTIONS, MULTILATERAL_TREATIES } from '../data/unResolutions.js';
import { COUNTRIES, getCountryByIso3 } from '../data/countries.js';

export class UNTrackerComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onInspectSource = options.onInspectSource || (() => {});
    this.activeTab = 'RESOLUTIONS'; // 'RESOLUTIONS', 'TREATIES'
    this.selectedResolutionId = 'A/RES/ES-11/1';
    this.searchQuery = '';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card un-tracker-card">
        <div class="card-header">
          <div class="header-title-group">
            <div class="icon-badge"><i data-lucide="scale"></i></div>
            <div>
              <h3>国際政治・国連公式決議＆条約台帳</h3>
              <p class="subtitle">国連デジタルライブラリ公表の公式採決レコードおよび批准状況</p>
            </div>
          </div>

          <div class="header-actions">
            <div class="btn-group">
              <button class="btn btn-sm ${this.activeTab === 'RESOLUTIONS' ? 'active' : ''}" data-un-tab="RESOLUTIONS">
                <i data-lucide="vote"></i> 国連総会 決議採決記録
              </button>
              <button class="btn btn-sm ${this.activeTab === 'TREATIES' ? 'active' : ''}" data-un-tab="TREATIES">
                <i data-lucide="scroll"></i> 主要多国間条約 批准台帳
              </button>
            </div>
          </div>
        </div>

        <div class="un-content-area">
          ${this.activeTab === 'RESOLUTIONS' ? this._renderResolutionsTab() : this._renderTreatiesTab()}
        </div>

        <div class="card-footer">
          <div class="fact-disclaimer">
            <i data-lucide="shield-check"></i>
            <span>すべての採決記録は国連事務局公式記録（United Nations Digital Library）から直接抽出されています。</span>
          </div>
          <a href="https://digitallibrary.un.org/" target="_blank" rel="noopener noreferrer" class="source-link-btn">
            <i data-lucide="external-link"></i> UN Digital Library
          </a>
        </div>
      </div>
    `;

    this._bindEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  _renderResolutionsTab() {
    const activeRes = UN_RESOLUTIONS.find(r => r.id === this.selectedResolutionId) || UN_RESOLUTIONS[0];
    const totalVotes = activeRes.voting.inFavour + activeRes.voting.against + activeRes.voting.abstain + (activeRes.voting.nonVoting || 0);
    const favourPct = ((activeRes.voting.inFavour / totalVotes) * 100).toFixed(1);
    const againstPct = ((activeRes.voting.against / totalVotes) * 100).toFixed(1);
    const abstainPct = ((activeRes.voting.abstain / totalVotes) * 100).toFixed(1);

    return `
      <div class="un-layout">
        <!-- Resolution Selector List -->
        <div class="un-sidebar">
          <div class="sidebar-title">国連総会 決議一覧</div>
          <div class="res-list">
            ${UN_RESOLUTIONS.map(res => `
              <div class="res-item ${res.id === this.selectedResolutionId ? 'active' : ''}" data-res-id="${res.id}">
                <div class="res-item-header">
                  <span class="res-badge">${res.symbol}</span>
                  <span class="res-date">${res.date}</span>
                </div>
                <div class="res-item-title">${res.titleJa}</div>
                <div class="res-item-topic"><i data-lucide="tag"></i> ${res.topic}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Resolution Detailed Fact Sheet -->
        <div class="un-main-panel">
          <div class="res-detail-header">
            <div>
              <span class="res-symbol-large">${activeRes.id}</span>
              <span class="res-session">${activeRes.session}</span>
              <h4 class="res-main-title">${activeRes.titleJa}</h4>
              <p class="res-en-title">Official Title: <em>"${activeRes.title}"</em></p>
            </div>
            <div class="res-header-actions">
              <a href="${activeRes.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="国連公式決議文 (PDF)">
                <i data-lucide="file-text"></i> 公式決議文 (UN Docs)
              </a>
              <a href="${activeRes.documentUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="UN Digital Library レコード">
                <i data-lucide="external-link"></i> 採決原簿
              </a>
            </div>
          </div>

          <!-- Fact Summary -->
          <div class="res-fact-summary">
            <strong>客観的決議骨子:</strong>
            <p>${activeRes.summaryFact}</p>
          </div>

          <!-- Vote Ratio Bar -->
          <div class="vote-distribution-box">
            <div class="vote-counts-header">
              <span class="vote-stat stat-favour">賛成: <strong>${activeRes.voting.inFavour}</strong> 国 (${favourPct}%)</span>
              <span class="vote-stat stat-against">反対: <strong>${activeRes.voting.against}</strong> 国 (${againstPct}%)</span>
              <span class="vote-stat stat-abstain">棄権: <strong>${activeRes.voting.abstain}</strong> 国 (${abstainPct}%)</span>
              ${activeRes.voting.nonVoting ? `<span class="vote-stat stat-nonvoting">無投票: <strong>${activeRes.voting.nonVoting}</strong> 国</span>` : ''}
            </div>
            <div class="vote-bar">
              <div class="bar-favour" style="width: ${favourPct}%;" title="賛成 ${favourPct}%"></div>
              <div class="bar-against" style="width: ${againstPct}%;" title="反対 ${againstPct}%"></div>
              <div class="bar-abstain" style="width: ${abstainPct}%;" title="棄権 ${abstainPct}%"></div>
            </div>
          </div>

          <!-- Country Stances Matrix -->
          <div class="country-votes-section">
            <h5>主要国の公式投票スタンス</h5>
            <div class="votes-grid">
              ${COUNTRIES.map(country => {
                const voteCode = activeRes.votes ? activeRes.votes[country.iso3] : null;
                const voteInfo = this._getVoteBadgeInfo(voteCode, activeRes.voting.adoptedWithoutVote);
                return `
                  <div class="vote-card ${voteInfo.cssClass}">
                    <div class="vote-card-country">
                      <span class="flag">${country.flag}</span>
                      <span class="cname">${country.nameJa}</span>
                    </div>
                    <span class="vote-card-badge">${voteInfo.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderTreatiesTab() {
    return `
      <div class="treaties-panel">
        <div class="table-responsive">
          <table class="fact-table treaties-table">
            <thead>
              <tr>
                <th>条約名 (Multilateral Treaty)</th>
                <th>寄託者 (Depositary)</th>
                <th class="text-center">発効日</th>
                <th class="text-center">締約国数</th>
                <th>主要国の批准・参加ステータス (客観事実)</th>
                <th class="text-center">公式登録簿</th>
              </tr>
            </thead>
            <tbody>
              ${MULTILATERAL_TREATIES.map(t => {
                return `
                  <tr>
                    <td>
                      <strong>${t.nameJa}</strong>
                      <div class="treaty-en-name">${t.name}</div>
                    </td>
                    <td>${t.depositary}</td>
                    <td class="text-center"><span class="date-tag">${t.entryIntoForce}</span></td>
                    <td class="text-center"><span class="badge badge-parties">${t.totalParties} カ国</span></td>
                    <td>
                      <div class="treaty-status-chips">
                        ${Object.keys(t.statuses).map(iso3 => {
                          const c = getCountryByIso3(iso3);
                          const status = t.statuses[iso3];
                          const isParty = status.includes('Ratified') || status.includes('Acceded') || status.includes('State Party') || status.includes('Accepted');
                          return `
                            <span class="treaty-chip ${isParty ? 'party' : 'non-party'}" title="${c ? c.nameJa : iso3}: ${status}">
                              ${c ? c.flag : ''} ${iso3}: ${status}
                            </span>
                          `;
                        }).join('')}
                      </div>
                    </td>
                    <td class="text-center">
                      <a href="${t.officialLink}" target="_blank" rel="noopener noreferrer" class="source-link-btn">
                        <i data-lucide="external-link"></i> UN 条約集
                      </a>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  _getVoteBadgeInfo(code, adoptedWithoutVote) {
    if (adoptedWithoutVote) {
      return { label: 'コンセンサス採択 (賛成)', cssClass: 'vote-favour' };
    }
    if (code === 'Y') {
      return { label: '賛成 (In Favour)', cssClass: 'vote-favour' };
    } else if (code === 'N') {
      return { label: '反対 (Against)', cssClass: 'vote-against' };
    } else if (code === 'A') {
      return { label: '棄権 (Abstain)', cssClass: 'vote-abstain' };
    }
    return { label: '無投票 / その他', cssClass: 'vote-none' };
  }

  _bindEvents() {
    // Tab toggles
    this.container.querySelectorAll('[data-un-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnElem = e.target.closest('button');
        this.activeTab = btnElem.dataset.unTab;
        this.render();
      });
    });

    // Resolution selection
    this.container.querySelectorAll('.res-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectedResolutionId = item.dataset.resId;
        this.render();
      });
    });
  }
}
