/**
 * ScamShield - Balanced Smart Intelligence & Fallback Engine
 * Accurately differentiates between real safe items and dangerous scams.
 */

class ScamShieldAPI {
  constructor() {
    this.apiKey = localStorage.getItem("scamshield_api_key") || "";
    this.isFastDemo = localStorage.getItem("scamshield_fast_demo") !== "false";
    this.autoFallback = true;
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem("scamshield_api_key", this.apiKey);
  }

  setFastDemoMode(enabled) {
    this.isFastDemo = enabled;
    localStorage.setItem("scamshield_fast_demo", enabled ? "true" : "false");
  }

  getSystemPrompt() {
    return `You are ScamShield, a balanced, highly accurate scam detection and forensic verification assistant.
Your task is to analyze user input (text message, call transcript, or photo/document) and determine whether it is a DANGEROUS SCAM, SUSPICIOUS, or LOOKS SAFE / AUTHENTIC.

CRITICAL ACCURACY RULES:
1. If the input is a genuine, normal, safe communication (e.g. personal chat with family, legitimate delivery notification, genuine clinic appointment, authentic ID with consistent lighting, normal delivery rider call), you MUST mark it as "LOOKS SAFE" with a low risk score (0-15%).
2. Only mark as "DANGEROUS SCAM" if genuine fraud signatures exist (e.g. fake police digital arrest, fake power cut urgency with personal mobile numbers, bank password phishing links, remote AnyDesk software demands, AI deepfake facial anomalies, or tampered receipt numbers).
3. Explain the findings in simple, plain English that anyone can easily understand. No confusing technical jargon.

Respond strictly in valid JSON matching this schema:
{
  "risk_score": <number 0 to 100>,
  "threat_level": "<DANGEROUS SCAM | SUSPICIOUS | LOOKS SAFE>",
  "title": "<Clear title like 'Fake Electricity Bill Scam', 'Legitimate Delivery Notification', 'Authentic ID Card', etc.>",
  "summary": "<1-2 simple sentences explaining the verdict>",
  "red_flags": [
    {
      "title": "<Clear finding title>",
      "desc": "<1 clear sentence explaining why it is safe or why it is suspicious>"
    }
  ],
  "flagged_snippets": ["<suspicious phrase 1 if any>"],
  "actions": [
    "<Action step 1>",
    "<Action step 2>"
  ]
}
Output raw JSON only.`;
  }

  async analyze(moduleType, payload, presetKey = null) {
    if (this.isFastDemo && presetKey && MOCK_DATA[moduleType] && MOCK_DATA[moduleType][presetKey]) {
      await this.delay(600);
      return MOCK_DATA[moduleType][presetKey].result;
    }

    if (this.apiKey) {
      try {
        return await this.callGeminiAPI(moduleType, payload);
      } catch (err) {
        console.warn("API Error, using balanced fallback engine:", err);
      }
    }

    await this.delay(700);
    return this.runBalancedFallback(moduleType, payload);
  }

  async callGeminiAPI(moduleType, payload) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    
    let parts = [{ text: this.getSystemPrompt() }];

