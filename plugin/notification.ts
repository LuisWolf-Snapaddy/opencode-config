import type { Plugin } from '@opencode-ai/plugin';

export const NotificationPlugin: Plugin = async ({ client, $, worktree }) => {
  // Extract repository name from worktree path
  const gitIndex = worktree.split('/').indexOf('.git');
  const repositoryName = worktree.split('/').at(gitIndex - 1);

  // Cache for notification ids
  const notificationIds = new Map<string, string>();

  return {
    event: async ({ event }) => {
      if (event.type === 'session.idle') {
        // Build the notification command
        const command = ['notify-send', '--app-name=opencode.ai', '--print-id'];

        // Replace existing notification
        const existingNotificationId = notificationIds.get(
          event.properties.sessionID
        );
        if (existingNotificationId) {
          command.push(`--replace-id=${existingNotificationId}`);
        }

        // Get session title
        const response = await client.session.get({
          path: { id: event.properties.sessionID },
        });
        command.push(response.data?.title ?? 'Unknown session');

        // Build notification body
        const body = ['Your agent completed their work'];
        if (repositoryName) {
          // Get repository name
          body.push(`in repository "${repositoryName}"`);
        }
        command.push(body.join(' '));

        // Display notification
        const result = await $`${command}`;

        // Safe notification id to replace this notification the next time
        const notificationId = result.text().trim();
        notificationIds.set(event.properties.sessionID, notificationId);
      }
    },
  };
};
