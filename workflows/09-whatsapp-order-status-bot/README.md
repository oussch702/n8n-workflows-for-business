# WhatsApp order status bot for Shopify

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Answers "where is my order?" on WhatsApp with the live Shopify status and tracking link, and only for the customer who placed the order, for Shopify stores that spend hours on order status questions.

## What it does
- Receives each incoming WhatsApp text and finds the order number in it ("#1042", "order 1042", "where is 1042?"). No AI needed, so it costs nothing per message.
- No number in the message: asks the customer to send it.
- Looks the order up with one Shopify Admin GraphQL query: payment status, fulfillment status, tracking company, number and link.
- Checks that the WhatsApp number matches a phone on the order (order, customer or shipping address). If not, it declines to share details. Order numbers are short and easy to guess, so this matters.
- Replies with a plain status line ("Order #1042 has shipped.") and every tracking link.

## You need
- A Meta app with the WhatsApp product, a WhatsApp Business Cloud API phone number and a permanent access token (system user)
- A Shopify store and an Admin API access token with the `read_orders` scope, plus access to customer phone numbers (protected customer data)
- An n8n instance reachable over HTTPS

## Setup
1. Import `workflow.json` into n8n.
2. Get a Shopify Admin API access token:
   - If your store already has a custom app made in the Shopify admin, give it `read_orders` and use its Admin API access token.
   - Shopify stopped letting stores create new custom apps in the admin on January 1, 2026. New apps are made in the Shopify Dev Dashboard and get tokens through OAuth or the client credentials grant, whose tokens expire after 24 hours. In that case you need a token refresh step before **Look up the order in Shopify**.
3. In n8n, create a **Shopify Access Token API** credential (shop subdomain, access token, app secret) and select it in **Look up the order in Shopify**. Replace `YOUR_STORE` in the URL with your shop subdomain.
4. Create a **WhatsApp OAuth** credential (Meta app ID and secret) for **WhatsApp Trigger** and a **WhatsApp** credential (access token and business account ID) for both reply nodes.
5. Activate the workflow.

Meta allows one webhook per app. Workflows 06, 07 and 09 all use a WhatsApp Trigger, so only one of them can be active per Meta app.

## Test it
Place a test order with your own mobile number as the phone, then send "Where is #1001?" (your order number) to your business number. You should get "Order #1001 is being prepared." or the shipped status with tracking. Send the same message from a different phone: the bot finds the order but declines to share it. Send "hello": it asks for the order number.

## What it costs to run
- No AI calls. The Shopify Admin API is free to use within its rate limits.
- WhatsApp: replies inside the 24 hour customer service window are free-form service messages, which Meta does not charge for at the time of writing. Check Meta's current pricing.
- n8n: one execution per incoming WhatsApp event.

## Customize
- Orders older than 60 days need the `read_all_orders` scope. Without it, Shopify returns no match for older orders.
- Add an "I want to return this" path that creates a ticket or alerts your team in Slack.
- Combine with workflow 06: put this lookup behind the AI agent as a tool, so the agent can answer order questions and general questions in one chat.
- The API version in the URL is `2026-07`. Shopify supports each version for a year; bump it when you update the workflow.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=whatsapp-order-status-bot).
