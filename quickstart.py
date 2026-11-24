#!/usr/bin/env python3
import os, sys, json, urllib.request

key = os.environ.get("RAPIDAPI_KEY")
if not key:
    sys.exit("Set RAPIDAPI_KEY first (free tier: https://rapidapi.com/HYunLe/api/website-tech-stack-ad-pixels-and-saas-detector)")
domains = sys.argv[1:] or ["klaviyo.com", "linear.app"]
req = urllib.request.Request(
    "https://website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com/scan",
    data=json.dumps({"domains": domains, "unpackGtm": True, "checkDns": True}).encode(),
    headers={"Content-Type": "application/json", "x-rapidapi-key": key, "x-rapidapi-host": "website-tech-stack-ad-pixels-and-saas-detector.p.rapidapi.com"},
)
with urllib.request.urlopen(req, timeout=25) as r:
    print(json.dumps(json.loads(r.read().decode()), indent=2))
