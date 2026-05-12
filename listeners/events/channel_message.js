/**
 * Listens for messages in #peoples-blocks containing the word "block"
 * and replies with a Pronto-themed Block Kit card.
 */
export const channelBlockCallback = async ({ event, client, logger, say }) => {
  try {
    if (event.subtype || !event.text) return;
    if (!event.text.toLowerCase().includes('block')) return;

    const { channel, ts } = event;

    await client.chat.postMessage({
      channel,
      thread_ts: ts,
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
  } catch (e) {
    logger.error(`Failed to handle channel block message: ${e}`);
  }
};
