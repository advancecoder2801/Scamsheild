/**
 * ScamShield - Module 3: Image & Photo Forensics Controller
 * Renders realistic authentic documents and genuine AI-diagnostic previews.
 */

class ImageShieldController {
  constructor() {
    this.fileInput = document.getElementById("imageFileInput");
    this.dropZone = document.getElementById("dropZone");
    this.dropPrompt = document.getElementById("dropPrompt");
    this.previewArea = document.getElementById("imagePreviewArea");
    this.canvas = document.getElementById("imageCanvas");
    this.removeBtn = document.getElementById("removeImageBtn");
    this.analyzeBtn = document.getElementById("analyzeImageBtn");
    this.metaText = document.getElementById("imageMetaTag");

    this.currentBase64 = null;
    this.currentPresetKey = null;

    this.init();
  }

  init() {
    if (!this.dropZone) return;

    this.dropPrompt.addEventListener("click", () => this.fileInput.click());

    this.fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) this.processFile(file);
    });

    ['dragenter', 'dragover'].forEach(name => {
      this.dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        this.dropZone.classList.add("drag-over");
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      this.dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        this.dropZone.classList.remove("drag-over");
      });
    });

    this.dropZone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) this.processFile(files[0]);
    });

    if (this.removeBtn) {
      this.removeBtn.addEventListener("click", () => this.resetImage());
    }

    const presetButtons = document.querySelectorAll("#image-panel .btn-sample");
    presetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-preset");
        this.loadPreset(key);
      });
    });

    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener("click", () => this.handleAnalyze());
    }
  }

  processFile(file) {
    if (!file.type.startsWith("image/")) {
      window.app.showToast("⚠️ Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    this.currentPresetKey = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentBase64 = e.target.result;
      this.renderImageToCanvas(this.currentBase64, file.name);
    };
    reader.readAsDataURL(file);
  }

  renderImageToCanvas(src, filename) {
    const img = new Image();
    img.onload = () => {
      const ctx = this.canvas.getContext("2d");
      const maxWidth = 460;
      const scale = Math.min(1, maxWidth / img.width);
      
      this.canvas.width = img.width * scale;
      this.canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      this.metaText.textContent = `${filename} (${Math.round(img.width)}x${Math.round(img.height)})`;
      this.dropPrompt.style.display = "none";
      this.previewArea.style.display = "flex";
      window.app.showToast("📸 Photo ready for verification");
    };
    img.src = src;
  }

  loadPreset(presetKey) {
    if (!MOCK_DATA.image[presetKey]) return;
    this.currentPresetKey = presetKey;
    const item = MOCK_DATA.image[presetKey];

    this.canvas.width = 440;
    this.canvas.height = 250;
    const ctx = this.canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 440, 250);

    if (presetKey === "deepfake") {
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, 440, 250);

      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.arc(220, 115, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.strokeRect(180, 95, 30, 20);
      ctx.strokeRect(230, 95, 30, 20);

      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText("CORNEAL SPECULAR ASYMMETRY", 120, 68);
      ctx.fillText("DIFFUSION TEXTURE SMOOTHING", 120, 205);
      
      ctx.strokeStyle = "#ef4444";
      ctx.strokeRect(140, 45, 160, 160);

    } else if (presetKey === "fake_doc") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, 20, 400, 210);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, 400, 210);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillText("HDFC BANK • TRANSFER CONFIRMATION", 40, 52);
      
      ctx.font = "11px Inter, sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Ref: TXN-8921820    Status: SUCCESS", 40, 75);

      ctx.fillStyle = "#fef2f2";
      ctx.fillRect(35, 100, 370, 36);
      ctx.strokeStyle = "#dc2626";
      ctx.strokeRect(35, 100, 370, 36);

      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.fillText("TRANSFER AMOUNT: ₹ 1,85,000.00", 50, 124);

      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = "#dc2626";
      ctx.fillText("[🚩 ALERT: Font Kerning & Compression Mismatch]", 50, 155);

    } else if (presetKey === "authentic_id") {
      ctx.fillStyle = "#f0fdf4";
      ctx.fillRect(20, 20, 400, 210);
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 400, 210);

      ctx.fillStyle = "#15803d";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText("NATIONAL CITIZEN IDENTITY CARD", 45, 52);

      ctx.fillStyle = "#dcfce7";
      ctx.fillRect(45, 70, 65, 80);
      ctx.strokeStyle = "#86efac";
      ctx.strokeRect(45, 70, 65, 80);
      
      ctx.fillStyle = "#15803d";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillText("PHOTO", 60, 115);

      ctx.font = "11px Inter, sans-serif";
      ctx.fillStyle = "#1e293b";
      ctx.fillText("Name: RAHUL M. SHARMA", 125, 88);
      ctx.fillText("DOB: 14/08/1998    Gender: M", 125, 110);
      ctx.fillText("ID No: XXXX-XXXX-4829", 125, 132);

      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.arc(360, 110, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillText("VERIFIED", 340, 113);

      ctx.fillStyle = "#15803d";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.fillText("✔ OPTICAL MICRO-PRINT INTACT • NO TAMPERING", 45, 195);

    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(40, 15, 360, 220);
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(40, 15, 360, 220);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 12px 'Courier New', monospace";
      ctx.fillText("SUPERMART RETAIL STORE", 110, 40);
      ctx.font = "10px 'Courier New', monospace";
      ctx.fillText("GSTIN: 27AAAAA0000A1Z5 | Bill #48291", 80, 58);
      ctx.fillText("---------------------------------------", 50, 72);
      ctx.fillText("1. Fresh Milk 1L              Rs. 66.00", 50, 90);
      ctx.fillText("2. Whole Wheat Bread          Rs. 45.00", 50, 108);
      ctx.fillText("3. Organic Apples 1kg        Rs. 180.00", 50, 126);
      ctx.fillText("---------------------------------------", 50, 142);
      ctx.font = "bold 11px 'Courier New', monospace";
      ctx.fillText("TOTAL PAID (UPI):            Rs. 291.00", 50, 160);
      
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "#16a34a";
      ctx.fillText("✔ Authentic thermal print density verified", 65, 195);
    }

    this.currentBase64 = this.canvas.toDataURL("image/png");
    this.metaText.textContent = item.meta;
    this.dropPrompt.style.display = "none";
    this.previewArea.style.display = "flex";

    window.app.showToast("⚡ Sample Loaded: " + item.title);
  }

  resetImage() {
    this.currentBase64 = null;
    this.currentPresetKey = null;
    this.fileInput.value = "";
    this.dropPrompt.style.display = "block";
    this.previewArea.style.display = "none";
    window.app.hideResults();
  }

  async handleAnalyze() {
    if (!this.currentBase64) {
      window.app.showToast("⚠️ Please upload a photo or click a sample first!");
      return;
    }

    try {
      window.app.startScanning();
      const result = await window.scamAPI.analyze("image", this.currentBase64, this.currentPresetKey);
      window.app.renderResults(result, "image");
    } catch (err) {
      window.app.showToast("❌ Error checking image: " + err.message);
    } finally {
      window.app.stopScanning();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.imageShield = new ImageShieldController();
});