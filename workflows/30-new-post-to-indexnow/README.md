# New post to IndexNow (Bing, Yandex and partners)

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Submits every new blog post to IndexNow the moment it appears, so Bing, Yandex and the other participating search engines crawl it in minutes instead of days, for site owners who publish regularly and want Bing (and the AI answers built on Bing's index, such as Copilot) to pick up new pages fast.

## What it does
- Watches your RSS feed every hour for new posts, or accepts a POST from your CMS on publish. Use either or both.
- Collects the URLs, drops duplicates and ignores anything that is not on your own site.
- Sends one request per host to `POST https://api.indexnow.org/indexnow` with `host`, `key`, `keyLocation` and `urlList`. Submissions to this shared endpoint are passed on to every participating engine (Bing, Yandex, Seznam, Naver and others).
- Logs the time, URLs and IndexNow response code with a plain English meaning to a Google Sheet.

Google does not use IndexNow. For Google, keep your sitemap in Search Console up to date (and see workflow 26 to watch indexing).

## You need
- Access to upload one small text file to the root of your website
- A Google Sheets credential for the log
- No IndexNow account. The key file is your proof of ownership.

### The key file, explained
IndexNow has no sign up. You prove you own the site by hosting a file whose name and content are the same key.
1. Make a key: 8 to 128 characters using letters, numbers and dashes. A 32 character random hex string is typical. On a Mac or Linux terminal, `openssl rand -hex 16` prints one. Bing Webmaster Tools can also generate one under IndexNow.
2. Create a plain text file named `<your-key>.txt` whose only content is the key, with no spaces or extra lines.
3. Upload it to the root of your site so it opens at `https://www.example.com/<your-key>.txt`. Open that URL in a browser to check.
4. On WordPress, the official IndexNow plugin or Yoast/Rank Math can host the key for you. Use the key they show.

The workflow sets `keyLocation` to `https://<host>/<key>.txt`. If you host the file somewhere else, change that line, and remember a key file in a subfolder only covers URLs inside that subfolder.

## Setup
1. Import `workflow.json` into n8n.
2. Open **Build the IndexNow request** and set `KEY` to your key and `ALLOWED_HOSTS` to your host exactly as it appears in your URLs (`www.example.com` and `example.com` are different hosts).
3. RSS: open **New post in RSS feed** and set your feed URL (WordPress: `https://www.example.com/feed/`, Ghost: `/rss/`, many others: `/feed.xml`). If you only use the webhook, delete this node.
4. Webhook: open **Or: ping from your CMS** and copy the Production URL. Have your CMS (or Zapier, Make, a deploy hook) POST JSON like `{"url": "https://www.example.com/blog/new-post"}` or `{"urls": ["...", "..."]}` to it. If you only use RSS, delete this node.
5. Open **Log the submission**, select your Google Sheets credential and replace `YOUR_SHEET_ID`. Create a tab called `IndexNow log` with these headers: `submitted_at, host, url_count, urls, status, meaning`.

## Test it
1. Open **Or: ping from your CMS**, click **Listen for test event**, then send a test request with a real post URL:
   `curl -X POST -H "Content-Type: application/json" -d '{"url":"https://www.example.com/blog/some-post"}' <your test URL>`
2. The log gets a row with status 200 or 202. 202 means IndexNow received it and will check your key file shortly; that is normal for a new key.
3. A 403 means the key file is missing or does not match. A 422 means the URL is not on the host you set.
4. To test the RSS path, click **Fetch Test Event** on **New post in RSS feed**: it pulls the latest post from your feed and runs it through the same steps.
5. Activate the workflow. From then on, new posts are picked up on the next hourly feed check.

## What it costs to run
- IndexNow is free.
- Google Sheets: free.
- n8n: an hourly RSS poll only creates an execution when there is a new post, plus one per webhook call.

## Customize
- Also submit updated pages: point a second RSS feed (or your sitemap's `lastmod` dates) at the same code node.
- Submit to Bing directly with `https://www.bing.com/indexnow` if you want the Bing endpoint specifically; the payload is identical.
- Add a Slack message when the status is 403 or 422, so a broken key file never goes unnoticed.
- Protect the webhook with Header Auth in the Webhook node if you share the URL with other tools.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=new-post-to-indexnow).
