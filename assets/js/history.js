// history.js - Revision History Implementation

class RevisionHistory {
  constructor() {
    this.storageKey = 'bita_revision_history';
    this.maxRevisions = 50; // Keep last 50 revisions per incident
  }

  // Save a revision snapshot
  save(incident) {
    const history = this.getHistory();
    const incidentId = incident.incident_id || 'draft';
    
    if (!history[incidentId]) {
      history[incidentId] = [];
    }

    const revision = {
      id: incident.incident_id,
      revision: incident.revision || '00',
      timestamp: new Date().toISOString(),
      data: { ...incident },
      user: window.BITA_ENV?.currentUser || 'unknown'
    };

    history[incidentId].unshift(revision);

    // Keep only last N revisions
    if (history[incidentId].length > this.maxRevisions) {
      history[incidentId] = history[incidentId].slice(0, this.maxRevisions);
    }

    this.saveHistory(history);
    return revision;
  }

  // Get all revisions for an incident
  getRevisions(incidentId) {
    const history = this.getHistory();
    return history[incidentId] || [];
  }

  // Get all incidents (latest revision only)
  getAllIncidents() {
    const history = this.getHistory();
    return Object.entries(history).map(([id, revisions]) => ({
      id,
      latest: revisions[0],
      revisionCount: revisions.length
    }));
  }

  // Restore a specific revision
  restore(incidentId, revisionIndex) {
    const revisions = this.getRevisions(incidentId);
    if (revisions[revisionIndex]) {
      return revisions[revisionIndex].data;
    }
    return null;
  }

  // Compare two revisions
  diff(incidentId, indexA, indexB) {
    const revisions = this.getRevisions(incidentId);
    const revA = revisions[indexA];
    const revB = revisions[indexB];
    
    if (!revA || !revB) return null;

    const changes = {};
    const allKeys = new Set([
      ...Object.keys(revA.data),
      ...Object.keys(revB.data)
    ]);

    allKeys.forEach(key => {
      if (revA.data[key] !== revB.data[key]) {
        changes[key] = {
          before: revA.data[key],
          after: revB.data[key]
        };
      }
    });

    return {
      revisionA: revA.revision,
      revisionB: revB.revision,
      timestampA: revA.timestamp,
      timestampB: revB.timestamp,
      changes
    };
  }

  // Delete all revisions for an incident
  deleteIncident(incidentId) {
    const history = this.getHistory();
    delete history[incidentId];
    this.saveHistory(history);
  }

  // Clear all history
  clear() {
    localStorage.removeItem(this.storageKey);
  }

  // Private: Get history from storage
  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Failed to load revision history', e);
      return {};
    }
  }

  // Private: Save history to storage
  saveHistory(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save revision history', e);
      // If quota exceeded, remove oldest revisions
      if (e.name === 'QuotaExceededError') {
        this.pruneOldRevisions(history);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
      }
    }
  }

  // Private: Remove oldest revisions to free space
  pruneOldRevisions(history) {
    Object.keys(history).forEach(incidentId => {
      history[incidentId] = history[incidentId].slice(0, 20);
    });
  }
}

// Initialize global history manager
window.BITA_HISTORY = new RevisionHistory();

