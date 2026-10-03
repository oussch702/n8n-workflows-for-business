// Validates n8n workflow JSON files against n8n's real node schemas (via n8n-mcp's validate_workflow tool).
//   node tools/validate.mjs workflows/**/*.json
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const files = process.argv.slice(2);
const transport = new StdioClientTransport({ command: 'node', args: [path.join(here, 'node_modules/n8n-mcp/dist/mcp/stdio-wrapper.js')], env: { ...process.env, MCP_MODE: 'stdio', LOG_LEVEL: 'error', DISABLE_CONSOLE_OUTPUT: 'true' }, stderr: 'ignore' });
const client = new Client({ name: 'validate', version: '1.0.0' });
await client.connect(transport);
let failed = 0;
for (const f of files) {
  const wf = JSON.parse(fs.readFileSync(f, 'utf8'));
  const res = await client.callTool({ name: 'validate_workflow', arguments: { workflow: wf, options: { validateNodes: true, validateConnections: true, validateExpressions: true, profile: 'runtime' } } });
  const text = res.content?.map((c) => c.text).join('\n') || '';
  let out; try { out = JSON.parse(text); } catch { out = { raw: text.slice(0, 500) }; }
  const errs = out.errors || [];
  const warns = out.warnings || [];
  const ok = out.valid === true && errs.length === 0;
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${f}  errors=${errs.length} warnings=${warns.length}`);
  for (const e of errs) console.log(`   error: ${e.node ? e.node + ': ' : ''}${e.message || JSON.stringify(e)}`);
  if (process.env.SHOW_WARNINGS) for (const w of warns) console.log(`   warn: ${w.node ? w.node + ': ' : ''}${w.message || JSON.stringify(w)}`);
  if (out.raw) console.log('   raw:', out.raw);
}
await client.close();
process.exit(failed ? 1 : 0);
