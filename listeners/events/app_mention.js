import { callLLM } from '../../agent/llm-caller.js';
import { getSlackTools } from '../../agent/tools/slack-mcp-tools.js';
import { feedbackBlock } from '../views/feedback_block.js';

const SYSTEM_PROMPT = `You are an IT support agent for Acme Corp, embedded in Slack. You help employees by reading relevant Slack channels and threads to find answers.

When a user asks a question about what's happening in Slack channels or needs information from conversations:
1. Use slack_search_channels to find relevant channels if you don't know the channel ID
2. Use slack_search_public to find relevant messages matching their question
3. Use slack_read_channel to read the most recent messages from a channel (limit to 10 messages max)
4. Use slack_read_thread to dive into specific threads for more detail

When reading channels, always request at most 10 messages. Keep searches focused and concise.
Always cite which channel and who said what. Format responses with markdown.
Be helpful, concise, and reference specific messages you found.`;

/**
 * Handles the event when the app is mentioned in a Slack conversation
 * and generates an AI response.
 *
 * @param {Object} params
 * @param {import("@slack/types").AppMentionEvent} params.event - The app mention event.
 * @param {import("@slack/web-api").WebClient} params.client - Slack web client.
 * @param {import("@slack/logger").Logger} params.logger - Logger instance.
 * @param {import("@slack/bolt").SayFn} params.say - Function to send messages.
 *
 * @see {@link https://docs.slack.dev/reference/events/app_mention/}
 */
export const appMentionCallback = async ({ event, client, logger, say }) => {
  try {
    const { channel, text, team, user } = event;
    const thread_ts = event.thread_ts || event.ts;

    if (text.toLowerCase().includes('block') || text.toLowerCase().includes('blocks')) {
      await client.chat.postMessage({
        channel,
        text: 'Pronto Q2 Sprint Status',
        blocks: [
          {
            type: 'card',
            icon: {
              type: 'image',
              image_url: 'https://picsum.photos/36/36',
              alt_text: 'Pronto icon',
            },
            title: {
              type: 'mrkdwn',
              text: '🚀 Pronto Deploy Pipeline — Cleared',
              verbatim: false,
            },
            subtitle: {
              type: 'mrkdwn',
              text: 'Platform Engineering · Deploy #1284',
              verbatim: false,
            },
            body: {
              type: 'mrkdwn',
              text: 'All checks passed. Production rollout to `us-west-2` complete — 0 errors in the last 5 min 🟢',
              verbatim: false,
            },
            actions: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Logs',
                  emoji: false,
                },
                style: 'primary',
                action_id: 'view_deploy_logs_1284',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Rollback',
                  emoji: false,
                },
                action_id: 'rollback_deploy_1284',
              },
            ],
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Triggered by Jeremiah · 3 min ago · <https://pronto.com/deploys/1284|View in Dashboard>',
              },
            ],
          },
          {
            type: 'markdown',
            text: '## Q2 Sprint Status\n\n| Task | Owner | Status |\n|---|---|---|\n| **Access Request Flow** | Jeremiah | ~~Done~~ _Shipped_ |\n| `IT Policy Agent` | Platform Team | **In Progress** |\n| [Slack Integration](https://github.com/pronto-corp/infra-access-bot/pull/47) | DevXP | _In Review_ |',
          },
        ],
      });
      return;
    }

    if (text.toLowerCase().includes('merge')) {
      await client.chat.postEphemeral({
        channel,
        user,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "It looks like you're trying to merge a PR. Which action would you like to take?",
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Create a PR' },
                action_id: 'create_pr_action',
                style: 'primary',
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View Session' },
                action_id: 'view_session_action',
              },
            ],
          },
        ],
        text: "It looks like you're trying to merge a PR.",
      });
      return;
    }

    await client.assistant.threads.setStatus({
      channel_id: channel,
      thread_ts: thread_ts,
      status: 'thinking...',
      loading_messages: [
        'Teaching the hamsters to type faster…',
        'Untangling the internet cables…',
        'Consulting the office goldfish…',
        'Polishing up the response just for you…',
        'Convincing the AI to stop overthinking…',
      ],
    });

    const streamer = client.chatStream({
      channel: channel,
      recipient_team_id: team,
      recipient_user_id: user,
      thread_ts: thread_ts,
      task_display_mode: 'plan',
    });

    const tools = await getSlackTools();
    const prompts = [
      {
        role: 'user',
        content: text,
      },
    ];

    await callLLM(streamer, prompts, { tools, systemPrompt: SYSTEM_PROMPT });

    await streamer.stop({ blocks: [feedbackBlock] });
  } catch (e) {
    logger.error(`Failed to handle a user message event: ${e}`);
    await say(`:warning: Something went wrong! (${e})`);
  }
};
