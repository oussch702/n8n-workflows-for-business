# Stale lead follow-up with AI-written emails

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Finds leads who went quiet for three days and sends each one a short, personal follow-up written by OpenAI, for small teams whose pipeline leaks because nobody has time to chase.

## What it does
- Runs every weekday at 9:00.
- Reads your leads from a Google Sheet.
- Keeps only leads with an email, `replied` not set to yes, no `followed_up_at` date yet and a `last_contacted_at` more than 3 days ago.
- Caps the run at 25 leads so a messy sheet can never trigger a mass mailing.
- Has OpenAI (gpt-4.1-mini) write a 50 to 90 word follow-up that refers to what each person asked about, with a subject line.
- Sends it from your Gmail and writes today's date and `followed up (auto)` back to the row, so nobody is chased twice.

## You need
- An n8n instance
- Google Sheets and Gmail (OAuth credentials)
- An OpenAI API key

## Setup
1. Import `workflow.json` into n8n.
2. Create a sheet with a `Leads` tab and these headers: `name, email, company, interest, last_contacted_at, replied, status, followed_up_at`. Optionally add `notes`; the prompt uses it if present. Write dates as `2026-09-28`.
3. Set `YOUR_SHEET_ID` and connect Google Sheets in **Read all leads** and **Mark as followed up**.
4. Add your OpenAI credential to **OpenAI Chat Model** and connect Gmail in **Send the follow-up**.
5. In **Write the follow-up**, replace "Your Name", "Your Company" and "YOUR OFFER" in the system message.
6. Change the schedule in **Every weekday at 9:00** if needed. The time follows your n8n instance's timezone (Settings of the workflow).

## Test it
Add one row with your own email, `last_contacted_at` a week ago and `replied` empty. Click **Execute workflow**. You should receive the follow-up within a minute and see `followed_up_at` filled in on that row. Run it again: nothing is sent, because the row is now marked.

## What it costs to run
- OpenAI: about 400 input and 150 output tokens per email. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.0004 each. Even 25 every weekday is about $0.22 a month.
- Gmail: free. A regular Gmail account allows about 500 sends a day, Google Workspace about 2,000.
- n8n: one execution per day.

## Customize
- Add a second follow-up after 7 more days with a different angle, using a `follow_up_count` column.
- Switch the model to a larger one for more natural writing; the cost per email stays in fractions of a cent.
- Save the draft to Gmail drafts (Gmail node, Draft resource) instead of sending, if you want to review first.
- Mark `replied` automatically with a Gmail Trigger that matches incoming emails to the sheet.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=stale-lead-follow-up).
