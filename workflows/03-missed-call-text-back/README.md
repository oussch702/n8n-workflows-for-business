# Missed call text back (Twilio)

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Texts every caller you could not answer within seconds, with a link to book, and logs the missed call, for trades and clinics that lose jobs to voicemail.

## What it does
- Your Twilio number forwards calls to your phone. When the forwarded call ends, Twilio tells this workflow how it went.
- Answers Twilio straight away with TwiML: a short spoken apology if the call was missed, nothing if it was answered.
- Treats `no-answer`, `busy`, `failed` and `canceled` (caller hung up while ringing) as missed.
- Skips withheld and anonymous numbers, so it never texts a number that cannot receive SMS.
- Sends the caller an SMS from your Twilio number with your booking link.
- Logs date, caller, dial status, call SID and SMS status to Google Sheets.

## You need
- A Twilio account with a phone number that can send SMS
- Google Sheets (OAuth credential in n8n) and one spreadsheet
- An n8n instance reachable over HTTPS

## Setup
1. Import `workflow.json` into n8n.
2. Open **Text the caller back**, connect your Twilio credential (Account SID and Auth Token), set **From** to your Twilio number and rewrite the message with your business name and booking link.
3. Create a Google Sheet with a tab named `Missed calls` and these headers in row 1: `Date, Caller, Called number, Dial status, Call SID, Text status`. Paste the sheet ID into **Log the missed call** and connect Google Sheets.
4. Activate the workflow and copy the Production URL from **Twilio call ended**.
5. In Twilio, create a TwiML Bin with the number you want calls to ring (your mobile or office line) and your webhook URL:

```xml
<Response>
  <Dial action="https://YOUR_N8N/webhook/twilio-missed-call" method="POST" timeout="20">+15555550124</Dial>
</Response>
```

6. Under Phone Numbers, open your Twilio number and set "A call comes in" to that TwiML Bin.

Keep `timeout` shorter than the time your own phone takes to send callers to voicemail. If your voicemail answers first, Twilio reports the call as answered and no text goes out.

## Test it
Call your Twilio number from your mobile and let it ring out. You should hear "Sorry we missed your call...", receive the text a few seconds later, and see a new row in `Missed calls`. Call again and answer: no text, no row.

You can also fake it with the Test URL:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/twilio-missed-call" \
  -d "From=%2B15555550123" -d "To=%2B15555550124" -d "DialCallStatus=no-answer" -d "CallSid=CA00000000000000000000000000000000"
```

Replace the `From` number with your own mobile to receive the text.

## What it costs to run
- Twilio SMS: about $0.0083 per message segment in the US plus carrier fees; a Twilio number is about $1.15 a month (check current pricing, other countries differ).
- Twilio voice minutes for the forwarded call are billed as usual; this workflow adds none.
- Sending SMS to US numbers from a regular Twilio number needs A2P 10DLC registration (or toll-free verification). Approval can take days to weeks, so start it before launch.
- No AI calls. Google Sheets is free.

## Customize
- Twilio signs requests with `X-Twilio-Signature`. To check it, add a Code node that validates the signature with your Auth Token before sending anything.
- Only text during opening hours: add an IF on `$now.hour` before **Text the caller back**.
- Replace the spoken message with a voicemail recording by returning `<Record>` TwiML for missed calls.
- Send the same message on WhatsApp by ticking "To WhatsApp" in the Twilio node (needs an approved WhatsApp sender, and a template because the caller has not messaged you first).

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=missed-call-text-back).
