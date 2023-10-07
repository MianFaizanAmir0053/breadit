"use client";

import { MAX_NUMBER_POSTS_TO_GET } from "@/lib/postsToFetch";
import { ExtendPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";
interface PostFeedProps {
  initialPosts: ExtendPost[];
  subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const { data: session } = useSession();

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data, fetchNextPage, isFetching } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${MAX_NUMBER_POSTS_TO_GET}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendPost[];
    },
    {
      getNextPageParam(_, pages) {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((post) => post) ?? initialPosts;
  return (
    <>
      <ul className="flex flex-col col-span-2 space-y-6">
        {posts.length > 0
          ? posts.map((post, index) => {
              const voteAmt = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;

                return acc;
              }, 0);
              const currentVote = post.votes.find(
                (vote) => vote.userId === session?.user.id
              );

              if (index === posts.length - 2) {
                return (
                  <li ref={ref} key={post.id}>
                    <Post
                      key={post.id}
                      votesAmt={voteAmt}
                      currentVote={currentVote}
                      post={post}
                      commentAmt={post.comments.length}
                      subredditName={post.subreddit.name}
                    />
                  </li>
                );
              } else {
                return (
                  <Post
                    votesAmt={voteAmt}
                    key={post.id}
                    currentVote={currentVote}
                    post={post}
                    commentAmt={post.comments.length}
                    subredditName={post.subreddit.name}
                  />
                );
              }
            })
          : !isFetching && (
              <div className="rounded-md p-4 bg-white shadow">
                <h1 className="font-semibold">No posts found</h1>
                {subredditName ? (
                  <p className="text-sm text-gray-500">
                    Be the first to post in r/{subredditName}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Only posts from the subreddit you are currently following
                    will be shown.
                  </p>
                )}
              </div>
            )}
        {isFetching && (
          <div className="flex items-center justify-center space-x-2">
            <p>Loading new posts</p>
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </ul>
    </>
  );
};

export default PostFeed;
