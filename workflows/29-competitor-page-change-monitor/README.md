# Competitor page change monitor

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Watches your competitors' pricing and offer pages every day and tells you in Slack, in plain English, what they changed, for owners who want to know about a price move the day it happens instead of from a lost deal.

## What it does
- Runs daily at 7:00 and reads your list of competitor pages from a Google Sheet.
- Fetches each page and strips it to visible text. Raw HTML changes on every load (scripts, tracking IDs, security tokens), so hashing the HTML would report a change every day; hashing the text does not.
- Fingerprints the text with the Crypto node (SHA-256) and compares it with yesterday's fingerprint stored in the sheet.
- When the fingerprint differs, works out which lines were added and removed and asks OpenAI to summarize the change in up to 4 bullets, prices and offers first.
- Drops changes the AI judges cosmetic (dates, counters, rotating reviews) and posts the rest in Slack.
- Saves today's fingerprint and text back to the sheet, with the time of the last real change. A failed fetch is logged in `last_error` and never counts as a change.

## You need
- A Google Sheets credential
- An OpenAI API key
- A Slack credential
- A Google Sheet with a tab called `Competitors` and these headers in row 1: `name, url, last_hash, last_text, last_checked, last_changed, last_error`. Fill in `name` and `url` for each page you want to watch and leave the other columns empty.

## Setup
1. Import `workflow.json` into n8n.
2. In **Read competitor pages** and **Save the new fingerprint**, select your Google Sheets credential and replace `YOUR_SHEET_ID`.
3. Open **OpenAI model** and select your OpenAI credential.
4. Open **Post the change in Slack**, select your Slack credential and set the channel.

## Test it
1. Add 2 or 3 pages to the sheet (pricing pages are the most useful).
2. Click **Execute workflow**. The sheet fills in `last_hash` and `last_text`. No Slack message yet, because there is nothing to compare with.
3. To see an alert, edit one `last_text` cell: change a price or delete a line, and change any character in its `last_hash`. Run again. Slack gets a summary of the "change" and the sheet is reset to the real page.
4. Activate the workflow.

Pages that are built entirely in the browser with JavaScript return almost no text to a plain HTTP request. If `last_text` stays nearly empty for a page, use a scraping API (ScrapingBee, Browserless, Firecrawl) in **Fetch the page** for that site.

## What it costs to run
- OpenAI: only runs when a page changed. A typical change is 1,000 to 3,000 input tokens and about 150 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is about $0.001 per summary.
- Google Sheets and Slack: free.
- n8n: one execution per day.

## Customize
- Watch more than pricing: feature pages, the careers page (hiring signals) or the homepage headline.
- Track a single section only: add a line to **Clean the page to text** that keeps the text between two headings, so footer or blog widget changes never fire.
- Post a weekly digest of all changes instead of daily alerts.
- Log every summary to a second tab to build a timeline of competitor moves.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=competitor-page-change-monitor).
