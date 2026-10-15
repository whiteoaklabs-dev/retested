// Populated daily by the Release Feed agent. Sample entry is a structural placeholder, not news.
export type Release = { slug: string; title: string; date: string; source: string; affects: string[]; summary: string; retestQueued: boolean; sponsored?: boolean };
export const releases: Release[] = [
  { slug: 'feed-placeholder', title: 'Release feed goes live soon', date: '2026-10-15', source: 'https://retested.ai/releases/', affects: [], summary: 'This feed will track new AI tools and model updates, tagged with the use cases they change. Each tagged use case is queued for a re-test.', retestQueued: false },
];
