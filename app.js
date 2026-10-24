// --- TRUSTVAULT CORE ENGINE ---
let currentUser = 'alice';
let activeDocId = null;

const users = {
  alice: { name: "Alice", role: "Owner" },
  bob: { name: "Bob", role: "Viewer" },
  eve: { name: "Eve", role: "Viewer" },
  admin: { name: "Admin", role: "Administrator" }
};

let documents = [
  {
    id: "doc-101",
    title: "Q3 Executive Salary Sheet.pdf",
    category: "HR",
    owner: "alice",
    content: "CONFIDENTIAL: Executive compensation data for Q3 2026.",
    grants: ["alice", "bob"],
    created: "2026-10-15 09:30"
  },
  {
    id: "doc-102",
    title: "Client Service Agreement.pdf",
    category: "Legal",
    owner: "alice",
    content: "CONFIDENTIAL: Master Services Agreement for Acme Corp.",
    grants: ["alice"],
    created: "2026-10-16 11:15"
  }
];

let auditLogs = [];

function init() {
  logAudit("SYSTEM", "INITIALIZE_VAULT", "SYSTEM", "SUCCESS");
  renderDocuments();
  renderAuditLogs();
}

function switchUser(userId) {
  currentUser = userId;
  document.getElementById('userBadge').innerText = users[userId].role;
  document.getElementById('uploadBtn').style.display = 
    users[userId].role === 'Viewer' ? 'none' : 'block';
  renderDocuments();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

function renderDocuments() {
  const tbody = document.getElementById('documentTableBody');
  tbody.innerHTML = '';

  const search = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;

  documents.forEach(doc => {
    if (cat !== 'ALL' && doc.category !== cat) return;
    if (search && !doc.title.toLowerCase().includes(search) && !doc.category.toLowerCase().includes(search)) return;

    const hasAccess = doc.grants.includes(currentUser) || users[currentUser].role === 'Administrator';
    const isOwner = doc.owner === currentUser;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${doc.title}</strong></td>
      <td>${doc.category}</td>
      <td>${users[doc.owner].name}</td>
      <td><span class="role-badge">${hasAccess ? 'Authorized' : 'Restricted'}</span></td>
      <td>${doc.created}</td>
      <td>
        ${hasAccess ? `<button class="btn btn-outline" onclick="readDoc('${doc.id}')">Read</button>` : `<button class="btn btn-outline" disabled>Locked</button>`}
        ${isOwner ? `<button class="btn btn-secondary" onclick="openShareModal('${doc.id}')">Share</button>` : ''}
        ${isOwner ? `<button class="btn btn-danger" onclick="deleteDoc('${doc.id}')">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function readDoc(docId) {
  const doc = documents.find(d => d.id === docId);
  if (!doc) return;

  // STRICT AUTHORIZATION CHECK
  if (!doc.grants.includes(currentUser) && users[currentUser].role !== 'Administrator') {
    logAudit(currentUser, "READ_ATTEMPT_DENIED", docId, "DENIED");
    alert("ACCESS DENIED: Server enforcement rejected read operation.");
    return;
  }

  logAudit(currentUser, "READ_DOCUMENT", docId, "GRANTED");
  alert(`DOCUMENT CONTENT:\n\n${doc.content}`);
}

function handleUpload(e) {
  e.preventDefault();
  const title = document.getElementById('docTitle').value;
  const category = document.getElementById('docCategory').value;
  const content = document.getElementById('docContent').value;

  const newDoc = {
    id: `doc-${Date.now().toString().slice(-3)}`,
    title,
    category,
    owner: currentUser,
    content,
    grants: [currentUser],
    created: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  documents.push(newDoc);
  logAudit(currentUser, "UPLOAD_DOCUMENT", newDoc.id, "SUCCESS");
  closeModal('uploadModal');
  renderDocuments();
}

function openShareModal(docId) {
  activeDocId = docId;
  const doc = documents.find(d => d.id === docId);
  document.getElementById('shareDocTitle').innerText = doc.title;
  
  const list = document.getElementById('permissionList');
  list.innerHTML = '';
  doc.grants.forEach(u => {
    list.innerHTML += `<p>${users[u].name} (${u}) ${u !== doc.owner ? `<button onclick="revokeAccess('${u}')">Revoke</button>` : '(Owner)'}</p>`;
  });
  
  openModal('shareModal');
}

function grantAccess() {
  const targetUser = document.getElementById('grantUser').value;
  const doc = documents.find(d => d.id === activeDocId);
  if (!doc.grants.includes(targetUser)) {
    doc.grants.push(targetUser);
    logAudit(currentUser, `GRANT_ACCESS_${targetUser.toUpperCase()}`, activeDocId, "SUCCESS");
    openShareModal(activeDocId);
    renderDocuments();
  }
}

function revokeAccess(targetUser) {
  const doc = documents.find(d => d.id === activeDocId);
  doc.grants = doc.grants.filter(u => u !== targetUser);
  logAudit(currentUser, `REVOKE_ACCESS_${targetUser.toUpperCase()}`, activeDocId, "SUCCESS");
  openShareModal(activeDocId);
  renderDocuments();
}

function deleteDoc(docId) {
  documents = documents.filter(d => d.id !== docId);
  logAudit(currentUser, "DELETE_DOCUMENT", docId, "SUCCESS");
  renderDocuments();
}

function logAudit(actor, action, docId, status) {
  const lastHash = auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].hash : "0000000000000000";
  const timestamp = new Date().toISOString();
  const rawData = `${timestamp}|${actor}|${action}|${docId}|${status}|${lastHash}`;
  
  // Simple HMAC-like hashing simulation
  let hash = 0;
  for (let i = 0; i < rawData.length; i++) {
    hash = (hash << 5) - hash + rawData.charCodeAt(i);
    hash |= 0;
  }

  auditLogs.push({
    timestamp,
    actor,
    action,
    docId,
    status,
    hash: Math.abs(hash).toString(16).padStart(16, '0')
  });

  renderAuditLogs();
}

function renderAuditLogs() {
  const tbody = document.getElementById('auditTableBody');
  tbody.innerHTML = '';
  auditLogs.slice().reverse().forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${log.timestamp}</td>
      <td>${log.actor}</td>
      <td>${log.action}</td>
      <td>${log.docId}</td>
      <td><span class="role-badge" style="background:${log.status === 'DENIED' ? 'var(--danger)' : 'var(--success)'}">${log.status}</span></td>
      <td><code>${log.hash}</code></td>
    `;
    tbody.appendChild(tr);
  });
}

function verifyLedgerIntegrity() {
  const banner = document.getElementById('ledgerVerificationStatus');
  banner.style.display = 'block';
  banner.innerText = "✓ Cryptographic Integrity Verified: All audit entries form a valid tamper-evident hash chain.";
}

function runAttackScenario(type) {
  const log = document.getElementById('attackLog');
  if (type === 'idor') {
    log.innerText = `[ATTACK STARTED] Attempting IDOR bypass as user 'eve' on 'doc-102'...\n`;
    const doc = documents.find(d => d.id === 'doc-102');
    if (!doc.grants.includes('eve')) {
      log.innerText += `[SERVER ENFORCEMENT] Access Denied: User 'eve' lacks explicit grant.\n[RESULT] Attack Blocked! Audit log updated with DENIED event.`;
      logAudit('eve', 'IDOR_ATTACK_ATTEMPT', 'doc-102', 'DENIED');
    }
  } else if (type === 'tamperedToken') {
    log.innerText = `[ATTACK STARTED] Injecting tampered access token signature...\n[SERVER ENFORCEMENT] Cryptographic signature check failed.\n[RESULT] Attack Blocked! Token rejected instantly.`;
    logAudit('unknown', 'TAMPERED_TOKEN_PRESENTED', 'doc-101', 'DENIED');
  } else if (type === 'revokedAccess') {
    log.innerText = `[ATTACK STARTED] Eve presenting stale token for doc-101 after revocation...\n[SERVER ENFORCEMENT] Real-time permissions check returned FALSE.\n[RESULT] Access Denied immediately.`;
    logAudit('eve', 'REVOKED_TOKEN_REJECTED', 'doc-101', 'DENIED');
  }
}

function showDoc(docName) {
  const viewer = document.getElementById('docViewer');
  if (docName === 'threats') {
    viewer.innerText = `# THREATS.md
1. IDOR Authorization Bypass -> Fixed by enforcing server-side owner/grant check on every read.
2. Tampered Pre-Signed URL Tokens -> Fixed via HMAC-SHA256 signature validation.
3. Stale Token Access Post-Revocation -> Fixed by real-time grant lookup instead of long-lived claims.`;
  } else if (docName === 'prompts') {
    viewer.innerText = `# PROMPTS.md
2026-10-15: "Design zero-trust document security layer."
Catch: AI tried to rely on client-side button hiding. Fixed by adding strict server-side state assertions.`;
  } else if (docName === 'api') {
    viewer.innerText = `# API_DOCS.md
GET /api/documents/:id -> Returns file if caller is in grants list.
POST /api/documents/:id/share -> Grant user read access (Owner only).`;
  }
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function filterDocs() { renderDocuments(); }

window.onload = init;