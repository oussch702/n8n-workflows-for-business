# Facebook Lead Ads to HubSpot with welcome SMS

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Puts every Facebook and Instagram lead form submission into HubSpot as a contact and a deal, and texts the lead a welcome message within seconds, for businesses running lead ads who are tired of CSV downloads.

## What it does
- Listens for new leads on one lead form of your Facebook Page (the trigger subscribes to Meta's webhook for you).
- Maps Meta's standard fields (`full_name`, `email`, `phone_number`) into first name, last name, email and phone.
- Creates the HubSpot contact, or updates it if the email already exists, with lifecycle stage `lead`.
- Creates a deal in your pipeline linked to that contact, named after the lead and the form, with the campaign in the description.
- If the lead left a phone number, sends a short welcome SMS through Twilio.

## You need
- An n8n instance reachable from the internet (Meta must be able to call it)
- A Meta app with the Facebook Lead Ads credential set up in n8n (follow n8n's Facebook Lead Ads credential guide), and admin access to the Page
- A HubSpot private app token with `crm.objects.contacts.write`, `crm.objects.deals.write` and the matching read scopes
- A Twilio account with an SMS-capable number (US numbers need A2P 10DLC registration)

## Setup
1. Import `workflow.json` into n8n.
2. Connect the Facebook Lead Ads credential in **New Facebook lead**, then choose your Page and lead form from the lists.
3. Create a HubSpot credential of type "HubSpot App Token" with your private app token and select it in both HubSpot nodes.
4. In **Create deal**, pick the deal stage from the list (`appointmentscheduled` is the first stage of HubSpot's default pipeline) and change the pipeline if you use another one.
5. Connect Twilio in **Send welcome SMS**, set *From* to your number and rewrite the text. Keep the opt-out line.
6. Activate the workflow. Meta only sends events to one URL per app, so test with the workflow active, not with the Test URL.

## Test it
Open Meta's Lead Ads Testing Tool (developers.facebook.com/tools/lead-ads-testing), pick your Page and form, delete any previous test lead and click **Create lead**. Within a few seconds you should see a successful execution in n8n, a new contact and deal in HubSpot and, if the test lead had a real phone number of yours, the SMS.

## What it costs to run
- Meta Lead Ads webhooks and the HubSpot API: free. HubSpot's free CRM is enough for contacts and deals.
- Twilio SMS: about $0.008 per segment in the US plus carrier fees, roughly one cent per lead (check current pricing for your country).
- n8n: free self-hosted or your n8n Cloud plan, one execution per lead.

## Customize
- Map your custom form questions (budget, service, postcode) to HubSpot custom properties with the Custom Properties field.
- Assign a deal owner per campaign with a Switch on `campaign`.
- Add the speed-to-lead alert from workflow 12 so a rep calls within minutes.
- Send the welcome message on WhatsApp instead of SMS if your market prefers it.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=facebook-lead-ads-to-crm).
