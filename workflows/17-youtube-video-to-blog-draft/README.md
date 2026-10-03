# YouTube video to blog draft in Google Docs

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Turns each new video on your YouTube channel into a structured blog draft in Google Docs, so every video also becomes a page that can rank in search.

## What it does
- Watches your channel's public RSS feed and picks up each new video.
- Fetches the transcript from a transcript API of your choice (any HTTP service that returns the text).
- Fetches the video description from the YouTube Data API as a fallback.
- Uses the transcript when there is one, otherwise the description, and tells the AI which one it got.
- Has OpenAI (gpt-4.1-mini) write a title, meta description and a Markdown body that sticks to what the video says.
- Creates a Google Doc called `DRAFT: <title>` in your drafts folder with the text inside.

## You need
- An n8n instance
- An OpenAI API key
- Google Docs (OAuth credential) and a Drive folder for drafts
- A YouTube Data API v3 key (free, from Google Cloud Console)
- Optional: a transcript API. YouTube's own captions API needs OAuth as the channel owner and returns caption files rather than plain text, so many people use a transcript service or a small self-hosted one instead. Check the provider's terms.

## Setup
1. Import `workflow.json` into n8n.
2. In **New video on the channel**, replace `YOUR_CHANNEL_ID` with your channel ID (starts with `UC`).
3. Create a Query Auth credential named `YouTube Data API key` with name `key` and your API key as the value, and select it in **Fetch the video description**.
4. Transcript: point **Fetch the transcript** at your service, adjust the query parameter and credential to what it expects. The next node reads `text`, `transcript` or `content` from the response. No service? Select the node and press D to disable it; drafts are then written from the description.
5. Add your OpenAI credential, connect Google Docs in both Docs nodes and replace `YOUR_FOLDER_ID` with the ID of your drafts folder.
6. Edit the bracketed parts of the system message in **Write the blog draft** and activate.

## Test it
Click **Execute workflow**. In test mode the trigger fetches the latest video in the feed. After 20 to 60 seconds you should find a `DRAFT:` doc in your folder with the title, meta description, source line and the post body.

## What it costs to run
- OpenAI: a 15 minute video transcript is roughly 3,000 to 4,000 input tokens, and the draft about 1,000 to 1,500 output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is about $0.004 per post. The prompt caps the source at 40,000 characters, so even a long video stays under 1 cent.
- YouTube Data API: free; `videos.list` uses 1 unit of the 10,000 daily quota.
- Transcript API: depends on the provider (check current pricing; many have a free tier).
- Google Docs: free.

## Customize
- Convert the Markdown to Google Docs headings with a few `replaceAll` actions, or paste it into a Markdown-aware CMS.
- Send the doc link to Slack or email the editor when a draft is ready.
- Add an IF node that skips Shorts (very short transcripts) so you only get drafts for long videos.
- Publish straight to WordPress as a draft post instead of Google Docs.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=youtube-video-to-blog-draft).
