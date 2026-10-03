# Speed to lead: instant email, SMS and Slack

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Answers every new lead within seconds by emailing the lead, texting your sales rep and posting to Slack at the same time, for teams that lose deals because nobody called back fast enough.

## What it does
- Receives a new lead on a webhook from any form, landing page or lead source.
- Replies to the sender immediately, so the form never hangs.
- Emails the lead a personal confirmation from your Gmail with a booking link as a fallback.
- Texts your sales rep the name, phone, interest and source through Twilio, with a "call within 5 minutes" nudge.
- Posts the same details to a Slack channel so the whole team sees it.
- Each channel continues on error: if one fails (say the lead left no email), the other two still go out.

## You need
- An n8n instance
- Gmail account (OAuth credential)
- Twilio account with an SMS-capable number (Account SID and Auth Token as a credential). For US numbers, A2P 10DLC registration is required before carriers will deliver your texts.
- Slack workspace with the n8n app

## Setup
1. Import `workflow.json` into n8n.
2. Open **Text the sales rep**: connect Twilio, set *From* to your Twilio number and *To* to your rep's mobile in E.164 format (`+15555550123`).
3. Open **Email the lead**: connect Gmail and rewrite the email in your voice. Keep the promise realistic ("within minutes during business hours").
4. Open **Post in Slack**: connect Slack and pick the channel.
5. Send leads to the Production URL of **New lead received** as JSON with `name, email, phone, interest, source`, then activate.

### Secure the webhook

Anyone who finds the webhook URL can trigger emails and paid SMS. In the **Webhook** node, set **Authentication** to **Header Auth**, create a credential with a long random value (for example a header named `X-Webhook-Secret`), and send the same header from your form. If the form posts straight from a browser, add a hidden honeypot field and a rate limit instead, since a browser cannot keep a secret.

## Test it
Click **Execute workflow** and run:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/new-lead" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam Test","email":"you@example.com","phone":"+15555550123","interest":"Kitchen renovation quote","source":"Google Ads"}'
```

Within a few seconds you should see the email in your inbox, the SMS on the rep's phone and the Slack post.

## What it costs to run
- Twilio SMS: about $0.008 per segment in the US plus carrier fees, so roughly one cent per lead. Other countries cost more (check current pricing). A 10DLC brand and campaign registration has a one-time and monthly fee in the US.
- Gmail and Slack: free within normal limits.
- n8n: free self-hosted or your n8n Cloud plan. One execution per lead.

## Customize
- Only text the rep during working hours: add an IF node on `$now.hour` before the Twilio node and send after-hours leads to email only.
- Round-robin between reps: keep a list of phone numbers in a Set node and pick one with the lead count.
- Add a Wait of 10 minutes and a second Slack ping if nobody has marked the lead as called.
- Log every lead to Google Sheets with the timestamp to track response time.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=speed-to-lead-alerts).
