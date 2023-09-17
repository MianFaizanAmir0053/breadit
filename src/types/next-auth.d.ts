import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: userId;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userId;
      username?: string | null;
    };
  }
}
