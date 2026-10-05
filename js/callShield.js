/**
 * ScamShield - Module 2: Call & Audio Controller
 */

class CallShieldController {
  constructor() {
    this.micBtn = document.getElementById("micRecordBtn");
    this.micStatus = document.getElementById("micStatusText");
    this.transcriptArea = document.getElementById("liveTranscriptArea");
    this.waveformCanvas = document.getElementById("waveformCanvas");
    this.clearTranscriptBtn = document.getElementById("clearTranscriptBtn");
    this.analyzeBtn = document.getElementById("analyzeCallBtn");

    this.isRecording = false;
    this.recognition = null;
    this.animationId = null;
    this.currentPresetKey = null;

    this.initSpeechRecognition();
    this.initEvents();
    this.initWaveformCanvas();
  }

  initSpeechRecognition() {
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechClass) {
      this.recognition = new SpeechClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.transcriptArea.value += (this.transcriptArea.value ? " " : "") + event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          window.app.showToast("⚠️ Microphone access denied in browser.");
          this.stopRecording();
        }
      };

      this.recognition.onend = () => {
        if (this.isRecording) {
          try { this.recognition.start(); } catch (e) {}
        }
      };
    }
  }

  initEvents() {
    if (this.micBtn) {
      this.micBtn.addEventListener("click", () => this.toggleRecording());
    }

    if (this.clearTranscriptBtn) {
      this.clearTranscriptBtn.addEventListener("click", () => {
        this.transcriptArea.value = "";
        this.currentPresetKey = null;
        window.app.hideResults();
      });
    }

    const presetButtons = document.querySelectorAll("#call-panel .btn-sample");
    presetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-preset");
        this.loadPreset(key);
      });
    });

    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener("click", () => this.handleAnalyze());
    }

    if (this.transcriptArea) {
      this.transcriptArea.addEventListener("input", () => {
        this.currentPresetKey = null;
      });
    }
  }

  toggleRecording() {
    if (this.isRecording) this.stopRecording();
    else this.startRecording();
  }

  startRecording() {
    this.isRecording = true;
    this.currentPresetKey = null;
    this.micBtn.classList.add("recording");
    this.micStatus.textContent = "● Recording... (Click to stop)";
    this.micStatus.style.color = "#dc2626";

    if (this.recognition) {
      try { this.recognition.start(); } catch (e) {}
    } else {
      window.app.showToast("⚠️ Live mic speech recognition not supported in this browser; paste what the caller said.");
    }

    this.startWaveformAnimation();
  }

  stopRecording() {
    this.isRecording = false;
    this.micBtn.classList.remove("recording");
    this.micStatus.textContent = "Click mic to record live";
    this.micStatus.style.color = "var(--text-muted)";

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }

    this.stopWaveformAnimation();
  }

  loadPreset(presetKey) {
    if (MOCK_DATA.call[presetKey]) {
      this.currentPresetKey = presetKey;
      this.transcriptArea.value = MOCK_DATA.call[presetKey].transcript;
      window.app.showToast("⚡ Sample Loaded: " + presetKey.replace("_", " ").toUpperCase());
    }
  }

  initWaveformCanvas() {
    if (!this.waveformCanvas) return;
    const ctx = this.waveformCanvas.getContext("2d");
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, this.waveformCanvas.width, this.waveformCanvas.height);
  }

  startWaveformAnimation() {
    if (!this.waveformCanvas) return;
    const ctx = this.waveformCanvas.getContext("2d");
    const width = this.waveformCanvas.width;
    const height = this.waveformCanvas.height;

    let offset = 0;
    const draw = () => {
      if (!this.isRecording) return;
      ctx.fillStyle = "rgba(241, 245, 249, 0.4)";
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2563eb";
      ctx.beginPath();

      const sliceWidth = width / 24;
      let x = 0;

      for (let i = 0; i < 24; i++) {
        const amplitude = (Math.sin(i * 0.4 + offset) + Math.sin(i * 0.8 + offset * 1.5)) * 10;
        const y = height / 2 + amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
      offset += 0.15;
      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  stopWaveformAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.initWaveformCanvas();
  }

  async handleAnalyze() {
    if (this.isRecording) this.stopRecording();

    const transcript = this.transcriptArea.value.trim();
    if (!transcript) {
      window.app.showToast("⚠️ Please record audio or paste what the caller said!");
      this.transcriptArea.focus();
      return;
    }

    try {
      window.app.startScanning();
      const result = await window.scamAPI.analyze("call", transcript, this.currentPresetKey);
      window.app.renderResults(result, "call");
    } catch (err) {
      window.app.showToast("❌ Error checking call: " + err.message);
    } finally {
      window.app.stopScanning();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.callShield = new CallShieldController();
});