import { VoteType } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  authorId: string;
  currentVote: VoteType | null;
  createdAt: Date;
  content: string;
};
