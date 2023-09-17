import CloseModal from "@/components/CloseModal";
import SignUp from "@/components/SignUp";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-lg: mx-auto ">
        <div className="relative w-full h-fit py-20 px-2 rounded-lg bg-white">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
