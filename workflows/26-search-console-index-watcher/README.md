# Search Console index watcher

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Checks your money pages in Google Search Console every morning and pings Slack the day one of them falls out of Google's index, for site owners who usually find out weeks later from a traffic drop.

## What it does
- Runs daily at 6:00 and reads your list of URLs from a Google Sheet.
- Calls the Search Console URL Inspection API for each URL (`POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`), 5 per second.
- Reads `coverageState`, `verdict`, `lastCrawlTime` and `googleCanonical` from the result and writes them back to the sheet, so the sheet always shows today's status.
- Compares today's coverage state with yesterday's. If a page was "Submitted and indexed" (or "Indexed, not submitted in sitemap") and now is anything else, such as crawled but not indexed, excluded by a noindex tag, or turned into a redirect, it posts an alert in Slack with a link to the inspection in Search Console.
- A failed API call never counts as a drop. It is written to `last_error` and yesterday's state is kept.

## You need
- A verified property in Google Search Console, and a Google account with access to it
- A Google Cloud project with the **Google Search Console API** enabled and an OAuth client (type Web application) whose redirect URI is the one n8n shows in the credential screen
- In n8n, a **Google OAuth2 API** credential using that client ID and secret, with the scope `https://www.googleapis.com/auth/webmasters.readonly`
- A Google Sheets credential and a Slack credential
- A Google Sheet with a tab called `Index watch` and these headers in row 1: `url, coverage_state, verdict, last_crawl, google_canonical, last_checked, last_error`. Put one full URL per row in the `url` column and leave the rest empty.

## Setup
1. Import `workflow.json` into n8n.
2. Create the Google OAuth2 API credential described above, name it `Google Search Console account` and sign in with the Google account that has Search Console access. Select it in **Inspect URL in Search Console**.
3. Open **Your settings** and set `siteUrl` to your property exactly as Search Console names it: `sc-domain:example.com` for a domain property, or `https://www.example.com/` with the trailing slash for a URL prefix property. Every URL in the sheet must belong to this property.
4. In **Read URLs to watch** and **Save today's status**, select your Google Sheets credential and replace `YOUR_SHEET_ID`.
5. In **Alert in Slack**, select your Slack credential and set the channel.

## Test it
1. Add 3 to 5 URLs to the sheet, including one you know is indexed.
2. Click **Execute workflow**. The sheet fills in with the coverage state of each URL. No alert fires on the first run because there is no previous state yet.
3. To see an alert, change one `coverage_state` cell in the sheet to `Submitted and indexed` for a URL that is not indexed, then run again. Slack gets the alert and the sheet is corrected.
4. Activate the workflow.

## What it costs to run
- The URL Inspection API is free. Google's quota is 2,000 inspections per day and 600 per minute per property, so this works for up to about 2,000 URLs.
- Google Sheets and Slack: free.
- n8n: one execution per day.

## Customize
- Send a "back in the index" message too: add a second filter for pages where `previous_state` was not indexed and `coverage_state` now is.
- Add a column `priority` and only alert for high priority pages, or tag the page owner in Slack.
- Feed the sheet automatically from your sitemap with an HTTP Request and an XML node.
- Pair it with workflow 30 to resubmit changed URLs to Bing and Yandex through IndexNow.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=search-console-index-watcher).
