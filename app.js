"use strict";

const EVM_REGEX = /^0x[a-fA-F0-9]{40}$/;
const BTC_REGEX = /^(bc1[ac-hj-np-z02-9]{11,71}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/;
const SOLANA_ADDR_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const SOLANA_TOKEN_PROGRAMS = [
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
];

const DEFAULT_APP_CONFIG = {
  version: 3,
  provider: { alchemyApiKey: "", solana: { enabled: true } },
  chains: {
    ethereum: { key: "ethereum", name: "Ethereum", type: "evm", alchemyNetwork: "eth-mainnet", rpcs: ["https://ethereum-rpc.publicnode.com"] },
    arbitrum: { key: "arbitrum", name: "Arbitrum", type: "evm", alchemyNetwork: "arb-mainnet", rpcs: ["https://arb1.arbitrum.io/rpc"] },
    base: { key: "base", name: "Base", type: "evm", alchemyNetwork: "base-mainnet", rpcs: ["https://mainnet.base.org"] },
    optimism: { key: "optimism", name: "Optimism", type: "evm", alchemyNetwork: "opt-mainnet", rpcs: ["https://mainnet.optimism.io"] },
    bsc: { key: "bsc", name: "BSC", type: "evm", alchemyNetwork: "bnb-mainnet", rpcs: ["https://bsc-dataseed.binance.org"] },
    solana: { key: "solana", name: "Solana", type: "solana", alchemyNetwork: "solana-mainnet", rpcs: ["https://api.mainnet-beta.solana.com"] },
    bitcoin: {
      key: "bitcoin",
      name: "Bitcoin",
      type: "bitcoin",
      alchemyBase: "https://bitcoin-mainnet.g.alchemy.com/v2",
      apiEndpoints: ["https://blockstream.info/api", "https://mempool.space/api", "https://mempool.emzy.de/api"]
    }
  },
  groups: {
    BTC: {
      key: "BTC", name: "BTC Basket", decimals: 8, members: [
        { kind: "native", chain: "bitcoin", symbol: "BTC", decimals: 8 },
        { kind: "token", chain: "arbitrum", symbol: "WBTC", address: "0x2f2a2543b76a4166549f7aab2e75bef0ae0f5b0f", decimals: 8 },
        { kind: "token", chain: "base", symbol: "WBTC", address: "0x0555e30da8f98308edb960aa94c0db47230d2b9c", decimals: 8 },
        { kind: "token", chain: "base", symbol: "cbBTC", address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", decimals: 8 },
        { kind: "token", chain: "optimism", symbol: "WBTC", address: "0x68f180fcce6836688e9084f035309e29bf0a2095", decimals: 8 },
        { kind: "token", chain: "bsc", symbol: "BTCB", address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", decimals: 18 }
      ]
    },
    ETH: {
      key: "ETH", name: "ETH Basket", decimals: 18, members: [
        { kind: "native", chain: "ethereum", symbol: "ETH", decimals: 18 },
        { kind: "token", chain: "ethereum", symbol: "WETH", address: "0xc02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
        { kind: "native", chain: "arbitrum", symbol: "ETH", decimals: 18 },
        { kind: "token", chain: "arbitrum", symbol: "WETH", address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", decimals: 18 },
        { kind: "native", chain: "base", symbol: "ETH", decimals: 18 },
        { kind: "token", chain: "base", symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 },
        { kind: "native", chain: "optimism", symbol: "ETH", decimals: 18 },
        { kind: "token", chain: "optimism", symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 }
      ]
    },
    BNB: {
      key: "BNB", name: "BNB Basket", decimals: 18, members: [
        { kind: "native", chain: "bsc", symbol: "BNB", decimals: 18 },
        { kind: "token", chain: "bsc", symbol: "WBNB", address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", decimals: 18 }
      ]
    },
    SOL: {
      key: "SOL", name: "SOL Basket", decimals: 9, members: [
        { kind: "native", chain: "solana", symbol: "SOL", decimals: 9 }
      ]
    }
  },
  targets: { BTC: "0.2", ETH: "0", BNB: "0", SOL: "0" },
  assetAliases: {
    BTC: [
      { chain: "bitcoin", kind: "native", symbol: "BTC", decimals: 8 },
      { chain: "ethereum", kind: "token", symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
      { chain: "arbitrum", kind: "token", symbol: "WBTC", address: "0x2f2a2543b76a4166549f7aab2e75bef0ae0f5b0f", decimals: 8 },
      { chain: "base", kind: "token", symbol: "WBTC", address: "0x0555e30da8f98308edb960aa94c0db47230d2b9c", decimals: 8 },
      { chain: "base", kind: "token", symbol: "cbBTC", address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", decimals: 8 },
      { chain: "optimism", kind: "token", symbol: "WBTC", address: "0x68f180fcce6836688e9084f035309e29bf0a2095", decimals: 8 },
      { chain: "bsc", kind: "token", symbol: "BTCB", address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", decimals: 18 }
    ],
    ETH: [
      { chain: "ethereum", kind: "native", symbol: "ETH", decimals: 18 },
      { chain: "ethereum", kind: "token", symbol: "WETH", address: "0xc02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
      { chain: "arbitrum", kind: "native", symbol: "ETH", decimals: 18 },
      { chain: "arbitrum", kind: "token", symbol: "WETH", address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", decimals: 18 },
      { chain: "base", kind: "native", symbol: "ETH", decimals: 18 },
      { chain: "base", kind: "token", symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 },
      { chain: "base", kind: "token", symbol: "msETH", address: "0x7Ba6F01772924a82D9626c126347A28299E98c98", decimals: 18 },
      { chain: "optimism", kind: "native", symbol: "ETH", decimals: 18 },
      { chain: "optimism", kind: "token", symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 }
    ],
    BNB: [
      { chain: "bsc", kind: "native", symbol: "BNB", decimals: 18 },
      { chain: "bsc", kind: "token", symbol: "WBNB", address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", decimals: 18 }
    ],
    SOL: [
      { chain: "solana", kind: "native", symbol: "SOL", decimals: 9 },
      { chain: "base", kind: "token", symbol: "uSOL", address: "0x9b8df6e244526ab5f6e6400d331db28c8fdddb55", decimals: 18 }
    ]
  }
};

const STORAGE_KEYS = {
  addresses: "wallet_tracker_addresses_v2",
  legacyAddresses: "btc_scanner_addresses_v1",
  lastScan: "wallet_tracker_last_scan_v2",
  legacyLastScan: "btc_scanner_last_scan_v1",
  config: "wallet_tracker_config_v2"
};

const CACHE_MAX_AGE_MS = 60 * 60 * 1000;
let APP_CONFIG = clone(DEFAULT_APP_CONFIG);
let walletList = [];
let walletDataByAddress = {};
let selectedGroupKey = "";
let selectedDisplayGroup = "ALL";
let startupHintDismissed = false;
let groupUsdPriceByKey = {};
let usdPriceFetchNonce = 0;
let lastRenderedRows = [];
let lastRenderedErrors = [];

const el = {
  scanBtn: q("#scanBtn"), copyWalletsBtn: q("#copyWalletsBtn"), addWalletBtn: q("#addWalletBtn"), resetRpcBtn: q("#resetRpcBtn"), status: q("#status"),
  walletInput: q("#walletInput"), walletChips: q("#walletChips"), resultsBody: q("#resultsBody"),
  errorSummary: q("#errorSummary"), breakdownBars: q("#breakdownBars"),
  holdingsPie: q("#holdingsPie"), holdingsPieCenter: q("#holdingsPieCenter"), holdingsLegend: q("#holdingsLegend"),
  groupTabs: q("#groupTabs"),
  floatingTooltip: q("#floatingTooltip"),
  sourceSummary: q("#sourceSummary"),
  startupHint: q("#startupHint"), startupHintCloseBtn: q("#startupHintCloseBtn"),
  openSettingsBtn: q("#openSettingsBtn"), closeSettingsBtn: q("#closeSettingsBtn"), settingsModal: q("#settingsModal"),
  fakeChatbotBtn: q("#fakeChatbotBtn"), fakeChatbotMsg: q("#fakeChatbotMsg"),
  alchemyApiKey: q("#alchemyApiKey"), groupSelect: q("#groupSelect"), groupKey: q("#groupKeyInput"), groupName: q("#groupNameInput"),
  groupDecimals: q("#groupDecimalsInput"), groupTarget: q("#groupTargetInput"), newGroupKey: q("#newGroupKeyInput"),
  saveGroupBtn: q("#saveGroupBtn"), addGroupBtn: q("#addGroupBtn"), deleteGroupBtn: q("#deleteGroupBtn"), applyAliasPresetBtn: q("#applyAliasPresetBtn"),
  memberKind: q("#memberKind"), memberChain: q("#memberChain"), memberSymbol: q("#memberSymbol"), memberAddress: q("#memberAddress"),
  memberDecimals: q("#memberDecimals"), addMemberBtn: q("#addMemberBtn"), memberList: q("#memberList"),
  rpcEthereum: q("#rpcEthereum"), rpcArbitrum: q("#rpcArbitrum"), rpcBase: q("#rpcBase"), rpcOptimism: q("#rpcOptimism"), rpcBsc: q("#rpcBsc"), rpcSolana: q("#rpcSolana")
};

const rpcInputs = { ethereum: el.rpcEthereum, arbitrum: el.rpcArbitrum, base: el.rpcBase, optimism: el.rpcOptimism, bsc: el.rpcBsc, solana: el.rpcSolana };
const COIN_LOGOS = {
  WBTC: "assets/logos/coins/wbtc.png",
  cbBTC: "assets/logos/coins/cbbtc.webp",
  BTCB: "assets/logos/coins/btcb.png",
  BTC: "assets/logos/coins/btc.png",
  ETH: "assets/logos/coins/eth.png",
  WETH: "assets/logos/coins/weth.png",
  msETH: "assets/logos/coins/mseth.png",
  BNB: "assets/logos/coins/bnb.png",
  WBNB: "assets/logos/coins/wbnb.png",
  SOL: "assets/logos/coins/sol.png",
  uSOL: "assets/logos/coins/usol.png"
};
const CHAIN_LOGOS = {
  Ethereum: "assets/logos/chains/ethereum.png",
  Arbitrum: "assets/logos/chains/arbitrum.png",
  Base: "assets/logos/chains/base.png",
  Optimism: "assets/logos/chains/optimism.png",
  BSC: "assets/logos/chains/bsc.png",
  Solana: "assets/logos/chains/solana.png",
  Bitcoin: "assets/logos/chains/bitcoin.png"
};
const FAKE_CHATBOT_QUIPS = [
  "Huat arrr....!!",
  "Shinzou wo sasageyo!!!!",
  "心臓を捧げよ!",
  "To be or not to be, that is not a question.",
  "Music... is emotion, controlled emotion."
];

bootstrap();

function bootstrap() {
  if (!el.scanBtn) return;
  el.groupKey.readOnly = true;
  loadConfig();
  applyAliasPreset();
  loadWallets();
  fillRpcInputs();
  el.alchemyApiKey.value = APP_CONFIG.provider.alchemyApiKey || "";
  populateMemberChainOptions();
  renderGroupSelect();
  renderGroupEditor();
  renderGroupTabs();
  renderWalletChips();
  syncMemberKindUi();
  refreshStartupHint();
  bindEvents();
  initializeFromCacheOrScan();
}

function bindEvents() {
  el.scanBtn.addEventListener("click", runScan);
  if (el.copyWalletsBtn) {
    el.copyWalletsBtn.addEventListener("click", copyWalletAddresses);
  }
  el.addWalletBtn.addEventListener("click", addWalletsFromInputAndScan);
  el.walletInput.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); addWalletsFromInputAndScan(); } });
  el.alchemyApiKey.addEventListener("input", refreshStartupHint);
  el.walletChips.addEventListener("click", handleChipRemoveClick);
  el.groupSelect.addEventListener("change", () => { selectedGroupKey = el.groupSelect.value; renderGroupEditor(); });
  el.groupTabs.addEventListener("click", handleGroupTabClick);
  el.memberKind.addEventListener("change", syncMemberKindUi);
  el.addGroupBtn.addEventListener("click", addGroup);
  el.saveGroupBtn.addEventListener("click", saveGroup);
  el.deleteGroupBtn.addEventListener("click", deleteGroup);
  if (el.applyAliasPresetBtn) el.applyAliasPresetBtn.addEventListener("click", () => {
    const added = applyAliasPreset();
    renderGroupSelect();
    renderGroupEditor();
    renderGroupTabs();
    recompute();
    setStatus(added > 0 ? `Alias preset applied (${added} new member(s)).` : "Alias preset already applied.");
  });
  el.addMemberBtn.addEventListener("click", addMember);
  el.memberList.addEventListener("click", removeMember);
  el.resetRpcBtn.addEventListener("click", () => { for (const k of Object.keys(rpcInputs)) rpcInputs[k].value = DEFAULT_APP_CONFIG.chains[k].rpcs.join("\n"); setStatus("RPC fallback defaults restored."); });
  el.fakeChatbotBtn.addEventListener("click", () => {
    const idx = Math.floor(Math.random() * FAKE_CHATBOT_QUIPS.length);
    el.fakeChatbotMsg.textContent = FAKE_CHATBOT_QUIPS[idx];
    el.fakeChatbotMsg.classList.add("show");
    setTimeout(() => el.fakeChatbotMsg.classList.remove("show"), 2600);
  });
  if (el.openSettingsBtn && el.settingsModal) {
    el.openSettingsBtn.addEventListener("click", openSettingsModal);
  }
  if (el.closeSettingsBtn && el.settingsModal) {
    el.closeSettingsBtn.addEventListener("click", closeSettingsModal);
  }
  if (el.settingsModal) {
    el.settingsModal.addEventListener("click", (event) => {
      if (event.target === el.settingsModal) {
        closeSettingsModal();
      }
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && el.settingsModal && el.settingsModal.classList.contains("show")) {
      closeSettingsModal();
    }
  });
  if (el.breakdownBars) {
    el.breakdownBars.addEventListener("mousemove", handleBreakdownTooltipMove);
    el.breakdownBars.addEventListener("mouseleave", hideFloatingTooltip);
  }
  if (el.startupHintCloseBtn) {
    el.startupHintCloseBtn.addEventListener("click", () => {
      startupHintDismissed = true;
      refreshStartupHint();
    });
  }
}

function q(selector) { return document.querySelector(selector); }
async function copyWalletAddresses() {
  if (!walletList.length) {
    setStatus("No tracked wallet addresses to copy.", true);
    return;
  }
  const text = walletList.join("\n");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (!ok) throw new Error("Clipboard copy failed");
    }
    setStatus(`Copied ${walletList.length} wallet address(es) to clipboard.`);
  } catch (_e) {
    setStatus("Unable to copy addresses. Your browser blocked clipboard access.", true);
  }
}
function showFloatingTooltip(text, clientX, clientY) {
  if (!el.floatingTooltip || !text) return;
  const tip = el.floatingTooltip;
  tip.textContent = text;
  tip.classList.add("show");

  const pad = 14;
  const tipRect = tip.getBoundingClientRect();
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  let x = clientX + pad;
  let y = clientY + pad;
  if (x + tipRect.width > vw - 8) x = Math.max(8, clientX - tipRect.width - pad);
  if (y + tipRect.height > vh - 8) y = Math.max(8, clientY - tipRect.height - pad);
  tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}
function hideFloatingTooltip() {
  if (!el.floatingTooltip) return;
  el.floatingTooltip.classList.remove("show");
  el.floatingTooltip.style.transform = "translate(-9999px, -9999px)";
}
function handleBreakdownTooltipMove(event) {
  const row = event.target.closest(".break-row[data-tooltip]");
  if (!row) {
    hideFloatingTooltip();
    return;
  }
  showFloatingTooltip(row.getAttribute("data-tooltip") || "", event.clientX, event.clientY);
}
function openSettingsModal() { if (!el.settingsModal) return; el.settingsModal.classList.add("show"); el.settingsModal.setAttribute("aria-hidden", "false"); }
function closeSettingsModal() { if (!el.settingsModal) return; el.settingsModal.classList.remove("show"); el.settingsModal.setAttribute("aria-hidden", "true"); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function s(v) { return String(v ?? "").trim(); }
function refreshStartupHint() {
  if (!el.startupHint) return;
  const hasWallets = walletList.length > 0;
  const hasApiKey = Boolean(s((el.alchemyApiKey && el.alchemyApiKey.value) || APP_CONFIG.provider.alchemyApiKey || ""));
  const shouldShow = !startupHintDismissed && !hasWallets && !hasApiKey;
  el.startupHint.classList.toggle("show", shouldShow);
}
function shortAddr(v) { return !v ? "" : v.length < 16 ? v : `${v.slice(0, 8)}...${v.slice(-6)}`; }
function clampInt(value, min, max, fallback) { const n = Number(value); return Number.isInteger(n) && n >= min && n <= max ? n : fallback; }
function formatUnits(value, decimals) { const neg = value < 0n; const n = neg ? -value : value; const base = 10n ** BigInt(decimals); const w = n / base; const f = n % base; if (!f) return `${neg ? "-" : ""}${w}`; return `${neg ? "-" : ""}${w}.${f.toString().padStart(decimals, "0").replace(/0+$/, "")}`; }
function formatFixedUnits(value, decimals, places = 3) {
  const txt = formatUnits(value, decimals);
  const neg = txt.startsWith("-");
  const raw = neg ? txt.slice(1) : txt;
  const parts = raw.split(".");
  const whole = parts[0] || "0";
  const frac = (parts[1] || "").padEnd(places, "0").slice(0, places);
  return `${neg ? "-" : ""}${whole}.${frac}`;
}
function formatUsd(value) {
  if (!Number.isFinite(value)) return "--";
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function escHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function toFloatUnits(value, decimals) {
  const txt = formatUnits(value, decimals);
  const n = Number(txt);
  return Number.isFinite(n) ? n : 0;
}
function renderUsdAllocationPie(rows) {
  if (!el.holdingsPie || !el.holdingsLegend || !el.holdingsPieCenter) return;
  const colors = ["#42d392", "#3d8bfd", "#ffb020", "#ff7b72", "#8f7cff", "#15c2d1", "#9bd147", "#ff6bb5", "#8ea1b4", "#d7e7f5"];
  const byGroup = new Map();
  for (const row of (rows || [])) {
    if ((row.baseRaw || 0n) <= 0n) continue;
    const price = groupUsdPriceByKey[row.groupKey];
    if (!Number.isFinite(price)) continue;
    const usd = toFloatUnits(row.baseRaw || 0n, row.groupDecimals || 0) * price;
    if (!Number.isFinite(usd) || usd <= 0) continue;
    const groupKey = row.groupKey || "UNKNOWN";
    byGroup.set(groupKey, (byGroup.get(groupKey) || 0) + usd);
  }
  const items = [...byGroup.entries()]
    .map(([name, usd]) => ({ name, usd }))
    .sort((a, b) => b.usd - a.usd);
  const total = items.reduce((sum, x) => sum + x.usd, 0);
  if (!items.length || total <= 0) {
    el.holdingsPie.style.background = "#1a2330";
    el.holdingsPieCenter.textContent = "No USD data";
    el.holdingsLegend.innerHTML = `<div class="break-label">Run scan / wait for prices to load.</div>`;
    return;
  }

  let accPct = 0;
  const segments = [];
  for (let i = 0; i < items.length; i++) {
    const pct = i === items.length - 1 ? (100 - accPct) : (items[i].usd / total) * 100;
    const start = accPct;
    const end = Math.min(100, accPct + pct);
    const color = colors[i % colors.length];
    segments.push(`${color} ${start.toFixed(4)}% ${end.toFixed(4)}%`);
    items[i].pct = pct;
    items[i].color = color;
    accPct = end;
  }
  el.holdingsPie.style.background = `conic-gradient(${segments.join(", ")})`;
  el.holdingsPieCenter.textContent = `$${formatUsd(total)}`;
  el.holdingsLegend.innerHTML = items.map((item) => {
    const pctText = `${item.pct.toFixed(2)}%`;
    const usdText = `$${formatUsd(item.usd)}`;
    return `<div class="holdings-legend-row"><span class="holdings-legend-main"><span class="legend-dot" style="background:${item.color}"></span><span class="holdings-legend-name">${escHtml(item.name)}</span></span><span class="holdings-legend-val">${pctText} (${usdText})</span></div>`;
  }).join("");
}
function parseUnits(input, decimals) { const t = s(input || "0"); if (!/^\d+(\.\d+)?$/.test(t)) throw new Error("numeric only"); const [a, b = ""] = t.split("."); if (b.length > decimals) throw new Error(`max ${decimals} dp`); return BigInt(a) * (10n ** BigInt(decimals)) + BigInt((b + "0".repeat(decimals)).slice(0, decimals)); }
function convertRaw(v, fromD, toD) { if (fromD === toD) return v; return fromD > toD ? v / (10n ** BigInt(fromD - toD)) : v * (10n ** BigInt(toD - fromD)); }
function normalizeAddressByChain(chainKey, address) {
  const chain = APP_CONFIG.chains[chainKey];
  const raw = s(address);
  if (!raw) return "";
  return chain && chain.type === "evm" ? raw.toLowerCase() : raw;
}
function canonicalMemberKey(groupKey, member) {
  const addr = normalizeAddressByChain(member.chain, member.address || "");
  return `${groupKey}|${member.kind}|${member.chain}|${addr || "native"}`;
}
function ensureConfigShape(config) {
  if (!config.provider || typeof config.provider !== "object") config.provider = {};
  if (typeof config.provider.alchemyApiKey !== "string") config.provider.alchemyApiKey = "";
  if (!config.provider.solana || typeof config.provider.solana !== "object") config.provider.solana = { enabled: true };
  if (typeof config.provider.solana.enabled !== "boolean") config.provider.solana.enabled = true;
  if (!config.chains || typeof config.chains !== "object") config.chains = {};
  for (const [k, chainDefault] of Object.entries(DEFAULT_APP_CONFIG.chains)) {
    if (!config.chains[k]) config.chains[k] = clone(chainDefault);
    if (Array.isArray(chainDefault.rpcs)) {
      if (!Array.isArray(config.chains[k].rpcs) || !config.chains[k].rpcs.length) {
        config.chains[k].rpcs = [...chainDefault.rpcs];
      }
    }
  }
  if (!config.groups || typeof config.groups !== "object" || !Object.keys(config.groups).length) config.groups = clone(DEFAULT_APP_CONFIG.groups);
  if (!config.targets || typeof config.targets !== "object") config.targets = clone(DEFAULT_APP_CONFIG.targets);
  for (const [k, group] of Object.entries(config.groups)) {
    if (typeof config.targets[k] !== "string") config.targets[k] = "0";
    if (!Array.isArray(group.members)) group.members = [];
  }
  if (!config.assetAliases || typeof config.assetAliases !== "object") config.assetAliases = clone(DEFAULT_APP_CONFIG.assetAliases);
  if (typeof config.version !== "number") config.version = 2;
  return config;
}
function applyAliasPreset() {
  APP_CONFIG = ensureConfigShape(APP_CONFIG);
  let added = 0;
  const aliases = APP_CONFIG.assetAliases || {};
  for (const [groupKey, entries] of Object.entries(aliases)) {
    const sourceGroup = APP_CONFIG.groups[groupKey] || DEFAULT_APP_CONFIG.groups[groupKey];
    if (!sourceGroup) continue;
    if (!APP_CONFIG.groups[groupKey]) APP_CONFIG.groups[groupKey] = { key: groupKey, name: sourceGroup.name, decimals: sourceGroup.decimals, members: [] };
    if (typeof APP_CONFIG.targets[groupKey] !== "string") APP_CONFIG.targets[groupKey] = DEFAULT_APP_CONFIG.targets[groupKey] || "0";
    const group = APP_CONFIG.groups[groupKey];
    const seen = new Set((group.members || []).map((m) => canonicalMemberKey(groupKey, m)));
    for (const alias of (entries || [])) {
      if (!APP_CONFIG.chains[alias.chain]) continue;
      const chain = APP_CONFIG.chains[alias.chain];
      const kind = alias.kind === "token" ? "token" : "native";
      const addr = normalizeAddressByChain(alias.chain, alias.address || "");
      if (kind === "token" && chain.type === "evm" && !EVM_REGEX.test(addr)) continue;
      if (kind === "token" && chain.type === "solana" && !SOLANA_ADDR_REGEX.test(addr)) continue;
      const normalized = { kind, chain: alias.chain, symbol: s(alias.symbol) || groupKey, address: kind === "token" ? addr : "", decimals: clampInt(alias.decimals, 0, 30, group.decimals) };
      const key = canonicalMemberKey(groupKey, normalized);
      if (seen.has(key)) continue;
      group.members.push(normalized);
      seen.add(key);
      added++;
    }
  }
  APP_CONFIG.version = 3;
  saveConfig();
  return added;
}

function loadConfig() {
  APP_CONFIG = clone(DEFAULT_APP_CONFIG);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.config);
    if (!raw) { APP_CONFIG = ensureConfigShape(APP_CONFIG); return; }
    const parsed = JSON.parse(raw);
    if (parsed.provider && typeof parsed.provider.alchemyApiKey === "string") APP_CONFIG.provider.alchemyApiKey = parsed.provider.alchemyApiKey;
    if (parsed.provider && parsed.provider.solana && typeof parsed.provider.solana.enabled === "boolean") APP_CONFIG.provider.solana.enabled = parsed.provider.solana.enabled;
    for (const chainKey of Object.keys(rpcInputs)) {
      const incoming = parsed.chains && parsed.chains[chainKey] && parsed.chains[chainKey].rpcs;
      if (Array.isArray(incoming) && incoming.length) APP_CONFIG.chains[chainKey].rpcs = [...new Set(incoming.map(s).filter((v) => /^https?:\/\//i.test(v)))];
    }
    if (parsed.groups && Object.keys(parsed.groups).length) APP_CONFIG.groups = parsed.groups;
    if (parsed.targets) APP_CONFIG.targets = parsed.targets;
    if (parsed.assetAliases && typeof parsed.assetAliases === "object") APP_CONFIG.assetAliases = parsed.assetAliases;
    APP_CONFIG.version = Number(parsed.version || APP_CONFIG.version || 2);
    APP_CONFIG = ensureConfigShape(APP_CONFIG);
  } catch (_e) { APP_CONFIG = ensureConfigShape(clone(DEFAULT_APP_CONFIG)); }
}

function saveConfig() { try { localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(APP_CONFIG)); } catch (_e) {} }
function loadWallets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.addresses) || localStorage.getItem(STORAGE_KEYS.legacyAddresses);
    if (!raw) { walletList = []; return; }
    const parsed = JSON.parse(raw); walletList = Array.isArray(parsed) ? [...new Set(parsed.map(s).filter(Boolean))] : [...new Set(String(raw).split(/[\s,]+/g).map(s).filter(Boolean))];
  } catch (_e) { walletList = []; }
}
function saveWallets() { try { localStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(walletList)); } catch (_e) {} }

function fillRpcInputs() {
  for (const [k, input] of Object.entries(rpcInputs)) {
    if (!input || !APP_CONFIG.chains[k]) continue;
    input.value = (APP_CONFIG.chains[k].rpcs || []).join("\n");
  }
}
function applyUiSettings() {
  const next = clone(APP_CONFIG);
  next.provider.alchemyApiKey = s(el.alchemyApiKey.value);
  for (const [k, input] of Object.entries(rpcInputs)) {
    if (!input || !next.chains[k]) continue;
    const list = [...new Set(String(input.value || "").split(/[\r\n,]+/g).map(s).filter(Boolean))];
    if (!list.length) throw new Error(`${next.chains[k].name} RPC list is empty`);
    for (const rpc of list) if (!/^https?:\/\//i.test(rpc)) throw new Error(`${next.chains[k].name} RPC must start with http/https`);
    next.chains[k].rpcs = list;
  }
  APP_CONFIG = next; saveConfig();
}

function renderWalletChips() { el.walletChips.innerHTML = walletList.map((a) => `<span class="wallet-chip"><span class="chip-text" title="${a}">${shortAddr(a)}</span><button class="chip-remove" type="button" data-address="${a}" title="Remove wallet">x</button></span>`).join(""); }
function handleChipRemoveClick(e) { const btn = e.target.closest(".chip-remove"); if (!btn) return; const a = btn.getAttribute("data-address"); walletList = walletList.filter((v) => v !== a); delete walletDataByAddress[a]; saveWallets(); renderWalletChips(); startupHintDismissed = false; refreshStartupHint(); recompute(); }

function renderGroupSelect() {
  const keys = Object.keys(APP_CONFIG.groups).sort();
  selectedGroupKey = APP_CONFIG.groups[selectedGroupKey] ? selectedGroupKey : keys[0];
  el.groupSelect.innerHTML = keys.map((k) => `<option value="${k}" ${k === selectedGroupKey ? "selected" : ""}>${k}</option>`).join("");
}
function renderGroupEditor() {
  const g = APP_CONFIG.groups[selectedGroupKey]; if (!g) return;
  el.groupKey.value = g.key; el.groupName.value = g.name; el.groupDecimals.value = g.decimals; el.groupTarget.value = APP_CONFIG.targets[g.key] || "0";
  el.memberList.innerHTML = (g.members || []).map((m, i) => `<span class="member-chip"><span>${m.symbol} / ${APP_CONFIG.chains[m.chain] ? APP_CONFIG.chains[m.chain].name : m.chain} / ${m.kind === "token" ? shortAddr(m.address || "") : "native"}</span><button type="button" data-index="${i}">x</button></span>`).join("");
}
function renderGroupTabs() {
  const groupKeys = Object.keys(APP_CONFIG.groups).sort();
  if (selectedDisplayGroup !== "ALL" && !APP_CONFIG.groups[selectedDisplayGroup]) {
    selectedDisplayGroup = "ALL";
  }
  const tabs = ["ALL", ...groupKeys];
  el.groupTabs.innerHTML = tabs.map((key) => {
    const active = key === selectedDisplayGroup ? "active" : "";
    const label = key === "ALL" ? "All" : key;
    return `<button type="button" class="group-tab ${active}" data-group-tab="${key}">${label}</button>`;
  }).join("");
}
function handleGroupTabClick(e) {
  const btn = e.target.closest("[data-group-tab]");
  if (!btn) return;
  selectedDisplayGroup = btn.getAttribute("data-group-tab") || "ALL";
  renderGroupTabs();
  recompute();
}
function populateMemberChainOptions() { el.memberChain.innerHTML = Object.values(APP_CONFIG.chains).map((c) => `<option value="${c.key}">${c.name}</option>`).join(""); }
function syncMemberKindUi() { const token = el.memberKind.value === "token"; el.memberAddress.disabled = !token; if (!token) el.memberAddress.value = ""; }
function addGroup() {
  const key = s(el.newGroupKey.value).toUpperCase();
  if (!/^[A-Z0-9_]{2,20}$/.test(key)) return setStatus("New group key must be 2-20 chars with A-Z, 0-9, _.", true);
  if (APP_CONFIG.groups[key]) return setStatus(`Group ${key} already exists.`, true);
  APP_CONFIG.groups[key] = { key, name: `${key} Basket`, decimals: key === "SOL" ? 9 : 18, members: [] }; APP_CONFIG.targets[key] = "0"; selectedGroupKey = key; el.newGroupKey.value = ""; saveConfig(); renderGroupSelect(); renderGroupEditor(); renderGroupTabs(); recompute();
}
function saveGroup() {
  const g = APP_CONFIG.groups[selectedGroupKey]; if (!g) return;
  g.name = s(el.groupName.value) || `${g.key} Basket`; g.decimals = clampInt(el.groupDecimals.value, 0, 30, g.decimals);
  const t = s(el.groupTarget.value || "0"); try { parseUnits(t, g.decimals); } catch (_e) { setStatus(`Invalid target for ${g.key}.`, true); return false; }
  APP_CONFIG.targets[g.key] = t; saveConfig(); renderGroupEditor(); recompute(); setStatus(`Saved group ${g.key}.`);
  return true;
}
function deleteGroup() {
  if (Object.keys(APP_CONFIG.groups).length <= 1) return setStatus("At least one group must remain.", true);
  delete APP_CONFIG.groups[selectedGroupKey]; delete APP_CONFIG.targets[selectedGroupKey]; selectedGroupKey = Object.keys(APP_CONFIG.groups).sort()[0]; saveConfig(); renderGroupSelect(); renderGroupEditor(); renderGroupTabs(); recompute();
}
function addMember() {
  const g = APP_CONFIG.groups[selectedGroupKey]; if (!g) return;
  const kind = el.memberKind.value === "token" ? "token" : "native"; const chain = s(el.memberChain.value).toLowerCase(); const symbol = s(el.memberSymbol.value); const address = normalizeAddressByChain(chain, el.memberAddress.value); const decimals = clampInt(el.memberDecimals.value, 0, 30, g.decimals);
  if (!APP_CONFIG.chains[chain]) return setStatus("Invalid chain.", true);
  if (!symbol) return setStatus("Member symbol is required.", true);
  if (kind === "token" && APP_CONFIG.chains[chain].type === "evm" && !EVM_REGEX.test(address)) return setStatus("EVM token member needs valid 0x contract.", true);
  if (kind === "token" && APP_CONFIG.chains[chain].type === "solana" && !SOLANA_ADDR_REGEX.test(address)) return setStatus("Solana token member needs valid mint address.", true);
  if (kind === "token" && APP_CONFIG.chains[chain].type !== "evm" && APP_CONFIG.chains[chain].type !== "solana") return setStatus("Token member is only supported on EVM/Solana chains.", true);
  const candidate = { kind, chain, symbol, address: kind === "token" ? address : "", decimals };
  if ((g.members || []).some((m) => canonicalMemberKey(g.key, m) === canonicalMemberKey(g.key, candidate))) return setStatus("Duplicate member ignored.", true);
  g.members.push(candidate); el.memberSymbol.value = ""; el.memberAddress.value = ""; saveConfig(); renderGroupEditor(); recompute();
}
function removeMember(e) { const btn = e.target.closest("button[data-index]"); if (!btn) return; const i = Number(btn.getAttribute("data-index")); const g = APP_CONFIG.groups[selectedGroupKey]; if (!g || Number.isNaN(i) || !g.members[i]) return; g.members.splice(i, 1); saveConfig(); renderGroupEditor(); recompute(); }

function flattenMembers() {
  const out = [];
  for (const [groupKey, group] of Object.entries(APP_CONFIG.groups)) {
    const seen = new Set();
    for (const m of (group.members || [])) {
      const normalized = { ...m, address: normalizeAddressByChain(m.chain, m.address) };
      const key = canonicalMemberKey(groupKey, normalized);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...normalized, groupKey, groupName: group.name, groupDecimals: group.decimals });
    }
  }
  return out;
}
function memberId(m) { return `${m.groupKey}|${m.kind}|${m.chain}|${m.symbol}|${normalizeAddressByChain(m.chain, m.address || "")}`; }

async function rpcCall(url, method, params) {
  const controller = new AbortController(); const to = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }), signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json(); if (data.error) throw new Error(data.error.message || "RPC error"); return data.result;
  } finally { clearTimeout(to); }
}
function parseQty(v) { if (v === null || v === undefined || v === "" || v === "0x" || v === "0X") return 0n; if (typeof v === "string" && /^0x[0-9a-fA-F]+$/.test(v)) return BigInt(v); if (typeof v === "string" && /^\d+$/.test(v)) return BigInt(v); throw new Error("invalid quantity"); }
async function erc20Balance(rpc, token, wallet) {
  const out = await rpcCall(rpc, "eth_call", [{ to: token, data: `0x70a08231${"0".repeat(24)}${wallet.toLowerCase().replace(/^0x/, "")}` }, "latest"]);
  return (out === "0x" || out === "0X" || out === null || out === undefined) ? 0n : BigInt(out);
}

