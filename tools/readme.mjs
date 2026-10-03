// Writes README.md from catalog.json, so the table never drifts from the workflows.
//   node tools/readme.mjs
import fs from 'node:fs';
const cat = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));
const order = ['AI receptionist and calls', 'WhatsApp', 'Leads and CRM', 'Marketing and content', 'Operations and finance', 'SEO and AI visibility'];
const pad = (n) => String(n).padStart(2, '0');
const sections = order.map((c) => {
  const rows = cat.filter((w) => w.category === c).map((w) => `| ${pad(w.number)} | [${w.title}](workflows/${pad(w.number)}-${w.slug}) | ${w.summary} | ${w.services.join(', ')} | ${w.cost} |`);
  return `### ${c}\n\n| # | Workflow | What it does | Apps | Running cost |\n|---|---|---|---|---|\n${rows.join('\n')}\n`;
}).join('\n');
const md = `# n8n workflows for business

[![validate](https://github.com/oussch702/n8n-workflows-for-business/actions/workflows/validate.yml/badge.svg)](https://github.com/oussch702/n8n-workflows-for-business/actions/workflows/validate.yml)
![30 workflows](https://img.shields.io/badge/workflows-30-ea4b71)
![n8n](https://img.shields.io/badge/n8n-current%20release-ea4b71)
[![MIT license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Thirty n8n workflows for the jobs small businesses automate first: answering calls with an AI receptionist, WhatsApp support and lead qualification, speed to lead, follow-ups, invoices, onboarding, reports and SEO monitoring. Each one imports into n8n as is, comes with a setup guide you can finish in under 30 minutes, and says what it costs to run.

[![Watch the 50-second tour on YouTube](https://img.youtube.com/vi/SNgF8-Ncn1E/maxresdefault.jpg)](https://www.youtube.com/watch?v=SNgF8-Ncn1E)

There are collections with thousands of n8n templates. This one is deliberately small. Every workflow here is a pattern we build for clients at [AI Strike Force](https://aistrikeforce.com), cleaned of client data, and every one is checked before it ships:

- **Validated** against n8n's real node definitions on every commit (the badge above), with zero errors.
- **Imported** into a current n8n release (2.41) to confirm it opens and wires up as shown.
- **Documented** inside the workflow (sticky notes on the nodes you edit) and in its own README: what it does, what you need, setup, how to test it, what it costs and how to change it.
- **Safe to share:** no credentials, keys or real IDs. You connect your own accounts on import.

## Quick start

1. Open a workflow folder below and download \`workflow.json\` (or copy its contents).
2. In n8n, choose **Create workflow**, then **Import from file** (or paste with Ctrl/Cmd+V on the canvas).
3. Follow the sticky note on the canvas and the folder's README: connect your accounts, replace the \`YOUR_...\` placeholders, run **Execute workflow** once, then activate it.

Works best on a recent n8n version, self-hosted or n8n Cloud. AI steps use OpenAI's gpt-4.1-mini by default; swap in any chat model n8n supports.

## The workflows

${sections}
## Which one should I start with?

- **You miss calls:** 03 (missed call text back) is the quickest to set up. For a full AI receptionist, 01 and 02 connect Retell AI or Vapi to your sheet and calendar.
- **Leads go cold:** 12 (speed to lead) and 11 (qualify and route) answer every lead in seconds; 14 follows up the quiet ones.
- **You sell on WhatsApp:** 06 answers questions, 07 qualifies leads, and 10 reports WhatsApp sales back to Meta so your ads learn from them.
- **Admin eats your week:** 21 (invoices), 23 (onboarding) and 24 (daily KPI digest).

## Related open-source tools

Built by the same team, all MIT:

- [google-index-checker](https://github.com/oussch702/google-index-checker): which of your pages Google has indexed, and what changed.
- [whatsapp-conversions-api](https://github.com/oussch702/whatsapp-conversions-api): send WhatsApp sales to Meta's Conversions API, with errors explained.
- [ai-visibility-checker](https://github.com/oussch702/ai-visibility-checker): does ChatGPT, Gemini or Perplexity name your brand?
- [safe-meta-ads-mcp](https://github.com/oussch702/safe-meta-ads-mcp): let an AI agent build Meta ads that start paused.
- [image-dimensions-checker](https://github.com/oussch702/image-dimensions-checker): find the images that make your pages jump.

## Contributing

Found a bug or a payload that changed? Open an issue or a pull request. Run \`npm ci --prefix tools && node tools/validate.mjs workflows/*/workflow.json\` before you push; the same check runs on every pull request.

## Want it built for you?

We set these up, connect them to your tools and maintain them: AI receptionists, WhatsApp agents, lead systems and automations, fixed price from $2,500. [Book a free strategy call](https://aistrikeforce.com/?utm_source=github&utm_medium=n8n-workflows&utm_campaign=readme) or see [business automation services](https://aistrikeforce.com/business-automation-services?utm_source=github&utm_medium=n8n-workflows&utm_campaign=readme).

## License

MIT. Use them, change them, sell what you build with them.
`;
fs.writeFileSync('README.md', md);
console.log('README.md written,', cat.length, 'workflows');
