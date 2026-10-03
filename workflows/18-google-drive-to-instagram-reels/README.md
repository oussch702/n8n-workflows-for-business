# Google Drive to Instagram Reels

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Publishes any video you drop into a Google Drive folder as an Instagram Reel through the official Instagram Graph API, and logs the permalink, for teams that edit on a computer and are tired of moving files to a phone.

## What it does
- Checks a Drive folder every 5 minutes for new files.
- Skips anything that is not a video or is over your size limit (50 MB by default) and tells you in Slack how to shrink it.
- Shares the file as "anyone with the link can view" so Instagram can download it.
- Creates a REELS media container with the video URL and a caption (the file's Drive description, or its name, plus your hashtags).
- Waits 60 seconds and polls the container's `status_code` until it is `FINISHED`, for up to about 10 minutes.
- Publishes with `media_publish`, fetches the permalink and logs the post to Google Sheets. `ERROR`, `EXPIRED` and timeouts go to Slack.

## You need
- An Instagram professional (Business or Creator) account connected to a Facebook Page
- A Meta app with a long-lived access token that has `instagram_basic`, `instagram_content_publish` and `pages_read_engagement` (a System User token from Business Settings does not expire)
- Your Instagram user ID (the numeric ID, see Setup)
- Google Drive, Google Sheets and Slack credentials in n8n

## Setup
1. Import `workflow.json` into n8n.
2. Create a **Facebook Graph API** credential in n8n named `Meta Graph API account` and paste your access token. All four HTTP Request nodes use it.
3. Find your Instagram user ID: call `GET https://graph.facebook.com/v26.0/me/accounts?fields=instagram_business_account` with your token, and copy `instagram_business_account.id`.
4. Open **Settings** and fill in `ig_user_id`, `max_mb` and `hashtags`.
5. In **New video in the Reels folder**, connect Google Drive and pick the folder. Connect the same credential in **Share the file by link**.
6. Create a sheet with a `Reels log` tab and headers `published_at, file_name, size_mb, media_id, permalink, caption`, then set `YOUR_SHEET_ID` in **Log the post**.
7. Connect Slack in the three Slack nodes and pick your channel. Activate.

## Test it
Export a 10 to 20 second vertical MP4 (H.264 video, AAC audio, 9:16) under 50 MB. Upload it to the folder and wait up to 5 minutes for the trigger. In the execution you will see the container ID, one or more status checks, then the published media ID. The Reel shows up on your profile and the permalink lands in the sheet. Instagram allows 100 API-published posts per 24 hours, so testing will not hit limits.

### Why files must be small: the HTTP 413 story
Meta's spec allows Reels up to 300 MB, but in practice that is not what you get through this route. When we first ran this, a 54 MB Reel failed with "Container Publication failed" and the container's `status_code` came back as `ERROR`. The real cause was underneath: the video download was rejected with **HTTP 413 (Payload Too Large)**, so Instagram never received the file. Compressing the same video to about 5 MB fixed it at once, with no visible quality loss on a phone screen:

```bash
ffmpeg -i in.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart out.mp4
```

`-crf 28` is the main lever (higher means smaller), and `-movflags +faststart` moves the index to the front of the file, which Meta requires. That is why the workflow rejects files over `max_mb` before calling Instagram, and why every failure message in Slack includes this command.

## What it costs to run
- Instagram Graph API, Google Drive and Google Sheets: free.
- No AI calls.
- n8n: polling every 5 minutes is 288 checks a day. Self-hosted that is free; on n8n Cloud check how your plan counts executions, or poll every 15 minutes instead.

## Customize
- Generate the caption with OpenAI from the file name and a short brief in the Drive description.
- Add a cover image with `cover_url` or pick a frame with `thumb_offset` in **Create Reels container**.
- Remove the public link after publishing with a Google Drive "Delete permission" call, or move the file to a `Posted` folder.
- Schedule instead of publishing at once: add a Wait node until a time read from the file name or a sheet.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=google-drive-to-instagram-reels).
