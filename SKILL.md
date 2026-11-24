---
name: tech-stack-ad-pixel-detector
description: Detect 180+ website technologies, unpack static GTM containers for consent-gated Google Ads, Meta, LinkedIn, TikTok & GA4 ad pixel IDs, and verify 70+ internal enterprise SaaS tools via DNS without a browser.
---

# Tech Stack & Ad Pixel Detector Skill (StackScope)

Use this skill when checking a website's technology stack, extracting hidden Meta/Google Ads/LinkedIn/TikTok pixel IDs from Google Tag Manager, or verifying internal enterprise SaaS adoption (`Google Workspace`, `Microsoft 365`, `Stripe`, `OpenAI`, `Anthropic`, `HubSpot`, `Rippling`) via public DNS.

## Fast REST Endpoint (`POST /scan`)
```bash
curl -s -X POST "https://website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com/scan" \
  -H "Content-Type: application/json" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com" \
  -d '{"domains": ["klaviyo.com", "hubspot.com", "allbirds.com"], "unpackGtm": true, "checkDns": true}'
```

## Remote Streamable HTTP MCP (`mcp.json`)
```json
{
  "mcpServers": {
    "tech-stack-ad-pixel-detector": {
      "url": "https://spiky-closet--tech-stack-ad-pixel-detector.apify.actor/mcp",
      "headers": { "Authorization": "Bearer ${APIFY_TOKEN}" }
    }
  }
}
```
