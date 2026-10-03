# WhatsApp lead qualification

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Qualifies new WhatsApp leads over a short back-and-forth (name, need, budget, timing), keeps each lead up to date in Google Sheets and sends your calendar link only to the ones that fit, for businesses running click-to-WhatsApp ads.

## What it does
- Receives each incoming text message and looks the sender up in your `Leads` sheet.
- OpenAI merges what you already know about that lead with the new message: name, need, budget (in words and as a number), timing (in words and in weeks).
- Rules you control decide the next step: ask for what is missing, send the calendar link if budget and timing fit, or reply politely that the team will follow up.
- Creates or updates one row per phone number, including the status and the ad click ID (`ctwa_clid`) when the chat came from a click-to-WhatsApp ad.
- Stays quiet once a lead is `qualified` or `not a fit`, so your team can take over the chat.

## You need
- A Meta app with the WhatsApp product, a WhatsApp Business Cloud API phone number and a permanent access token (system user)
- An OpenAI API key (OpenAI credential in n8n)
- Google Sheets (OAuth credential) and one spreadsheet
- An n8n instance reachable over HTTPS

## Setup
1. Import `workflow.json` into n8n.
2. Create a Google Sheet with a tab named `Leads` and these headers in row 1: `Phone, Name, Need, Budget, Budget (USD), Timing, Timing (weeks), Status, Click ID, Last message, Updated`. Paste the sheet ID into **Find this lead in the sheet** and **Save the lead**.
3. Open **Decide the next step** and set `MIN_BUDGET`, `MAX_WEEKS` and `CALENDAR_LINK`. The reply wording is in the same node.
4. Create a **WhatsApp OAuth** credential (Meta app ID and secret) for **WhatsApp Trigger** and a **WhatsApp** credential (access token and business account ID) for **Reply on WhatsApp**.
5. Connect OpenAI in **OpenAI Chat Model** and Google Sheets in both sheet nodes.
6. Activate the workflow.

Meta allows one webhook per app. Workflows 06, 07 and 09 all use a WhatsApp Trigger, so only one of them can be active per Meta app.

## Test it
From your own phone, send "Hi, I'm Sam and I need a new website" to your business number. You should get a reply asking for your budget and timing, and a `collecting` row in the sheet. Reply "About 5k, and we want to start next month". The row turns `qualified`, `Budget (USD)` shows 5000, `Timing (weeks)` shows 4, and you get the calendar link. Delete your row to test again.

## What it costs to run
- OpenAI: about 600 input and 100 output tokens per message. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.0004 per message. A lead usually takes two or three messages.
- WhatsApp: these are replies inside the 24 hour customer service window, which Meta does not charge for at the time of writing. Chats that start from a click-to-WhatsApp ad also get a free 72 hour window. Check Meta's current pricing.
- Google Sheets is free. n8n: one execution per incoming WhatsApp event.

## Customize
- Ask in your own order: change the `missing` list in **Decide the next step**, for example ask for timing before budget.
- Add a Slack or email alert on qualified leads so a person follows up within minutes.
- Use the `Click ID` column with workflow 10 to send a Purchase event to Meta when the lead buys.
- Convert budgets in other currencies by telling the extractor which currency to assume.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=whatsapp-lead-qualification).
