export const createPrActionCallback = async ({ ack, body, client, logger }) => {
  try {
    await ack();

    const channel_id = body.channel?.id;
    const user_id = body.user.id;
    if (!channel_id) return;

    await client.chat.postEphemeral({
      channel: channel_id,
      user: user_id,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ':warning: It looks like you tried to take a GitHub action, but the GitHub app isn\'t installed in this workspace. Would you like to install it?',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Install GitHub App' },
              url: 'https://e0b2pu2fv2b-rfwhzlxg.slack.com/marketplace/A01BP7R4KNY-github',
              action_id: 'install_github_action',
              style: 'primary',
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Not Now' },
              action_id: 'dismiss_action',
            },
          ],
        },
      ],
      text: 'GitHub app is not installed in this workspace.',
    });
  } catch (error) {
    logger.error(`:warning: Something went wrong! ${error}`);
  }
};
