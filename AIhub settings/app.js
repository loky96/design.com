// Sidebar navigation
function goToSettingsPage(page) {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.settings-page').forEach(p => p.classList.remove('active'));

  const item = document.querySelector('.sidebar-item[data-page="' + page + '"]');
  if (item) item.classList.add('active');
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
}

document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    goToSettingsPage(item.dataset.page);
  });
});

// Members data
const MEMBERS = [
  { name: 'Lokeshkumar V M',     email: 'lokeshkumar.vm@instabase.com',              role: 'Admin',  status: 'Joined' },
  { name: 'A W',                 email: 'andy+reviewer@instabase.com',               role: 'Member', status: 'Joined' },
  { name: 'Aanchal Sharma',      email: 'aanchal.sharma@instabase.com',              role: 'Member', status: 'Joined' },
  { name: 'Aashish Singh',       email: 'aashish.singh@instabase.com',               role: 'Member', status: 'Joined' },
  { name: 'Aastha .',            email: 'aastha.pandey+aihubprod@instabase.com',     role: 'Admin',  status: 'Joined' },
  { name: 'Aayush Dutt',         email: 'aayush.dutt@instabase.com',                 role: 'Member', status: 'Joined' },
  { name: 'Abhijitt Murugan',    email: 'abhijitt.murugan@instabase.com',            role: 'Member', status: 'Joined' },
  { name: 'Abhijnan Vegi',       email: 'abhijnan.vegi@instabase.com',               role: 'Member', status: 'Joined' },
  { name: 'Abhinav Khanna',      email: 'abhinav.khanna@instabase.com',              role: 'Member', status: 'Joined' },
  { name: 'Abhishek Adupa',      email: 'abhishek.adupa@instabase.com',              role: 'Member', status: 'Joined' },
  { name: 'Abhishek Chaudhary',  email: 'abhishek.chaudhary@instabase.com',          role: 'Member', status: 'Joined' },
  { name: 'Abhishek Kashyap',    email: 'abhishek.kashyap+aihubprod@instabase.com',  role: 'Member', status: 'Joined' },
  { name: 'Abhishek Kashyap',    email: 'abhishek.kashyap@instabase.com',            role: 'Member', status: 'Joined' },
  { name: 'Abhishek Saini',      email: 'abhishek.saini@instabase.com',              role: 'Member', status: 'Joined' },
  { name: 'Adith Kumar',         email: 'adith.kumar@instabase.com',                 role: 'Member', status: 'Joined' },
  { name: 'Aditi Subbarao',      email: 'aditi.subbarao@instabase.com',              role: 'Member', status: 'Joined' },
  { name: 'Admin Permissions',   email: 'div-dataoperations+admin@instabase.com',    role: 'Admin',  status: 'Joined' },
];

function memberUserId(email) {
  return email.split('@')[0];
}

const PILL_ICON_COLORS = {
  info: '#0a22b1',
  counter: '#6D6D6D',
  success: '#1a7135',
  warning: '#bf810c',
  error: '#b13b0a',
};

function pillHtml({ intent = 'counter', label, icon, normalCase = false, customIcon }) {
  const classes = ['pill', `pill--${intent}`];
  if (normalCase) classes.push('pill--normal-case');
  let iconHtml = '';
  if (customIcon) {
    iconHtml = `<span class="pill__icon pill__icon--custom">${customIcon}</span>`;
  } else if (icon) {
    iconHtml = `<span class="pill__icon">${ibIcon(icon, { size: 12, color: PILL_ICON_COLORS[intent] || PILL_ICON_COLORS.counter })}</span>`;
  }
  const labelHtml = label ? `<span class="pill__text">${label}</span>` : '';
  return `<span class="${classes.join(' ')}">${iconHtml}${labelHtml}</span>`;
}

function roleBadgeHtml(role) {
  const isAdmin = role.toLowerCase() === 'admin';
  if (isAdmin) {
    return pillHtml({ intent: 'info', label: role });
  }
  return pillHtml({ intent: 'counter', label: 'Member', icon: 'user' });
}

function statusPillHtml(label = 'ACTIVE') {
  return pillHtml({ intent: 'success', label });
}

function ssoStatusPillHtml(enabled) {
  return pillHtml({
    intent: enabled ? 'success' : 'counter',
    label: enabled ? 'ENABLED' : 'DISABLED',
  });
}

// ── OAuth providers (API authorization) ──────────────────────
const OAUTH_PROVIDERS = [
  { name: 'Okta-instabase-OIDC', status: 'enabled', serviceAccounts: 12, userAccounts: 2 },
];

