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
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { deleteCommentRequest } from "@/lib/validators/deleteComments";

interface DeleteComProps {
  postId: string;
  commentId: string;
  authorId: string;
}

const DeleteCom = ({ postId, commentId }: DeleteComProps) => {
  const { LoginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: deleteFn, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: deleteCommentRequest = {
        commentId,
        postId,
      };
      await axios.delete(`/api/subreddit/post/comment/delete`, {
        params: payload,
      });
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
      router.refresh();
      toast({
        title: "Deleted successfully",
        variant: "default",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <DeleteIcon className="absolute w-8 h-8 text-black hover:text-white right-0 top-[50%] transform translate-y-[-50%] hover:bg-red-700 p-1 rounded transition-all" />
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
  );
};

export default DeleteCom;
