// linter.js - Template Linting and Quality Checks

class TemplateLinter {
  constructor() {
    this.rules = [
      { id: 'missing-tokens', check: this.checkMissingTokens, severity: 'error' },
      { id: 'undefined-tokens', check: this.checkUndefinedTokens, severity: 'warning' },
      { id: 'length-check', check: this.checkLength, severity: 'warning' },
      { id: 'tone-check', check: this.checkTone, severity: 'info' },
      { id: 'clarity-check', check: this.checkClarity, severity: 'info' },
      { id: 'spelling-check', check: this.checkSpelling, severity: 'warning' },
      { id: 'formatting-check', check: this.checkFormatting, severity: 'info' }
    ];
  }

  // Main lint function
  lint(template, templateBody) {
    const results = {
      errors: [],
      warnings: [],
      info: [],
      passed: []
    };

    this.rules.forEach(rule => {
      const issues = rule.check.call(this, template, templateBody);
      
      issues.forEach(issue => {
        const item = {
          rule: rule.id,
          message: issue.message,
          line: issue.line,
          suggestion: issue.suggestion
        };

        if (rule.severity === 'error') {
          results.errors.push(item);
        } else if (rule.severity === 'warning') {
          results.warnings.push(item);
        } else {
          results.info.push(item);
        }
      });

      if (issues.length === 0) {
        results.passed.push(rule.id);
      }
    });

    return results;
  }

  // Rule: Check if required tokens are present
  checkMissingTokens(template, body) {
    const issues = [];
    const requiredTokens = template.tokens_required || [];
    const bodyTokens = window.BITA_RENDER.detectTokens(body);
    
    requiredTokens.forEach(token => {
      if (!bodyTokens.includes(token)) {
        issues.push({
          message: `Required token [${token}] is missing from template body`,
          suggestion: `Add [${token}] to the template where appropriate`
        });
      }
    });

    return issues;
  }

  // Rule: Check for tokens that aren't mapped
  checkUndefinedTokens(template, body) {
    const issues = [];
    const bodyTokens = window.BITA_RENDER.detectTokens(body);
    const validTokens = Object.keys(window.BITA_RENDER.mapIncidentToTokens(window.BITA_STORE.incident));
    
    bodyTokens.forEach(token => {
      if (!validTokens.includes(token)) {
        issues.push({
          message: `Token [${token}] is not defined in the token mapping system`,
          suggestion: `Remove or define this token in render.js mapIncidentToTokens()`
        });
      }
    });

    return issues;
  }

  // Rule: Check template length
  checkLength(template, body) {
    const issues = [];
    const length = body.length;
    
    if (length < 50) {
      issues.push({
        message: 'Template is very short (< 50 characters)',
        suggestion: 'Consider adding more context or structure'
      });
    }
    
    if (length > 2000) {
      issues.push({
        message: 'Template is very long (> 2000 characters)',
        suggestion: 'Consider breaking into multiple templates or simplifying'
      });
    }

    return issues;
  }

  // Rule: Check tone appropriateness
  checkTone(template, body) {
    const issues = [];
    const audience = template.audience || 'unknown';
    
    // Informal words that might be inappropriate
    const informalWords = ['hey', 'guys', 'stuff', 'things', 'gonna', 'wanna', 'kinda', 'yeah'];
    const lowerBody = body.toLowerCase();
    
    informalWords.forEach(word => {
      if (lowerBody.includes(word)) {
        if (['executive', 'regulators', 'customers'].includes(audience)) {
          issues.push({
            message: `Informal word "${word}" may be inappropriate for ${audience} audience`,
            suggestion: `Use more formal language for ${audience} communications`
          });
        }
      }
    });

    // Check for excessive exclamation marks
    const exclamationCount = (body.match(/!/g) || []).length;
    if (exclamationCount > 2 && audience !== 'internal') {
      issues.push({
        message: `Excessive exclamation marks (${exclamationCount}) for ${audience} audience`,
        suggestion: 'Use exclamation marks sparingly in professional communications'
      });
    }

    return issues;
  }