function renderOAuthProviders() {
  const table = document.getElementById('oauth-provider-table');
  const emptyState = document.getElementById('oauth-provider-empty-state');
  const list = document.getElementById('oauth-provider-list');
  if (!table || !emptyState || !list) return;

  const hasRows = OAUTH_PROVIDERS.length > 0;
  table.style.display = hasRows ? '' : 'none';
  emptyState.style.display = hasRows ? 'none' : '';
  if (!hasRows) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = OAUTH_PROVIDERS.map((p, i) => `
    <div class="sso-row oauth-row" data-status="${p.status}">
      <div class="col-main">
        <img src="illustration/Okta.png" width="20" height="20" style="object-fit:contain;flex-shrink:0;" />
        ${p.name}
      </div>
      <div class="col-status">${ssoStatusPillHtml(p.status === 'enabled')}</div>
      <div class="col-oauth-mappings">
        <a href="#" class="link-blue" onclick="event.preventDefault(); openOauthAccountsView('${p.name.replace(/'/g, "\\'")}')">${p.serviceAccounts} service accounts, ${p.userAccounts} user accounts</a>
      </div>
      <div class="sso-row-actions">
        <div class="sso-more-wrap">
          <button class="row-action-btn" title="More" onclick="toggleOauthProviderMenu(this)"><span data-icon="overflow2" data-size="16"></span></button>
          <div class="sso-context-menu" style="display:none;">
            <button class="sso-menu-item" type="button" onclick="openOauthAccountsView('${p.name.replace(/'/g, "\\'")}')">View all accounts</button>
            <button class="sso-menu-item" type="button">Edit configuration</button>
            <button class="sso-menu-item" onclick="toggleOauthProviderStatus(this, ${i})">${p.status === 'enabled' ? 'Disable' : 'Enable'} configuration</button>
            <div class="sso-menu-divider"></div>
            <button class="sso-menu-item sso-menu-delete" onclick="openDeleteOauthProviderModal(${i})">Delete configuration</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function toggleOauthProviderMenu(btn) {
  const menu = btn.nextElementSibling;
  const isOpen = menu.style.display !== 'none';
  document.querySelectorAll('#oauth-provider-list .sso-context-menu').forEach(m => m.style.display = 'none');
  menu.style.display = isOpen ? 'none' : 'block';
}

function toggleOauthProviderStatus(btn, index) {
  const provider = OAUTH_PROVIDERS[index];
  if (provider) provider.status = provider.status === 'enabled' ? 'disabled' : 'enabled';
  renderOAuthProviders();
}

function deleteOauthProviderRow(btn, index) {
  OAUTH_PROVIDERS.splice(index, 1);
  renderOAuthProviders();
  updateSaOauthMappingEmptyState();
}

let _deleteOauthProviderIndex = null;

function openDeleteOauthProviderModal(index) {
  document.querySelectorAll('#oauth-provider-list .sso-context-menu').forEach(m => m.style.display = 'none');
  const provider = OAUTH_PROVIDERS[index];
  if (!provider) return;
  _deleteOauthProviderIndex = index;
  const titleEl = document.getElementById('delete-oauth-provider-title');
  const input = document.getElementById('delete-oauth-provider-input');
  if (titleEl) titleEl.textContent = provider.name;
  if (input) {
    input.value = '';
    input.placeholder = `<${provider.name}>`;
  }
  updateDeleteOauthProviderButton();
  openModal('modal-delete-oauth-provider');
}

function updateDeleteOauthProviderButton() {
  const input = document.getElementById('delete-oauth-provider-input');
  const btn = document.getElementById('delete-oauth-provider-confirm-btn');
  if (!input || !btn || _deleteOauthProviderIndex === null) return;
  const provider = OAUTH_PROVIDERS[_deleteOauthProviderIndex];
  btn.disabled = !provider || input.value.trim() !== provider.name;
}

function confirmDeleteOauthProvider() {
  if (_deleteOauthProviderIndex === null) return;
  deleteOauthProviderRow(null, _deleteOauthProviderIndex);
  _deleteOauthProviderIndex = null;
  closeModal('modal-delete-oauth-provider');
}

// ── AI Hub OAuth apps (per service account) ──────────────────
function getSaOauthApps(sa) {
  if (!sa.oauthApps) sa.oauthApps = [];
  return sa.oauthApps;
}

function renderSaOauthApps(sa) {
  const empty = document.getElementById('sa-oauth-apps-empty');
  const content = document.getElementById('sa-oauth-apps-content');
  const list = document.getElementById('sa-oauth-apps-list');
  if (!empty || !content || !list || !sa) return;

  const allApps = getSaOauthApps(sa);
  if (allApps.length === 0) {
    empty.style.display = '';
    content.style.display = 'none';
    return;
  }

  const q = (document.getElementById('sa-oauth-apps-search')?.value || '').trim().toLowerCase();
  const apps = allApps.filter(a => !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));

  empty.style.display = 'none';
  content.style.display = 'block';
  list.innerHTML = apps.map(app => `
    <div class="sa-token-row">
      <div class="col-token-name">${app.name}</div>
      <div class="col-token-desc">${app.description || ''}</div>
      <div class="col-token-value">${app.clientId}</div>
      <div class="col-token-value">${'*'.repeat(9)}</div>
      <div class="col-token-expiration">${truncateTokenValue(app.clientId)}</div>
      <div class="col-token-actions-spacer"></div>
    </div>`).join('');
}

// ── AI Hub OAuth apps (per member) ────────────────────────────
function getMemberOauthApps(member) {
  if (!member.oauthApps) member.oauthApps = [];
  return member.oauthApps;
}

function renderOauthAppsInto(apps, ids) {
  const empty = document.getElementById(ids.empty);
  const content = document.getElementById(ids.content);
  const list = document.getElementById(ids.list);
  if (!empty || !content || !list) return;

  if (apps.length === 0) {
    empty.style.display = '';
    content.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  content.style.display = 'block';
  list.innerHTML = apps.map(app => `
    <div class="sa-token-row">
      <div class="col-token-name">${app.name}</div>
      <div class="col-token-desc">${app.description || ''}</div>
      <div class="col-token-value">${app.clientId}</div>
      <div class="col-token-value">${'*'.repeat(9)}</div>
      <div class="col-token-expiration">${truncateTokenValue(app.clientId)}</div>
      <div class="col-token-actions-spacer"></div>
    </div>`).join('');
}

function renderMemberOauthApps(member) {
  const apps = getMemberOauthApps(member);
  if (_activeMember === member) {
    renderOauthAppsInto(apps, { empty: 'member-oauth-apps-empty', content: 'member-oauth-apps-content', list: 'member-oauth-apps-list' });
  }
  if (member.name === 'Lokeshkumar V M') {
    renderOauthAppsInto(apps, { empty: 'apis-oauth-app-empty', content: 'apis-oauth-app-content', list: 'apis-oauth-app-list' });
  }
}

function getMemberOauthMappings(member) {
  if (!member.oauthMappings) member.oauthMappings = [];
  return member.oauthMappings;
}

function renderOauthMappingsInto(mappings, ids) {
  const empty = document.getElementById(ids.empty);
  const content = document.getElementById(ids.content);
  const list = document.getElementById(ids.list);
  if (!empty || !content || !list) return;

  if (mappings.length === 0) {
    empty.style.display = '';
    content.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  content.style.display = 'block';
  list.innerHTML = mappings.map(m => `
    <div class="sa-token-row">
      <div class="col-token-name">${m.name}</div>
      <div class="col-token-desc">${(m.externalId || '<Sub>').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      <div class="col-token-expiration">
        <img src="illustration/Okta.png" width="16" height="16" style="object-fit:contain;vertical-align:middle;margin-right:4px;" />${m.provider}
      </div>
      <div class="col-token-actions-spacer"></div>
    </div>`).join('');
}

function renderMemberOauthMappings(member) {
  const mappings = getMemberOauthMappings(member);
  if (_activeMember === member) {
    renderOauthMappingsInto(mappings, { empty: 'member-oauth-mapping-empty', content: 'member-oauth-mapping-content', list: 'member-oauth-mapping-list' });
  }
  if (member.name === 'Lokeshkumar V M') {
    renderOauthMappingsInto(mappings, { empty: 'apis-oauth-mapping-empty', content: 'apis-oauth-mapping-content', list: 'apis-oauth-mapping-list' });
  }
}

// ── Create AI Hub OAuth app ───────────────────────────────────
let _memberOauthAppTarget = null;

function openCreateOauthAppModal(memberTarget) {
  _memberOauthAppTarget = memberTarget || null;
  const nameInput = document.getElementById('oauth-app-name');
  const descInput = document.getElementById('oauth-app-description');
  if (nameInput) nameInput.value = '';
  if (descInput) descInput.value = '';
  updateCreateOauthAppButton();
  openModal('modal-create-oauth-app');
}

function updateCreateOauthAppButton() {
  const nameInput = document.getElementById('oauth-app-name');
  const btn = document.getElementById('create-oauth-app-btn');
  if (!nameInput || !btn) return;
  btn.disabled = !nameInput.value.trim();
}

function submitCreateOauthApp() {
  const btn = document.getElementById('create-oauth-app-btn');
  if (btn?.disabled) return;
  closeModal('modal-create-oauth-app');

  const name = document.getElementById('oauth-app-name')?.value.trim() || 'Some name';
  const description = document.getElementById('oauth-app-description')?.value.trim();
  const clientId = generateTokenValue().slice(0, 8).toUpperCase();
  const clientSecret = generateTokenValue();
  document.getElementById('oauth-app-client-id').textContent = clientId;
  document.getElementById('oauth-app-client-secret').textContent = clientSecret;

  const idCopy = document.getElementById('oauth-app-client-id-copy');
  if (idCopy) idCopy.onclick = () => copyText(idCopy, clientId);
  const secretCopy = document.getElementById('oauth-app-client-secret-copy');
  if (secretCopy) secretCopy.onclick = () => copyText(secretCopy, clientSecret);

  if (_activeServiceAccount) {
    getSaOauthApps(_activeServiceAccount).push({ name, description, clientId, clientSecret });
    renderSaOauthApps(_activeServiceAccount);
  } else if (_memberOauthAppTarget) {
    getMemberOauthApps(_memberOauthAppTarget).push({ name, description, clientId, clientSecret });
    renderMemberOauthApps(_memberOauthAppTarget);
    _memberOauthAppTarget = null;
  }

  updateAiHubAccountLinks();
  openModal('modal-oauth-app-success');
}

function getSaOauthMappings(sa) {
  if (!sa.oauthMappings) sa.oauthMappings = [];
  return sa.oauthMappings;
}

function renderSaOauthMappings(sa) {
  const list = document.getElementById('sa-oauth-mapping-list');
  const content = document.getElementById('sa-oauth-mapping-content');
  const headerActions = document.getElementById('sa-oauth-mapping-header-actions');
  if (!list || !content || !sa) return;
  const mappings = getSaOauthMappings(sa);

  content.style.display = mappings.length ? 'block' : 'none';
  if (headerActions) headerActions.style.display = mappings.length ? 'flex' : 'none';
  list.innerHTML = mappings.map(m => `
    <div class="sa-token-row">
      <div class="col-token-name">${m.name}</div>
      <div class="col-token-desc">${(m.externalId || '<Sub>').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      <div class="col-token-expiration">
        <img src="illustration/Okta.png" width="16" height="16" style="object-fit:contain;vertical-align:middle;margin-right:4px;" />${m.provider}
      </div>
      <div class="col-token-actions-spacer"></div>
    </div>`).join('');
}

function updateSaOauthMappingEmptyState() {
  const none = document.getElementById('sa-oauth-mapping-empty-none');
  const available = document.getElementById('sa-oauth-mapping-empty-available');
  if (!none || !available) return;
  const hasProviders = OAUTH_PROVIDERS.length > 0;
  const hasMappings = _activeServiceAccount && getSaOauthMappings(_activeServiceAccount).length > 0;
  none.style.display = hasProviders ? 'none' : '';
  available.style.display = (hasProviders && !hasMappings) ? '' : 'none';
  if (_activeServiceAccount) renderSaOauthMappings(_activeServiceAccount);
}

function submitAddOauthProvider() {
  const nameInput = document.getElementById('oauth-display-name');
  const name = nameInput?.value.trim() || `Okta-${13 + OAUTH_PROVIDERS.length}`;
  OAUTH_PROVIDERS.push({ name, status: 'enabled', serviceAccounts: 0, userAccounts: 0 });
  renderOAuthProviders();
  updateSaOauthMappingEmptyState();
  closeModal('modal-oauth');
  openModal('modal-oauth-success');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#oauth-provider-list .sso-more-wrap')) {
    document.querySelectorAll('#oauth-provider-list .sso-context-menu').forEach(m => m.style.display = 'none');
  }
});

// ── OAuth accounts view (accounts using a given provider) ────
const OAUTH_ACCOUNT_MAPPINGS = [
  { name: 'Name 11', externalId: '<Sub>', accountType: 'service', accountName: 'Service account 1' },
  { name: 'Name 12', externalId: '<Sub>', accountType: 'service', accountName: 'Service account 1' },
  { name: 'Name 13', externalId: '<Sub>', accountType: 'service', accountName: 'Service account 1' },
  { name: 'Name 1',  externalId: '<Sub>', accountType: 'service', accountName: 'Service account 2' },
  { name: 'Name 2',  externalId: '<Sub>', accountType: 'service', accountName: 'Service account 2' },
  { name: 'Name 3',  externalId: '<Sub>', accountType: 'service', accountName: 'Service account 2' },
  { name: 'Name 15', externalId: '<Sub>', accountType: 'user',    accountName: 'John Doe' },
  { name: 'Name 16', externalId: '<Sub>', accountType: 'user',    accountName: 'John Doe' },
];

let _oauthAccountsMode = 'provider';

function computeAiHubAccounts(kind) {
  const rows = [];
  SERVICE_ACCOUNTS.forEach(sa => {
    if (kind === 'oauth-app') {
      getSaOauthApps(sa).forEach(a => rows.push({
        name: a.name, externalId: '', accountType: 'service', accountName: sa.name,
      }));
    } else if (kind === 'issued-tokens') {
      getSaTokens(sa).forEach(t => rows.push({
        name: t.name, externalId: '', accountType: 'service', accountName: sa.name,
      }));
    }
  });
  if (kind === 'oauth-app') {
    MEMBERS.forEach(m => {
      getMemberOauthApps(m).forEach(a => rows.push({
        name: a.name, externalId: '', accountType: 'user', accountName: m.name,
      }));
    });
  }
  return rows;
}

function countAiHubAccounts(kind) {
  if (kind === 'oauth-app') {
    const saCount = SERVICE_ACCOUNTS.filter(sa => getSaOauthApps(sa).length > 0).length;
    const memberCount = MEMBERS.filter(m => getMemberOauthApps(m).length > 0).length;
    return saCount + memberCount;
  }
  return SERVICE_ACCOUNTS.filter(sa => getSaTokens(sa).length > 0).length;
}

function updateAiHubAccountLinks() {
  const oauthAppLink = document.getElementById('ai-hub-oauth-app-accounts-link');
  const issuedTokensLink = document.getElementById('ai-hub-issued-tokens-accounts-link');
  if (oauthAppLink) {
    const n = countAiHubAccounts('oauth-app');
    oauthAppLink.textContent = `View ${n} accounts`;
    oauthAppLink.classList.toggle('link-disabled', n === 0);
  }
  if (issuedTokensLink) {
    const n = countAiHubAccounts('issued-tokens');
    issuedTokensLink.textContent = `View ${n} accounts`;
    issuedTokensLink.classList.toggle('link-disabled', n === 0);
  }
}

function renderOauthAccounts() {
  const list = document.getElementById('oauth-accounts-list');
  const countEl = document.getElementById('oauth-accounts-count');
  if (!list) return;
  const q = (document.getElementById('oauth-accounts-search')?.value || '').trim().toLowerCase();
  const source = _oauthAccountsMode === 'provider' ? OAUTH_ACCOUNT_MAPPINGS : computeAiHubAccounts(_oauthAccountsMode);
  const filtered = source.filter(m =>
    !q || m.name.toLowerCase().includes(q) || m.accountName.toLowerCase().includes(q)
  );
  if (countEl) countEl.textContent = `${filtered.length} account${filtered.length === 1 ? '' : 's'}`;

  const showExternalId = _oauthAccountsMode === 'provider';
  const externalIdCol = document.getElementById('oauth-accounts-external-id-col');
  if (externalIdCol) externalIdCol.style.display = showExternalId ? '' : 'none';

  const mainCol = document.getElementById('oauth-accounts-main-col');
  if (mainCol) {
    const label = _oauthAccountsMode === 'provider' ? 'OAuth mapping' : 'AI Hub token name';
    mainCol.innerHTML = `${label} ${ibIcon('sort', { size: 14, color: '#9CA3AF' })}`;
  }

  list.innerHTML = filtered.map(m => `
    <div class="oauth-account-row">
      <div class="col-main">${m.name}</div>
      ${showExternalId ? `<div class="col-type" style="width:200px;">${m.externalId}</div>` : ''}
      <div class="col-oauth-mappings">
        <span class="avatar-sm">${ibIcon(m.accountType === 'service' ? 'instabase' : 'user', { size: 14, color: '#6B7280' })}</span>
        ${m.accountName}
      </div>
      <div class="col-type" style="width:160px;">${m.accountType === 'service' ? 'Service account' : 'User account'}</div>
      <div class="col-actions-spacer"></div>
    </div>`).join('');
}

function openOauthAccountsView(providerName) {
  document.querySelectorAll('#oauth-provider-list .sso-context-menu').forEach(m => m.style.display = 'none');
  _oauthAccountsMode = 'provider';
  const listView = document.getElementById('oauth-provider-list-view');
  const detailView = document.getElementById('oauth-accounts-view');
  const nameEl = document.getElementById('oauth-accounts-provider-name');
  if (!listView || !detailView) return;
  if (nameEl) nameEl.textContent = providerName;
  const search = document.getElementById('oauth-accounts-search');
  if (search) search.value = '';
  renderOauthAccounts();
  listView.style.display = 'none';
  detailView.style.display = 'block';
}

function openAiHubAccountsView(kind) {
  if (countAiHubAccounts(kind) === 0) return;
  _oauthAccountsMode = kind;
  const listView = document.getElementById('oauth-provider-list-view');
  const detailView = document.getElementById('oauth-accounts-view');
  const nameEl = document.getElementById('oauth-accounts-provider-name');
  if (!listView || !detailView) return;
  if (nameEl) nameEl.textContent = kind === 'oauth-app' ? 'AI-Hub OAuth app' : 'AI Hub-issued tokens';
  const search = document.getElementById('oauth-accounts-search');
  if (search) search.value = '';
  renderOauthAccounts();
  listView.style.display = 'none';
  detailView.style.display = 'block';
}

function closeOauthAccountsView() {
  const listView = document.getElementById('oauth-provider-list-view');
  const detailView = document.getElementById('oauth-accounts-view');
  if (!listView || !detailView) return;
  detailView.style.display = 'none';
  listView.style.display = 'block';
}

// ── Table sorting ───────────────────────────────────────────
const SORT_ICON_NAME = {
  none: 'sort',
  desc: 'arrow-down',
  asc: 'arrow-up',
};

const _tableSortState = {};

const TABLE_SORT_GETTERS = {
  members: {
    name: m => m.name,
    email: m => m.email,
    role: m => m.role,
    status: m => m.status,
  },
  'service-accounts': {
    name: sa => sa.name,
    role: sa => sa.role,
    status: () => 'ACTIVE',
  },
  groups: {
    name: g => g.name,
    members: g => g.members,
    managers: g => g.managers.join(', '),
    membershipSource: g => g.membershipSource,
  },
  'sa-tokens': {
    name: t => t.name,
    description: t => t.description,
    value: t => t.fullValue || '',
    expiration: t => parseTokenExpiration(t.expiration),
  },
};

function parseTokenExpiration(value) {
  if (!value || value === 'Never expires') return Number.MAX_SAFE_INTEGER;
  const [day, month, year] = value.split('/').map(Number);
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
}

function sortIconMarkup(state) {
  return `<span class="sort-icon sort-${state}" aria-hidden="true">${ibIcon(SORT_ICON_NAME[state], { size: 14, color: '#9CA3AF' })}</span>`;
}

function isFilterIcon(node) {
  const svg = node.matches?.('svg') ? node : node.querySelector?.('svg');
  if (!svg) return false;
  if (svg.classList.contains('filter-icon')) return true;
  return /M3 8h12/.test(svg.innerHTML);
}

function prepareSortableColumn(cell, tableId, key) {
  if (!cell || cell.dataset.sortReady) return;
  cell.dataset.sortReady = '1';
  cell.dataset.sortKey = key;
  cell.dataset.sortTable = tableId;

  const filterIcons = [...cell.querySelectorAll('svg')].filter(isFilterIcon);
  const filterMarkup = filterIcons.map(svg => {
    svg.classList.add('filter-icon');
    return svg.outerHTML;
  }).join('');
  filterIcons.forEach(svg => svg.remove());
  cell.querySelectorAll('svg').forEach(svg => svg.remove());

  const label = cell.textContent.trim();
  cell.classList.add('sortable-col');
  cell.setAttribute('role', 'button');
  cell.setAttribute('tabindex', '0');
  cell.innerHTML = `<span class="sortable-label">${label}</span>${sortIconMarkup('none')}${filterMarkup}`;
  cell.addEventListener('click', e => {
    if (e.target.closest('.filter-icon')) return;
    handleTableSort(tableId, key);
  });
  cell.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTableSort(tableId, key);
    }
  });
}

function updateTableSortUI(tableId) {
  const state = _tableSortState[tableId] || {};
  document.querySelectorAll(`[data-sort-table="${tableId}"] .sortable-col`).forEach(cell => {
    const iconState = state.column === cell.dataset.sortKey && state.dir ? state.dir : 'none';
    const icon = cell.querySelector('.sort-icon');
    if (!icon) return;
    icon.className = `sort-icon sort-${iconState}`;
    icon.innerHTML = ibIcon(SORT_ICON_NAME[iconState], { size: 14, color: '#9CA3AF' });
  });
}

function handleTableSort(tableId, column) {
  const state = _tableSortState[tableId] || { column: null, dir: null };
  if (state.column === column) {
    if (state.dir === 'desc') state.dir = 'asc';
    else if (state.dir === 'asc') {
      state.column = null;
      state.dir = null;
    } else {
      state.dir = 'desc';
    }
  } else {
    state.column = column;
    state.dir = 'desc';
  }
  _tableSortState[tableId] = state;
  updateTableSortUI(tableId);
  refreshSortedTable(tableId);
}

function compareSortValues(a, b) {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base', numeric: true });
}

function getSortedList(tableId, list) {
  const state = _tableSortState[tableId];
  const getters = TABLE_SORT_GETTERS[tableId];
  if (!state?.column || !state.dir || !getters?.[state.column]) return list;
  const getValue = getters[state.column];
  const mult = state.dir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => compareSortValues(getValue(a), getValue(b)) * mult);
}

function sortSsoRows() {
  const body = document.querySelector('#tab-sso .data-table-body');
  if (!body) return;
  const state = _tableSortState.sso;
  const rows = [...body.querySelectorAll('.sso-row')];
  if (!state?.column || !state.dir) return;

  const getValue = row => {
    if (state.column === 'provider') return row.querySelector('.col-main')?.textContent.trim() || '';
    if (state.column === 'status') return row.querySelector('.col-status')?.textContent.trim() || '';
    return '';
  };
  const mult = state.dir === 'asc' ? 1 : -1;
  rows.sort((a, b) => compareSortValues(getValue(a), getValue(b)) * mult);
  rows.forEach(row => body.appendChild(row));
}

function sortOAuthMappingRows() {
  const body = document.querySelector('#member-detail-view .oauth-mapping-header')?.closest('.data-table')?.querySelector('.data-table-body');
  if (!body) return;
  const rows = [...body.querySelectorAll('.oauth-mapping-row')];
  if (!rows.length) return;
  const state = _tableSortState['oauth-mapping'];
  if (!state?.column || !state.dir) return;

  const getValue = row => {
    if (state.column === 'mapping') return row.querySelector('.col-oauth-mapping')?.textContent.trim() || '';
    if (state.column === 'externalId') return row.querySelector('.col-external-id')?.textContent.trim() || '';
    return '';
  };
  const mult = state.dir === 'asc' ? 1 : -1;
  rows.sort((a, b) => compareSortValues(getValue(a), getValue(b)) * mult);
  rows.forEach(row => body.appendChild(row));
}

function refreshSortedTable(tableId) {
  switch (tableId) {
    case 'members':
      renderMembers(_currentMembersList);
      break;
    case 'service-accounts':
      renderServiceAccounts(_currentServiceAccountsList);
      break;
    case 'groups':
      renderGroups(_currentGroupsList);
      break;
    case 'sa-tokens':
      if (_activeServiceAccount) {
        const q = document.getElementById('sa-tokens-search')?.value || '';
        renderSaTokens(_activeServiceAccount, q);
      }
      break;
    case 'sso':
      sortSsoRows();
      break;
    case 'oauth-mapping':
      sortOAuthMappingRows();
      break;
    default:
      break;
  }
}

function initTableSorting() {
  const setups = [
    {
      tableId: 'members',
      header: '#members-list-view .members-header',
      columns: [
        { selector: '.col-name', key: 'name' },
        { selector: '.col-email', key: 'email' },
        { selector: '.col-role', key: 'role' },
        { selector: '.col-status', key: 'status' },
      ],
    },
    {
      tableId: 'service-accounts',
      header: '#sa-list-view .members-header',
      columns: [
        { selector: '.col-sa-name', key: 'name' },
        { selector: '.col-role', key: 'role' },
        { selector: '.col-status', key: 'status' },
      ],
    },
    {
      tableId: 'groups',
      header: '#groups-list-view .groups-header',
      columns: [
        { selector: '.col-group-name', key: 'name' },
        { selector: '.col-group-members', key: 'members' },
        { selector: '.col-group-managers', key: 'managers' },
        { selector: '.col-group-source', key: 'membershipSource' },
      ],
    },
    {
      tableId: 'oauth-mapping',
      header: '#member-detail-view .oauth-mapping-header',
      columns: [
        { selector: '.col-oauth-mapping', key: 'mapping' },
        { selector: '.col-external-id', key: 'externalId' },
      ],
    },
    {
      tableId: 'sa-tokens',
      header: '#sa-tokens-content .sa-tokens-header',
      columns: [
        { selector: '.col-token-name', key: 'name' },
        { selector: '.col-token-desc', key: 'description' },
        { selector: '.col-token-value', key: 'value' },
        { selector: '.col-token-expiration', key: 'expiration' },
      ],
    },
    {
      tableId: 'sso',
      header: '#tab-sso .data-table-header',
      columns: [
        { selector: '.col-main', key: 'provider' },
        { selector: '.col-status', key: 'status' },
      ],
    },
  ];

  setups.forEach(({ tableId, header, columns }) => {
    const headerEl = document.querySelector(header);
    if (!headerEl) return;
    headerEl.dataset.sortTable = tableId;
    columns.forEach(({ selector, key }) => {
      prepareSortableColumn(headerEl.querySelector(selector), tableId, key);
    });
  });
}

function renderMembers(list) {
  const container = document.getElementById('members-list');
  if (!container) return;
  const sorted = getSortedList('members', list);
  if (list === _currentMembersList) _currentMembersList = sorted;
  container.innerHTML = sorted.map((m, i) => `
    <div class="member-row member-row-clickable" data-member-index="${i}">
      <div class="col-check"><input type="checkbox" class="row-checkbox" /></div>
      <div class="member-name">${m.name}</div>
      <div class="member-email">${m.email}</div>
      <div class="member-role">${roleBadgeHtml(m.role)}</div>
      <div class="member-status">${m.status}</div>
      <div class="row-actions">
        <button class="row-action-btn" title="Edit">
          ${ibIcon('edit2', { size: 16 })}
        </button>
        <button class="row-action-btn" title="More">
          ${ibIcon('overflow2', { size: 16 })}
        </button>
      </div>
    </div>
  `).join('');
}

let _currentMembersList = MEMBERS;

let _activeMember = null;

function openMemberDetail(member) {
  const listView = document.getElementById('members-list-view');
  const detailView = document.getElementById('member-detail-view');
  if (!listView || !detailView) return;

  _activeMember = member;
  const userId = memberUserId(member.email);
  document.getElementById('member-detail-name').textContent = member.name;
  document.getElementById('member-detail-role').innerHTML = roleBadgeHtml(member.role);
  document.getElementById('member-detail-userid').textContent = userId;

  const copyBtn = document.getElementById('member-detail-copy');
  copyBtn.onclick = () => copyText(copyBtn, userId);

  renderMemberTokens(member);
  renderMemberOauthMappings(member);
  renderMemberOauthApps(member);

  listView.style.display = 'none';
  detailView.style.display = 'block';
}

function renderMemberTokens(member) {
  const list = document.getElementById('member-tokens-list');
  const empty = document.getElementById('member-tokens-empty');
  if (!list || !empty || !member) return;

  const q = (document.getElementById('member-tokens-search')?.value || '').trim().toLowerCase();
  const tokens = member.tokens || [];
  const filtered = tokens.filter(t => !q || t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));

  empty.style.display = filtered.length ? 'none' : '';
  list.innerHTML = filtered.map(t => `
    <div class="sa-token-row">
      <div class="col-token-name">${t.name}</div>
      <div class="col-token-desc">${t.description || ''}</div>
      <div class="col-token-value">${truncateTokenValue(t.fullValue)}</div>
      <div class="col-token-expiration">${t.expiration}</div>
      <div class="col-token-actions-spacer"></div>
    </div>`).join('');
}

function seedV0MemberTokens() {
  const seeds = {
    'A W': [{ name: 'personal-api', description: 'Personal API access', fullValue: generateTokenValue(), expiration: 'Never expires' }],
    'Aanchal Sharma': [{ name: 'dev-token', description: 'Local development', fullValue: generateTokenValue(), expiration: formatTokenExpiration('90 days') }],
    'Lokeshkumar V M': [{ name: 'design-prototype', description: 'AI Hub design prototype access', fullValue: generateTokenValue(), expiration: formatTokenExpiration('90 days') }],
  };
  MEMBERS.forEach(m => {
    if (seeds[m.name]) m.tokens = seeds[m.name];
  });
  renderMembers(_currentMembersList);
  renderApiTokens();
}

function seedV2MemberOnly() {
  MEMBERS.push({ name: 'Lokeshkumar V M', email: 'lokeshkumar.vm@instabase.com', role: 'Admin', status: 'Joined' });
  _currentMembersList = MEMBERS;
  renderMembers(MEMBERS);
}

function renderApiTokens() {
  const content = document.getElementById('api-tokens-content');
  const empty = document.getElementById('api-tokens-empty');
  const list = document.getElementById('api-tokens-list');
  const addBtn = document.getElementById('api-tokens-add-btn');
  if (!content || !empty || !list) return;

  const me = MEMBERS.find(m => m.name === 'Lokeshkumar V M');
  const tokens = (me && me.tokens) || [];

  content.style.display = tokens.length ? 'block' : 'none';
  empty.style.display = tokens.length ? 'none' : '';
  if (addBtn) addBtn.style.display = tokens.length ? '' : 'none';
  list.innerHTML = tokens.map(t => `
    <div class="sa-token-row">
      <div class="col-token-name">${t.name}</div>
      <div class="col-token-desc">${t.description || ''}</div>
      <div class="col-token-value">${truncateTokenValue(t.fullValue)}</div>
      <div class="col-token-expiration">${t.expiration}</div>
      <div class="col-token-actions-spacer"></div>
    </div>`).join('');

  if (me) {
    renderMemberOauthMappings(me);
    renderMemberOauthApps(me);
  }
}

// ── Update role modal (members + service accounts) ──────────
let _roleModalTarget = null; // { type: 'member' | 'sa', index }

function openRoleModalFor(type, index, name, role) {
  _roleModalTarget = { type, index };
  const titleEl = document.getElementById('update-member-role-title');
  if (titleEl) titleEl.textContent = `Update role for ${name}`;
  selectMemberRole(role, false);
  closeMemberRoleMenu();
  openModal('modal-update-member-role');
}

function openUpdateMemberRoleModal(member, index) {
  openRoleModalFor('member', index, member.name, member.role);
}

function openUpdateSaRoleModal(sa, index) {
  openRoleModalFor('sa', index, sa.name, sa.role);
}

let _memberRoleMenuHome = null;

function positionMemberRoleMenu() {
  const trigger = document.getElementById('member-role-trigger');
  const menu = document.getElementById('member-role-menu');
  const wrap = document.getElementById('member-role-select');
  if (!trigger || !menu || !wrap) return;

  if (!menu.classList.contains('is-portaled')) {
    _memberRoleMenuHome = wrap;
    document.body.appendChild(menu);
    menu.classList.add('is-portaled');
  }

  const rect = trigger.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
}

function toggleMemberRoleMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('member-role-menu');
  const trigger = document.getElementById('member-role-trigger');
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeMemberRoleMenu();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    positionMemberRoleMenu();
  }
}

function closeMemberRoleMenu() {
  const menu = document.getElementById('member-role-menu');
  const trigger = document.getElementById('member-role-trigger');
  if (menu) {
    menu.style.display = 'none';
    if (menu.classList.contains('is-portaled') && _memberRoleMenuHome) {
      _memberRoleMenuHome.appendChild(menu);
      menu.classList.remove('is-portaled');
      menu.style.top = '';
      menu.style.left = '';
      menu.style.width = '';
    }
  }
  if (trigger) trigger.classList.remove('open');
}

function selectMemberRole(role, closeMenu = true) {
  const valueEl = document.getElementById('member-role-value');
  if (valueEl) valueEl.textContent = role;
  document.querySelectorAll('#member-role-menu .custom-select-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.value === role);
  });
  if (closeMenu) closeMemberRoleMenu();
}

function saveMemberRole() {
  if (!_roleModalTarget) return;
  const role = document.getElementById('member-role-value')?.textContent.trim() || 'Member';
  const { type, index } = _roleModalTarget;
  if (type === 'member') {
    const member = _currentMembersList[index];
    if (member) {
      member.role = role;
      renderMembers(_currentMembersList);
    }
  } else if (type === 'sa') {
    const sa = _currentServiceAccountsList[index];
    if (sa) {
      sa.role = role;
      renderServiceAccounts(_currentServiceAccountsList);
    }
  }
  _roleModalTarget = null;
  closeModal('modal-update-member-role');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#member-role-select') && !e.target.closest('#member-role-menu')) closeMemberRoleMenu();
});

function closeMemberDetail() {
  const listView = document.getElementById('members-list-view');
  const detailView = document.getElementById('member-detail-view');
  if (!listView || !detailView) return;
  detailView.style.display = 'none';
  listView.style.display = 'block';
}

// Service accounts data
const SERVICE_ACCOUNTS = [
  { name: 'anz.poc',                      role: 'Member' },
  { name: 'automation_testing',           role: 'Member' },
  { name: 'Ben-test',                     role: 'Admin'  },
  { name: 'BG Service Account',           role: 'Member' },
  { name: 'CI/CD',                        role: 'Admin'  },
  { name: 'FM_Svc_Account',               role: 'Member', userId: 'sa5f2a1dcddecd490e8862cd275fd26e02' },
  { name: 'Hannah Test Service Account',  role: 'Member' },
  { name: 'Heymian Service Account',      role: 'Member' },
  { name: 'KDServiceAccount',             role: 'Member' },
  { name: 'ming_test_SA',                 role: 'Admin'  },
  { name: 'Norman Service Account',       role: 'Member' },
  { name: 'RSA Test Service Account',     role: 'Member' },
  { name: 'SamTestSvcAcct',              role: 'Member' },
  { name: 'service_account_test',        role: 'Member' },
  { name: 'test',                         role: 'Member' },
  { name: 'Test',                         role: 'Member' },
];

function serviceAccountUserId(sa) {
  if (sa.userId) return sa.userId;
  let hash = 0;
  for (let i = 0; i < sa.name.length; i++) {
    hash = ((hash << 5) - hash + sa.name.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return 'sa' + (hex + hex + hex + hex).slice(0, 32);
}

function renderServiceAccounts(list) {
  const container = document.getElementById('sa-list');
  if (!container) return;
  const sorted = getSortedList('service-accounts', list);
  if (list === _currentServiceAccountsList) _currentServiceAccountsList = sorted;
  container.innerHTML = sorted.map((sa, i) => `
    <div class="member-row member-row-clickable" data-sa-index="${i}">
      <div class="col-check"><input type="checkbox" class="row-checkbox" /></div>
      <div class="member-sa-name">${sa.name}</div>
      <div class="member-role">${roleBadgeHtml(sa.role)}</div>
      <div class="member-status">${statusPillHtml()}</div>
      <div class="row-actions">
        <button class="row-action-btn" title="Edit">
          ${ibIcon('edit2', { size: 16 })}
        </button>
        <div class="dropdown-wrap sa-row-more-wrap">
          <button class="row-action-btn" type="button" title="More" onclick="toggleDropdown('sa-row-more-${i}')">
            ${ibIcon('overflow2', { size: 16 })}
          </button>
          <div class="dropdown-menu" id="sa-row-more-${i}" style="display:none;">
            <button class="dropdown-item" type="button" onclick="closeDropdown('sa-row-more-${i}')">Rename service account</button>
            <button class="dropdown-item" type="button" onclick="closeDropdown('sa-row-more-${i}')">Update role</button>
            <button class="dropdown-item" type="button" onclick="closeDropdown('sa-row-more-${i}')">Disable</button>
            <button class="dropdown-item dropdown-item-destructive" type="button" onclick="closeDropdown('sa-row-more-${i}')">Delete service account</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

let _currentServiceAccountsList = SERVICE_ACCOUNTS;
let _activeServiceAccount = null;
let _saTokenModalMode = 'onboarding';

function openServiceAccountDetail(sa) {
  const listView = document.getElementById('sa-list-view');
  const detailView = document.getElementById('sa-detail-view');
  if (!listView || !detailView) return;

  _activeServiceAccount = sa;
  const userId = serviceAccountUserId(sa);
  document.getElementById('sa-detail-name').textContent = sa.name;
  document.getElementById('sa-detail-role').innerHTML = roleBadgeHtml(sa.role);
  document.getElementById('sa-detail-userid').textContent = userId;

  const userIdCopy = document.getElementById('sa-detail-userid-copy');
  userIdCopy.onclick = () => copyText(userIdCopy, userId);

  const orgIdCopy = document.getElementById('sa-detail-orgid-copy');
  orgIdCopy.onclick = () => copyText(orgIdCopy, 'ib-internal');

  const search = document.getElementById('sa-tokens-search');
  if (search) search.value = '';
  renderSaTokens(sa);
  updateSaOauthMappingEmptyState();
  renderSaOauthApps(sa);

  listView.style.display = 'none';
  detailView.style.display = 'block';
}

function closeServiceAccountDetail() {
  const listView = document.getElementById('sa-list-view');
  const detailView = document.getElementById('sa-detail-view');
  if (!listView || !detailView) return;
  _activeServiceAccount = null;
  detailView.style.display = 'none';
  listView.style.display = 'block';
}

let _pendingServiceAccount = null;
let _selectedSaRole = 'Member';
let _saRoleMenuHome = null;

function updateSaCount() {
  const el = document.getElementById('sa-count');
  if (el) el.textContent = `${SERVICE_ACCOUNTS.length} service account${SERVICE_ACCOUNTS.length === 1 ? '' : 's'}`;
}

let _selectedAddMembersRole = 'Member';
let _addMembersRoleMenuHome = null;

function openAddMembersModal() {
  _selectedAddMembersRole = 'Member';
  const emailsInput = document.getElementById('add-members-emails');
  if (emailsInput) emailsInput.value = '';
  selectAddMembersRole('Member', false);
  closeAddMembersRoleMenu();
  updateAddMembersButton();
  openModal('modal-add-members');
  setTimeout(() => emailsInput?.focus(), 0);
}

function updateAddMembersButton() {
  const btn = document.getElementById('add-members-submit-btn');
  const emailsInput = document.getElementById('add-members-emails');
  if (!btn || !emailsInput) return;
  btn.disabled = !emailsInput.value.trim();
}

function positionAddMembersRoleMenu() {
  const trigger = document.getElementById('add-members-role-trigger');
  const menu = document.getElementById('add-members-role-menu');
  const wrap = document.getElementById('add-members-role-select');
  if (!trigger || !menu || !wrap) return;

  if (!menu.classList.contains('is-portaled')) {
    _addMembersRoleMenuHome = wrap;
    document.body.appendChild(menu);
    menu.classList.add('is-portaled');
  }

  const rect = trigger.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
}

function toggleAddMembersRoleMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('add-members-role-menu');
  const trigger = document.getElementById('add-members-role-trigger');
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeAddMembersRoleMenu();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    positionAddMembersRoleMenu();
  }
}

function closeAddMembersRoleMenu() {
  const menu = document.getElementById('add-members-role-menu');
  const trigger = document.getElementById('add-members-role-trigger');
  if (menu) menu.style.display = 'none';
  if (trigger) trigger.classList.remove('open');
}

function selectAddMembersRole(role, closeMenu = true) {
  _selectedAddMembersRole = role;
  const valueEl = document.getElementById('add-members-role-value');
  if (valueEl) valueEl.textContent = role;
  document.querySelectorAll('#add-members-role-menu .custom-select-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.value === role);
  });
  if (closeMenu) closeAddMembersRoleMenu();
}

document.addEventListener('click', e => {
  if (!e.target.closest('#add-members-role-select') && !e.target.closest('#add-members-role-menu')) {
    closeAddMembersRoleMenu();
  }
});

function submitAddMembers() {
  const emailsInput = document.getElementById('add-members-emails');
  const raw = emailsInput?.value.trim();
  if (!raw) return;

  const emails = raw.split(',').map(e => e.trim()).filter(Boolean);
  emails.forEach(email => {
    const namePart = email.split('@')[0].replace(/[._]+/g, ' ').trim();
    const name = namePart.replace(/\b\w/g, c => c.toUpperCase()) || email;
    MEMBERS.unshift({ name, email, role: _selectedAddMembersRole, status: 'Invited' });
  });

  _currentMembersList = MEMBERS;
  renderMembers(_currentMembersList);
  closeModal('modal-add-members');
}

function openAddServiceAccountModal() {
  _pendingServiceAccount = null;
  _selectedSaRole = 'Member';
  const nameInput = document.getElementById('sa-name-input');
  if (nameInput) nameInput.value = '';
  selectSaRole('Member', false);
  closeSaRoleMenu();
  updateSaCreateButton();
  openModal('modal-add-sa');
  setTimeout(() => nameInput?.focus(), 0);
}

function updateSaCreateButton() {
  const btn = document.getElementById('sa-create-btn');
  const nameInput = document.getElementById('sa-name-input');
  if (!btn || !nameInput) return;
  btn.disabled = !nameInput.value.trim();
}

function positionSaRoleMenu() {
  const trigger = document.getElementById('sa-role-trigger');
  const menu = document.getElementById('sa-role-menu');
  const wrap = document.getElementById('sa-role-select');
  if (!trigger || !menu || !wrap) return;

  if (!menu.classList.contains('is-portaled')) {
    _saRoleMenuHome = wrap;
    document.body.appendChild(menu);
    menu.classList.add('is-portaled');
  }

  const rect = trigger.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
}

function toggleSaRoleMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('sa-role-menu');
  const trigger = document.getElementById('sa-role-trigger');
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeSaRoleMenu();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    positionSaRoleMenu();
  }
}

