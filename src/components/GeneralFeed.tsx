import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { MAX_NUMBER_POSTS_TO_GET } from "@/lib/postsToFetch";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: MAX_NUMBER_POSTS_TO_GET,
    include: {
      author: true,
      comments: true,
      subreddit: true,
      votes: true,
    },
  });
  posts.map((p) => {});
  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
