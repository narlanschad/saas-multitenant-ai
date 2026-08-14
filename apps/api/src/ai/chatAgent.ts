import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { env } from '../config/env.js';
import * as productRepository from '../modules/products/repository.js';
import { openrouter } from './openrouterClient.js';
import { executeSearchProducts, searchProductsTool, type ToolExecutionContext } from './tools/searchProducts.js';

const MAX_TOOL_ROUNDS = 4;
const FALLBACK_REPLY = 'Sorry, I was not able to find an answer to that question.';

function buildSystemPrompt(categories: string[]): string {
  const categoryHint =
    categories.length > 0
      ? `This company's product categories are exactly: ${categories.join(', ')}. Use one of these values verbatim for the category filter; otherwise prefer the query filter for keyword/name matches.`
      : 'This company currently has no products registered.';

  return `You are a product assistant for a single company's customers.
You can only answer questions about that company's own product catalog, using the search_products tool — never invent products, prices, or availability, and never claim knowledge of any other company's data.
${categoryHint}
If a search returns no results, tell the user plainly instead of leaving your answer empty.
Always reply in the same language the user wrote in. Be concise.`;
}

export async function runChatAgent(message: string, context: ToolExecutionContext): Promise<string> {
  const categories = await productRepository.findDistinctCategories(context.companyId);

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt(categories) },
    { role: 'user', content: message },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const completion = await openrouter.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages,
      tools: [searchProductsTool],
    });

    const assistantMessage = completion.choices[0]?.message;
    if (!assistantMessage) {
      break;
    }
    messages.push(assistantMessage);

    if (!assistantMessage.tool_calls?.length) {
      return assistantMessage.content?.trim() || FALLBACK_REPLY;
    }

    for (const toolCall of assistantMessage.tool_calls) {
      const result = await runTool(toolCall, context);
      messages.push({ role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) });
    }
  }

  return FALLBACK_REPLY;
}

async function runTool(
  toolCall: { id: string; function: { name: string; arguments: string } },
  context: ToolExecutionContext,
) {
  if (toolCall.function.name !== searchProductsTool.function.name) {
    return { error: `Unknown tool: ${toolCall.function.name}` };
  }

  try {
    const args = JSON.parse(toolCall.function.arguments || '{}');
    return await executeSearchProducts(args, context);
  } catch {
    return { error: 'Invalid tool arguments' };
  }
}
