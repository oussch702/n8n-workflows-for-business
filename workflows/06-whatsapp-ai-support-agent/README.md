# WhatsApp AI support agent

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Answers customer questions on your WhatsApp Business number from your own FAQ, keeps the context of each chat and hands over to a person on request, for small businesses that get the same questions all day.

## What it does
- Receives every incoming WhatsApp message through the WhatsApp Trigger and ignores delivery receipts, images and voice notes.
- If the customer asks for a human ("human", "real person", "staff", "manager"...), alerts your team in Slack and tells the customer a person will reply.
- Otherwise an AI agent answers from the FAQ in its system message, in the customer's language, in one to three sentences.
- Remembers the last 10 messages per phone number, so follow-up questions make sense.
- Says it will check with the team instead of guessing when the answer is not in the FAQ.

## You need
- A Meta app with the WhatsApp product, a WhatsApp Business Cloud API phone number and a permanent access token (system user)
- An OpenAI API key (OpenAI credential in n8n)
- Slack workspace with the n8n app (Slack credential)
- An n8n instance reachable over HTTPS

## Setup
1. Import `workflow.json` into n8n.
2. Create a **WhatsApp OAuth** credential (your Meta app ID and app secret) and select it in **WhatsApp Trigger**.
3. Create a **WhatsApp** credential (access token and WhatsApp Business Account ID) and select it in **Send the answer** and **Tell the customer a person will reply**. The phone number ID is read from each incoming message, so there is nothing else to fill in.
4. Open **Support agent** and replace the example FAQ in the system message with your real hours, address, prices, policies and links. Replace "Your Business" with your name.
5. Connect OpenAI in **OpenAI Chat Model**, connect Slack in **Alert the team in Slack** and replace `YOUR_SLACK_CHANNEL_ID`.
6. Activate the workflow. n8n registers the webhook with your Meta app on activation.

Meta allows one webhook per app. Workflows 06, 07 and 09 all use a WhatsApp Trigger, so only one of them can be active per Meta app. Use a second Meta app, or merge them behind one trigger with a Switch node.

## Test it
From your own phone, send "What time do you open on Saturday?" to your business number. You should get the answer from your FAQ within a few seconds. Then send "Can I speak to a human?": you get the hand-off message and Slack gets an alert with your name, number and message.

## What it costs to run
- OpenAI: about 1,200 input and 80 output tokens per message with a short FAQ. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.0006 per reply. A 2,000 word FAQ roughly doubles that.
- WhatsApp: replies sent within 24 hours of the customer's last message are free-form service messages, which Meta does not charge for at the time of writing. Check Meta's current pricing for your country.
- Slack is free within normal limits. n8n: one execution per incoming WhatsApp event.

## Customize
- Stop the AI from replying once a person has taken over: keep a list of handed-over numbers in a Google Sheet or n8n Data Table and check it before **Wants a human?**.
- Simple Memory lives in n8n's memory and resets on restart. For busy numbers or queue mode, swap it for Postgres or Redis chat memory.
- Give the agent tools, such as workflow 09's order lookup or a Google Calendar availability check.
- Answer voice notes by adding a branch that downloads the audio and transcribes it with OpenAI before the agent.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=whatsapp-ai-support-agent).
