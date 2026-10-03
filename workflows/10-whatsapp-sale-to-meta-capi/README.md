# WhatsApp sale to Meta Conversions API

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Sends a Purchase event to Meta's Conversions API when a sale closes in a WhatsApp chat that started from a click-to-WhatsApp ad, so Meta can credit the right ad and optimise for buyers instead of chats.

## What it does
- Receives the sale on a webhook: order ID, value, currency and the chat's `ctwa_clid` (the click ID Meta adds to the first message from a click-to-WhatsApp ad).
- Builds the event Meta's business messaging guide asks for: `event_name: Purchase`, `action_source: business_messaging`, `messaging_channel: whatsapp`, and `user_data` with your WhatsApp Business Account ID and the `ctwa_clid`.
- Uses the order ID as `event_id`, so a sale sent twice is counted once.
- Skips sales with no click ID, no value, or older than 7 days (Meta rejects those) and says why.
- POSTs to `https://graph.facebook.com/v26.0/<DATASET_ID>/events` and logs every attempt to Google Sheets with Meta's `events_received` and `fbtrace_id`, or the error message.

## You need
- A Meta dataset (Events Manager) connected to your WhatsApp Business Account
- An access token that can send events to that dataset (Events Manager, dataset Settings, Conversions API, Generate access token)
- Your WhatsApp Business Account ID (WhatsApp Manager, account overview)
- The `ctwa_clid` for each sale. Workflow 07 saves it in the `Click ID` column; you can also read it from `messages[0].referral.ctwa_clid` in any WhatsApp Trigger.
- Google Sheets (OAuth credential) and one spreadsheet

## Setup
1. Import `workflow.json` into n8n.
2. Open **Build the Purchase event** and set `WABA_ID` and `DEFAULT_CURRENCY`.
3. Open **Send to Meta Conversions API**, replace `YOUR_DATASET_ID` in the URL, and create a **Query Auth** credential with name `access_token` and your token as the value. The token stays in n8n's credential store, not in the workflow.
4. Create a Google Sheet with a tab named `Meta events` and these headers in row 1: `Date, Order ID, Value, Currency, Result, Details`. Paste the sheet ID into **Log the result**.
5. Activate the workflow and have your shop, CRM or a Google Sheets trigger POST each paid WhatsApp order to the Production URL of **Sale closed in WhatsApp**:

```json
{ "order_id": "WA-1042", "value": 129.90, "currency": "USD", "ctwa_clid": "CLICK_ID_FROM_THE_CHAT" }
```

`event_time` (Unix seconds) is optional and defaults to now.

### Secure the webhook

Anyone who finds the webhook URL could send fake purchases to Meta and skew your ad optimization. In the **Webhook** node, set **Authentication** to **Header Auth**, create a credential with a long random value (for example a header named `X-Webhook-Secret`), and send the same header from your order system.

## Test it
In Events Manager, open your dataset, go to Test events and copy the test code. Click **Execute workflow** and send:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/whatsapp-sale" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"TEST-1","value":49,"currency":"USD","ctwa_clid":"CLICK_ID_FROM_A_REAL_AD_CHAT","test_event_code":"TEST12345"}'
```

The `Meta events` sheet should show `sent` with `events_received: 1`, and the event appears under Test events within a minute. A made-up click ID may be accepted by the API but will not match an ad, so use one from a real ad chat before you judge attribution. Remove `test_event_code` for live sales.

## What it costs to run
- The Conversions API is free. No AI calls. Google Sheets is free.
- n8n: one execution per sale.

## Customize
- Trigger from Google Sheets instead of a webhook: swap the first node for a Google Sheets Trigger on your orders tab ("row added") and map the same four fields.
- Send `LeadSubmitted` or `QualifiedLead` from workflow 07 when a lead qualifies, so Meta can optimise for leads before you have enough purchases.
- Send the other events Meta supports for business messaging (`OrderShipped`, `OrderDelivered`, `CartAbandoned`) by copying the workflow and changing `event_name`.
- The URL uses Graph API v26.0, the current version in October 2026. Meta retires each version about two years after release; bump the version in the URL when you update the workflow.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=whatsapp-sale-to-meta-capi).
