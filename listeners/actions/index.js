import { feedbackActionCallback } from './feedback.js';
import { createPrActionCallback } from './create_pr.js';
import { viewSessionActionCallback } from './view_session.js';
import { dismissActionCallback } from './dismiss.js';
import { accessRequestCallback } from './access_request.js';

/**
 * @param {import("@slack/bolt").App} app
 */
export const register = (app) => {
  app.action('feedback', feedbackActionCallback);
  app.action('create_pr_action', createPrActionCallback);
  app.action('view_session_action', viewSessionActionCallback);
  app.action('dismiss_action', dismissActionCallback);
  app.action('install_github_action', async ({ ack }) => { await ack(); });
  app.action(/^access_/, accessRequestCallback);
};
