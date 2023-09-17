import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToasts = () => {
  const LoginToast = () => {
    const { dismiss } = toast({
      title: "User not authorized",
      description: "You must be logged in to perform this action",
      variant: "destructive",
      action: (
        <Link
          href={`/sign-in`}
          onClick={() => dismiss()}
          className={buttonVariants({
            variant: "outline",
            className: "w-1/3",
          })}
        >
          Sign In
        </Link>
      ),
    });
  };

  return { LoginToast };
};
