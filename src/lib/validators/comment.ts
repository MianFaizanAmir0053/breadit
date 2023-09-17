import { z } from "zod";

export const commentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().nullish().optional(),
});

export type commentRequest = z.infer<typeof commentValidator>;
