# Vapi tool: book an appointment in Google Calendar

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Gives a Vapi voice assistant a working `book_appointment` tool that checks your Google Calendar and books the slot during the call, for businesses that take bookings by phone.

## What it does
- Receives Vapi's `tool-calls` request on a webhook protected by a bearer token.
- Reads the caller's name, phone, email, reason and requested start time from the tool arguments, and works out the end time from your appointment length.
- Checks your Google Calendar for that slot.
- Free: creates the event with the caller's details and tells the assistant "Booked for Tuesday, October 6 at 2:00 PM".
- Taken, unreadable time or calendar error: tells the assistant exactly what to say next, so the caller never hears silence.
- Every answer uses the shape Vapi expects: `{"results":[{"toolCallId":"...","result":"..."}]}` with HTTP 200 and a single line string.

## You need
- A Vapi account with an assistant and a phone number
- Google Calendar (OAuth credential in n8n)
- An n8n instance reachable over HTTPS

## Setup
1. Import `workflow.json` into n8n.
2. Open **Read the tool call** and set `APPOINTMENT_MINUTES` and `TIME_ZONE` (an IANA name such as `Europe/London`) at the top.
3. Open **Is the slot free?** and **Book the appointment**, connect Google Calendar and replace `YOUR_CALENDAR_ID` (use `primary` for your main calendar, or the ID from the calendar's settings).
4. Make a long random string (a password manager works). In n8n create a **Header Auth** credential with name `Authorization` and value `Bearer YOUR_RANDOM_STRING`, and select it in **Vapi tool call**.
5. Activate the workflow and copy the Production URL from **Vapi tool call**.
6. In Vapi, create a Bearer Token credential with the same random string. Then create a function tool:

```json
{
  "type": "function",
  "function": {
    "name": "book_appointment",
    "description": "Book an appointment once the caller has picked a date and time. Returns what to tell the caller.",
    "parameters": {
      "type": "object",
      "properties": {
        "name": { "type": "string", "description": "Caller's full name" },
        "phone": { "type": "string", "description": "Caller's phone number" },
        "email": { "type": "string", "description": "Caller's email, if they gave one" },
        "start_time": { "type": "string", "description": "Start of the appointment in ISO 8601 with the time zone offset, for example 2026-10-06T14:00:00-04:00" },
        "reason": { "type": "string", "description": "Short reason for the visit" }
      },
      "required": ["name", "phone", "start_time"]
    }
  },
  "server": { "url": "https://YOUR_N8N/webhook/vapi-book-appointment" }
}
```

7. Attach the credential to the tool's server, add the tool to your assistant, and tell the assistant today's date and your time zone in its system prompt so it can turn "next Tuesday at 2" into a real date.

## Test it
Click **Execute workflow** in n8n, then call the Test URL as Vapi would:

```bash
curl -X POST "https://YOUR_N8N/webhook-test/vapi-book-appointment" \
  -H "Authorization: Bearer YOUR_RANDOM_STRING" \
  -H "Content-Type: application/json" \
  -d '{"message":{"type":"tool-calls","toolCallList":[{"id":"call_test_1","type":"function","function":{"name":"book_appointment","arguments":{"name":"Jane Doe","phone":"+15555550123","start_time":"2026-10-06T14:00:00-04:00","reason":"Consultation"}}}]}}'
```

You should get `{"results":[{"toolCallId":"call_test_1","result":"Booked for Tuesday, October 6 at 2:00 PM. Confirm the time with the caller."}]}` and see the event in your calendar. Run the same request again and the answer changes to "That time is already taken". Then call your Vapi number and book for real.

## What it costs to run
- No AI calls in this workflow. Google Calendar is free.
- n8n: free self-hosted, or one execution per booking attempt on n8n Cloud.
- Vapi bills the call minutes and the model behind your assistant; this workflow adds nothing to that.

## Customize
- Refuse times outside opening hours by adding a check in **Read the tool call** and returning a result such as "We are open 9 to 5, offer a time in that window".
- Add a Twilio or WhatsApp node after **Book the appointment** to text the caller a confirmation.
- Add a second tool, `check_availability`, by copying the workflow and removing the booking step, so the assistant can offer free slots before the caller picks one.
- Book into different calendars per service by passing a `service` argument and switching on it.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=vapi-book-appointment-tool).
