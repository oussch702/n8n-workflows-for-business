# n8n workflows for business

[![validate](https://github.com/oussch702/n8n-workflows-for-business/actions/workflows/validate.yml/badge.svg)](https://github.com/oussch702/n8n-workflows-for-business/actions/workflows/validate.yml)
![30 workflows](https://img.shields.io/badge/workflows-30-ea4b71)
![n8n](https://img.shields.io/badge/n8n-current%20release-ea4b71)
[![MIT license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Thirty n8n workflows for the jobs small businesses automate first: answering calls with an AI receptionist, WhatsApp support and lead qualification, speed to lead, follow-ups, invoices, onboarding, reports and SEO monitoring. Each one imports into n8n as is, comes with a setup guide you can finish in under 30 minutes, and says what it costs to run.

[![Watch the 50-second tour on YouTube](https://img.youtube.com/vi/SNgF8-Ncn1E/maxresdefault.jpg)](https://www.youtube.com/watch?v=SNgF8-Ncn1E)

There are collections with thousands of n8n templates. This one is deliberately small. Every workflow here is a pattern we build for clients at [AI Strike Force](https://aistrikeforce.com), cleaned of client data, and every one is checked before it ships:

- **Validated** against n8n's real node definitions on every commit (the badge above), with zero errors.
- **Imported** into a current n8n release (2.41) to confirm it opens and wires up as shown.
- **Documented** inside the workflow (sticky notes on the nodes you edit) and in its own README: what it does, what you need, setup, how to test it, what it costs and how to change it.
- **Safe to share:** no credentials, keys or real IDs. You connect your own accounts on import.

## Quick start

1. Open a workflow folder below and download `workflow.json` (or copy its contents).
2. In n8n, choose **Create workflow**, then **Import from file** (or paste with Ctrl/Cmd+V on the canvas).
3. Follow the sticky note on the canvas and the folder's README: connect your accounts, replace the `YOUR_...` placeholders, run **Execute workflow** once, then activate it.

Works best on a recent n8n version, self-hosted or n8n Cloud. AI steps use OpenAI's gpt-4.1-mini by default; swap in any chat model n8n supports.

## The workflows

### AI receptionist and calls

| # | Workflow | What it does | Apps | Running cost |
|---|---|---|---|---|
| 01 | [Retell AI call summary to Google Sheets](workflows/01-retell-call-summary-to-sheets) | Logs every finished Retell AI call to Google Sheets with an AI summary and lead rating, and alerts Slack about hot leads. | Retell AI, OpenAI, Google Sheets, Slack | about $0.0014 per call in OpenAI tokens |
| 02 | [Vapi tool: book an appointment in Google Calendar](workflows/02-vapi-book-appointment-tool) | Gives a Vapi voice assistant a tool that checks Google Calendar and books the appointment during the call. | Vapi, Google Calendar | no AI cost; Vapi bills the call itself |
| 03 | [Missed call text back (Twilio)](workflows/03-missed-call-text-back) | Texts callers you missed a booking link within seconds through Twilio and logs each missed call to Google Sheets. | Twilio, Google Sheets | about $0.008 per SMS in the US |
| 04 | [Post-call lead scoring to HubSpot](workflows/04-post-call-lead-scoring) | Scores call transcripts on budget, timeline and intent, writes the score to HubSpot and alerts Slack for high scores. | OpenAI, HubSpot, Slack | about $0.0013 per call in OpenAI tokens |
| 05 | [Daily call report by email](workflows/05-daily-call-report) | Emails the owner an end-of-day digest of calls logged in Google Sheets, with hot leads to call back first. | Google Sheets, OpenAI, Gmail | about $0.002 a day in OpenAI tokens |

### WhatsApp

| # | Workflow | What it does | Apps | Running cost |
|---|---|---|---|---|
| 06 | [WhatsApp AI support agent](workflows/06-whatsapp-ai-support-agent) | Answers customer questions on WhatsApp from your own FAQ with an AI agent and hands off to staff in Slack on request. | WhatsApp, OpenAI, Slack | about $0.0006 per reply in OpenAI tokens |
| 07 | [WhatsApp lead qualification](workflows/07-whatsapp-lead-qualification) | Qualifies WhatsApp leads on name, need, budget and timing, keeps them in Google Sheets and sends a calendar link to good fits. | WhatsApp, OpenAI, Google Sheets | about $0.0004 per message in OpenAI tokens |
| 08 | [WhatsApp appointment reminders from Google Calendar](workflows/08-whatsapp-appointment-reminders) | Sends one WhatsApp template reminder for each Google Calendar appointment in the next 24 hours and logs every send. | Google Calendar, WhatsApp, Google Sheets | Meta utility template rate per message, by country |
| 09 | [WhatsApp order status bot for Shopify](workflows/09-whatsapp-order-status-bot) | Replies to WhatsApp order questions with live Shopify status and tracking, only for the number on the order. | WhatsApp, Shopify | no AI cost; service replies are free |
| 10 | [WhatsApp sale to Meta Conversions API](workflows/10-whatsapp-sale-to-meta-capi) | Sends a Purchase event with the click-to-WhatsApp click ID to Meta Conversions API when a chat sale closes. | Meta Conversions API, Google Sheets | free; no AI calls |

### Leads and CRM

| # | Workflow | What it does | Apps | Running cost |
|---|---|---|---|---|
| 11 | [Form lead: qualify and route](workflows/11-form-lead-qualify-and-route) | Qualifies website form leads on budget, timeline and authority, emails a booking link or nurture email and logs to Sheets. | Gmail, Slack, Google Sheets | free; no AI calls |
| 12 | [Speed to lead: instant email, SMS and Slack](workflows/12-speed-to-lead-alerts) | Emails each new lead, texts your sales rep and posts to Slack within seconds of the form submission. | Gmail, Twilio, Slack | about one cent per lead in Twilio SMS |
| 13 | [Facebook Lead Ads to HubSpot with welcome SMS](workflows/13-facebook-lead-ads-to-crm) | Creates a HubSpot contact and deal for every Facebook or Instagram lead form submission and texts a welcome SMS. | Facebook Lead Ads, HubSpot, Twilio | about one cent per lead in Twilio SMS |
| 14 | [Stale lead follow-up with AI-written emails](workflows/14-stale-lead-follow-up) | Finds leads in Google Sheets who went quiet for three days and sends each an AI-written personal follow-up from Gmail. | Google Sheets, OpenAI, Gmail | about $0.0004 per email in OpenAI tokens |
| 15 | [Lead enrichment from the company website](workflows/15-lead-enrichment-from-website) | Reads a new lead's company homepage and writes an AI profile of what they do and how big they look to your CRM sheet. | OpenAI, Google Sheets | about $0.001 per lead in OpenAI tokens |

### Marketing and content

| # | Workflow | What it does | Apps | Running cost |
|---|---|---|---|---|
| 16 | [RSS to LinkedIn drafts (approval queue)](workflows/16-rss-to-linkedin-drafts) | Turns each new RSS article into a LinkedIn post draft in a Google Sheets approval queue; it never posts on its own. | RSS, OpenAI, Google Sheets | about $0.0008 per draft in OpenAI tokens |
| 17 | [YouTube video to blog draft in Google Docs](workflows/17-youtube-video-to-blog-draft) | Turns each new YouTube video into a blog draft in Google Docs from its transcript or description. | YouTube, OpenAI, Google Docs | about $0.004 per post in OpenAI tokens |
| 18 | [Google Drive to Instagram Reels](workflows/18-google-drive-to-instagram-reels) | Publishes videos dropped in a Google Drive folder as Instagram Reels through the Graph API and logs the permalink. | Google Drive, Instagram Graph API, Google Sheets, Slack | free; no AI calls |
| 19 | [Weekly Meta ads report to Slack](workflows/19-weekly-meta-ads-report) | Posts a plain-English summary of last week's Meta ads results to Slack every Monday. | Meta Marketing API, OpenAI, Slack | about $0.002 per report in OpenAI tokens |
| 20 | [Google review request after an appointment](workflows/20-google-review-request) | Asks clients for a Google review by SMS or email two hours after their calendar appointment ends, once per client. | Google Calendar, Twilio, Gmail, Google Sheets | about one cent per SMS request |

### Operations and finance

| # | Workflow | What it does | Apps | Running cost |
|---|---|---|---|---|
| 21 | [Invoice email to Google Sheets](workflows/21-invoice-email-to-sheets) | Reads PDF invoices from Gmail and adds vendor, dates and amounts to Google Sheets with OpenAI. | Gmail, OpenAI, Google Sheets | about $0.002 per invoice in OpenAI tokens |
| 22 | [Stripe payment to CRM, Slack and thank-you email](workflows/22-stripe-payment-to-crm) | Marks Stripe buyers as customers in HubSpot, posts the sale to Slack and sends a thank-you email. | Stripe, HubSpot, Slack, Gmail | free; no AI calls |
| 23 | [Client onboarding kit](workflows/23-client-onboarding-kit) | Sets up a new client from one form: Google Drive folder, Notion page with checklist, welcome email and Slack post. | n8n Form, Google Drive, Notion, Gmail, Slack | free; no AI calls |
| 24 | [Daily KPI digest](workflows/24-daily-kpi-digest) | Emails a short AI summary of yesterday's KPIs from Google Sheets, compared with the day before and the weekly average. | Google Sheets, OpenAI, Gmail | about $0.0005 per digest in OpenAI tokens |
| 25 | [Contract PDF summarizer](workflows/25-contract-pdf-summarizer) | Turns contract PDFs from Gmail or Google Drive into an email brief with parties, dates, terms and risky clauses. | Gmail, Google Drive, OpenAI | about $0.004 per 10 page contract in OpenAI tokens |

### SEO and AI visibility

| # | Workflow | What it does | Apps | Running cost |
|---|---|---|---|---|
| 26 | [Search Console index watcher](workflows/26-search-console-index-watcher) | Checks key URLs daily with the Search Console URL Inspection API and alerts Slack when a page drops out of the index. | Google Search Console, Google Sheets, Slack | free; no AI calls |
| 27 | [AI brand mention monitor (ChatGPT and Perplexity)](workflows/27-ai-brand-mention-monitor) | Asks ChatGPT and Perplexity your buyer questions weekly through DataForSEO and tracks brand mentions and citations. | DataForSEO, Google Sheets, Slack | about $0.02 per question per engine in DataForSEO fees |
| 28 | [Site uptime and broken page alerts](workflows/28-site-uptime-and-broken-links) | Checks key pages every 15 minutes and alerts Slack once when one goes down, with reminders and a recovery message. | Slack | free; no paid APIs |
| 29 | [Competitor page change monitor](workflows/29-competitor-page-change-monitor) | Detects changes on competitors' pricing pages daily and posts an AI summary of what changed to Slack. | Google Sheets, OpenAI, Slack | about $0.001 per change summary in OpenAI tokens |
| 30 | [New post to IndexNow (Bing, Yandex and partners)](workflows/30-new-post-to-indexnow) | Submits new blog posts from your RSS feed or CMS to IndexNow for Bing and Yandex and logs the response. | IndexNow, Google Sheets | free |

## Which one should I start with?

- **You miss calls:** 03 (missed call text back) is the quickest to set up. For a full AI receptionist, 01 and 02 connect Retell AI or Vapi to your sheet and calendar.
- **Leads go cold:** 12 (speed to lead) and 11 (qualify and route) answer every lead in seconds; 14 follows up the quiet ones.
- **You sell on WhatsApp:** 06 answers questions, 07 qualifies leads, and 10 reports WhatsApp sales back to Meta so your ads learn from them.
- **Admin eats your week:** 21 (invoices), 23 (onboarding) and 24 (daily KPI digest).

## Related open-source tools

Built by the same team, all MIT:

- [google-index-checker](https://github.com/oussch702/google-index-checker): which of your pages Google has indexed, and what changed.
- [whatsapp-conversions-api](https://github.com/oussch702/whatsapp-conversions-api): send WhatsApp sales to Meta's Conversions API, with errors explained.
- [ai-visibility-checker](https://github.com/oussch702/ai-visibility-checker): does ChatGPT, Gemini or Perplexity name your brand?
- [safe-meta-ads-mcp](https://github.com/oussch702/safe-meta-ads-mcp): let an AI agent build Meta ads that start paused.
- [image-dimensions-checker](https://github.com/oussch702/image-dimensions-checker): find the images that make your pages jump.

## Contributing

Found a bug or a payload that changed? Open an issue or a pull request. Run `npm ci --prefix tools && node tools/validate.mjs workflows/*/workflow.json` before you push; the same check runs on every pull request.

## Want it built for you?

We set these up, connect them to your tools and maintain them: AI receptionists, WhatsApp agents, lead systems and automations, fixed price from $2,500. [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=readme) or see [business automation services](https://aistrikeforce.com/business-automation-services?utm_source=github&utm_medium=n8n-workflows&utm_campaign=readme).

## License

MIT. Use them, change them, sell what you build with them.
