const ID_BASE_RE = /^\d{6}_\d{2}$/;
const ID_REV_RE = /^\d{6}_\d{2}\.\d{2}$/;

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.BITA_STORE.theme = theme;
  
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    // Show what the button will switch TO (opposite of current)
    toggleBtn.textContent = theme === "light" ? "🌙 Dark" : "☀️ Light";
  }
}

function initTheme() {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem('bita_theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Use system preference
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }
}

function bindIncidentFields() {
  const s = window.BITA_STORE;
  const ids = [
    "incidentId", "incidentName", "incidentSeverity", "startTime",
    "nextUpdateTime", "impactSummary", "icName", "contact",
    "customersAffected", "dollarImpactPerHour", "currentStatus",
    "rootCauseStatus", "eta", "linkStatusPage", "jurisdiction", "ticketId"
  ];
  const mapKeys = [
    "incident_id", "name", "severity", "start_time",
    "next_update_time", "impact_summary", "ic_name", "contact",
    "customers_affected", "dollar_impact_per_hour", "current_status",
    "root_cause_status", "eta", "link_status_page", "jurisdiction", "ticket_id"
  ];

  ids.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.addEventListener("input", () => {
      s.incident[mapKeys[idx]] = el.value;
      if (id === "incidentId") validateIncidentId(el.value);
    });
  });
}

function validateIncidentId(val) {
  const el = document.getElementById("incidentId");
  if (!el) return false;
  
  const ok = ID_BASE_RE.test(val) || ID_REV_RE.test(val) || val === "";
  el.style.borderColor = ok ? "" : "var(--danger)";
  el.title = ok ? "" : "Use YYYYMM_NN or YYYYMM_NN.RR (e.g., 202510_01 or 202510_01.00)";
  return ok;
}

function populateTemplateList() {
  const list = document.getElementById("templateList");
  const audFilter = document.getElementById("templateAudienceFilter");
  const sevFilter = document.getElementById("templateSeverityFilter");
  
  if (!list) return;

  function render() {
    list.innerHTML = "";
    const items = window.BITA_STORE.templates.communications.filter(t => {
      const a = !audFilter?.value || t.audience === audFilter.value;
      const b = !sevFilter?.value || (t.severity || []).includes(sevFilter.value);
      return a && b;
    });

    for (const t of items) {
      const li = document.createElement("li");
      const left = document.createElement("div");
      const right = document.createElement("div");

      left.innerHTML = `<strong>${t.title}</strong><div class="meta">${t.audience} • ${t.severity.join(", ")} • v${t.version}</div>`;
      right.innerHTML = `<button class="btn small">Select</button>`;

      li.appendChild(left);
      li.appendChild(right);

      right.querySelector("button").addEventListener("click", () => selectTemplate(t));
      list.appendChild(li);
    }
  }

  audFilter?.addEventListener("change", render);
  sevFilter?.addEventListener("change", render);
  render();
}

function selectTemplate(t) {
  window.BITA_STORE.selectedTemplate = t;
  
  const metaEl = document.getElementById("selectedTemplateMeta");
  if (metaEl) {
    metaEl.textContent = `${t.title} • ${t.audience} • S: ${t.severity.join(", ")} • v${t.version}`;
  }
  
  const rawEl = document.getElementById("templateRaw");
  if (rawEl) {
    rawEl.value = t.body;
  }
  
  buildTokenForm(t.body, t.tokens_required || []);
}

function buildTokenForm(text, required = []) {
  const form = document.getElementById("tokenForm");
  if (!form) return;
  
  form.innerHTML = "";
  const tokens = window.BITA_RENDER.detectTokens(text);
  const seen = new Set();

  const addField = (tok) => {
    if (seen.has(tok)) return;
    seen.add(tok);

    const wrap = document.createElement("div");
    wrap.className = "token-field";

    const label = document.createElement("label");
    label.textContent = `${tok}${required.includes(tok) ? " *" : ""}`;

    const isLong = /SUMMARY|NOTICE|STEPS|AFFECTED|ROOT_CAUSE|IMPACT/i.test(tok);
    const input = isLong ? document.createElement("textarea") : document.createElement("input");
    input.rows = isLong ? 3 : undefined;

    const map = window.BITA_RENDER.mapIncidentToTokens(window.BITA_STORE.incident);
    input.value = map[tok] || "";
    input.dataset.token = tok;

    wrap.appendChild(label);
    wrap.appendChild(input);
    form.appendChild(wrap);
  };

  tokens.forEach(addField);
}

function buildRenderedOutput() {
  const t = window.BITA_STORE.selectedTemplate;
  if (!t) return;

  const rawEl = document.getElementById("templateRaw");
  const raw = rawEl ? rawEl.value : t.body;

  const form = document.getElementById("tokenForm");
  const fields = form ? form.querySelectorAll("[data-token]") : [];

  const map = window.BITA_RENDER.mapIncidentToTokens(window.BITA_STORE.incident);
  fields.forEach(el => {
    map[el.dataset.token] = el.value;
  });

  const jur = Array.from(document.querySelectorAll(".jur-module:checked")).map(el => el.value);
  const rendered = window.BITA_RENDER.buildRenderedWithMetadata(
    raw,
    window.BITA_STORE.incident,
    t,
    jur
  );

  window.BITA_STORE.rendered.text = rendered;

  const renderedEl = document.getElementById("renderedText");
  if (renderedEl) {
    renderedEl.textContent = rendered;
  }

  const preview = document.getElementById("printPreview");
  if (preview) {
    preview.innerHTML = "";
    rendered
      .replace(/-----BEGIN ITA METADATA-----[\s\S]*-----END ITA METADATA-----/g, "")
      .split(/\n\n+/)
      .forEach(block => {
        const p = document.createElement("p");
        p.textContent = block.trim();
        if (p.textContent) preview.appendChild(p);
      });
  }
}

window.BITA_UI = {
  setTheme,
  initTheme,
  bindIncidentFields,
  populateTemplateList,
  selectTemplate,
  buildTokenForm,
  buildRenderedOutput,
  validateIncidentId
};