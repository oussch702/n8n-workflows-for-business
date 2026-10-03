# Site uptime and broken page alerts

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Checks your most important pages every 15 minutes and sends one Slack alert when a page breaks, a reminder while it stays broken, and an all clear with the downtime when it recovers, for small businesses that want uptime monitoring without another subscription.

## What it does
- Every 15 minutes, requests each page on your list with a 10 second timeout.
- Marks a page as failing when it does not answer in time, returns a status outside 200 to 299 (after following redirects), or loads without a piece of text you expect. The text check catches the classic "white page" or "database error" page that still returns 200.
- Remembers each page's state between runs in n8n's workflow static data, so nothing external is needed.
- Sends Slack a **DOWN** message only after 2 failed checks in a row (one slow response does not wake anyone up).
- While the page stays down, sends a **Still down** reminder every 4 hours instead of every 15 minutes.
- When the page answers correctly again, sends **Back up** with roughly how long it was down.

## You need
- A Slack credential with access to your alerts channel
- That is it. No database, no sheet, no third party monitoring service.

## Setup
1. Import `workflow.json` into n8n.
2. Open **Pages to check** and replace the example URLs with yours. For each, optionally set `mustContain` to a short piece of text that is always on that page when it works. Change `timeoutSeconds` if 10 seconds is too strict or too loose.
3. Open **Decide and de-duplicate** and adjust `failuresBeforeAlert` and `remindEveryHours` if you like.
4. Open **Alert in Slack**, select your Slack credential and set the channel.
5. Activate the workflow.

## Test it
n8n only saves workflow static data during runs of an active workflow, not during manual test runs. So test it like this:
1. Set `failuresBeforeAlert` to 1 and add a page that does not exist, for example `https://www.example.com/this-page-does-not-exist`.
2. Click **Execute workflow**. You get a DOWN alert for that page in Slack (the 404). Run it again and you get the alert again, because the manual run did not save state. That is expected.
3. Set `failuresBeforeAlert` back to 2, remove the test page and activate the workflow. In production, each outage now produces one alert, reminders every 4 hours and one recovery message.

## What it costs to run
- No paid APIs. Slack is free.
- n8n: every 15 minutes is 96 executions a day, about 2,900 a month. Self-hosted, that costs nothing extra. On n8n Cloud, that is more than the smallest plan includes at the time of writing, so check your plan's execution limit or run it every 30 minutes (about 1,450 a month).
- Your server sees one request per page per check. 10 pages every 15 minutes is under 1,000 requests a day.

## Customize
- Run it every 5 minutes for faster alerts and keep `failuresBeforeAlert` at 2.
- Also text the owner with Twilio when the home page or checkout is down.
- Check your sitemap once a day for broken pages: fetch `sitemap.xml`, split it into URLs and send them through the same check.
- Watch SSL expiry or response time trends by logging each check to a Google Sheet (mind the execution volume).

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=site-uptime-and-broken-links).
