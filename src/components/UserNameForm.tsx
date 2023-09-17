"use client";

import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const UserNameForm = () => {
  const router = useRouter();
  const { LoginToast } = useCustomToasts();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = { name };
      const data = await axios.patch(`/api/settings/username`, payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return LoginToast();
      }
      if (error instanceof AxiosError && error.response?.status === 409) {
        return toast({
          title: "Username already taken",
          description: "Please try again with a different username",
          variant: "destructive",
        });
      }
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Username changed successfully",
        variant: "default",
      });
    },
  });
  return (
    <form
      onSubmit={handleSubmit(({ name }) => {
        mutate({ name });
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>
            Please enter a username you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-zinc-400 text-sm">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className=" max-w-[400px] pl-6"
              size={32}
              {...register("name")}
            />
            {errors.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;
