# Website Tech Stack, Ad Pixels & SaaS Detector — REST API & MCP Server

[![Tech Stack & Ad Pixel Detector MCP connector](https://glama.ai/mcp/connectors/io.github.yun87457-web/tech-stack-ad-pixel-detector-mcp/badges/score.svg)](https://glama.ai/mcp/connectors/io.github.yun87457-web/tech-stack-ad-pixel-detector-mcp)

Detect `180+` web technologies, paid advertising conversion pixels (Google Ads, Meta, LinkedIn, TikTok, Microsoft Advertising), `/ads.txt` seller networks, and `70+` DNS-verified B2B SaaS tools (`MX`, `TXT`, `DMARC`) from any domain.

## Access Channels

- **Apify Store (Batch + Standby + Free Tier):** https://apify.com/spiky_closet/tech-stack-ad-pixel-detector
- **RapidAPI Hub (REST API, Free Basic Plan):** https://rapidapi.com/HYunLe/api/website-tech-stack-ad-pixels-and-saas-detector
- **Official MCP Registry:** `io.github.yun87457-web/tech-stack-ad-pixel-detector-mcp`

## Verified Performance (50-Domain Batch Benchmark)

- **50 mixed domains (`concurrency: 15`, including WAF 403 sites):** `10.53 s` runtime, `60.2 MB` peak RAM, `97.8%` DNS SaaS extraction rate (`45/46` valid domains, automatic DNS-only fallback on HTTP `403` WAF sites).

## MCP Tools (Streamable HTTP)

Endpoint: `https://spiky-closet--tech-stack-ad-pixel-detector.apify.actor/mcp`

| Tool | Description |
|---|---|
| `scan_domains` | Batch inspect HTML, headers, script tags, `/ads.txt`, and DNS records across one or more domains. |
| `extract_ad_pixels` | Extract paid ad conversion pixel IDs (`GTM`, `GA4`, `Google Ads`, `Meta`, `LinkedIn`, `TikTok`, `Bing UET`, `HubSpot`). |
| `check_enterprise_saas` | Identify email host (`Google Workspace`, `Microsoft 365`, `Proofpoint`) and `70+` verified SaaS tools via DNS `MX`/`TXT`/`DMARC`. |

## Claude Desktop / Cursor MCP Configuration

```json
{
  "mcpServers": {
    "tech-stack-ad-pixels": {
      "url": "https://spiky-closet--tech-stack-ad-pixel-detector.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_TOKEN"
      }
    }
  }
}
```

## REST Quick Start (cURL)

```bash
curl -s -X POST "https://website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com/scan" \
  -H "x-rapidapi-key: YOUR_RAPIDAPI_KEY" \
  -H "x-rapidapi-host: website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com" \
  -H "Content-Type: application/json" \
  -d '{"domains": ["posthog.com", "stripe.com"]}'
```

## Free n8n Workflow Template

Import the ready-to-run workflow (**B2B Lead Technographics, Ad Pixels & DNS SaaS Qualifier**): [`n8n-template.json`](./n8n-template.json)

1. Download [`n8n-template.json`](./n8n-template.json) and click **Import from File** in n8n.
2. Add a Generic Header Auth credential (`x-rapidapi-key`) using your free RapidAPI key.
3. Replace the sample domain list and connect your Slack channel.

## Ready-to-Run Presets (Apify Public Tasks)
- [Meta, Google Ads & TikTok Ad Pixel ID Extractor](https://apify.com/spiky_closet/tech-stack-ad-pixel-detector/examples/meta-google-tiktok-ad-pixel-extractor)
- [Wappalyzer & BuiltWith Bulk Website Tech Stack Lookup](https://apify.com/spiky_closet/tech-stack-ad-pixel-detector/examples/wappalyzer-builtwith-bulk-tech-lookup)
- [B2B DNS Enterprise SaaS & Mail Stack Verifier](https://apify.com/spiky_closet/tech-stack-ad-pixel-detector/examples/b2b-dns-enterprise-saas-verifier)
