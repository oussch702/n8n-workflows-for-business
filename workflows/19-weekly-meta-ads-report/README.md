# Weekly Meta ads report to Slack

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Posts a short, plain-English summary of last week's Meta ads results to Slack every Monday morning, for owners who pay for ads but do not have time to read Ads Manager.

## What it does
- Runs every Monday at 8:00.
- Calls the Meta Marketing API: `GET /v26.0/act_<AD_ACCOUNT_ID>/insights` with `level=campaign`, `date_preset=last_7d` and the fields `campaign_name, spend, impressions, reach, clicks, ctr, cpc, cpm, actions`.
- Adds up spend, clicks and impressions, counts your chosen result (leads, purchases, conversations) per campaign and works out cost per result.
- Has OpenAI (gpt-4.1-mini) write a Slack message: totals, what worked, what did not and one thing to try, using only the numbers it was given.
- Posts it to your Slack channel.

## You need
- A Meta access token with `ads_read` on the ad account. A System User token (Business Settings, Users, System users) is the most reliable because it does not expire.
- An OpenAI API key
- A Slack workspace with the n8n app

## Setup
1. Import `workflow.json` into n8n.
2. Create a **Facebook Graph API** credential named `Meta Graph API account` with your token and select it in **Get last 7 days of insights**.
3. In **Settings**, set `ad_account_id` (the digits after `act_` in Ads Manager), `result_action` and `currency`. Common result actions: `lead`, `offsite_conversion.fb_pixel_purchase`, `onsite_conversion.messaging_conversation_started_7d`. Look at the `actions` array of one test run to see which ones your account reports.
4. Add your OpenAI credential to **OpenAI Chat Model** and connect Slack in **Post to Slack**.
5. Check that the workflow timezone (workflow Settings) is yours, then activate.

## Test it
Click **Execute workflow**. In **Get last 7 days of insights** you should see a `data` array with one row per campaign that spent money in the last 7 days (today is not included). **Add up the numbers** shows the totals, and a few seconds later the summary appears in Slack. An account with no spend gets a one-line "no spend this week" message.

## What it costs to run
- Meta Marketing API: free. Insights calls count toward your app's rate limits, but one call a week is nothing.
- OpenAI: 2,000 to 4,000 input tokens for a typical account and a few hundred output tokens. With gpt-4.1-mini ($0.40 per million input tokens, $1.60 per million output, check current pricing) that is about $0.002 per report.
- Slack: free. n8n: one execution a week.

## Customize
- Compare with the week before: add a second insights call with `time_range` for the previous 7 days and pass both to the prompt.
- Switch `level` to `adset` or `ad` to see which creatives carry the account.
- Alert on bad news mid-week: run daily with `date_preset=yesterday` and only post when cost per result jumps.
- Email the summary to a client with a Gmail node instead of, or as well as, Slack.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=weekly-meta-ads-report).