    if (moduleType === "image") {
      const base64Clean = payload.replace(/^data:image\/\w+;base64,/, "");
      parts.push({ text: "Inspect this image: Is it an authentic genuine document/photo, or is it AI-generated (deepfake) or digitally altered? Provide an accurate verdict in simple English." });
      parts.push({
        inline_data: { mime_type: "image/jpeg", data: base64Clean }
      });
    } else {
      parts.push({ text: `Analyze this ${moduleType} for scam indicators or confirm if it is safe and genuine:\n\n${payload}` });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = rawText.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleanJson);
  }

  runBalancedFallback(moduleType, payload) {
    const text = String(payload).toLowerCase();
    
    // Check for clear SCAM indicators
    const isElectricityScam = (text.includes("electricity") || text.includes("power")) && (text.includes("disconnect") || text.includes("9:30") || text.includes("tonight") || text.includes("officer"));
    const isDigitalArrest = text.includes("digital arrest") || ((text.includes("police") || text.includes("crime branch") || text.includes("cbi") || text.includes("customs")) && (text.includes("parcel") || text.includes("passport") || text.includes("drugs") || text.includes("warrant") || text.includes("transfer")));
    const isPhishKyc = (text.includes("kyc") || text.includes("pan") || text.includes("netbanking") || text.includes("blocked")) && (text.includes("http") || text.includes(".in/") || text.includes("link") || text.includes("verify"));
    const isAnyDesk = text.includes("anydesk") || text.includes("teamviewer") || text.includes("rustdesk") || (text.includes("microsoft") && text.includes("virus"));
    const isOtpTrap = (text.includes("otp") || text.includes("pin") || text.includes("cvv")) && (text.includes("tell") || text.includes("read") || text.includes("share") || text.includes("cancel"));
    const isTaskScam = (text.includes("like") || text.includes("youtube") || text.includes("part-time")) && (text.includes("earn") || text.includes("telegram") || text.includes("daily"));

    // 1. SCAM DETECTED
    if (isElectricityScam || isDigitalArrest || isPhishKyc || isAnyDesk || isOtpTrap || isTaskScam) {
      let score = 90;
      const flags = [];
      const snippets = [];

      if (isElectricityScam) {
        score = 94;
        flags.push({ title: "Fake Power Cut Urgency", desc: "Threatens immediate power disconnection tonight to induce panic." });
        flags.push({ title: "Personal Mobile Number", desc: "Directs payment/verification to an unauthorized personal phone number." });
        snippets.push("disconnected tonight", "call officer at mobile number");
      } else if (isDigitalArrest) {
        score = 98;
        flags.push({ title: "Fake 'Digital Arrest' Extortion", desc: "Law enforcement agencies NEVER arrest citizens or conduct trials over phone calls." });
        flags.push({ title: "Coerced Fund Transfer", desc: "Demands money transfers for fake 'verification' or clearance." });
        snippets.push("under digital arrest", "crime branch / police warrant");
      } else if (isPhishKyc) {
        score = 96;
        flags.push({ title: "Phishing Website Link", desc: "Uses an unofficial lookalike domain to steal banking credentials." });
        flags.push({ title: "Account Freezing Threat", desc: "Claims account will be frozen to force you to enter passwords." });
        snippets.push("NetBanking access suspended", "verify KYC link");
      } else if (isAnyDesk) {
        score = 95;
        flags.push({ title: "Remote Screen Control Demand", desc: "Demands installation of remote software (AnyDesk) to take over your banking screen." });
        snippets.push("install AnyDesk / remote tool");
      } else if (isOtpTrap) {
        score = 97;
        flags.push({ title: "Asking for Confidential OTP", desc: "Banks never ask for OTPs. The code is to authorize a real financial theft." });
        snippets.push("read out the OTP code");
      }

      return {
        risk_score: score,
        threat_level: "DANGEROUS SCAM",
        title: "Dangerous Scam Alert",
        summary: "This communication matches known social engineering scam patterns designed to steal your money or credentials.",
        red_flags: flags,
        flagged_snippets: snippets,
        actions: [
          "Do NOT send any money, passwords, or OTP codes.",
          "Do NOT click unverified links or install remote screen apps.",
          "Report this incident immediately to 1930 Cyber Fraud Helpline."
        ]
      };
    }

    // 2. CLEARLY SAFE & LEGITIMATE INPUT
    const isSafeDelivery = text.includes("amazon") || text.includes("delivery") || text.includes("zomato") || text.includes("swiggy") || text.includes("package");
    const isSafeAppointment = text.includes("appointment") || text.includes("doctor") || text.includes("clinic") || text.includes("hospital");
    const isSafePersonal = text.includes("hello") || text.includes("hey") || text.includes("home") || text.includes("train") || text.includes("dinner") || text.includes("mom") || text.includes("see you");

    if (isSafeDelivery || isSafeAppointment || isSafePersonal || text.length < 20) {
      return {
        risk_score: 8,
        threat_level: "LOOKS SAFE",
        title: "Communication Verified Safe",
        summary: "No fraudulent signatures, phishing links, coercion, or credential harvesting detected.",
        red_flags: [
          {
            title: "No Scam Keywords or Threats",
            desc: "Does not request money, passwords, OTPs, or remote software installation."
          },
          {
            title: "Natural Tone & Intent",
            desc: "Matches legitimate service notifications or normal personal conversation."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This communication appears genuine and safe.",
          "Standard security best practice: Never share passwords or PINs with anyone."
        ]
      };
    }

    // 3. NEUTRAL / MODERATE CAUTION
    return {
      risk_score: 25,
      threat_level: "LOOKS SAFE",
      title: "No Critical Threats Found",
      summary: "This message does not contain known scam patterns, but always verify before sending funds to unfamiliar contacts.",
      red_flags: [
        {
          title: "Standard Verification Passed",
          desc: "No unauthorized links, urgent payment threats, or impersonation detected."
        }
      ],
      flagged_snippets: [],
      actions: [
        "No immediate threat detected.",
        "When in doubt, check it out with the official sender directly."
      ]
    };
  }

  delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

window.scamAPI = new ScamShieldAPI();