import { z } from "zod";

export const deletePostValidator = z.object({
  postId: z.string(),
  authorId: z.string(),
});

export type deletePostRequest = z.infer<typeof deletePostValidator>;