async function fetchEvmByAlchemy(address, chain, members) {
  const key = s(APP_CONFIG.provider.alchemyApiKey); if (!key || !chain.alchemyNetwork) throw new Error("alchemy not configured");
  const rpc = `https://${chain.alchemyNetwork}.g.alchemy.com/v2/${key}`; const out = new Map();
  const nativeMembers = members.filter((m) => m.kind === "native"); if (nativeMembers.length) { const n = parseQty(await rpcCall(rpc, "eth_getBalance", [address, "latest"])); for (const m of nativeMembers) out.set(memberId(m), n); }
  const tokenMembers = members.filter((m) => m.kind === "token");
  if (tokenMembers.length) {
    const contracts = [...new Set(tokenMembers.map((m) => m.address.toLowerCase()))];
    const resp = await rpcCall(rpc, "alchemy_getTokenBalances", [address, contracts]); const m = new Map((resp.tokenBalances || []).map((t) => [s(t.contractAddress).toLowerCase(), (() => { try { return parseQty(t.tokenBalance); } catch (_e) { return 0n; } })()]));
    for (const tm of tokenMembers) out.set(memberId(tm), m.get(tm.address.toLowerCase()) || 0n);
  }
  return out;
}
async function fetchEvmByRpcFallback(address, chain, members) {
  let last = "fallback failed";
  for (const rpc of (chain.rpcs || [])) {
    try {
      const out = new Map(); const nativeMembers = members.filter((m) => m.kind === "native");
      if (nativeMembers.length) { const n = parseQty(await rpcCall(rpc, "eth_getBalance", [address, "latest"])); for (const m of nativeMembers) out.set(memberId(m), n); }
      for (const m of members.filter((x) => x.kind === "token")) out.set(memberId(m), await erc20Balance(rpc, m.address, address));
      let host = rpc; try { host = new URL(rpc).host; } catch (_e) {}
      return { map: out, source: `rpc:${host}` };
    } catch (e) { last = e.message || "fallback failed"; }
  }
  throw new Error(last);
}
async function solRpcCall(rpc, method, params) {
  return rpcCall(rpc, method, params);
}
function parseSolTokenAccounts(result) {
  const byMint = new Map();
  for (const item of (result?.value || [])) {
    const info = item?.account?.data?.parsed?.info;
    const mint = s(info?.mint);
    const amountRaw = s(info?.tokenAmount?.amount);
    if (!mint || !/^\d+$/.test(amountRaw || "")) continue;
    const decimals = clampInt(info?.tokenAmount?.decimals, 0, 30, 0);
    const amount = BigInt(amountRaw);
    const prev = byMint.get(mint);
    if (!prev) byMint.set(mint, { raw: amount, decimals });
    else byMint.set(mint, { raw: prev.raw + amount, decimals: prev.decimals });
  }
  return byMint;
}
async function fetchSolanaByAlchemy(address, chain, members) {
  const key = s(APP_CONFIG.provider.alchemyApiKey);
  if (!key || !chain.alchemyNetwork || !APP_CONFIG.provider.solana?.enabled) throw new Error("alchemy not configured");
  const rpc = `https://${chain.alchemyNetwork}.g.alchemy.com/v2/${key}`;
  const out = new Map();
  const nativeLamports = BigInt((await solRpcCall(rpc, "getBalance", [address, { commitment: "confirmed" }]))?.value || 0);
  for (const m of members.filter((x) => x.kind === "native")) out.set(memberId(m), nativeLamports);
  const tokenByMint = new Map();
  for (const programId of SOLANA_TOKEN_PROGRAMS) {
    const resp = await solRpcCall(rpc, "getTokenAccountsByOwner", [address, { programId }, { encoding: "jsonParsed", commitment: "confirmed" }]);
    const parsed = parseSolTokenAccounts(resp);
    for (const [mint, entry] of parsed.entries()) {
      const prev = tokenByMint.get(mint);
      if (!prev) tokenByMint.set(mint, entry);
      else tokenByMint.set(mint, { raw: prev.raw + entry.raw, decimals: prev.decimals });
    }
  }
  for (const m of members.filter((x) => x.kind === "token")) {
    const hit = tokenByMint.get(s(m.address));
    out.set(memberId(m), hit ? convertRaw(hit.raw, hit.decimals, m.decimals) : 0n);
  }
  return out;
}
async function fetchSolanaByRpcFallback(address, chain, members) {
  let last = "fallback failed";
  for (const rpc of (chain.rpcs || [])) {
    try {
      const out = new Map();
      const nativeLamports = BigInt((await solRpcCall(rpc, "getBalance", [address, { commitment: "confirmed" }]))?.value || 0);
      for (const m of members.filter((x) => x.kind === "native")) out.set(memberId(m), nativeLamports);
      const tokenByMint = new Map();
      for (const programId of SOLANA_TOKEN_PROGRAMS) {
        const resp = await solRpcCall(rpc, "getTokenAccountsByOwner", [address, { programId }, { encoding: "jsonParsed", commitment: "confirmed" }]);
        const parsed = parseSolTokenAccounts(resp);
        for (const [mint, entry] of parsed.entries()) {
          const prev = tokenByMint.get(mint);
          if (!prev) tokenByMint.set(mint, entry);
          else tokenByMint.set(mint, { raw: prev.raw + entry.raw, decimals: prev.decimals });
        }
      }
      for (const m of members.filter((x) => x.kind === "token")) {
        const hit = tokenByMint.get(s(m.address));
        out.set(memberId(m), hit ? convertRaw(hit.raw, hit.decimals, m.decimals) : 0n);
      }
      let host = rpc; try { host = new URL(rpc).host; } catch (_e) {}
      return { map: out, source: `rpc:${host}` };
    } catch (e) { last = e.message || "fallback failed"; }
  }
  throw new Error(last);
}