function closeSaRoleMenu() {
  const menu = document.getElementById('sa-role-menu');
  const trigger = document.getElementById('sa-role-trigger');
  if (menu) {
    menu.style.display = 'none';
    if (menu.classList.contains('is-portaled') && _saRoleMenuHome) {
      _saRoleMenuHome.appendChild(menu);
      menu.classList.remove('is-portaled');
      menu.style.top = '';
      menu.style.left = '';
      menu.style.width = '';
    }
  }
  if (trigger) trigger.classList.remove('open');
}

function selectSaRole(role, closeMenu = true) {
  _selectedSaRole = role;
  const valueEl = document.getElementById('sa-role-value');
  if (valueEl) valueEl.textContent = role;
  document.querySelectorAll('#sa-role-menu .custom-select-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.value === role);
  });
  if (closeMenu) closeSaRoleMenu();
}

function submitAddServiceAccount() {
  const name = document.getElementById('sa-name-input')?.value.trim();
  if (!name) return;
  _pendingServiceAccount = { name, role: _selectedSaRole };
  closeModal('modal-add-sa', true);
  finalizeServiceAccount();
}

function resetAddSaTokenModal() {
  const name = document.getElementById('sa-token-name');
  const desc = document.getElementById('sa-token-description');
  const exp = document.getElementById('sa-token-expiration');
  if (name) name.value = '';
  if (desc) desc.value = '';
  if (exp) exp.selectedIndex = 0;
  updateSaTokenAddButton();
}

function openAddSaTokenModal() {
  setSaTokenModalMode('onboarding');
  resetAddSaTokenModal();
  openModal('modal-add-sa-token');
}

function openCreateHubTokenModal() {
  if (!_activeServiceAccount) return;
  setSaTokenModalMode('detail');
  resetAddSaTokenModal();
  openModal('modal-add-sa-token');
}

function setSaTokenModalMode(mode) {
  _saTokenModalMode = mode;
  const skipBtn = document.getElementById('sa-token-skip-btn');
  const cancelBtn = document.getElementById('sa-token-cancel-btn');
  if (skipBtn) skipBtn.style.display = mode === 'onboarding' ? '' : 'none';
  if (cancelBtn) cancelBtn.style.display = mode === 'detail' ? '' : 'none';
}

function dismissSaTokenModal() {
  if (_saTokenModalMode === 'onboarding') skipSaToken();
  else closeModal('modal-add-sa-token');
}

function updateSaTokenAddButton() {
  const btn = document.getElementById('sa-token-add-btn');
  const name = document.getElementById('sa-token-name')?.value.trim();
  const desc = document.getElementById('sa-token-description')?.value.trim();
  if (!btn) return;
  btn.disabled = !(name && desc);
}

function finalizeServiceAccount() {
  if (!_pendingServiceAccount) return;
  SERVICE_ACCOUNTS.unshift(_pendingServiceAccount);
  _currentServiceAccountsList = SERVICE_ACCOUNTS;
  const saSearch = document.getElementById('sa-search');
  if (saSearch) saSearch.value = '';
  renderServiceAccounts(_currentServiceAccountsList);
  updateSaCount();
  const created = _pendingServiceAccount;
  _pendingServiceAccount = null;
  closeModal('modal-add-sa-token', false);
  openServiceAccountDetail(created);
}

function skipSaToken() {
  if (_pendingServiceAccount) finalizeServiceAccount();
  else closeModal('modal-add-sa-token');
}

function addSaToken() {
  if (_saTokenModalMode === 'onboarding') {
    finalizeServiceAccount();
    return;
  }
  submitHubToken();
}

function generateTokenValue() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let value = '';
  for (let i = 0; i < 30; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
}

