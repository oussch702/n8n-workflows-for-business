# Daily call report by email

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Emails the owner a short end-of-day digest of every call logged that day (totals, hot leads to call back first, anything unusual), for businesses running an AI receptionist.

## What it does
- Runs every day at 18:00 in your workflow's time zone.
- Reads the `Calls` sheet that workflow 01 fills and keeps the rows dated today.
- Counts hot, warm and cold calls in code, so the totals are exact and never made up by the AI.
- Has OpenAI write a plain text digest under 200 words: totals, who to call back first, warm leads, anything unusual.
- Emails it from your Gmail. On days with no calls you get a one-line email instead, so silence never hides a broken setup.

## You need
- The `Calls` sheet from workflow 01, or any sheet with a `Date` column formatted `yyyy-MM-dd HH:mm` plus `Caller name`, `From`, `Lead temperature`, `Reason`, `Summary` and `Next step`
- An OpenAI API key (OpenAI credential in n8n)
- Gmail (OAuth credential in n8n)

## Setup
1. Import `workflow.json` into n8n.
2. Open **Read the call log**, connect Google Sheets and replace `YOUR_SHEET_ID`.
3. Connect OpenAI in **OpenAI Chat Model**.
4. Open **Email the report** and **Email: quiet day**, connect Gmail and replace `you@example.com` with your address.
5. Open the workflow Settings and set the Timezone to yours. Both the 18:00 trigger and "today" use it.
6. Activate the workflow.

## Test it
Make sure the sheet has at least one row with today's date, then click **Execute workflow**. You should get an email titled "Calls today: N (H hot)" within a few seconds. Delete or rename today's rows and run it again to see the quiet day email.

## What it costs to run
- OpenAI: one call a day. Thirty calls is about 3,000 input and 300 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.002 a day.
- Gmail and Google Sheets: free within normal limits.
- n8n: one execution a day.

## Customize
- Send it to Slack instead of email by swapping the Gmail nodes for a Slack node.
- Change the schedule to weekdays only by switching the trigger to a cron expression such as `0 18 * * 1-5`.
- Add yesterday's totals to the prompt so the digest can say whether call volume is going up or down.
- Send a separate morning list of unanswered hot leads to whoever does callbacks.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=daily-call-report).
