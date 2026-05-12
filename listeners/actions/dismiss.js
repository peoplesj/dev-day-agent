export const dismissActionCallback = async ({ ack, respond }) => {
  await ack();
  await respond({ delete_original: true });
};
