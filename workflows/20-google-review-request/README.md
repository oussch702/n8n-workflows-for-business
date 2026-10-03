# Google review request after an appointment

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Asks each client for a Google review two hours after their appointment ends, by SMS or email, and never asks the same person twice, for clinics, salons, trades and any business that runs on a calendar.

## What it does
- Checks your Google Calendar every 15 minutes for appointments that just ended.
- Skips events with no guest, cancelled events and anything with `internal` or `no review` in the title.
- Picks the client's email from the guest list and a phone number from a `Phone:` line in the event description.
- Waits 2 hours, so the request arrives after the visit, not during it.
- Compares the client's email against a log sheet and drops anyone who was already asked.
- Texts the review link through Twilio when there is a phone number, otherwise emails it from Gmail, and logs the request.

## You need
- An n8n instance
- Google Calendar, Google Sheets and Gmail (OAuth credentials)
- A Twilio account with an SMS-capable number (US numbers need A2P 10DLC registration), if you want SMS
- Your Google review link: Google Business Profile, Ask for reviews, copy the link

## Setup
1. Import `workflow.json` into n8n.
2. In **Appointment ended**, connect Google Calendar and pick the calendar your appointments live in.
3. Book clients as guests on the event. For SMS, add a line like `Phone: +15555550123` to the event description (most booking tools can put the phone there for you).
4. In **Settings**, paste your review link and business name.
5. Create a sheet with a `Review requests` tab and headers `sent_at, name, email, phone, channel, event`. Set `YOUR_SHEET_ID` in **Read past requests** and **Log the request**.
6. Connect Twilio in **Text the review link** (set your *From* number) and Gmail in **Email the review link**. Rewrite both messages in your voice.
7. Activate.

## Test it
To skip the 2 hour wait while testing, set **Wait 2 hours** to 1 minute. Create a 15 minute event that ended a few minutes ago, add your own email as a guest and `Phone: <your mobile>` to the description. Click **Execute workflow**: you should get the SMS a minute later and see a row in `Review requests`. Run it again with the same guest and nothing is sent. Set the wait back to 2 hours before activating.

## What it costs to run
- Twilio SMS: about $0.008 per segment in the US plus carrier fees, roughly one cent per request. The message is written to fit in one or two segments depending on your business name and link.
- Google Calendar, Sheets and Gmail: free within normal limits.
- n8n: the calendar check runs 96 times a day; each ended appointment adds one execution, which pauses during the wait (self-hosted is free; on n8n Cloud check how your plan counts executions).

## Customize
- Ask again after 12 months instead of never: filter the log by `sent_at` before comparing.
- Add a link to a short private feedback form in the same message, so unhappy clients have somewhere to go. Keep asking everyone for the review: Google's policies forbid asking only happy clients.
- Use WhatsApp instead of SMS where your clients prefer it.
- Use different review links per location with a Switch on the calendar or event title.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=google-review-request).
