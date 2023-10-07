import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { Button } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MAX_NUMBER_POSTS_TO_GET } from "@/lib/postsToFetch";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          subreddit: true,
          comments: true,
          votes: true,
        },
        take: MAX_NUMBER_POSTS_TO_GET,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!subreddit) notFound();

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="font-bold text-3xl md:text-4xl  h-1/4">
          <h1> r/{subreddit.name}</h1>
        </div>
      </div>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default Page;
