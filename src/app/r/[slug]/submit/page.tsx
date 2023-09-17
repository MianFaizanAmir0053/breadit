import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  });

  if (!subreddit) notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-500 pb-5">
        <div className="flex flex-wrap items-baseline -ml-2 -mt-2">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className=" ml-2 mt-1 text-sm text-gray-500 truncate">
            in r/{slug}
          </p>
        </div>
      </div>
      {/* form */}
      <Editor subredditId={subreddit.id} />
      <div className="flex justify-end w-full">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
