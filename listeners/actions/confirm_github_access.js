const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const confirmGithubAccessCallback = async ({ ack, body, client, context }) => {
  await ack();

  const channel = body.channel.id;
  const thread_ts = body.message.thread_ts || body.message.ts;
  const userId = body.user.id;
  const teamId = context.teamId;

  await client.chat.update({
    channel,
    ts: body.message.ts,
    text: 'GitHub Access Request — Confirmed',
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📂 GitHub Access Request' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '*Org:*\n`acme-corp`' },
          { type: 'mrkdwn', text: '*Role:*\nWrite' },
          { type: 'mrkdwn', text: '*Team:*\n`@platform-eng`' },
          { type: 'mrkdwn', text: '*Justification:*\nStandard access for new platform engineers' },
        ],
      },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `✅ Confirmed by <@${userId}>` }],
      },
    ],
  });

  const streamer = client.chatStream({
    channel,
    recipient_team_id: teamId,
    recipient_user_id: userId,
    thread_ts,
    task_display_mode: 'plan',
  });

  await streamer.append({
    chunks: [
      { type: 'plan_update', title: 'Provisioning access...' },
      { type: 'markdown_text', text: '⚙️ Calling `github.addTeamMember`...' },
    ],
  });

  await sleep(600);

  await streamer.append({
    chunks: [
      { type: 'markdown_text', text: ' ✓\n⚙️ Calling `github.grantRepoAccess`...' },
    ],
  });

  await sleep(600);

  await streamer.stop({
    chunks: [
      { type: 'markdown_text', text: ' ✓\n\n✅ **Access granted.** You can now access the GitHub `acme-corp` org.\n\nTry:\n```\ngit clone git@github.com:peoplesj/infra-access-bot.git\n```' },
    ],
  });
};
