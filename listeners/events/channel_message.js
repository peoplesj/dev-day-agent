const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function vpnMessageCallback({ message, client, context }) {
  const channel = message.channel;
  const ts = message.ts;
  const team = context.teamId;
  const user = message.user;

  const streamer = client.chatStream({
    channel,
    thread_ts: ts,
    recipient_team_id: team,
    recipient_user_id: user,
  });

  await streamer.append({
    chunks: [
      { type: 'markdown_text', text: '🌐 **VPN keeps dropping? You\'re not alone.**\n\nI dug through `#help-it` and found this is a known issue affecting the team this week.\n\n' },
    ],
  });

  await sleep(1500);

  await streamer.append({
    chunks: [
      { type: 'markdown_text', text: '### What\'s happening\n\n> "Confirmed — the Cisco AnyConnect cache corruption is back. We rolled out a fix in v4.10.08 but anyone still on v4.10.07 is hitting the 10-minute disconnect loop."\n> — Maya Chen, `#help-it`, May 12\n\n**You\'re hitting this if:** you installed AnyConnect before May 9, and your sessions drop every 8–12 minutes.\n\n' },
    ],
  });

  await sleep(2000);

  await streamer.append({
    chunks: [
      { type: 'markdown_text', text: '### The 60-second fix\n\n1. **Quit AnyConnect completely** — ⌘+Q (don\'t just close the window)\n2. **Clear the cache:**\n```\nsudo rm -rf ~/Library/Application\\ Support/Cisco\n```\n3. **Reinstall from Self Service** — search "Cisco AnyConnect" and pick v4.10.08 or later\n4. **Reconnect** to `vpn.pronto.corp`\n\n' },
    ],
  });

  await sleep(1800);

  await streamer.append({
    chunks: [
      { type: 'markdown_text', text: '### Incident timeline\n\n| When it started | Affected version | Status |\n|---|---|---|\n| Mon May 12, 9 AM | AnyConnect v4.10.07 | 🔴 Active |\n| Tue May 13, 2 PM | AnyConnect v4.10.08+ | 🟢 Fixed |\n| Previous incident | v4.9.x (March 2026) | 🟢 Resolved |\n\n' },
    ],
  });

  await sleep(1500);

  await streamer.append({
    chunks: [
      { type: 'markdown_text', text: '### If the fix doesn\'t work\n\n- **SSO token issue** → run `kinit` and try again\n- **Still dropping after reinstall** → it might be your DNS, check the IT Runbook\n- **Working from a coffee shop or hotel?** → captive portals break the tunnel, try a hotspot\n\n' },
    ],
  });

  await sleep(1200);

  await streamer.stop({
    chunks: [
      { type: 'markdown_text', text: '📎 *Sources:* `#help-it` May 12 incident thread · IT Runbook (pinned) · 5 related threads this week' },
    ],
  });
}
