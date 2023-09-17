import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "next-auth";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}
export const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  console.log(user);

  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="profile pic" src={user?.image} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
