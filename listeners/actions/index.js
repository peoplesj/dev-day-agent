import { feedbackActionCallback } from './feedback.js';
import { createPrActionCallback } from './create_pr.js';
import { viewSessionActionCallback } from './view_session.js';
import { dismissActionCallback } from './dismiss.js';
import { confirmGithubAccessCallback } from './confirm_github_access.js';

/**
 * @param {import("@slack/bolt").App} app
 */
export const register = (app) => {
  app.action('feedback', feedbackActionCallback);
  app.action('create_pr_action', createPrActionCallback);
  app.action('view_session_action', viewSessionActionCallback);
  app.action('dismiss_action', dismissActionCallback);
  app.action('install_github_action', async ({ ack }) => { await ack(); });
  app.action('confirm_github_access', confirmGithubAccessCallback);
  app.action('adjust_github_access', async ({ ack }) => { await ack(); });
  app.action('cancel_github_access', async ({ ack }) => { await ack(); });
  app.action('create_vpn_ticket', async ({ ack }) => { await ack(); });
  app.action('escalate_vpn', async ({ ack }) => { await ack(); });
  app.action('vpn_this_worked', async ({ ack }) => { await ack(); });
  app.action('vpn_open_ticket', async ({ ack }) => { await ack(); });
};