async function scanEvmAddress(address) {
  const rows = []; const errors = []; const allMembers = flattenMembers().filter((m) => APP_CONFIG.chains[m.chain] && APP_CONFIG.chains[m.chain].type === "evm");
  const byChain = new Map(); for (const m of allMembers) { if (!byChain.has(m.chain)) byChain.set(m.chain, []); byChain.get(m.chain).push(m); }
  for (const [chainKey, members] of byChain.entries()) {
    const chain = APP_CONFIG.chains[chainKey]; let map = null; let source = "rpc-fallback";
    if (s(APP_CONFIG.provider.alchemyApiKey)) { try { map = await fetchEvmByAlchemy(address, chain, members); source = "alchemy"; } catch (e) { errors.push(`${chain.name}: alchemy failed (${e.message || "error"})`); } }
    if (!map) { try { const f = await fetchEvmByRpcFallback(address, chain, members); map = f.map; source = f.source; } catch (e) { errors.push(`${chain.name}: fallback failed (${e.message || "error"})`); continue; } }
    for (const m of members) { const raw = map.get(memberId(m)) || 0n; const baseRaw = convertRaw(raw, m.decimals, m.groupDecimals); rows.push({ address, chain: chain.name, coin: m.symbol, groupKey: m.groupKey, groupDecimals: m.groupDecimals, balance: formatUnits(raw, m.decimals), groupUnits: formatUnits(baseRaw, m.groupDecimals), baseRaw, rawAmount: raw, source }); }
  }
  return { rows, errors };
}
async function scanSolAddress(address) {
  const rows = []; const errors = [];
  const members = flattenMembers().filter((m) => APP_CONFIG.chains[m.chain] && APP_CONFIG.chains[m.chain].type === "solana");
  if (!members.length) return { rows, errors };
  const chain = APP_CONFIG.chains.solana;
  let map = null; let source = "rpc-fallback";
  if (s(APP_CONFIG.provider.alchemyApiKey) && APP_CONFIG.provider.solana?.enabled) {
    try { map = await fetchSolanaByAlchemy(address, chain, members); source = "alchemy"; }
    catch (e) { errors.push(`${chain.name}: alchemy failed (${e.message || "error"})`); }
  }
  if (!map) {
    try { const f = await fetchSolanaByRpcFallback(address, chain, members); map = f.map; source = f.source; }
    catch (e) { errors.push(`${chain.name}: fallback failed (${e.message || "error"})`); return { rows, errors }; }
  }
  for (const m of members) {
    const raw = map.get(memberId(m)) || 0n;
    const baseRaw = convertRaw(raw, m.decimals, m.groupDecimals);
    rows.push({ address, chain: chain.name, coin: m.symbol, groupKey: m.groupKey, groupDecimals: m.groupDecimals, balance: formatUnits(raw, m.decimals), groupUnits: formatUnits(baseRaw, m.groupDecimals), baseRaw, rawAmount: raw, source });
  }
  return { rows, errors };
}

