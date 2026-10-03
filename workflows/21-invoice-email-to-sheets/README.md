# Invoice email to Google Sheets

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Reads every PDF invoice that lands in Gmail and adds the vendor, dates and amounts to a Google Sheet, for owners and bookkeepers who are tired of retyping invoices.

## What it does
- Checks Gmail every 5 minutes for new emails with a PDF attached and words like invoice, receipt or facture.
- Picks the PDF out of the attachments (logos and signature images are ignored).
- Extracts the text from the PDF.
- Sends the text to OpenAI, which returns vendor, invoice number, invoice date, due date, currency, subtotal, tax, total and a short description.
- Appends one row per invoice to your sheet, with a link back to the original email.

## You need
- An n8n instance (cloud or self-hosted)
- A Gmail account connected with the Gmail OAuth2 credential
- A Google Sheets credential
- An OpenAI API key
- A Google Sheet with a tab called `Invoices` and these headers in row 1: `Received, Vendor, Invoice number, Invoice date, Due date, Currency, Subtotal, Tax, Total, Description, From, File, Gmail link`

## Setup
1. In n8n, go to Workflows, then Import from File, and pick `workflow.json`.
2. Open **New invoice email** and select your Gmail credential. Adjust the search query if your vendors use other words (the field takes any Gmail search, for example `from:billing@supplier.example`).
3. Open **OpenAI model** and select your OpenAI credential.
4. Open **Add invoice row**, select your Google Sheets credential and replace `YOUR_SHEET_ID` with the ID from your sheet URL.
5. Save.

## Test it
1. Email yourself a real invoice PDF with "Invoice" in the subject.
2. In n8n, click **Fetch Test Event** on **New invoice email**, then **Execute workflow**.
3. A new row appears in the Invoices tab with the vendor, total and due date filled in.
4. When the row looks right, toggle the workflow to Active. From then on, every matching email is logged within about 5 minutes.

Scanned invoices (a photo inside a PDF) have no text layer. For those the PDF step returns nothing and the model falls back to the email body, which often still has the amount. If most of your invoices are scans, add an OCR step before **Extract invoice fields**.

## What it costs to run
- OpenAI: a 2 page invoice is roughly 2,000 to 4,000 input tokens and 300 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is about $0.002 per invoice, so 500 invoices a month cost about $1.
- Gmail and Google Sheets API usage is free at this volume.
- n8n: polling every 5 minutes is about 8,600 checks a month. On n8n Cloud, only polls that find an email start an execution, so you pay for invoices, not for checks. Self-hosted is free.

## Customize
- Add a Gmail node at the end that applies an "Invoice logged" label, so your team can see what was processed.
- Send a Slack message when the due date is less than 7 days away.
- Save the PDF to a Google Drive folder per vendor and put the file link in the sheet.
- Swap the sheet for your accounting tool (QuickBooks and Xero both have n8n nodes).

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=invoice-email-to-sheets).
