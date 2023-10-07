import { z } from "zod";

export const deleteCommentValidator = z.object({
  commentId: z.string(),
  postId: z.string(),
});

export type deleteCommentRequest = z.infer<typeof deleteCommentValidator>;
