# CLAUDE.md — Israel's Master Context

## INFRA RULES (NON-NEGOTIABLE)
- Frontends → Cloudflare Pages ONLY. No Vercel ever.
- Backend workers/cron jobs → Render ONLY
- DNS → Porkbun
- Source of truth → GitHub

## THE PORTFOLIO
- ihatecollege.com → Cloudflare Pages → AdSense ca-pub-7215975042937417
- placebets.ai → Cloudflare Pages → acquisition target
- spanishtvshows.com → Cloudflare Pages → AdSense
- shopkurt.com → Shopify → eBay dropship + TikTok Shop
- fashionistas.ai → Shopify → women's fashion
- hiddencameras.tv → Cloudflare Pages → Amazon affiliate hiddencamerastv-20

## SHOPKURT RULES
- NEVER use reserve prices on eBay ($5 each, non-refundable, already cost money)
- NEVER list shoes without US Shoe Size in item specifics (eBay silently suppresses)
- Max 250 free eBay listings, stay under 245
- Best Offer enabled on every eBay listing
- TikTok Shop needs 200+ active products to exit probation
- CJ US warehouse only (2-day ship), Trendsi, Zendrop as backup
- TikTok targets: kitchen gadgets, beauty tools, phone accessories, pet products, LED, fitness

## THE HIVE
- Claude Code = orchestrator
- Codex (OpenAI) = code tasks
- Gemini Flash = content/SEO/product descriptions  
- Grok (xAI) = trends/TikTok/social
- MCP servers in ~/hive/mcp-servers/
- All tasks routed through ~/hive/route.js

## KNOWN BUGS NEVER TO REPEAT
1. Vercel double-deploy cost $150 — never use Vercel
2. eBay reserve prices cost $20+ — never use reserve prices
3. Shoe listings with no sizes get suppressed — always require US shoe size
4. CJ API tokens expire — always add refresh + retry logic
5. Render free tier spins down — add health check pings

## API KEYS (in .env, never hardcode)
ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, GROK_API_KEY,
CJ_API_KEY, CJ_EMAIL, EBAY_APP_ID, EBAY_CERT_ID, EBAY_DEV_ID, EBAY_USER_TOKEN,
SHOPIFY_SHOPKURT_TOKEN, SHOPIFY_SHOPKURT_STORE=shopkurt.myshopify.com,
RENDER_API_KEY, PORKBUN_API_KEY, PORKBUN_SECRET_KEY

## CURRENT PRIORITIES
1. Fix existing eBay shoe listings missing shoe sizes
2. TikTok Shop → get to 200 products to exit probation (cheap CJ US items)
3. eBay → fill to 245 listings with profitable items + full item specifics
4. Hive → 4 agents running via MCP in Claude Code
5. hiddencameras.tv → AdSense application + Search Console indexing
6. Shopify API token regen with write scopes