function formatTokenExpiration(option) {
  if (option === 'Never expires') return 'Never expires';
  const dayMap = { '7 days': 7, '30 days': 30, '60 days': 60, '90 days': 90 };
  if (dayMap[option]) {
    const date = new Date();
    date.setDate(date.getDate() + dayMap[option]);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
  return option;
}

function truncateTokenValue(value) {
  if (!value || value.length <= 8) return value || '';
  return value.slice(0, 4) + '...';
}

function getSaTokens(sa) {
  if (!sa.tokens) sa.tokens = [];
  return sa.tokens;
}

function submitHubToken() {
  if (!_activeServiceAccount) return;
  const name = document.getElementById('sa-token-name')?.value.trim();
  const description = document.getElementById('sa-token-description')?.value.trim();
  const expirationOption = document.getElementById('sa-token-expiration')?.value || 'Never expires';
  if (!name || !description) return;

  const fullValue = generateTokenValue();
  const token = {
    name,
    description,
    fullValue,
    expiration: formatTokenExpiration(expirationOption),
  };
  getSaTokens(_activeServiceAccount).unshift(token);
  closeModal('modal-add-sa-token');
  showTokenSuccessModal(name, fullValue);
  updateAiHubAccountLinks();
}

function showTokenSuccessModal(name, value) {
  const title = document.getElementById('token-success-title');
  const valueEl = document.getElementById('token-success-value');
  const copyBtn = document.getElementById('token-success-copy');
  if (title) title.textContent = `Token ${name} added successfully`;
  if (valueEl) valueEl.textContent = value;
  if (copyBtn) copyBtn.onclick = () => copyText(copyBtn, value);
  openModal('modal-token-success');
}

function closeTokenSuccessModal() {
  closeModal('modal-token-success');
  if (_activeServiceAccount) renderSaTokens(_activeServiceAccount);
}

function renderSaTokens(sa, filterQuery = '') {
  const empty = document.getElementById('sa-tokens-empty');
  const content = document.getElementById('sa-tokens-content');
  const list = document.getElementById('sa-tokens-list');
  if (!empty || !content || !list) return;

  const q = (filterQuery || '').trim().toLowerCase();
  const allTokens = getSaTokens(sa);
  let tokens = allTokens.filter(t =>
    !q ||
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    (t.fullValue || '').toLowerCase().includes(q) ||
    t.expiration.toLowerCase().includes(q)
  );
  tokens = getSortedList('sa-tokens', tokens);

  if (allTokens.length === 0) {
    empty.style.display = 'flex';
    content.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  content.style.display = 'block';
  list.innerHTML = tokens.map(token => {
    const realIndex = allTokens.indexOf(token);
    return `
    <div class="sa-token-row">
      <div class="col-token-name">${token.name}</div>
      <div class="col-token-desc">${token.description}</div>
      <div class="col-token-value">${truncateTokenValue(token.fullValue)}</div>
      <div class="col-token-expiration">${token.expiration}</div>
      <div class="col-token-actions">
        <button class="row-action-btn sa-token-regenerate" type="button" title="Regenerate" data-token-index="${realIndex}" style="opacity:1;">
          ${ibIcon('refresh', { size: 16 })}
        </button>
        <button class="row-action-btn sa-token-delete" type="button" title="Delete" data-token-index="${realIndex}" style="opacity:1;">
          ${ibIcon('delete', { size: 16 })}
        </button>
      </div>
    </div>
  `;
  }).join('');

  list.querySelectorAll('.sa-token-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteSaToken(Number(btn.dataset.tokenIndex)));
  });
  list.querySelectorAll('.sa-token-regenerate').forEach(btn => {
    btn.addEventListener('click', () => regenerateSaToken(Number(btn.dataset.tokenIndex)));
  });
}

function filterSaTokens() {
  if (!_activeServiceAccount) return;
  const q = document.getElementById('sa-tokens-search')?.value || '';
  renderSaTokens(_activeServiceAccount, q);
}

function deleteSaToken(index) {
  if (!_activeServiceAccount) return;
  const tokens = getSaTokens(_activeServiceAccount);
  if (index < 0 || index >= tokens.length) return;
  tokens.splice(index, 1);
  const filtered = document.getElementById('sa-tokens-search')?.value || '';
  renderSaTokens(_activeServiceAccount, filtered);
}

function regenerateSaToken(index) {
  if (!_activeServiceAccount) return;
  const tokens = getSaTokens(_activeServiceAccount);
  const token = tokens[index];
  if (!token) return;
  const fullValue = generateTokenValue();
  token.fullValue = fullValue;
  showTokenSuccessModal(token.name, fullValue);
}

function resetAddServiceAccountForm() {
  _selectedSaRole = 'Member';
  const nameInput = document.getElementById('sa-name-input');
  if (nameInput) nameInput.value = '';
  selectSaRole('Member', false);
  closeSaRoleMenu();
  updateSaCreateButton();
}

function resetAddServiceAccountModal() {
  resetAddServiceAccountForm();
  _pendingServiceAccount = null;
}

// Groups data
// ── Audit logs (dummy data) ──────────────────────────────────
const AUDIT_LOGS = [
  { ts: 'Aug 19, 2026 12:27 PM', email: '', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.44.**.**', username: 'j***.doe_instaba...', status: '{"success": true}', org: '', uuid: 'a1b2c3d4-****-****-9...' },
  { ts: 'Aug 19, 2026 11:54 AM', email: '', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.20.**.**', username: 'a***.k***_gmail...', status: '{"success": true}', org: '', uuid: 'b2c3d4e5-****-****-b...' },
  { ts: 'Aug 19, 2026 11:42 AM', email: 'r***.s***+review...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.31.**.**', username: '', status: '{"success": true}', org: '', uuid: 'c3d4e5f6-****-****-8...' },
  { ts: 'Aug 19, 2026 11:17 AM', email: '', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.31.**.**', username: 'r***.s***_instaba...', status: '{"success": true}', org: '', uuid: 'd4e5f6a7-****-****-8...' },
  { ts: 'Aug 19, 2026 11:16 AM', email: 'r***.s***+review...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.31.**.**', username: '', status: '{"success": true}', org: '', uuid: 'e5f6a7b8-****-****-a...' },
  { ts: 'Aug 19, 2026 11:16 AM', email: 'r***.s***+memb...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.31.**.**', username: '', status: '{"errorMessage": ...', org: '', uuid: 'f6a7b8c9-****-****-b...' },
  { ts: 'Aug 19, 2026 10:52 AM', email: 'p***.m***@example...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.55.**.**', username: '', status: '{"success": true}', org: '', uuid: 'a7b8c9d0-****-****-a...' },
  { ts: 'Aug 19, 2026 10:51 AM', email: 'p***.m***@example...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.44.**.**', username: '', status: '{"success": true}', org: '', uuid: 'b8c9d0e1-****-****-b...' },
  { ts: 'Aug 19, 2026 10:51 AM', email: 'p***.m***@example...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.44.**.**', username: '', status: '{"success": true}', org: '', uuid: 'c9d0e1f2-****-****-...' },
  { ts: 'Aug 19, 2026 10:48 AM', email: '', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.44.**.**', username: 'p***.m***_instaba...', status: '{"success": true}', org: '', uuid: 'd0e1f2a3-****-****-...' },
  { ts: 'Aug 19, 2026 10:47 AM', email: 'p***.m***@instaba...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.44.**.**', username: '', status: '{"errorMessage": ...', org: '', uuid: 'e1f2a3b4-****-****-8...' },
  { ts: 'Aug 19, 2026 10:47 AM', email: 'p***.m***@instaba...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.55.**.**', username: '', status: '{"errorMessage": ...', org: '', uuid: 'f2a3b4c5-****-****-8...' },
  { ts: 'Aug 19, 2026 10:47 AM', email: 'p***.m***@instaba...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.55.**.**', username: '', status: '{"errorMessage": ...', org: '', uuid: 'a3b4c5d6-****-****-...' },
  { ts: 'Aug 19, 2026 2:34 AM', email: 'd***@acmecorp...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.12.**.**', username: '', status: '{"success": true}', org: '', uuid: 'b4c5d6e7-****-****-a...' },
  { ts: 'Aug 19, 2026 1:10 AM', email: 'h***.w***@example.com', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.66.**.**', username: '', status: '{"success": true}', org: '', uuid: 'c5d6e7f8-****-****-b...' },
  { ts: 'Aug 19, 2026 12:47 AM', email: '', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.77.**.**', username: 't***.u***_gmail...', status: '{"success": true}', org: '', uuid: 'd6e7f8a9-****-****-9...' },
  { ts: 'Aug 18, 2026 11:24 PM', email: 'k***@acmecorp...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.12.**.**', username: '', status: '{"success": true}', org: '', uuid: 'e7f8a9b0-****-****-a...' },
  { ts: 'Aug 18, 2026 10:18 PM', email: '', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.88.**.**', username: 'v***.d***_ai...', status: '{"success": true}', org: '', uuid: 'f8a9b0c1-****-****-9...' },
  { ts: 'Aug 18, 2026 9:45 PM', email: 'd***@acmecorp...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.12.**.**', username: '', status: '{"errorMessage": ...', org: '', uuid: 'a9b0c1d2-****-****-a...' },
  { ts: 'Aug 18, 2026 9:35 PM', email: 'd***@acmecorp...', message: '{"loginOpLog": {"...', type: 'LOGIN_OPERATION_V2', ip: '10.12.**.**', username: '', status: '{"errorMessage": ...', org: '', uuid: 'b0c1d2e3-****-****-9...' },
];

function showAuditLogsPage() {
  const page = document.getElementById('page-audit-logs');
  if (!page) return;
  page.style.display = 'block';
  document.body.style.overflow = 'hidden';
  renderAuditLogs();
}

function closeAuditLogsPage() {
  const page = document.getElementById('page-audit-logs');
  if (!page) return;
  page.style.display = 'none';
  document.body.style.overflow = '';
}

function renderAuditLogs() {
  const body = document.getElementById('audit-log-body');
  if (!body) return;
  const q = (document.getElementById('audit-log-search')?.value || '').trim().toLowerCase();
  const limit = Number(document.getElementById('audit-log-limit')?.value || 20);
  const filtered = AUDIT_LOGS.filter(l =>
    !q || l.email.toLowerCase().includes(q) || l.username.toLowerCase().includes(q) || l.ip.includes(q)
  ).slice(0, limit);

  body.innerHTML = filtered.map((l, i) => `
    <tr>
      <td class="audit-log-row-num">${i + 1}</td>
      <td>${l.ts}</td>
      <td>${l.email}</td>
      <td>${l.message}</td>
      <td>${l.type}</td>
      <td>${l.ip}</td>
      <td>${l.username}</td>
      <td>${l.status}</td>
      <td>${l.org}</td>
      <td>${l.uuid}</td>
    </tr>`).join('');
}

const GROUPS = [
  { name: 'CE-test',                  members: 2,  managers: ['JC'], membershipSource: 'AI hub, OKTA 12' },
  { name: 'CEM',                      members: 18, managers: ['AS','AM','PG','JK','LT','MH'], membershipSource: 'OKTA 13, OKTA 12' },
  { name: 'CSM',                      members: 11, managers: ['JK','LT','OW'], membershipSource: 'OKTA 12' },
  { name: 'Data-Ops',                 members: 8,  managers: ['MK','RS','SP','SK','SG'], membershipSource: 'OKTA 13' },
  { name: 'DEM',                      members: 6,  managers: ['AS','AM','BF','PG','LH','MH'], membershipSource: 'OKTA 12' },
  { name: 'Demo-group',               members: 1,  managers: ['KP'], membershipSource: 'AI hub' },
  { name: 'deploy_review_manager',    members: 1,  managers: ['RM'], membershipSource: 'AI hub' },
  { name: 'deploy_tester',            members: 1,  managers: [], membershipSource: 'AI hub' },
  { name: 'Design Team',              members: 0,  managers: [], membershipSource: 'AI hub' },
  { name: 'Entain-Review-Team',       members: 3,  managers: [], membershipSource: 'OKTA 13' },
  { name: 'Entain-Reviewer-Test',     members: 3,  managers: [], membershipSource: 'OKTA 12' },
  { name: 'FM_Reviewer_Group',        members: 3,  managers: ['SM'], membershipSource: 'OKTA 13, OKTA 12' },
  { name: 'FM_Reviewers',             members: 1,  managers: ['MV'], membershipSource: 'OKTA 12' },
  { name: 'group0',                   members: 2,  managers: [], membershipSource: 'AI hub' },
  { name: 'jpmc-reviewers',           members: 2,  managers: ['SV'], membershipSource: 'OKTA 13' },
  { name: 'Kering-Prep-Human-Review', members: 3,  managers: ['RM','SM'], membershipSource: 'OKTA 12' },
];

const GROUP_MEMBERS = {
  'Data-Ops': [
    { name: 'Ananya Acharya',              email: 'ananya.acharya@instabase.com',   role: 'Member' },
    { name: 'Mohima Khatoon',              email: 'mohima.khatoon@instabase.com',   role: 'Admin'  },
    { name: 'Namrata Mali',                email: 'namrata.mali@instabase.com',     role: 'Member' },
    { name: 'rakshit.basotra@instabase.com', email: 'rakshit.basotra@instabase.com', role: 'Member' },
    { name: 'Rani Shah',                   email: 'rani.shah@instabase.com',        role: 'Admin'  },
    { name: 'Sharad Pillai',               email: 'sharad.pillai@instabase.com',    role: 'Admin'  },
    { name: 'SHIVAM KUMAR',                email: 'shivam.kumar@instabase.com',     role: 'Admin'  },
    { name: 'Simran Gupta',                email: 'simran.gupta@instabase.com',     role: 'Admin'  },
  ],
  'Entain-Review-Team': [
    { name: 'raul.maechler+1@instabase.com',  email: 'raul.maechler+1@instabase.com',  role: 'Member' },
    { name: 'raul.maechler+10@instabase.com', email: 'raul.maechler+10@instabase.com', role: 'Member' },
    { name: 'raul.maechler+2@instabase.com',  email: 'raul.maechler+2@instabase.com',  role: 'Member' },
  ],
  'Entain-Reviewer-Test': [
    { name: 'raul.maechler+3@instabase.com',  email: 'raul.maechler+3@instabase.com',  role: 'Member' },
    { name: 'raul.maechler+4@instabase.com',  email: 'raul.maechler+4@instabase.com',  role: 'Member' },
    { name: 'raul.maechler+5@instabase.com',  email: 'raul.maechler+5@instabase.com',  role: 'Member' },
  ],
};

function getGroupMembers(group) {
  if (GROUP_MEMBERS[group.name]) return GROUP_MEMBERS[group.name];
  if (!group.members) return [];

  let hash = 0;
  for (let i = 0; i < group.name.length; i++) {
    hash = ((hash << 5) - hash + group.name.charCodeAt(i)) | 0;
  }

  const indices = MEMBERS.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, group.members).map(i => ({
    name: MEMBERS[i].name,
    email: MEMBERS[i].email,
    role: MEMBERS[i].role,
  }));
}

function memberInitials(name) {
  if (name.includes('@')) {
    return name[0].toUpperCase();
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function renderGroups(list) {
  const container = document.getElementById('groups-list');
  if (!container) return;
  const sorted = getSortedList('groups', list);
  if (list === _currentGroupsList) _currentGroupsList = sorted;
  container.innerHTML = sorted.map((g, i) => `
    <div class="group-row group-row-clickable" data-group-index="${i}">
      <div class="group-name">${g.name}</div>
      <div class="group-members">${g.members + (g._aiHubExtraMembers?.length || 0)}</div>
      <div class="group-managers">
        ${g.managers.map(m => `<div class="avatar-chip">${m}</div>`).join('')}
      </div>
      <div class="group-source">${g.membershipSource}</div>
    </div>
  `).join('');
}

let _currentGroupsList = GROUPS;
let _activeGroup = null;
let _groupSourceSearches = {};
const _collapsedGroupSources = new Set();

function parseMembershipSources(membershipSource) {
  if (!membershipSource) return [];
  const parts = membershipSource.split(',').map(s => s.trim()).filter(Boolean);
  const internal = parts.filter(s => s.toLowerCase() === 'ai hub');
  const external = parts.filter(s => s.toLowerCase() !== 'ai hub');
  return [...internal, ...external];
}

function getSourceMeta(source) {
  if (source.toLowerCase() === 'ai hub') {
    return { id: 'ai-hub', label: 'AI Hub', type: 'internal', iconType: 'instabase' };
  }
  const alreadyTagged = /\((saml|oidc)\)\s*$/i.test(source);
  const match = source.match(/okta[\s-]*(\d+)/i);
  const num = match ? match[1] : null;
  const id = num ? `okta-${num}` : source.toLowerCase().replace(/\s+/g, '-');
  const label = alreadyTagged
    ? source
    : (num ? `OKTA ${num} (OIDC)` : `${source} (OIDC)`);
  return {
    id,
    label,
    type: 'external',
    iconType: 'okta',
  };
}

function membershipSourceChipHtml(meta) {
  const icon = meta.iconType === 'instabase'
    ? ibIcon('instabase', { size: 12, color: PILL_ICON_COLORS.counter })
    : `<img src="illustration/Okta.png" width="12" height="12" alt="" />`;
  return pillHtml({ intent: 'counter', label: meta.label, normalCase: true, customIcon: icon });
}

function getGroupMembersBySource(group) {
  const sources = parseMembershipSources(group.membershipSource);
  const justAdded = group._justAddedSources || new Set();
  const sourceMetas = sources.map(s => {
    const meta = getSourceMeta(s);
    meta.justAdded = justAdded.has(meta.id);
    return meta;
  });
  if (!sourceMetas.length) return [];

  const buckets = sourceMetas.map(meta => ({ meta, members: [] }));
  const assignableBuckets = buckets.filter(b => !b.meta.justAdded);
  const allMembers = getGroupMembers(group);

  allMembers.forEach((member, index) => {
    if (!assignableBuckets.length) return;
    const bucket = assignableBuckets[index % assignableBuckets.length];
    const enriched = { ...member };
    if (bucket.meta.type === 'external') {
      enriched.sourceGroupId = `<group id ${bucket.members.length + 1}>`;
    }
    bucket.members.push(enriched);
  });

  (group._aiHubExtraMembers || []).forEach(member => {
    let aiHubBucket = buckets.find(b => b.meta.id === 'ai-hub');
    if (!aiHubBucket) {
      aiHubBucket = { meta: { id: 'ai-hub', label: 'AI Hub', type: 'internal', iconType: 'instabase' }, members: [] };
      buckets.unshift(aiHubBucket);
    }
    aiHubBucket.members.push({ ...member });
  });

  return buckets;
}

function filterSourceMembers(members, query) {
  const q = query.trim().toLowerCase();
  if (!q) return members;
  return members.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q) ||
    m.role.toLowerCase().includes(q) ||
    (m.sourceGroupId && m.sourceGroupId.toLowerCase().includes(q))
  );
}

function renderGroupMemberRow(member, meta) {
  const actions = meta.type === 'internal'
    ? `<div class="col-gm-actions">
        <button class="row-action-btn" type="button" title="Edit" style="opacity:1;">${ibIcon('edit2', { size: 16 })}</button>
        <button class="row-action-btn" type="button" title="Delete" style="opacity:1;">${ibIcon('delete', { size: 16 })}</button>
      </div>`
    : `<div class="col-gm-actions"></div>`;

  const sourceGroupIdCell = meta.type === 'external'
    ? `<div class="col-gm-source-id">${member.sourceGroupId || ''}</div>`
    : '';

  const checkCell = meta.type === 'internal'
    ? `<div class="col-check"><input type="checkbox" class="row-checkbox" /></div>`
    : '';

  return `
    <div class="member-row">
      ${checkCell}
      <div class="group-member-name-cell">
        <div class="member-avatar">${memberInitials(member.name)}</div>
        <span class="group-member-name">${member.name}</span>
      </div>
      <div class="member-email">${member.email}</div>
      <div class="member-role col-gm-role-cell">${roleBadgeHtml(member.role)}</div>
      ${sourceGroupIdCell}
      ${actions}
    </div>`;
}

function renderGroupSourceSection(bucket, searchQuery = '') {
  const { meta, members } = bucket;
  const filtered = filterSourceMembers(members, searchQuery);
  const isCollapsed = _collapsedGroupSources.has(meta.id);

  const headerCols = meta.type === 'external'
    ? `<div class="col-gm-name">Name <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span><span data-icon="filter" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-email">Email <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-role">Group Role <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span><span data-icon="filter" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-source-id">Source group ID <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span><span data-icon="filter" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-actions"></div>`
    : `<div class="col-gm-name">Name <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span><span data-icon="filter" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-email">Email <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-role">Group Role <span data-icon="sort" data-size="14" data-color="#9CA3AF"></span><span data-icon="filter" data-size="14" data-color="#9CA3AF"></span></div>
       <div class="col-gm-actions"></div>`;

  const addMemberBtn = meta.type === 'internal'
    ? `<button class="btn-primary btn-sm" type="button" onclick="openAddGroupMemberModal()">Add member</button>`
    : '';

  const rowsHtml = filtered.length
    ? filtered.map(m => renderGroupMemberRow(m, meta)).join('')
    : meta.type === 'internal'
      ? `<div class="table-empty-state">
          ${ibIcon('user', { size: 40, color: '#D1D5DB' })}
          <p class="table-empty-title">No members</p>
        </div>`
      : `<div class="table-empty-state">
          ${ibIcon('search', { size: 40, color: '#D1D5DB' })}
          <p class="table-empty-title">No members</p>
          <p class="table-empty-desc">Members will be populated in this group upon their login.</p>
        </div>`;

  const isV0SimpleAiHub = _currentAppVersion === 'v0' && meta.id === 'ai-hub';

  const headerHtml = isV0SimpleAiHub
    ? `<h3 class="subsection-title" style="margin-bottom:0;">Group mapping</h3>`
    : `<button type="button" class="group-source-section-header" onclick="toggleGroupSourceSection('${meta.id}')">
        <span data-icon="chevron-down" data-size="16" data-color="#374151" data-icon-class="group-source-chevron"></span>
        <span class="group-source-label">Source:</span>
        ${membershipSourceChipHtml(meta)}
        <span class="pill pill--counter pill--normal-case"><span class="pill__icon">${ibIcon('user', { size: 12 })}</span><span class="pill__text">${members.length}</span></span>
      </button>`;

  const descHtml = isV0SimpleAiHub ? '' : `<p class="group-source-desc">${meta.type === 'internal'
          ? 'This list is managed by AI Hub. <a href="#" class="link-blue">Learn more.</a>'
          : 'This list is populated by an external identity provider (IdP). To edit membership, manage the members list in your IdP. <a href="#" class="link-blue">Learn more.</a>'
        }</p>`;

  return `
    <section class="group-source-section${isCollapsed ? ' is-collapsed' : ''}" data-source-id="${meta.id}">
      ${headerHtml}
      <div class="group-source-section-body">
        ${descHtml}
        <div class="table-toolbar table-toolbar--sm table-toolbar--flush">
          <div class="search-wrap search-wrap--sm">
            <span data-icon="search" data-size="14" data-color="#9CA3AF"></span>
            <input type="text" class="search-input group-source-search" data-source-id="${meta.id}" placeholder="Search" value="${searchQuery.replace(/"/g, '&quot;')}" />
          </div>
          <span class="member-count">${members.length} member${members.length === 1 ? '' : 's'}</span>
          ${addMemberBtn ? `<div style="margin-left:auto;">${addMemberBtn}</div>` : ''}
        </div>
        <div class="data-table group-source-table${meta.type === 'external' ? ' group-source-table--external' : ''}">
          <div class="group-members-header">
            ${meta.type === 'internal' ? '<div class="col-check"><input type="checkbox" class="row-checkbox" /></div>' : ''}
            ${headerCols}
          </div>
          <div class="data-table-body">${rowsHtml}</div>
        </div>
      </div>
    </section>`;
}

function renderGroupDetailView(group) {
  const sourcesEl = document.getElementById('group-membership-sources');
  const sectionsEl = document.getElementById('group-source-sections');
  if (!sourcesEl || !sectionsEl) return;

  let buckets = getGroupMembersBySource(group);
  if (_currentAppVersion === 'v0' && !buckets.some(b => b.meta.id === 'ai-hub')) {
    buckets = [{ meta: { id: 'ai-hub', label: 'AI Hub', type: 'internal', iconType: 'instabase' }, members: [] }, ...buckets];
  }
  const metas = buckets.map(b => b.meta);

  sourcesEl.innerHTML = metas.length
    ? `<span class="group-membership-sources-label">Membership sources:</span>
       <div class="group-membership-sources-chips">
         ${metas.map(membershipSourceChipHtml).join('')}
       </div>`
    : '';

  sectionsEl.innerHTML = buckets.map(b =>
    renderGroupSourceSection(b, _groupSourceSearches[b.meta.id] || '')
  ).join('');

  initIcons();
}

let _groupMemberOptionPool = [];
let _selectedGroupMembersForAdd = [];

let _selectedGroupMemberRole = 'Member';
let _groupMemberRoleMenuHome = null;

function openAddGroupMemberModal() {
  if (!_activeGroup) return;
  const input = document.getElementById('add-group-member-input');
  if (!input) return;

  const existingNames = new Set(getGroupMembersBySource(_activeGroup).flatMap(b => b.members.map(m => m.name)));
  _groupMemberOptionPool = MEMBERS.filter(m => !existingNames.has(m.name));
  _selectedGroupMembersForAdd = [];

  input.value = '';
  selectGroupMemberRole('Member', false);
  closeGroupMemberRoleMenu();
  renderGroupMemberChips();
  hideGroupMemberOptions();
  updateAddGroupMemberButton();
  openModal('modal-add-group-member');
  setTimeout(() => input.focus(), 0);
}

function positionGroupMemberRoleMenu() {
  const trigger = document.getElementById('add-group-member-role-trigger');
  const menu = document.getElementById('add-group-member-role-menu');
  const wrap = document.getElementById('add-group-member-role-select');
  if (!trigger || !menu || !wrap) return;

  if (!menu.classList.contains('is-portaled')) {
    _groupMemberRoleMenuHome = wrap;
    document.body.appendChild(menu);
    menu.classList.add('is-portaled');
  }

  const rect = trigger.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
}

function toggleGroupMemberRoleMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('add-group-member-role-menu');
  const trigger = document.getElementById('add-group-member-role-trigger');
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeGroupMemberRoleMenu();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    positionGroupMemberRoleMenu();
  }
}

function closeGroupMemberRoleMenu() {
  const menu = document.getElementById('add-group-member-role-menu');
  const trigger = document.getElementById('add-group-member-role-trigger');
  if (menu) menu.style.display = 'none';
  if (trigger) trigger.classList.remove('open');
}

function selectGroupMemberRole(role, closeMenu = true) {
  _selectedGroupMemberRole = role;
  const valueEl = document.getElementById('add-group-member-role-value');
  if (valueEl) valueEl.textContent = role;
  document.querySelectorAll('#add-group-member-role-menu .custom-select-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.value === role);
  });
  if (closeMenu) closeGroupMemberRoleMenu();
}

document.addEventListener('click', e => {
  if (!e.target.closest('#add-group-member-role-select') && !e.target.closest('#add-group-member-role-menu')) {
    closeGroupMemberRoleMenu();
  }
});

function focusGroupMemberInput() {
  document.getElementById('add-group-member-input')?.focus();
}

function renderGroupMemberChips() {
  const chips = document.getElementById('add-group-member-chips');
  if (!chips) return;
  chips.innerHTML = _selectedGroupMembersForAdd.map(m => `
    <span class="chip-multiselect-chip">
      ${m.name}
      <button type="button" class="chip-multiselect-chip-remove" onclick="event.stopPropagation(); removeGroupMemberChip('${m.name.replace(/'/g, "\\'")}')">
        ${ibIcon('x', { size: 12 })}
      </button>
    </span>`).join('');
}

function positionGroupMemberDropdown() {
  const wrap = document.getElementById('add-group-member-multiselect');
  const dropdown = document.getElementById('add-group-member-dropdown');
  if (!wrap || !dropdown) return;

  if (!dropdown.classList.contains('is-portaled')) {
    document.body.appendChild(dropdown);
    dropdown.classList.add('is-portaled');
    dropdown.style.position = 'fixed';
    dropdown.style.zIndex = '1100';
  }

  const rect = wrap.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + 4}px`;
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.width = `${rect.width}px`;
}

function showGroupMemberOptions() {
  filterGroupMemberOptions();
  positionGroupMemberDropdown();
}

function hideGroupMemberOptions() {
  const dropdown = document.getElementById('add-group-member-dropdown');
  if (dropdown) dropdown.style.display = 'none';
}

function filterGroupMemberOptions() {
  const input = document.getElementById('add-group-member-input');
  const dropdown = document.getElementById('add-group-member-dropdown');
  if (!input || !dropdown) return;
  positionGroupMemberDropdown();

  const selectedNames = new Set(_selectedGroupMembersForAdd.map(m => m.name));
  const q = input.value.trim().toLowerCase();
  const matches = _groupMemberOptionPool.filter(m =>
    !selectedNames.has(m.name) && (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
  );

  dropdown.innerHTML = matches.length
    ? matches.slice(0, 50).map(m => `
        <button type="button" class="chip-multiselect-option" onclick="selectGroupMemberOption('${m.name.replace(/'/g, "\\'")}')">
          ${m.name} (${m.email})
        </button>`).join('')
    : `<div class="chip-multiselect-empty">No matching members</div>`;
  dropdown.style.display = 'block';
}

function selectGroupMemberOption(name) {
  const member = _groupMemberOptionPool.find(m => m.name === name);
  if (!member) return;
  _selectedGroupMembersForAdd.push(member);
  renderGroupMemberChips();

  const input = document.getElementById('add-group-member-input');
  if (input) { input.value = ''; input.focus(); }
  filterGroupMemberOptions();
  updateAddGroupMemberButton();
}

function removeGroupMemberChip(name) {
  _selectedGroupMembersForAdd = _selectedGroupMembersForAdd.filter(m => m.name !== name);
  renderGroupMemberChips();
  filterGroupMemberOptions();
  updateAddGroupMemberButton();
}

document.addEventListener('click', e => {
  if (!e.target.closest('#add-group-member-multiselect') && !e.target.closest('#add-group-member-dropdown')) {
    hideGroupMemberOptions();
  }
});

function updateAddGroupMemberButton() {
  const btn = document.getElementById('add-group-member-submit-btn');
  if (!btn) return;
  btn.disabled = _selectedGroupMembersForAdd.length === 0;
}

function submitAddGroupMember() {
  if (!_activeGroup || !_selectedGroupMembersForAdd.length) return;
  const role = _selectedGroupMemberRole;

  if (!_activeGroup._aiHubExtraMembers) _activeGroup._aiHubExtraMembers = [];
  _selectedGroupMembersForAdd.forEach(member => {
    _activeGroup._aiHubExtraMembers.push({ name: member.name, email: member.email, role });
  });

  closeModal('modal-add-group-member');
  renderGroupDetailView(_activeGroup);
  renderGroups(_currentGroupsList);
}

function toggleGroupSourceSection(sourceId) {
  if (_collapsedGroupSources.has(sourceId)) {
    _collapsedGroupSources.delete(sourceId);
  } else {
    _collapsedGroupSources.add(sourceId);
  }
  if (_activeGroup) renderGroupDetailView(_activeGroup);
}

let _selectedGroupsFilter = 'all';

function toggleGroupsFilterMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('groups-filter-menu');
  const trigger = document.getElementById('groups-filter-trigger');
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeGroupsFilterMenu();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
  }
}

function closeGroupsFilterMenu() {
  const menu = document.getElementById('groups-filter-menu');
  const trigger = document.getElementById('groups-filter-trigger');
  if (menu) menu.style.display = 'none';
  if (trigger) trigger.classList.remove('open');
}

function selectGroupsFilter(label, value) {
  _selectedGroupsFilter = value;
  const valueEl = document.getElementById('groups-filter-value');
  if (valueEl) valueEl.textContent = label;
  document.querySelectorAll('#groups-filter-menu .custom-select-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.value === value);
  });
  closeGroupsFilterMenu();
}

function openGroupDetail(group) {
  const listView = document.getElementById('groups-list-view');
  const detailView = document.getElementById('group-detail-view');
  if (!listView || !detailView) return;

  _activeGroup = group;
  _groupSourceSearches = {};
  _collapsedGroupSources.clear();

  document.getElementById('group-detail-name').textContent = group.name;
  renderGroupDetailView(group);

  listView.style.display = 'none';
  detailView.style.display = 'block';
}

function closeGroupDetail() {
  const listView = document.getElementById('groups-list-view');
  const detailView = document.getElementById('group-detail-view');
  if (!listView || !detailView) return;
  _activeGroup = null;
  detailView.style.display = 'none';
  listView.style.display = 'block';
}

// ── Rename group ──────────────────────────────────────────
function openRenameGroupModal() {
  if (!_activeGroup) return;
  const input = document.getElementById('rename-group-input');
  if (input) {
    input.value = _activeGroup.name;
    input.dataset.originalName = _activeGroup.name;
  }
  updateRenameGroupButton();
  openModal('modal-rename-group');
}

function updateRenameGroupButton() {
  const input = document.getElementById('rename-group-input');
  const btn = document.getElementById('rename-group-save-btn');
  if (!input || !btn) return;
  const name = input.value.trim();
  btn.disabled = !name || name === input.dataset.originalName;
}

function saveRenameGroup() {
  if (!_activeGroup) return;
  const input = document.getElementById('rename-group-input');
  const name = input?.value.trim();
  if (!name) return;
  _activeGroup.name = name;
  document.getElementById('group-detail-name').textContent = name;
  renderGroups(_currentGroupsList);
  closeModal('modal-rename-group');
}

// ── Delete group ──────────────────────────────────────────
function openDeleteGroupModal() {
  if (!_activeGroup) return;
  const titleEl = document.getElementById('delete-group-name-title');
  const input = document.getElementById('delete-group-name-input');
  if (titleEl) titleEl.textContent = `<${_activeGroup.name}>`;
  if (input) {
    input.value = '';
    input.placeholder = `<${_activeGroup.name}>`;
  }
  updateDeleteGroupButton();
  openModal('modal-delete-group');
}

function updateDeleteGroupButton() {
  const input = document.getElementById('delete-group-name-input');
  const btn = document.getElementById('delete-group-confirm-btn');
  if (!input || !btn || !_activeGroup) return;
  btn.disabled = input.value.trim() !== _activeGroup.name;
}

function confirmDeleteGroup() {
  if (!_activeGroup) return;
  const idx = GROUPS.indexOf(_activeGroup);
  if (idx !== -1) GROUPS.splice(idx, 1);
  _currentGroupsList = GROUPS;
  renderGroups(_currentGroupsList);
  closeModal('modal-delete-group');
  closeGroupDetail();
}

// ── Add new IdP group mapping ────────────────────────────────
let _addIdpMappingData = { idpId: '', idpLabel: '', iconSrc: '' };
let _addIdpMappingMenuHome = null;

function renderAddIdpMappingMenu() {
  const menu = document.getElementById('add-idp-mapping-idp-menu');
  if (!menu) return;

  const existingIds = new Set(
    parseMembershipSources(_activeGroup?.membershipSource).map(s => getSourceMeta(s).id)
  );

  const idpOptions = getConfiguredIdentityProviders()
    .map(idp => ({ id: idp.id, label: formatIdpDisplayLabel(idp), iconSrc: idp.iconSrc, sourceId: getSourceMeta(formatIdpDisplayLabel(idp)).id }));

  const options = [
    { id: 'ai-hub', label: 'AI Hub', iconSrc: null, sourceId: 'ai-hub' },
    ...idpOptions,
  ].filter(opt => !existingIds.has(opt.sourceId));

  if (!options.length) {
    menu.innerHTML = '<button type="button" class="custom-select-option" disabled>No available sources to add</button>';
    return;
  }

  menu.innerHTML = options.map(opt => {
    const safeLabel = opt.label.replace(/'/g, "\\'");
    const isActive = _addIdpMappingData.idpId === opt.id;
    const icon = opt.iconSrc
      ? `<img src="${opt.iconSrc}" width="16" height="16" alt="" />`
      : ibIcon('instabase', { size: 16, color: '#161513' });
    return `
      <button type="button" class="custom-select-option${isActive ? ' active' : ''}"
        onclick="selectAddIdpMappingIdp('${opt.id}', '${safeLabel}', '${(opt.iconSrc || '').replace(/'/g, "\\'")}')">
        <span class="bulk-source-option-content">
          ${icon}
          <span>${opt.label}</span>
        </span>
      </button>`;
  }).join('');
}

function openAddIdpGroupMappingModal() {
  if (!_activeGroup) return;
  _addIdpMappingData = { idpId: '', idpLabel: '', iconSrc: '' };
  const valueEl = document.getElementById('add-idp-mapping-idp-value');
  const groupIdInput = document.getElementById('add-idp-mapping-groupid');
  const groupIdField = document.getElementById('add-idp-mapping-groupid-field');
  if (valueEl) valueEl.textContent = 'Select';
  if (groupIdInput) groupIdInput.value = '';
  if (groupIdField) groupIdField.style.display = 'none';
  renderAddIdpMappingMenu();
  updateAddIdpMappingNextButton();
  openModal('modal-add-idp-mapping');
}

function toggleAddIdpMappingMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('add-idp-mapping-idp-menu');
  const trigger = document.getElementById('add-idp-mapping-idp-trigger');
  const wrap = document.getElementById('add-idp-mapping-idp-select');
  if (!menu || !trigger || !wrap) return;
  const isOpen = menu.style.display === 'block';
  closeAddIdpMappingMenu();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    if (!menu.classList.contains('is-portaled')) {
      _addIdpMappingMenuHome = wrap;
      document.body.appendChild(menu);
      menu.classList.add('is-portaled');
    }
    const rect = trigger.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${rect.left}px`;
    menu.style.width = `${rect.width}px`;
  }
}

