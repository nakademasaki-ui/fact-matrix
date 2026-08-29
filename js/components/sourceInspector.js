// Component: Primary Source & Raw Data Lineage Inspector

export class SourceInspectorModal {
  constructor() {
    this.modalElem = null;
    this._createModalContainer();
  }

  _createModalContainer() {
    let elem = document.getElementById('source-inspector-modal');
    if (!elem) {
      elem = document.createElement('div');
      elem.id = 'source-inspector-modal';
      elem.className = 'modal-backdrop';
      elem.style.display = 'none';
      document.body.appendChild(elem);
    }
    this.modalElem = elem;
  }

  show(info = {}) {
    const rawJsonStr = JSON.stringify(info.data || {}, null, 2);

    this.modalElem.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <div class="inspector-modal-title">
            <div class="icon-badge icon-badge-cyan"><i data-lucide="binary"></i></div>
            <div>
              <h3>一次データ・リネージ検証インスペクター</h3>
              <p class="subtitle">${info.title || '公的統計データ'}</p>
            </div>
          </div>
          <button class="modal-close-btn" id="inspector-modal-close"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body inspector-body">
          <div class="inspector-meta-grid">
            <div class="inspector-meta-item">
              <span class="lbl">データ種別</span>
              <strong class="val">${info.type || 'Primary Official Record'}</strong>
            </div>
            <div class="inspector-meta-item">
              <span class="lbl">公的情報提供機関</span>
              <strong class="val">${info.sourceAgency || 'Official Agency'}</strong>
            </div>
            <div class="inspector-meta-item">
              <span class="lbl">文書・指標識別子</span>
              <strong class="val monospace">${info.statementCode || 'N/A'}</strong>
            </div>
            <div class="inspector-meta-item">
              <span class="lbl">検証タイムスタンプ</span>
              <strong class="val monospace">${new Date().toISOString()}</strong>
            </div>
          </div>

          ${info.apiEndpoint ? `
            <div class="api-endpoint-box">
              <div class="endpoint-header">
                <span><i data-lucide="link"></i> ダイレクトAPIエンドポイント (REST URL):</span>
                <button class="copy-btn" id="copy-endpoint-btn"><i data-lucide="copy"></i> URLコピー</button>
              </div>
              <code class="endpoint-code">${info.apiEndpoint}</code>
            </div>
          ` : ''}

          <div class="raw-json-section">
            <div class="json-header">
              <span><i data-lucide="file-json"></i> 未加工 生データ (Raw JSON Payload):</span>
              <button class="copy-btn" id="copy-json-btn"><i data-lucide="copy"></i> JSONコピー</button>
            </div>
            <pre class="json-viewer"><code>${this._escapeHtml(rawJsonStr)}</code></pre>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="inspector-modal-close-btn">閉じる</button>
          ${info.sourceUrl ? `
            <a href="${info.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <i data-lucide="external-link"></i> 公式ポータルで直接確認
            </a>
          ` : ''}
        </div>
      </div>
    `;

    this.modalElem.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();

    // Bind Close
    const close = () => { this.modalElem.style.display = 'none'; };
    const closeBtn = this.modalElem.querySelector('#inspector-modal-close');
    const closeBottom = this.modalElem.querySelector('#inspector-modal-close-btn');
    if (closeBtn) closeBtn.onclick = close;
    if (closeBottom) closeBottom.onclick = close;
    this.modalElem.onclick = (e) => {
      if (e.target === this.modalElem) close();
    };

    // Copy endpoint
    const copyEpBtn = this.modalElem.querySelector('#copy-endpoint-btn');
    if (copyEpBtn && info.apiEndpoint) {
      copyEpBtn.onclick = () => {
        navigator.clipboard.writeText(info.apiEndpoint);
        copyEpBtn.innerHTML = `<i data-lucide="check"></i> コピー完了`;
        if (window.lucide) window.lucide.createIcons();
      };
    }

    // Copy JSON
    const copyJsonBtn = this.modalElem.querySelector('#copy-json-btn');
    if (copyJsonBtn) {
      copyJsonBtn.onclick = () => {
        navigator.clipboard.writeText(rawJsonStr);
        copyJsonBtn.innerHTML = `<i data-lucide="check"></i> コピー完了`;
        if (window.lucide) window.lucide.createIcons();
      };
    }
  }

  _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
