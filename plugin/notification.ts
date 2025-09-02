import type { Plugin } from '@opencode-ai/plugin';

export const NotificationPlugin: Plugin = async ({ $, worktree }) => {
  const gitIndex = worktree.split('/').indexOf('.git');
  const repositoryName = worktree.split('/').at(gitIndex - 1);

  return {
    event: async ({ event }) => {
      if (event.type === 'session.idle') {
        const notification = `opencode agent completed their task in repository ${repositoryName}`;
        await $`notify-send "${notification}"`;
      }
    },
  };
};
