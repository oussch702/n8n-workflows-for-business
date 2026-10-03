# Client onboarding kit

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Sets up everything a new client needs from one form: a Drive folder, a Notion page with a kickoff checklist, a welcome email and a Slack heads-up, for agencies and service businesses that onboard clients by hand today.

## What it does
- Gives you a hosted n8n form with company, contact, email, package, start date and notes.
- Creates a folder for the client inside your clients folder in Google Drive.
- Creates a page in your Notion clients database with the contact details, package, start date, a link to the Drive folder and a kickoff checklist.
- Emails the client a welcome message with next steps and a link to their folder.
- Posts the new client in Slack with links to the Notion page and the folder.

## You need
- Google Drive and Gmail credentials (the same Google account is fine)
- A Notion integration token, with the integration added to your clients database (open the database, click the three dots, Connections, add your integration)
- A Notion database with these properties, spelled exactly like this: `Name` (title), `Contact` (text), `Email` (email), `Package` (select), `Start date` (date), `Drive folder` (URL)
- A Slack credential with access to your clients channel

## Setup
1. Import `workflow.json` into n8n.
2. Open **Create client folder**, select your Google Drive credential and replace `YOUR_CLIENTS_FOLDER_ID` with the ID of your parent folder (the last part of its URL).
3. Open **Create client page**, select your Notion credential and pick your clients database from the list (or paste its data source ID instead of `YOUR_NOTION_DATA_SOURCE_ID`).
4. Open **Send welcome email**, select your Gmail credential and rewrite the email in your voice.
5. Open **Tell the team in Slack**, select your Slack credential and set the channel.
6. Edit the package names in **New client form** to match what you sell.

## Test it
1. Open **New client form** and copy the Test URL. Click **Execute workflow** and open the URL in your browser.
2. Fill it in with your own email address as the contact and submit.
3. Check that a new folder appears in Drive, a new page appears in Notion with the checklist, the welcome email reaches you and the Slack message links to both.
4. Activate the workflow and share the Production URL with whoever closes deals.

## What it costs to run
- No AI and no paid APIs. Google Drive, Gmail, Notion and Slack API calls are free at this volume.
- n8n: one execution per new client.

## Customize
- Share the Drive folder with the client automatically using the Google Drive node's Share operation on the new folder ID.
- Add a Google Calendar step that books an internal kickoff prep slot.
- Protect the form with n8n user login (Authentication in the form node) if it should stay internal.
- Copy a template Google Doc (scope of work, brief) into the new folder with the Drive Copy operation.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=client-onboarding-kit).
