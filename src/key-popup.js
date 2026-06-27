/* AirIQ India — API Key Popup Manager */

const KeyManager = (() => {
  // ── Inject HTML ──────────────────────────────────────
  function injectHTML() {
    // Popup overlay
    const overlay = document.createElement("div");
    overlay.className = "key-overlay hidden";
    overlay.id = "key-overlay";
    overlay.innerHTML = `
      <div class="key-modal">
        <div class="key-modal-title">
          <i class="ti ti-key" style="color:#0D9488;font-size:18px"></i>
          Enter your Anthropic API Key
        </div>
        <div class="key-modal-sub">
          Your key is stored in browser memory only — it is <strong>never saved to GitHub</strong>
          or any server. You will need to re-enter it each session.
        </div>
        <div class="key-input-row">
          <input
            class="key-input"
            id="key-input"
            type="password"
            placeholder="gsk_..."
            autocomplete="off"
            spellcheck="false"
          />
          <button class="key-save-btn" onclick="KeyManager.save()">Save</button>
        </div>
        <div class="key-error" id="key-error">
          ⚠️ Please enter a valid Gemini key
        </div>
        <div class="key-modal-note">
          <i class="ti ti-info-circle" style="font-size:14px;flex-shrink:0;margin-top:1px"></i>
          Get a free key at
          <a href="https://console.groq.com" target="_blank" style="color:#0D9488;margin-left:3px">
            console.groq.com
          </a>
          &nbsp;→ API Keys → Create Key
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Allow Enter key to save
    document.getElementById("key-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") KeyManager.save();
    });

    // Inject nav indicator button
    const nav = document.querySelector("nav");
    if (nav) {
      const btn = document.createElement("button");
      btn.className = "key-indicator";
      btn.id = "key-indicator";
      btn.onclick = () => KeyManager.show();
      btn.innerHTML = `<span class="dot" id="key-dot"></span><span id="key-label">Add API Key</span>`;
      nav.appendChild(btn);
    }
  }

  // ── Show popup ───────────────────────────────────────
  function show() {
    document.getElementById("key-overlay").classList.remove("hidden");
    setTimeout(() => document.getElementById("key-input").focus(), 100);
  }

  // ── Hide popup ───────────────────────────────────────
  function hide() {
    document.getElementById("key-overlay").classList.add("hidden");
  }

  // ── Save key ─────────────────────────────────────────
  function save() {
    const input = document.getElementById("key-input");
    const key = input.value.trim();
    const errEl = document.getElementById("key-error");

    if (!key.startsWith("gsk_")) {
      errEl.classList.add("show");
      input.focus();
      return;
    }

    errEl.classList.remove("show");
    CONFIG.GROQ_API_KEY = key;
    input.value = "";

    // Update nav indicator
    document.getElementById("key-dot").classList.add("active");
    document.getElementById("key-label").textContent = "API Key ✓";

    hide();
  }

  // ── Init ─────────────────────────────────────────────
function init() {
    injectHTML();
    // Only show popup if no key in config
    if (!CONFIG.GROQ_API_KEY || CONFIG.GROQ_API_KEY.trim() === "") {
      show();
    } else {
      CONFIG.GROQ_API_KEY = CONFIG.GROQ_API_KEY;
      document.getElementById("key-dot").classList.add("active");
      document.getElementById("key-label").textContent = "API Key ✓";
    }
  }

  return { init, show, hide, save };
})();
