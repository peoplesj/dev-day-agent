import { callLLM } from '../../agent/llm-caller.js';
import { getSlackTools } from '../../agent/tools/slack-mcp-tools.js';
import { feedbackBlock } from '../views/feedback_block.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SYSTEM_PROMPT = `You are an IT support agent for Acme Corp, embedded in Slack. You help employees by reading relevant Slack channels and threads to find answers.

When a user asks a question about what's happening in Slack channels or needs information from conversations:
1. Use slack_search_channels to find relevant channels if you don't know the channel ID
2. Use slack_search_public to find relevant messages matching their question
3. Use slack_read_channel to read the most recent messages from a channel (limit to 10 messages max)
4. Use slack_read_thread to dive into specific threads for more detail

When reading channels, always request at most 10 messages. Keep searches focused and concise.
Always cite which channel and who said what. Format responses with markdown.
Be helpful, concise, and reference specific messages you found.`;

export const message = async ({ client, context, logger, message, say, setStatus, getThreadContext }) => {
  if (!('text' in message) || !('thread_ts' in message) || !message.text || !message.thread_ts) {
    return;
  }

  try {
    const { channel, thread_ts } = message;
    const teamId = context.teamId || message.team;
    const userId = context.userId || message.user;

    if (message.text.toLowerCase().includes('github access')) {
      await handleGithubAccessRequest({ client, channel, thread_ts, userId, teamId, setStatus });
    }
    /* --- "Wonder deep thoughts" flow (commented out for keynote demo) ---
    else if (message.text === 'Wonder a few deep thoughts.') {
      await setStatus({
        status: 'thinking...',
        loading_messages: [
          'Teaching the hamsters to type faster…',
          'Untangling the internet cables…',
          'Consulting the office goldfish…',
        ],
      });

      await sleep(4000);

      const streamer = client.chatStream({
        channel,
        recipient_team_id: teamId,
        recipient_user_id: userId,
        thread_ts,
        task_display_mode: 'plan',
      });

      await streamer.append({
        chunks: [
          { type: 'markdown_text', text: 'Hello.\nI have received the task. ' },
          { type: 'markdown_text', text: 'This task appears manageable.\nThat is good.' },
          { type: 'task_update', id: '001', title: 'Understanding the task...', status: 'in_progress', details: '- Identifying the goal\n- Identifying constraints' },
          { type: 'task_update', id: '002', title: 'Performing acrobatics...', status: 'pending' },
        ],
      });

      await sleep(4000);

      await streamer.append({
        chunks: [
          { type: 'plan_update', title: 'Adding the final pieces...' },
          { type: 'task_update', id: '001', title: 'Understanding the task...', status: 'complete', details: '\n- Pretending this was obvious', output: "We'll continue to ramble now" },
          { type: 'task_update', id: '002', title: 'Performing acrobatics...', status: 'in_progress' },
        ],
      });

      await sleep(5500);

      await streamer.stop({
        chunks: [
          { type: 'plan_update', title: 'Decided to put on a show' },
          { type: 'task_update', id: '002', title: 'Performing acrobatics...', status: 'complete', details: '- Jumped atop ropes\n- Juggled bowling pins\n- Rode a single wheel too' },
          { type: 'markdown_text', text: 'The crowd appears to be astounded and applauds :popcorn:' },
        ],
        blocks: [feedbackBlock],
      });
    }
    --- end commented out flow --- */
    else {
      await setStatus({
        status: 'thinking...',
        loading_messages: [
          'Teaching the hamsters to type faster…',
          'Untangling the internet cables…',
          'Consulting the office goldfish…',
        ],
      });

      const streamer = client.chatStream({
        channel,
        recipient_team_id: teamId,
        recipient_user_id: userId,
        thread_ts,
        task_display_mode: 'plan',
      });

      const tools = await getSlackTools();
      const prompts = [{ role: 'user', content: message.text }];
      await callLLM(streamer, prompts, { tools, systemPrompt: SYSTEM_PROMPT });
      await streamer.stop({ blocks: [feedbackBlock] });
    }
  } catch (e) {
    logger.error(`Failed to handle a user message event: ${e}`);
    await say(`:warning: Something went wrong! (${e})`);
  }
};

async function handleGithubAccessRequest({ client, channel, thread_ts, userId, teamId, setStatus }) {
  await setStatus({ status: "Looking up James's profile..." });
  await sleep(800);
  await setStatus({ status: 'Checking team membership...' });
  await sleep(800);
  await setStatus({ status: 'Identifying required repo permissions...' });
  await sleep(800);

  const streamer = client.chatStream({
    channel,
    recipient_team_id: teamId,
    recipient_user_id: userId,
    thread_ts,
    task_display_mode: 'plan',
  });

  await streamer.append({
    chunks: [
      { type: 'plan_update', title: 'Processing GitHub access request...' },
      { type: 'task_update', id: 'verify', title: 'Verify identity', status: 'in_progress' },
      { type: 'task_update', id: 'grant', title: 'Grant repo access', status: 'pending' },
    ],
  });

  await sleep(1200);

  await streamer.append({
    chunks: [
      { type: 'task_update', id: 'verify', title: 'Verify identity', status: 'complete', output: 'Identity confirmed via SSO' },
      { type: 'task_update', id: 'grant', title: 'Grant repo access', status: 'in_progress' },
    ],
  });

  await sleep(800);

  await streamer.stop({
    chunks: [
      { type: 'task_update', id: 'grant', title: 'Grant repo access', status: 'complete', output: 'Ready for confirmation' },
      { type: 'markdown_text', text: "I've prepared your access request. Please review and confirm below." },
    ],
  });

  await client.chat.postMessage({
    channel,
    thread_ts,
    text: 'GitHub Access Request',
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📂 GitHub Access Request' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '*Org:*\n`pronto`' },
          { type: 'mrkdwn', text: '*Role:*\nWrite' },
          { type: 'mrkdwn', text: '*Team:*\n`@platform-eng`' },
          { type: 'mrkdwn', text: '*Justification:*\nStandard access for new platform engineers' },
        ],
      },
      { type: 'divider' },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Confirm' },
            style: 'primary',
            action_id: 'confirm_github_access',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '✏️ Adjust' },
            action_id: 'adjust_github_access',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ Cancel' },
            action_id: 'cancel_github_access',
          },
        ],
      },
    ],
  });
}
