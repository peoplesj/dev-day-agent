/**
 * Handles access request button clicks (all access_* action_ids).
 * Replaces the buttons with a confirmation of the selected option.
 */
export const accessRequestCallback = async ({ ack, body, client }) => {
  await ack();

  const selectedText = body.actions[0].text.text;
  const originalBlocks = body.message.blocks;

  // Find the original section block (the question text)
  const sectionBlock = originalBlocks.find((block) => block.type === 'section');

  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    blocks: [
      sectionBlock,
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `✅ Selected: ${selectedText}`,
          },
        ],
      },
    ],
    text: sectionBlock.text.text,
  });
};
