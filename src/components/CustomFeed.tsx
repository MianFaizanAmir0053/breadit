import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";
import { MAX_NUMBER_POSTS_TO_GET } from "@/lib/postsToFetch";

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  // console.log(followedCommunities, "followedCommunities");

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        id: {
          in: followedCommunities?.map((d) => d.subredditId),
        },
      },
    },
    include: {
      author: true,
      comments: true,
      subreddit: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: MAX_NUMBER_POSTS_TO_GET,
  });

  // console.log(posts, "post");

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
