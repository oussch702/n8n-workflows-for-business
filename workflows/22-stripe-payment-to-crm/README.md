# Stripe payment to CRM, Slack and thank-you email

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Turns every successful Stripe payment into an updated HubSpot customer, a Slack message for the team and a personal thank-you email, for service businesses and small online shops that sell through Stripe.

## What it does
- Listens for Stripe `charge.succeeded` events (Payment Links, Checkout, invoices and manual charges all fire it).
- Converts the amount from cents into a readable figure in the right currency, including zero-decimal currencies like JPY.
- Posts the sale in a Slack channel with a link to the payment in the Stripe dashboard.
- Creates or updates the buyer in HubSpot by email and sets the lifecycle stage to Customer.
- Sends the buyer a short thank-you email from your Gmail with the Stripe receipt link.
- Payments without an email address still reach Slack but skip HubSpot and the email.

## You need
- A Stripe account and a secret key (or restricted key with webhook write access) saved as a Stripe credential in n8n
- A HubSpot private app token with the `crm.objects.contacts.write` and `crm.objects.contacts.read` scopes
- A Slack credential (bot token) with access to the channel you want to post in
- A Gmail credential for the thank-you email

## Setup
1. Import `workflow.json` into n8n.
2. Open **Payment succeeded in Stripe** and select your Stripe credential.
3. Open **Mark contact as customer** and select your HubSpot App Token credential (named `HubSpot account` in this workflow).
4. Open **Post the sale in Slack**, select your Slack credential and change `#sales` to your channel. Invite the bot to that channel.
5. Open **Send thank-you email**, select your Gmail credential and rewrite the text and signature.
6. Activate the workflow. On activation n8n creates the webhook endpoint in Stripe for you; you can see it under Developers, Webhooks in the Stripe dashboard.

## Test it
1. Use your Stripe test mode key in the credential first.
2. Create a Payment Link in test mode and pay it with the card `4242 4242 4242 4242`, any future date and any CVC. Use your own email address on the checkout page.
3. Within a few seconds you should see a Slack message ending in "(test mode)", a contact in HubSpot with lifecycle stage Customer, and the thank-you email in your inbox.
4. Switch the credential to your live key when you are happy.

## What it costs to run
- No AI and no per message fees. Stripe webhooks, the HubSpot API (free CRM included), Slack and Gmail cost nothing extra at small business volume.
- n8n: one execution per payment. 300 payments a month fits easily in the n8n Cloud Starter plan; self-hosted is free.
- Gmail sending limits apply: about 500 emails a day on a free account, 2,000 on Google Workspace.

## Customize
- Subscriptions renew with a new `charge.succeeded` each month, so subscribers get a thank-you every month. If you only want to thank new buyers, switch the trigger event to `checkout.session.completed` and read `customer_details.email` and `amount_total` in **Read the payment**.
- Create a HubSpot deal for the payment amount after the contact step.
- Send big payments (say over $1,000) to a separate Slack channel for the owner.
- Swap Gmail for your transactional email provider if you send more than a few hundred a day.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=stripe-payment-to-crm).
