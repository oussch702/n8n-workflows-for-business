# Lead enrichment from the company website

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Reads a new lead's company homepage and writes a short profile (what they do, who they sell to, how big they look) into your CRM sheet, so your team knows who they are talking to before the first call.

## What it does
- Receives a lead on a webhook with an email and, optionally, a company domain.
- Works out the domain from the email when none is given, and skips free providers like gmail.com and outlook.com.
- Fetches the homepage (follows redirects, 15 second timeout, one retry).
- Pulls out the page title, meta description, headings and readable body text.
- Asks OpenAI (gpt-4.1-mini) for a company summary, industry, B2B or B2C, a size estimate and the concrete signals behind it, using only what the page says.
- Writes the result to the lead's row in Google Sheets, matched on email (a new row is added if needed).

## You need
- An n8n instance
- An OpenAI API key
- Google Sheets (OAuth credential)

## Setup
1. Import `workflow.json` into n8n.
2. Create (or reuse) a `Leads` tab with at least these headers: `email, domain, company_summary, industry, sells_to, size_estimate, size_signals, enriched_at`.
3. In **Update the CRM row**, connect Google Sheets and replace `YOUR_SHEET_ID`.
4. Add your OpenAI credential to **OpenAI Chat Model**.
5. Call the Production URL of **New lead to enrich** from your form, from workflow 11 (add an HTTP Request node at the end), or from any tool that can POST JSON. Activate.

## Test it
Click **Execute workflow** and run:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/enrich-lead" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","domain":"n8n.io"}'
```

You get `{"ok": true, "status": "enriching"}` back immediately. A few seconds later the sheet has a row for test@example.com with a one or two sentence summary of n8n and a size estimate. Try `{"email":"someone@gmail.com"}`: it stops at **Work domain?** and nothing is written.

## What it costs to run
- OpenAI: about 2,000 input and 150 output tokens per lead (the page text is capped at 6,000 characters). With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.001 per lead, so 1,000 leads cost about $1.
- Fetching the homepage and Google Sheets: free.
- n8n: one execution per lead.

## Customize
- Also fetch `/about` or `/pricing` and add their text to the prompt for a sharper size estimate.
- Add a `fit_score` field to the parser example (1 to 5 against your ideal customer) and route high scores to Slack.
- Write to HubSpot company properties instead of Sheets.
- Some sites block bots or render everything in JavaScript; the AI then says the page was empty. For those, plug in a scraping API in **Fetch the homepage**.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=lead-enrichment-from-website).
