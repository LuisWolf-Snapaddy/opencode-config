import type { Plugin } from '@opencode-ai/plugin';

export const NotificationPlugin: Plugin = async ({ app, client, $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === 'session.idle') {
        await $`notify-send "opencode agent completed their task"`;
      }
    },
  };
};
