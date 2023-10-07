import { z } from "zod";

export const deleteSubredditValidator = z.object({
  subredditId: z.string(),
});

export type deleteSubredditRequest = z.infer<typeof deleteSubredditValidator>;