function closeAddIdpMappingMenu() {
  const menu = document.getElementById('add-idp-mapping-idp-menu');
  const trigger = document.getElementById('add-idp-mapping-idp-trigger');
  if (menu) {
    menu.style.display = 'none';
    if (menu.classList.contains('is-portaled') && _addIdpMappingMenuHome) {
      _addIdpMappingMenuHome.appendChild(menu);
      menu.classList.remove('is-portaled');
      menu.style.top = '';
      menu.style.left = '';
      menu.style.width = '';
    }
  }
  if (trigger) trigger.classList.remove('open');
}

function selectAddIdpMappingIdp(id, label, iconSrc) {
  _addIdpMappingData = { idpId: id, idpLabel: label, iconSrc };
  const valueEl = document.getElementById('add-idp-mapping-idp-value');
  if (valueEl) valueEl.textContent = label;
  const groupIdField = document.getElementById('add-idp-mapping-groupid-field');
  if (groupIdField) groupIdField.style.display = id === 'ai-hub' ? 'none' : 'block';
  closeAddIdpMappingMenu();
  updateAddIdpMappingNextButton();
}

function updateAddIdpMappingNextButton() {
  const btn = document.getElementById('add-idp-mapping-next-btn');
  const groupIdInput = document.getElementById('add-idp-mapping-groupid');
  if (!btn) return;
  const needsGroupId = _addIdpMappingData.idpId && _addIdpMappingData.idpId !== 'ai-hub';
  btn.disabled = !(_addIdpMappingData.idpId && (!needsGroupId || groupIdInput?.value.trim()));
}

function goToAddIdpMappingConfirm() {
  const btn = document.getElementById('add-idp-mapping-next-btn');
  if (btn?.disabled) return;
  closeModal('modal-add-idp-mapping');
  openModal('modal-confirm-idp-mapping');
}

function confirmAddIdpMapping() {
  if (!_activeGroup || !_addIdpMappingData.idpLabel) return;
  const sourceLabel = _addIdpMappingData.idpId === 'ai-hub' ? 'AI hub' : _addIdpMappingData.idpLabel;
  const current = parseMembershipSources(_activeGroup.membershipSource);
  if (!current.some(s => s.toLowerCase() === sourceLabel.toLowerCase())) {
    current.push(sourceLabel);
    _activeGroup.membershipSource = current.join(', ');
  }
  if (_addIdpMappingData.idpId !== 'ai-hub') {
    const meta = getSourceMeta(sourceLabel);
    if (!_activeGroup._justAddedSources) _activeGroup._justAddedSources = new Set();
    _activeGroup._justAddedSources.add(meta.id);
  }
  closeModal('modal-confirm-idp-mapping');
  renderGroupDetailView(_activeGroup);
}

document.addEventListener('click', e => {
  if (!e.target.closest('#add-idp-mapping-idp-select') && !e.target.closest('#add-idp-mapping-idp-menu')) closeAddIdpMappingMenu();
});

// ── Add group modal ──────────────────────────────────────────
let _addGroupData = { name: '', idpMapping: false, idp: '', idpLabel: '', groupId: '' };

function formatIdpDisplayLabel(idp) {
  return idp.type ? `${idp.name} (${idp.type})` : idp.name;
}

function resetAddGroupModal() {
  _addGroupData = { name: '', idpMapping: false, idp: '', idpLabel: '', groupId: '' };
  const nameInput = document.getElementById('add-group-name-input');
  const groupIdInput = document.getElementById('add-group-idp-group-id');
  const toggle = document.getElementById('add-group-idp-toggle');
  const fields = document.getElementById('add-group-idp-fields');
  const valueEl = document.getElementById('add-group-idp-value');
  const desc = document.getElementById('add-group-mapping-desc');
  if (nameInput) nameInput.value = '';
  if (groupIdInput) groupIdInput.value = '';
  if (toggle) {
    toggle.classList.remove('on');
    toggle.setAttribute('aria-checked', 'false');
  }
  if (fields) fields.style.display = 'none';
  if (valueEl) valueEl.textContent = 'Select';
  if (desc) {
    desc.textContent = "Sync this group's membership with a group defined in your identity provider. Manage members through your identity provider instead of AI Hub.";
  }
  closeAddGroupIdpMenu();
  updateAddGroupForm();
}

function renderAddGroupIdpMenu() {
  const menu = document.getElementById('add-group-idp-menu');
  if (!menu) return;
  const idps = getConfiguredIdentityProviders();
  if (!idps.length) {
    menu.innerHTML = '<button type="button" class="custom-select-option" disabled>No providers configured</button>';
    return;
  }
  menu.innerHTML = idps.map(idp => {
    const label = formatIdpDisplayLabel(idp);
    const safeLabel = label.replace(/'/g, "\\'");
    const isActive = _addGroupData.idp === idp.id || _addGroupData.idpLabel === label;
    return `
      <button type="button" class="custom-select-option${isActive ? ' active' : ''}"
        onclick="selectAddGroupIdp('${idp.id}', '${safeLabel}', '${idp.iconSrc.replace(/'/g, "\\'")}')">
        <span class="bulk-source-option-content">
          <img src="${idp.iconSrc}" width="16" height="16" alt="" />
          <span>${label}</span>
        </span>
      </button>`;
  }).join('');
}

function handleAddGroupClick() {
  if (_currentAppVersion === 'v0') {
    openAddGroupModal();
  } else {
    toggleDropdown('add-group-dropdown');
  }
}

function openAddGroupModal() {
  resetAddGroupModal();
  renderAddGroupIdpMenu();
  openModal('modal-add-group');
}

function syncAddGroupIdpMappingState() {
  const toggle = document.getElementById('add-group-idp-toggle');
  const fields = document.getElementById('add-group-idp-fields');
  const desc = document.getElementById('add-group-mapping-desc');
  if (!toggle || !fields) return;

  const isOn = toggle.classList.contains('on');
  _addGroupData.idpMapping = isOn;
  fields.style.display = isOn ? 'flex' : 'none';

  if (desc) {
    desc.textContent = isOn
      ? "Map this group's members list to a SAML group or OIDC group members list, as defined in your identity provider. Any future changes to the group's members list must be made using your identity provider."
      : "Sync this group's membership with a group defined in your identity provider. Manage members through your identity provider instead of AI Hub.";
  }

  if (!isOn) {
    _addGroupData.idp = '';
    _addGroupData.idpLabel = '';
    _addGroupData.groupId = '';
    const groupIdInput = document.getElementById('add-group-idp-group-id');
    const valueEl = document.getElementById('add-group-idp-value');
    if (groupIdInput) groupIdInput.value = '';
    if (valueEl) valueEl.textContent = 'Select';
    closeAddGroupIdpMenu();
    renderAddGroupIdpMenu();
  }

  updateAddGroupForm();
}

function closeAddGroupIdpMenu() {
  const menu = document.getElementById('add-group-idp-menu');
  const trigger = document.getElementById('add-group-idp-trigger');
  if (menu) menu.style.display = 'none';
  if (trigger) trigger.classList.remove('open');
}

function toggleAddGroupIdpMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('add-group-idp-menu');
  const trigger = document.getElementById('add-group-idp-trigger');
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeAddGroupIdpMenu();
  closeBulkSourceMenus();
  closeBulkIdpMenus();
  if (!isOpen) {
    renderAddGroupIdpMenu();
    menu.style.display = 'block';
    trigger.classList.add('open');
  }
}

function selectAddGroupIdp(idpId, label, iconSrc) {
  _addGroupData.idp = idpId;
  _addGroupData.idpLabel = label;
  const valueEl = document.getElementById('add-group-idp-value');
  if (valueEl) {
    valueEl.innerHTML = `<span class="bulk-source-option-content"><img src="${iconSrc}" width="16" height="16" alt="" /><span>${label}</span></span>`;
  }
  closeAddGroupIdpMenu();
  renderAddGroupIdpMenu();
  updateAddGroupForm();
}

function isAddGroupValid() {
  const name = document.getElementById('add-group-name-input')?.value.trim() || '';
  if (!name) return false;
  if (!_addGroupData.idpMapping) return true;
  const groupId = document.getElementById('add-group-idp-group-id')?.value.trim() || '';
  return Boolean(_addGroupData.idpLabel && groupId);
}

function updateAddGroupForm() {
  _addGroupData.name = document.getElementById('add-group-name-input')?.value || '';
  _addGroupData.groupId = document.getElementById('add-group-idp-group-id')?.value || '';
  const btn = document.getElementById('add-group-submit-btn');
  if (btn) btn.disabled = !isAddGroupValid();
}

function buildAddGroupMembershipSource() {
  if (_addGroupData.idpMapping && _addGroupData.idpLabel) {
    const idps = getConfiguredIdentityProviders();
    const selected = idps.find(p => p.id === _addGroupData.idp);
    return selected?.name || _addGroupData.idpLabel.replace(/\s*\([^)]*\)$/, '');
  }
  return 'AI hub';
}

function submitAddGroup() {
  if (!isAddGroupValid()) return;

  const name = _addGroupData.name.trim();
  const hadIdpMapping = _addGroupData.idpMapping;

  GROUPS.unshift({
    name,
    members: 0,
    managers: [],
    membershipSource: buildAddGroupMembershipSource(),
  });

  _currentGroupsList = GROUPS;
  renderGroups(_currentGroupsList);
  closeModal('modal-add-group');

  const title = document.getElementById('group-success-title');
  const desc = document.getElementById('group-success-desc');
  if (title) title.textContent = `Group ${name} created successfully`;
  if (desc) {
    desc.textContent = hadIdpMapping
      ? 'This group is mapped to an identity provider group. Mapped groups sync from your identity provider at each member\'s next login.'
      : '';
  }
  openModal('modal-group-success');
}

function closeGroupSuccessModal() {
  closeModal('modal-group-success');
}

// ── Add multiple groups modal ────────────────────────────────
const BULK_MEMBERSHIP_SOURCES = [
  { id: 'aihub', label: 'AIhub', type: 'internal' },
  { id: 'identity-provider', label: 'Identity provider', type: 'external' },
];

let _bulkGroupsData = null;
const _bulkMenuHomes = new Map();

function positionBulkPortaledMenu(menuId, trigger) {
  const menu = document.getElementById(menuId);
  if (!menu || !trigger) return;

  const wrapId = menuId.replace('-menu-', '-wrap-');
  const wrap = document.getElementById(wrapId);

  if (!menu.classList.contains('is-portaled')) {
    if (wrap) _bulkMenuHomes.set(menuId, wrap);
    document.body.appendChild(menu);
    menu.classList.add('is-portaled');
  }

  const rect = trigger.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
}

function restoreBulkPortaledMenu(menu) {
  if (!menu) return;
  menu.style.display = 'none';
  if (!menu.classList.contains('is-portaled')) return;

  const home = _bulkMenuHomes.get(menu.id);
  if (home && home.isConnected) {
    home.appendChild(menu);
  } else if (menu.parentElement === document.body) {
    menu.remove();
  }

  _bulkMenuHomes.delete(menu.id);
  menu.classList.remove('is-portaled');
  menu.style.top = '';
  menu.style.left = '';
  menu.style.width = '';
}

function getConfiguredIdentityProviders() {
  return [...document.querySelectorAll('#page-identity .sso-row')].map((row, index) => {
    const main = row.querySelector('.col-main');
    const img = main?.querySelector('img');
    const name = (main?.textContent || '').trim() || `Provider ${index + 1}`;
    return {
      id: `sso-${index}`,
      name,
      type: row.querySelector('.col-type')?.textContent.trim() || '',
      iconSrc: img?.getAttribute('src') || 'illustration/Okta.png',
    };
  });
}

function resetBulkGroupsModal() {
  closeBulkSourceMenus();
  closeBulkIdpMenus();
  _bulkGroupsData = [{ name: '', rows: [{ sourceId: '', idp: '', groupId: '' }] }];
  const body = document.getElementById('bulk-groups-modal-body');
  if (body) body.innerHTML = '';
  updateBulkGroupsSubmitButton();
}

function bulkSourceOptionHtml(source) {
  if (source.id === 'aihub') {
    return `<span class="bulk-source-option-content"><span data-icon="instabase" data-size="16" data-color="#161513"></span><span>${source.label}</span></span>`;
  }
  return `<span>${source.label}</span>`;
}

function bulkSourceTriggerHtml(sourceId) {
  if (!sourceId) return 'Select';
  const source = BULK_MEMBERSHIP_SOURCES.find(s => s.id === sourceId);
  return source ? bulkSourceOptionHtml(source) : 'Select';
}

