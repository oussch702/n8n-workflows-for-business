# AI brand mention monitor (ChatGPT and Perplexity)

**Works with:** Tested against n8n's current node versions (October 2026). Import into a recent n8n version.

Asks ChatGPT and Perplexity the questions your buyers ask every week, then tracks whether your brand is named in the answer and whether your site is cited as a source, for businesses that want to know if AI search recommends them or their competitors.

## What it does
- Runs every Monday at 8:00 and reads your buyer questions from a Google Sheet (for example "best dental clinic for implants in Austin" or "which CRM is easiest for a 5 person agency").
- Sends each question to two engines through DataForSEO's AI Optimization API:
  - ChatGPT: `POST /v3/ai_optimization/chat_gpt/llm_responses/live` with `gpt-4o-mini` and web search forced on, so the answer comes with cited sources the way ChatGPT search does.
  - Perplexity: `POST /v3/ai_optimization/perplexity/llm_responses/live` with the `sonar` model.
- Reads the answer text from `items[].sections[].text` and the cited sources from `items[].sections[].annotations[].url`.
- Counts how many times your brand names appear in the answer (whole words, case insensitive), checks whether any cited URL is on your domain or a subdomain, and counts competitor mentions too.
- Appends one row per question and engine to a Results tab, including the full answer, so you can read what the AI actually said.
- Posts a scorecard in Slack: named in X of Y answers and cited in X of Y, per engine, plus the questions where you were missing.

## You need
- A DataForSEO account. Your API login and password are on the API Access page of the DataForSEO dashboard (they are not your website login).
- In n8n, a **Basic Auth** credential with that API login as user and API password as password
- A Google Sheets credential and a Slack credential
- A Google Sheet with two tabs:
  - `Questions`, with the header `question` in A1 and one question per row.
  - `Results`, with these headers in row 1: `week, engine, question, brand_mentioned, brand_mentions, domain_cited, our_cited_urls, sources, top_sources, competitor_mentions, cost_usd, status, answer`.

## Setup
1. Import `workflow.json` into n8n.
2. Create the Basic Auth credential, name it `DataForSEO account` and select it in **Ask the AI engine**.
3. Open **Your brand** and fill in:
   - `brandNames`: every way people write your name, comma separated (`Example Dental, ExampleDental, Example Dental Clinic`).
   - `domain`: your domain without https or www (`example.com`).
   - `competitors`: 2 to 5 competitor names, comma separated.
   - `country`: the two letter country code to localize web search (`US`, `GB`, `FR`).
4. In **Read buyer questions** and **Log results**, select your Google Sheets credential and replace `YOUR_SHEET_ID`.
5. In **Post the scorecard**, select your Slack credential and set the channel.

## Test it
1. Put 2 questions in the Questions tab to keep the first run cheap.
2. Click **Execute workflow**. Each request can take 10 to 40 seconds because the engines search the web first.
3. You get 4 new rows in Results (2 questions times 2 engines) and a scorecard in Slack.
4. Read a couple of answers in the sheet to confirm brand matching works for your name, then add the rest of your questions and activate.

## What it costs to run
- DataForSEO charges $0.0006 per task plus what the AI provider charges for the tokens and the web search. DataForSEO's own documentation example for a ChatGPT web search answer cost about $0.03. Perplexity sonar answers are usually around 1 cent. Check current DataForSEO pricing, and look at the `cost_usd` column after your first run for your real number.
- Example: 20 questions times 2 engines, once a week, is about 40 requests, roughly $0.80 a week or $3.50 a month.
- DataForSEO is prepaid: you top up a balance first (check their current minimum).
- Google Sheets and Slack: free. n8n: one execution per week.

## Customize
- Add Gemini or Claude: DataForSEO has the same endpoint for `gemini` and `claude`. Add an entry to the `engines` list in **One request per engine** with the right `path` and `model_name` (see DataForSEO's models endpoint for each engine).
- Switch ChatGPT to `gpt-5-mini` to get closer to what ChatGPT users see today, at a higher cost per question.
- Ask each question 3 times and average the results. AI answers vary from run to run, so a single answer is a sample, not a ranking.
- Build a trend chart in the sheet: a pivot on week and engine showing the share of answers where you are named.

---
Built by [AI Strike Force](https://aistrikeforce.com). Want this set up for your business? [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=ai-brand-mention-monitor).
