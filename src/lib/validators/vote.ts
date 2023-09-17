import { z } from "zod";

export const PostVotesVaidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type PostVotesRequest = z.infer<typeof PostVotesVaidator>;

export const CommentVotesVaidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type CommentVotesRequest = z.infer<typeof CommentVotesVaidator>;
