import CommentsSection from "@/components/CommentsSection";
import DeleteButton from "@/components/DeleteButton";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params: { postId } }: PageProps) => {
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;
  const session = await getAuthSession();

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: { id: postId },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!cachedPost && !post) {
    return notFound();
  }
  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-ignore */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: { id: postId },
                include: { votes: true },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 relative flex-1 bg-white p-4 rounded-sm w-full">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          {(post?.authorId ?? cachedPost.authorId) === session?.user.id && (
            <DeleteButton
              postId={post?.id ?? cachedPost.id}
              authorId={post?.authorId ?? cachedPost.authorId}
            />
          )}
          <h1 className="text-xl font-semibold leading-6 text-gray-900 py-2">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-900" />
            }
          >
            {/* @ts-ignore */}
            <CommentsSection postId={postId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 to-zinc-700" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 to-zinc-700" />
      </div>
    </div>
  );
}

export default page;
