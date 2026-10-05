/**
 * ScamShield - Comprehensive Balanced Dataset (Scams vs Genuine)
 */

const MOCK_DATA = {
  text: {
    electricity: {
      input: "Dear Consumer, your Electricity power will be disconnected tonight at 9:30 PM from the power office because your previous month's bill was not updated. Please immediately contact our Electricity Officer Mr. Verma at +91-98765-43210 to avoid disconnection. - State Power Corp.",
      result: {
        risk_score: 94,
        threat_level: "DANGEROUS SCAM",
        title: "Fake Electricity Bill Scam",
        summary: "A scammer is pretending to be the electricity office to scare you into calling their personal phone number and transferring money.",
        red_flags: [
          {
            title: "Fake Urgency Deadline",
            desc: "Threatens immediate power cutoff tonight to cause panic and bypass rational checking."
          },
          {
            title: "Personal Mobile Number",
            desc: "Official electricity boards never ask consumers to call a personal mobile number (+91-98765...)."
          },
          {
            title: "Coerced Money Transfer",
            desc: "Demands direct payment to an unauthorized personal phone number."
          }
        ],
        flagged_snippets: ["disconnected tonight at 9:30 PM", "call Electricity Officer at +91-98765-43210"],
        actions: [
          "Do NOT call the personal phone number in the message.",
          "Do NOT pay any money or share any banking codes.",
          "Check your genuine electricity bill status in your official state power app."
        ]
      }
    },
    kyc: {
      input: "URGENT ALERT: Your HDFC Bank NetBanking access has been suspended due to pending PAN/KYC document verification. Update your KYC within 24 hours at http://hdfc-kyc-verify-portal.in/login or your account will be permanently frozen.",
      result: {
        risk_score: 96,
        threat_level: "DANGEROUS SCAM",
        title: "Fake Bank KYC Phishing Link",
        summary: "This message contains a fraudulent lookalike website designed to steal your NetBanking password and OTP.",
        red_flags: [
          {
            title: "Fake Bank Website Domain",
            desc: "The domain 'hdfc-kyc-verify-portal.in' is fake. Genuine banks only use their official domain (hdfcbank.com)."
          },
          {
            title: "Threat of Account Freezing",
            desc: "Fabricates a 24-hour account suspension threat to pressure you into clicking."
          },
          {
            title: "Password Harvesting via Link",
            desc: "Banks never send SMS links asking you to enter login passwords or OTPs."
          }
        ],
        flagged_snippets: ["http://hdfc-kyc-verify-portal.in/login", "permanently frozen"],
        actions: [
          "Never click links sent in SMS claiming to update bank KYC.",
          "Never enter your password, PIN, or OTP on unverified links.",
          "Call the official phone number printed on the back of your debit card."
        ]
      }
    },
    job_scam: {
      input: "Congratulations! You have been selected for Part-Time YouTube Video Liking Job. Work from home 1 hour daily and earn Rs. 3,500 - 8,000 per day. No experience needed. Join Telegram channel @InstantDailyPayouts to claim your first Rs. 500 bonus now!",
      result: {
        risk_score: 91,
        threat_level: "DANGEROUS SCAM",
        title: "Work-From-Home Task Investment Fraud",
        summary: "Scammers promise easy money for liking videos to gain your trust, then steal large amounts through fake prepaid task deposits.",
        red_flags: [
          {
            title: "Unrealistic Income Offer",
            desc: "Offering ₹8,000 per day for liking videos is a classic trademark of task scams."
          },
          {
            title: "Anonymous Telegram Redirection",
            desc: "Moves victims to private Telegram channels where deposit demands are made."
          },
          {
            title: "Free Money Hook",
            desc: "Promises a free ₹500 bonus to lure you into depositing real money later."
          }
        ],
        flagged_snippets: ["earn Rs. 3,500 - 8,000 per day", "Join Telegram channel @InstantDailyPayouts"],
        actions: [
          "Do not join anonymous Telegram or WhatsApp work-from-home groups.",
          "Never deposit money to unlock 'salary payouts' or higher task rewards.",
          "Block and report the sender number."
        ]
      }
    },
    safe_amazon: {
      input: "Your Amazon delivery for order #402-8921821-1029182 with OTP 482910 will arrive today between 3 PM and 6 PM. Share this OTP with the delivery agent ONLY upon receiving the package. Track: https://amazon.in/orders",
      result: {
        risk_score: 15,
        threat_level: "LOOKS SAFE",
        title: "Legitimate Amazon Delivery Notification",
        summary: "This is an authentic delivery confirmation from Amazon with standard security guidance.",
        red_flags: [
          {
            title: "Official Amazon Domain Verified",
            desc: "The link points safely to the genuine amazon.in domain."
          },
          {
            title: "Best-Practice Security Advice",
            desc: "Explicitly advises you to share the OTP only after physical receipt of the package."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This message is legitimate and safe.",
          "Share the delivery OTP with the delivery person only after receiving your package."
        ]
      }
    },
    safe_doctor: {
      input: "Dear Rahul, your consultation appointment with Dr. Sharma (Cardiologist) at Apollo Clinic is confirmed for tomorrow at 10:30 AM. For rescheduling or queries, please call clinic desk at 022-28491029. - Apollo Healthcare",
      result: {
        risk_score: 5,
        threat_level: "LOOKS SAFE",
        title: "Legitimate Clinic Appointment Confirmation",
        summary: "Standard, safe appointment reminder from a recognized medical clinic with official landline contact.",
        red_flags: [
          {
            title: "No Coercion or Money Demand",
            desc: "Does not solicit OTPs, bank passwords, or urgent payment transfers."
          },
          {
            title: "Official Registered Landline",
            desc: "Provides a standard clinic desk phone number for appointment assistance."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This message is completely safe.",
          "Visit the clinic at the scheduled appointment time."
        ]
      }
    },
    safe_family: {
      input: "Hey! Just boarded the train from Delhi, will reach Chandigarh station around 8:30 PM. Mom said we'll have dinner at home. See you soon!",
      result: {
        risk_score: 3,
        threat_level: "LOOKS SAFE",
        title: "Genuine Personal Message",
        summary: "Normal conversation between family or friends with zero financial or phishing risk.",
        red_flags: [
          {
            title: "Safe Personal Chat",
            desc: "Contains normal travel details with no suspicious links, requests, or threats."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This message is completely safe.",
          "No security action needed."
        ]
      }
    }
  },

  call: {
    digital_arrest: {
      transcript: "This is Deputy Commissioner Rajesh Sharma from Central Cyber Crime Branch and Mumbai Police. We have seized a DHL courier parcel sent in your name containing 5 expired passports, 150 grams of illegal MDMA contraband, and 8 forged credit cards. An arrest warrant and Non-Bailable Warrant has been issued against your Aadhaar number. You are currently under digital arrest. Do not disconnect this call or talk to your family, or our tactical team will raid your residence within 30 minutes. You must immediately cooperate for fund verification.",
      result: {
        risk_score: 98,
        threat_level: "DANGEROUS SCAM",
        title: "Fake Police / 'Digital Arrest' Extortion",
        summary: "Scammers are impersonating police officers to terrify you. In genuine law, there is NO SUCH THING as a 'Digital Arrest'.",
        red_flags: [
          {
            title: "Fabricated 'Digital Arrest'",
            desc: "Indian Courts, Police, and CBI NEVER conduct arrests or judicial trials over phone or video calls."
          },
          {
            title: "Severe Contraband Scare Tactics",
            desc: "Falsely claims illegal drugs and fake passports were seized to cause immediate panic."
          },
          {
            title: "Psychological Isolation Demand",
            desc: "Demands you not hang up or talk to family to prevent you from seeking outside verification."
          },
          {
            title: "Demanding Money for 'Clearance'",
            desc: "Police never ask citizens to transfer money to any bank account for 'fund verification'."
          }
        ],
        flagged_snippets: ["under digital arrest", "raid your residence within 30 minutes", "Do not disconnect this call or talk to your family"],
        actions: [
          "HANG UP THE PHONE IMMEDIATELY. Real police never arrest people over phone calls.",
          "Do not panic. Talk to your family members or walk into your local police station.",
          "Report the caller's phone number immediately by dialing 1930 (National Cybercrime Helpline)."
        ]
      }
    },
    tech_support: {
      transcript: "Hello sir, I am calling from Microsoft Global Windows Security Support. Our automated telemetry server has detected 32 critical Trojan viruses and ransomware actively broadcasting your banking credentials from your computer right now. To prevent your hard drive from getting permanently locked and corrupted, you must immediately download our official remote diagnostic tool AnyDesk or TeamViewer and give me the 9-digit session code.",
      result: {
        risk_score: 95,
        threat_level: "DANGEROUS SCAM",
        title: "Fake Tech Support / AnyDesk Remote Access Scam",
        summary: "The caller is pretending to be from Microsoft to trick you into granting them complete remote screen control over your device and bank accounts.",
        red_flags: [
          {
            title: "Microsoft Never Cold-Calls Users",
            desc: "Microsoft, Apple, and Google NEVER make unsolicited phone calls regarding computer viruses."
          },
          {
            title: "Remote Access Software Trap",
            desc: "Demands installation of AnyDesk or TeamViewer, which gives the attacker full control of your banking screens."
          },
          {
            title: "Fake Virus Telemetry Panic",
            desc: "Uses frightening technical jargon ('32 trojans detected') to intimidate non-technical users."
          }
        ],
        flagged_snippets: ["Microsoft Global Windows Security Support", "download our official remote diagnostic tool AnyDesk", "give me the 9-digit session code"],
        actions: [
          "Hang up immediately. Never install remote desktop software on instructions from an unknown caller.",
          "If already installed, disconnect your computer from Wi-Fi immediately and uninstall AnyDesk.",
          "Change your online banking passwords from a separate, clean device."
        ]
      }
    },
    bank_otp: {
      transcript: "Good afternoon, I am calling from State Bank of India Card Fraud Prevention Unit. We noticed a suspicious international transaction of 45,000 rupees attempted on your credit card at an online electronics store in Dubai. We have temporarily blocked this charge. To cancel this fraudulent transaction and safeguard your account, our system has just sent a 6-digit cancellation OTP to your mobile. Please read out the OTP to me right now so I can cancel the charge.",
      result: {
        risk_score: 97,
        threat_level: "DANGEROUS SCAM",
        title: "Fake Bank Caller Intercepting OTP",
        summary: "The caller is posing as a bank fraud officer, but the OTP they are demanding will authorize an actual fraudulent theft from your account.",
        red_flags: [
          {
            title: "Soliciting Transaction OTP",
            desc: "There is NO SUCH THING as a 'cancellation OTP'. The code you received is an authorization code to complete a theft."
          },
          {
            title: "Bank Security Impersonation",
            desc: "Poses as a helpful bank officer to make you lower your guard."
          },
          {
            title: "Phantom Fraud Crisis",
            desc: "Fabricates an international Dubai transaction so you panic and surrender the code."
          }
        ],
        flagged_snippets: ["State Bank of India Card Fraud Prevention Unit", "read out the OTP to me right now so I can cancel the charge"],
        actions: [
          "NEVER share any OTP, PIN, or password with anyone over a call. Banks NEVER ask for OTPs.",
          "Hang up immediately. Open your official banking app directly to check your account status.",
          "Block your card in your official bank app if you shared any details."
        ]
      }
    },
    safe_delivery: {
      transcript: "Hello sir, I am your delivery rider from Zomato. I have reached outside your apartment main gate with your lunch order. The security guard is asking for your flat confirmation. Could you please let them know or collect the food at the lobby?",
      result: {
        risk_score: 6,
        threat_level: "LOOKS SAFE",
        title: "Legitimate Food Delivery Rider Call",
        summary: "Authentic delivery coordination call with normal location inquiries and zero fraud risk.",
        red_flags: [
          {
            title: "Standard Service Coordination",
            desc: "The rider is simply asking for gate access to hand over your order."
          },
          {
            title: "No Sensitive Data Demanded",
            desc: "No request for OTPs, bank details, passwords, or unexpected payments."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This call is genuine and safe.",
          "Confirm with your security guard or collect your order at the lobby."
        ]
      }
    },
    safe_bank_advisory: {
      transcript: "This is an automated informational service update from HDFC Bank. Your monthly account statement for the period ending August 2026 has been generated and sent to your registered email address. You can also view it securely inside your HDFC Mobile Banking app. Please remember, bank officials will never call you asking for your password, PIN, or OTP.",
      result: {
        risk_score: 5,
        threat_level: "LOOKS SAFE",
        title: "Authentic Bank Advisory Notification",
        summary: "Legitimate automated notification from HDFC Bank reminding user of standard security practices.",
        red_flags: [
          {
            title: "Official Anti-Fraud Advisory",
            desc: "Explicitly reminds customers that banks NEVER ask for passwords or OTPs."
          },
          {
            title: "Directs to Official App",
            desc: "Recommends viewing statements inside the verified official banking app."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This notification is legitimate and safe.",
          "View your statement inside your official banking app if desired."
        ]
      }
    }
  },

  image: {
    deepfake: {
      title: "AI-Generated Fake Portrait (Deepfake)",
      meta: "Sample-AI-Face-Forensics.jpg",
      result: {
        risk_score: 89,
        threat_level: "DANGEROUS SCAM",
        title: "AI Deepfake / Synthetic Human Face",
        summary: "This photo was generated by an AI computer model (like Midjourney / StyleGAN) and is NOT a real human photograph.",
        red_flags: [
          {
            title: "Bilateral Corneal Reflection Asymmetry",
            desc: "Light reflection spots inside both pupils do not align with a coherent single light source."
          },
          {
            title: "Smudged Ear & Jewelry Geometry",
            desc: "Earlobes and earrings blend unnaturally into the jawline texture without natural anatomical depth."
          },
          {
            title: "Unnatural Diffusion Skin Smoothing",
            desc: "Epidermis lacks natural skin pores and exhibits uniform generative diffusion blur."
          }
        ],
        flagged_snippets: ["Pupil reflection mismatch", "Hair perimeter diffusion blending", "Earring structure anomaly"],
        actions: [
          "Do NOT trust this image for identity verification, onboarding, or dating profiles.",
          "Do NOT send money or confidential documents to this person.",
          "Request a live interactive video verification call where the person waves their hand."
        ]
      }
    },
    fake_doc: {
      title: "Edited / Spliced Bank Transfer Slip",
      meta: "Altered-Receipt-Forensics.png",
      result: {
        risk_score: 93,
        threat_level: "DANGEROUS SCAM",
        title: "Digitally Altered Bank Payment Slip",
        summary: "This bank receipt screenshot was tampered with using photo editing software. The transfer amount has been forged.",
        red_flags: [
          {
            title: "Font Typography & Kerning Mismatch",
            desc: "The transfer amount (₹ 1,85,000) uses a different font weight and spacing than standard statement templates."
          },
          {
            title: "Compression Artifact Halo (ELA)",
            desc: "High-contrast fuzzy digital halos around the numerical fields reveal localized digital cutting and pasting."
          }
        ],
        flagged_snippets: ["Altered amount field", "Typography weight mismatch", "Localized JPEG compression halo"],
        actions: [
          "Do NOT dispatch goods, refund payments, or approve loans based on this screenshot.",
          "Check your bank account directly to see if the money has actually arrived in your statement.",
          "Request an official computer-generated PDF statement directly from the banking portal."
        ]
      }
    },
    authentic_id: {
      title: "Authentic National Identity Card",
      meta: "Verified-Government-ID.jpg",
      result: {
        risk_score: 8,
        threat_level: "LOOKS SAFE",
        title: "Authentic Physical Document Verified",
        summary: "Consistent optical illumination, intact guilloche security patterns, and uniform perspective geometry.",
        red_flags: [
          {
            title: "Natural Ambient Lighting & Perspective",
            desc: "Shadow gradients and card perspective match naturally across the physical card surface."
          },
          {
            title: "Intact Micro-Print & Clean Borders",
            desc: "No signs of digital cutting, pasting, font tampering, or compression halos around text."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This document appears genuine and authentic.",
          "Follow standard internal compliance procedures for normal identity recording."
        ]
      }
    },
    authentic_receipt: {
      title: "Genuine Supermarket Cash Receipt",
      meta: "Verified-Store-Receipt.jpg",
      result: {
        risk_score: 6,
        threat_level: "LOOKS SAFE",
        title: "Authentic Printed Store Receipt",
        summary: "Consistent thermal printer dot-matrix resolution, correct table baseline alignment, and uniform paper texture.",
        red_flags: [
          {
            title: "Consistent Thermal Print Resolution",
            desc: "All item lines and total amounts share identical print character density and alignment."
          },
          {
            title: "Authentic Store Metadata",
            desc: "Includes verifiable store tax registration number, timestamp, and barcode baseline."
          }
        ],
        flagged_snippets: [],
        actions: [
          "This receipt is genuine and unmodified.",
          "Safe for standard expense processing or warranty records."
        ]
      }
    }
  }
};