# Contract PDF summarizer

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Turns a contract PDF into a one page email brief with the parties, dates, payment terms, renewal and termination rules, and the clauses worth a second look, for owners who sign vendor, client and lease agreements without a lawyer on call.

## What it does
- Picks up contracts from two places: any Gmail email you label `contracts`, and any file added to a Google Drive folder you choose. Keep one or both.
- Finds the PDF, extracts its text and checks there is enough text to read (scanned contracts without a text layer get a "please OCR this" email instead of a made up summary).
- Sends up to about 100,000 characters (roughly 40 pages) to OpenAI with a fixed schema: contract type, parties, effective and end dates, term and renewal, notice period, payment terms, termination, liability, governing law, a plain English summary and a list of risky clauses with a severity.
- Emails you the brief as a clean HTML table, risks sorted high to low, with a link back to the original email or file.

The brief is a reading aid. It helps you know what to ask; it does not replace a lawyer.

## You need
- A Gmail credential (for the email trigger and for sending the brief)
- A Google Drive credential (only if you use the Drive folder entry point)
- An OpenAI API key

## Setup
1. Import `workflow.json` into n8n.
2. Gmail entry point: in Gmail, create a label called `contracts`. Open **Contract emailed in** and select your Gmail credential.
3. Drive entry point: open **Contract added to Drive** and **Download the file**, select your Google Drive credential and replace `YOUR_CONTRACTS_FOLDER_ID` with your folder ID. If you do not want this entry point, delete those two nodes.
4. Open **OpenAI model** and select your OpenAI credential.
5. In **Email the brief** and **Email: could not read PDF**, select your Gmail credential and replace `you@example.com`.

## Test it
1. Email yourself any contract PDF (a sample NDA or your own service agreement) and apply the `contracts` label.
2. Open **Contract emailed in**, click **Fetch Test Event**, then **Execute workflow**.
3. You receive an email titled "Contract brief:" with the summary, the table and the risk list.
4. For Drive: drop a PDF into the folder, click **Fetch Test Event** on **Contract added to Drive** and run again.
5. Activate the workflow.

## What it costs to run
- OpenAI: a 10 page contract is about 6,000 to 8,000 input tokens and 800 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is roughly $0.004. A 40 page contract is about $0.015.
- Gmail and Google Drive: free.
- n8n: one execution per contract (polls with nothing new do not count as executions on n8n Cloud).

For long or high stakes contracts you can switch the model to `gpt-4.1` or `gpt-5` in **OpenAI model**; expect about 3 to 5 times the cost, still under $0.10 per contract.

## Customize
- Save every brief to a Google Doc or a Notion page next to the contract.
- Add the end date and notice deadline to Google Calendar so renewals never surprise you.
- Post high severity risks to Slack for whoever owns vendor contracts.
- Add your own red flags to the system prompt in **Summarize the contract** (for example "flag any payment term longer than 30 days").

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=contract-pdf-summarizer).