function bulkIdpCellHtml(gi, ri, row) {
  if (!row.sourceId || row.sourceId === 'aihub') {
    return `<div class="bulk-cell-disabled">—</div>`;
  }

  const idps = getConfiguredIdentityProviders();
  if (!idps.length) {
    return `<div class="bulk-cell-disabled">No providers configured</div>`;
  }

  const menuId = `bulk-idp-menu-${gi}-${ri}`;
  const valueId = `bulk-idp-value-${gi}-${ri}`;
  const selected = idps.find(p => p.id === row.idp || p.name === row.idp);
  const triggerContent = selected
    ? `<span class="bulk-source-option-content"><img src="${selected.iconSrc}" width="16" height="16" alt="" /><span>${selected.name}</span></span>`
    : 'Select';
  const optionsHtml = idps.map(idp => {
    const isActive = row.idp === idp.id || row.idp === idp.name;
    const safeName = idp.name.replace(/'/g, "\\'");
    return `
      <button type="button" class="custom-select-option${isActive ? ' active' : ''}"
        onclick="selectBulkIdp(${gi}, ${ri}, '${idp.id}', '${safeName}')">
        <span class="bulk-source-option-content"><img src="${idp.iconSrc}" width="16" height="16" alt="" /><span>${idp.name}</span></span>
      </button>`;
  }).join('');

  return `
    <div class="bulk-idp-select custom-select-wrap custom-select-wrap--sm" id="bulk-idp-wrap-${gi}-${ri}">
      <button type="button" class="custom-select-trigger" onclick="toggleBulkIdpMenu(event, ${gi}, ${ri})">
        <span id="${valueId}">${triggerContent}</span>
        <span data-icon="chevron-down" data-size="14" data-color="#6B7280" data-icon-class="select-chevron"></span>
      </button>
      <div class="custom-select-menu" id="${menuId}" style="display:none;">${optionsHtml}</div>
    </div>`;
}

function bulkGroupIdCellHtml(gi, ri, row) {
  const isEnabled = row.sourceId === 'identity-provider' && row.idp;
  const escaped = (row.groupId || '').replace(/"/g, '&quot;');
  return `<input type="text" class="form-input bulk-group-id-input"
    placeholder="${isEnabled ? 'Enter group ID' : ''}"
    value="${escaped}"
    ${isEnabled ? '' : 'disabled'}
    oninput="updateBulkGroupId(${gi}, ${ri}, this.value)" />`;
}

function renderBulkMappingRow(gi, ri, row) {
  const menuId = `bulk-source-menu-${gi}-${ri}`;
  const valueId = `bulk-source-value-${gi}-${ri}`;
  const optionsHtml = BULK_MEMBERSHIP_SOURCES.map(source => `
    <button type="button" class="custom-select-option${row.sourceId === source.id ? ' active' : ''}"
      onclick="selectBulkMembershipSource(${gi}, ${ri}, '${source.id}')">
      ${bulkSourceOptionHtml(source)}
    </button>`).join('');

  return `
    <div class="bulk-mapping-row" data-row-index="${ri}">
      <div class="bulk-source-select custom-select-wrap custom-select-wrap--sm" id="bulk-source-wrap-${gi}-${ri}">
        <button type="button" class="custom-select-trigger" onclick="toggleBulkSourceMenu(event, ${gi}, ${ri})">
          <span id="${valueId}">${bulkSourceTriggerHtml(row.sourceId)}</span>
          <span data-icon="chevron-down" data-size="14" data-color="#6B7280" data-icon-class="select-chevron"></span>
        </button>
        <div class="custom-select-menu" id="${menuId}" style="display:none;">${optionsHtml}</div>
      </div>
      ${bulkIdpCellHtml(gi, ri, row)}
      ${bulkGroupIdCellHtml(gi, ri, row)}
    </div>`;
}

function renderBulkGroupBlock(group, gi) {
  const rowsHtml = group.rows.map((row, ri) => renderBulkMappingRow(gi, ri, row)).join('');
  const escapedName = (group.name || '').replace(/"/g, '&quot;');

  return `
    <div class="bulk-group-block" data-group-index="${gi}">
      <div class="bulk-group-name-field form-field">
        <label class="form-label" for="bulk-group-name-${gi}">Group name ${gi + 1}</label>
        <input type="text" class="form-input" id="bulk-group-name-${gi}" placeholder="Enter group name"
          value="${escapedName}" oninput="updateBulkGroupName(${gi}, this.value)" />
      </div>
      <div class="bulk-mapping-table">
        <div class="bulk-mapping-header">
          <div>Membership source <button type="button" class="info-icon-btn" aria-label="Membership source info"><span data-icon="info" data-size="14" data-color="#9CA3AF"></span></button></div>
          <div>Identity provider</div>
          <div>Group ID in identity provider <button type="button" class="info-icon-btn" aria-label="Group ID info"><span data-icon="info" data-size="14" data-color="#9CA3AF"></span></button></div>
        </div>
        ${rowsHtml}
        <div class="bulk-mapping-actions">
          <button type="button" class="bulk-action-link" onclick="addBulkMappingRow(${gi})">
            <span data-icon="plus" data-size="14" data-color="#5a52fa"></span>
            Add new row
          </button>
        </div>
      </div>
    </div>`;
}

function renderBulkGroupsModal() {
  const body = document.getElementById('bulk-groups-modal-body');
  if (!body || !_bulkGroupsData) return;

  closeBulkSourceMenus();
  closeBulkIdpMenus();

  const blocksHtml = _bulkGroupsData.map((group, gi) => {
    const divider = gi > 0 ? '<hr class="bulk-groups-divider">' : '';
    return `${divider}${renderBulkGroupBlock(group, gi)}`;
  }).join('');

  body.innerHTML = `${blocksHtml}
    <button type="button" class="bulk-action-link bulk-action-link--create-group" onclick="addBulkGroupBlock()">
      <span data-icon="plus" data-size="14" data-color="#5a52fa"></span>
      Create new group
    </button>`;

  updateBulkGroupsSubmitButton();
  initIcons();
}

function openAddMultipleGroupsModal() {
  resetBulkGroupsModal();
  _bulkGroupsData = [{ name: '', rows: [{ sourceId: '', idp: '', groupId: '' }] }];
  renderBulkGroupsModal();
  openModal('modal-add-multiple-groups');
}

function closeBulkSourceMenus() {
  document.querySelectorAll('[id^="bulk-source-menu-"]').forEach(restoreBulkPortaledMenu);
  document.querySelectorAll('[id^="bulk-source-wrap-"] .custom-select-trigger').forEach(trigger => {
    trigger.classList.remove('open');
  });
}

function closeBulkIdpMenus() {
  document.querySelectorAll('[id^="bulk-idp-menu-"]').forEach(restoreBulkPortaledMenu);
  document.querySelectorAll('[id^="bulk-idp-wrap-"] .custom-select-trigger').forEach(trigger => {
    trigger.classList.remove('open');
  });
}

function toggleBulkSourceMenu(e, gi, ri) {
  e.stopPropagation();
  const menu = document.getElementById(`bulk-source-menu-${gi}-${ri}`);
  const trigger = document.querySelector(`#bulk-source-wrap-${gi}-${ri} .custom-select-trigger`);
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeBulkSourceMenus();
  closeBulkIdpMenus();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    positionBulkPortaledMenu(`bulk-source-menu-${gi}-${ri}`, trigger);
  }
}

function toggleBulkIdpMenu(e, gi, ri) {
  e.stopPropagation();
  const menu = document.getElementById(`bulk-idp-menu-${gi}-${ri}`);
  const trigger = document.querySelector(`#bulk-idp-wrap-${gi}-${ri} .custom-select-trigger`);
  if (!menu || !trigger) return;
  const isOpen = menu.style.display === 'block';
  closeBulkIdpMenus();
  closeBulkSourceMenus();
  if (!isOpen) {
    menu.style.display = 'block';
    trigger.classList.add('open');
    positionBulkPortaledMenu(`bulk-idp-menu-${gi}-${ri}`, trigger);
  }
}

function selectBulkMembershipSource(gi, ri, sourceId) {
  if (!_bulkGroupsData?.[gi]?.rows?.[ri]) return;
  const row = _bulkGroupsData[gi].rows[ri];
  row.sourceId = sourceId;
  row.idp = '';
  row.groupId = '';
  renderBulkGroupsModal();
}

function selectBulkIdp(gi, ri, idpId, name) {
  if (!_bulkGroupsData?.[gi]?.rows?.[ri]) return;
  const row = _bulkGroupsData[gi].rows[ri];
  row.idp = name;
  row.groupId = '';
  renderBulkGroupsModal();
}

function updateBulkGroupName(gi, name) {
  if (_bulkGroupsData?.[gi]) {
    _bulkGroupsData[gi].name = name;
    updateBulkGroupsSubmitButton();
  }
}

function updateBulkGroupId(gi, ri, value) {
  if (_bulkGroupsData?.[gi]?.rows?.[ri]) {
    _bulkGroupsData[gi].rows[ri].groupId = value;
    updateBulkGroupsSubmitButton();
  }
}

function addBulkMappingRow(gi) {
  if (!_bulkGroupsData?.[gi]) return;
  _bulkGroupsData[gi].rows.push({ sourceId: '', idp: '', groupId: '' });
  renderBulkGroupsModal();
}

function addBulkGroupBlock() {
  if (!_bulkGroupsData) return;
  _bulkGroupsData.push({ name: '', rows: [{ sourceId: '', idp: '', groupId: '' }] });
  renderBulkGroupsModal();
}

function bulkRowIsValid(row) {
  if (!row.sourceId) return false;
  if (row.sourceId === 'aihub') return true;
  if (row.sourceId === 'identity-provider') {
    return Boolean(row.idp.trim() && row.groupId.trim());
  }
  return false;
}

function isBulkGroupsValid() {
  if (!_bulkGroupsData?.length) return false;
  return _bulkGroupsData.every(group => {
    if (!group.name.trim()) return false;
    if (!group.rows.length) return false;
    return group.rows.every(bulkRowIsValid);
  });
}

function updateBulkGroupsSubmitButton() {
  const btn = document.getElementById('bulk-groups-submit-btn');
  if (btn) btn.disabled = !isBulkGroupsValid();
}

function membershipSourceLabelFromRow(row) {
  if (row.sourceId === 'aihub') return 'AI hub';
  if (row.sourceId === 'identity-provider') return row.idp;
  return '';
}

function buildMembershipSourceFromRows(rows) {
  const labels = [];
  rows.forEach(row => {
    const label = membershipSourceLabelFromRow(row);
    if (label && !labels.includes(label)) labels.push(label);
  });
  return labels.join(', ');
}

function submitBulkGroups() {
  if (!isBulkGroupsValid() || !_bulkGroupsData) return;

  _bulkGroupsData.forEach(group => {
    const membershipSource = buildMembershipSourceFromRows(group.rows);
    GROUPS.unshift({
      name: group.name.trim(),
      members: 0,
      managers: [],
      membershipSource,
    });
  });

  _currentGroupsList = GROUPS;
  renderGroups(_currentGroupsList);
  closeModal('modal-add-multiple-groups');
}

function handleSsoEmailToggleClick() {
  const toggle = document.getElementById('sso-email-toggle');
  if (!toggle || toggle.disabled) return;
  const isOn = toggle.classList.contains('on');
  if (isOn) {
    toggle.classList.remove('on');
    toggle.setAttribute('aria-checked', 'false');
  } else {
    openModal('modal-sso-email-enable');
  }
}

function confirmSsoEmailToggleEnable() {
  const toggle = document.getElementById('sso-email-toggle');
  if (toggle) {
    toggle.classList.add('on');
    toggle.setAttribute('aria-checked', 'true');
  }
  closeModal('modal-sso-email-enable');
}

// Search filtering
function updateSsoToggleState() {
  const hasRows = document.querySelectorAll('#sso-table-body .sso-row').length > 0;
  const toggle = document.getElementById('sso-email-toggle');
  const label = document.querySelector('#sso-toggle-row .toggle-label');
  const table = document.getElementById('sso-table');
  const emptyState = document.getElementById('sso-empty-state');
  const toggleRow = document.getElementById('sso-toggle-row');
  if (table) table.style.display = hasRows ? '' : 'none';
  if (emptyState) emptyState.style.display = hasRows ? 'none' : '';
  if (toggleRow) toggleRow.style.display = hasRows ? '' : 'none';
  if (!toggle) return;
  if (hasRows) {
    toggle.disabled = false;
    toggle.classList.remove('toggle-disabled');
    label.classList.remove('toggle-label-disabled');
  } else {
    toggle.disabled = true;
    toggle.classList.add('toggle-disabled');
    label.classList.add('toggle-label-disabled');
  }
}

// ── Version lab switcher ──────────────────────────────────────
let _v6DataBackup = null;
let _currentAppVersion = 'v5';

function toggleVersionLabMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('version-lab-menu');
  if (!menu) return;
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function captureV6Backup() {
  if (_v6DataBackup) return;
  _v6DataBackup = {
    members: JSON.parse(JSON.stringify(MEMBERS)),
    oauthProviders: JSON.parse(JSON.stringify(OAUTH_PROVIDERS)),
    serviceAccounts: JSON.parse(JSON.stringify(SERVICE_ACCOUNTS)),
    groups: JSON.parse(JSON.stringify(GROUPS)),
    ssoTableBodyHtml: document.getElementById('sso-table-body')?.innerHTML || '',
    membersCountText: document.getElementById('members-count')?.textContent || '',
    groupsCountText: document.getElementById('groups-count')?.textContent || '',
  };
}

function applyEmptyDataState() {
  captureV6Backup();
  MEMBERS.length = 0;
  OAUTH_PROVIDERS.length = 0;
  SERVICE_ACCOUNTS.length = 0;
  GROUPS.length = 0;
  const ssoBody = document.getElementById('sso-table-body');
  if (ssoBody) ssoBody.innerHTML = '';
  refreshAllDataViews(true);
}

function seedV4ServiceAccounts() {
  const seeds = [
    { name: 'anz.poc', role: 'Member', tokens: [
      { name: 'prod-ingest', description: 'Production ingestion pipeline', fullValue: generateTokenValue(), expiration: 'Never expires' },
    ] },
    { name: 'automation_testing', role: 'Member', tokens: [
      { name: 'ci-runner', description: 'CI/CD test automation', fullValue: generateTokenValue(), expiration: formatTokenExpiration('90 days') },
    ] },
    { name: 'BG Service Account', role: 'Admin', tokens: [
      { name: 'reporting-job', description: 'Nightly reporting job', fullValue: generateTokenValue(), expiration: 'Never expires' },
      { name: 'backup-sync', description: 'Backup sync task', fullValue: generateTokenValue(), expiration: formatTokenExpiration('60 days') },
    ] },
    { name: 'CI/CD', role: 'Admin', tokens: [
      { name: 'deploy-key', description: 'Deployment pipeline', fullValue: generateTokenValue(), expiration: formatTokenExpiration('30 days') },
    ] },
  ];
  SERVICE_ACCOUNTS.length = 0;
  SERVICE_ACCOUNTS.push(...seeds);
  _currentServiceAccountsList = SERVICE_ACCOUNTS;
  renderServiceAccounts(SERVICE_ACCOUNTS);
  updateSaCount();
  updateAiHubAccountLinks();
}

function seedV0ServiceAccounts() {
  const seeds = [
    { name: 'anz.poc', role: 'Member', tokens: [
      { name: 'prod-ingest', description: 'Production ingestion pipeline', fullValue: generateTokenValue(), expiration: 'Never expires' },
    ] },
    { name: 'automation_testing', role: 'Member', tokens: [
      { name: 'ci-runner', description: 'CI/CD test automation', fullValue: generateTokenValue(), expiration: formatTokenExpiration('90 days') },
    ] },
    { name: 'BG Service Account', role: 'Admin', tokens: [
      { name: 'reporting-job', description: 'Nightly reporting job', fullValue: generateTokenValue(), expiration: 'Never expires' },
    ] },
    { name: 'CI/CD', role: 'Admin', tokens: [] },
    { name: 'Hannah Test Service Account', role: 'Member', tokens: [] },
    { name: 'ming_test_SA', role: 'Admin', tokens: [] },
  ];
  SERVICE_ACCOUNTS.length = 0;
  SERVICE_ACCOUNTS.push(...seeds);
  _currentServiceAccountsList = SERVICE_ACCOUNTS;
  renderServiceAccounts(SERVICE_ACCOUNTS);
  updateSaCount();
  updateAiHubAccountLinks();
}

function seedV5ServiceAccounts() {
  const seeds = [
    { name: 'anz.poc', role: 'Member',
      oauthMappings: [{ name: 'anz-poc-mapping', externalId: 'anz-poc-sub-01', provider: 'Okta-instabase-OIDC' }],
      oauthApps: [{ name: 'anz-poc-app', description: 'Production ingestion pipeline', clientId: generateTokenValue().slice(0, 8).toUpperCase(), clientSecret: generateTokenValue() }],
      tokens: [{ name: 'prod-ingest', description: 'Production ingestion pipeline', fullValue: generateTokenValue(), expiration: 'Never expires' }] },
    { name: 'automation_testing', role: 'Member',
      oauthMappings: [{ name: 'automation-mapping', externalId: 'automation-sub-02', provider: 'Okta-instabase-OIDC' }],
      oauthApps: [{ name: 'automation-app', description: 'CI/CD test automation', clientId: generateTokenValue().slice(0, 8).toUpperCase(), clientSecret: generateTokenValue() }],
      tokens: [{ name: 'ci-runner', description: 'CI/CD test automation', fullValue: generateTokenValue(), expiration: formatTokenExpiration('90 days') }] },
    { name: 'BG Service Account', role: 'Admin', oauthMappings: [], oauthApps: [], tokens: [] },
    { name: 'CI/CD', role: 'Admin', oauthMappings: [], oauthApps: [], tokens: [] },
    { name: 'Hannah Test Service Account', role: 'Member', oauthMappings: [], oauthApps: [], tokens: [] },
    { name: 'ming_test_SA', role: 'Admin', oauthMappings: [], oauthApps: [], tokens: [] },
  ];
  SERVICE_ACCOUNTS.length = 0;
  SERVICE_ACCOUNTS.push(...seeds);
  _currentServiceAccountsList = SERVICE_ACCOUNTS;
  renderServiceAccounts(SERVICE_ACCOUNTS);
  updateSaCount();
  updateAiHubAccountLinks();
}

function restoreFullDataState() {
  if (!_v6DataBackup) return;
  MEMBERS.length = 0;
  MEMBERS.push(..._v6DataBackup.members);
  OAUTH_PROVIDERS.length = 0;
  OAUTH_PROVIDERS.push(..._v6DataBackup.oauthProviders);
  SERVICE_ACCOUNTS.length = 0;
  SERVICE_ACCOUNTS.push(..._v6DataBackup.serviceAccounts);
  GROUPS.length = 0;
  GROUPS.push(..._v6DataBackup.groups);
  const ssoBody = document.getElementById('sso-table-body');
  if (ssoBody) ssoBody.innerHTML = _v6DataBackup.ssoTableBodyHtml;
  refreshAllDataViews(false);
}

function refreshAllDataViews(isEmpty) {
  closeMemberDetail();
  closeServiceAccountDetail();
  closeGroupDetail();
  _currentMembersList = MEMBERS;
  _currentServiceAccountsList = SERVICE_ACCOUNTS;
  _currentGroupsList = GROUPS;
  renderMembers(MEMBERS);
  renderServiceAccounts(SERVICE_ACCOUNTS);
  updateSaCount();
  renderGroups(GROUPS);
  renderOAuthProviders();
  updateSsoToggleState();
  updateAiHubAccountLinks();

  const membersCount = document.getElementById('members-count');
  const groupsCount = document.getElementById('groups-count');
  if (isEmpty) {
    if (membersCount) membersCount.textContent = '0 members';
    if (groupsCount) groupsCount.textContent = '0 groups';
  } else if (_v6DataBackup) {
    if (membersCount) membersCount.textContent = _v6DataBackup.membersCountText;
    if (groupsCount) groupsCount.textContent = _v6DataBackup.groupsCountText;
  }
}

const VERSION_LABELS = {
  v0: 'Before',
  v1: 'SSO, & RBAC',
  v2: 'SSO & RBAC empty',
  v4: 'API refresh release 1',
  v5: 'API refresh release 2',
  v6: 'full version empty',
};

function setAppVersion(version) {
  _currentAppVersion = version;
  document.body.classList.toggle('version-v0', version === 'v0');
  document.body.classList.toggle('version-v1', version === 'v1' || version === 'v2');
  document.body.classList.toggle('version-v4', version === 'v4');
  document.body.classList.toggle('version-v5', version === 'v5');

  if (version === 'v6' || version === 'v4' || version === 'v2') {
    applyEmptyDataState();
    if (version === 'v4') seedV4ServiceAccounts();
    if (version === 'v2') seedV2MemberOnly();
  } else {
    if (_v6DataBackup) restoreFullDataState();
    if (version === 'v0') { seedV0ServiceAccounts(); seedV0MemberTokens(); }
    if (version === 'v5') seedV5ServiceAccounts();
    if (version === 'v1') { seedV5ServiceAccounts(); seedV0MemberTokens(); }
  }
  renderApiTokens();

  if (version === 'v1' || version === 'v2') {
    document.getElementById('api-auth-tab-btn')?.classList.remove('active');
    document.getElementById('tab-api-auth')?.classList.remove('active');
    document.querySelector('.tab[data-tab="sso"]')?.classList.add('active');
    document.getElementById('tab-sso')?.classList.add('active');
  }

  document.querySelectorAll('.version-lab-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.version === version);
  });
  const menu = document.getElementById('version-lab-menu');
  if (menu) menu.style.display = 'none';

  const badge = document.getElementById('version-lab-indicator');
  if (badge) badge.textContent = VERSION_LABELS[version] || version;

  const topBanner = document.getElementById('v4-top-banner');
  if (topBanner) topBanner.style.display = version === 'v4' ? 'flex' : 'none';

  goToSettingsPage('account');
}

function dismissV4TopBanner() {
  const topBanner = document.getElementById('v4-top-banner');
  if (topBanner) topBanner.style.display = 'none';
}

function goToServiceAccountsFromBanner() {
  goToSettingsPage('identity');
  const tab = document.getElementById('api-auth-tab-btn');
  if (tab) tab.click();
  openAiHubAccountsView('issued-tokens');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#version-lab-wrap')) {
    const menu = document.getElementById('version-lab-menu');
    if (menu) menu.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTableSorting();
  applySamlIdpLabels('AD FS');
  applyOidcIdpLabels('AD FS');
  renderMembers(MEMBERS);
  renderServiceAccounts(SERVICE_ACCOUNTS);
  updateSaCount();
  renderGroups(GROUPS);
  updateSsoToggleState();
  renderOAuthProviders();
  updateAiHubAccountLinks();

  const membersList = document.getElementById('members-list');
  if (membersList) {
    membersList.addEventListener('click', e => {
      const editBtn = e.target.closest('.row-action-btn[title="Edit"]');
      if (editBtn) {
        const row = editBtn.closest('.member-row-clickable');
        const index = Number(row?.dataset.memberIndex);
        const member = _currentMembersList[index];
        if (member) openUpdateMemberRoleModal(member, index);
        return;
      }
      if (e.target.closest('.col-check, .row-actions, .row-action-btn, .row-checkbox')) return;
      const row = e.target.closest('.member-row-clickable');
      if (!row) return;
      const index = Number(row.dataset.memberIndex);
      const member = _currentMembersList[index];
      if (member) openMemberDetail(member);
    });
  }

  document.getElementById('member-detail-back')?.addEventListener('click', closeMemberDetail);

  const membersSearch = document.getElementById('members-search');
  if (membersSearch) {
    membersSearch.addEventListener('input', () => {
      const q = membersSearch.value.trim().toLowerCase();
      _currentMembersList = q
        ? MEMBERS.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.role.toLowerCase().includes(q))
        : MEMBERS;
      renderMembers(_currentMembersList);
    });
  }

  const saList = document.getElementById('sa-list');
  if (saList) {
    saList.addEventListener('click', e => {
      const editBtn = e.target.closest('.row-action-btn[title="Edit"]');
      if (editBtn) {
        const row = editBtn.closest('.member-row-clickable');
        const index = Number(row?.dataset.saIndex);
        const sa = _currentServiceAccountsList[index];
        if (sa) openUpdateSaRoleModal(sa, index);
        return;
      }
      if (e.target.closest('.col-check, .row-actions, .row-action-btn, .row-checkbox')) return;
      const row = e.target.closest('.member-row-clickable');
      if (!row) return;
      const index = Number(row.dataset.saIndex);
      const sa = _currentServiceAccountsList[index];
      if (sa) openServiceAccountDetail(sa);
    });
  }

  document.getElementById('sa-detail-back')?.addEventListener('click', closeServiceAccountDetail);

  const saSearch = document.getElementById('sa-search');
  if (saSearch) {
    saSearch.addEventListener('input', () => {
      const q = saSearch.value.trim().toLowerCase();
      _currentServiceAccountsList = q
        ? SERVICE_ACCOUNTS.filter(sa =>
            sa.name.toLowerCase().includes(q) ||
            sa.role.toLowerCase().includes(q))
        : SERVICE_ACCOUNTS;
      renderServiceAccounts(_currentServiceAccountsList);
    });
  }

  const groupsList = document.getElementById('groups-list');
  if (groupsList) {
    groupsList.addEventListener('click', e => {
      const row = e.target.closest('.group-row-clickable');
      if (!row) return;
      const index = Number(row.dataset.groupIndex);
      const group = _currentGroupsList[index];
      if (group) openGroupDetail(group);
    });
  }

  document.getElementById('group-detail-back')?.addEventListener('click', closeGroupDetail);

  const groupsSearch = document.getElementById('groups-search');
  if (groupsSearch) {
    groupsSearch.addEventListener('input', () => {
      const q = groupsSearch.value.trim().toLowerCase();
      _currentGroupsList = q
        ? GROUPS.filter(g => g.name.toLowerCase().includes(q))
        : GROUPS;
      renderGroups(_currentGroupsList);
    });
  }

  const groupSourceSections = document.getElementById('group-source-sections');
  if (groupSourceSections) {
    groupSourceSections.addEventListener('input', e => {
      if (!e.target.classList.contains('group-source-search') || !_activeGroup) return;
      const sourceId = e.target.dataset.sourceId;
      _groupSourceSearches[sourceId] = e.target.value;
      renderGroupDetailView(_activeGroup);
      const input = groupSourceSections.querySelector(`.group-source-search[data-source-id="${sourceId}"]`);
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }

  renderCarouselStages();
  carouselGo(1);
  startCarouselAutoplay();

  // ── URL-driven version + embed mode (for case-study iframes) ──
  const params = new URLSearchParams(window.location.search);
  const versionParam = params.get('version');
  if (versionParam && VERSION_LABELS[versionParam]) setAppVersion(versionParam);
  if (params.get('embed') === '1') {
    const labWrap = document.getElementById('version-lab-wrap');
    if (labWrap) labWrap.style.display = 'none';
  }
});

// Copy to clipboard
function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = ibIcon('check', { size: 16, color: '#10B981' });
    setTimeout(() => {
      btn.innerHTML = original;
    }, 1500);
  });
}

