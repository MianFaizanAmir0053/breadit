"use client";

import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { commentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, startTransition, useState } from "react";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";

interface CreateCommentProps {
  replyToId?: string;
  postId: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>("");
  const { LoginToast } = useCustomToasts();
  const router = useRouter();

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
      startTransition(() => {
        setInput("");
        router.refresh();
      });
      toast({
        title: "Posted your comment successfully",
        variant: "default",
      });
    },
  });

  return (
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
        <div className="flex justify-end mt-2">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => commentFuntion({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
