# Daily KPI digest

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Emails you a short, plain English summary of yesterday's numbers every morning, with what changed against the day before and the weekly average, for owners who keep their KPIs in a Google Sheet but never open it.

## What it does
- Runs every morning at 7:30 (your n8n instance timezone).
- Reads every row of your KPI sheet.
- Compares the newest row with the row before it and with the average of the 7 rows before that, for every numeric column.
- Asks OpenAI to write a digest of under 120 words: the one thing that matters most, then the biggest moves with real numbers.
- Emails you the digest with the full numbers table underneath, so you can check the AI against the data.

## You need
- A Google Sheets credential
- An OpenAI API key
- A Gmail credential
- A Google Sheet with a tab called `KPIs`. Row 1 holds the headers: `Date` first, then one column per metric, for example `Revenue, New leads, Calls booked, Ad spend, Refunds`. One row per day, newest at the bottom. Fill it by hand, from a form, or from other workflows in this repo.

## Setup
1. Import `workflow.json` into n8n.
2. Open **Read KPI sheet**, select your Google Sheets credential and replace `YOUR_SHEET_ID` with your sheet ID. Change the tab name if it is not `KPIs`.
3. Open **OpenAI model** and select your OpenAI credential.
4. Open **Email the digest**, select your Gmail credential and replace `you@example.com` with your address.
5. Change the time in **Every morning at 7:30** if you want it earlier or later. Check the timezone under the workflow Settings.

## Test it
1. Make sure the sheet has at least 3 days of numbers.
2. Click **Execute workflow**.
3. Within a few seconds you get an email titled "KPI digest for" plus the latest date, with a short summary on top and the table below.
4. Activate the workflow.

## What it costs to run
- OpenAI: about 500 input and 200 output tokens per day. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.0005 per digest, under 2 cents a month.
- Google Sheets and Gmail: free.
- n8n: 30 executions a month.

## Customize
- Send it to Slack instead of email (or both) with the Slack node.
- Make it weekly: change the schedule to Mondays and compare the last 7 rows with the 7 before.
- Add targets: a second tab with monthly goals, so the digest can say "Revenue is at 62% of the monthly target on day 18".
- Pull numbers straight from Stripe, HubSpot or your ad accounts the night before instead of keeping the sheet by hand.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=daily-kpi-digest).