  // Rule: Check clarity and readability
  checkClarity(template, body) {
    const issues = [];
    
    // Check for very long sentences
    const sentences = body.split(/[.!?]+/);
    sentences.forEach((sentence, idx) => {
      const words = sentence.trim().split(/\s+/).length;
      if (words > 40) {
        issues.push({
          message: `Sentence ${idx + 1} is very long (${words} words)`,
          suggestion: 'Break into shorter sentences for better readability'
        });
      }
    });

    // Check for passive voice indicators
    const passiveIndicators = ['was affected', 'were affected', 'is being', 'has been', 'will be'];
    passiveIndicators.forEach(phrase => {
      if (body.toLowerCase().includes(phrase)) {
        issues.push({
          message: `Possible passive voice: "${phrase}"`,
          suggestion: 'Consider using active voice for clearer communication'
        });
      }
    });

    // Check for jargon without context
    const jargon = ['SRE', 'IC', 'PIR', 'RCA', 'ETA', 'SLA'];
    jargon.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'g');
      const matches = body.match(regex);
      if (matches && matches.length > 2 && template.audience === 'customers') {
        issues.push({
          message: `Heavy use of jargon "${term}" for customer-facing template`,
          suggestion: 'Define acronyms or use plain language for external audiences'
        });
      }
    });

    return issues;
  }

  // Rule: Check spelling and common mistakes
  checkSpelling(template, body) {
    const issues = [];
    
    // Common typos and mistakes
    const commonMistakes = {
      'recieve': 'receive',
      'occured': 'occurred',
      'seperate': 'separate',
      'definately': 'definitely',
      'accomodate': 'accommodate',
      'untill': 'until',
      'begining': 'beginning'
    };

    Object.entries(commonMistakes).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      if (regex.test(body)) {
        issues.push({
          message: `Possible spelling error: "${wrong}"`,
          suggestion: `Did you mean "${correct}"?`
        });
      }
    });

    return issues;
  }

  // Rule: Check formatting consistency
  checkFormatting(template, body) {
    const issues = [];
    
    // Check for inconsistent line breaks
    const hasDoubleNewlines = body.includes('\n\n');
    const hasSingleNewlines = /[^\n]\n[^\n]/.test(body);
    
    if (hasDoubleNewlines && hasSingleNewlines) {
      issues.push({
        message: 'Inconsistent line break usage (mixing single and double)',
        suggestion: 'Use consistent line breaks throughout template'
      });
    }

    // Check for trailing whitespace
    const lines = body.split('\n');
    lines.forEach((line, idx) => {
      if (line !== line.trimEnd()) {
        issues.push({
          message: `Line ${idx + 1} has trailing whitespace`,
          suggestion: 'Remove trailing spaces for cleaner formatting'
        });
      }
    });

    // Check for inconsistent token brackets
    const openBrackets = (body.match(/\[/g) || []).length;
    const closeBrackets = (body.match(/\]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      issues.push({
        message: `Mismatched brackets: ${openBrackets} opening, ${closeBrackets} closing`,
        suggestion: 'Ensure all token brackets are properly closed'
      });
    }

    return issues;
  }

  // Generate a quality score
  calculateScore(results) {
    const errorWeight = 10;
    const warningWeight = 5;
    const infoWeight = 1;
    
    const totalDeductions = 
      (results.errors.length * errorWeight) +
      (results.warnings.length * warningWeight) +
      (results.info.length * infoWeight);
    
    const maxScore = 100;
    const score = Math.max(0, maxScore - totalDeductions);
    
    return {
      score,
      grade: this.getGrade(score),
      passThreshold: score >= 70
    };
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Initialize global linter
window.BITA_LINTER = new TemplateLinter();

// UI Integration
function initLinter() {
  const lintBtn = document.getElementById('lintTemplate');
  const resultsContainer = document.getElementById('templateLintResults');

  lintBtn?.addEventListener('click', () => {
    const template = window.BITA_STORE.selectedTemplate;
    const body = document.getElementById('templateRaw').value;

    if (!template || !body) {
      alert('Select a template first');
      return;
    }

    const results = window.BITA_LINTER.lint(template, body);
    const scoreData = window.BITA_LINTER.calculateScore(results);
    
    displayLintResults(results, scoreData, resultsContainer);
  });
}

function displayLintResults(results, scoreData, container) {
  if (!container) return;

  const totalIssues = results.errors.length + results.warnings.length + results.info.length;

  if (totalIssues === 0) {
    container.innerHTML = `
      <div class="lint-success">
        <h4>✓ All checks passed!</h4>
        <p>Quality Score: ${scoreData.score}/100 (Grade: ${scoreData.grade})</p>
      </div>
    `;
    container.style.display = 'block';
    return;
  }

  let html = `
    <div class="lint-header">
      <h4>Lint Results</h4>
      <div class="lint-score">
        Score: <strong>${scoreData.score}/100</strong> 
        <span class="grade grade-${scoreData.grade}">${scoreData.grade}</span>
      </div>
    </div>
  `;

  if (results.errors.length > 0) {
    html += '<div class="lint-section lint-errors">';
    html += `<h5>⛔ Errors (${results.errors.length})</h5><ul>`;
    results.errors.forEach(error => {
      html += `<li><strong>${error.message}</strong><br><em>${error.suggestion}</em></li>`;
    });
    html += '</ul></div>';
  }

  if (results.warnings.length > 0) {
    html += '<div class="lint-section lint-warnings">';
    html += `<h5>⚠️ Warnings (${results.warnings.length})</h5><ul>`;
    results.warnings.forEach(warning => {
      html += `<li><strong>${warning.message}</strong><br><em>${warning.suggestion}</em></li>`;
    });
    html += '</ul></div>';
  }

  if (results.info.length > 0) {
    html += '<div class="lint-section lint-info">';
    html += `<h5>ℹ️ Suggestions (${results.info.length})</h5><ul>`;
    results.info.forEach(info => {
      html += `<li><strong>${info.message}</strong><br><em>${info.suggestion}</em></li>`;
    });
    html += '</ul></div>';
  }

  container.innerHTML = html;
  container.style.display = 'block';
}

// Auto-lint on template selection (optional)
function enableAutoLint() {
  const templateRaw = document.getElementById('templateRaw');
  let lintTimeout;

  templateRaw?.addEventListener('input', () => {
    clearTimeout(lintTimeout);
    lintTimeout = setTimeout(() => {
      const template = window.BITA_STORE.selectedTemplate;
      if (template) {
        const results = window.BITA_LINTER.lint(template, templateRaw.value);
        const scoreData = window.BITA_LINTER.calculateScore(results);
        
        // Show inline indicators
        updateLintIndicator(results, scoreData);
      }
    }, 1000);
  });
}

function updateLintIndicator(results, scoreData) {
  const indicator = document.getElementById('validationStatus');
  if (!indicator) return;

  const totalIssues = results.errors.length + results.warnings.length;
  
  if (totalIssues === 0) {
    indicator.innerHTML = `✓ Template Quality: ${scoreData.grade}`;
    indicator.className = 'status-good';
  } else if (results.errors.length > 0) {
    indicator.innerHTML = `⛔ ${results.errors.length} errors`;
    indicator.className = 'status-error';
  } else {
    indicator.innerHTML = `⚠️ ${results.warnings.length} warnings`;
    indicator.className = 'status-warning';
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initLinter();
  enableAutoLint();
});
