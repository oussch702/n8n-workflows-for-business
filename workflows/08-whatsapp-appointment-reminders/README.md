# WhatsApp appointment reminders from Google Calendar

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Sends each client one WhatsApp reminder for their appointment in the next 24 hours, straight from your Google Calendar, and logs every send, for salons, clinics and studios that lose money to no-shows.

## What it does
- Runs every hour and lists the events in your Google Calendar that start in the next 24 hours (recurring events included, all-day events skipped).
- Finds the client's WhatsApp number in the event description (`WhatsApp: +15555550123`) and their name (`Name: Jane Doe`). Events without a number are skipped.
- Checks the `Reminders sent` sheet so nobody gets the same reminder twice. If you move an appointment, the new time gets a fresh reminder.
- Sends your approved WhatsApp template with the first name, date and time filled in.
- Logs event, appointment time, phone, send time and result (sent or the error) to Google Sheets.

## You need
- A Meta app with the WhatsApp product, a WhatsApp Business Cloud API phone number and a permanent access token (system user)
- An approved WhatsApp message template (below)
- Google Calendar and Google Sheets (OAuth credentials in n8n)

## Setup
1. Import `workflow.json` into n8n.
2. In WhatsApp Manager, create a template named `appointment_reminder`, category Utility, language English (US), with this body, then wait for approval (usually minutes):

```
Hi {{1}}, this is a reminder of your appointment on {{2}} at {{3}}. Reply here if you need to change it.
```

3. Create a Google Sheet with a tab named `Reminders sent` and these headers in row 1: `Event ID, Appointment, Title, Phone, Sent at, Result`. Paste the sheet ID into **Read reminders already sent** and **Log the reminder**.
4. Open **Get appointments in the next 24 hours**, connect Google Calendar and replace `YOUR_CALENDAR_ID` (`primary` works for your main calendar).
5. Open **Pick events that need a reminder** and set `TIME_ZONE` to yours, so the message shows local times.
6. Open **Send the WhatsApp reminder**, create a **WhatsApp** credential (access token and business account ID), replace `YOUR_PHONE_NUMBER_ID` with the phone number ID from WhatsApp Manager (API setup), and pick your template from the list.
7. Put `Name:` and `WhatsApp:` lines in the description of your appointments (most booking tools let you template the event description), then activate the workflow.

## Test it
Create a calendar event starting in two hours with this description:

```
Name: Your Name
WhatsApp: +15555550123
```

Use your own number. Click **Execute workflow**. You should receive the reminder on WhatsApp and see a `sent` row in `Reminders sent`. Click **Execute workflow** again: nothing is sent, because the event is already logged.

## What it costs to run
- WhatsApp: reminders are utility template messages, which Meta charges per delivered message at a rate set by the recipient's country (a fraction of a cent to a few cents; free if the client messaged you in the last 24 hours). Check Meta's current rate card.
- Google Calendar and Google Sheets: free. No AI calls.
- n8n: 24 executions a day.

## Customize
- Send the reminder closer to the time (for example 3 hours before) by changing `timeMax` in the calendar node.
- Add Quick Reply buttons ("Confirm", "Reschedule") to the template and handle the replies with a WhatsApp Trigger workflow.
- Send a second, same-day reminder by running a copy of the workflow with a 2 hour window and a separate log tab.
- Read the number from the event's attendee or from your client list in Google Sheets instead of the description.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=whatsapp-appointment-reminders).
