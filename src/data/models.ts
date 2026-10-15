// Model registry. Primary models get visible tabs; the rest live in the compact "More AIs" switcher.
// Every prompt starts as status 'not-yet-tested'. Never mark a prompt tested by hand.
export type ModelInfo = { key: string; name: string; ab: string; primary: boolean; adapt: string };
export const MODELS: ModelInfo[] = [
  { key: 'chatgpt', name: 'ChatGPT', ab: 'GP', primary: true, adapt: '' },
  { key: 'claude', name: 'Claude', ab: 'CL', primary: true, adapt: '' },
  { key: 'grok', name: 'Grok', ab: 'GK', primary: true, adapt: '' },
  { key: 'muse', name: 'Muse', ab: 'MU', primary: true, adapt: '' },
  { key: 'gemini', name: 'Gemini', ab: 'GE', primary: false, adapt: 'In Gemini, paste the prompt as-is. If your data lives in Gmail or Drive, you can reference the files with @Gmail or @Drive instead of pasting them.' },
  { key: 'copilot', name: 'Microsoft Copilot', ab: 'CO', primary: false, adapt: 'In Copilot, paste the prompt as-is. In Microsoft 365 Copilot you can point it at an Outlook folder or a file instead of pasting the data.' },
  { key: 'perplexity', name: 'Perplexity', ab: 'PX', primary: false, adapt: 'In Perplexity, turn web search off (or use a Space without sources) so it works only from the data you paste.' },
  { key: 'meta-ai', name: 'Meta AI', ab: 'MA', primary: false, adapt: 'In Meta AI, paste the prompt as-is. Keep the pasted data short; split long batches into several messages.' },
  { key: 'deepseek', name: 'DeepSeek', ab: 'DS', primary: false, adapt: 'In DeepSeek, paste the prompt as-is. Leave the reasoning (DeepThink) mode off for simple sorting jobs; turn it on for multi-step rules.' },
  { key: 'mistral', name: 'Mistral Le Chat', ab: 'LC', primary: false, adapt: 'In Le Chat, paste the prompt as-is. If it shortens the output, add "Return every row; do not summarize."' },
  { key: 'generic', name: 'Any AI (generic)', ab: 'AI', primary: false, adapt: 'This is the model-neutral version. Paste it into any chat assistant, replace the [BRACKETED] parts with your own data, and check the first answer against the rules before relying on it.' },
];
export const PRIMARY = MODELS.filter(m => m.primary);
export const MORE = MODELS.filter(m => !m.primary);
export const modelKey = (name: string) => MODELS.find(m => m.name === name)?.key ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const ALL_MODEL_NAMES = MODELS.filter(m => m.key !== 'generic').map(m => m.name);
