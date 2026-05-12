import { appMentionCallback } from './app_mention.js';
import { channelBlockCallback } from './channel_message.js';

/**
 * @param {import("@slack/bolt").App} app
 */
export const register = (app) => {
  app.event('app_mention', appMentionCallback);
  app.message("block", channelBlockCallback);
};
