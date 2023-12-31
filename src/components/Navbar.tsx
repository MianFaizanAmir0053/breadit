import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { Icons } from "./Icons";
import SearchBar from "./SearchBar";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/Button";
import { cn } from "@/lib/utils";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed top-0 inset-x-0 bg-zinc-100 border-zinc-100 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2 ">
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Breadit
          </p>
        </Link>
        <SearchBar />
        {session ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <Link
            href="/sign-in"
            className={cn(buttonVariants(), "whitespace-nowrap h-[2.699rem]")}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