// UI Functions
function initHistoryModal() {
  const modal = document.getElementById('historyModal');
  const viewBtn = document.getElementById('viewHistory');
  const closeBtn = document.getElementById('closeHistory');
  const closeBtnFooter = document.getElementById('closeHistoryBtn');

  viewBtn?.addEventListener('click', () => {
    loadHistoryList();
    modal.style.display = 'flex';
  });

  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  closeBtnFooter?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function loadHistoryList() {
  const currentId = window.BITA_STORE.incident.incident_id;
  if (!currentId) {
    document.getElementById('revisionList').innerHTML = 
      '<li class="empty-state">No incident ID set. Save an incident first.</li>';
    return;
  }

  const revisions = window.BITA_HISTORY.getRevisions(currentId);
  const list = document.getElementById('revisionList');

  if (revisions.length === 0) {
    list.innerHTML = '<li class="empty-state">No revision history for this incident.</li>';
    return;
  }

  list.innerHTML = revisions.map((rev, index) => {
    const date = new Date(rev.timestamp);
    const isLatest = index === 0;
    
    return `
      <li class="revision-item ${isLatest ? 'latest' : ''}">
        <div class="revision-header">
          <strong>${rev.id}.${rev.revision}</strong>
          ${isLatest ? '<span class="badge">Latest</span>' : ''}
        </div>
        <div class="revision-meta">
          ${formatDate(date)} • ${rev.user}
        </div>
        <div class="revision-summary">
          ${generateRevisionSummary(rev.data)}
        </div>
        <div class="revision-actions">
          <button class="btn small" onclick="restoreRevision(${index})">
            Restore
          </button>
          ${index < revisions.length - 1 ? 
            `<button class="btn small" onclick="viewDiff(${index}, ${index + 1})">
              Compare
            </button>` : ''}
          <button class="btn small" onclick="exportRevision(${index})">
            Export
          </button>
        </div>
      </li>
    `;
  }).join('');
}

function generateRevisionSummary(incident) {
  const parts = [];
  if (incident.name) parts.push(incident.name);
  if (incident.severity) parts.push(incident.severity);
  if (incident.current_status) parts.push(incident.current_status);
  return parts.join(' • ') || 'No details';
}

function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function restoreRevision(index) {
  const currentId = window.BITA_STORE.incident.incident_id;
  const restored = window.BITA_HISTORY.restore(currentId, index);
  
  if (!restored) {
    alert('Failed to restore revision');
    return;
  }

  if (confirm('Restore this revision? Current unsaved changes will be lost.')) {
    window.BITA_STORE.incident = { ...restored };
    
    // Update all form fields
    const mapping = {
      incident_id: 'incidentId',
      name: 'incidentName',
      severity: 'incidentSeverity',
      start_time: 'startTime',
      next_update_time: 'nextUpdateTime',
      impact_summary: 'impactSummary',
      ic_name: 'icName',
      contact: 'contact',
      customers_affected: 'customersAffected',
      dollar_impact_per_hour: 'dollarImpactPerHour',
      current_status: 'currentStatus',
      root_cause_status: 'rootCauseStatus',
      eta: 'eta',
      link_status_page: 'linkStatusPage',
      jurisdiction: 'jurisdiction',
      ticket_id: 'ticketId'
    };

    Object.entries(mapping).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el && restored[key] !== undefined) {
        el.value = restored[key];
      }
    });

    document.getElementById('historyModal').style.display = 'none';
    window.BITA_SETTINGS?.showToast('Revision restored successfully', 'success');
  }
}

function viewDiff(indexA, indexB) {
  const currentId = window.BITA_STORE.incident.incident_id;
  const diff = window.BITA_HISTORY.diff(currentId, indexA, indexB);
  
  if (!diff) {
    alert('Failed to generate diff');
    return;
  }

  const changeList = Object.entries(diff.changes).map(([field, change]) => {
    return `<li>
      <strong>${field}:</strong><br>
      <span class="diff-before">- ${change.before || '(empty)'}</span><br>
      <span class="diff-after">+ ${change.after || '(empty)'}</span>
    </li>`;
  }).join('');

  const diffHtml = `
    <h3>Changes Between Revisions</h3>
    <p>${diff.revisionA} (${formatDate(new Date(diff.timestampA))}) 
       → ${diff.revisionB} (${formatDate(new Date(diff.timestampB))})</p>
    <ul class="diff-list">${changeList}</ul>
  `;

  // Show in a simple alert for now (could be enhanced with modal)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = diffHtml;
  alert(tempDiv.textContent);
}

function exportRevision(index) {
  const currentId = window.BITA_STORE.incident.incident_id;
  const revision = window.BITA_HISTORY.restore(currentId, index);
  
  if (!revision) {
    alert('Failed to export revision');
    return;
  }

  const blob = new Blob([JSON.stringify(revision, null, 2)], {
    type: 'application/json'
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${revision.incident_id}_rev${revision.revision}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Auto-save revisions when significant changes occur
function enableAutoRevisionSave() {
  const saveRevision = () => {
    if (window.BITA_STORE.incident.incident_id) {
      window.BITA_HISTORY.save(window.BITA_STORE.incident);
    }
  };

  // Save on significant field changes
  const significantFields = [
    'incidentName', 'incidentSeverity', 'currentStatus', 
    'impactSummary', 'rootCauseStatus'
  ];

  significantFields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener('blur', saveRevision);
    }
  });

  // Save every 2 minutes
  setInterval(saveRevision, 120000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initHistoryModal();
  enableAutoRevisionSave();
});

// Export for global access
window.restoreRevision = restoreRevision;
window.viewDiff = viewDiff;
window.exportRevision = exportRevision;