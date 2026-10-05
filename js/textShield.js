/**
 * ScamShield - Module 1: Text Shield Controller
 */

class TextShieldController {
  constructor() {
    this.textInput = document.getElementById("textInputArea");
    this.charCount = document.getElementById("textCharCount");
    this.heuristicHint = document.getElementById("heuristicHint");
    this.analyzeBtn = document.getElementById("analyzeTextBtn");
    this.clearBtn = document.getElementById("clearTextBtn");
    this.currentPresetKey = null;

    this.init();
  }

  init() {
    if (!this.textInput) return;

    this.textInput.addEventListener("input", () => {
      this.currentPresetKey = null;
      this.updateInputMeta();
    });

    const presetButtons = document.querySelectorAll("#text-panel .btn-sample");
    presetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-preset");
        this.loadPreset(key);
      });
    });

    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => {
        this.textInput.value = "";
        this.currentPresetKey = null;
        this.updateInputMeta();
        window.app.hideResults();
      });
    }

    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener("click", () => this.handleAnalyze());
    }
  }

  loadPreset(presetKey) {
    if (MOCK_DATA.text[presetKey]) {
      this.currentPresetKey = presetKey;
      this.textInput.value = MOCK_DATA.text[presetKey].input;
      this.updateInputMeta();
      window.app.showToast("⚡ Sample Loaded: " + presetKey.replace("_", " ").toUpperCase());
    }
  }

  updateInputMeta() {
    const text = this.textInput.value;
    const len = text.length;
    this.charCount.textContent = `${len} character${len === 1 ? '' : 's'}`;

    const lower = text.toLowerCase();
    if (/(otp|pin|cvv|password)/.test(lower)) {
      this.heuristicHint.innerHTML = "⚠️ <strong style='color:#dc2626'>Asking for OTP / password</strong>";
    } else if (/(urgent|immediate|suspended|blocked|disconnected|arrest)/.test(lower)) {
      this.heuristicHint.innerHTML = "⚠️ <strong style='color:#d97706'>Urgent panic language found</strong>";
    } else if (/https?:\/\//.test(lower)) {
      this.heuristicHint.innerHTML = "🔗 <strong style='color:#2563eb'>Link detected</strong>";
    } else {
      this.heuristicHint.textContent = "";
    }
  }

  async handleAnalyze() {
    const content = this.textInput.value.trim();
    if (!content) {
      window.app.showToast("⚠️ Please paste or type a message to check!");
      this.textInput.focus();
      return;
    }

    try {
      window.app.startScanning();
      const result = await window.scamAPI.analyze("text", content, this.currentPresetKey);
      window.app.renderResults(result, "text");
    } catch (err) {
      window.app.showToast("❌ Error checking message: " + err.message);
    } finally {
      window.app.stopScanning();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.textShield = new TextShieldController();
});