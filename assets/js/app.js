// app.js - Main Application Initialization
(function() {
  const { setTheme, initTheme, bindIncidentFields, populateTemplateList, buildRenderedOutput, validateIncidentId } = window.BITA_UI;

  document.addEventListener("DOMContentLoaded", () => {
    // Initialize core features
    initTheme();
    bindIncidentFields();
    populateTemplateList();

    // ========================================
    // Theme Toggle
    // ========================================
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        
        // Save to localStorage
        try {
          localStorage.setItem('bita_theme', next);
          console.log('Theme saved to localStorage:', next);
        } catch (err) {
          console.error('Failed to save theme:', err);
        }
        
        // Apply theme
        setTheme(next);
      });
    }

    // ========================================
    // Tab Navigation
    // ========================================
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tabpanel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const tabPanel = document.getElementById(tab.dataset.tab);
        if (tabPanel) {
          tabPanel.classList.add("active");
        }
        if (tab.dataset.tab === "rendered" || tab.dataset.tab === "preview") {
          buildRenderedOutput();
        }
      });
    });

    // ========================================
    // Template Management
    // ========================================
    const applyTemplateBtn = document.getElementById("applyTemplate");
    if (applyTemplateBtn) {
      applyTemplateBtn.addEventListener("click", () => {
        const form = document.getElementById("tokenForm");
        if (!form) return;

        const fields = form.querySelectorAll("[data-token]");
        const mapBack = {
          INCIDENT_NAME: "name",
          SEVERITY: "severity",
          START_TIME: "start_time",
          NEXT_UPDATE_TIME: "next_update_time",
          IMPACT_SUMMARY: "impact_summary",
          IC_NAME: "ic_name",
          CONTACT: "contact",
          CUSTOMERS_AFFECTED: "customers_affected",
          "$IMPACT": "dollar_impact_per_hour",
          DOLLAR_IMPACT_PER_HOUR: "dollar_impact_per_hour",
          CURRENT_STATUS: "current_status",
          ROOT_CAUSE_STATUS: "root_cause_status",
          ETA: "eta",
          LINK_STATUS_PAGE: "link_status_page",
          JURISDICTION: "jurisdiction",
          TICKET_ID: "ticket_id",
          INCIDENT_ID: "incident_id"
        };

        fields.forEach(el => {
          const key = mapBack[el.dataset.token];
          if (key) {
            window.BITA_STORE.incident[key] = el.value;
          }
        });

        if (window.BITA_SETTINGS?.showToast) {
          window.BITA_SETTINGS.showToast("Incident fields updated from template tokens", "success");
        } else {
          alert("Incident fields updated from template tokens.");
        }
      });
    }

    // ========================================
    // Incident ID Management
    // ========================================
    const generateIdBtn = document.getElementById("generateId");
    if (generateIdBtn) {
      generateIdBtn.addEventListener("click", () => {
        const now = new Date();
        const yyyymm = now.toISOString().slice(0, 7).replace("-", "");
        const ids = (window.BITA_STORE._idsSeen || []).filter(id => id.startsWith(yyyymm + "_"));

        let maxNN = 0;
        ids.forEach(id => {
          const m = id.match(/^\d{6}_(\d{2})/);
          if (m) maxNN = Math.max(maxNN, parseInt(m[1], 10));
        });

        const nextNN = String(maxNN + 1).padStart(2, "0");
        const newId = `${yyyymm}_${nextNN}`;

        window.BITA_STORE.incident.incident_id = newId;
        window.BITA_STORE.incident.revision = "00";
        window.BITA_STORE._idsSeen = Array.from(new Set([...(window.BITA_STORE._idsSeen || []), newId]));

        const el = document.getElementById("incidentId");
        if (el) {
          el.value = newId;
          validateIncidentId(newId);
        }

        if (window.BITA_SETTINGS?.showToast) {
          window.BITA_SETTINGS.showToast(`Generated ID: ${newId}`, "success");
        }
      });
    }

    // ========================================
    // Revision Management
    // ========================================
    const saveRevisionBtn = document.getElementById("saveRevision");
    if (saveRevisionBtn) {
      saveRevisionBtn.addEventListener("click", () => {
        const id = window.BITA_STORE.incident.incident_id || "";
        
        if (!/^\d{6}_\d{2}$/.test(id) && !/^\d{6}_\d{2}\.\d{2}$/.test(id)) {
          alert("Set a valid Incident ID first (YYYYMM_NN or YYYYMM_NN.RR).");
          return;
        }

        let base = id;
        let rr = null;
        const m = id.match(/^\d{6}_\d{2}\.(\d{2})$/);
        
        if (m) {
          rr = parseInt(m[1], 10);
          base = id.slice(0, id.lastIndexOf("."));
        }

        const currentRR = (rr !== null) ? rr : parseInt(window.BITA_STORE.incident.revision || "00", 10);
        const nextRR = String(currentRR + 1).padStart(2, "0");
        const newId = `${base}.${nextRR}`;

        window.BITA_STORE.incident.incident_id = newId;
        window.BITA_STORE.incident.revision = nextRR;

        const el = document.getElementById("incidentId");
        if (el) {
          el.value = newId;
          validateIncidentId(newId);
        }

        // Save to history
        if (window.BITA_HISTORY) {
          window.BITA_HISTORY.save(window.BITA_STORE.incident);
        }

        if (window.BITA_SETTINGS?.showToast) {
          window.BITA_SETTINGS.showToast(`Revision saved: ${newId}`, "success");
        } else {
          alert(`Revision saved: ${newId}`);
        }
      });
    }

    // ========================================
    // File Upload - Incident JSON
    // ========================================
    const uploadIncidentBtn = document.getElementById("uploadIncident");
    if (uploadIncidentBtn) {
      uploadIncidentBtn.addEventListener("change", async (evt) => {
        const file = evt.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const data = JSON.parse(text);

          window.BITA_STORE.incident = {
            ...window.BITA_STORE.incident,
            ...data
          };

          const mapping = {
            incident_id: "incidentId",
            name: "incidentName",
            severity: "incidentSeverity",
            start_time: "startTime",
            next_update_time: "nextUpdateTime",
            impact_summary: "impactSummary",
            ic_name: "icName",
            contact: "contact",
            customers_affected: "customersAffected",
            dollar_impact_per_hour: "dollarImpactPerHour",
            current_status: "currentStatus",
            root_cause_status: "rootCauseStatus",
            eta: "eta",
            link_status_page: "linkStatusPage",
            jurisdiction: "jurisdiction",
            ticket_id: "ticketId"
          };

          Object.entries(mapping).forEach(([k, id]) => {
            const el = document.getElementById(id);
            if (el && data[k] !== undefined) {
              el.value = data[k];
            }
          });

          if (data.incident_id) {
            window.BITA_STORE._idsSeen = Array.from(new Set([
              ...(window.BITA_STORE._idsSeen || []),
              data.incident_id
            ]));
            validateIncidentId(data.incident_id);
          }

          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Incident loaded successfully", "success");
          } else {
            alert("Incident loaded.");
          }
        } catch (e) {
          console.error("Failed to load incident:", e);
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Invalid incident JSON", "error");
          } else {
            alert("Invalid incident JSON.");
          }
        }

        // Reset file input
        evt.target.value = "";
      });
    }

    // ========================================
    // File Upload - Rendered Text
    // ========================================
    const uploadRenderedBtn = document.getElementById("uploadRendered");
    if (uploadRenderedBtn) {
      uploadRenderedBtn.addEventListener("change", async (evt) => {
        const files = Array.from(evt.target.files || []);
        if (!files.length) return;

        let updates = 0;
        for (const f of files) {
          try {
            const text = await f.text();
            const { incident } = window.BITA_PARSER.updateIncidentFromRendered(
              text,
              window.BITA_STORE.incident
            );
            window.BITA_STORE.incident = incident;
            updates++;
          } catch (e) {
            console.error("Failed to parse file:", f.name, e);
          }
        }

        const idEl = document.getElementById("incidentId");
        if (window.BITA_STORE.incident.incident_id && idEl) {
          idEl.value = window.BITA_STORE.incident.incident_id;
          validateIncidentId(idEl.value);
        }

        if (window.BITA_SETTINGS?.showToast) {
          window.BITA_SETTINGS.showToast(
            `Processed ${updates} file(s). Incident fields updated`,
            "success"
          );
        } else {
          alert(`Processed ${updates} file(s). Incident fields updated (metadata preferred).`);
        }

        // Reset file input
        evt.target.value = "";
      });
    }

    // ========================================
    // Download - Incident JSON
    // ========================================
    const downloadIncidentBtn = document.getElementById("downloadIncident");
    if (downloadIncidentBtn) {
      downloadIncidentBtn.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(window.BITA_STORE.incident, null, 2)], {
          type: "application/json"
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        const base = window.BITA_STORE.incident.incident_id || "incident";
        a.download = `${base}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    // ========================================
    // Download - Bundle
    // ========================================
    const downloadBundleBtn = document.getElementById("downloadBundle");
    if (downloadBundleBtn) {
      downloadBundleBtn.addEventListener("click", () => {
        const parts = [];
        const txt = window.BITA_STORE.rendered.text || "";

        if (txt) {
          parts.push({
            name: "rendered.txt",
            content: txt
          });
        }

        parts.push({
          name: "incident.json",
          content: JSON.stringify(window.BITA_STORE.incident, null, 2)
        });

        const payload = parts.map(p => `===== ${p.name} =====\n${p.content}`).join("\n\n");
        const blob = new Blob([payload], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        const base = window.BITA_STORE.incident.incident_id || "bundle";
        a.download = `${base}_bundle.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    // ========================================
    // Copy Rendered Text
    // ========================================
    const copyRenderedBtn = document.getElementById("copyRendered");
    if (copyRenderedBtn) {
      copyRenderedBtn.addEventListener("click", async () => {
        const txtEl = document.getElementById("renderedText");
        const txt = txtEl ? txtEl.textContent : "";

        try {
          await navigator.clipboard.writeText(txt);
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Copied to clipboard", "success");
          } else {
            alert("Copied to clipboard.");
          }
        } catch {
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Copy failed. Select and copy manually", "error");
          } else {
            alert("Copy failed. Select and copy manually.");
          }
        }
      });
    }

    // ========================================
    // Download - Rendered Text
    // ========================================
    const downloadRenderedTxtBtn = document.getElementById("downloadRenderedTxt");
    if (downloadRenderedTxtBtn) {
      downloadRenderedTxtBtn.addEventListener("click", () => {
        const txtEl = document.getElementById("renderedText");
        const txt = txtEl ? txtEl.textContent || "" : "";
        const blob = new Blob([txt], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        const base = window.BITA_STORE.incident.incident_id || "rendered";
        a.download = `${base}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    // ========================================
    // Generate Communications
    // ========================================
    const generateCommsBtn = document.getElementById("generateComms");
    if (generateCommsBtn) {
      generateCommsBtn.addEventListener("click", () => {
        const audienceSelect = document.getElementById("audienceSelect");
        const selectedAud = audienceSelect 
          ? Array.from(audienceSelect.selectedOptions).map(o => o.value)
          : [];
        
        const severity = document.getElementById("incidentSeverity")?.value;

        const templates = window.BITA_STORE.templates.communications.filter(t =>
          selectedAud.includes(t.audience) &&
          (!severity || (t.severity || []).includes(severity))
        );

        if (!templates.length) {
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("No templates match selected audience/severity", "warning");
          } else {
            alert("No templates match selected audience/severity.");
          }
          return;
        }

        window.BITA_UI.selectTemplate(templates[0]);
        
        // Switch to editor tab
        const editorTab = document.querySelector('.tab[data-tab="editor"]');
        if (editorTab) {
          editorTab.click();
        }
      });
    }

    // ========================================
    // Template Pack Loading
    // ========================================
    const loadSecurityPackBtn = document.getElementById("loadSecurityPack");
    if (loadSecurityPackBtn) {
      loadSecurityPackBtn.addEventListener("click", () => {
        if (window.BITA_TEMPLATES_EXTENDED?.security) {
          window.BITA_TEMPLATES.communications.push(...window.BITA_TEMPLATES_EXTENDED.security);
          populateTemplateList();
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Security pack loaded", "success");
          } else {
            alert("Security pack loaded");
          }
        } else {
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Security pack not available", "error");
          } else {
            alert("Security pack not available. Load templates-extended.js");
          }
        }
      });
    }

    const loadThirdPartyPackBtn = document.getElementById("loadThirdPartyPack");
    if (loadThirdPartyPackBtn) {
      loadThirdPartyPackBtn.addEventListener("click", () => {
        if (window.BITA_TEMPLATES_EXTENDED?.thirdParty) {
          window.BITA_TEMPLATES.communications.push(...window.BITA_TEMPLATES_EXTENDED.thirdParty);
          populateTemplateList();
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Third-party pack loaded", "success");
          } else {
            alert("Third-party pack loaded");
          }
        } else {
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Third-party pack not available", "error");
          } else {
            alert("Third-party pack not available. Load templates-extended.js");
          }
        }
      });
    }

    const loadPostIncidentPackBtn = document.getElementById("loadPostIncidentPack");
    if (loadPostIncidentPackBtn) {
      loadPostIncidentPackBtn.addEventListener("click", () => {
        if (window.BITA_TEMPLATES_EXTENDED?.postIncident) {
          window.BITA_TEMPLATES.communications.push(...window.BITA_TEMPLATES_EXTENDED.postIncident);
          populateTemplateList();
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Post-incident pack loaded", "success");
          } else {
            alert("Post-incident pack loaded");
          }
        } else {
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Post-incident pack not available", "error");
          } else {
            alert("Post-incident pack not available. Load templates-extended.js");
          }
        }
      });
    }

    // ========================================
    // Custom Template Upload
    // ========================================
    const uploadTemplateBtn = document.getElementById("uploadTemplate");
    if (uploadTemplateBtn) {
      uploadTemplateBtn.addEventListener("change", async (evt) => {
        const file = evt.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          let template;

          if (file.name.endsWith('.json')) {
            template = JSON.parse(text);
          } else if (file.name.endsWith('.md')) {
            // Simple markdown template parser
            template = {
              id: `custom_${Date.now()}`,
              title: file.name.replace('.md', ''),
              audience: "internal",
              severity: ["S0", "S1", "S2", "S3"],
              version: "1.0.0",
              body: text
            };
          } else {
            throw new Error("Unsupported file type");
          }

          // Add to templates
          window.BITA_TEMPLATES.communications.push(template);
          populateTemplateList();

          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast(`Custom template "${template.title}" added`, "success");
          } else {
            alert(`Custom template "${template.title}" added`);
          }
        } catch (e) {
          console.error("Failed to load template:", e);
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Failed to load template", "error");
          } else {
            alert("Failed to load template");
          }
        }

        // Reset file input
        evt.target.value = "";
      });
    }

    // ========================================
    // Template Pack Upload
    // ========================================
    const uploadTemplatePackBtn = document.getElementById("uploadTemplatePack");
    if (uploadTemplatePackBtn) {
      uploadTemplatePackBtn.addEventListener("change", async (evt) => {
        const file = evt.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const pack = JSON.parse(text);

          let count = 0;
          if (Array.isArray(pack)) {
            window.BITA_TEMPLATES.communications.push(...pack);
            count = pack.length;
          } else if (pack.communications && Array.isArray(pack.communications)) {
            window.BITA_TEMPLATES.communications.push(...pack.communications);
            count = pack.communications.length;
          } else {
            throw new Error("Invalid template pack format");
          }

          populateTemplateList();

          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast(`Loaded ${count} templates`, "success");
          } else {
            alert(`Loaded ${count} templates`);
          }
        } catch (e) {
          console.error("Failed to load template pack:", e);
          if (window.BITA_SETTINGS?.showToast) {
            window.BITA_SETTINGS.showToast("Failed to load template pack", "error");
          } else {
            alert("Failed to load template pack");
          }
        }

        // Reset file input
        evt.target.value = "";
      });
    }

    // ========================================
    // Initialization Complete
    // ========================================
    console.log("Business ITA initialized successfully");
  });
})();