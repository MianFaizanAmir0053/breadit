import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { format } from "date-fns";
import SubrcribeLeaveToggle from "@/components/SubrcribeLeaveToggle";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";
import DeleteSubreddit from "@/components/DeleteSubreddit";

const Layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
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
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user?.id
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;
  if (!subreddit) notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="md:container max-w-7xl mx-auto h-full md:pt-[0rem]">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          <div className=" md:block h-fit overflow-hidden rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{subreddit.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 py-4 px-6 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toString()}>
                    {format(subreddit.createdAt, "MMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Member</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className="flex gap-y-4 flex-col py-3 whitespace-nowrap">
                  <p className="text-gray-500">You created this community</p>
                  {/* <Button className="w-full">Delete community</Button> */}
                  <DeleteSubreddit subredditId={subreddit.id} />
                </div>
              ) : (
                <SubrcribeLeaveToggle
                  subredditId={subreddit.id}
                  isSubscribed={isSubscribed}
                  subredditName={subreddit.name}
                />
              )}
              {isSubscribed && (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full mb-6",
                  })}
                  href={`/r/${slug}/submit`}
                >
                  Create Post
                </Link>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
