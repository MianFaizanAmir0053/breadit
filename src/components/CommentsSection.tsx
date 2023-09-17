import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import CreateComment from "./CreateComment";
import PostComment from "./PostComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();
  const topLevelComments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-6 pt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 mt-4">
        {topLevelComments
          .filter((topLevelComment) => !topLevelComment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );
            return (
              <div className="flex flex-col" key={topLevelComment.id}>
                <div className="mb-2">
                  {/* Comment Loading Section */}
                  <PostComment
                    comment={topLevelComment}
                    session={session}
                    initialUserVote={topLevelCommentVote?.type}
                    initialVotesAmt={topLevelCommentVotesAmt}
                  />
                </div>

                {/* Replies Loading Section */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => session?.user.id === vote.userId
                    );

                    return (
                      <div
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                        key={reply.id}
                      >
                        <PostComment
                          comment={reply}
                          initialUserVote={replyVote?.type}
                          initialVotesAmt={replyVotesAmt}
                          session={session}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
