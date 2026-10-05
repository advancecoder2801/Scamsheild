/**
 * ScamShield - Minimal App Orchestrator & Balanced Result Renderer
 */

class ScamShieldApp {
  constructor() {
    this.initElements();
    this.initTabs();
    this.initModeToggle();
    this.initSettingsModal();
  }

  initElements() {
    this.resultsSection = document.getElementById("resultsSection");
    this.verdictCard = document.getElementById("verdictCard");
    this.laserScanner = document.getElementById("laserScanner");

    // Verdict Elements
    this.statusIconCircle = document.getElementById("statusIconCircle");
    this.verdictPill = document.getElementById("verdictPill");
    this.verdictHeadline = document.getElementById("verdictHeadline");
    this.verdictSummary = document.getElementById("verdictSummary");

    // Meter Elements
    this.scoreValue = document.getElementById("scoreValue");
    this.meterProgressBar = document.getElementById("meterProgressBar");
    this.meterRiskText = document.getElementById("meterRiskText");

    // Headings
    this.indicatorsHeading = document.getElementById("indicatorsHeading");
    this.actionsHeading = document.getElementById("actionsHeading");
    this.snippetsLabel = document.getElementById("snippetsLabel");

    // Lists
    this.indicatorsContainer = document.getElementById("indicatorsContainer");
    this.snippetsBlock = document.getElementById("snippetsBlock");
    this.snippetsContainer = document.getElementById("snippetsContainer");
    this.actionsChecklist = document.getElementById("actionsChecklist");
    this.helpBannerBox = document.getElementById("helpBannerBox");

    // Toast
    this.toast = document.getElementById("toastNotification");
    this.toastMsg = document.getElementById("toastMessage");
    this.toastIcon = document.getElementById("toastIcon");
    this.toastTimer = null;
  }

