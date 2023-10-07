"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { deletePostRequest } from "@/lib/validators/deletePost";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DeleteIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { deleteSubredditRequest } from "@/lib/validators/deleteSubreddit";
import { useEffect, useState } from "react";

interface DeleteSubredditProps {
  subredditId: string;
}

const DeleteSubreddit = ({ subredditId }: DeleteSubredditProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { LoginToast } = useCustomToasts();
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname.split("/").length);

  const { mutate: deleteFn, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: deleteSubredditRequest = {
        subredditId,
      };
      await axios.patch(`/api/subreddit/delete`, payload);
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
      router.push("/");
      toast({
        title: "Deleted your subreddit successfully",
        variant: "default",
      });
    },
  });

  return pathname.split("/").length <= 4 && isClient ? (
    <AlertDialog>
      <AlertDialogTrigger>
        <div>
          <Button className="font-semibold w-full">Delete Community</Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black text-white ">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete your
            comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteFn()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <div className="hidden"></div>
  );
};

export default DeleteSubreddit;
