import { appMentionCallback } from './app_mention.js';
import { vpnMessageCallback } from './channel_message.js';

export const register = (app) => {
  app.event('app_mention', appMentionCallback);
  app.message(/vpn/i, vpnMessageCallback);
};
