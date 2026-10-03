# RSS to LinkedIn drafts (approval queue)

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Turns each new article from an RSS feed into a LinkedIn post draft in your voice and puts it in a Google Sheet for you to approve, for founders who want to post regularly without letting a bot speak for them.

## What it does
- Checks your RSS feed every hour and picks up only new items.
- Takes at most 5 items per check, so a feed that dumps 50 old posts does not run up a bill.
- Cleans the article title, link and text.
- Has OpenAI (gpt-4.1-mini) draft a 120 to 200 word LinkedIn post with your own takeaway, plus a short label for the angle.
- Adds the draft to a `Drafts` sheet with status `pending review`.
- **It never posts to LinkedIn.** You review, edit and post by hand. Your name is on it, so a human signs off on every word.

## You need
- An n8n instance
- An OpenAI API key
- Google Sheets (OAuth credential)
- The RSS feed URL of your blog, a trade publication or a newsletter

## Setup
1. Import `workflow.json` into n8n.
2. Paste your feed URL into **New article in feed**.
3. Create a sheet with a `Drafts` tab and these headers: `created_at, source_title, source_link, angle, draft, status, reviewer_notes`. Set `YOUR_SHEET_ID` in **Add to approval queue** and connect Google Sheets.
4. Add your OpenAI credential to **OpenAI Chat Model**.
5. In **Draft the LinkedIn post**, fill in the bracketed parts of the system message: who you are, your role, who you write for.
6. Activate.

## Test it
Click **Execute workflow**. The RSS trigger fetches the latest item from your feed in test mode, and within about 10 seconds a new row appears in `Drafts` with a draft and status `pending review`. Read three or four drafts before trusting the voice, and tune the system message until they sound like you.

## What it costs to run
- OpenAI: about 800 input and 300 output tokens per draft. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.0008 each. A feed with 3 posts a day costs about 7 cents a month.
- Google Sheets and RSS: free.
- n8n: polling every hour is 24 checks a day; on n8n Cloud, check how your plan counts executions.

## Customize
- Add a `posted` status and a weekly Slack reminder listing drafts still waiting.
- Watch several feeds by duplicating the trigger and connecting all of them to **Max 5 per check**.
- Ask for two versions per article (short and long) by extending the parser example.
- Once you trust the drafts, connect a scheduling tool that reads approved rows. Keep the human approval step.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=rss-to-linkedin-drafts).