// Dropdown menus
function toggleDropdown(id) {
  const menu = document.getElementById(id);
  const isOpen = menu.style.display !== 'none';
  closeAllDropdowns();
  if (!isOpen) menu.style.display = 'block';
}
function closeDropdown(id) {
  const menu = document.getElementById(id);
  if (menu) menu.style.display = 'none';
}
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown-wrap')) closeAllDropdowns();
  if (!e.target.closest('#sa-role-select') && !e.target.closest('#sa-role-menu')) closeSaRoleMenu();
  if (!e.target.closest('#groups-filter-select')) closeGroupsFilterMenu();
});

// OAuth mode toggle
function toggleOAuthMode(e) {
  e.preventDefault();
  const discovery = document.getElementById('oauth-discovery-mode');
  const issuer = document.getElementById('oauth-issuer-mode');
  const showIssuer = discovery.style.display !== 'none';
  discovery.style.display = showIssuer ? 'none' : 'block';
  issuer.style.display = showIssuer ? 'block' : 'none';
}

// Modal open/close
var _samlEditMode = false;

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

let _memberMappingTarget = null;

function openOAuthMappingModal(memberTarget) {
  _memberMappingTarget = memberTarget || null;
  const displayName = document.getElementById('oauth-mapping-display-name');
  const provider = document.getElementById('oauth-mapping-provider');
  const externalId = document.getElementById('oauth-mapping-external-id');
  if (displayName) displayName.value = '';
  if (externalId) externalId.value = '';
  if (provider) {
    provider.innerHTML = '<option value="" disabled selected></option>' +
      OAUTH_PROVIDERS.map(p => `<option>${p.name}</option>`).join('');
  }
  openModal('modal-oauth-mapping');
}

function submitOAuthMapping() {
  const nameInput = document.getElementById('oauth-mapping-display-name');
  const provider = document.getElementById('oauth-mapping-provider');
  const externalIdInput = document.getElementById('oauth-mapping-external-id');
  const providerName = provider?.value || '';
  closeModal('modal-oauth-mapping');

  if (_activeServiceAccount) {
    getSaOauthMappings(_activeServiceAccount).push({
      name: nameInput?.value.trim() || 'Name',
      externalId: externalIdInput?.value.trim() || '<Sub>',
      provider: providerName,
    });
    updateSaOauthMappingEmptyState();
    updateAiHubAccountLinks();
  } else if (_memberMappingTarget) {
    getMemberOauthMappings(_memberMappingTarget).push({
      name: nameInput?.value.trim() || 'Name',
      externalId: externalIdInput?.value.trim() || '<Sub>',
      provider: providerName,
    });
    renderMemberOauthMappings(_memberMappingTarget);
    _memberMappingTarget = null;
  }

  const desc = document.getElementById('oauth-mapping-success-desc');
  if (desc) desc.innerHTML = `This account can now authorize API requests through the '${providerName.toUpperCase()}' OAuth provider.`;
  openModal('modal-oauth-mapping-success');
}

function openSamlEdit() {
  _samlEditMode = true;
  document.getElementById('saml-modal-title').textContent = 'Edit SAML configuration';
  // Go straight to step 2
  document.getElementById('saml-step-1').style.display = 'none';
  document.getElementById('saml-step-2').style.display = 'flex';
  // Swap Back → Cancel in edit mode
  document.getElementById('saml-back-btn').style.display = 'none';
  document.getElementById('saml-cancel-btn').style.display = '';
  // Disable save, show tooltip on hover
  const btn = document.getElementById('saml-save-btn');
  btn.textContent = 'Save changes';
  btn.disabled = true;
  document.getElementById('saml-save-tooltip').style.display = '';
  openModal('modal-saml');
}

function onSamlFieldEdit() {
  if (!_samlEditMode) return;
  const btn = document.getElementById('saml-save-btn');
  btn.disabled = false;
  document.getElementById('saml-save-tooltip').style.display = 'none';
}

function _resetSamlModal() {
  _samlEditMode = false;
  document.getElementById('saml-modal-title').textContent = 'Add SAML configuration';
  document.getElementById('saml-back-btn').style.display = '';
  document.getElementById('saml-cancel-btn').style.display = 'none';
  const btn = document.getElementById('saml-save-btn');
  btn.textContent = 'Save';
  btn.disabled = false;
  document.getElementById('saml-save-tooltip').style.display = 'none';
}

function _resetOidcModal() {
  ['oidc-display-name', 'oidc-client-id', 'oidc-client-secret', 'oidc-discovery-url', 'oidc-authorization-url', 'oidc-token-url'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['oidc-display-name-err', 'oidc-client-id-err', 'oidc-discovery-url-err'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('#oidc-step-2 .input-error').forEach(el => el.classList.remove('input-error'));
  const extraUrls = document.getElementById('oidc-extra-urls');
  if (extraUrls) extraUrls.style.display = 'none';
}
function closeModal(id, keepOverflowLock) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
    if (!keepOverflowLock) document.body.style.overflow = '';
    const step1 = modal.querySelector('[id$="-step-1"]');
    const step2 = modal.querySelector('[id$="-step-2"]');
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
    if (id === 'modal-saml') _resetSamlModal();
    if (id === 'modal-oidc') _resetOidcModal();
    if (id === 'modal-add-sa') {
      resetAddServiceAccountForm();
      if (!keepOverflowLock) _pendingServiceAccount = null;
    }
    if (id === 'modal-add-sa-token') {
      if (_saTokenModalMode === 'onboarding') _pendingServiceAccount = null;
      resetAddSaTokenModal();
    }
    if (id === 'modal-add-multiple-groups') resetBulkGroupsModal();
    if (id === 'modal-add-group') resetAddGroupModal();
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop').forEach(m => { m.style.display = 'none'; document.body.style.overflow = ''; }); });

// Tab switching (scoped to active page)
document.querySelectorAll('.tab-bar').forEach(bar => {
  bar.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      const page = tab.closest('.settings-page');
      page.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      page.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = page.querySelector('#tab-' + tabId);
      if (panel) panel.classList.add('active');
      if (tabId !== 'members') closeMemberDetail();
      if (tabId !== 'service-accounts') closeServiceAccountDetail();
      if (tabId !== 'groups') closeGroupDetail();
    });
  });
});

// SAML metadata URL input — reveal extracted fields
function onSamlUrlInput(input) {
  const hasValue = input.value.trim().length > 0;
  const clearBtn = document.getElementById('saml-url-clear');
  const extracted = document.getElementById('saml-extracted');
  const attrDefault = document.getElementById('saml-attr-default');
  const attrInputs = document.getElementById('saml-attr-inputs');
  const attrUrl = document.getElementById('saml-attr-url');
  clearBtn.style.display = hasValue ? 'flex' : 'none';
  extracted.style.display = hasValue ? 'block' : 'none';
  attrUrl.style.display = 'none';
}
function clearSamlUrl() {
  const input = document.getElementById('saml-metadata-url');
  input.value = '';
  onSamlUrlInput(input);
}

// SAML XML file upload
function onSamlXmlUpload(input) {
  if (!input.files || !input.files[0]) return;
  document.getElementById('saml-xml-filename').textContent = input.files[0].name;
  document.getElementById('saml-xml-upload-btn').style.display = 'none';
  document.getElementById('saml-xml-chip').style.display = 'block';
  document.getElementById('saml-xml-extracted').style.display = 'block';
  document.getElementById('saml-xml-attr').style.display = 'none';
}
function clearSamlXml() {
  document.getElementById('saml-xml-file-input').value = '';
  document.getElementById('saml-xml-upload-btn').style.display = 'block';
  document.getElementById('saml-xml-chip').style.display = 'none';
  document.getElementById('saml-xml-extracted').style.display = 'none';
  document.getElementById('saml-xml-attr').style.display = 'none';
  document.getElementById('saml-attr-default').style.display = 'block';
  document.getElementById('saml-attr-inputs').style.display = 'block';
}

// SAML configuration method switcher
function toggleConfigMethod(val) {
  // Reset dependent states first
  if (val !== 'xml') clearSamlXml();
  if (val !== 'url') { document.getElementById('saml-metadata-url').value = ''; onSamlUrlInput(document.getElementById('saml-metadata-url')); }
  // Show/hide method panels
  document.getElementById('saml-method-url').style.display = val === 'url' ? 'block' : 'none';
  document.getElementById('saml-method-xml').style.display = val === 'xml' ? 'block' : 'none';
  document.getElementById('saml-method-xmlpaste').style.display = val === 'xmlpaste' ? 'block' : 'none';
  document.getElementById('saml-method-manual').style.display = val === 'manual' ? 'block' : 'none';
  // Always show attribute mapping regardless of config method
  document.getElementById('saml-attr-default').style.display = 'block';
  document.getElementById('saml-attr-inputs').style.display = 'block';
}

// Advanced settings expand/collapse
function toggleAdvancedSettings() {
  const panel = document.getElementById('saml-advanced');
  const chevron = document.getElementById('advanced-chevron');
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  // chevron: right when closed, down when open
  chevron.innerHTML = isOpen
    ? '<path d="M5 3.5L8.5 7 5 10.5" stroke="#374151" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<path d="M3.5 5L7 8.5 10.5 5" stroke="#374151" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
}

