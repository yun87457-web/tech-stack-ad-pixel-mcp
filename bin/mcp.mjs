#!/usr/bin/env node
/**
 * StackScope — Tech Stack & Ad Pixel Detector MCP Server (Zero-Dependency Node.js 18+ MCP stdio Server)
 *
 * Run locally via:
 *   npx -y github:yun87457-web/tech-stack-ad-pixel-mcp
 *
 * Authentication (choose one):
 *   - APIFY_TOKEN   (Apify Standby Streamable HTTP MCP backend — Free tier available)
 *   - RAPIDAPI_KEY  (RapidAPI REST backend — Free Basic plan available)
 */
import readline from "node:readline";

const SERVER_NAME = "stackscope-tech-stack-ad-pixel-mcp";
const SERVER_VERSION = "1.1.1";
const APIFY_MCP_URL = process.env.MCP_ENDPOINT_OVERRIDE || "https://spiky-closet--tech-stack-ad-pixel-detector.apify.actor/mcp";
const APIFY_URL = "https://apify.com/spiky_closet/tech-stack-ad-pixel-detector";
const RAPIDAPI_URL = "https://rapidapi.com/HYunLe/api/website-tech-stack-ad-pixels-and-saas-detector";
const RAPIDAPI_HOST = "website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com";
const REST_BASE_URL = process.env.REST_BASE_OVERRIDE || `https://${RAPIDAPI_HOST}`;
const TOOLS = [
  {
    "description": "Scan 1-200 company domains, URLs, or emails for 150+ website technologies, unpacked Google Tag Manager (GTM) paid ad pixel IDs (Google Ads AW-, Meta, LinkedIn, TikTok, Bing, GA4), and DNS MX/SPF/TXT/DMARC enterprise SaaS tools (resilient even on WAF HTTP 403 sites). Supports lead qualification filters (mustHaveAny, mustHaveAll, mustNotHave, onlyWithAdPixels).",
    "inputSchema": {
      "properties": {
        "checkAdsTxt": {
          "default": false,
          "description": "Also inspect /ads.txt publisher lines.",
          "type": "boolean"
        },
        "checkDns": {
          "default": true,
          "description": "Run DNS MX/SPF/TXT/DMARC lookups for internal enterprise SaaS.",
          "type": "boolean"
        },
        "domain": {
          "description": "Single domain convenience field.",
          "type": "string"
        },
        "domains": {
          "description": "Domains, full URLs, or emails to inspect (e.g. ['hubspot.com', 'ceo@klaviyo.com']).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "mustHaveAll": {
          "description": "Return only domains matching ALL of these technologies/SaaS.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "mustHaveAny": {
          "description": "Return only domains matching ANY of these technologies/SaaS.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "mustNotHave": {
          "description": "Exclude domains using ANY of these technologies/SaaS.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "onlyWithAdPixels": {
          "description": "Return only domains running paid ad pixels.",
          "type": "boolean"
        },
        "unpackGtm": {
          "default": true,
          "description": "Fetch and unpack static GTM containers (gtm.js) for hidden ad pixel IDs.",
          "type": "boolean"
        }
      },
      "type": "object"
    },
    "name": "scan_domains",
    "rapidapi": {
      "method": "POST",
      "path": "/scan"
    }
  },
  {
    "description": "Extract paid advertising pixels and tracking IDs from company domains by scanning homepage scripts and unpacking static Google Tag Manager (gtm.js) containers without a headless browser: returns Google Ads AW- IDs, Meta Pixel IDs, LinkedIn Partner IDs, TikTok Pixel IDs, Bing UET IDs, GA4 G- IDs, HubSpot Portal IDs, and a direct Google Ads Transparency Center link.",
    "inputSchema": {
      "properties": {
        "checkAdsTxt": {
          "default": false,
          "description": "Also fetch /ads.txt publisher lines.",
          "type": "boolean"
        },
        "domain": {
          "description": "Single domain convenience field (e.g. 'hubspot.com').",
          "type": "string"
        },
        "domains": {
          "description": "List of company domains, URLs, or work emails (1-200).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "onlyWithAdPixels": {
          "default": false,
          "description": "Filter out domains without active paid ad pixels.",
          "type": "boolean"
        }
      },
      "type": "object"
    },
    "name": "extract_ad_pixels",
    "rapidapi": {
      "method": "POST",
      "path": "/scan"
    }
  },
  {
    "description": "Ultra-fast DNS-only (no HTTP) enterprise SaaS & email stack check via MX, SPF, TXT, and DMARC records (~50-200ms). Detects Google Workspace, Microsoft 365, Stripe, OpenAI Enterprise, Anthropic, Cursor, Slack, Notion, Linear, HubSpot, Klaviyo, DocuSign, Rippling, and Greenhouse even on WAF-protected sites.",
    "inputSchema": {
      "properties": {
        "domain": {
          "description": "Single domain convenience field (e.g. 'linear.app').",
          "type": "string"
        },
        "domains": {
          "description": "List of company domains or work emails (1-200).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "mustHaveAny": {
          "description": "Return only domains matching ANY listed SaaS tool (e.g. ['OpenAI', 'Stripe']).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "mustNotHave": {
          "description": "Exclude domains matching ANY listed SaaS tool.",
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "type": "object"
    },
    "name": "check_enterprise_saas",
    "rapidapi": {
      "method": "POST",
      "path": "/scan"
    }
  }
];

function writeMsg(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

async function proxyApifyMcp(payload, token) {
  const res = await fetch(APIFY_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify MCP HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    const lines = text.split(/\r?\n/).filter((l) => l.startsWith("data:"));
    for (let i = lines.length - 1; i >= 0; i--) {
      const raw = lines[i].slice(5).trim();
      if (raw && raw !== "[DONE]") {
        try { return JSON.parse(raw); } catch {}
      }
    }
    throw new Error("Empty SSE response from Apify MCP endpoint");
  }
  return JSON.parse(text);
}

async function callRapidApi(tool, args, key) {
  const cfg = tool.rapidapi;
  let url = `${REST_BASE_URL}${cfg.path}`;
  const headers = {
    "x-rapidapi-key": key,
    "x-rapidapi-host": RAPIDAPI_HOST
  };
  const init = { method: cfg.method, headers };
  if (cfg.method === "GET") {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(args || {})) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    if ([...qs.keys()].length > 0) url += `?${qs.toString()}`;
  } else {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(args || {});
  }
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`RapidAPI HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

async function handleRequest(msg) {
  const { id, method, params } = msg;
  const hasId = id !== undefined && id !== null;

  if (method === "initialize") {
    if (!hasId) return;
    return writeMsg({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION }
      }
    });
  }

  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return;
  }

  if (method === "ping") {
    if (!hasId) return;
    return writeMsg({ jsonrpc: "2.0", id, result: {} });
  }

  if (method === "tools/list") {
    if (!hasId) return;
    const apifyToken = process.env.APIFY_TOKEN;
    if (apifyToken) {
      try {
        const remote = await proxyApifyMcp({ jsonrpc: "2.0", id, method: "tools/list", params: params || {} }, apifyToken);
        if (remote?.result?.tools) {
          return writeMsg({ jsonrpc: "2.0", id, result: remote.result });
        }
      } catch (err) {
        process.stderr.write(`[mcp] fallback to local schema: ${err.message}\n`);
      }
    }
    return writeMsg({
      jsonrpc: "2.0",
      id,
      result: {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
      }
    });
  }

  if (method === "tools/call") {
    if (!hasId) return;
    const toolName = params?.name;
    const args = params?.arguments || {};
    const apifyToken = process.env.APIFY_TOKEN;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    try {
      if (apifyToken) {
        const remote = await proxyApifyMcp({ jsonrpc: "2.0", id, method: "tools/call", params }, apifyToken);
        if (remote?.result) {
          return writeMsg({ jsonrpc: "2.0", id, result: remote.result });
        }
        if (remote?.error) {
          return writeMsg({ jsonrpc: "2.0", id, error: remote.error });
        }
      }
      if (rapidApiKey) {
        const tool = TOOLS.find((t) => t.name === toolName) || TOOLS[0];
        const out = await callRapidApi(tool, args, rapidApiKey);
        return writeMsg({
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text: out }] }
        });
      }
      return writeMsg({
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{
            type: "text",
            text: `Missing credentials. Set APIFY_TOKEN (free tier: ${APIFY_URL}) or RAPIDAPI_KEY (free plan: ${RAPIDAPI_URL}) in your MCP client env.`
          }]
        }
      });
    } catch (err) {
      return writeMsg({
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: `Error calling ${toolName}: ${err.message}` }]
        }
      });
    }
  }

  if (hasId) {
    writeMsg({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` }
    });
  }
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const msg = JSON.parse(trimmed);
    handleRequest(msg).catch((err) => {
      process.stderr.write(`[mcp] unhandled error: ${err.message}\n`);
    });
  } catch (err) {
    process.stderr.write(`[mcp] invalid JSON: ${err.message}\n`);
  }
});
