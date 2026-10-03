# Post-call lead scoring to HubSpot

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Scores every sales call transcript on budget, timeline and intent, writes the score and a summary onto the HubSpot contact and alerts Slack for the best leads, for teams that take more calls than they can review.

## What it does
- Accepts a call transcript from any source on a webhook: Retell, Vapi, Aircall, a meeting recorder or your own app.
- Has OpenAI rate budget, timeline and intent from 1 to 5, with a one-line reason, using only what was said on the call.
- Turns those into a 0 to 100 lead score with fixed weights (budget 30%, timeline 30%, intent 40%), so the number means the same thing every time.
- Creates or updates the HubSpot contact by email, with name, phone, `ai_lead_score` and `ai_call_summary`.
- Posts to Slack when the score is 70 or higher, even if the caller gave no email.

## You need
- An OpenAI API key (OpenAI credential in n8n)
- A HubSpot account (the free CRM works) and a private app token with `crm.objects.contacts.read` and `crm.objects.contacts.write`
- Slack workspace with the n8n app (Slack credential)

## Setup
1. Import `workflow.json` into n8n.
2. In HubSpot, go to Settings, Properties, Contact properties and create `ai_lead_score` (type Number) and `ai_call_summary` (type Multi-line text). The internal names must match exactly.
3. In HubSpot, create a private app with the two contact scopes and copy its access token (older accounts: Settings, Integrations, Private apps; newer accounts list them under Development, Legacy apps). In n8n, create a HubSpot App Token credential and select it in **Update the HubSpot contact**.
4. Connect OpenAI in **OpenAI Chat Model** and Slack in **Alert sales in Slack**, and replace `YOUR_SLACK_CHANNEL_ID`.
5. Activate the workflow and send transcripts to the Production URL of **Call transcript received** as JSON: `name`, `email`, `phone`, `transcript`. Only `transcript` is required, but without `email` nothing is written to HubSpot.

### Secure the webhook

Anyone who finds the webhook URL can send it a transcript and write to HubSpot. In the **Webhook** node, set **Authentication** to **Header Auth**, create a credential with a long random value (for example a header named `X-Webhook-Secret`), and send the same header from whatever posts the transcripts.

## Test it
Click **Execute workflow** and send a sample call to the Test URL:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/call-transcript" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Rivera","email":"you@example.com","phone":"+15555550123","transcript":"Agent: How can we help?\nCaller: We want to redo our kitchen before the holidays, so we need to start in the next two weeks. We have set aside about 40k. Can you send a proposal this week?"}'
```

You should see a contact for `you@example.com` in HubSpot with a score of 80 or more and a summary, and a Slack message. Change the transcript to "just looking, maybe next year" and the score drops below 30 with no Slack alert.

## What it costs to run
- OpenAI: a 5 minute transcript is roughly 2,500 input and 200 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is about $0.0013 per call.
- HubSpot private apps and custom properties are available on the free CRM. Slack is free within normal limits.
- n8n: free self-hosted, or one execution per transcript on n8n Cloud.

## Customize
- Change the weights in **Calculate the lead score** or the 70 threshold in **Score 70 or higher?** after you have scored a few weeks of calls and compared with what closed.
- Add an `authority_score` (are they the decision maker?) to the extractor and the formula for B2B sales.
- Set the HubSpot lead status or lifecycle stage from the score, for example `Sales qualified lead` above 80.
- Point workflow 01 at this one by adding an HTTP Request node at its end, so Retell calls get scored in HubSpot too.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=post-call-lead-scoring).