  initTabs() {
    const tabButtons = document.querySelectorAll(".tab-item");
    const panels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        tabButtons.forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const panel = document.getElementById(targetTab);
        if (panel) panel.classList.add("active");

        this.hideResults();
      });
    });
  }

  initModeToggle() {
    const btn = document.getElementById("modeToggleBtn");
    const text = document.getElementById("modeText");

    const updateLabel = () => {
      const isDemo = window.scamAPI.isFastDemo;
      text.innerHTML = `Demo Mode: <strong>${isDemo ? 'Active' : 'Off (Live API)'}</strong>`;
    };

    updateLabel();

    btn.addEventListener("click", () => {
      const newMode = !window.scamAPI.isFastDemo;
      window.scamAPI.setFastDemoMode(newMode);
      updateLabel();
      this.showToast(newMode ? "⚡ Fast Demo Mode Active" : "🌐 Live AI Mode Active");
    });
  }

  initSettingsModal() {
    const modal = document.getElementById("settingsModal");
    const settingsBtn = document.getElementById("settingsBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const saveBtn = document.getElementById("saveSettingsBtn");
    const apiKeyInput = document.getElementById("geminiApiKeyInput");

    apiKeyInput.value = window.scamAPI.apiKey;

    settingsBtn.addEventListener("click", () => {
      apiKeyInput.value = window.scamAPI.apiKey;
      modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => modal.style.display = "none");

    saveBtn.addEventListener("click", () => {
      const key = apiKeyInput.value.trim();
      window.scamAPI.setApiKey(key);
      modal.style.display = "none";
      this.showToast(key ? "✅ API Key Saved!" : "⚡ Using Smart Demo Mode");
    });
  }

  startScanning() {
    this.resultsSection.style.display = "block";
    this.laserScanner.classList.add("scanning");
    
    this.verdictHeadline.textContent = "Analyzing input...";
    this.verdictSummary.textContent = "Inspecting sender identity, language patterns, and security authenticity...";
    this.verdictPill.textContent = "CHECKING...";
    this.verdictPill.style.background = "#e2e8f0";
    this.verdictPill.style.color = "#475569";
    this.verdictPill.style.borderColor = "#cbd5e1";
    this.statusIconCircle.textContent = "⏳";
    this.statusIconCircle.style.background = "#f1f5f9";
    this.statusIconCircle.style.borderColor = "#cbd5e1";
    this.scoreValue.textContent = "--";

    this.indicatorsContainer.innerHTML = "<div style='color:#64748b;font-size:0.85rem;'>Running forensic pattern verification...</div>";
    this.snippetsContainer.innerHTML = "";
    this.actionsChecklist.innerHTML = "";
  }

  stopScanning() {
    this.laserScanner.classList.remove("scanning");
  }

  renderResults(data) {
    this.resultsSection.style.display = "block";
    this.stopScanning();

    const score = Number(data.risk_score) || 0;
    const isDangerous = score >= 70;
    const isWarning = score >= 30 && score < 70;
    const isSafe = score < 30;

    // 1. Update Card Styling & Status
    this.verdictCard.className = "verdict-card " + (isDangerous ? "state-danger" : (isWarning ? "state-warning" : "state-safe"));

    if (isDangerous) {
      this.statusIconCircle.textContent = "🚨";
      this.statusIconCircle.style.background = "#fef2f2";
      this.statusIconCircle.style.borderColor = "#fecaca";
      
      this.verdictPill.textContent = "DANGEROUS SCAM";
      this.verdictPill.style.background = "#fef2f2";
      this.verdictPill.style.color = "#dc2626";
      this.verdictPill.style.borderColor = "#fecaca";

      this.meterProgressBar.style.background = "#dc2626";
      this.meterRiskText.textContent = "High Danger";
      this.meterRiskText.style.color = "#dc2626";

      if (this.indicatorsHeading) this.indicatorsHeading.textContent = "🚩 Why is this dangerous?";
      if (this.actionsHeading) this.actionsHeading.textContent = "🛡️ What you should do right now:";
    } else if (isWarning) {
      this.statusIconCircle.textContent = "⚠️";
      this.statusIconCircle.style.background = "#fffbeb";
      this.statusIconCircle.style.borderColor = "#fde68a";

      this.verdictPill.textContent = "SUSPICIOUS / BE CAREFUL";
      this.verdictPill.style.background = "#fffbeb";
      this.verdictPill.style.color = "#d97706";
      this.verdictPill.style.borderColor = "#fde68a";

      this.meterProgressBar.style.background = "#d97706";
      this.meterRiskText.textContent = "Moderate Risk (Caution)";
      this.meterRiskText.style.color = "#d97706";

      if (this.indicatorsHeading) this.indicatorsHeading.textContent = "⚠️ Cautionary Factors:";
      if (this.actionsHeading) this.actionsHeading.textContent = "🛡️ Recommended Next Steps:";
    } else {
      // CLEARLY SAFE & AUTHENTIC
      this.statusIconCircle.textContent = "✅";
      this.statusIconCircle.style.background = "#f0fdf4";
      this.statusIconCircle.style.borderColor = "#bbf7d0";

      this.verdictPill.textContent = "LOOKS SAFE / AUTHENTIC";
      this.verdictPill.style.background = "#f0fdf4";
      this.verdictPill.style.color = "#16a34a";
      this.verdictPill.style.borderColor = "#bbf7d0";

      this.meterProgressBar.style.background = "#16a34a";
      this.meterRiskText.textContent = "Safe & Genuine (Low Risk)";
      this.meterRiskText.style.color = "#16a34a";

      if (this.indicatorsHeading) this.indicatorsHeading.textContent = "✅ Why this looks safe & genuine:";
      if (this.actionsHeading) this.actionsHeading.textContent = "💡 Good Security Practices:";
    }

    // 2. Titles & Summaries
    this.verdictHeadline.textContent = data.title || (isDangerous ? "Scam Alert" : "Verification Complete");
    this.verdictSummary.textContent = data.summary || (isDangerous ? "Dangerous scam pattern detected." : "No malicious patterns detected.");

    // 3. Progress Meter Animation
    this.meterProgressBar.style.width = `${score}%`;
    this.scoreValue.textContent = score;

    // 4. Red Flags / Safe Points List
    this.indicatorsContainer.innerHTML = "";
    const flags = data.red_flags || data.indicators || [];
    if (flags.length > 0) {
      flags.forEach(f => {
        const item = document.createElement("div");
        item.className = "flag-item " + (isSafe ? "safe-flag" : "");
        const icon = isDangerous ? "❌" : (isWarning ? "⚠️" : "✅");
        item.innerHTML = `
          <span class="flag-icon">${icon}</span>
          <div class="flag-text">
            <strong>${f.title || f.name}</strong>
            <span>${f.desc || f.explanation}</span>
          </div>
        `;
        this.indicatorsContainer.appendChild(item);
      });
    }

    // 5. Flagged Snippets (if any)
    this.snippetsContainer.innerHTML = "";
    if (data.flagged_snippets && data.flagged_snippets.length > 0) {
      this.snippetsBlock.style.display = "block";
      if (this.snippetsLabel) this.snippetsLabel.textContent = isDangerous ? "Suspicious phrases detected:" : "Key terms checked:";
      data.flagged_snippets.forEach(s => {
        const chip = document.createElement("span");
        chip.className = "flagged-chip";
        chip.textContent = `"${s}"`;
        this.snippetsContainer.appendChild(chip);
      });
    } else {
      this.snippetsBlock.style.display = "none";
    }

    // 6. Actions Checklist
    this.actionsChecklist.innerHTML = "";
    const actions = data.actions || data.recommended_actions || [
      "Standard best practice: Never share passwords, PINs, or OTPs."
    ];

    actions.forEach((act, idx) => {
      const li = document.createElement("li");
      li.className = "action-item";
      li.innerHTML = `
        <input type="checkbox" class="simple-checkbox" id="act_${idx}">
        <label for="act_${idx}">${act}</label>
      `;
      this.actionsChecklist.appendChild(li);
    });

    // Smooth Scroll
    setTimeout(() => {
      this.resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 80);
  }

  hideResults() {
    if (this.resultsSection) this.resultsSection.style.display = "none";
  }

  showToast(message) {
    if (!this.toast) return;
    this.toastMsg.textContent = message;
    this.toast.style.display = "flex";
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.style.display = "none", 2800);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new ScamShieldApp();
});