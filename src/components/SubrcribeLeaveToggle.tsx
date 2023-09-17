"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { FC, startTransition } from "react";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubrcribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubrcribeLeaveToggle: FC<SubrcribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const { LoginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
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
        router.refresh();
      });
      toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subredditName}`,
        variant: "default",
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
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
        router.refresh();
      });
      toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed from r/${subredditName}`,
        variant: "default",
      });
    },
  });
  return isSubscribed ? (
    <Button
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
      className="w-full mt-1 mb-4"
    >
      Leave the community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  );
};

export default SubrcribeLeaveToggle;
