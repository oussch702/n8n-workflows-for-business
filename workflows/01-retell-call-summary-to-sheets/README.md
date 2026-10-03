# Retell AI call summary to Google Sheets

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Turns every call your Retell AI receptionist finishes into a tidy Google Sheets row with a summary and lead rating, and pings Slack for hot leads, for businesses that answer the phone with AI.

## What it does
- Receives Retell's webhook and answers it at once, well inside Retell's 10 second timeout.
- Ignores the other Retell events (`call_started`, `call_analyzed`, transfers) and calls with no transcript, such as no-answers.
- Reads the transcript with OpenAI and pulls out the caller's name, email, reason for calling, a short summary, a hot/warm/cold rating and the next step.
- Adds one row per call to Google Sheets: date, numbers, direction, duration, who hung up and the AI fields.
- Posts hot leads to a Slack channel so someone calls back while the lead is warm.

## You need
- A Retell AI agent with a phone number
- An OpenAI API key (OpenAI credential in n8n)
- Google Sheets (OAuth credential) and one spreadsheet
- Slack workspace with the n8n app (Slack credential)

## Setup
1. Import `workflow.json` into n8n (Workflows, Import from File).
2. Create a Google Sheet with a tab named `Calls` and these headers in row 1: `Date, Call ID, From, To, Direction, Duration (sec), Ended by, Caller name, Email, Reason, Summary, Lead temperature, Next step`.
3. Open **Log the call in Google Sheets**, connect Google Sheets and replace `YOUR_SHEET_ID` with the ID from the sheet URL.
4. Open **OpenAI Chat Model** and connect your OpenAI credential.
5. Open **Alert sales in Slack**, connect Slack and replace `YOUR_SLACK_CHANNEL_ID` with your channel ID (right click the channel in Slack, View channel details, the ID is at the bottom). Invite the n8n app to that channel.
6. Activate the workflow and copy the Production URL from **Retell call webhook**.
7. In Retell, paste that URL as the webhook URL of your agent (or as the account level webhook) and save.

## Test it
Click **Execute workflow**, then send a fake `call_ended` event to the Test URL:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/retell-call-events" \
  -H "Content-Type: application/json" \
  -d '{"event":"call_ended","call":{"call_id":"test_call_1","from_number":"+15555550123","to_number":"+15555550124","direction":"inbound","start_timestamp":1791000000000,"end_timestamp":1791000095000,"disconnection_reason":"user_hangup","transcript":"Agent: Thanks for calling, how can I help?\nUser: Hi, this is Dana. Our office AC died this morning and we need someone out today. Budget is not a problem.\nAgent: Understood. What is the best email?\nUser: dana@example.com"}}'
```

You should see a new row in `Calls` rated `hot` and a Slack message for Dana. Then place a real call to your Retell number and check that a second row appears a few seconds after you hang up.

## What it costs to run
- OpenAI: a 5 minute call is roughly 2,500 input and 250 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is about $0.0014 per call, or $1.40 per 1,000 calls.
- Retell bills its own per-minute rate for the calls themselves; this workflow adds nothing to it.
- Google Sheets and Slack: free within normal limits. n8n: free self-hosted, or one execution per Retell event on n8n Cloud (Retell sends several events per call; all but `call_ended` stop at the first filter).

## Customize
- Retell signs every webhook with an `x-retell-signature` header. If your n8n is public, add a Code node that checks it, or use the Webhook node's IP allowlist with Retell's published IP.
- Prefer Retell's own post-call analysis? Switch the filter to `call_analyzed` and read `call.call_analysis.call_summary` and `custom_analysis_data` instead of calling OpenAI.
- Add a `Service` field to the extractor (for example "boiler repair") so you can filter the sheet by what people call about.
- Send hot leads to HubSpot as well with workflow 04.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=retell-call-summary-to-sheets).