// Custom select (Identity provider)
function positionCustomSelectDropdown(dropdown, trigger) {
  if (!dropdown.classList.contains('is-portaled')) {
    document.body.appendChild(dropdown);
    dropdown.classList.add('is-portaled');
    dropdown.style.position = 'fixed';
    dropdown.style.zIndex = '1100';
  }
  const rect = trigger.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + 4}px`;
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.width = `${rect.width}px`;
}

function toggleCustomSelect(id) {
  const sel = document.getElementById(id);
  let dropdown = document.querySelector(`.custom-select-dropdown[data-select-id="${id}"]`);
  if (!dropdown) {
    dropdown = sel.querySelector('.custom-select-dropdown');
    if (dropdown) dropdown.dataset.selectId = id;
  }
  const trigger = sel.querySelector('.custom-select-trigger');
  if (!dropdown || !trigger) return;
  const isOpen = dropdown.style.display !== 'none';
  if (isOpen) {
    dropdown.style.display = 'none';
    trigger.classList.remove('open');
  } else {
    positionCustomSelectDropdown(dropdown, trigger);
    dropdown.style.display = 'block';
    trigger.classList.add('open');
  }
}
function selectOidcIdp(option, name) {
  const sel = document.getElementById('oidc-idp-select');
  const valueEl = document.getElementById('oidc-idp-value');
  const dropdown = option.closest('.custom-select-dropdown');
  const trigger = sel.querySelector('.custom-select-trigger');
  valueEl.innerHTML = option.innerHTML;
  sel.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
  option.classList.add('selected');
  dropdown.style.display = 'none';
  trigger.classList.remove('open');
  applyOidcIdpLabels(name);

  const lockedIcon = document.getElementById('oidc-idp-locked-icon');
  const lockedName = document.getElementById('oidc-idp-locked-name');
  const img = option.querySelector('img');
  if (lockedIcon && img) lockedIcon.src = img.src;
  if (lockedName) lockedName.textContent = name;
}
function selectOAuthProvider(option) {
  const sel = document.getElementById('oauth-provider-select');
  const valueEl = document.getElementById('oauth-provider-value');
  const dropdown = option.closest('.custom-select-dropdown');
  const trigger = sel.querySelector('.custom-select-trigger');
  valueEl.innerHTML = option.innerHTML;
  sel.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
  option.classList.add('selected');
  dropdown.style.display = 'none';
  trigger.classList.remove('open');
}
function toggleOidcSecret() {
  const input = document.getElementById('oidc-client-secret');
  input.type = input.type === 'password' ? 'text' : 'password';
}
let _samlConfigMethod = 'url';
function selectConfigMethod(option, val, label) {
  _samlConfigMethod = val;
  const sel = document.getElementById('config-method-select');
  document.getElementById('config-method-value').textContent = label;
  option.closest('.custom-select-dropdown').querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
  option.classList.add('selected');
  option.closest('.custom-select-dropdown').style.display = 'none';
  sel.querySelector('.custom-select-trigger').classList.remove('open');
  toggleConfigMethod(val);
}
function onOidcDiscoveryInput(input) {
  const value = input.value.trim();
  const extraUrls = document.getElementById('oidc-extra-urls');
  const authInput = document.getElementById('oidc-authorization-url');
  const tokenInput = document.getElementById('oidc-token-url');
  extraUrls.style.display = value ? 'block' : 'none';

  if (!value) {
    if (authInput) authInput.value = '';
    if (tokenInput) tokenInput.value = '';
    return;
  }

  let origin = value.replace(/\/\.well-known\/openid-configuration\/?$/, '');
  try { origin = new URL(value).origin; } catch (e) { /* not a full URL yet, use trimmed string */ }
  if (authInput) authInput.value = `${origin}/oauth2/v1/authorize`;
  if (tokenInput) tokenInput.value = `${origin}/oauth2/v1/token`;
}
// ── IdP-specific field terminology ────────────────────────────
const SAML_FIELD_LABELS = {
  'AD FS':           { metadataUrl: 'Federation Metadata URL', signOnUrl: 'Sign on URL', entityId: 'Identifier', x509: 'X.509 certificate', appLabel: 'Display name', spEntityId: 'Relying party identifier', acsUrl: 'Assertion Consumer Service (POST) URL' },
  'Microsoft Entra': { metadataUrl: 'App Federation Metadata URL', signOnUrl: 'Reply URL (ACS URL)', entityId: 'Identifier (Entity ID)', x509: 'SAML signing certificate', appLabel: 'Name', spEntityId: 'Identifier (Entity ID)', acsUrl: 'Reply URL (ACS URL)' },
  'One Login':       { metadataUrl: 'Metadata URL', signOnUrl: 'SAML 2.0 Endpoint (HTTP)', entityId: 'Issuer URL', x509: 'X.509 Certificate', appLabel: 'Display Name', spEntityId: 'Audience (Entity ID)', acsUrl: 'ACS (Consumer) URL' },
  'Auth0':           { metadataUrl: 'Metadata URL', signOnUrl: 'Identity Provider Login URL', entityId: 'SAML Issuer', x509: 'X.509 Signing Certificate', appLabel: 'App name', spEntityId: 'Entity ID / Audience', acsUrl: 'Application Callback URL' },
  'JumpCloud':       { metadataUrl: 'Metadata URL', signOnUrl: 'IDP URL', entityId: 'IDP Entity ID', x509: 'IdP Certificate', appLabel: 'Display Label', spEntityId: 'SP Entity ID', acsUrl: 'ACS URL' },
  'Okta':            { metadataUrl: 'Metadata URL', signOnUrl: 'Single sign-on URL', entityId: 'Identity Provider Issuer', x509: 'Signature Certificate', appLabel: 'App label', spEntityId: 'Audience URI (SP Entity ID)', acsUrl: 'Single sign-on URL' },
  'PingFederate':    { metadataUrl: 'Metadata URL', signOnUrl: 'SSO Service URL', entityId: 'Entity ID', x509: 'Signing Certificate', appLabel: 'Connection Name', spEntityId: "Entity ID (Partner's Entity ID)", acsUrl: 'ACS URL' },
};

const OIDC_FIELD_LABELS = {
  'AD FS':           { clientId: 'Client ID', clientSecret: 'Client Secret', discoveryUrl: 'Discovery URL', redirectUri: 'Redirect URI', scopes: 'Scopes' },
  'Microsoft Entra': { clientId: 'Application (Client) ID', clientSecret: 'Client secret', discoveryUrl: 'Discovery endpoint', redirectUri: 'Redirect URI (Reply URL)', scopes: 'Requested/delegated permissions' },
  'One Login':       { clientId: 'Client ID', clientSecret: 'Client Secret', discoveryUrl: 'OpenID issuer URL', redirectUri: 'Redirect URI', scopes: 'Scopes' },
  'Auth0':           { clientId: 'Client ID', clientSecret: 'Client Secret', discoveryUrl: 'Domain', redirectUri: 'Allowed Callback URLs', scopes: 'Permissions/Scopes' },
  'JumpCloud':       { clientId: 'Client ID', clientSecret: 'Client Secret', discoveryUrl: 'Discovery URL', redirectUri: 'Redirect URIs', scopes: 'Scopes' },
  'Okta':            { clientId: 'Client ID', clientSecret: 'Client Secret', discoveryUrl: 'Discovery Endpoint', redirectUri: 'Sign-in redirect URI', scopes: 'Requested scopes' },
  'PingFederate':    { clientId: 'Client ID', clientSecret: 'Client Secret', discoveryUrl: 'Well-Known URL', redirectUri: 'Redirect URIs', scopes: 'Requested Scopes' },
};

function applySamlIdpLabels(name) {
  const labels = SAML_FIELD_LABELS[name] || SAML_FIELD_LABELS['AD FS'];
  document.querySelectorAll('#modal-saml .fl-metadata-url').forEach(el => el.textContent = labels.metadataUrl);
  document.querySelectorAll('#modal-saml .fl-signon').forEach(el => el.textContent = labels.signOnUrl);
  document.querySelectorAll('#modal-saml .fl-entityid').forEach(el => el.textContent = labels.entityId);
  document.querySelectorAll('#modal-saml .fl-x509').forEach(el => el.textContent = labels.x509);
  document.querySelectorAll('#modal-saml .fl-app-label').forEach(el => el.textContent = labels.appLabel);
  document.querySelectorAll('#modal-saml .fl-sp-entity-id').forEach(el => el.textContent = labels.spEntityId);
  document.querySelectorAll('#modal-saml .fl-acs-url').forEach(el => el.textContent = labels.acsUrl);
}

function applyOidcIdpLabels(name) {
  const labels = OIDC_FIELD_LABELS[name] || OIDC_FIELD_LABELS['Okta'];
  document.querySelectorAll('#modal-oidc .fl-client-id').forEach(el => el.textContent = labels.clientId);
  document.querySelectorAll('#modal-oidc .fl-client-secret').forEach(el => el.textContent = labels.clientSecret);
  document.querySelectorAll('#modal-oidc .fl-discovery-url').forEach(el => el.textContent = labels.discoveryUrl);
  document.querySelectorAll('#modal-oidc .fl-redirect-uri').forEach(el => el.textContent = labels.redirectUri);
  document.querySelectorAll('#modal-oidc .fl-scopes').forEach(el => el.textContent = labels.scopes);
}

function selectIdp(option, name) {
  const sel = document.getElementById('idp-select');
  const valueEl = document.getElementById('idp-value');
  const dropdown = option.closest('.custom-select-dropdown');
  const trigger = sel.querySelector('.custom-select-trigger');
  // Update displayed value (copy icon+text from clicked option)
  valueEl.innerHTML = option.innerHTML;
  // Mark selected
  sel.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
  option.classList.add('selected');
  dropdown.style.display = 'none';
  trigger.classList.remove('open');
  applySamlIdpLabels(name);

  const lockedIcon = document.getElementById('idp-locked-icon');
  const lockedName = document.getElementById('idp-locked-name');
  const img = option.querySelector('img');
  if (lockedIcon && img) lockedIcon.src = img.src;
  if (lockedName) lockedName.textContent = name;
}
document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select')) {
    document.querySelectorAll('.custom-select-dropdown').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('open'));
  }
  if (!e.target.closest('[id^="bulk-source-wrap-"]') && !e.target.closest('[id^="bulk-source-menu-"]')) closeBulkSourceMenus();
  if (!e.target.closest('[id^="bulk-idp-wrap-"]') && !e.target.closest('[id^="bulk-idp-menu-"]')) closeBulkIdpMenus();
  if (!e.target.closest('#add-group-idp-select')) closeAddGroupIdpMenu();
  if (!e.target.closest('.avatar-menu')) {
    const dd = document.getElementById('avatar-dropdown');
    if (dd) dd.style.display = 'none';
  }
});

function toggleAvatarMenu() {
  const dd = document.getElementById('avatar-dropdown');
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

// Toggle switches
document.querySelectorAll('.toggle').forEach(toggle => {
  if (toggle.id === 'sso-email-toggle') return;
  toggle.addEventListener('click', () => {
    if (toggle.id === 'add-group-idp-toggle') {
      const isOn = toggle.classList.toggle('on');
      toggle.setAttribute('aria-checked', isOn);
      syncAddGroupIdpMappingState();
      return;
    }
    const isOn = toggle.classList.toggle('on');
    toggle.setAttribute('aria-checked', isOn);
  });
});

// Form validation helpers
function showFieldError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('input-error');
  if (err) err.style.display = 'flex';
}

function clearFieldError(inputOrId) {
  const input = typeof inputOrId === 'string' ? document.getElementById(inputOrId) : inputOrId;
  if (!input) return;
  input.classList.remove('input-error');
  const err = document.getElementById(input.id + '-err');
  if (err) err.style.display = 'none';
}

function validateSamlSave() {
  const method = _samlConfigMethod;
  let valid = true;

  // Display name always required
  const displayName = document.getElementById('saml-display-name');
  if (!displayName.value.trim()) {
    showFieldError('saml-display-name', 'saml-display-name-err');
    valid = false;
  }

  // Method-specific required fields
  if (method === 'url') {
    const url = document.getElementById('saml-metadata-url');
    if (!url.value.trim()) {
      showFieldError('saml-metadata-url', 'saml-metadata-url-err');
      valid = false;
    }
  } else if (method === 'manual') {
    const signOn = document.getElementById('saml-sign-on-url');
    const entityId = document.getElementById('saml-entity-id');
    const cert = document.getElementById('saml-x509');
    if (!signOn.value.trim()) { showFieldError('saml-sign-on-url', 'saml-sign-on-url-err'); valid = false; }
    if (!entityId.value.trim()) { showFieldError('saml-entity-id', 'saml-entity-id-err'); valid = false; }
    if (!cert.value.trim()) { showFieldError('saml-x509', 'saml-x509-err'); valid = false; }
  }

  if (!valid) {
    // Scroll to first error
    const firstErr = document.querySelector('#saml-step-2 .input-error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const idpImg = document.querySelector('#idp-value img');
  _pendingSsoRow = {
    name: displayName.value.trim(),
    iconSrc: idpImg ? idpImg.getAttribute('src') : 'illustration/Okta.png',
    type: 'SAML',
    editMode: _samlEditMode,
  };

  closeModal('modal-saml');
  startSsoTest();
}

function validateOidcSave() {
  let valid = true;

  const displayName = document.getElementById('oidc-display-name');
  if (!displayName.value.trim()) {
    showFieldError('oidc-display-name', 'oidc-display-name-err');
    valid = false;
  }

  const clientId = document.getElementById('oidc-client-id');
  if (!clientId.value.trim()) {
    showFieldError('oidc-client-id', 'oidc-client-id-err');
    valid = false;
  }

  const discoveryUrl = document.getElementById('oidc-discovery-url');
  if (!discoveryUrl.value.trim()) {
    showFieldError('oidc-discovery-url', 'oidc-discovery-url-err');
    valid = false;
  }

  if (!valid) {
    const firstErr = document.querySelector('#oidc-step-2 .input-error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const idpImg = document.getElementById('oidc-idp-locked-icon');
  _pendingSsoRow = {
    name: displayName.value.trim(),
    iconSrc: idpImg ? idpImg.getAttribute('src') : 'illustration/Okta.png',
    type: 'OIDC',
    editMode: false,
  };

  closeModal('modal-oidc');
  startSsoTest();
}

var _pendingSsoRow = null;

function startSsoTest() {
  openModal('modal-sso-test');
  clearTimeout(window._ssoTestTimer);
  window._ssoTestTimer = setTimeout(function() {
    closeModal('modal-sso-test');
    commitPendingSsoRow();
    openModal('modal-sso-success');
  }, 2500);
}

function commitPendingSsoRow() {
  if (!_pendingSsoRow) return;
  const body = document.getElementById('sso-table-body');
  if (!body) { _pendingSsoRow = null; return; }

  if (_pendingSsoRow.editMode && _ssoActionRow) {
    const row = _ssoActionRow;
    row.querySelector('.col-main').innerHTML = `<img src="${_pendingSsoRow.iconSrc}" width="20" height="20" style="object-fit:contain;flex-shrink:0;" />${_pendingSsoRow.name}`;
    row.querySelector('.col-type').textContent = _pendingSsoRow.type;
  } else {
    const idx = body.querySelectorAll('.sso-row').length;
    body.insertAdjacentHTML('beforeend', `
      <div class="sso-row" data-status="enabled">
        <div class="col-main">
          <img src="${_pendingSsoRow.iconSrc}" width="20" height="20" style="object-fit:contain;flex-shrink:0;" />
          ${_pendingSsoRow.name}
        </div>
        <div class="col-status"><span class="pill pill--success"><span class="pill__text">ENABLED</span></span></div>
        <div class="col-type">${_pendingSsoRow.type}</div>
        <div class="sso-row-actions">
          <button class="row-action-btn" title="Edit" onclick="openSamlEdit()"><span data-icon="edit2" data-size="16"></span></button>
          <div class="sso-more-wrap">
            <button class="row-action-btn" title="More" onclick="toggleSsoMenu(this)"><span data-icon="overflow2" data-size="16"></span></button>
            <div class="sso-context-menu" style="display:none;">
              <button class="sso-menu-item" onclick="toggleSsoStatus(this)">Disable</button>
              <div class="sso-menu-divider"></div>
              <button class="sso-menu-item sso-menu-delete" onclick="deleteSsoRow(this)">Delete</button>
            </div>
          </div>
        </div>
      </div>`);
    initIcons();
  }
  _pendingSsoRow = null;
  updateSsoToggleState();
}

// SSO row context menu
var _ssoActionRow = null;

function toggleSsoMenu(btn) {
  const menu = btn.nextElementSibling;
  const isOpen = menu.style.display !== 'none';
  document.querySelectorAll('.sso-context-menu').forEach(m => m.style.display = 'none');
  menu.style.display = isOpen ? 'none' : 'block';
}

function getSsoRowName(row) {
  return row.querySelector('.col-main')?.textContent.trim() || '';
}

function toggleSsoStatus(btn) {
  _ssoActionRow = btn.closest('.sso-row');
  btn.closest('.sso-context-menu').style.display = 'none';
  const isEnabled = _ssoActionRow.dataset.status === 'enabled';
  const name = getSsoRowName(_ssoActionRow);
  if (isEnabled) {
    const el = document.getElementById('sso-disable-config-name');
    if (el) el.textContent = name;
    openModal('modal-sso-disable');
  } else {
    const el = document.getElementById('sso-enable-config-name');
    if (el) el.textContent = name;
    openModal('modal-sso-enable');
  }
}

function deleteSsoRow(btn) {
  _ssoActionRow = btn.closest('.sso-row');
  btn.closest('.sso-context-menu').style.display = 'none';
  const name = getSsoRowName(_ssoActionRow);
  const nameEl = document.getElementById('sso-delete-config-name');
  const labelEl = document.getElementById('sso-delete-confirm-label');
  const input = document.getElementById('sso-delete-name-input');
  if (nameEl) nameEl.textContent = name;
  if (labelEl) labelEl.textContent = name;
  if (input) input.value = '';
  updateSsoDeleteButton();
  openModal('modal-sso-delete');
}

function updateSsoDeleteButton() {
  const input = document.getElementById('sso-delete-name-input');
  const btn = document.getElementById('sso-delete-confirm-btn');
  if (!input || !btn || !_ssoActionRow) return;
  btn.disabled = input.value.trim() !== getSsoRowName(_ssoActionRow);
}

function confirmSsoAction(action) {
  if (!_ssoActionRow) return;
  if (action === 'disable') {
    _ssoActionRow.dataset.status = 'disabled';
    _ssoActionRow.querySelector('.col-status').innerHTML = ssoStatusPillHtml(false);
    _ssoActionRow.querySelector('.sso-menu-item:first-child').textContent = 'Enable';
    closeModal('modal-sso-disable');
  } else if (action === 'enable') {
    _ssoActionRow.dataset.status = 'enabled';
    _ssoActionRow.querySelector('.col-status').innerHTML = ssoStatusPillHtml(true);
    _ssoActionRow.querySelector('.sso-menu-item:first-child').textContent = 'Disable';
    closeModal('modal-sso-enable');
  } else if (action === 'delete') {
    const input = document.getElementById('sso-delete-name-input');
    if (!input || input.value.trim() !== getSsoRowName(_ssoActionRow)) return;
    _ssoActionRow.remove();
    closeModal('modal-sso-delete');
  }
  _ssoActionRow = null;
  updateSsoToggleState();
}

document.addEventListener('click', e => {
  if (!e.target.closest('.sso-more-wrap')) {
    document.querySelectorAll('.sso-context-menu').forEach(m => m.style.display = 'none');
  }
});

// Logout page
function showLogoutPage() {
  document.getElementById('logout-page').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  carouselGo(1); // start on slide 2 (Enterprise Ready) to match screenshot
}
function hideLogoutPage() {
  document.getElementById('logout-page').style.display = 'none';
  document.body.style.overflow = '';
}
function closeSigninModal(e) {
  if (e.target === document.getElementById('modal-signin')) {
    document.getElementById('modal-signin').style.display = 'none';
  }
}

// Carousel
var CAROUSEL_SLIDES = [
  {
    title: 'Get started with AI Hub',
    desc: 'Analyze documents and automate your workflows in minutes to transform the way your organization works with data.',
    cta: 'Learn more',
    image: 'illustration/carousel/get-started.png',
  },
  {
    title: 'Chatbots for Reliable Insights',
    desc: 'Create chatbots from your organization\'s unstructured knowledge sources to get fast, reliable answers to your most important questions.',
    cta: 'Explore Chatbots',
    image: 'illustration/carousel/chatbots.png',
  },
  {
    title: 'Enterprise Ready',
    desc: 'An AI Hub Enterprise subscription lets you orchestrate workflows for large operations teams and automate your most advanced use cases. Leverage advanced security features, analytics, and more.',
    cta: 'Learn more',
    image: 'illustration/carousel/enterprise.png',
  },
  {
    title: 'Python SDK',
    desc: 'Use the AI Hub Python SDK to programmatically access platform capabilities and integrate AI Hub into your applications.',
    cta: 'View SDK docs',
    image: 'illustration/carousel/python-sdk.png',
  },
  {
    title: 'Scalable',
    desc: 'Deploy AI Hub at scale with enterprise-grade infrastructure designed for high-volume document processing across your organization.',
    cta: 'Learn more',
    image: 'illustration/carousel/scalable.png',
  },
];

var carouselIndex = 1;
var CAROUSEL_COUNT = CAROUSEL_SLIDES.length;

function carouselSlideHtml(slide, index) {
  return `
    <div class="carousel-slide" data-slide="${index}">
      <div class="carousel-card">
        <div class="carousel-card-text">
          <div class="carousel-card-title">${slide.title}</div>
          <p class="carousel-card-desc">${slide.desc}</p>
          <a href="javascript:void(0)" class="carousel-learn-more">${slide.cta} <span data-icon="chevron-right" data-size="14" data-color="#374151"></span></a>
        </div>
        <div class="carousel-card-illustration">
          <img src="${slide.image}" alt="" />
        </div>
      </div>
    </div>`;
}

function renderCarouselStages() {
  var slidesHtml = CAROUSEL_SLIDES.map(carouselSlideHtml).join('');
  var dotsHtml = CAROUSEL_SLIDES.map(function(_, i) {
    return '<span class="carousel-dot" onclick="carouselGo(' + i + ')"></span>';
  }).join('');

  ['carousel-track', 'hub-carousel-track'].forEach(function(id) {
    var stage = document.getElementById(id);
    if (stage) stage.innerHTML = slidesHtml;
  });

  document.querySelectorAll('.carousel-dots').forEach(function(container) {
    container.innerHTML = dotsHtml;
  });

  initIcons();
}

function getCircularOffset(index, activeIndex, count) {
  var offset = index - activeIndex;
  while (offset > count / 2) offset -= count;
  while (offset < -count / 2) offset += count;
  return offset;
}

function getCarouselTransform(offset, stageWidth) {
  var w = stageWidth || 800;
  var scaleStep = 0.7;
  if (offset === 0) return { x: 0, scale: 1, opacity: 1, z: 10 };
  var sign = offset > 0 ? 1 : -1;
  var distance = Math.abs(offset);
  var scale = Math.pow(scaleStep, distance);
  var step1 = Math.max(150, Math.min(198, w * 0.22));
  var step2 = Math.max(238, Math.min(295, w * 0.34));
  if (distance === 1) return { x: sign * step1, scale: scale, opacity: 1, z: 9 };
  if (distance === 2) return { x: sign * step2, scale: scale, opacity: 0.95, z: 8 };
  return { x: sign * (step2 + 36), scale: Math.pow(scaleStep, distance), opacity: 0.85, z: 7 };
}

function carouselApplyStage(stageId) {
  var stage = document.getElementById(stageId);
  if (!stage) return;
  var stageWidth = stage.clientWidth;
  stage.querySelectorAll('.carousel-slide').forEach(function(slide, i) {
    var offset = getCircularOffset(i, carouselIndex, CAROUSEL_COUNT);
    var t = getCarouselTransform(offset, stageWidth);
    slide.style.zIndex = String(t.z);
    slide.style.opacity = String(t.opacity);
    slide.style.pointerEvents = offset === 0 ? 'auto' : 'auto';
    slide.style.transform = 'translate(calc(-50% + ' + t.x + 'px), -50%) scale(' + t.scale + ')';
    slide.classList.toggle('is-active', offset === 0);
    slide.onclick = function() {
      if (i !== carouselIndex) carouselGo(i);
    };
  });
}

function carouselGo(idx) {
  carouselIndex = ((idx % CAROUSEL_COUNT) + CAROUSEL_COUNT) % CAROUSEL_COUNT;
  carouselApplyStage('carousel-track');
  carouselApplyStage('hub-carousel-track');
  document.querySelectorAll('.carousel-dots').forEach(function(container) {
    container.querySelectorAll('.carousel-dot').forEach(function(dot, i) {
      dot.classList.toggle('active', i === carouselIndex);
    });
  });
  if (carouselAutoplayTimer) startCarouselAutoplay();
}

var carouselAutoplayTimer = null;

function startCarouselAutoplay() {
  stopCarouselAutoplay();
  carouselAutoplayTimer = setInterval(function() {
    carouselNext();
  }, 6000);
}

function stopCarouselAutoplay() {
  if (carouselAutoplayTimer) {
    clearInterval(carouselAutoplayTimer);
    carouselAutoplayTimer = null;
  }
}

window.addEventListener('resize', function() {
  carouselApplyStage('carousel-track');
  carouselApplyStage('hub-carousel-track');
});

function carouselPrev() {
  carouselGo(carouselIndex - 1);
}

function carouselNext() {
  carouselGo(carouselIndex + 1);
}

// ── Hub page ────────────────────────────────────────────────
function showHubPage() {
  var page = document.getElementById('hub-page');
  page.style.display = 'flex';
  var h = new Date().getHours();
  var g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('hub-greeting').textContent = g + ', Lokeshkumar';
  carouselGo(1);
  startCarouselAutoplay();
}
function toggleHubAvatarMenu() {
  var d = document.getElementById('hub-avatar-dropdown');
  d.style.display = d.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('#hub-page .topnav-right')) {
    var d = document.getElementById('hub-avatar-dropdown');
    if (d) d.style.display = 'none';
  }
});