async function getBtcBalance(address) {
  const alchemyKey = s(APP_CONFIG.provider.alchemyApiKey);
  const alchemyBase = s(APP_CONFIG.chains.bitcoin.alchemyBase || "");
  let alchemyError = "";
  if (alchemyKey && alchemyBase) {
    try {
      const res = await fetch(`${alchemyBase}/${alchemyKey}/address/${address}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const funded = BigInt(data.chain_stats?.funded_txo_sum || 0);
      const spent = BigInt(data.chain_stats?.spent_txo_sum || 0);
      return { sats: funded - spent, source: "btc:alchemy", alchemyError: "" };
    } catch (e) {
      alchemyError = e && e.message ? e.message : "Alchemy BTC request failed";
    }
  }

  let last = "btc api failed";
  for (const base of APP_CONFIG.chains.bitcoin.apiEndpoints || []) {
    try {
      const res = await fetch(`${base}/address/${address}`); if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); const funded = BigInt(data.chain_stats?.funded_txo_sum || 0); const spent = BigInt(data.chain_stats?.spent_txo_sum || 0);
      return { sats: funded - spent, source: `btc:${new URL(base).host}`, alchemyError };
    } catch (e) { last = e.message || "btc api failed"; }
  }
  throw new Error(last);
}
async function scanBtcAddress(address) {
  const rows = []; const errors = []; const members = flattenMembers().filter((m) => m.kind === "native" && m.chain === "bitcoin");
  if (!members.length) return { rows, errors };
  try {
    const b = await getBtcBalance(address);
    if (b.alchemyError) {
      errors.push(`Bitcoin Alchemy fallback: ${b.alchemyError}`);
    }
    for (const m of members) { const baseRaw = convertRaw(b.sats, 8, m.groupDecimals); rows.push({ address, chain: "Bitcoin", coin: m.symbol, groupKey: m.groupKey, groupDecimals: m.groupDecimals, balance: formatUnits(b.sats, 8), groupUnits: formatUnits(baseRaw, m.groupDecimals), baseRaw, rawAmount: b.sats, source: b.source }); }
  } catch (e) { errors.push(e.message || "btc scan failed"); }
  return { rows, errors };
}

function scanSignature() { return JSON.stringify({ wallets: walletList.map((v) => v.toLowerCase()).sort(), config: APP_CONFIG }); }
function serializeData(data) { const out = {}; for (const [k, v] of Object.entries(data || {})) out[k] = { rows: (v.rows || []).map((r) => ({ ...r, baseRaw: (r.baseRaw || 0n).toString(), rawAmount: (r.rawAmount || 0n).toString() })), errors: v.errors || [] }; return out; }
function deserializeData(data) { const out = {}; for (const [k, v] of Object.entries(data || {})) out[k] = { rows: (v.rows || []).map((r) => ({ ...r, baseRaw: BigInt(r.baseRaw || r.satsRaw || "0"), rawAmount: BigInt(r.rawAmount || "0") })), errors: v.errors || [] }; return out; }
function saveLastScan() { try { localStorage.setItem(STORAGE_KEYS.lastScan, JSON.stringify({ timestamp: Date.now(), signature: scanSignature(), walletList, walletDataByAddress: serializeData(walletDataByAddress) })); } catch (_e) {} }
function loadLastScan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.lastScan) || localStorage.getItem(STORAGE_KEYS.legacyLastScan); if (!raw) return null;
    const parsed = JSON.parse(raw); return { ...parsed, walletDataByAddress: deserializeData(parsed.walletDataByAddress || {}) };
  } catch (_e) { return null; }
}
async function initializeFromCacheOrScan() {
  const c = loadLastScan();
  if (c && c.signature === scanSignature() && c.timestamp && (Date.now() - Number(c.timestamp)) < CACHE_MAX_AGE_MS) { walletList = Array.isArray(c.walletList) ? [...new Set(c.walletList)] : walletList; walletDataByAddress = c.walletDataByAddress || {}; renderWalletChips(); recompute(); setStatus("Loaded cached balances."); return; }
  if (walletList.length) { setStatus("Auto-refreshing balances..."); await runScan(); }
}

function decorateRows(rows) {
  const gTotals = new Map(); for (const r of rows) gTotals.set(r.groupKey, (gTotals.get(r.groupKey) || 0n) + (r.baseRaw || 0n));
  return rows.map((r) => { const t = gTotals.get(r.groupKey) || 0n; const pct = t > 0n ? Number(((r.baseRaw || 0n) * 10000n) / t) / 100 : 0; return { ...r, sharePct: pct, shareText: `${pct.toFixed(2)}%` }; });
}
function groupSummaries(rows) {
  const totals = new Map(); for (const r of rows) totals.set(r.groupKey, (totals.get(r.groupKey) || 0n) + (r.baseRaw || 0n));
  const out = [];
  for (const [k, g] of Object.entries(APP_CONFIG.groups)) {
    const currentRaw = totals.get(k) || 0n; const targetText = s(APP_CONFIG.targets[k] || "0"); let targetRaw = 0n; let targetErr = "";
    try { targetRaw = parseUnits(targetText || "0", g.decimals); } catch (e) { targetErr = e.message || "invalid"; }
    out.push({ groupKey: k, decimals: g.decimals, currentRaw, currentText: formatUnits(currentRaw, g.decimals), targetText, targetRaw, targetErr, progress: targetRaw > 0n ? Number((currentRaw * 10000n) / targetRaw) / 100 : null });
  }
  return out;
}

function render(rows, errors, skipUsdRefresh = false) {
  lastRenderedRows = rows;
  lastRenderedErrors = errors;
  const decorated = decorateRows(rows).sort((a, b) => a.groupKey.localeCompare(b.groupKey) || ((a.baseRaw || 0n) > (b.baseRaw || 0n) ? -1 : 1));
  const filtered = selectedDisplayGroup === "ALL" ? decorated : decorated.filter((r) => r.groupKey === selectedDisplayGroup);
  const sums = groupSummaries(rows);
  el.resultsBody.innerHTML = filtered.filter((r) => (r.baseRaw || 0n) > 0n).map((r) => {
    const chainLogo = CHAIN_LOGOS[r.chain];
    const coinLogo = COIN_LOGOS[r.coin];
    const coinCell = `
      <span class="token-with-chain">
        <span class="token-icon-wrap">
          ${coinLogo
            ? `<img class="token-main-icon" src="${coinLogo}" alt="${r.coin}" loading="lazy" />`
            : `<span class="logo-fallback token-main-icon" style="display:flex;align-items:center;justify-content:center;">${r.coin.slice(0, 1)}</span>`}
          ${chainLogo ? `<img class="token-chain-badge" src="${chainLogo}" alt="${r.chain}" loading="lazy" />` : ""}
        </span>
        <span class="token-label">${r.coin}</span>
      </span>
    `;
    const price = groupUsdPriceByKey[r.groupKey];
    const usdHoldings = Number.isFinite(price) ? toFloatUnits(r.baseRaw || 0n, r.groupDecimals || 0) * price : null;
    const usdCell = usdHoldings === null ? "--" : `$${formatUsd(usdHoldings)}`;
    return `<tr><td class="mono" title="${r.address}">${shortAddr(r.address)}</td><td class="logo-cell">${coinCell}</td><td>${r.balance}</td><td class="mono">${usdCell}</td><td class="share-cell"><div class="share-wrap"><span class="share-value">${r.shareText}</span><span class="share-track"><span class="share-fill" style="width:${Math.max(0, Math.min(100, r.sharePct))}%"></span></span></div></td></tr>`;
  }).join("");
  el.errorSummary.innerHTML = errors.length ? `<span class="error">Fetch errors:</span> ${errors.map((e) => `<span class="pill">${e}</span>`).join(" ")}` : "";
  const sourceCounts = new Map();
  for (const row of filtered) {
    if ((row.baseRaw || 0n) <= 0n) continue;
    const key = row.source || "unknown";
    sourceCounts.set(key, (sourceCounts.get(key) || 0) + 1);
  }
  if (el.sourceSummary) {
    if (!sourceCounts.size) {
      el.sourceSummary.textContent = "Source summary: no source data for current view.";
    } else {
      const parts = [...sourceCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([source, count]) => `${source} (${count})`);
      el.sourceSummary.textContent = `Source summary (current tab): ${parts.join(", ")}`;
    }
  }
  renderUsdAllocationPie(decorated);
  renderBreakdown(sums);
  if (!skipUsdRefresh) void refreshGroupUsdPrices(sums);
}

function renderBreakdown(sums) {
  const items = sums.filter((s) => s.targetRaw > 0n || s.currentRaw > 0n);
  if (!items.length) {
    el.breakdownBars.innerHTML = `<div class="break-label">No holdings or targets to chart.</div>`;
    return;
  }

  el.breakdownBars.innerHTML = items.map((s) => {
    const pct = s.targetRaw > 0n ? (s.progress || 0) : 0;
    const barWidth = Math.max(0, Math.min(100, pct));
    const price = groupUsdPriceByKey[s.groupKey];
    const usdHoldings = Number.isFinite(price) ? toFloatUnits(s.currentRaw, s.decimals) * price : null;
    const pctDisplay = usdHoldings === null ? `${pct.toFixed(2)}%` : `${pct.toFixed(2)}% ($${formatUsd(usdHoldings)})`;
    const hoverPct = `${Math.round(pct)}%`;
    const currentFmt = formatFixedUnits(s.currentRaw, s.decimals, 3);
    const targetFmt = formatFixedUnits(s.targetRaw, s.decimals, 3);
    const usdHover = usdHoldings === null ? "USD n/a" : `$${formatUsd(usdHoldings)}`;
    const hoverText = `${currentFmt} / ${targetFmt} ${s.groupKey} (${hoverPct}, ${usdHover})`;
    return `<div class="break-row" data-tooltip="${hoverText}"><div class="break-head"><span class="break-name">${s.groupKey}</span><span class="break-pct">${pctDisplay}</span></div><div class="break-track"><div class="break-fill" style="width:${barWidth}%;"></div></div></div>`;
  }).join("");
}
async function fetchCoinbaseSpotUsd(symbol) {
  const pair = `${symbol}-USD`;
  const res = await fetch(`https://api.coinbase.com/v2/prices/${encodeURIComponent(pair)}/spot`);
  if (!res.ok) throw new Error(`Coinbase ${pair} HTTP ${res.status}`);
  const data = await res.json();
  const amount = Number(data?.data?.amount);
  if (!Number.isFinite(amount)) throw new Error(`Coinbase ${pair} invalid amount`);
  return amount;
}
async function refreshGroupUsdPrices(sums) {
  const groupKeys = [...new Set((sums || []).map((x) => x.groupKey).filter(Boolean))];
  if (!groupKeys.length) return;
  const nonce = ++usdPriceFetchNonce;
  const updates = {};
  await Promise.all(groupKeys.map(async (groupKey) => {
    try {
      updates[groupKey] = await fetchCoinbaseSpotUsd(groupKey);
    } catch (_e) {
      updates[groupKey] = null;
    }
  }));
  if (nonce !== usdPriceFetchNonce) return;
  groupUsdPriceByKey = { ...groupUsdPriceByKey, ...updates };
  render(lastRenderedRows, lastRenderedErrors, true);
}
function recompute() {
  const rows = []; const errors = [];
  for (const addr of walletList) { const d = walletDataByAddress[addr]; if (!d) continue; rows.push(...(d.rows || [])); for (const e of (d.errors || [])) errors.push(`${shortAddr(addr)} ${e}`); }
  render(rows, errors); saveLastScan();
}

async function scanAddressesAndMerge(addresses) {
  el.scanBtn.disabled = true; el.addWalletBtn.disabled = true; el.resetRpcBtn.disabled = true;
  let ok = 0, fail = 0;
  for (let i = 0; i < addresses.length; i++) {
    const a = addresses[i]; setStatus(`Scanning ${i + 1}/${addresses.length}: ${shortAddr(a)}`);
    try {
      const d = EVM_REGEX.test(a)
        ? await scanEvmAddress(a)
        : BTC_REGEX.test(a)
          ? await scanBtcAddress(a)
          : SOLANA_ADDR_REGEX.test(a)
            ? await scanSolAddress(a)
            : (() => { throw new Error("Unrecognized address format"); })();
      walletDataByAddress[a] = d; ok++;
    }
    catch (e) { walletDataByAddress[a] = { rows: [], errors: [e.message || "Failed"] }; fail++; }
  }
  recompute(); setStatus(`Done. Success: ${ok}, Failed: ${fail}.`); el.scanBtn.disabled = false; el.addWalletBtn.disabled = false; el.resetRpcBtn.disabled = false;
}

async function addWalletsFromInputAndScan() {
  const incoming = [...new Set(String(el.walletInput.value || "").split(/[\s,]+/g).map(s).filter(Boolean))];
  if (!incoming.length) return setStatus("Paste at least one wallet address to add.", true);
  const fresh = incoming.filter((a) => !walletList.includes(a)); el.walletInput.value = ""; if (!fresh.length) return setStatus("No new wallets to add.");
  walletList = [...walletList, ...fresh]; saveWallets(); renderWalletChips();
  startupHintDismissed = false;
  refreshStartupHint();
  try { applyUiSettings(); } catch (e) { return setStatus(e.message || "Invalid settings.", true); }
  await scanAddressesAndMerge(fresh);
}

async function runScan() {
  saveWallets();
  if (!walletList.length) return setStatus("Please enter at least one address.", true);
  try { applyUiSettings(); } catch (e) { return setStatus(e.message || "Invalid settings.", true); }
  if (!saveGroup()) return;
  walletDataByAddress = {};
  await scanAddressesAndMerge(walletList);
}

function setStatus(text, isError = false) { el.status.textContent = text; el.status.className = isError ? "status error" : "status"; }
