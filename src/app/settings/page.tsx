import UserNameForm from "@/components/UserNameForm";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Manage your account and website settings",
};

const page = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("sign-in");
  }
  return (
    <div className="max-w-4xl py-12 mx-auto">
      <div className="pb-4">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm />
      </div>
    </div>
  );
};

export default page;
