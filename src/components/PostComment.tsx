"use client";

import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { formatTimeToNow } from "@/lib/utils";
import { commentRequest } from "@/lib/validators/comment";
import { Comment, CommentVote, User, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MessageSquare } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { FC, useRef, useState } from "react";
import CommentVotes from "./CommentVotes";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";

type ExtendComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendComment;
  initialUserVote: VoteType | undefined | null;
  initialVotesAmt: number;
  session: Session | null;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  initialVotesAmt,
  initialUserVote,
  session,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { LoginToast } = useCustomToasts();

  const { mutate: commentFuntion, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: commentRequest) => {
      const payload: commentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return LoginToast();
      }
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setInput("");
      setIsReplying(false);
      router.refresh();
      toast({
        title: "Posted your reply successfully",
        variant: "default",
      });
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/${comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 flex-wrap items-center">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmt={initialVotesAmt}
          initialUserVote={initialUserVote}
        />
        <Button
          onClick={() => {
            if (!session?.user) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant={"ghost"}
          size={"xs"}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
        {isReplying ? (
          <div className="grid gap-1.5 w-full">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
              <div className="flex justify-end mt-2 gap-2">
                <Button
                  tabIndex={-1}
                  variant={"subtle"}
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() =>
                    commentFuntion({
                      postId: comment.postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    })
                  }
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PostComment;
