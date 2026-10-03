# Form lead: qualify and route

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Checks every website form lead against your budget, timeline and decision maker rules, books the good ones and nurtures the rest, for service businesses that get more enquiries than they can call back.

## What it does
- Receives your form submission on a webhook and answers the form right away, so the visitor never waits.
- Cleans up the fields (trims, lowercases the email, turns "$5,000" into 5000).
- Qualifies the lead: budget of at least 2,000, timeline of "asap", "this month" or "1-3 months", and the person can sign off.
- Qualified: emails your booking link from your Gmail and posts the lead to Slack for sales.
- Not qualified: sends a friendly nurture email with your resources.
- Logs every lead to a Google Sheet with its status, so the sheet doubles as a simple CRM.

## You need
- An n8n instance (self-hosted or n8n Cloud)
- Gmail account (OAuth credential in n8n)
- Slack workspace with the n8n app (Slack credential)
- Google Sheets (OAuth credential) and one spreadsheet
- A website form that can POST to a URL (Webflow, WordPress with a webhook plugin, Framer, Tally, Typeform, your own code)

## Setup
1. Import `workflow.json` into n8n (Workflows, Import from File).
2. Create a Google Sheet with a tab named `Leads` and these headers in row 1: `received_at, name, email, phone, company, budget, timeline, decision_maker, message, source, status`.
3. Open **Log qualified lead** and **Log nurture lead**, connect your Google Sheets credential and replace `YOUR_SHEET_ID` with the ID from the sheet URL.
4. Connect Gmail in **Email the booking link** and **Send the nurture email**, and rewrite both emails with your booking link, resources link and signature.
5. Connect Slack in **Alert sales in Slack** and set your channel.
6. In **Is the lead qualified?**, adjust the minimum budget and the accepted timelines to match your form's options.
7. Map your form fields to `name, email, phone, company, budget, timeline, decision_maker, message, source`. `decision_maker` accepts yes/true/1/on.
8. Copy the Production URL from **Website form submitted** into your form's webhook setting and activate the workflow.

## Test it
Click **Execute workflow**, then send a request to the Test URL:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/lead-intake" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam Test","email":"you@example.com","phone":"+15555550123","company":"Test Co","budget":"$5,000","timeline":"1-3 months","decision_maker":"yes","message":"Need a new booking system"}'
```

You should get `{"ok": true}` back, a booking link email in your inbox, a Slack post and a new row with status `qualified: booking link sent`. Change the budget to 500 and you get the nurture email and a `nurture` row instead.

## What it costs to run
- n8n: free if self-hosted, otherwise your n8n Cloud plan (check current pricing). Each lead is one execution.
- Gmail, Slack and Google Sheets: free within normal limits. A regular Gmail account can send about 500 emails a day, Google Workspace about 2,000.
- No AI calls, so no per-lead cost.

## Customize
- Replace the IF node with a Switch to create three tiers (hot, warm, nurture) with different emails.
- Add a Twilio node on the qualified branch to text the lead the booking link as well.
- Swap the Sheets nodes for HubSpot or Pipedrive once you outgrow the sheet.
- Add a hidden honeypot field to your form and drop submissions where it is filled, to keep bots out.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=form-lead-qualify-and-route).
