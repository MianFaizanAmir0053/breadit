"use client";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PostVotesRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/Button";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialUserVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialUserVote,
}) => {
  const { LoginToast } = useCustomToasts();
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialUserVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: voteFunction } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVotesRequest = {
        postId,
        voteType,
      };
      await axios.patch("/api/subreddit/post/vote", payload);
    },

    onError: (err, voteType) => {
      // something fishy
      if (voteType === "UP") {
        setVotesAmt((prev) => prev - 1);
      } else {
        setVotesAmt((prev) => prev + 1);
      }
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.status === 401) {
          return LoginToast();
        } else {
          return toast({
            title: "Something went wrong",
            description:
              "Your vote was not registered, please try again later.",
            variant: "destructive",
          });
        }
      }
    },
    onMutate: (type: VoteType) => {
      if (type === currentVote) {
        setCurrentVote(undefined);
        if (type === "UP") {
          setVotesAmt((prev) => prev - 1);
        } else if (type === "DOWN") {
          setVotesAmt((prev) => prev + 1);
        }
      } else {
        setCurrentVote(type);
        if (type === "UP") {
          setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        } else if (type === "DOWN") {
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
  });

  useEffect(() => {
    setCurrentVote(initialUserVote);
  }, [initialUserVote]);

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        onClick={() => voteFunction("UP")}
        size={"sm"}
        variant={"ghost"}
        aria-label="up-vote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      <Button
        onClick={() => voteFunction("DOWN")}
        size={"sm"}
        variant={"ghost"}
        aria-label="down-vote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
