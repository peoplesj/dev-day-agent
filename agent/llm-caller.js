import { LLM_PROVIDER } from '../llm_provider.js';

let callLLM;
if (LLM_PROVIDER === 'anthropic') {
  ({ callLLM } = await import('./llm-caller-anthropic.js'));
} else {
  ({ callLLM } = await import('./llm-caller-openai.js'));
}

export { callLLM };
