import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex text-center flex-col space-y-2">
        <Icons.logo className="w-6 h-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Join Breadit</h1>
        <p className="text-sm max-w-xs">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        {/* sign In form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          Already a Breadit user?
          <Link
            href="/sign-in"
            className=" hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
